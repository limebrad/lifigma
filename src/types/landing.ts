/**
 * src/types/landing.ts — типы контента лендинга desktop-figma.
 * Здесь описан «язык» страницы: пункты меню, преимущества, шаги, FAQ.
 */

export type NavLink = {
  href: string
  label: string
}

export type FeatureIcon = 'window' | 'type' | 'users' | 'prototype'

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

export type ShowcaseVariant = 'layouts' | 'components' | 'prototypes'

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
