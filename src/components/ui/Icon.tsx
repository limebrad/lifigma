/**
 * src/components/ui/Icon.tsx — набор линейных иконок интерфейса.
 * Один компонент + карта путей, чтобы контент ссылался на иконку по имени.
 */
import type { ReactNode } from 'react'

export type IconName =
  | 'window'
  | 'layout'
  | 'users'
  | 'prototype'
  | 'spark'
  | 'gem'
  | 'team'
  | 'menu'
  | 'close'
  | 'chevron'
  | 'download'
  | 'arrowRight'
  | 'external'
  | 'check'

const PATHS: Record<IconName, ReactNode> = {
  window: (
    <>
      <rect x="3" y="4" width="18" height="16" rx="2.5" />
      <path d="M3 8.5h18" />
      <path d="M6.2 6.3h.01M8.6 6.3h.01" />
    </>
  ),
  layout: (
    <>
      <rect x="3.5" y="3.5" width="7" height="7" rx="1.6" />
      <rect x="13.5" y="3.5" width="7" height="11" rx="1.6" />
      <rect x="3.5" y="13.5" width="7" height="7" rx="1.6" />
      <rect x="13.5" y="17.5" width="7" height="3" rx="1.4" />
    </>
  ),
  users: (
    <>
      <circle cx="9" cy="8" r="3.2" />
      <path d="M3.8 19.2a5.4 5.4 0 0 1 10.4 0" />
      <path d="M16 5.2a3.2 3.2 0 0 1 0 6.1" />
      <path d="M17.2 14.4a5.4 5.4 0 0 1 3 4.8" />
    </>
  ),
  prototype: (
    <>
      <rect x="3" y="3.5" width="9" height="7" rx="1.8" />
      <rect x="12" y="13.5" width="9" height="7" rx="1.8" />
      <path d="M7.5 10.5v3a1.8 1.8 0 0 0 1.8 1.8H12" />
      <circle cx="7.5" cy="7" r="0.6" fill="currentColor" stroke="none" />
    </>
  ),
  spark: (
    <>
      <path d="M12 3.5l1.9 5.1 5.1 1.9-5.1 1.9L12 17.5l-1.9-5.1L5 10.5l5.1-1.9z" />
      <path d="M18.5 16.5l.7 1.8 1.8.7-1.8.7-.7 1.8-.7-1.8-1.8-.7 1.8-.7z" />
    </>
  ),
  gem: (
    <>
      <path d="M6.2 4h11.6l2.7 4.6L12 20.5 3.5 8.6z" />
      <path d="M3.5 8.6h17" />
      <path d="M9.3 4l-1 4.6L12 20.5l3.7-11.9-1-4.6" />
    </>
  ),
  team: (
    <>
      <circle cx="12" cy="6" r="2.6" />
      <circle cx="5.4" cy="15.6" r="2.4" />
      <circle cx="18.6" cy="15.6" r="2.4" />
      <path d="M10.3 8.1 7.1 13.5M13.7 8.1l3.2 5.4M7.8 15.6h8.4" />
    </>
  ),
  menu: (
    <>
      <path d="M4 7h16M4 12h16M4 17h16" />
    </>
  ),
  close: <path d="M6 6l12 12M18 6L6 18" />,
  chevron: <path d="M6 9.5l6 6 6-6" />,
  download: (
    <>
      <path d="M12 3.5v11.2" />
      <path d="M7.6 10.6 12 15l4.4-4.4" />
      <path d="M4.5 18.5h15" />
    </>
  ),
  arrowRight: (
    <>
      <path d="M4.5 12h14.5" />
      <path d="m13.5 6.5 5.5 5.5-5.5 5.5" />
    </>
  ),
  external: (
    <>
      <path d="M14 4.5h5.5V10" />
      <path d="M19.5 4.5 11 13" />
      <path d="M18 14v4.5A1.5 1.5 0 0 1 16.5 20h-11A1.5 1.5 0 0 1 4 18.5v-11A1.5 1.5 0 0 1 5.5 6H10" />
    </>
  ),
  check: <path d="M5 12.5l4.2 4.2L19 7" />,
}

type IconProps = {
  name: IconName
  className?: string
  strokeWidth?: number
}

export function Icon({ name, className = 'h-6 w-6', strokeWidth = 1.6 }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      {PATHS[name]}
    </svg>
  )
}
