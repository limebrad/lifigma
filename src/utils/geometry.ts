/**
 * src/utils/geometry.ts — чистая математика камеры и хит-тестов.
 * Здесь не бывает state и DOM: только переводы координат (экран <-> мир)
 * с учётом зума и панорамирования, а также проверки попадания точки
 * в фигуру. Без этого пересчёта фигуры «уезжают» относительно курсора
 * при зуме и сдвиге холста, а клики целятся не туда.
 */
import type { Point, Shape, Size } from '../types/shape'

/**
 * Камера: (x, y) — мировая точка, на которую смотрит центр холста,
 * zoom — масштаб (1 = 100%).
 */
export interface Viewport {
  x: number
  y: number
  zoom: number
}

/** Ограничивает число диапазоном [min, max]. */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value))
}

/**
 * Экранные координаты (относительно холста) -> мировые координаты холста.
 * Из центра экрана (viewportSize / 2) смотрит точка (viewport.x, viewport.y).
 */
export function screenToCanvas(point: Point, viewport: Viewport, viewportSize: Size): Point {
  return {
    x: (point.x - viewportSize.width / 2) / viewport.zoom + viewport.x,
    y: (point.y - viewportSize.height / 2) / viewport.zoom + viewport.y,
  }
}

/** Мировые координаты холста -> экранные. */
export function canvasToScreen(point: Point, viewport: Viewport, viewportSize: Size): Point {
  return {
    x: (point.x - viewport.x) * viewport.zoom + viewportSize.width / 2,
    y: (point.y - viewport.y) * viewport.zoom + viewportSize.height / 2,
  }
}

/**
 * Новый вьюпорт при смене зума: мировая точка под курсором (anchor) остаётся
 * ровно под курсором, а не «уплывает» в сторону. Именно это делает зум «в точку».
 */
export function zoomAt(
  viewport: Viewport,
  nextZoom: number,
  anchor: Point,
  viewportSize: Size,
): Viewport {
  const worldUnderAnchor = screenToCanvas(anchor, viewport, viewportSize)
  return {
    zoom: nextZoom,
    x: worldUnderAnchor.x - (anchor.x - viewportSize.width / 2) / nextZoom,
    y: worldUnderAnchor.y - (anchor.y - viewportSize.height / 2) / nextZoom,
  }
}

/** Прямоугольник в мировых координатах (bounds фигуры). */
export interface Rect {
  x: number
  y: number
  width: number
  height: number
}

/** Точка внутри прямоугольника (границы включительно). */
export function pointInRect(point: Point, rect: Rect): boolean {
  return (
    point.x >= rect.x &&
    point.x <= rect.x + rect.width &&
    point.y >= rect.y &&
    point.y <= rect.y + rect.height
  )
}

/** Точка внутри эллипса, вписанного в прямоугольник (границы включительно). */
export function pointInEllipse(point: Point, rect: Rect): boolean {
  const rx = rect.width / 2
  const ry = rect.height / 2
  if (rx <= 0 || ry <= 0) return false
  const dx = (point.x - (rect.x + rx)) / rx
  const dy = (point.y - (rect.y + ry)) / ry
  return dx * dx + dy * dy <= 1
}

/**
 * Проверка попадания точки в фигуру с учётом её типа.
 * Эллипс проверяем как вписанный в bounds, прямоугольник — строго по bounds.
 */
export function hitTestShape(
  point: Point,
  shape: Pick<Shape, 'type' | 'x' | 'y' | 'width' | 'height'>,
): boolean {
  const rect: Rect = { x: shape.x, y: shape.y, width: shape.width, height: shape.height }
  return shape.type === 'ellipse' ? pointInEllipse(point, rect) : pointInRect(point, rect)
}

/**
 * Верхняя фигура под точкой. Последний элемент массива рисуется поверх всех,
 * поэтому ищем с конца — верхний слой «выигрывает» при пересечении.
 */
export function findTopShapeAt(point: Point, shapes: Shape[]): Shape | undefined {
  for (let i = shapes.length - 1; i >= 0; i -= 1) {
    if (hitTestShape(point, shapes[i])) return shapes[i]
  }
  return undefined
}