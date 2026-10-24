import type { Icon } from '@phosphor-icons/react'
import { Briefcase, Compass, Cube, Envelope, FileText, House, SealCheck, ShieldCheck, Stack, User } from '@phosphor-icons/react'
import { workCount } from '@/content/work'
import { site } from '@/content/site'

/**
 * The route registry: the one list that drives the router, the sidebar, the search palette
 * and every page title. Add a page = add one entry here.
 */

export type NavGroupId = 'menu' | 'discover' | 'general'

export const NAV_GROUPS: { id: NavGroupId; label: string }[] = [
  { id: 'menu', label: 'Menu' },
  { id: 'discover', label: 'Discover' },
  { id: 'general', label: 'General' },
]

export type PageRoute = {
  kind: 'page'
  id: string
  path: string
  /** Short name for the sidebar and search. */
  label: string
  /** Unique document title. */
  title: string
  description: string
  icon: Icon
  /** Omit to keep the page out of the sidebar (legal pages). */
  group?: NavGroupId
  badge?: number
  /** A Home section id: the sidebar and search scroll Home to it instead of opening `path`. */
  section?: string
  /** Still the RouteStage placeholder: kept out of the sitemap (RouteStage also marks it noindex).
   *  Remove when the page is built and registered in router.tsx PAGE_COMPONENTS. */
  draft?: true
}

export type ExternalRoute = {
  kind: 'external'
  id: string
  href: string
  label: string
  description: string
  icon: Icon
  group: NavGroupId
}

export type NavEntry = PageRoute | ExternalRoute

/** Every page title ends with your name (content/site.ts). */
const SUFFIX = site.name

export const pages: PageRoute[] = [
  {
    kind: 'page',
    id: 'home',
    path: '/',
    label: 'Home',
    title: `${SUFFIX} | Your Headline Here`,
    description: 'PLACEHOLDER - tell me what to put here: the one-sentence search result description of you and what you do (under 160 characters).',
    icon: House,
    group: 'menu',
  },
  {
    kind: 'page',
    id: 'portal',
    path: '/portal',
    label: 'Client Portal',
    title: `Client Portal | ${SUFFIX}`,
    description: 'Private client portal for onboarding, contract e-signing, invoice settlements, deliverable approvals, and 2-way direct messaging.',
    icon: ShieldCheck,
    group: 'menu',
  },
  {
    kind: 'page',
    id: 'work',
    draft: true,
    path: '/work',
    label: 'Work',
    title: `Work | ${SUFFIX}`,
    description: 'PLACEHOLDER - tell me what to put here: one line on the kinds of work you show.',
    icon: Briefcase,
    group: 'menu',
    badge: workCount,
    section: 'work',
  },
  {
    kind: 'page',
    id: 'services',
    draft: true,
    path: '/services',
    label: 'Services',
    title: `Services | ${SUFFIX}`,
    description: 'PLACEHOLDER - tell me what to put here: one line listing the services you offer.',
    icon: Stack,
    group: 'menu',
    section: 'services',
  },
  {
    kind: 'page',
    id: 'about',
    draft: true,
    path: '/about',
    label: 'About',
    title: `About ${SUFFIX}`,
    description: 'PLACEHOLDER - tell me what to put here: one line on your background and where you are based.',
    icon: User,
    group: 'menu',
    section: 'about',
  },
  {
    kind: 'page',
    id: 'proof',
    path: '/proof',
    label: 'Proof',
    title: `Proof | ${SUFFIX}`,
    description: 'PLACEHOLDER - tell me what to put here: one line on the clients, testimonials and feedback this page shows.',
    icon: SealCheck,
    group: 'discover',
    section: 'proof',
  },
  {
    kind: 'page',
    id: 'showcase',
    path: '/showcase',
    label: 'Showcase',
    title: `Showcase | ${SUFFIX}`,
    description: 'PLACEHOLDER - tell me what to put here: one line on the product or project you feature here.',
    icon: Cube,
    group: 'discover',
    section: 'showcase',
  },
  {
    kind: 'page',
    id: 'contact',
    path: '/contact',
    label: 'Contact',
    title: `Contact | ${SUFFIX}`,
    description: 'PLACEHOLDER - tell me what to put here: one line inviting people to get in touch, and when you reply.',
    icon: Envelope,
    group: 'general',
    section: 'contact',
  },
  {
    kind: 'page',
    id: 'resource',
    path: '/work',
    label: 'Resources',
    title: `Resources & Builds | ${SUFFIX}`,
    description: 'Explore live systems, GoHighLevel funnels, n8n automations, and browser extensions.',
    icon: Compass,
    group: 'discover',
    section: 'work',
  },
  {
    kind: 'page',
    id: 'privacy',
    path: '/privacy',
    label: 'Privacy Policy',
    title: `Privacy Policy | ${SUFFIX}`,
    description: 'What this site stores, what it does not, and how to ask for your data.',
    icon: ShieldCheck,
  },
  {
    kind: 'page',
    id: 'terms',
    path: '/terms',
    label: 'Terms of Service',
    title: `Terms of Service | ${SUFFIX}`,
    description: 'The terms for using this portfolio site.',
    icon: FileText,
  },
]

export const externals: ExternalRoute[] = []

/** Sidebar entries per group, in registry order (pages first, then external links). */
export function navEntries(group: NavGroupId): NavEntry[] {
  return [...pages.filter((p) => p.group === group), ...externals.filter((e) => e.group === group)]
}

/** Where a nav entry goes: its Home section when it has one, else its page. */
export function navTarget(page: PageRoute): string {
  return page.section ? `/#${page.section}` : page.path
}

export const notFoundTitle = `Page Not Found | ${SUFFIX}`
