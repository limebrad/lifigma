/**
 * src/hooks/useShapes.ts — состояние фигур (логика без интерфейса).
 * Список, добавление, изменение, удаление, выделение, рисование новой
 * фигуры перетаскиванием мыши и перетаскивание уже выделенных фигур
 * (черновик и перетаскивание — в мировых координатах).
 * Плюс история изменений (undo/redo): каждый «осознанный» шаг снимает
 * снимок состояния в past, кадры перетаскивания мыши историю не засоряют.
 * Компоненты получают всё через пропсы и не знают, как хранится состояние.
 */
import { useCallback, useRef, useState } from 'react'
import type { DraftShape, Point, SelectMode, Shape, ShapeType, Tool } from '../types/shape'

function createId(): string {
  return `shape-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`
}

/** Цвет заливки новых фигур (акцент проекта). */
const DEFAULT_FILL = '#7c6cff'

/** Сколько шагов истории храним (старые снимки отбрасываются). */
const HISTORY_LIMIT = 100

/**
 * Окно, за которое частые правки одного свойства считаются одним жестом.
 * 600 мс — длиннее, чем пауза между кадрами системного пикера цвета,
 * и короче, чем осознанная пауза человека перед следующим изменением.
 */
const HISTORY_COALESCE_MS = 600

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

/** Внутреннее состояние идущего перетаскивания (живёт только в рефе). */
interface DragState {
  /** Точка, где начался жест, в мировых координатах. */
  start: Point
  /** Стартовые позиции перетаскиваемых фигур по id. */
  originals: Map<string, DragOriginal>
  /** Снимок истории уже снят — состояние действительно поменялось. */
  historyPushed: boolean
}

export interface UseShapes {
  shapes: Shape[]
  /** Активный инструмент (из левой панели). */
  activeTool: Tool
  setActiveTool: (tool: Tool) => void
  selectedIds: string[]
  /** Черновик фигуры, которая рисуется прямо сейчас (null — рисования нет). */
  draft: DraftShape | null
  updateShape: (id: string, patch: Partial<Omit<Shape, 'id'>>) => void
  /** Удалить несколько фигур одним шагом истории (Delete / Backspace). */
  removeShapes: (ids: string[]) => void
  selectShape: (id: string, mode?: SelectMode) => void
  /** Выделить все фигуры холста (Ctrl/Cmd+A). */
  selectAll: () => void
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
  /** Отменить прерванное перетаскивание: фигуры вернутся на исходные места. */
  cancelDrag: () => void
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
  // Перетаскивание выделенных фигур: точка старта + изначальные позиции.
  // Реф нужен по той же причине, что и draftRef, — pointermove приходит чаще,
  // чем перерисовка, и обработчик обязан видеть актуальные данные без
  // устаревших замыканий. Объявлен до undo/redo: отмена тоже гасит жест.
  const dragRef = useRef<DragState | null>(null)
  // Последняя правка свойства: нужна, чтобы сливать частые изменения одного
  // поля в один шаг истории (см. updateShape).
  const lastEditRef = useRef<{ key: string; at: number } | null>(null)

  // История изменений: past — «до»-снимки (undo), future — отменённые
  // состояния (redo). Снимки — это целые массивы фигур, поэтому они
  // иммутабельны: каждый сеттер создаёт новый массив.
  const pastRef = useRef<Shape[][]>([])
  const futureRef = useRef<Shape[][]>([])
  // Актуальный список фигур «на сейчас». Раньше он зеркалился в useEffect,
  // а пассивные эффекты выполняются отдельной задачей: два изменения,
  // попавшие в один батч, оба читали устаревшее зеркало и снимали в историю
  // один и тот же базовый снимок — на одно логическое изменение требовалось
  // два Ctrl+Z. Теперь write идёт только через commitShapes, поэтому
  // shapesRef всегда равен тому, что отрисовано, без окна на рассинхрон.
  const shapesRef = useRef<Shape[]>([])

