/**
 * src/components/landing/Hero.tsx — первый экран: заголовок, пояснение,
 * кнопка скачивания и крупный визуал приложения.
 */
import { FIGMA_URLS } from '../../constants/landing'
import { Button } from '../ui/Button'
import { Container } from '../ui/Container'
import { Icon } from '../ui/Icon'
import { Reveal } from '../ui/Reveal'
import { EditorWindow } from '../visuals/EditorWindow'

const META = ['macOS и Windows', 'Бесплатный стартовый план', 'Общие файлы с веб-версией']

export function Hero() {
  return (
    <section id="hero" className="relative overflow-hidden pb-20 pt-12 sm:pt-16 lg:pb-28 lg:pt-20">
      {/* Мягкий фон: без ярких градиентов, только свет и сетка */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,#ffffff_0%,#fbfbfb_60%,#f7f7f7_100%)]" />
        <div className="absolute -left-24 top-0 h-[420px] w-[420px] rounded-full bg-brand-violet/10 blur-[130px]" />
        <div className="absolute -right-16 top-24 h-[380px] w-[380px] rounded-full bg-brand-blue/10 blur-[130px]" />
        <div className="absolute inset-0 opacity-[0.5] [background-image:linear-gradient(#00000008_1px,transparent_1px),linear-gradient(90deg,#00000008_1px,transparent_1px)] [background-size:56px_56px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]" />
      </div>

      <Container>
        <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.08fr)] lg:gap-12">
          <Reveal className="flex flex-col items-start">
            <span className="inline-flex items-center gap-2 rounded-full border border-line-2 bg-paper/70 px-3.5 py-1.5 text-[13px] font-medium text-muted">
              <span className="h-1.5 w-1.5 rounded-full bg-brand-green" />
              Настольное приложение Figma для macOS и Windows
            </span>

            <h1 className="mt-6 text-[40px] font-extrabold leading-[1.05] tracking-[-0.03em] text-ink sm:text-[56px] lg:text-[64px]">
              Твори. Проектируй.
              <br />
              <span className="bg-[linear-gradient(100deg,#a259ff,#1abcfe)] bg-clip-text text-transparent">
                Воплощай идеи.
              </span>
            </h1>

            <p className="mt-6 max-w-xl text-pretty text-lg leading-relaxed text-muted">
              desktop-figma — пространство для создания интерфейсов, прототипов и совместной
              работы над дизайн-проектами прямо на компьютере.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Button
                href={FIGMA_URLS.downloads}
                external
                size="lg"
                icon={
                  <Icon
                    name="download"
                    className="h-5 w-5 transition-transform duration-200 group-hover:translate-y-0.5"
                  />
                }
              >
                Скачать desktop-figma
              </Button>
              <a
                href="#features"
                className="group inline-flex h-13 items-center justify-center gap-2 rounded-full px-6 text-base font-semibold text-ink transition-colors duration-200 hover:bg-mist focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-violet focus-visible:ring-offset-2"
              >
                Узнать о преимуществах
                <Icon
                  name="arrowRight"
                  className="h-5 w-5 text-muted transition-transform duration-200 group-hover:translate-x-0.5 group-hover:text-ink"
                />
              </a>
            </div>

            <p className="mt-5 text-sm text-faint">
              Официальная загрузка с сайта{' '}
              <a
                href={FIGMA_URLS.downloads}
                target="_blank"
                rel="noreferrer noopener"
                className="font-medium text-muted underline decoration-line-2 underline-offset-4 transition-colors hover:text-ink"
              >
                figma.com
              </a>
            </p>

            <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2 border-t border-line pt-6">
              {META.map((item) => (
                <li key={item} className="flex items-center gap-2 text-sm text-muted">
                  <Icon name="check" className="h-4 w-4 text-brand-green" strokeWidth={2.2} />
                  {item}
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal delay={140} className="relative">
            <div
              aria-hidden="true"
              className="absolute inset-6 -z-10 rounded-[32px] bg-[linear-gradient(135deg,#a259ff14,#1abcfe14)] blur-2xl"
            />
            <div className="animate-float rounded-[18px] shadow-[0_40px_90px_-40px_rgba(13,13,13,0.45)]">
              <EditorWindow />
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  )
}
