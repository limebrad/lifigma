/**
 * src/landing/App.tsx — собирает посадочную страницу «Мини Фигма» из секций.
 * Сам редактор живёт на отдельной странице (src/editor/EditorApp.tsx),
 * поэтому здесь подключаются только секции лендинга.
 */
import { Audience } from '../components/landing/Audience'
import { Faq } from '../components/landing/Faq'
import { Features } from '../components/landing/Features'
import { FinalCta } from '../components/landing/FinalCta'
import { Hero } from '../components/landing/Hero'
import { Showcase } from '../components/landing/Showcase'
import { SiteFooter } from '../components/landing/SiteFooter'
import { SiteHeader } from '../components/landing/SiteHeader'
import { Steps } from '../components/landing/Steps'

export function App() {
  return (
    <div id="top" className="flex min-h-screen flex-col bg-paper text-ink">
      {/* Ссылка для быстрого перехода к контенту с клавиатуры */}
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60] focus:rounded-full focus:bg-ink focus:px-5 focus:py-2.5 focus:text-sm focus:font-semibold focus:text-paper focus:outline-none focus:ring-2 focus:ring-brand-violet focus:ring-offset-2"
      >
        Перейти к содержимому
      </a>

      <SiteHeader />

      <main id="main" className="flex-1">
        <Hero />
        <Features />
        <Steps />
        <Showcase />
        <Audience />
        <Faq />
        <FinalCta />
      </main>

      <SiteFooter />
    </div>
  )
}
