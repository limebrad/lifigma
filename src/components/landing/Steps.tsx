/**
 * src/components/landing/Steps.tsx — «Три шага до первого проекта»:
 * горизонтальная последовательность с иллюстрациями.
 */
import { STEPS } from '../../constants/landing'
import { Container } from '../ui/Container'
import { Icon } from '../ui/Icon'
import { Reveal } from '../ui/Reveal'
import { SectionHeading } from '../ui/SectionHeading'
import { StepVisual } from '../visuals/StepVisual'

export function Steps() {
  return (
    <section id="steps" className="border-t border-line bg-mist py-20 sm:py-24">
      <Container>
        <Reveal className="flex justify-center">
          <SectionHeading
            eyebrow="Как начать"
            title="Три шага до первого проекта"
            description="От загрузки до первого макета — установка занимает пару минут."
          />
        </Reveal>

        <ol className="mt-14 grid items-stretch gap-6 lg:grid-cols-3">
          {STEPS.map((step, index) => (
            <li key={step.number} className="relative">
              <Reveal delay={index * 110} className="h-full">
                <article className="flex h-full flex-col rounded-2xl border border-line bg-paper p-5 transition-shadow duration-300 hover:shadow-[0_24px_50px_-34px_rgba(13,13,13,0.4)]">
                  <div className="rounded-xl bg-mist p-3">
                    <StepVisual index={index} />
                  </div>
                  <div className="mt-5 flex items-center gap-3">
                    <span className="text-2xl font-extrabold tracking-tight text-ink">
                      {step.number}
                    </span>
                    <span aria-hidden="true" className="h-px flex-1 bg-line" />
                  </div>
                  <h3 className="mt-3 text-lg font-bold tracking-[-0.01em] text-ink">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-[15px] leading-relaxed text-muted">{step.text}</p>
                </article>
              </Reveal>

              {index < STEPS.length - 1 ? (
                <span
                  aria-hidden="true"
                  className="absolute -right-[22px] top-1/2 hidden h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-line bg-paper text-line-2 lg:flex"
                >
                  <Icon name="arrowRight" className="h-5 w-5" strokeWidth={2} />
                </span>
              ) : null}
            </li>
          ))}
        </ol>
      </Container>
    </section>
  )
}
