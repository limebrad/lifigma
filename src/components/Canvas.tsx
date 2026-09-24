/**
 * src/components/Canvas.tsx — холст на весь экран.
 * Рисует сетку (мелкая + крупная + мировые оси), обрабатывает мышь
 * и рендерит фигуры.
 *   - инструмент «select»: клик по фигуре выделяет её (рамка и маркеры рисует
 *     ShapeView), перетаскивание выделенной фигуры перемещает её, клик по
 *     пустому месту снимает выделение; панорама — пробел или средняя кнопка,
 *     зум — колесо (вся «камера» вынесена в useViewport);
 *   - инструменты «rectangle»/«ellipse»: создание фигуры перетаскиванием.
 * Хит-тест под курсором считается через findTopShapeAt из geometry.ts.
 * Экранные координаты курсора переводятся в мировые через screenToCanvas,
 * поэтому и хит-тест, и перетаскивание одинаково работают при любом зуме и панораме.
 */
import { useRef, useState } from 'react'
import type { PointerEvent as ReactPointerEvent } from 'react'
import { useViewport } from '../hooks/useViewport'
import type { DragOriginal } from '../hooks/useShapes'
import type { DraftShape, Point, Shape, ShapeType, Tool } from '../types/shape'
import { findTopShapeAt, screenToCanvas } from '../utils/geometry'
import { ShapeView } from './Shape'

export interface CanvasProps {
  shapes: Shape[]
  activeTool: Tool
  selectedIds: string[]
  /** Черновик фигуры, которая рисуется прямо сейчас. */
  draft: DraftShape | null
  /** Выделить фигуру (клик по ней в режиме «select»). */
  selectShape: (id: string) => void
  /** Снять выделение (клик по пустому месту холста). */
  clearSelection: () => void
  beginDraw: (start: Point, type: ShapeType) => void
  updateDraw: (current: Point) => void
  endDraw: () => string | null
  /** Отменить рисование без создания фигуры (например, pointercancel). */
  cancelDraw: () => void
  /** Начать перетаскивание выделенных фигур: старт + их изначальные позиции. */
  beginDrag: (start: Point, originals: DragOriginal[]) => void
  /** Двигать перетаскиваемые фигуры вслед за курсором. */
  updateDrag: (current: Point) => void
  /** Завершить перетаскивание. */
  endDrag: () => void
}

/** Размер ячейки мелкой сетки в мировых единицах. */
const GRID_SIZE = 32
/** Каждая N-я линия — крупная. */
const MAJOR_EVERY = 5

const GRID_MINOR = 'rgba(236, 233, 248, 0.06)'
const GRID_MAJOR = 'rgba(236, 233, 248, 0.13)'
const AXIS_COLOR = 'rgba(124, 108, 255, 0.40)'

