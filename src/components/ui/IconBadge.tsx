/**
 * src/components/ui/IconBadge.tsx — цветная плашка с иконкой для карточек
 * лендинга (возможности и аудитория). Цвета приходят из контента
 * (CARD_ACCENTS), поэтому секции не дублируют одни и те же классы.
 */
import type { IconName } from './Icon'
import { Icon } from './Icon'

type IconBadgeProps = {
  name: IconName
  /** Классы фона плашки (например, bg-brand-violet/12). */
  chip: string
  /** Цвет иконки. */
  glyph: string
}

export function IconBadge({ name, chip, glyph }: IconBadgeProps) {
  return (
    <span
      className={`inline-flex h-12 w-12 items-center justify-center rounded-xl ${chip}`}
      style={{ color: glyph }}
    >
      <Icon name={name} className="h-6 w-6" />
    </span>
  )
}
