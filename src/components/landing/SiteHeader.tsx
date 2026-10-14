/**
 * src/components/landing/SiteHeader.tsx — липкая навигация с логотипом,
 * меню разделов, кнопкой скачивания и мобильным раскрывающимся меню.
 */
import { useEffect, useState } from 'react'
import { FIGMA_URLS, NAV_LINKS } from '../../constants/landing'
import { Button } from '../ui/Button'
import { FigmaLogo } from '../ui/FigmaLogo'
import { Icon } from '../ui/Icon'
import { Container } from '../ui/Container'

export function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false)

  // Escape закрывает мобильное меню — привычное поведение для клавиатуры.
  useEffect(() => {
    if (!menuOpen) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMenuOpen(false)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [menuOpen])

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-paper/80 backdrop-blur-md">
      <Container className="flex h-16 items-center justify-between gap-4 sm:h-[72px]">
        <a
          href="#top"
          className="rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-violet focus-visible:ring-offset-2"
          aria-label="Мини Фигма — на главную"
        >
          <FigmaLogo />
        </a>

        {/* Навигация для широких экранов */}
        <nav aria-label="Основная навигация" className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="rounded-full px-4 py-2 text-[15px] font-medium text-muted transition-colors duration-200 hover:bg-mist hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-violet focus-visible:ring-offset-2"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <Button
            href={FIGMA_URLS.downloads}
            external
            className="hidden sm:inline-flex"
            icon={<Icon name="download" className="h-[18px] w-[18px]" />}
          >
            Скачать
          </Button>

          {/* Кнопка мобильного меню */}
          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-line-2 text-ink transition-colors duration-200 hover:bg-mist focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-violet focus-visible:ring-offset-2 lg:hidden"
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            aria-label={menuOpen ? 'Закрыть меню' : 'Открыть меню'}
          >
            <Icon name={menuOpen ? 'close' : 'menu'} className="h-5 w-5" />
          </button>
        </div>
      </Container>

      {/* Мобильное меню */}
      <div
        id="mobile-menu"
        hidden={!menuOpen}
        className="border-t border-line bg-paper lg:hidden"
      >
        <Container className="py-4">
          <nav aria-label="Мобильная навигация">
            <ul className="flex flex-col">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    onClick={() => setMenuOpen(false)}
                    className="block rounded-xl px-3 py-3 text-base font-medium text-ink transition-colors duration-200 hover:bg-mist focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-violet"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <Button
            href={FIGMA_URLS.downloads}
            external
            size="lg"
            className="mt-3 w-full"
            icon={<Icon name="download" className="h-5 w-5" />}
          >
            Скачать приложение
          </Button>
        </Container>
      </div>
    </header>
  )
}
