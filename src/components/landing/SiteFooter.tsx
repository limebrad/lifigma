/**
 * src/components/landing/SiteFooter.tsx — футер: логотип, ссылка «Открыть
 * редактор», навигация по разделам и пояснение про статус проекта.
 */
import { EDITOR_URL, FIGMA_URL, NAV_LINKS } from '../../constants/landing'
import { Container } from '../ui/Container'
import { Logo } from '../ui/Logo'
import { Icon } from '../ui/Icon'

export function SiteFooter() {
  return (
    <footer className="border-t border-line bg-mist">
      <Container className="py-14 sm:py-16">
        <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr_1.1fr]">
          <div>
            <Logo />
            <p className="mt-4 max-w-sm text-body leading-relaxed text-muted">
              Мини Фигма — учебный мини-редактор фигур в браузере: холст с сеткой, фигуры, слои,
              свойства и отмена действий.
            </p>
            <a
              href={EDITOR_URL}
              className="mt-6 inline-flex items-center gap-2 rounded-full border border-line-2 bg-paper px-4 py-2 text-sm font-medium text-ink transition-colors hover:border-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-violet focus-visible:ring-offset-2"
            >
              Открыть редактор
              <Icon name="arrowRight" className="h-4 w-4" />
            </a>
          </div>

          <nav aria-label="Разделы страницы">
            <h2 className="text-caption font-semibold uppercase tracking-[0.14em] text-ink">
              Разделы
            </h2>
            <ul className="mt-4 flex flex-col gap-3">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-body text-muted transition-colors hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-violet focus-visible:ring-offset-2"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h2 className="text-caption font-semibold uppercase tracking-[0.14em] text-ink">
              О проекте
            </h2>
            <p className="mt-4 text-body leading-relaxed text-muted">
              Это самостоятельный учебный проект. Название и интерфейс вдохновлены Figma, но
              проект с ней не связан.
            </p>
            <ul className="mt-4 flex flex-col gap-3">
              <li>
                <a
                  href={FIGMA_URL}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="inline-flex items-center gap-1.5 text-body text-muted transition-colors hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-violet focus-visible:ring-offset-2"
                >
                  Официальный сайт Figma
                  <Icon name="external" className="h-3.5 w-3.5" />
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-line pt-6">
          <p className="text-caption leading-relaxed text-muted">
            Мини Фигма — учебный проект, созданный, чтобы разобраться, как устроен графический
            редактор. Он не является официальным ресурсом Figma и не связан с компанией Figma.
            Figma — товарный знак соответствующего владельца.
          </p>
          <p className="mt-4 text-caption text-muted">
            © {new Date().getFullYear()} Мини Фигма
          </p>
        </div>
      </Container>
    </footer>
  )
}
