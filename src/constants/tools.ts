/**
 * src/constants/tools.ts — единственный источник правды об инструментах.
 * Захотим поменять клавишу или добавить инструмент — правим только этот файл.
 */
import type { Tool } from '../types/shape'

export interface ToolDefinition {
  id: Tool
  /** Подпись (используется в подсказках). */
  label: string
  /** Горячая клавиша для отображения в подсказках (как в Figma). */
  keyboard: string
  /**
   * Физическая клавиша (event.code) — одна и та же при любой раскладке:
   * на русской «R» даёт `к`, а code остаётся `KeyR`. Поэтому выбор
   * инструмента работает, как в Figma, в какой раскладке ни набирай.
   */
  keyCode: string
  /** Полная подсказка для тултипа кнопки. */
  hint: string
}

export const TOOLS: ToolDefinition[] = [
  { id: 'select', label: 'Select', keyboard: 'V', keyCode: 'KeyV', hint: 'Выбор и перемещение (V)' },
  { id: 'rectangle', label: 'Rectangle', keyboard: 'R', keyCode: 'KeyR', hint: 'Прямоугольник (R)' },
  { id: 'ellipse', label: 'Ellipse', keyboard: 'O', keyCode: 'KeyO', hint: 'Эллипс (O)' },
]

/** Клавиша (в нижнем регистре) -> инструмент. */
export const TOOL_BY_KEY: Record<string, Tool> = Object.fromEntries(
  TOOLS.map((tool) => [tool.keyboard.toLowerCase(), tool.id]),
)

/** Физическая клавиша (event.code) -> инструмент. */
export const TOOL_BY_CODE: Record<string, Tool> = Object.fromEntries(
  TOOLS.map((tool) => [tool.keyCode, tool.id]),
)

/** Ищет инструмент по нажатой клавише (обёртка, чтобы не прокидывать Record). */
export function getToolByKey(key: string): Tool | undefined {
  return TOOL_BY_KEY[key.toLowerCase()]
}

/** Ищет инструмент по физической клавише — работает при любой раскладке. */
export function getToolByCode(code: string): Tool | undefined {
  return TOOL_BY_CODE[code]
}