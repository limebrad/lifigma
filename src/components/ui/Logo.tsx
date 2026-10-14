/**
 * src/components/ui/Logo.tsx — собственный знак проекта «Мини Фигма» и
 * подпись рядом с ним. Знак — это градиентный квадрат с двумя фигурами,
 * которые редактор умеет рисовать (прямоугольник и круг). Официальный
 * логотип Figma здесь не используется.
 */
import { useId } from 'react'

type LogoMarkProps = {
  className?: string
}

export function LogoMark({ className = 'h-8 w-auto' }: LogoMarkProps) {
  // Уникальный id градиента: знак встречается на странице несколько раз.
  const gradientId = useId()

  return (
    <svg
      viewBox="0 0 32 32"
      className={className}
      role="img"
      aria-label="Мини Фигма"
      focusable="false"
    >
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
          <stop stopColor="#a259ff" />
          <stop offset="1" stopColor="#1abcfe" />
        </linearGradient>
      </defs>
      <rect width="32" height="32" rx="9" fill={`url(#${gradientId})`} />
      <rect x="7" y="7" width="9" height="9" rx="2" fill="#ffffff" />
      <circle cx="21.5" cy="21.5" r="5" fill="#ffffff" fillOpacity="0.9" />
    </svg>
  )
}

type LogoProps = {
  className?: string
}

export function Logo({ className = '' }: LogoProps) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <LogoMark className="h-7 w-auto" />
      <span className="text-[17px] font-extrabold tracking-tight text-ink">
        Мини Фигма
      </span>
    </span>
  )
}
