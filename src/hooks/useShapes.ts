/**
 * src/hooks/useShapes.ts — состояние фигур (логика без интерфейса).
 * Список, добавление, изменение, удаление, выделение, рисование новой
 * фигуры перетаскиванием мыши и перетаскивание уже выделенных фигур
 * (черновик и перетаскивание — в мировых координатах).
 * Плюс история изменений (undo/redo): каждый «осознанный» шаг снимает
 * снимок состояния в past, кадры перетаскивания мыши историю не засоряют.
 * Компоненты получают всё через пропсы и не знают, как хранится состояние.
 */
import { useCallback, useEffect, useRef, useState } from 'react'
import type { DraftShape, Point, Shape, ShapeType, Tool } from '../types/shape'

function createId(): string {
  return `shape-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`
}

/** Цвет заливки новых фигур (акцент проекта). */
const DEFAULT_FILL = '#7c6cff'

/** Сколько шагов истории храним (старые снимки отбрасываются). */
const HISTORY_LIMIT = 100

/**
 * Стартовая позиция одной фигуры в момент начала перетаскивания.
 * «Холст» (Canvas) вычисляет её из актуального состояния фигур и передаёт
 * в beginDrag, а useShapes уже двигает фигуры от этой базы дельтой курсора.
 */
export interface DragOriginal {
  id: string
  x: number
  y: number
}

export interface UseShapes {
  shapes: Shape[]
  /** Активный инструмент (из левой панели). */
  activeTool: Tool
  setActiveTool: (tool: Tool) => void
  selectedIds: string[]
  /** Черновик фигуры, которая рисуется прямо сейчас (null — рисования нет). */
  draft: DraftShape | null
  addShape: (shape: Omit<Shape, 'id'>) => string
  updateShape: (id: string, patch: Partial<Omit<Shape, 'id'>>) => void
  removeShape: (id: string) => void
  selectShape: (id: string, additive?: boolean) => void
  clearSelection: () => void
  /** Начать рисование: зафиксировать точку старта и тип фигуры. */
  beginDraw: (start: Point, type: ShapeType) => void
  /** Обновить черновик по текущей точке (мировые координаты). */
  updateDraw: (current: Point) => void
  /** Завершить рисование: создаёт фигуру и выделяет её. Вернёт id или null. */
  endDraw: () => string | null
  /** Отменить рисование (черновик исчезнет, фигура не создастся). */
  cancelDraw: () => void
  /** Начать перетаскивание выделенных фигур: точка старта + их изначальные позиции. */
  beginDrag: (start: Point, originals: DragOriginal[]) => void
  /** Двигать перетаскиваемые фигуры вслед за курсором (мировые координаты). */
  updateDrag: (current: Point) => void
  /** Завершить перетаскивание: позиции уже зафиксированы в состоянии. */
  endDrag: () => void
  /** Отменить последнее изменение (Ctrl/Cmd+Z). */
  undo: () => void
  /** Повторить отменённое изменение (Ctrl/Cmd+Shift+Z). */
  redo: () => void
}

