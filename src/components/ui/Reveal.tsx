/**
 * src/components/ui/Reveal.tsx — обёртка для анимации появления.
 * Каждая карточка/блок получает свою задержку, чтобы секция «проявлялась»
 * каскадом. Проп `as` позволяет сохранить семантику (например, <li> в списке).
 */
import { createElement, type ReactNode } from 'react'
import { useReveal } from '../../hooks/useReveal'

type RevealProps = {
  children: ReactNode
  className?: string
  /** Задержка появления, мс. */
  delay?: number
  /** Тег-обёртка: div по умолчанию, li — для элементов списка. */
  as?: 'div' | 'li'
}

export function Reveal({ children, className = '', delay = 0, as = 'div' }: RevealProps) {
  const ref = useReveal<HTMLElement>()

  return createElement(
    as,
    {
      ref,
      className: `reveal ${className}`,
      style: delay ? { transitionDelay: `${delay}ms` } : undefined,
    },
    children,
  )
}
