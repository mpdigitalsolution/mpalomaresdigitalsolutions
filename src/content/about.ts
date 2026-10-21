import type { Image, ToolMark } from './schema'
import { site } from './site'
import { tools } from './tools'

/**
 * The Home About section: the desk illustration stands on a hairline floor with the lead over its
 * space; roles with tool logos as raised keys, credentials below.
 */
export const aboutSection = {
  eyebrow: 'About',
  titleThin: "Hi, I'm",
  titleBold: `${site.name}.`,
  lede: 'Google Ads Specialist, Certified Performance Marketer, and Automation Systems Architect.',
  lead: "Most businesses don't have a traffic problem—they have a lead leakage problem. I help founders, agencies, and non-profits stop burning ad budget by engineering precision Google search campaigns connected to sub-60-second GoHighLevel and n8n intake automations.",
  leadQuiet: 'Every system is anchored in verified conversion tracking, real-time CRM deal stages, and verifiable ROAS—ensuring zero inquiries slip through the cracks.',
  note: {
    company: `${site.brand} is my consultancy`,
    product: { label: 'Verified Certifications Suite', href: '/demos/credentials/certificates.html' },
    rest: 'showcasing official Google, Semrush, and agency credentials.',
  },
  picture: {
    src: '/images/profile/desk.webp',
    srcSet: '/images/profile/800/desk.webp 800w, /images/profile/desk.webp 1200w',
    alt: `Illustration of ${site.name} at a desk, working at a monitor with a coffee beside them`,
    width: 1200,
    height: 889,
  } satisfies Image,
}

export const capabilities: { title: string; tools: ToolMark[] }[] = [
  { title: 'Google Ads & Search Marketing', tools: [tools.toolA, tools.toolB, tools.toolC] },
  { title: 'Analytics & Conversion Tracking', tools: [tools.toolD, tools.toolE, tools.toolF, tools.toolG, tools.toolH] },
  { title: 'Autonomous n8n Automations', tools: [tools.toolD, tools.toolI, tools.toolJ, tools.toolK, tools.toolL] },
  { title: 'GoHighLevel CRM & Funnel Architecture', tools: [tools.toolF, tools.toolG, tools.toolH] },
]

export type AboutCredential = {
  id: string
  title: string
  detail: string
  image?: Image
  /** A dark-theme version of the mark, when the light one would vanish on a dark ground (or the reverse). */
  imageDark?: Image
  href?: string
}

export const credentials: AboutCredential[] = [
  {
    id: 'cert-search',
    title: 'Google Ads Search Certified',
    detail: 'ID #166653442 · Google',
    href: '/demos/credentials/certificates.html#cert-search',
    image: { src: '/images/certificates/google-ads-search-cert.png', alt: 'Google Ads Search Certification', width: 64, height: 64 },
  },
  {
    id: 'cert-analytics',
    title: 'Google Analytics (GA4) Certified',
    detail: 'ID #166654269 · Google',
    href: '/demos/credentials/certificates.html#cert-analytics',
    image: { src: '/images/certificates/google-analytics-cert.png', alt: 'Google Analytics Certification', width: 64, height: 64 },
  },
  {
    id: 'cert-ojt',
    title: 'Google Ads Manager (OJT Honors)',
    detail: 'DontMessWithMarketing · Nov 2024',
    href: '/demos/credentials/certificates.html#cert-ojt',
    image: { src: '/images/certificates/google-ads-manager-ojt.jpg', alt: 'Google Ads Manager Accomplishment', width: 64, height: 64 },
  },
  {
    id: 'cert-semrush',
    title: 'Semrush SEO Strategy Certified',
    detail: 'ID #68800561e8 · Kevin Indig',
    href: '/demos/credentials/certificates.html#cert-semrush',
    image: { src: '/images/certificates/semrush-seo-cert.png', alt: 'Semrush Academy SEO Strategy', width: 64, height: 64 },
  },
  {
    id: 'cert-display',
    title: 'Google Ads Display Certified',
    detail: 'ID #166657144 · Google',
    href: '/demos/credentials/certificates.html#cert-display',
    image: { src: '/images/certificates/google-ads-display-cert.png', alt: 'Google Ads Display Certification', width: 64, height: 64 },
  },
  {
    id: 'cert-shopping',
    title: 'AI Shopping Ads Certified',
    detail: 'ID #166656577 · Google',
    href: '/demos/credentials/certificates.html#cert-shopping',
    image: { src: '/images/certificates/google-ads-shopping-cert.png', alt: 'AI Shopping Ads Certification', width: 64, height: 64 },
  },
  {
    id: 'cert-video',
    title: 'Google Ads Video Certified',
    detail: 'ID #166655536 · Google',
    href: '/demos/credentials/certificates.html#cert-video',
    image: { src: '/images/certificates/google-ads-video-cert.png', alt: 'Google Ads Video Certification', width: 64, height: 64 },
  },
  {
    id: 'cert-apps',
    title: 'Google Ads Apps Certified',
    detail: 'ID #166654991 · Google',
    href: '/demos/credentials/certificates.html#cert-apps',
    image: { src: '/images/certificates/google-ads-apps-cert.png', alt: 'Google Ads Apps Certification', width: 64, height: 64 },
  },
  {
    id: 'place',
    title: `Based ${site.timePlace}`,
    detail: 'GMT+8 · Serving Clients Worldwide',
  },
]
