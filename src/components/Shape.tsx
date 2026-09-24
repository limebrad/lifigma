/**
 * src/components/Shape.tsx — рендер одной фигуры.
 * Позиционирование уже учитывает камеру (зум + панорама) через
 * canvasToScreen из src/utils/geometry.ts. Для выбранной фигуры дополнительно
 * рисуется рамка выделения и маркеры по углам и серединам сторон (как в Figma).
 *
 * Сама фигура, рамка и маркеры не ловят мышь (pointer-events-none): клики
 * и перетаскивание обрабатывает холст (Canvas) через хит-тест findTopShapeAt
 * из src/utils/geometry.ts, так что клику не мешают рамки соседних фигур.
 */
import type { CSSProperties } from 'react'
import type { Shape as ShapeModel, Size } from '../types/shape'
import { canvasToScreen } from '../utils/geometry'
import type { Viewport } from '../utils/geometry'

export interface ShapeViewProps {
  shape: ShapeModel
  viewport: Viewport
  viewportSize: Size
  selected?: boolean
  /** Черновик рисуемой фигуры: полупрозрачный и без рамки выделения. */
  draft?: boolean
}

/** Размер квадратного маркера выделения в экранных px. */
const HANDLE_SIZE = 6
/** Сдвиг маркера, чтобы его центр совпадал с точкой рамки. */
const HANDLE_OFFSET = -HANDLE_SIZE / 2
/** Цвет рамки и маркеров — акцент проекта. */
const ACCENT = '#7c6cff'

/** База геометрии маркера: все маркеры — квадраты одного размера. */
const HANDLE_BOX: CSSProperties = { width: HANDLE_SIZE, height: HANDLE_SIZE }

/** Маркеры: 4 угла + середины сторон рамки выделения. */
const HANDLES: Array<{ key: string; style: CSSProperties }> = [
  { key: 'nw', style: { ...HANDLE_BOX, left: HANDLE_OFFSET, top: HANDLE_OFFSET } },
  { key: 'n', style: { ...HANDLE_BOX, left: '50%', top: HANDLE_OFFSET, transform: 'translateX(-50%)' } },
  { key: 'ne', style: { ...HANDLE_BOX, right: HANDLE_OFFSET, top: HANDLE_OFFSET } },
  { key: 'e', style: { ...HANDLE_BOX, right: HANDLE_OFFSET, top: '50%', transform: 'translateY(-50%)' } },
  { key: 'se', style: { ...HANDLE_BOX, right: HANDLE_OFFSET, bottom: HANDLE_OFFSET } },
  { key: 's', style: { ...HANDLE_BOX, left: '50%', bottom: HANDLE_OFFSET, transform: 'translateX(-50%)' } },
  { key: 'sw', style: { ...HANDLE_BOX, left: HANDLE_OFFSET, bottom: HANDLE_OFFSET } },
  { key: 'w', style: { ...HANDLE_BOX, left: HANDLE_OFFSET, top: '50%', transform: 'translateY(-50%)' } },
]

/** Радиус скругления: эллипс — полностью скруглён, прямоугольник — 4px. */
function cornerRadius(shape: ShapeModel): string {
  return shape.type === 'ellipse' ? '9999px' : '4px'
}

export function ShapeView({
  shape,
  viewport,
  viewportSize,
  selected = false,
  draft = false,
}: ShapeViewProps) {
  // Левый верхний угол фигуры в экранных координатах.
  const origin = canvasToScreen({ x: shape.x, y: shape.y }, viewport, viewportSize)
  const width = shape.width * viewport.zoom
  const height = shape.height * viewport.zoom
  // У выбранной фигуры контур рисует рамка ниже, поэтому тень здесь не нужна.
  const boxShadow = draft
    ? 'none'
    : selected
      ? 'none'
      : '0 0 0 1px rgba(236, 233, 248, 0.2)'

  return (
    <div
      className="pointer-events-none absolute"
      style={{ left: origin.x, top: origin.y, width, height, opacity: draft ? 0.6 : 1 }}
    >
      <div
        className="h-full w-full"
        style={{
          backgroundColor: shape.fill,
          borderRadius: cornerRadius(shape),
          boxShadow,
        }}
      />

      {/* Рамка выделения + маркеры (только у выбранной фигуры, не у черновика) */}
      {selected && !draft && (
        <>
          {/* Рамка по контуру фигуры */}
          <div
            className="absolute"
            style={{ inset: -1, borderRadius: cornerRadius(shape), border: `1.5px solid ${ACCENT}` }}
          />
          {/* Маркеры по углам и серединам сторон */}
          {HANDLES.map((handle) => (
            <div
              key={handle.key}
              className="absolute bg-white"
              style={{
                ...handle.style,
                border: `1.5px solid ${ACCENT}`,
                borderRadius: 1,
              }}
            />
          ))}
        </>
      )}
    </div>
  )
}