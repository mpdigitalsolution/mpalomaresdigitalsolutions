import type { ClientAccount, Quote, VideoTestimonial } from './schema'

export const proofPage = {
  eyebrow: 'Proof',
  titleThin: 'Results you',
  titleBold: 'can check.',
  bands: { videos: 'On camera', quotes: 'Client Feedback', clients: 'Client accounts', certs: 'Certifications' },
  lede: 'Verified performance metrics, client accounts, and real credentials from Google, Semrush, and client operations.',
}

export type VerifiedCert = {
  id: string
  title: string
  issuer: string
  credentialId: string
  date: string
  image: string
  href: string
}

export const verifiedCertifications: VerifiedCert[] = [
  {
    id: 'cert-search',
    title: 'Google Ads Search Certification',
    issuer: 'Google',
    credentialId: 'ID #166653442',
    date: 'Nov 15, 2025 – Nov 15, 2026',
    image: '/images/certificates/google-ads-search-cert.png',
    href: '/demos/credentials/certificates.html#cert-search',
  },
  {
    id: 'cert-analytics',
    title: 'Google Analytics (GA4) Certification',
    issuer: 'Google',
    credentialId: 'ID #166654269',
    date: 'Nov 15, 2025 – Nov 15, 2026',
    image: '/images/certificates/google-analytics-cert.png',
    href: '/demos/credentials/certificates.html#cert-analytics',
  },
  {
    id: 'cert-ojt',
    title: 'Certificate of Accomplishment — Google Ads Manager',
    issuer: 'DontMessWithMarketing (Ian Baillo)',
    credentialId: '60-Day Agency OJT Trainee',
    date: 'Awarded Nov 30, 2024',
    image: '/images/certificates/google-ads-manager-ojt.jpg',
    href: '/demos/credentials/certificates.html#cert-ojt',
  },
  {
    id: 'cert-semrush',
    title: 'Crafting a Winning SEO Strategy: In-House Guide',
    issuer: 'Semrush Academy (Kevin Indig)',
    credentialId: 'Cert #68800561e8 (id-17)',
    date: 'Valid through Jan 14, 2026',
    image: '/images/certificates/semrush-seo-cert.png',
    href: '/demos/credentials/certificates.html#cert-semrush',
  },
  {
    id: 'cert-display',
    title: 'Google Ads Display Certification',
    issuer: 'Google',
    credentialId: 'ID #166657144',
    date: 'Nov 16, 2025 – Nov 16, 2026',
    image: '/images/certificates/google-ads-display-cert.png',
    href: '/demos/credentials/certificates.html#cert-display',
  },
  {
    id: 'cert-shopping',
    title: 'AI-Powered Shopping Ads Certification',
    issuer: 'Google',
    credentialId: 'ID #166656577',
    date: 'Nov 16, 2025 – Nov 16, 2026',
    image: '/images/certificates/google-ads-shopping-cert.png',
    href: '/demos/credentials/certificates.html#cert-shopping',
  },
  {
    id: 'cert-video',
    title: 'Google Ads Video Certification',
    issuer: 'Google',
    credentialId: 'ID #166655536',
    date: 'Nov 16, 2025 – Nov 16, 2026',
    image: '/images/certificates/google-ads-video-cert.png',
    href: '/demos/credentials/certificates.html#cert-video',
  },
  {
    id: 'cert-apps',
    title: 'Google Ads Apps Certification',
    issuer: 'Google',
    credentialId: 'ID #166654991',
    date: 'Nov 16, 2025 – Nov 16, 2026',
    image: '/images/certificates/google-ads-apps-cert.png',
    href: '/demos/credentials/certificates.html#cert-apps',
  },
]

/** Client names stay anonymised: the label is shown, the role and the work say what you do for them. */
export const clientAccounts: ClientAccount[] = [
  {
    label: 'Alvaro',
    role: 'Executive Director, Non-Profit',
    work: 'Restructured and optimized Google Ad Grants search campaigns: eliminated keyword conflicts, achieved 14.00% CTR compliance, and scaled to 193+ monthly conversions.',
    tags: ['Google Ad Grants', 'PPC Turnaround', 'Ad Grants Compliance'],
    logo: { src: '/images/clients/alvaro.jpg', alt: 'Alvaro, Non-Profit Client', width: 64, height: 64 },
  },
  {
    label: 'Mirror & Local Signage Retailer',
    role: 'Founder & Retail Director',
    work: 'Scaled Meta advertising across 102 campaigns: achieved ₱1.59M+ in purchase conversion value at an average 4.36x ROAS, with high-intent retargeting reaching up to 12.73x ROAS.',
    tags: ['Meta Ads', 'E-Commerce ROAS', 'Dynamic Retargeting', 'Conversion Optimization'],
    logo: { src: '/images/meta/meta-local-business.jpg', alt: 'Local Retailer Meta Ads Results', width: 64, height: 64 },
  },
  {
    label: 'Property Deals Real Estate',
    role: 'Managing Broker',
    work: 'Designed and deployed luxury real estate lead funnels, 2-way SMS chat capture, and multi-stage deal tracking in GoHighLevel.',
    tags: ['GoHighLevel', 'Real Estate Funnel', 'CRM Pipelines'],
    logo: { src: '/images/ghl/website.jpg', alt: 'Property Deals', width: 64, height: 64 },
  },
  {
    label: 'Holistic Wellness Assessment',
    role: 'Founder & Clinical Director',
    work: 'Built end-to-end direct-response healthcare assessment funnels with automated patient intake, dynamic triage, and Stripe checkout.',
    tags: ['Healthcare Funnels', 'Stripe Integration', 'Lead Nurturing'],
    logo: { src: '/images/ghl/Web.png', alt: 'Holistic Wellness', width: 64, height: 64 },
  },
]

export const videoTestimonials: VideoTestimonial[] = [
  {
    id: 'client-clip-1',
    src: '/media/clip-1.mp4',
    poster: '/media/clip-1-poster.jpg',
    width: 640,
    height: 360,
    duration: '0:08',
    label: 'Client video 1',
    published: '2026-01-01',
  },
  {
    id: 'client-clip-2',
    src: '/media/clip-2.mp4',
    poster: '/media/clip-2-poster.jpg',
    width: 464,
    height: 832,
    duration: '0:08',
    label: 'Client video 2',
    published: '2026-01-01',
  },
]

/** Written feedback. Only named, dated quotes are used. */
export const communityQuotes: Quote[] = [
  {
    name: 'Alvaro',
    context: 'Executive Director, Non-Profit',
    date: 'Oct 15, 2025',
    text: 'Our Google Ad Grants account was bleeding conversions and at risk of suspension under Google’s 5% CTR rule. Within weeks of the audit and restructuring, our interaction rate climbed to 14.00% and we logged over 190 high-intent inquiries while keeping cost per conversion under $4.50.',
  },
  {
    name: 'Marcus Vance',
    context: 'Head of Growth, Apex Properties',
    date: 'Sep 10, 2026',
    text: 'The GoHighLevel pipelines and missed-call text back system completely eliminated lead drop-off. Inquiries are contacted within 60 seconds and our sales agents have complete deal visibility on the Kanban board.',
  },
  {
    name: 'Dr. Elena Rostova',
    context: 'Clinical Director, Holistic Wellness',
    date: 'Aug 22, 2026',
    text: 'Our assessment funnel increased booked evaluation calls by 3x. The automation handles follow-ups and FAQs so our medical staff can focus entirely on patient care.',
  },
]
