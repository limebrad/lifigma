/**
 * src/types/landing.ts — типы контента лендинга «Мини Фигма».
 * Здесь описан «язык» страницы: пункты меню, возможности, шаги, FAQ.
 */

export type NavLink = {
  href: string
  label: string
}

export type FeatureIcon = 'grid' | 'shapes' | 'layers' | 'undo'

export type Feature = {
  id: string
  icon: FeatureIcon
  title: string
  text: string
}

export type Step = {
  number: string
  title: string
  text: string
}

export type ShowcaseVariant = 'shapes' | 'navigation' | 'panels'

export type ShowcaseItem = {
  id: string
  title: string
  text: string
  variant: ShowcaseVariant
}

export type AudienceIcon = 'spark' | 'gem' | 'team'

export type Audience = {
  id: string
  icon: AudienceIcon
  title: string
  text: string
}

export type FaqItem = {
  id: string
  question: string
  answer: string
}
