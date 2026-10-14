/**
 * src/components/landing/Features.tsx — блок преимуществ: четыре карточки
 * с иконкой, заголовком и коротким описанием.
 */
import { CARD_ACCENTS, FEATURES } from '../../constants/landing'
import { Container } from '../ui/Container'
import { IconBadge } from '../ui/IconBadge'
import { Reveal } from '../ui/Reveal'
import { SectionHeading } from '../ui/SectionHeading'

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
            const accent = CARD_ACCENTS[feature.icon]
            return (
              <Reveal key={feature.id} delay={index * 90}>
                <article className="group h-full rounded-2xl border border-line bg-paper p-6 transition-all duration-300 hover:-translate-y-1 hover:border-line-2 hover:shadow-[0_24px_50px_-30px_rgba(13,13,13,0.35)]">
                  <IconBadge name={feature.icon} chip={accent.chip} glyph={accent.glyph} />
                  <h3 className="mt-5 text-lead font-bold leading-snug tracking-[-0.01em] text-ink">
                    {feature.title}
                  </h3>
                  <p className="mt-2.5 text-body leading-relaxed text-muted">{feature.text}</p>
                </article>
              </Reveal>
            )
          })}
        </div>
      </Container>
    </section>
  )
}
