/**
 * src/hooks/useViewport.ts — «камера» холста (логика без интерфейса).
 * Умеет:
 *   - панорамировать: пробел (или средняя кнопка) + мышь;
 *   - зумить колесом от 10% до 400% с привязкой к точке под курсором;
 *   - центрировать начало координат при старте.
 *
 * Компонент-потребитель только вешает возвращаемые обработчики на свой DOM.
 */
import { useCallback, useEffect, useRef, useState } from 'react'
import type { PointerEvent as ReactPointerEvent } from 'react'
import type { Point, Size } from '../types/shape'
import { clamp, zoomAt } from '../utils/geometry'
import type { Viewport } from '../utils/geometry'
import { shouldIgnorePanHotkey } from '../utils/dom'

/** Минимальный зум: 10%. */
const MIN_ZOOM = 0.1
/** Максимальный зум: 400%. */
const MAX_ZOOM = 4
/**
 * Чувствительность зума к колесу: множитель равен exp(-deltaY * ZOOM_SENSITIVITY).
 * Раньше был фиксированный шаг 1.15 на КАЖДОЕ wheel-событие, из-за чего
 * двупальцевый скролл тачпада (десятки событий за один жест, 1.15^15 ≈ 8.4)
 * мгновенно упирался в максимум 400%. Экспонента по величине прокрутки
 * сохраняет привычные ~15% на щелчок мыши и делает тачпад управляемым.
 */
const ZOOM_SENSITIVITY = 0.0015
/** Высота строки текста — для нормализации deltaMode === 1. */
const LINE_HEIGHT = 16
/** Высота страницы — для нормализации deltaMode === 2. */
const PAGE_HEIGHT = 800

export interface ViewportApi {
  /** Ref на DOM холста: сюда вешаем колесо и меряем размер области. */
  containerRef: React.RefObject<HTMLDivElement | null>
  /** Текущая камера. */
  viewport: Viewport
  /** Размер области холста в экранных пикселях. */
  viewportSize: Size
  /** Зажат ли пробел (режим «рука»). */
  spaceDown: boolean
  /** Идёт ли панорамирование прямо сейчас. */
  panning: boolean
  startPanning: (event: ReactPointerEvent<HTMLDivElement>) => void
  movePanning: (event: ReactPointerEvent<HTMLDivElement>) => void
  stopPanning: (event: ReactPointerEvent<HTMLDivElement>) => void
}

