import type { Demo, Image, ToolMark, WorkChapter, WorkItem } from './schema'
import { site } from './site'
import { method } from './method'
import { tools } from './tools'
import {
  apps,
  bookingPages,
  caseStudies,
  experiments,
  featuredProject,
  funnelPages,
  ghlWorkflows,
  processDoc,
  sampleSites,
  screens,
  sideProjects,
  workCount,
} from './work'

/**
 * Home page copy. The hero pairs a thin line with a bold one. The bold line is sized in `cqi` in
 * features/home/hero/hero.css so it fills the column: re-measure it when you change the words
 * (see the comment on `.hero__title` there).
 */
export const homeHero = {
  headlineThin: 'Autonomous operations.',
  headlineBold: 'Built to scale.',
  subhead: 'Production-grade n8n automations, custom AI agents, and high-converting GoHighLevel systems engineered to eliminate bottlenecks and accelerate revenue.',
  cta: { label: 'Explore Workflows', to: '/work/screens' },
}

/**
 * The statement under the hero: words light up as the page scrolls, each keyword lands bold and
 * moves the tracker. Replace the words, keep four keywords (the tracker shows them in order).
 * A string is plain words; `{ key }` is a keyword.
 */
export type ManifestoPart = string | { key: string }

export const homeManifesto = {
  eyebrow: method.eyebrow,
  parts: [
    'We build systems that turn manual',
    { key: 'chaos' },
    'into autonomous',
    { key: 'predictability.' },
    'From intelligent AI lead intake to',
    { key: 'multi-channel' },
    'CRM synchronization, your business runs 24/7 without',
    { key: 'friction.' },
  ] satisfies ManifestoPart[],
}

export const homeSections = {
  work: {
    eyebrow: 'Selected work',
    title: 'Builds you can open right now.',
  },
  proof: {
    eyebrow: 'Proof',
    title: 'What I run for clients today.',
  },
  objections: {
    eyebrow: 'Before you write',
    title: 'The three questions everyone asks.',
  },
}

export const ctaBand = {
  title: 'Tell me what is eating your week.',
  body: 'Share your current manual bottleneck or integration roadblock. We will map a high-ROI automated pipeline designed for zero data loss.',
  button: 'Email me your question',
}

/* ---------- Work section ---------- */

/** Full-size covers, 1800x1125, with 480 / 640 / 960 copies for the Work tiles (scripts/make-image-variants.py). */
const cover = (id: string, label: string, noun = 'page'): Image => ({
  src: `/images/covers/${id}.webp`,
  alt: `${label} ${noun}`,
  width: 1800,
  height: 1125,
  srcSet: [480, 640, 960].map((w) => `/images/covers/${w}/${id}.webp ${w}w`).join(', ') + `, /images/covers/${id}.webp 1800w`,
})
/** Workspace screens, 1600x900, with 480 / 640 / 960 copies for the Work tile (scripts/make-image-variants.py). */
const screen = (id: string, alt: string, width: number, height: number): Image => ({
  src: `/images/screens/${id}.webp`,
  alt,
  width,
  height,
  srcSet: [480, 640, 960].map((w) => `/images/screens/${w}/${id}.webp ${w}w`).join(', ') + `, /images/screens/${id}.webp ${width}w`,
})

/** A live demo page as a showcase item, with its full-size cover. */
const demoItem =
  (group: string) =>
  (demo: Demo): WorkItem => ({
    id: demo.id,
    name: demo.label,
    kicker: demo.tag,
    group,
    summary: demo.summary,
    image: demo.image ?? cover(demo.id, demo.label),
    href: demo.href,
    status: demo.status,
  })

const groupItems = (groups: typeof sideProjects): WorkItem[] =>
  groups.flatMap((group) =>
    group.builds.map((build) => ({
      id: build.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      name: build.name,
      kicker: group.title,
      summary: build.summary,
      stack: build.stack,
      status: build.status,
    })),
  )

/** The site's own mark for the Experiments card. The card ground is always light. */
const siteMark: ToolMark = { name: site.brand, logo: site.logo.light }

/** The URL of a chapter's showcase sheet. Real, shareable and in the sitemap. */
export const chapterPath = (id: string) => `/work/${id}`

const sideProjectItems = groupItems(sideProjects)
const experimentItems = groupItems(experiments)

export const workSection = {
  ...homeSections.work,
  /** The title as one display line in the hero's thin + bold pairing. */
  titleThin: 'Builds you can',
  titleBold: 'open right now.',
  all: { label: `See all ${workCount} builds`, to: '/work' },
}

const screenItems: WorkItem[] = screens.map((s) => ({
  id: s.id,
  name: s.name,
  kicker: s.kicker,
  summary: s.summary,
  image: s.image ?? screen(s.id, `${s.name}, a workspace screen`, 1600, 900),
  status: s.status,
}))

/**
 * The Work chapters, in bento order. Add, remove or reorder a chapter here; the bento, the sheets and
 * the sitemap follow (the bento's grid areas in work.css are keyed by chapter id). A chapter with a
 * `lead` is a single build; one with no landscape picture shows its `marks` as a logo face instead.
 */
