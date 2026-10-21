import type { AiGroup, AppBuild, Demo, Image, LinkRef } from './schema'

export const workPage = {
  eyebrow: 'Work',
  title: 'Real builds you can open.',
  lede: 'PLACEHOLDER - tell me what to put here: one sentence on what the visitor can open in this section.',
}

/* ---------- Featured project ---------- */

const shot = (file: string, alt: string, width: number, height: number): Image => ({
  src: `/images/work/${file}`,
  alt,
  width,
  height,
})

const n8nShot = (file: string, alt: string): Image => ({
  src: `/images/n8n/${file}`,
  alt,
  width: 1600,
  height: 900,
})

export const featuredProject = {
  kicker: 'Flagship n8n Pipeline',
  title: 'AI Job Scraper & ATS Resume Optimizer',
  summary: 'A 22-node autonomous workflow orchestrated in n8n. Ingests queries via Slack, validates intent with Gemini 3 Flash, pulls real-time listings from RapidAPI with a 1,000-job memory cache, optimizes resumes for ATS algorithms via DeepSeek AI, and clones Google Docs templates with Gmail drafting.',
  link: { label: 'Explore All n8n Workflows', href: '/work/screens', external: false } satisfies LinkRef,
  gallery: [
    n8nShot('job-scraper-canvas.png', 'AI Job Scraper + AI Optimizer 22-node n8n canvas'),
    n8nShot('job-scraper-output.png', 'RapidAPI JSearch query results and Slack payload'),
    n8nShot('cv-optimizer.png', 'Dynamically generated ATS-tailored Google Doc resume'),
    n8nShot('slack-alerts.png', 'Slack notification card with document links and proposals'),
    n8nShot('gmail-triage-canvas.png', 'Autonomous Gmail draft creation and verification'),
    n8nShot('pipeline-overview.png', 'End-to-end multi-stage architecture flow'),
  ],
}

/* ---------- Case studies and the process doc ---------- */

export const caseStudies: { id: string; title: string; summary: string; link: LinkRef }[] = [
  {
    id: 'case-study-1',
    title: '24/7 Autonomous Gmail Operations Hub & Sheets CRM',
    summary: 'Solved inbox overload by triaging incoming emails across 5 categories, drafting context-aware replies via a LangChain memory agent, and syncing records to Google Sheets with 5x retry logic.',
    link: { label: 'View Operations Workflow', href: '/work/screens', external: false },
  },
  {
    id: 'case-study-2',
    title: 'Airbnb RAG Guest Concierge (FiFi) & Supabase Vector Engine',
    summary: 'Eliminated manual guest inquiries by syncing property docs to Supabase pgvector hourly, answering guest questions with property-grounded accuracy and zero hallucinations.',
    link: { label: 'View RAG Concierge Workflow', href: '/work/screens', external: false },
  },
]

export const processDoc = {
  title: 'Process Doc',
  summary: 'A clear technical architecture spec and node mapping document, ensuring reliable production deployment and zero API downtime.',
  link: { label: 'Open the sample doc', href: '/demos/plans/sample-plan.html', external: true } satisfies LinkRef,
}

/* ---------- Screens ---------- */

