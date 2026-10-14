/**
 * src/components/ui/SectionHeading.tsx — единый заголовок секции:
 * надзаголовок (eyebrow), крупный h2 и поясняющий абзац.
 */
type SectionHeadingProps = {
  eyebrow?: string
  title: string
  description?: string
  align?: 'left' | 'center'
  className?: string
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = 'center',
  className = '',
}: SectionHeadingProps) {
  const alignment = align === 'center' ? 'items-center text-center' : 'items-start text-left'

  return (
    <div className={`flex max-w-2xl flex-col gap-4 ${alignment} ${className}`}>
      {eyebrow ? (
        <span className="text-[13px] font-semibold uppercase tracking-[0.14em] text-brand-violet">
          {eyebrow}
        </span>
      ) : null}
      <h2 className="text-balance text-3xl font-extrabold leading-[1.08] tracking-[-0.02em] text-ink sm:text-4xl md:text-[44px]">
        {title}
      </h2>
      {description ? (
        <p className="text-pretty text-base leading-relaxed text-muted sm:text-[17px]">
          {description}
        </p>
      ) : null}
    </div>
  )
}
