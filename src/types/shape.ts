/**
 * src/types/shape.ts — единый язык проекта.
 * Все сущности (фигуры, инструменты, координаты) описаны здесь один раз,
 * чтобы TypeScript ловил ошибки до запуска и все файлы говорили одинаково.
 */

/** Точка в мировых координатах холста. */
export interface Point {
  x: number
  y: number
}

/** Размер в мировых единицах холста. */
export interface Size {
  width: number
  height: number
}

/** Геометрические примитивы, которые рисует редактор. */
export type ShapeType = 'rectangle' | 'ellipse'

/** Инструменты левой панели. */
export type Tool = 'select' | 'rectangle' | 'ellipse'

/** Одна фигура на холсте. */
export interface Shape {
  id: string
  type: ShapeType
  /** Левый верхний угол в мировых координатах холста. */
  x: number
  y: number
  width: number
  height: number
  /** Цвет заливки (любой CSS-цвет). */
  fill: string
}

/**
 * Черновик фигуры, которую пользователь рисует перетаскиванием мыши.
 * У черновика ещё нет id — он появится, когда фигура будет создана.
 */
export type DraftShape = Omit<Shape, 'id'>