export const screens: { id: string; name: string; kicker: string; summary: string; status?: 'Live' | 'Beta'; image?: Image }[] = [
  {
    id: 'n8n-job-scraper',
    name: 'AI Job Scraper & ATS Resume Optimizer',
    kicker: '22-Node n8n Pipeline',
    status: 'Live',
    summary: 'Slack trigger -> Gemini 3 Flash intent gate -> RapidAPI JSearch scraping -> 1000-job memory deduplication -> DeepSeek ATS keyword rewriting -> Google Drive template cloning -> Gmail drafting -> Slack card dispatch.',
    image: n8nShot('job-scraper-canvas.png', 'AI Job Scraper n8n Canvas'),
  },
  {
    id: 'n8n-gmail-triage',
    name: 'Autonomous Gmail AI Triage & Responder',
    kicker: 'Operations Automation',
    status: 'Live',
    summary: 'Polls unread inbox every 5 minutes, tags across 5 categories (Work, Personal, Marketing, Google, Spam), auto-archives newsletters, drafts tailored responses via LangChain memory agent, and sends instant Telegram VIP push alerts.',
    image: n8nShot('gmail-triage-canvas.png', 'Gmail AI Triage Canvas'),
  },
  {
    id: 'n8n-sheets-crm',
    name: 'Zero-Maintenance Google Sheets CRM & Telegram Alerts',
    kicker: 'CRM Integration',
    status: 'Live',
    summary: 'Automatic structured customer database logging sender, category, message ID, and timestamp with exponential backoff (5x retry) for zero data loss, paired with real-time Telegram mobile push notifications.',
    image: n8nShot('sheets-crm.png', 'Google Sheets CRM Log'),
  },
  {
    id: 'n8n-airbnb-rag',
    name: 'Airbnb RAG Guest Concierge & Vector Engine (FiFi)',
    kicker: 'RAG Knowledge Engine',
    status: 'Live',
    summary: 'Hourly Google Drive to Supabase pgvector embedding synchronization (500-char chunks, 50-char overlap) paired with a property-grounded conversational agent featuring strict safety and amenity guardrails.',
    image: n8nShot('airbnb-rag-canvas.png', 'Airbnb RAG Workflow Canvas'),
  },
  {
    id: 'n8n-lead-strategy',
    name: 'Multi-Turn Strategy AI & Lead Intake Funnel',
    kicker: 'Conversational AI',
    status: 'Live',
    summary: 'Dual-entry Telegram and webhook normalization driving a 3-turn DeepSeek qualification consultant that outputs structured JSON decision handshakes for sales handoff and team alerting.',
    image: n8nShot('lead-strategy-canvas.png', 'Lead Strategy Canvas'),
  },
  {
    id: 'n8n-syndication-hygiene',
    name: 'Omnichannel Social Syndication & NeverBounce Hygiene',
    kicker: 'Distribution & Deliverability',
    status: 'Live',
    summary: 'Automated YouTube RSS listener with AI thread summarization publishing to X, paired with NeverBounce API deliverability filtering to protect sender domain reputation.',
    image: n8nShot('youtube-to-x-canvas.png', 'Social Syndication Canvas'),
  },
]

/* ---------- Websites (self-contained demo pages in public/demos) ---------- */

const demo = (dir: string, file: string, label: string, tag: string, summary: string): Demo => ({
  id: file,
  label,
  tag,
  summary,
  href: `/demos/${dir}/${file}.html`,
})

const SITE_SUMMARY = 'PLACEHOLDER - tell me what to put here: one sentence on the site and who it is for.'
const FUNNEL_SUMMARY = 'PLACEHOLDER - tell me what to put here: one sentence on what this funnel page does.'
const BOOKING_SUMMARY = 'PLACEHOLDER - tell me what to put here: one sentence on the booking page and its audience.'

export const sampleSites: Demo[] = [
  demo('sites', 'site-1', 'Sample Site 1', 'Website', SITE_SUMMARY),
  demo('sites', 'site-2', 'Sample Site 2', 'Website', SITE_SUMMARY),
  demo('sites', 'site-3', 'Sample Site 3', 'Website', SITE_SUMMARY),
  demo('sites', 'site-4', 'Sample Site 4', 'Website', SITE_SUMMARY),
]

export const funnelPages: Demo[] = [
  demo('funnels', 'funnel-1', 'Funnel Page 1', 'Funnel', FUNNEL_SUMMARY),
  demo('funnels', 'funnel-2', 'Funnel Page 2', 'Funnel', FUNNEL_SUMMARY),
  demo('funnels', 'funnel-3', 'Funnel Page 3', 'Funnel', FUNNEL_SUMMARY),
  demo('funnels', 'funnel-4', 'Funnel Page 4', 'Funnel', FUNNEL_SUMMARY),
]

export const bookingPages: Demo[] = [
  demo('funnels', 'booking-1', 'Booking Page 1', 'Booking', BOOKING_SUMMARY),
  demo('funnels', 'booking-2', 'Booking Page 2', 'Booking', BOOKING_SUMMARY),
]

/* ---------- Apps and extensions ---------- */

