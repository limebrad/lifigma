/**
 * src/utils/dom.ts — маленькие помощники по DOM, общие для хуков.
 * Живут отдельно от логики, чтобы «можно ли тут перехватывать клавиши» и
 * «как перевести курсор в координаты элемента» были описаны один раз: и
 * useHotkeys, и useViewport, и холст должны решать это одинаково.
 */
import type { Point } from '../types/shape'

/**
 * Клиентские координаты события -> координаты относительно элемента.
 * Общий перевод для камеры (useViewport) и холста (Canvas): раньше каждая
 * сторона держала свою копию, и они могли разойтись.
 */
export function clientToLocal(element: Element | null, clientX: number, clientY: number): Point {
  const rect = element?.getBoundingClientRect()
  return { x: clientX - (rect?.left ?? 0), y: clientY - (rect?.top ?? 0) }
}

/**
 * Событие пришло из текстового поля — горячие клавиши редактора трогать нельзя.
 * Проверяем и сам элемент, и его предков: в React событие может прийти от
 * вложенного узла (например, <span> внутри <label> пикера цвета), и тогда
 * target.tagName не совпадёт с INPUT.
 */
export function isEditableTarget(target: EventTarget | null): boolean {
  const element = target instanceof HTMLElement ? target : null
  if (!element) return false
  // isContentEditable не наследуется в DOM: проверяем и родителей.
  if (element.isContentEditable) return true
  return Boolean(element.closest('input, textarea, select, [contenteditable="true"]'))
}

/**
 * Фокус стоит на элементе, который сам обрабатывает нажатие Space: у <button>
 * и у ссылок Space вызывает активацию. Пробел в режиме «рука» нельзя
 * перехватывать, иначе сфокусированную кнопку невозможно нажать с клавиатуры.
 */
export function isActivatableTarget(target: EventTarget | null): boolean {
  return target instanceof HTMLElement && Boolean(target.closest('button, a[href], [role="button"]'))
}

/**
 * Нужно ли игнорировать пробел как горячую клавишу панорамы. Отдельная
 * функция, потому что правило для пробела строже, чем для остальных клавиш:
 * V / R / O внутри полей ввода тоже не работают, но фокус на кнопке не должен
 * отключать переключение инструмента.
 */
export function shouldIgnorePanHotkey(target: EventTarget | null): boolean {
  return isEditableTarget(target) || isActivatableTarget(target)
}
