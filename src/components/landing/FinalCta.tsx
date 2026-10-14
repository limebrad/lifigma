/**
 * src/components/landing/FinalCta.tsx — выразительный финальный призыв
 * к действию на тёмном фоне.
 */
import { FIGMA_URLS } from '../../constants/landing'
import { Button } from '../ui/Button'
import { Container } from '../ui/Container'
import { Icon } from '../ui/Icon'
import { Reveal } from '../ui/Reveal'

export function FinalCta() {
  return (
    <section className="relative overflow-hidden bg-ink py-20 text-paper sm:py-28">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute -left-20 top-0 h-[360px] w-[360px] rounded-full bg-brand-violet/25 blur-[120px]" />
        <div className="absolute -right-10 bottom-0 h-[340px] w-[340px] rounded-full bg-brand-blue/20 blur-[120px]" />
        <div className="absolute left-1/2 top-0 h-[300px] w-[300px] -translate-x-1/2 rounded-full bg-brand-red/10 blur-[130px]" />
        <div className="absolute inset-0 opacity-[0.14] [background-image:linear-gradient(#ffffff_1px,transparent_1px),linear-gradient(90deg,#ffffff_1px,transparent_1px)] [background-size:60px_60px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_72%)]" />
      </div>

      <Container>
        <Reveal className="relative flex flex-col items-center text-center">
          <h2 className="max-w-3xl text-balance text-4xl font-extrabold leading-[1.06] tracking-[-0.03em] sm:text-5xl md:text-[56px]">
            Твои идеи заслуживают воплощения
          </h2>
          <p className="mt-5 max-w-xl text-pretty text-lg leading-relaxed text-white/70">
            Скачай desktop-figma и преврати задумки в реальные дизайн-проекты.
          </p>

          <div className="mt-9">
            <Button
              href={FIGMA_URLS.downloads}
              external
              variant="light"
              size="lg"
              icon={
                <Icon
                  name="download"
                  className="h-5 w-5 transition-transform duration-200 group-hover:translate-y-0.5"
                />
              }
            >
              Скачать Figma Desktop
            </Button>
          </div>

          <p className="mt-5 text-sm text-white/60">Официальная загрузка с сайта Figma</p>
        </Reveal>
      </Container>
    </section>
  )
}
