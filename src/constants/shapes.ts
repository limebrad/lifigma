/**
 * src/constants/shapes.ts — русские подписи типов фигур.
 * В коде тип остаётся английским (rectangle/ellipse), а пользователю
 * показываем человеческое название — в панелях свойств и слоёв.
 */
import type { ShapeType } from '../types/shape'

export const SHAPE_LABELS: Record<ShapeType, string> = {
  rectangle: 'Прямоугольник',
  ellipse: 'Эллипс',
}
