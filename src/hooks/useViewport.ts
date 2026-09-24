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

/** Минимальный зум: 10%. */
export const MIN_ZOOM = 0.1
/** Максимальный зум: 400%. */
export const MAX_ZOOM = 4
/** Множитель зума на один «щелчок» колеса. */
const ZOOM_STEP = 1.15

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
  /** CSS-курсор для области холста. */
  cursor: string
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
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.code !== 'Space') return
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
    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
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
      const anchor = toLocal(event.clientX, event.clientY)
      setViewport((current) => {
        const factor = event.deltaY < 0 ? ZOOM_STEP : 1 / ZOOM_STEP
        const nextZoom = clamp(current.zoom * factor, MIN_ZOOM, MAX_ZOOM)
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

  const cursor = panning ? 'grabbing' : spaceDown ? 'grab' : 'default'

  return {
    containerRef,
    viewport,
    viewportSize,
    spaceDown,
    panning,
    cursor,
    startPanning,
    movePanning,
    stopPanning,
  }
}