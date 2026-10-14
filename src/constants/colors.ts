/**
 * src/constants/colors.ts — общая палитра редактора.
 * Один источник правды для цвета заливки по умолчанию, палитры пресетов и
 * тёмной темы интерфейса: редактор и его SVG-иллюстрации совпадают.
 */

/** Цвет заливки новых фигур (акцент проекта). */
export const DEFAULT_FILL = '#7c6cff'

/** Быстрая палитра заливки: один клик — и цвет применён. */
export const PRESET_COLORS = [
  '#7c6cff',
  '#3fd8f0',
  '#f66fc8',
  '#4ade80',
  '#f5a623',
  '#ff5d5d',
  '#ece9f8',
  '#1b1727',
] as const

/** Тёмная тема интерфейса редактора (совпадает с токенами в index.css). */
export const EDITOR_THEME = {
  bg: '#0e0c16',
  panel: '#14111f',
  panel2: '#1b1727',
  panel3: '#241f3d',
  border: '#2b2540',
  text: '#ece9f8',
  muted: '#9c97b8',
  accent: '#7c6cff',
  cyan: '#3fd8f0',
  gridDot: '#241f36',
} as const