export const workChapters: WorkChapter[] = [
  {
    id: 'featured',
    title: 'Featured Project',
    line: 'AI Job Scraper & ATS Resume Optimizer (22-Node Pipeline).',
    count: 1,
    unit: 'project',
    description: 'An autonomous recruitment pipeline that scrapes job listings from Slack, validates queries, and generates ATS-optimized resumes.',
    marks: [tools.toolA, siteMark],
    items: [],
    lead: featuredProject.gallery[0] ?? cover('featured-project', featuredProject.title, 'cover'),
    gallery: featuredProject.gallery,
    link: featuredProject.link,
  },
  {
    id: 'case-studies',
    title: 'Case Studies',
    line: 'Proven ROI turnarounds: Paid search grants, autonomous operations & CRM.',
    count: caseStudies.length,
    unit: 'cases',
    description: 'Google Ad Grants 14% CTR turnaround for non-profit, autonomous email triage saving 2-3 hours daily, and Airbnb RAG guest concierge.',
    marks: [tools.toolL, tools.toolB, tools.toolA],
    items: caseStudies.map((study) => ({
      id: study.id,
      name: study.title,
      kicker: 'Case study',
      summary: study.summary,
      image: study.image ?? cover(study.id, study.title, 'cover'),
      href: study.link.href,
    })),
  },
  {
    id: 'process',
    title: 'CRM Architecture',
    line: 'GoHighLevel CRM & Pipeline Architecture blueprint.',
    count: processDoc.gallery.length,
    unit: 'blueprints',
    description: 'Production technical architecture: Multi-stage deal pipelines, custom data schemas, smart list lifecycle segmentation, and omnichannel follow-up cadences.',
    marks: [tools.toolB, tools.toolD, tools.toolJ],
    items: [],
    lead: processDoc.lead,
    gallery: processDoc.gallery,
    link: processDoc.link,
  },
  {
    id: 'screens',
    title: 'n8n Automations',
    line: 'Production-grade n8n pipelines & autonomous AI agents.',
    count: screenItems.length,
    unit: 'pipelines',
    description: 'Real production canvases: RAG vector synchronization, autonomous inbox zero triage, and ATS resume optimization pipelines.',
    marks: [tools.toolF, tools.toolG, tools.toolH],
    items: screenItems,
  },
  {
    id: 'websites',
    title: 'GoHighLevel & Funnels',
    line: 'Conversion-engineered GoHighLevel websites, funnels & CRM pipelines.',
    count: sampleSites.length + funnelPages.length + bookingPages.length + ghlWorkflows.length,
    unit: 'builds',
    description: 'Production client assets: Real estate lead portals, wellness assessment funnels, local service landing pages, and multi-channel GHL CRM pipelines.',
    tile: {
      src: '/images/ghl/ghl-real-estate-website.jpg',
      alt: 'Property Deals Luxury Real Estate Portal',
      width: 1600,
      height: 900,
    },
    marks: [tools.toolB, tools.toolH, tools.toolI],
    items: [
      ...sampleSites.map(demoItem('Websites & Landing Pages')),
      ...funnelPages.map(demoItem('Sales Funnels & Lead Gen')),
      ...bookingPages.map(demoItem('CRM Architecture & Pipelines')),
      ...ghlWorkflows.map(demoItem('GoHighLevel Automation Workflows')),
    ],
  },
  {
    id: 'apps',
    title: 'Apps and Extensions',
    line: 'Phone apps and browser tools you ship.',
    count: apps.length,
    unit: 'apps',
    description: 'PLACEHOLDER - tell me what to put here: one or two sentences on the apps and extensions you built (under 160 characters).',
    // The tile shows the first app's store shot, cropped from the title bar down (public/images/apps/app-1-tile.webp).
    tile: {
      src: '/images/apps/app-1-tile.webp',
      alt: 'App One store screen',
      width: 540,
      height: 928,
      srcSet: '/images/apps/320/app-1-tile.webp 320w, /images/apps/app-1-tile.webp 540w',
    },
    marks: [tools.toolL, tools.toolA, tools.toolB],
    items: apps.map((app) => ({ id: app.id, name: app.name, kicker: app.kind, summary: app.summary, image: app.image, status: app.status })),
  },
  {
    id: 'side-projects',
    title: 'Side Projects',
    line: 'Things built for fun that taught you something.',
    count: sideProjectItems.length,
    unit: 'builds',
    description: 'PLACEHOLDER - tell me what to put here: one or two sentences on your side projects (under 160 characters).',
    marks: [tools.toolC, tools.toolD, tools.toolE],
    items: sideProjectItems,
  },
  {
    id: 'experiments',
    title: 'Experiments',
    line: 'Small tests, each doing one thing well.',
    count: experimentItems.length,
    unit: 'tests',
    description: 'PLACEHOLDER - tell me what to put here: one or two sentences on your experiments (under 160 characters).',
    marks: [siteMark, tools.toolF],
    items: experimentItems,
  },
]

export const findChapter = (id: string | undefined) => workChapters.find((chapter) => chapter.id === id)
