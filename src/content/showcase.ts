import type { Faq, Image, ProductFilm, ProductTab } from './schema'

/** The address shown in the browser-window bars around the film and the room screens. */
export const showcaseHost = 'crm.mpalomaresdigital.com'

export const showcasePage = {
  eyebrow: 'Flagship Showcase',
  titleThin: 'Client acquisition,',
  titleBold: 'engineered from click to close.',
  lede: 'The GoHighLevel All-in-One Client Acquisition & Operations Engine: an end-to-end system unifying high-converting landing funnels, instant 2-way SMS chat, visual pipeline stages, and autonomous follow-up automation.',
  footnote: 'Configured on GoHighLevel CRM, Twilio SMS infrastructure, Stripe payment gateways, and custom n8n webhook nodes.',
  cta: { label: 'Explore Interactive CRM Architecture', href: '/demos/ghl/crm-architecture.html', external: true },
  roomsTitle: 'The five operating pillars',
}

/** A room capture with full aspect ratio support */
const ghlRoom = (file: string, alt: string, width: number, height: number): Image => ({
  src: `/images/ghl/${file}`,
  alt,
  width,
  height,
})

/** The product film: a short muted loop, no audio. Keep it small (a couple of MB). */
export const showcaseFilm: ProductFilm = {
  src: '/media/showcase-film.mp4',
  poster: { src: '/images/showcase/film-poster.webp', alt: 'GoHighLevel Engine Tour', width: 1280, height: 720 },
  pagePosters: { phone: '/images/showcase/film-poster-640.webp', wide: '/images/showcase/film-poster-960.webp' },
  name: 'GoHighLevel Acquisition Engine: A Visual Walkthrough',
  description: 'A rapid tour of multi-step intake funnels, 2-way omnichannel messaging, and automated pipeline updates.',
  duration: '0:10',
  published: '2026-01-01',
}

/** Number + unit. Use only figures you can state as fact. */
export const showcaseStats: [string, string][] = [
  ['<60s', 'speed to lead automated response'],
  ['102', 'campaigns managed & synchronized'],
  ['4.36x', 'average e-commerce ROAS achieved'],
  ['5', 'integrated operational pillars'],
]

/** The five rooms of the product, each with a caption and a screen. */
export const productTabs: ProductTab[] = [
  {
    id: 'room-1',
    label: 'Lead Capture Funnels',
    body: 'Direct-response landing pages and multi-step intake forms built with instant field validation, dynamic triage branching, and mobile-optimized conversion funnels.',
    image: ghlRoom('ghl-real-estate-website.jpg', 'Property Deals Luxury Real Estate Lead Capture Funnel', 1920, 935),
  },
  {
    id: 'room-2',
    label: 'Unified 2-Way Inbox',
    body: 'Consolidates incoming SMS, email, Facebook Messenger, and Instagram direct messages into one uninterrupted conversation thread with automatic sub-minute response triggers.',
    image: ghlRoom('ghl-sms-email-omnichannel.png', 'Omni-Channel 2-Way SMS and Email Messaging Hub', 1008, 636),
  },
  {
    id: 'room-3',
    label: 'Sales Deal Pipelines',
    body: 'Visual drag-and-drop opportunity boards tracking leads through every buying stage—from new inquiry to qualification, discovery call, proposal sent, and closed revenue.',
    image: ghlRoom('ghl-sales-pipeline-kanban.png', 'Multi-Stage Kanban Deal Pipeline and Opportunity Tracking', 1728, 577),
  },
  {
    id: 'room-4',
    label: 'Contact Intelligence',
    body: 'Dynamic contact tagging, custom field capture, and smart list segmentation separating high-intent buyers, booked consultations, and cold leads for targeted reactivation.',
    image: ghlRoom('ghl-contacts-smart-lists.png', 'Smart List Segmentation and Custom Field Contact Intelligence', 1920, 922),
  },
  {
    id: 'room-5',
    label: 'Automated Workflows',
    body: 'Event-driven logic branches running missed-call text backs, calendar booking reminders, internal task assignments, and bidirectional webhook sync with external databases.',
    image: ghlRoom('ghl-advanced-lead-nurture-system.png', 'Advanced Autonomous Lead Nurture and Follow-Up Workflow Logic', 1920, 922),
  },
]

/** Three questions people ask about the product, answered the way the product itself answers them. */
export const showcaseFaq: Faq[] = [
  {
    question: 'What businesses benefit most from this GoHighLevel ecosystem?',
    answer: 'High-ticket service providers, real estate brokerages, healthcare and wellness clinics, home service contractors, and digital marketing agencies who need to eliminate lead response lag and automate appointment booking.',
  },
  {
    question: 'How does it integrate with existing marketing and tools?',
    answer: 'It connects natively with Google Ads, Meta Ads Manager, Stripe, and Google Calendar. For custom CRMs or bespoke databases, custom n8n webhook nodes facilitate two-way automated data synchronization with zero manual entry.',
  },
  {
    question: 'Can this system be deployed as a turnkey snapshot?',
    answer: 'Yes. The entire infrastructure—including funnels, email/SMS nurture campaigns, custom fields, pipeline stages, and triggers—is packaged as a production snapshot that can be launched in under 48 hours.',
  },
]