export function Canvas({
  shapes,
  activeTool,
  selectedIds,
  draft,
  selectShape,
  clearSelection,
  beginDraw,
  updateDraw,
  endDraw,
  cancelDraw,
  beginDrag,
  updateDrag,
  endDrag,
}: CanvasProps) {
  const {
    containerRef,
    viewport,
    viewportSize,
    spaceDown,
    panning,
    startPanning,
    movePanning,
    stopPanning,
  } = useViewport()

  // Идёт ли рисование прямо сейчас (ref, чтобы pointermove не отставал).
  const drawingRef = useRef(false)
  // Идёт ли перетаскивание выделенной фигуры.
  const draggingRef = useRef(false)
  // State-дубликат перетаскивания — только для курсора (реф не вызывает ре-рендер).
  const [dragging, setDragging] = useState(false)

  const { width, height } = viewportSize
  const zoom = viewport.zoom
  const cell = GRID_SIZE * zoom
  const majorCell = GRID_SIZE * MAJOR_EVERY * zoom

  // Сдвиг рисунка сетки, чтобы её линии совпадали с мировыми координатами.
  const offsetX = viewport.x * zoom - width / 2
  const offsetY = viewport.y * zoom - height / 2
  const gridPosition = `${offsetX}px ${offsetY}px`

  // Экранные позиции мировых осей X = 0 и Y = 0.
  const axisX = width / 2 - viewport.x * zoom
  const axisY = height / 2 - viewport.y * zoom

  const isShapeTool = activeTool === 'rectangle' || activeTool === 'ellipse'

  // Клиентские координаты события -> координаты относительно области холста.
  const toLocal = (clientX: number, clientY: number): Point => {
    const rect = containerRef.current?.getBoundingClientRect()
    return { x: clientX - (rect?.left ?? 0), y: clientY - (rect?.top ?? 0) }
  }

  // Клиентские координаты -> мировые координаты холста.
  const toWorld = (clientX: number, clientY: number): Point =>
    screenToCanvas(toLocal(clientX, clientY), viewport, viewportSize)

  const handlePointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    // Панорама: средняя кнопка либо зажатый пробел (работает в любом инструменте).
    const shouldPan = event.button === 1 || spaceDown
    if (shouldPan) {
      startPanning(event)
      return
    }
    if (event.button !== 0) return

    const world = toWorld(event.clientX, event.clientY)

    // Инструмент «select»: клик по фигуре выделяет и начинает перетаскивание.
    if (activeTool === 'select') {
      const hit = findTopShapeAt(world, shapes)
      if (hit) {
        if (!selectedIds.includes(hit.id)) selectShape(hit.id)
        // Тащим либо всю текущую выборку (кликнули по уже выделенной фигуре),
        // либо только ту фигуру, по которой кликнули.
        const ids = selectedIds.includes(hit.id) ? selectedIds : [hit.id]
        const originals: DragOriginal[] = shapes
          .filter((shape) => ids.includes(shape.id))
          .map(({ id, x, y }) => ({ id, x, y }))
        draggingRef.current = true
        setDragging(true)
        beginDrag(world, originals)
      } else {
        // Пустой клик — снимаем выделение.
        clearSelection()
      }
      event.preventDefault()
      event.currentTarget.setPointerCapture(event.pointerId)
      return
    }

    // Инструменты рисования: создаём фигуру перетаскиванием.
    event.preventDefault()
    drawingRef.current = true
    beginDraw(world, activeTool as ShapeType)
    event.currentTarget.setPointerCapture(event.pointerId)
  }

  const handlePointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    movePanning(event)
    if (drawingRef.current) {
      updateDraw(toWorld(event.clientX, event.clientY))
      return
    }
    if (draggingRef.current) {
      updateDrag(toWorld(event.clientX, event.clientY))
    }
  }

  const handlePointerUp = (event: ReactPointerEvent<HTMLDivElement>) => {
    stopPanning(event)

    if (drawingRef.current) {
      drawingRef.current = false
      endDraw()
    } else if (draggingRef.current) {
      draggingRef.current = false
      setDragging(false)
      endDrag()
    }
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId)
    }
  }

  // Жест прерван системой (pointercancel): рисование отменяем, перемещение завершаем.
  const handlePointerCancel = (event: ReactPointerEvent<HTMLDivElement>) => {
    stopPanning(event)

    if (drawingRef.current) {
      drawingRef.current = false
      cancelDraw()
    } else if (draggingRef.current) {
      draggingRef.current = false
      setDragging(false)
      endDrag()
    }
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId)
    }
  }

  const cursor = panning
    ? 'grabbing'
    : spaceDown
      ? 'grab'
      : isShapeTool
        ? 'crosshair'
        : dragging
          ? 'move'
          : 'default'

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 overflow-hidden select-none"
      style={{ cursor, touchAction: 'none' }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerCancel}
      onContextMenu={(event) => event.preventDefault()}
    >
      {/* Сетка */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: [
            `linear-gradient(to right, ${GRID_MINOR} 1px, transparent 1px)`,
            `linear-gradient(to bottom, ${GRID_MINOR} 1px, transparent 1px)`,
            `linear-gradient(to right, ${GRID_MAJOR} 1px, transparent 1px)`,
            `linear-gradient(to bottom, ${GRID_MAJOR} 1px, transparent 1px)`,
          ].join(', '),
          backgroundPosition: Array(4).fill(gridPosition).join(', '),
          backgroundSize: [
            `${cell}px ${cell}px`,
            `${cell}px ${cell}px`,
            `${majorCell}px ${majorCell}px`,
            `${majorCell}px ${majorCell}px`,
          ].join(', '),
        }}
      />

      {/* Мировые оси (видимы, только когда попадают в экран) */}
      {axisX >= 0 && axisX <= width && (
        <div
          className="pointer-events-none absolute inset-y-0 w-px"
          style={{ left: axisX, backgroundColor: AXIS_COLOR }}
        />
      )}
      {axisY >= 0 && axisY <= height && (
        <div
          className="pointer-events-none absolute inset-x-0 h-px"
          style={{ top: axisY, backgroundColor: AXIS_COLOR }}
        />
      )}

      {/* Фигуры */}
      {shapes.map((shape) => (
        <ShapeView
          key={shape.id}
          shape={shape}
          viewport={viewport}
          viewportSize={viewportSize}
          selected={selectedIds.includes(shape.id)}
        />
      ))}

      {/* Черновик рисуемой фигуры (полупрозрачный, поверх остальных) */}
      {draft && (
        <ShapeView
          key="draft"
          shape={{ ...draft, id: 'draft' }}
          viewport={viewport}
          viewportSize={viewportSize}
          draft
        />
      )}

      {/* HUD: подсказка и текущий зум */}
      <div className="pointer-events-none absolute bottom-3 left-1/2 -translate-x-1/2 rounded-md border border-panel-border bg-panel-2/90 px-2.5 py-1 text-xs text-text-muted">
        {isShapeTool
          ? 'Тяните по холсту, чтобы нарисовать фигуру'
          : 'Клик — выбрать · тащите фигуру — переместить · Пробел + мышь — панорама · колесо — зум'}
      </div>
      <div className="pointer-events-none absolute bottom-3 right-3 rounded-md bg-panel-2/90 px-2 py-1 text-xs tabular-nums text-text-main">
        {Math.round(zoom * 100)}%
      </div>
    </div>
  )
}