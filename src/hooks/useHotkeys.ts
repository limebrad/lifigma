/**
 * src/hooks/useHotkeys.ts — горячие клавиши редактора.
 * V / R / O переключают инструменты. Какая клавиша какому инструменту
 * соответствует — описано в src/constants/tools.ts (единственный источник
 * правды; там же физическая клавиша keyCode). Дополнительно:
 *   Ctrl/Cmd+Z          — отменить;
 *   Ctrl/Cmd+Shift+Z    — повторить (и Ctrl/Cmd+Y как альтернатива).
 * Сопоставление идёт по event.code (физической клавише), поэтому hotkeys
 * работают в любой раскладке — на русской «R» печатает `к`, а code остаётся
 * 'KeyR', как в Figma. Нажатия внутри <input>/<textarea>/contentEditable
 * игнорируются, чтобы не перехватывать ввод в панели свойств.
 */
import { useEffect } from 'react'
import { getToolByCode, getToolByKey } from '../constants/tools'
import type { Tool } from '../types/shape'

export interface UseHotkeysOptions {
  /** Переключить активный инструмент. */
  onSelectTool: (tool: Tool) => void
  /** Обработчик отмены (Ctrl/Cmd+Z). */
  onUndo?: () => void
  /** Обработчик повтора (Ctrl/Cmd+Shift+Z или Ctrl/Cmd+Y). */
  onRedo?: () => void
}

/** Событие пришло из текстового поля — горячие клавиши не трогаем. */
function isEditableTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false
  return target.isContentEditable || target.tagName === 'INPUT' || target.tagName === 'TEXTAREA'
}

export function useHotkeys({ onSelectTool, onUndo, onRedo }: UseHotkeysOptions): void {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (isEditableTarget(event.target)) return

      const hasModifier = event.ctrlKey || event.metaKey
      if (hasModifier && !event.altKey) {
        // Undo/redo тоже сравниваем по event.code: на русской раскладке
        // Ctrl+Z даёт ключ 'я', а физический код остаётся 'KeyZ'.
        if (event.code === 'KeyZ' && !event.shiftKey) {
          // Ctrl/Cmd+Z — отменить.
          event.preventDefault()
          onUndo?.()
        } else if (event.code === 'KeyZ' && event.shiftKey) {
          // Ctrl/Cmd+Shift+Z — повторить.
          event.preventDefault()
          onRedo?.()
        } else if (event.code === 'KeyY') {
          // Ctrl/Cmd+Y — повторить (альтернатива).
          event.preventDefault()
          onRedo?.()
        }
        // Остальные сочетания с модификаторами не превращаем в выбор
        // инструмента (например, Ctrl+R — перезагрузка страницы браузером).
        return
      }

      // Чистая клавиша без модификаторов — переключение инструмента.
      // Сначала event.key (сработает в латинской раскладке), затем event.code
      // как fallback для любой другой раскладки (как в Figma).
      const tool = getToolByKey(event.key) ?? getToolByCode(event.code)
      if (tool) onSelectTool(tool)
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onSelectTool, onUndo, onRedo])
}