  /** Единственная точка записи состояния фигур: state и зеркало — всегда вместе. */
  const commitShapes = useCallback((next: Shape[]) => {
    shapesRef.current = next
    setShapes(next)
  }, [])

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
    commitShapes(previous)
    setDraft(null)
    draftRef.current = null
    // Перетаскивание, начатое до отмены, больше не имеет смысла: его
    // «изначальные позиции» уже не соответствуют состоянию.
    dragRef.current = null
    lastEditRef.current = null
    // Убираем из выделения фигуры, которых больше нет в состоянии.
    setSelectedIds((prev) => prev.filter((id) => previous.some((shape) => shape.id === id)))
  }, [commitShapes])

  const redo = useCallback(() => {
    const next = futureRef.current.pop()
    if (!next) return
    pastRef.current.push(shapesRef.current)
    commitShapes(next)
    setDraft(null)
    draftRef.current = null
    dragRef.current = null
    lastEditRef.current = null
    setSelectedIds((prev) => prev.filter((id) => next.some((shape) => shape.id === id)))
  }, [commitShapes])

  const updateShape = useCallback((id: string, patch: Partial<Omit<Shape, 'id'>>) => {
    const shape = shapesRef.current.find((item) => item.id === id)
    if (!shape) return
    // Пустой патч (или совпадает с текущим) — история не засоряется.
    const changed = (Object.keys(patch) as Array<keyof Omit<Shape, 'id'>>).some(
      (key) => shape[key] !== patch[key],
    )
    if (!changed) return
    // Слияние частых правок одного и того же свойства в один шаг истории.
    // Системный пикер цвета шлёт input-событие на каждый шаг перетаскивания
    // (десятки событий на одно движение), и без слияния одно изменение
    // цвета превращалось в десятки нажатий Ctrl+Z, быстро выедая историю.
    const editKey = `${id}:${Object.keys(patch).sort().join(',')}`
    const now = Date.now()
    const previous = lastEditRef.current
    const isContinuation =
      previous !== null && previous.key === editKey && now - previous.at < HISTORY_COALESCE_MS
    if (!isContinuation) pushHistory()
    lastEditRef.current = { key: editKey, at: now }
    commitShapes(
      shapesRef.current.map((item) => (item.id === id ? { ...item, ...patch } : item)),
    )
  }, [commitShapes, pushHistory])

  // Удаление пачкой: один вызов — один снимок истории, поэтому стёртые
  // Ctrl+Z возвращает все фигуры разом, а не по одной за нажатие.
  const removeShapes = useCallback((ids: string[]) => {
    if (ids.length === 0) return
    // Фильтруем по актуальному состоянию: часть id могла уже исчезнуть.
    const doomed = new Set(ids.filter((id) => shapesRef.current.some((shape) => shape.id === id)))
    if (doomed.size === 0) return
    pushHistory()
    commitShapes(shapesRef.current.filter((shape) => !doomed.has(shape.id)))
    setSelectedIds((prev) => prev.filter((selectedId) => !doomed.has(selectedId)))
  }, [commitShapes, pushHistory])

  const selectShape = useCallback((id: string, mode: SelectMode = 'replace') => {
    setSelectedIds((prev) => {
      if (mode === 'replace') return [id]
      if (mode === 'add') return prev.includes(id) ? prev : [...prev, id]
      // toggle: повторный Ctrl/Cmd+клик снимает фигуру с выделения.
      return prev.includes(id) ? prev.filter((selectedId) => selectedId !== id) : [...prev, id]
    })
  }, [])

  const selectAll = useCallback(() => {
    setSelectedIds(shapesRef.current.map((shape) => shape.id))
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
    // Выделение здесь намеренно НЕ сбрасываем. endDraw переводит его на новую
    // фигуру, а клик без перетаскивания ничего не создаёт — раньше он молча
    // снимал выделение, и пользователь терял его, нажав «R» и щёлкнув впустую.
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
    commitShapes([...shapesRef.current, { ...shape, id }])
    setSelectedIds([id])
    return id
  }, [commitShapes, pushHistory])

  const cancelDraw = useCallback(() => {
    draftRef.current = null
    setDraft(null)
  }, [])

  // Перетаскивание выделенных фигур: точка старта + изначальные позиции.
  const beginDrag = useCallback((start: Point, originals: DragOriginal[]) => {
    if (originals.length === 0) return
    // Снимок НЕ снимаем здесь: клик по фигуре без перетаскивания ничего не
    // меняет. Раньше historyPushed делалось здесь, и простой клик по уже
    // выделенной фигуре оставлял «пустой» шаг истории: Ctrl+Z не менял
    // ничего, но съедал нажатие, а redo-ветка при этом затиралась.
    dragRef.current = {
      start,
      originals: new Map(originals.map((original) => [original.id, original])),
      historyPushed: false,
    }
  }, [])

  const updateDrag = useCallback((current: Point) => {
    const drag = dragRef.current
    if (!drag) return
    // Все перетаскиваемые фигуры едут на одну и ту же дельту от своих стартовых
    // позиций — так выделение движется «как единое целое».
    const dx = current.x - drag.start.x
    const dy = current.y - drag.start.y
    // Нулевая дельта — позиции не меняются: не плодим новые объекты фигур
    // и не перерисовываем холст, просто потому что курсор дёрнулся на пиксель.
    if (dx === 0 && dy === 0) return
    // Один снимок на всё перетаскивание: кадры pointermove историю не засоряют.
    if (!drag.historyPushed) {
      pushHistory()
      drag.historyPushed = true
    }
    commitShapes(
      shapesRef.current.map((shape) => {
        const original = drag.originals.get(shape.id)
        if (!original) return shape
        return { ...shape, x: original.x + dx, y: original.y + dy }
      }),
    )
  }, [commitShapes, pushHistory])

  const endDrag = useCallback(() => {
    dragRef.current = null
  }, [])

  // Перетаскивание, прерванное системой (pointercancel, потеря захвата):
  // возвращаем фигуры на стартовые позиции. Раньше прерванный drag «оставался»
  // на новом месте, тогда как прерванное рисование честно отменялось —
  // исход прерывания был один, а результат разный.
  const cancelDrag = useCallback(() => {
    const drag = dragRef.current
    if (!drag) return
    if (drag.historyPushed) {
      commitShapes(
        shapesRef.current.map((shape) => {
          const original = drag.originals.get(shape.id)
          if (!original) return shape
          return { ...shape, x: original.x, y: original.y }
        }),
      )
      // Снимок истории, снятый в начале перетаскивания, больше не нужен:
      // перемещения не состоялось, откатывать его неоткуда.
      pastRef.current.pop()
    }
    dragRef.current = null
  }, [commitShapes])

  return {
    shapes,
    activeTool,
    setActiveTool,
    selectedIds,
    draft,
    updateShape,
    removeShapes,
    selectShape,
    selectAll,
    clearSelection,
    beginDraw,
    updateDraw,
    endDraw,
    cancelDraw,
    beginDrag,
    updateDrag,
    endDrag,
    cancelDrag,
    undo,
    redo,
  }
}