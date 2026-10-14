/**
 * src/components/landing/Features.tsx — блок преимуществ: четыре карточки
 * с иконкой, заголовком и коротким описанием.
 */
import { FEATURES } from '../../constants/landing'
import type { FeatureIcon } from '../../types/landing'
import { Container } from '../ui/Container'
import { Icon } from '../ui/Icon'
import { Reveal } from '../ui/Reveal'
import { SectionHeading } from '../ui/SectionHeading'

const ACCENTS: Record<FeatureIcon, { chip: string; glyph: string }> = {
  grid: { chip: 'bg-brand-violet/12', glyph: '#a259ff' },
  shapes: { chip: 'bg-brand-blue/12', glyph: '#0e9fd6' },
  layers: { chip: 'bg-brand-green/12', glyph: '#0a9d68' },
  undo: { chip: 'bg-brand-orange/12', glyph: '#e5533d' },
}

export function Features() {
  return (
    <section id="features" className="border-t border-line bg-paper py-20 sm:py-24">
      <Container>
        <Reveal className="flex justify-center">
          <SectionHeading
            eyebrow="Возможности"
            title="Что умеет редактор"
            description="Небольшой, но настоящий редактор: холст с камерой, фигуры, слои, свойства и история действий — всё работает прямо в браузере."
          />
        </Reveal>

        <div className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map((feature, index) => {
            const accent = ACCENTS[feature.icon]
            return (
              <Reveal key={feature.id} delay={index * 90}>
                <article className="group h-full rounded-2xl border border-line bg-paper p-6 transition-all duration-300 hover:-translate-y-1 hover:border-line-2 hover:shadow-[0_24px_50px_-30px_rgba(13,13,13,0.35)]">
                  <span
                    className={`inline-flex h-12 w-12 items-center justify-center rounded-xl ${accent.chip}`}
                    style={{ color: accent.glyph }}
                  >
                    <Icon name={feature.icon} className="h-6 w-6" />
                  </span>
                  <h3 className="mt-5 text-[17px] font-bold leading-snug tracking-[-0.01em] text-ink">
                    {feature.title}
                  </h3>
                  <p className="mt-2.5 text-[15px] leading-relaxed text-muted">{feature.text}</p>
                </article>
              </Reveal>
            )
          })}
        </div>
      </Container>
    </section>
  )
}
