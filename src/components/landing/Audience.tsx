/**
 * src/components/landing/Audience.tsx — «Кому подойдёт»: три карточки
 * для тех, кто изучает интерфейсы, начинает в разработке и преподаёт.
 */
import { AUDIENCE, CARD_ACCENTS } from '../../constants/landing'
import { Container } from '../ui/Container'
import { IconBadge } from '../ui/IconBadge'
import { Reveal } from '../ui/Reveal'
import { SectionHeading } from '../ui/SectionHeading'

export function Audience() {
  return (
    <section id="audience" className="border-t border-line bg-mist py-20 sm:py-24">
      <Container>
        <Reveal className="flex justify-center">
          <SectionHeading
            eyebrow="Кому подойдёт"
            title="Тем, кто учится и учит"
            description="Мини Фигма — учебный проект. Он пригодится, если хочется понять, как устроен графический редактор изнутри."
          />
        </Reveal>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {AUDIENCE.map((item, index) => {
            const accent = CARD_ACCENTS[item.icon]
            return (
              <Reveal key={item.id} delay={index * 110} className="h-full">
                <article className="flex h-full flex-col rounded-2xl border border-line bg-paper p-7 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_28px_60px_-36px_rgba(13,13,13,0.4)]">
                  <IconBadge name={item.icon} chip={accent.chip} glyph={accent.glyph} />
                  <h3 className="mt-5 text-xl font-bold tracking-[-0.015em] text-ink">
                    {item.title}
                  </h3>
                  <p className="mt-2.5 text-body leading-relaxed text-muted">{item.text}</p>
                </article>
              </Reveal>
            )
          })}
        </div>
      </Container>
    </section>
  )
}
