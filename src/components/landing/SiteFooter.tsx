/**
 * src/components/landing/SiteFooter.tsx — футер: логотип, ссылки на разделы и
 * на официальные ресурсы Figma, а также пояснение про статус этой страницы.
 */
import { FIGMA_URLS, NAV_LINKS } from '../../constants/landing'
import { Container } from '../ui/Container'
import { FigmaLogo } from '../ui/FigmaLogo'
import { Icon } from '../ui/Icon'

export function SiteFooter() {
  return (
    <footer className="border-t border-line bg-mist">
      <Container className="py-14 sm:py-16">
        <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <FigmaLogo />
            <p className="mt-4 max-w-sm text-[15px] leading-relaxed text-muted">
              Промостраница о настольном приложении Figma: рассказываем, зачем ставить его на
              компьютер и как это сделать за пару минут.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a
                href={FIGMA_URLS.downloads}
                target="_blank"
                rel="noreferrer noopener"
                className="inline-flex items-center gap-2 rounded-full border border-line-2 bg-paper px-4 py-2 text-sm font-medium text-ink transition-colors hover:border-ink hover:bg-paper focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-violet focus-visible:ring-offset-2"
              >
                Скачать приложение
                <Icon name="download" className="h-4 w-4" />
              </a>
            </div>
          </div>

          <nav aria-label="Разделы страницы">
            <h2 className="text-[13px] font-semibold uppercase tracking-[0.14em] text-faint">
              Разделы
            </h2>
            <ul className="mt-4 flex flex-col gap-3">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-[15px] text-muted transition-colors hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-violet focus-visible:ring-offset-2"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Ресурсы Figma">
            <h2 className="text-[13px] font-semibold uppercase tracking-[0.14em] text-faint">
              Figma
            </h2>
            <ul className="mt-4 flex flex-col gap-3">
              <li>
                <a
                  href={FIGMA_URLS.home}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="inline-flex items-center gap-1.5 text-[15px] text-muted transition-colors hover:text-ink"
                >
                  Официальный сайт
                  <Icon name="external" className="h-3.5 w-3.5" />
                </a>
              </li>
              <li>
                <a
                  href={FIGMA_URLS.help}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="inline-flex items-center gap-1.5 text-[15px] text-muted transition-colors hover:text-ink"
                >
                  Справочный центр
                  <Icon name="external" className="h-3.5 w-3.5" />
                </a>
              </li>
              <li>
                <a
                  href={FIGMA_URLS.privacy}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="inline-flex items-center gap-1.5 text-[15px] text-muted transition-colors hover:text-ink"
                >
                  Политика конфиденциальности
                  <Icon name="external" className="h-3.5 w-3.5" />
                </a>
              </li>
            </ul>
          </nav>
        </div>

        <div className="mt-12 border-t border-line pt-6">
          <p className="text-[13px] leading-relaxed text-faint">
            Этот сайт — информационная промостраница о настольном приложении Figma. Он не
            является официальным ресурсом Figma и не принадлежит компании Figma. Все права на
            Figma, её логотип и интерфейс принадлежат их владельцам. Приложение загружается
            только с официального сайта{' '}
            <a
              href={FIGMA_URLS.downloads}
              target="_blank"
              rel="noreferrer noopener"
              className="font-medium text-muted underline decoration-line-2 underline-offset-4 hover:text-ink"
            >
              figma.com/downloads
            </a>
            .
          </p>
          <p className="mt-4 text-[13px] text-faint">
            © {new Date().getFullYear()} Мини Фигма
          </p>
        </div>
      </Container>
    </footer>
  )
}
