import type { AiGroup, AppBuild, Demo, Image, LinkRef } from './schema'

export const workPage = {
  eyebrow: 'Work',
  title: 'Real builds you can open.',
  lede: 'Production-grade n8n automations, conversion-engineered GoHighLevel websites and funnels, and autonomous AI agents.',
}

/* ---------- Featured project ---------- */

const n8nShot = (file: string, alt: string): Image => ({
  src: `/images/n8n/${file}`,
  alt,
  width: 1600,
  height: 900,
})

const ghlShot = (file: string, alt: string): Image => ({
  src: `/images/ghl/${file}`,
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

export const caseStudies: { id: string; title: string; summary: string; link: LinkRef; image?: Image }[] = [
  {
    id: 'case-study-google-ads-mastery',
    title: 'Google Ads & Telemetry Turnaround: Non-Profit & Healthcare',
    summary: 'Dual-track search engine turnaround: rescued an Ad Grants non-profit account to 14.00% CTR compliance and 193+ monthly conversions, while rebuilding broken booking telemetry for Resilience Therapy via GTM to achieve 40.00% local CTR at $2.97 CPC.',
    image: { src: '/images/case-studies/non-profit/After.jpg', alt: 'Google Ads Search & Telemetry Turnaround Suite', width: 1280, height: 640 },
    link: { label: 'Explore Merged Case Study & Evidence Suite', href: '/demos/case-studies/google-ads-performance.html', external: true },
  },
  {
    id: 'case-study-1',
    title: '24/7 Autonomous Gmail Operations Hub & Sheets CRM',
    summary: 'Solved inbox overload by triaging incoming emails across 5 categories, drafting context-aware replies via a LangChain memory agent, and syncing records to Google Sheets with 5x retry logic.',
    image: n8nShot('gmail-triage-canvas.png', 'Gmail AI Triage Canvas'),
    link: { label: 'View Operations Workflow', href: '/work/screens', external: false },
  },
  {
    id: 'case-study-2',
    title: 'Airbnb RAG Guest Concierge (FiFi) & Supabase Vector Engine',
    summary: 'Eliminated manual guest inquiries by syncing property docs to Supabase pgvector hourly, answering guest questions with property-grounded accuracy and zero hallucinations.',
    image: n8nShot('airbnb-rag-canvas.png', 'Airbnb RAG Concierge Canvas'),
    link: { label: 'View RAG Concierge Workflow', href: '/work/screens', external: false },
  },
  {
    id: 'case-study-3',
    title: 'Multi-Channel GoHighLevel Lead Nurturing & Speed-to-Lead Engine',
    summary: 'Engineered automated missed-call text back and 5-way conditional branch nurturing across automotive and home service niches, converting cold inquiries into booked calls in under 60 seconds.',
    image: ghlShot('ghl-automotive-branch-nurture.png', 'GoHighLevel Multi-Branch Nurture Workflow'),
    link: { label: 'Explore GoHighLevel Systems', href: '/work/websites', external: false },
  },
]

export const processDoc = {
  title: 'GoHighLevel CRM & Pipeline Architecture Blueprint',
  summary: 'Comprehensive GoHighLevel systems architecture: 6-stage sales Kanban, multi-industry pipeline schemas, contact smart lists, custom field data models, and omnichannel follow-up cadences.',
  link: { label: 'Open Interactive Architecture Blueprint', href: '/demos/ghl/crm-architecture.html', external: true } satisfies LinkRef,
  lead: ghlShot('ghl-sales-pipeline-kanban.png', 'GoHighLevel Sales Pipeline Kanban Board'),
  gallery: [
    ghlShot('ghl-sales-pipeline-kanban.png', '6-Stage Sales Opportunity Kanban with Deal Values'),
    ghlShot('ghl-multi-pipeline-architecture.png', 'Multi-Industry Pipeline Hierarchy (Marketing, Real Estate, Sales)'),
    ghlShot('ghl-contacts-smart-lists.png', 'Centralized Contact Database with Source Attribution Tags'),
    ghlShot('ghl-smart-list-segmentation.png', 'Smart List Lifecycle Segmentation Filters (VIP, Nurture Cold)'),
    ghlShot('ghl-custom-fields.png', 'Custom Contact & Opportunity Field Data Schemas'),
    ghlShot('ghl-sms-email-omnichannel.png', 'Omnichannel 2-Way SMS and HTML Email Conversation Cadence'),
    ghlShot('ghl-workflow-logic-snippet.png', 'Workflow Condition Rules and Webhook Routing Logic Snippet'),
  ],
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
    id: 'n8n-messenger-ai',
    name: '24/7 Facebook Messenger AI Agent (DeepSeek + Knowledge Base)',
    kicker: 'Messenger Automation',
    status: 'Live',
    summary: 'Webhook receiver verifying Meta handshakes, retrieving company knowledge from Google Docs, and powering an autonomous DeepSeek AI agent with conversational memory to answer customer inquiries and dispatch replies via Facebook Graph API in real-time.',
    image: n8nShot('messenger.png', 'Facebook Messenger AI Agent Workflow Canvas'),
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

/* ---------- Websites & GoHighLevel Assets ---------- */

export const sampleSites: Demo[] = [
  {
    id: 'ghl-real-estate-website',
    label: 'Property Deals Luxury Real Estate Portal',
    tag: 'Web Portal',
    summary: 'Full-featured residential property portal built in GoHighLevel with integrated 2-way SMS chat widget, search filters, and one-click consultation scheduler.',
    image: ghlShot('ghl-real-estate-website.jpg', 'Property Deals Luxury Real Estate Website'),
    href: '/images/ghl/ghl-real-estate-website.jpg',
    status: 'Live',
  },
  {
    id: 'ghl-wellness-hero',
    label: 'Holistic Wellness $97 Assessment Portal',
    tag: 'Healthcare Funnel',
    summary: 'High-converting wellness evaluation website featuring root cause diagnosis breakdown, clear benefit pillars, and seamless Stripe-backed checkout entry.',
    image: ghlShot('ghl-wellness-hero.png', 'Holistic Wellness Assessment Portal'),
    href: '/images/ghl/ghl-wellness-hero.png',
    status: 'Live',
  },
  {
    id: 'ghl-junk-removal',
    label: 'MP Junk Removal & Local Services Landing Page',
    tag: 'Local Service Landing Page',
    summary: 'Speed-optimized emergency local service landing page with 5-star Google review integration, trust badges, click-to-call banners, and instant free estimate forms.',
    image: ghlShot('ghl-junk-removal-service.png', 'MP Junk Removal & Local Services Landing Page'),
    href: '/images/ghl/ghl-junk-removal-service.png',
    status: 'Live',
  },
  {
    id: 'ghl-wellness-quote',
    label: 'Wellness Assessment Pricing & Booking Form',
    tag: 'Lead Capture Portal',
    summary: 'Interactive assessment intake form with mobile-optimized layout, consent compliance disclaimers, and automated contact record creation in GHL.',
    image: ghlShot('ghl-wellness-quote-form.png', 'Wellness Assessment Pricing & Booking Form'),
    href: '/images/ghl/ghl-wellness-quote-form.png',
    status: 'Live',
  },
]

export const funnelPages: Demo[] = [
  {
    id: 'ghl-real-estate-funnel',
    label: 'Property Deals Acquisition & Buyer Funnel',
    tag: 'Direct-Response Funnel',
    summary: 'Multi-step investor and homebuyer lead generation funnel designed to capture high-intent property inquiries and route directly into sales opportunities.',
    image: ghlShot('ghl-real-estate-funnel.png', 'Property Deals Acquisition Funnel'),
    href: '/images/ghl/ghl-real-estate-funnel.png',
    status: 'Live',
  },
  {
    id: 'ghl-wellness-highlights',
    label: 'Holistic Wellness Assessment Highlights & Modules',
    tag: 'Educational Funnel Step',
    summary: 'Visual value proposition section highlighting root cause discovery, customized wellness plans, and transparent expectations before committing.',
    image: ghlShot('ghl-wellness-highlights.png', 'Holistic Wellness Assessment Highlights'),
    href: '/images/ghl/ghl-wellness-highlights.png',
    status: 'Live',
  },
  {
    id: 'ghl-wellness-faq-reviews',
    label: 'Customer Social Proof & Interactive FAQ Module',
    tag: 'Social Proof & FAQ',
    summary: 'Conversion-focused accordion FAQs and verified customer testimonials systematically overcoming purchase objections to maximize checkout completion.',
    image: ghlShot('ghl-wellness-faq-reviews.png', 'Customer Proof & FAQ Funnel Step'),
    href: '/images/ghl/ghl-wellness-faq-reviews.png',
    status: 'Live',
  },
]

export const bookingPages: Demo[] = [
  {
    id: 'ghl-sales-pipeline-kanban',
    label: '6-Stage Sales Opportunity Pipeline (Kanban)',
    tag: 'Sales Pipeline',
    summary: 'Visual deal board spanning New Lead, Contacted, Proposal Sent, Negotiating, Won, and Lost stages with active deal valuation and velocity metrics.',
    image: ghlShot('ghl-sales-pipeline-kanban.png', 'GoHighLevel Sales Pipeline Kanban'),
    href: '/images/ghl/ghl-sales-pipeline-kanban.png',
    status: 'Live',
  },
  {
    id: 'ghl-multi-pipeline',
    label: 'Multi-Industry Pipeline Architecture',
    tag: 'CRM System Architecture',
    summary: 'Custom pipeline schema separating Marketing (12 stages), Real Estate (9 stages), and Direct Sales (6 stages) to prevent lead leakage across departments.',
    image: ghlShot('ghl-multi-pipeline-architecture.png', 'Multi-Industry Pipeline Architecture'),
    href: '/images/ghl/ghl-multi-pipeline-architecture.png',
    status: 'Live',
  },
  {
    id: 'ghl-contacts-smart-lists',
    label: 'Segmented Smart Lists & Multi-Source Attribution',
    tag: 'Contact Segmentation',
    summary: 'Granular contact database segmented by lifecycle stages (Nurture Cold, Client VIP, Buyer Leads, Lead New) and tagged by traffic source (Facebook, Google, Referral).',
    image: ghlShot('ghl-contacts-smart-lists.png', 'GoHighLevel Contacts and Smart Lists'),
    href: '/images/ghl/ghl-contacts-smart-lists.png',
    status: 'Live',
  },
  {
    id: 'ghl-custom-fields',
    label: 'Custom Data Fields Schema & Attributes',
    tag: 'Data Schema',
    summary: 'Tailored contact attribute definitions and custom values capturing industry-specific qualifiers (vehicle preference, property budget, inspection type).',
    image: ghlShot('ghl-custom-fields.png', 'GoHighLevel Custom Fields Schema'),
    href: '/images/ghl/ghl-custom-fields.png',
    status: 'Live',
  },
]

export const ghlWorkflows: Demo[] = [
  {
    id: 'ghl-advanced-lead-nurture',
    label: 'Advanced AI Lead Nurture & Review System',
    tag: 'AI-Augmented Workflow',
    summary: 'Multi-stage automation with ChatGPT AI responding to inbound messages, time-delayed follow-ups, SurveyMonkey satisfaction checks, and Google Analytics conversion events.',
    image: ghlShot('ghl-advanced-lead-nurture-system.png', 'Advanced Lead Nurture System Workflow'),
    href: '/images/ghl/ghl-advanced-lead-nurture-system.png',
    status: 'Live',
  },
  {
    id: 'ghl-automotive-nurture',
    label: 'Automotive 5-Way Dynamic Branch Nurturing',
    tag: 'Dynamic Branching Drip',
    summary: 'Dynamic multi-branch workflow triggering on appointment booking, form submit, or reply, dynamically routing leads across 5 vehicle interest branches for custom SMS/Email nurturing.',
    image: ghlShot('ghl-automotive-branch-nurture.png', 'Automotive Multi-Branch Nurture Workflow'),
    href: '/images/ghl/ghl-automotive-branch-nurture.png',
    status: 'Live',
  },
  {
    id: 'ghl-roofing-conversion',
    label: 'Roofing Contractor Lead-to-Customer Pipeline',
    tag: 'Contractor Conversion',
    summary: 'Automated lead-to-opportunity creation for roofing contractors, splitting into dedicated inspection, repair, and full replacement multi-touch SMS & email follow-up tracks.',
    image: ghlShot('ghl-roofing-lead-conversion.png', 'Roofing Lead Conversion Workflow'),
    href: '/images/ghl/ghl-roofing-lead-conversion.png',
    status: 'Live',
  },
  {
    id: 'ghl-missed-call-textback',
    label: '60-Second Missed-Call Text-Back (MCTB) Engine',
    tag: 'Speed-to-Lead Follow-up',
    summary: 'Instantly detects missed inbound calls or incoming messages, creates an opportunity card, and dispatches an instant SMS text follow-up to engage prospective clients within 60 seconds.',
    image: ghlShot('ghl-missed-call-textback.png', 'Missed Call Text Back Workflow'),
    href: '/images/ghl/ghl-missed-call-textback.png',
    status: 'Live',
  },
  {
    id: 'ghl-chiropractor-capture',
    label: 'Chiropractor Assessment Lead Capture & Drip',
    tag: 'Lead Capture Workflow',
    summary: 'Automates lead capture from online health assessments: tags contact, waits, dispatches personalized SMS, and uses conditional reply logic to trigger follow-up emails.',
    image: ghlShot('ghl-chiropractor-lead-capture.png', 'Chiropractor Lead Capture Workflow'),
    href: '/images/ghl/ghl-chiropractor-lead-capture.png',
    status: 'Live',
  },
  {
    id: 'ghl-lead-disqualification',
    label: 'Lead Intent Disqualification & Auto-Tagging',
    tag: 'CRM Hygiene Workflow',
    summary: 'Listens for customer responses indicating lack of interest, automatically strips active prospect tags, applies suppression labels, and sends a polite confirmation SMS.',
    image: ghlShot('ghl-lead-disqualification-logic.png', 'Lead Disqualification Logic'),
    href: '/images/ghl/ghl-lead-disqualification-logic.png',
    status: 'Live',
  },
]

/* ---------- Apps and extensions ---------- */

export const apps: AppBuild[] = [
  {
    id: 'mgems-optimizer-pro',
    name: 'MGEMS Optimizer Pro',
    kind: 'Chrome Extension',
    tagline: 'Multi-LLM 4-Style Prompt Optimization Engine.',
    summary: 'Proprietary Chrome extension interfacing simultaneously with Claude 3.5 Sonnet, Gemini 2.5 Pro, DeepSeek V3, and ChatGPT 4o. Generates Concise, Smart, Professional, and Detailed prompt variants side-by-side with instant 1-4 keyboard copying.',
    status: 'Live',
    image: {
      src: '/images/apps/extensions/mgems-optimizer-results.png',
      alt: 'MGEMS Optimizer Pro 4-Style Multi-Model Results Canvas',
      width: 1920,
      height: 922,
    },
    href: '/demos/extensions/mgems-suite.html',
  },
  {
    id: 'mgems-keyword-manager',
    name: 'MGEMS Keyword Manager',
    kind: 'Chrome Extension',
    tagline: 'Direct Google Keyword Planner scraping & DeepSeek RSA generator.',
    summary: 'Automates keyword harvesting directly inside Google Keyword Planner. Extracts Broad, Phrase, and Exact match groups, and leverages DeepSeek AI to synthesize high-intent keyword variations and character-compliant RSA headlines (≤30 chars) and descriptions (≤90 chars).',
    status: 'Live',
    image: {
      src: '/images/apps/extensions/mgems-keyword-planner.png',
      alt: 'MGEMS Keyword Manager - Google Keyword Planner Extraction',
      width: 537,
      height: 752,
    },
    href: '/demos/extensions/mgems-suite.html',
  },
  {
    id: 'mgems-rsa-generator',
    name: 'MGEMS RSA Copy & Intent Synthesizer',
    kind: 'Browser extension',
    tagline: 'Automated Responsive Search Ad copy compliance generator.',
    summary: 'DeepSeek API integration enforcing strict character limit checks on Google Ads assets (30-char headlines, 90-char descriptions) while maximizing ad relevance and Quality Score benchmarks.',
    status: 'Live',
    image: {
      src: '/images/apps/extensions/mgems-rsa-headlines.png',
      alt: 'MGEMS RSA Headlines & Descriptions Generator',
      width: 537,
      height: 752,
    },
    href: '/demos/extensions/mgems-suite.html',
  },
  {
    id: 'mgems-high-intent-extractor',
    name: 'DeepSeek High-Intent Query Engine',
    kind: 'Browser extension',
    tagline: 'Buyer-intent search term classifier.',
    summary: 'Filters out unqualified informational search volume from Google Ads campaigns by categorizing keywords into transactional commercial queries, reducing wasted PPC ad spend.',
    status: 'Live',
    image: {
      src: '/images/apps/extensions/mgems-high-intent-keywords.png',
      alt: 'MGEMS DeepSeek High-Intent Keywords',
      width: 537,
      height: 752,
    },
    href: '/demos/extensions/mgems-suite.html',
  },
  {
    id: 'mgems-optimizer-popup',
    name: 'MGEMS Quick-Launch Model Bridge',
    kind: 'Chrome Extension',
    tagline: 'In-browser floating prompt transformer.',
    summary: 'Manifest V3 popup widget with zero-latency keystroke listeners and local encrypted storage for OpenAI, Anthropic, Gemini, and DeepSeek API keys.',
    status: 'Live',
    image: {
      src: '/images/apps/extensions/mgems-optimizer-popup.png',
      alt: 'MGEMS Optimizer Pro Quick-Launch Popup',
      width: 477,
      height: 752,
    },
    href: '/demos/extensions/mgems-suite.html',
  },
  {
    id: 'gads-appscript-keyword-extractor',
    name: 'Google Ads Keyword & Bid Extractor',
    kind: 'Google Apps Script',
    tagline: 'Automated Ad Grants compliance & opportunity scoring engine.',
    summary: 'Proprietary Google Apps Script automation that processes raw Keyword Planner exports, enforces the strict $2.00 Ad Grants bid ceiling, eliminates single-word broad queries, runs healthcare policy checks, and calculates opportunity scores directly inside Google Sheets.',
    status: 'Live',
    image: {
      src: '/images/app-script/gads-appscript-code-editor.png',
      alt: 'Google Ads Keyword & Bid Extractor Apps Script Editor and Bidding Architecture',
      width: 1920,
      height: 922,
    },
    href: '/demos/tools/gads-keyword-extractor.html',
  },
]

/* ---------- Side projects and experiments (no pictures: the sheet lists them) ---------- */

export const sideProjects: AiGroup[] = [
  {
    title: 'Content Distribution & Growth Engines',
    summary: 'Autonomous pipelines that repurpose media and syndicate content across platforms with zero human intervention.',
    builds: [
      {
        name: 'YouTube-to-X Autonomous Publisher',
        summary: 'Listens for new video uploads, extracts transcripts via AI, generates high-engagement tweet threads, and auto-schedules posts to X with thumbnail links.',
        stack: 'n8n, YouTube Data API, OpenAI GPT-4o, X API',
        status: 'Live',
      },
      {
        name: 'AI Video Transcriber & Social Cross-Poster',
        summary: 'Ingests MP4 recordings from Google Drive, transcribes audio, parses insights via Zapier AI, and formats tailored updates simultaneously to Facebook Pages and LinkedIn.',
        stack: 'Zapier, Whisper AI, Google Drive, LinkedIn & Meta Graph APIs',
        status: 'Live',
      },
      {
        name: 'Autonomous Lead Hygiene & NeverBounce Verifier',
        summary: 'Intercepts incoming form submissions, validates deliverability via NeverBounce API, filters disposable domains, and tags high-deliverability contacts before CRM sync.',
        stack: 'n8n, NeverBounce API, Webhooks, Google Sheets',
        status: 'Live',
      },
    ],
  },
  {
    title: 'Operational Utilities & CRM Bridges',
    summary: 'Event-driven middleware that bridges appointment calendars, messaging bots, and custom JavaScript transforms.',
    builds: [
      {
        name: 'Cal-to-CRM Multi-Step Booking Assistant',
        summary: 'Triggers on new Google Calendar bookings, runs inline JavaScript to parse appointment metadata, dispatches personalized confirmation emails, and syncs to a master Sheets CRM.',
        stack: 'Zapier, JavaScript (Code by Zapier), Google Calendar, Gmail, Google Sheets',
        status: 'Live',
      },
      {
        name: 'Telegram Real-Time Incident & Alert Bot',
        summary: 'Webhook listener capturing critical workflow exceptions, payment webhook failures, and VIP inbound leads, dispatching instant push notifications to private Telegram channels.',
        stack: 'n8n, Telegram Bot API, Webhooks, JSON Schema',
        status: 'Live',
      },
      {
        name: 'Facebook Messenger 24/7 AI Receptionist',
        summary: 'Connects Meta Page Messenger to an LLM triage prompt that qualifies visitor intent, answers standard operational FAQs, and escalates warm leads to a human agent.',
        stack: 'n8n, Meta Messenger API, DeepSeek / Claude, Webhooks',
        status: 'Live',
      },
      {
        name: 'Google Ads Keyword & Bid Extractor (Apps Script)',
        summary: 'Spreadsheet automation processing raw Keyword Planner exports: enforces $2.00 Ad Grants bid limits, eliminates single-word broad terms, checks healthcare compliance, and calculates Opportunity Scores.',
        stack: 'Google Apps Script, Google Sheets API, Google Ads Keyword Planner, JavaScript (V8 Engine)',
        status: 'Live',
        href: '/demos/tools/gads-keyword-extractor.html',
      },
    ],
  },
]

const experimentShot = (file: string, alt: string, width: number, height: number): Image => ({
  src: `/images/experiments/${file}`,
  alt,
  width,
  height,
})

export const experiments: AiGroup[] = [
  {
    title: 'LinkComment AI (Mgems Extension)',
    summary: 'Autonomous in-browser LinkedIn engagement assistant powered by DeepSeek API, generating contextual multi-angle responses with live DOM injection.',
    builds: [
      {
        name: '4-Angle Decision Modal',
        summary: 'Compares four distinct optimized response angles (Opinion, Support, Question, and Takeaway) generated from live LinkedIn post context with 1-click insertion or clipboard copying.',
        stack: 'Chrome Extension (Manifest V3), DeepSeek API (deepseek-chat), TypeScript',
        status: 'Under Development',
        image: experimentShot('linkcomment-output-modal.png', 'LinkComment AI 4-Perspective Comment Generation Modal', 1920, 922),
        href: '/images/experiments/linkcomment-output-modal.png',
      },
      {
        name: 'In-Feed Composer Injection',
        summary: 'Dynamically mounts a native "+ Generate" trigger directly into LinkedIn\'s active comment input toolbar via DOM MutationObserver, extracting thread context without disrupting feed scroll.',
        stack: 'DOM MutationObserver, Content Scripts, CSS Injection',
        status: 'Under Development',
        image: experimentShot('linkcomment-feed-injection.png', 'LinkComment AI Injected Generate Action in LinkedIn Comment Feed', 1920, 922),
        href: '/images/experiments/linkcomment-feed-injection.png',
      },
      {
        name: 'Extension Control Hub & Telemetry',
        summary: 'In-browser popup widget with DeepSeek backend health monitoring, adaptive tone style selection, daily generation quota tracking (13/50), and token micro-cost auditing ($0.0040 / $1.00).',
        stack: 'Chrome Storage API, DeepSeek Chat Engine, Tailwind CSS',
        status: 'Under Development',
        image: experimentShot('linkcomment-popup-ui.png', 'Mgems AI Extension Settings Popup and Cost Telemetry', 390, 527),
        href: '/images/experiments/linkcomment-popup-ui.png',
      },
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
  ghlWorkflows.length +
  apps.length +
  buildsIn(sideProjects) +
  buildsIn(experiments)