export function useViewport(): ViewportApi {
  const containerRef = useRef<HTMLDivElement>(null)
  const [viewportSize, setViewportSize] = useState<Size>({ width: 0, height: 0 })
  // Стартовая камера: начало мира (0, 0) — в центре экрана, зум 100%.
  const [viewport, setViewport] = useState<Viewport>({ x: 0, y: 0, zoom: 1 })
  const [spaceDown, setSpaceDown] = useState(false)
  const [panning, setPanning] = useState(false)

  // Рефы-«зеркала» нужны обработчикам, чтобы не ловить устаревшие замыкания.
  const spaceDownRef = useRef(false)
  const panningRef = useRef(false)
  const lastPointRef = useRef<Point | null>(null)

  // Размер холста: следим за resize именно элемента, а не окна, чтобы
  // отступы панелей слева/справа не разъезжались с математикой камеры.
  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const measure = () => {
      setViewportSize({ width: el.clientWidth, height: el.clientHeight })
    }
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  // Пробел — переключатель режима «рука» (глобально, т.к. панорамировать
  // можно, начав движение ещё над панелями нельзя, но захват мыши уже держим).
  useEffect(() => {
    // Пробел в поле ввода (например, в цвете `rgb(1 2 3)`) — это пробел
    // пользователя, а не панорама: такой перехват ломал ввод в панели свойств.
    // Пробел на сфокусированной кнопке тоже не наш: им активируют кнопку.
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.code !== 'Space' || shouldIgnorePanHotkey(event.target)) return
      event.preventDefault()
      if (!event.repeat) {
        spaceDownRef.current = true
        setSpaceDown(true)
      }
    }
    const handleKeyUp = (event: KeyboardEvent) => {
      if (event.code !== 'Space') return
      spaceDownRef.current = false
      setSpaceDown(false)
    }
    // keyup может не прийти: пользователь переключил окно или потерял фокус
    // при зажатом пробеле. Без сброса spaceDown «залипал» и обычный клик
    // левой кнопкой начинал панорамировать вместо выделения фигуры.
    const handleBlur = () => {
      spaceDownRef.current = false
      panningRef.current = false
      lastPointRef.current = null
      setSpaceDown(false)
      setPanning(false)
    }
    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)
    window.addEventListener('blur', handleBlur)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
      window.removeEventListener('blur', handleBlur)
    }
  }, [])

  // Клиентские координаты события -> координаты относительно области холста.
  const toLocal = useCallback((clientX: number, clientY: number): Point => {
    const rect = containerRef.current?.getBoundingClientRect()
    return { x: clientX - (rect?.left ?? 0), y: clientY - (rect?.top ?? 0) }
  }, [])

  // Колесо мыши: зум. Слушатель вешается на сам холст (не на window), чтобы
  // скролл панелей справа продолжал работать, а зум действовал в область холста.
  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const handleWheel = (event: WheelEvent) => {
      event.preventDefault()
      // Приводим прокрутку к пикселям: Firefox в DOM_DELTA_LINE даёт строки,
      // в DOM_DELTA_PAGE — страницы, и без нормализации зум скачет на два
      // порядка в зависимости от браузера.
      const pixels =
        event.deltaMode === 1
          ? event.deltaY * LINE_HEIGHT
          : event.deltaMode === 2
            ? event.deltaY * PAGE_HEIGHT
            : event.deltaY
      if (pixels === 0) return
      const anchor = toLocal(event.clientX, event.clientY)
      setViewport((current) => {
        const nextZoom = clamp(current.zoom * Math.exp(-pixels * ZOOM_SENSITIVITY), MIN_ZOOM, MAX_ZOOM)
        if (nextZoom === current.zoom) return current
        return zoomAt(current, nextZoom, anchor, viewportSize)
      })
    }
    el.addEventListener('wheel', handleWheel, { passive: false })
    return () => el.removeEventListener('wheel', handleWheel)
  }, [toLocal, viewportSize])

  const startPanning = useCallback(
    (event: ReactPointerEvent<HTMLDivElement>) => {
      // Панорама: левая кнопка при зажатом пробеле ИЛИ средняя кнопка.
      const canStart = event.button === 1 || (event.button === 0 && spaceDownRef.current)
      if (!canStart) return
      event.preventDefault()
      lastPointRef.current = toLocal(event.clientX, event.clientY)
      panningRef.current = true
      setPanning(true)
      event.currentTarget.setPointerCapture(event.pointerId)
    },
    [toLocal],
  )

  const movePanning = useCallback(
    (event: ReactPointerEvent<HTMLDivElement>) => {
      if (!panningRef.current || !lastPointRef.current) return
      const point = toLocal(event.clientX, event.clientY)
      const dx = point.x - lastPointRef.current.x
      const dy = point.y - lastPointRef.current.y
      lastPointRef.current = point
      // Тащим мир за собой: камера едет в противоположную сторону.
      setViewport((current) => ({
        ...current,
        x: current.x - dx / current.zoom,
        y: current.y - dy / current.zoom,
      }))
    },
    [toLocal],
  )

  const stopPanning = useCallback((event: ReactPointerEvent<HTMLDivElement>) => {
    if (!panningRef.current) return
    panningRef.current = false
    setPanning(false)
    lastPointRef.current = null
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId)
    }
  }, [])

  // Курсор намеренно НЕ отдаётся отсюда: Canvas считает его с учётом
  // активного инструмента и перетаскивания, и его собственное значение
  // всегда было полнее. Раньше хук отдавал курсор, который никто не читал.
  return {
    containerRef,
    viewport,
    viewportSize,
    spaceDown,
    panning,
    startPanning,
    movePanning,
    stopPanning,
  }
}