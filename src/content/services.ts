import type { Service } from './schema'
import { tools } from './tools'

export const servicesPage = {
  eyebrow: 'Services',
  title: 'End-to-End Automation & Web Systems',
  lede: 'Deploy autonomous n8n workflows, conversion-optimized GoHighLevel funnels, and enterprise CRM architectures built to scale your revenue.',
}

/**
 * The Home Services section: a stack of cards dealt onto a pile as the page scrolls. The display line
 * is the thin + bold pair below.
 */
export const servicesSection = {
  eyebrow: servicesPage.eyebrow,
  titleThin: 'Pick one',
  titleBold: 'or stack a few.',
  explore: 'Explore',
  /** The Work chapter each card opens, by service id (a chapter id from home.ts). */
  work: { 'service-1': 'screens', 'service-2': 'process', 'service-3': 'websites', 'service-4': 'case-studies', 'service-5': 'featured' } as Record<string, string>,
}

export const services: Service[] = [
  {
    id: 'service-1',
    title: 'n8n & AI Operations Automation',
    summary: 'Production-grade n8n workflow systems, custom multi-turn AI agents, autonomous email triage, and cross-platform integrations.',
    outcome: '24/7 Autonomous Pipelines',
    bullets: [
      'Sub-5-minute autonomous lead triage with instant Telegram and Slack alerts',
      'Multi-channel CRM synchronization with exponential backoff and zero data loss',
      'RAG knowledge engines and automated ATS resume optimization pipelines',
    ],
    tools: [tools.toolA, tools.toolB, tools.toolC],
  },
  {
    id: 'service-2',
    title: 'GoHighLevel CRM & Pipeline Architecture',
    summary: 'End-to-end GoHighLevel setup: Multi-stage deal pipelines, granular contact smart lists, multi-source attribution, and automated lead disqualification.',
    outcome: 'Zero Lead Leakage',
    bullets: [
      'Custom Kanban pipelines for Sales, Marketing, and Real Estate with deal stage velocity tracking',
      'Granular contact segmentation with smart lists and source attribution tags (Facebook, Google, Referral)',
      'Automated data hygiene with custom fields, tag suppression, and cold-lead disqualification routing',
    ],
    tools: [tools.toolB, tools.toolD, tools.toolJ],
  },
  {
    id: 'service-3',
    title: 'High-Converting Websites & Sales Funnels',
    summary: 'Conversion-engineered direct-response funnels and brand websites with integrated 24/7 webchat widgets, multi-step intake forms, and automated booking.',
    outcome: 'Predictable Booked Calls',
    bullets: [
      'Direct-response funnels designed in GoHighLevel for Real Estate, Healthcare, and Local Services',
      'Embedded 2-way SMS chat widgets, frictionless intake forms, and automated calendar booking',
      'Mobile-first layouts optimized for local service conversion and Google review collection',
    ],
    tools: [tools.toolB, tools.toolH, tools.toolI],
  },
  {
    id: 'service-4',
    title: 'Google Ads & Performance Search Marketing',
    summary: 'Full-funnel search campaign architecture, high-intent keyword harvesting, and bulletproof Google Tag Manager (GTM) conversion telemetry engineering.',
    outcome: '14.00% CTR · Scaled ROAS',
    bullets: [
      'Rescue low-performing and policy-restricted Google Ad Grants accounts to exceed the strict 5.00% CTR compliance floor',
      'Rebuild broken booking and revenue telemetry via GTM custom data layers for 100% conversion attribution',
      'Eliminate budget waste through negative keyword clash audits and Maximize Conversions Smart Bidding scaling',
    ],
    tools: [tools.toolGoogleAds, tools.toolGTM, tools.toolAnalytics],
  },
  {
    id: 'service-5',
    title: 'Full-Stack Custom Automation & AI Integration',
    summary: 'Bridging GoHighLevel and custom client systems with n8n, Supabase pgvector, OpenAI/DeepSeek models, and webhook microservices.',
    outcome: 'Custom Enterprise Scale',
    bullets: [
      'Custom webhook endpoints connecting CRM data to external APIs and vector databases',
      'AI-augmented auto-responders with session memory and tailored domain knowledge bases',
      'Automated data pipelines with exponential backoff retries for 99.9% uptime reliability',
    ],
    tools: [tools.toolA, tools.toolB, tools.toolC],
  },
]
