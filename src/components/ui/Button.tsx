/**
 * src/components/ui/Button.tsx — переиспользуемая кнопка-ссылка.
 * Все CTA ведут по URL (лендинг или редактор) либо на якорь секции,
 * поэтому базовый элемент — <a>, а не <button>.
 */
import type { ReactNode } from 'react'

type ButtonVariant = 'primary' | 'light'
type ButtonSize = 'md' | 'lg'

type ButtonProps = {
  href: string
  children: ReactNode
  variant?: ButtonVariant
  size?: ButtonSize
  className?: string
  /** Иконка справа от текста. */
  icon?: ReactNode
}

const VARIANTS: Record<ButtonVariant, string> = {
  primary: 'bg-ink text-white hover:bg-ink-2',
  light: 'bg-paper text-ink hover:bg-mist',
}

const SIZES: Record<ButtonSize, string> = {
  md: 'h-11 px-5 text-body',
  lg: 'h-13 px-7 text-base',
}

export function Button({
  href,
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  icon,
}: ButtonProps) {
  return (
    <a
      href={href}
      className={[
        'group inline-flex items-center justify-center gap-2 rounded-full font-semibold',
        'transition-all duration-200 ease-out',
        'hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98]',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-violet focus-visible:ring-offset-2',
        VARIANTS[variant],
        SIZES[size],
        className,
      ].join(' ')}
    >
      {children}
      {icon}
    </a>
  )
}