export function useShapes(): UseShapes {
  const [shapes, setShapes] = useState<Shape[]>([])
  const [activeTool, setActiveTool] = useState<Tool>('select')
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [draft, setDraft] = useState<DraftShape | null>(null)
  // Зеркало черновика: pointermove приходит часто, и обработчик обязан
  // видеть актуальные значения без устаревших замыканий.
  const draftRef = useRef<DraftShape | null>(null)

  // История изменений: past — «до»-снимки (undo), future — отменённые
  // состояния (redo). Снимки — это целые массивы фигур, поэтому они
  // иммутабельны: каждый сеттер создаёт новый массив.
  const pastRef = useRef<Shape[][]>([])
  const futureRef = useRef<Shape[][]>([])
  // Зеркало последних зафиксированных фигур: pushHistory снимает «до»-снимок
  // синхронно в момент вызова, не дожидаясь рендера.
  const shapesRef = useRef<Shape[]>([])
  useEffect(() => {
    shapesRef.current = shapes
  }, [shapes])

  /** Снять снимок текущего состояния в историю (перед изменением). */
  const pushHistory = useCallback(() => {
    pastRef.current.push(shapesRef.current)
    if (pastRef.current.length > HISTORY_LIMIT) pastRef.current.shift()
    // Новое изменение инвалидирует ветку «повторить».
    futureRef.current = []
  }, [])

  const undo = useCallback(() => {
    const previous = pastRef.current.pop()
    if (!previous) return
    futureRef.current.push(shapesRef.current)
    shapesRef.current = previous
    setShapes(previous)
    setDraft(null)
    draftRef.current = null
    // Убираем из выделения фигуры, которых больше нет в состоянии.
    setSelectedIds((prev) => prev.filter((id) => previous.some((shape) => shape.id === id)))
  }, [])

  const redo = useCallback(() => {
    const next = futureRef.current.pop()
    if (!next) return
    pastRef.current.push(shapesRef.current)
    shapesRef.current = next
    setShapes(next)
    setDraft(null)
    draftRef.current = null
    setSelectedIds((prev) => prev.filter((id) => next.some((shape) => shape.id === id)))
  }, [])

  const addShape = useCallback((shape: Omit<Shape, 'id'>): string => {
    pushHistory()
    const id = createId()
    setShapes((prev) => [...prev, { ...shape, id }])
    return id
  }, [pushHistory])

  const updateShape = useCallback((id: string, patch: Partial<Omit<Shape, 'id'>>) => {
    const shape = shapesRef.current.find((item) => item.id === id)
    if (!shape) return
    // Пустой патч (или совпадает с текущим) — история не засоряется.
    const changed = (Object.keys(patch) as Array<keyof Omit<Shape, 'id'>>).some(
      (key) => shape[key] !== patch[key],
    )
    if (!changed) return
    pushHistory()
    setShapes((prev) => prev.map((item) => (item.id === id ? { ...item, ...patch } : item)))
  }, [pushHistory])

  const removeShape = useCallback((id: string) => {
    if (!shapesRef.current.some((shape) => shape.id === id)) return
    pushHistory()
    setShapes((prev) => prev.filter((shape) => shape.id !== id))
    setSelectedIds((prev) => prev.filter((selectedId) => selectedId !== id))
  }, [pushHistory])

  const selectShape = useCallback((id: string, additive = false) => {
    setSelectedIds((prev) => {
      if (additive) return prev.includes(id) ? prev : [...prev, id]
      return [id]
    })
  }, [])

  const clearSelection = useCallback(() => setSelectedIds([]), [])

  const beginDraw = useCallback((start: Point, type: ShapeType) => {
    const shape: DraftShape = {
      type,
      x: start.x,
      y: start.y,
      width: 0,
      height: 0,
      fill: DEFAULT_FILL,
    }
    draftRef.current = shape
    setDraft(shape)
    setSelectedIds([])
  }, [])

  const updateDraw = useCallback((current: Point) => {
    const start = draftRef.current
    if (!start) return
    // Нормализуем прямоугольник: (x, y) — верхний левый угол,
    // ширина/высота всегда положительные (можно тянуть в любую сторону).
    const next: DraftShape = {
      type: start.type,
      fill: start.fill,
      x: Math.min(start.x, current.x),
      y: Math.min(start.y, current.y),
      width: Math.abs(current.x - start.x),
      height: Math.abs(current.y - start.y),
    }
    draftRef.current = next
    setDraft(next)
  }, [])

  const endDraw = useCallback((): string | null => {
    const shape = draftRef.current
    draftRef.current = null
    setDraft(null)
    // Клик без перетаскивания: фигуру размером меньше 1px не создаём.
    if (!shape || shape.width < 1 || shape.height < 1) return null
    pushHistory()
    const id = createId()
    setShapes((prev) => [...prev, { ...shape, id }])
    setSelectedIds([id])
    return id
  }, [pushHistory])

  const cancelDraw = useCallback(() => {
    draftRef.current = null
    setDraft(null)
  }, [])

  // Перетаскивание выделенных фигур: точка старта + изначальные позиции.
  // Реф нужен по той же причине, что и draftRef, — pointermove приходит чаще,
  // чем перерисовка, и обработчик обязан видеть актуальные данные без
  // устаревших замыканий.
  const dragRef = useRef<{ start: Point; originals: Map<string, DragOriginal> } | null>(null)

  const beginDrag = useCallback((start: Point, originals: DragOriginal[]) => {
    if (originals.length === 0) return
    // Один снимок на всё перетаскивание: кадры pointermove историю не засоряют.
    pushHistory()
    dragRef.current = {
      start,
      originals: new Map(originals.map((original) => [original.id, original])),
    }
  }, [pushHistory])

  const updateDrag = useCallback((current: Point) => {
    const drag = dragRef.current
    if (!drag) return
    // Все перетаскиваемые фигуры едут на одну и ту же дельту от своих стартовых
    // позиций — так выделение движется «как единое целое».
    const dx = current.x - drag.start.x
    const dy = current.y - drag.start.y
    setShapes((prev) =>
      prev.map((shape) => {
        const original = drag.originals.get(shape.id)
        if (!original) return shape
        return { ...shape, x: original.x + dx, y: original.y + dy }
      }),
    )
  }, [])

  const endDrag = useCallback(() => {
    dragRef.current = null
  }, [])

  return {
    shapes,
    activeTool,
    setActiveTool,
    selectedIds,
    draft,
    addShape,
    updateShape,
    removeShape,
    selectShape,
    clearSelection,
    beginDraw,
    updateDraw,
    endDraw,
    cancelDraw,
    beginDrag,
    updateDrag,
    endDrag,
    undo,
    redo,
  }
}