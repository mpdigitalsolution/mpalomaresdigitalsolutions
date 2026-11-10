import type { ComponentType } from 'react'
import { AboutSection } from './about/AboutSection'
import { HeroSection } from './hero/HeroSection'
import { AutomationSection } from './automation/AutomationSection'
import { ServicesSection } from './services/ServicesSection'
import { WorkSection } from './work/WorkSection'
import { ShowcaseSection } from '@/features/showcase/ShowcasePage'
import { ProofSection } from '@/features/proof/ProofPage'
import { ContactSection } from '@/features/contact/ContactPage'

/**
 * The Home page, in scroll order. Add a section = build it in its own folder (component + css +
 * scene, copy from src/content) and add one line here. Delete a section = remove its line.
 * Each section renders its own <section id> so it can be linked to with /#<id>.
 */
export type HomeSection = { id: string; Component: ComponentType }

export const homeSectionList: HomeSection[] = [
  { id: 'hero', Component: HeroSection },
  { id: 'services', Component: ServicesSection },
  { id: 'automation', Component: AutomationSection },
  { id: 'work', Component: WorkSection },
  { id: 'about', Component: AboutSection },
  { id: 'proof', Component: ProofSection },
  { id: 'showcase', Component: ShowcaseSection },
  { id: 'contact', Component: ContactSection },
]
