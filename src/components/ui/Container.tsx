/**
 * src/components/ui/Container.tsx — общий ограничитель ширины контента.
 * Держит единую сетку страницы: поля по краям и максимум 1180px.
 */
import type { ReactNode } from 'react'

type ContainerProps = {
  children: ReactNode
  className?: string
}

export function Container({ children, className = '' }: ContainerProps) {
  return (
    <div className={`mx-auto w-full max-w-[1180px] px-5 sm:px-8 ${className}`}>
      {children}
    </div>
  )
}
