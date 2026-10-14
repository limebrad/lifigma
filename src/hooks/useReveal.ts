/**
 * src/hooks/useReveal.ts — плавное появление блока при прокрутке.
 * Логика без интерфейса: вешаем IntersectionObserver на элемент и, когда он
 * попадает в вид, добавляем класс is-visible (см. .reveal в index.css).
 */
import { useEffect, useRef } from 'react'

export function useReveal<T extends HTMLElement>() {
  const ref = useRef<T>(null)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    // Без IntersectionObserver (или при отключённой анимации) показываем сразу.
    if (typeof IntersectionObserver === 'undefined') {
      element.classList.add('is-visible')
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible')
            observer.unobserve(entry.target)
          }
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -60px 0px' },
    )

    observer.observe(element)
    return () => observer.disconnect()
  }, [])

  return ref
}
