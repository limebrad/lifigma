/**
 * src/components/ui/FigmaLogo.tsx — знак Figma (в оригинальной палитре) и
 * подпись «desktop-figma». Логотип используется как референс на продукт.
 */

type LogoMarkProps = {
  className?: string
}

export function FigmaLogoMark({ className = 'h-8 w-auto' }: LogoMarkProps) {
  return (
    <svg
      viewBox="0 0 38 57"
      className={className}
      role="img"
      aria-label="Figma"
      focusable="false"
    >
      <path fill="#1abcfe" d="M19 28.5a9.5 9.5 0 1 1 19 0 9.5 9.5 0 0 1-19 0Z" />
      <path fill="#0acf83" d="M0 47.5A9.5 9.5 0 0 1 9.5 38H19v9.5a9.5 9.5 0 1 1-19 0Z" />
      <path fill="#ff7262" d="M19 0v19h9.5a9.5 9.5 0 1 0 0-19H19Z" />
      <path fill="#f24e1e" d="M0 9.5A9.5 9.5 0 0 0 9.5 19H19V0H9.5A9.5 9.5 0 0 0 0 9.5Z" />
      <path fill="#a259ff" d="M0 28.5A9.5 9.5 0 0 1 9.5 19H19v19H9.5A9.5 9.5 0 0 1 0 28.5Z" />
    </svg>
  )
}

type LogoProps = {
  className?: string
}

export function FigmaLogo({ className = '' }: LogoProps) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <FigmaLogoMark className="h-7 w-auto" />
      <span className="text-[17px] font-extrabold tracking-tight text-ink">
        desktop-figma
      </span>
    </span>
  )
}
