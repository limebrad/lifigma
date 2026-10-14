/**
 * src/components/landing/Showcase.tsx — визуальная демонстрация: три карточки
 * с иллюстрациями рабочего процесса в Figma.
 */
import { SHOWCASE } from '../../constants/landing'
import { Container } from '../ui/Container'
import { Reveal } from '../ui/Reveal'
import { SectionHeading } from '../ui/SectionHeading'
import { ShowcaseVisual } from '../visuals/ShowcaseVisual'

export function Showcase() {
  return (
    <section id="showcase" className="border-t border-line bg-paper py-20 sm:py-24">
      <Container>
        <Reveal className="flex justify-center">
          <SectionHeading
            eyebrow="Возможности"
            title="Всё для продукта — в одной Figma"
            description="Макеты, дизайн-система и прототипы живут в одном файле и работают одинаково в приложении и в браузере."
          />
        </Reveal>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {SHOWCASE.map((item, index) => (
            <Reveal key={item.id} delay={index * 110} className="h-full">
              <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-paper transition-all duration-300 hover:-translate-y-1 hover:border-line-2 hover:shadow-[0_28px_60px_-36px_rgba(13,13,13,0.4)]">
                <div className="border-b border-line bg-mist/70 p-3">
                  <ShowcaseVisual variant={item.variant} />
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <h3 className="text-[17px] font-bold tracking-[-0.01em] text-ink">
                    {item.title}
                  </h3>
                  <p className="mt-2.5 text-[15px] leading-relaxed text-muted">{item.text}</p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  )
}