export const apps: AppBuild[] = [
  {
    id: 'app-1',
    name: 'App One',
    kind: 'Mobile app',
    tagline: 'Your tagline here.',
    summary: 'PLACEHOLDER - tell me what to put here: two sentences on what the app does and who uses it.',
    status: 'Beta',
    image: { src: '/images/apps/app-1.webp', alt: 'App One store screen', width: 540, height: 1200 },
  },
  {
    id: 'app-2',
    name: 'App Two',
    kind: 'Mobile app',
    tagline: 'Your tagline here.',
    summary: 'PLACEHOLDER - tell me what to put here: two sentences on what the app does and who uses it.',
    status: 'Beta',
    image: { src: '/images/apps/app-2.webp', alt: 'App Two screens', width: 480, height: 266 },
  },
  {
    id: 'app-3',
    name: 'App Three',
    kind: 'Mobile app',
    tagline: 'Your tagline here.',
    summary: 'PLACEHOLDER - tell me what to put here: two sentences on what the app does and who uses it.',
    status: 'Free',
    image: { src: '/images/apps/app-3.webp', alt: 'App Three screens', width: 480, height: 266 },
  },
  {
    id: 'extension-1',
    name: 'Extension One',
    kind: 'Browser extension',
    tagline: 'Your tagline here.',
    summary: 'PLACEHOLDER - tell me what to put here: one or two sentences on what the extension does in one click.',
    image: { src: '/images/apps/extension-1.webp', alt: 'Extension One popup', width: 419, height: 597 },
  },
  {
    id: 'extension-2',
    name: 'Extension Two',
    kind: 'Browser extension',
    tagline: 'Your tagline here.',
    summary: 'PLACEHOLDER - tell me what to put here: one or two sentences on what the extension does in one click.',
    image: { src: '/images/apps/extension-2.webp', alt: 'Extension Two popup', width: 403, height: 306 },
  },
]

/* ---------- Side projects and experiments (no pictures: the sheet lists them) ---------- */

export const sideProjects: AiGroup[] = [
  {
    title: 'Group One',
    summary: 'PLACEHOLDER - tell me what to put here: one line on what this group of projects has in common.',
    builds: [
      { name: 'Side Project 1', summary: 'PLACEHOLDER - tell me what to put here: one sentence on what it does.', stack: 'Stack A, Stack B', status: 'Live' },
      { name: 'Side Project 2', summary: 'PLACEHOLDER - tell me what to put here: one sentence on what it does.', stack: 'Stack A, Stack C', status: 'Internal' },
      { name: 'Side Project 3', summary: 'PLACEHOLDER - tell me what to put here: one sentence on what it does.', stack: 'Stack B, Stack C', status: 'Internal' },
      { name: 'Side Project 4', summary: 'PLACEHOLDER - tell me what to put here: one sentence on what it does.', stack: 'Stack A, Stack D', status: 'Internal' },
    ],
  },
  {
    title: 'Group Two',
    summary: 'PLACEHOLDER - tell me what to put here: one line on what this group of projects has in common.',
    builds: [
      { name: 'Side Project 5', summary: 'PLACEHOLDER - tell me what to put here: one sentence on what it does.', stack: 'Stack B, Stack D', status: 'Live' },
      { name: 'Side Project 6', summary: 'PLACEHOLDER - tell me what to put here: one sentence on what it does.', stack: 'Stack C, Stack D', status: 'Live' },
    ],
  },
]

export const experiments: AiGroup[] = [
  {
    title: 'Experiments',
    summary: 'PLACEHOLDER - tell me what to put here: one line on what these experiments are.',
    builds: [
      { name: 'Experiment 1', summary: 'PLACEHOLDER - tell me what to put here: one sentence on what it does.', stack: 'Stack A', status: 'Live' },
      { name: 'Experiment 2', summary: 'PLACEHOLDER - tell me what to put here: one sentence on what it does.', stack: 'Stack B', status: 'Live' },
      { name: 'Experiment 3', summary: 'PLACEHOLDER - tell me what to put here: one sentence on what it does.', stack: 'Stack C', status: 'Live' },
    ],
  },
]

const buildsIn = (groups: AiGroup[]) => groups.reduce((n, g) => n + g.builds.length, 0)

/** Number of builds across every Work chapter, shown as the sidebar badge. Derived, never typed in. */
export const workCount =
  1 +
  caseStudies.length +
  1 +
  screens.length +
  sampleSites.length +
  funnelPages.length +
  bookingPages.length +
  apps.length +
  buildsIn(sideProjects) +
  buildsIn(experiments)
