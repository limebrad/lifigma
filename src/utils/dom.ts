/**
 * src/utils/dom.ts — маленькие помощники по DOM, общие для хуков.
 * Живут отдельно от логики, чтобы «можно ли тут перехватывать клавиши»
 * было описано один раз: и useHotkeys, и useViewport должны решать это
 * одинаково, иначе одно из них начнёт воровать нажатия у другого.
 */

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
