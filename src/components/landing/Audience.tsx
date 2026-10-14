/**
 * src/components/landing/Audience.tsx — «Для кого подойдёт Figma Desktop»:
 * три карточки для начинающих, профессионалов и команд.
 */
import { AUDIENCE } from '../../constants/landing'
import type { AudienceIcon } from '../../types/landing'
import { Container } from '../ui/Container'
import { Icon } from '../ui/Icon'
import { Reveal } from '../ui/Reveal'
import { SectionHeading } from '../ui/SectionHeading'

const ACCENTS: Record<AudienceIcon, { chip: string; glyph: string }> = {
  spark: { chip: 'bg-brand-violet/12', glyph: '#a259ff' },
  gem: { chip: 'bg-brand-blue/12', glyph: '#0e9fd6' },
  team: { chip: 'bg-brand-green/12', glyph: '#0a9d68' },
}

export function Audience() {
  return (
    <section id="audience" className="border-t border-line bg-mist py-20 sm:py-24">
      <Container>
        <Reveal className="flex justify-center">
          <SectionHeading
            eyebrow="Кому подойдёт"
            title="Пригодится и новичку, и большой команде"
            description="Одна Figma закрывает задачи на любом уровне — от первого макета до продукта в разработке."
          />
        </Reveal>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {AUDIENCE.map((item, index) => {
            const accent = ACCENTS[item.icon]
            return (
              <Reveal key={item.id} delay={index * 110} className="h-full">
                <article className="flex h-full flex-col rounded-2xl border border-line bg-paper p-7 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_28px_60px_-36px_rgba(13,13,13,0.4)]">
                  <span
                    className={`inline-flex h-12 w-12 items-center justify-center rounded-xl ${accent.chip}`}
                    style={{ color: accent.glyph }}
                  >
                    <Icon name={item.icon} className="h-6 w-6" />
                  </span>
                  <h3 className="mt-5 text-xl font-bold tracking-[-0.015em] text-ink">
                    {item.title}
                  </h3>
                  <p className="mt-2.5 text-[15px] leading-relaxed text-muted">{item.text}</p>
                </article>
              </Reveal>
            )
          })}
        </div>
      </Container>
    </section>
  )
}
