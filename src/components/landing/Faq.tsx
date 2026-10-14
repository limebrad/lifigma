/**
 * src/components/landing/Faq.tsx — раскрывающийся аккордеон с частыми вопросами.
 * Реализован на <button aria-expanded> + плавное раскрытие через grid-rows,
 * поэтому доступен с клавиатуры и для скринридеров.
 */
import { useState } from 'react'
import { FAQ, FIGMA_URLS } from '../../constants/landing'
import { Container } from '../ui/Container'
import { Icon } from '../ui/Icon'
import { Reveal } from '../ui/Reveal'
import { SectionHeading } from '../ui/SectionHeading'

export function Faq() {
  const [openId, setOpenId] = useState<string | null>(FAQ[0]?.id ?? null)

  return (
    <section id="faq" className="border-t border-line bg-paper py-20 sm:py-24">
      <Container>
        <Reveal className="flex justify-center">
          <SectionHeading
            eyebrow="Вопросы"
            title="Отвечаем на главное"
            description="Коротко о том, зачем ставить приложение и как это сделать."
          />
        </Reveal>

        <div className="mx-auto mt-12 max-w-3xl">
          <ul className="flex flex-col gap-3">
            {FAQ.map((item, index) => {
              const isOpen = openId === item.id
              const buttonId = `faq-button-${item.id}`
              const panelId = `faq-panel-${item.id}`

              return (
                <Reveal
                  as="li"
                  key={item.id}
                  delay={index * 60}
                  className="overflow-hidden rounded-2xl border border-line bg-paper transition-colors duration-200 hover:border-line-2"
                >
                  <h3 className="m-0">
                    <button
                      type="button"
                      id={buttonId}
                      aria-expanded={isOpen}
                      aria-controls={panelId}
                      onClick={() => setOpenId(isOpen ? null : item.id)}
                      className="flex w-full items-center justify-between gap-4 px-5 py-5 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-brand-violet sm:px-6"
                    >
                      <span className="text-[16px] font-semibold leading-snug text-ink sm:text-[17px]">
                        {item.question}
                      </span>
                      <span
                        aria-hidden="true"
                        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-line text-muted transition-all duration-300 ${
                          isOpen ? 'rotate-180 border-ink bg-ink text-paper' : ''
                        }`}
                      >
                        <Icon name="chevron" className="h-4 w-4" strokeWidth={2} />
                      </span>
                    </button>
                  </h3>

                  <div
                    id={panelId}
                    role="region"
                    aria-labelledby={buttonId}
                    aria-hidden={!isOpen}
                    className="accordion-panel"
                    data-open={isOpen}
                  >
                    <div>
                      <p className="px-5 pb-5 text-[15px] leading-relaxed text-muted sm:px-6">
                        {item.answer}
                      </p>
                    </div>
                  </div>
                </Reveal>
              )
            })}
          </ul>

          <p className="mt-8 text-center text-[15px] text-muted">
            Не нашли ответ?{' '}
            <a
              href={FIGMA_URLS.help}
              target="_blank"
              rel="noreferrer noopener"
              className="inline-flex items-center gap-1.5 font-semibold text-ink underline decoration-line-2 underline-offset-4 transition-colors hover:decoration-ink"
            >
              Справочный центр Figma
              <Icon name="external" className="h-4 w-4" />
            </a>
          </p>
        </div>
      </Container>
    </section>
  )
}
