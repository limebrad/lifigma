/**
 * src/components/ui/SectionHeading.tsx — единый заголовок секции:
 * надзаголовок (eyebrow), крупный h2 и поясняющий абзац.
 */
type SectionHeadingProps = {
  eyebrow?: string
  title: string
  description?: string
  className?: string
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  className = '',
}: SectionHeadingProps) {
  return (
    <div className={`flex max-w-2xl flex-col items-center gap-4 text-center ${className}`}>
      {eyebrow ? (
        <span className="text-caption font-semibold uppercase tracking-[0.14em] text-brand-violet-deep">
          {eyebrow}
        </span>
      ) : null}
      <h2 className="text-balance text-3xl font-extrabold leading-[1.08] tracking-[-0.02em] text-ink sm:text-4xl md:text-display">
        {title}
      </h2>
      {description ? (
        <p className="text-pretty text-base leading-relaxed text-muted sm:text-lead">
          {description}
        </p>
      ) : null}
    </div>
  )
}
