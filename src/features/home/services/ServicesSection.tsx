import { useRef, type CSSProperties } from 'react'
import { Link } from 'react-router'
import { ArrowUpRight } from '@phosphor-icons/react'
import { chapterPath } from '@/content/home'
import { services, servicesSection } from '@/content/services'
import { useScrollScene } from '@/hooks/use-scroll-scene'
import { servicesScene } from './services-scene'
import { ServiceCoverflow, type CoverflowFrame } from './ServiceCoverflow'
import './services.css'

const pad = (n: number) => String(n).padStart(2, '0')

// Map service IDs to rich 3D Coverflow project frames
const serviceFrames: Record<string, CoverflowFrame[]> = {
  'service-1': [
    {
      src: '/images/n8n/job-scraper-canvas.png',
      alt: '22-Node Autonomous n8n Workflow',
      title: '22-Node Autonomous Workflow',
      caption: 'Slack Ingestion · Gemini Flash · ATS Resume Optimizer',
    },
    {
      src: '/images/n8n/gmail-triage-canvas.png',
      alt: 'Gmail AI Triage & Sheets Hub',
      title: 'Gmail Operations Hub',
      caption: 'Autonomous Email Triage · LangChain Memory Agent',
    },
    {
      src: '/images/n8n/airbnb-rag-canvas.png',
      alt: 'Airbnb RAG Guest Concierge',
      title: 'RAG Guest Concierge (FiFi)',
      caption: 'Supabase Vector Engine · Zero-Hallucination Answers',
    },
    {
      src: '/images/n8n/job-scraper-output.png',
      alt: 'Live Webhook Payload & Slack Output',
      title: 'Live Webhook Telemetry',
      caption: 'Real-Time RapidAPI Ingestion · 1,000-Job Memory Cache',
    },
    {
      src: '/images/n8n/pipeline-overview.png',
      alt: 'End-to-End Multi-Stage Architecture Flow',
      title: 'Multi-Stage Architecture Flow',
      caption: 'Production-Grade 99.9% Uptime Deployment',
    },
  ],
  'service-2': [
    {
      src: '/images/ghl/ghl-sales-pipeline-kanban.png',
      alt: '6-Stage Sales Opportunity Kanban',
      title: '6-Stage Sales Kanban',
      caption: 'Opportunity Deal Values · Real-Time Stage Velocity',
    },
    {
      src: '/images/ghl/ghl-multi-pipeline-architecture.png',
      alt: 'Multi-Industry Pipeline Hierarchy',
      title: 'Multi-Industry Pipeline Schemas',
      caption: 'Sales, Marketing & Real Estate Bounded Contexts',
    },
    {
      src: '/images/ghl/ghl-automotive-branch-nurture.png',
      alt: 'Automotive & Home Services Branch Nurture',
      title: '5-Way Conditional Branching',
      caption: 'Sub-60s Speed-to-Lead · Automated Missed-Call Text Back',
    },
    {
      src: '/images/ghl/ghl-contacts-smart-lists.png',
      alt: 'Centralized Contact Database',
      title: 'Contact Smart Lists & Tags',
      caption: 'Multi-Source Attribution (Facebook, Google, Referral)',
    },
  ],
  'service-3': [
    {
      src: '/images/ghl/ghl-contacts-smart-lists.png',
      alt: 'Direct-Response Funnel Architecture',
      title: 'Direct-Response Funnels',
      caption: 'Conversion-Engineered Layouts · High-Intent CTA Flows',
    },
    {
      src: '/images/app-script/outreach-dashboard.png',
      alt: 'Cold Outreach Command Center Dashboard',
      title: 'Cold Outreach Command Center',
      caption: 'Google Apps Script · DeepSeek AI · Funnel Velocity',
    },
    {
      src: '/images/ghl/ghl-sales-pipeline-kanban.png',
      alt: 'Lead Capture & Interactive Booking Intake',
      title: 'Frictionless Booking Intakes',
      caption: '2-Way SMS Webchat · Calendar Synchronization',
    },
  ],
  'service-4': [
    {
      src: '/images/case-studies/non-profit/After.jpg',
      alt: 'Google Ads & Telemetry Turnaround Suite',
      title: 'Ad Grants Turnaround Suite',
      caption: '14.00% CTR Compliance · 193+ Monthly Conversions',
    },
    {
      src: '/images/app-script/outreach-dashboard.png',
      alt: 'Conversion Telemetry & Funnel Attribution',
      title: 'Bulletproof GTM Telemetry',
      caption: '40.00% Local CTR · $2.97 CPC · 100% Attribution',
    },
  ],
  'service-5': [
    {
      src: '/images/n8n/pipeline-overview.png',
      alt: 'Custom Full-Stack Automation Architecture',
      title: 'Edge & Cloud Microservices',
      caption: 'GoHighLevel + n8n + Supabase pgvector Architecture',
    },
    {
      src: '/images/app-script/outreach-dashboard.png',
      alt: 'Autonomous Operations Dashboard',
      title: 'Custom Client Operations OS',
      caption: 'Sub-25ms Edge Telemetry · Webhook Pipeline Retries',
    },
    {
      src: '/images/n8n/gmail-triage-canvas.png',
      alt: 'AI-Augmented Knowledge & Workflow Systems',
      title: 'AI Auto-Responders & Session Memory',
      caption: 'OpenAI / DeepSeek Models · Exponential Backoff',
    },
  ],
}

/**
 * Services, "Card stack". The heading holds while the five service
 * cards are dealt onto a pile: each card slides up and settles a few pixels below the one before,
 * which sinks back (scale) and dims under it, so a thin edge of every earlier card stays in view.
 * Phones: the same pile on native CSS sticky, without the sink. Reduced motion: a plain stack.
 * Every card opens the Work chapter that shows that service.
 */
export function ServicesSection() {
  const sectionRef = useRef<HTMLElement>(null)
  useScrollScene(sectionRef, servicesScene)

  return (
    <section ref={sectionRef} id="services" className="sv" aria-labelledby="services-title">
      <header className="sv__head">
        <p className="sv__eyebrow">
          {servicesSection.eyebrow}
          <span className="sv__rule" aria-hidden>
            <i data-sv-rule />
          </span>
        </p>
        <h2 id="services-title" className="sv__title">
          <span>{servicesSection.titleThin}</span> <b>{servicesSection.titleBold}</b>
        </h2>
      </header>
      <ol className="sv__stack">
        {services.map((service, i) => {
          const frames = serviceFrames[service.id] || []
          return (
            <li key={service.id} className="sv__item" style={{ '--i': i } as CSSProperties}>
              <Link
                to={chapterPath(servicesSection.work[service.id] ?? 'screens')}
                state={{ sheet: true }}
                preventScrollReset
                className="sv__card"
                data-card
              >
                <div className="sv__card-content">
                  <span className="sv__top">
                    <span className="sv__index">
                      {pad(i + 1)}
                      <span>{service.outcome}</span>
                    </span>
                    <span className="sv__tags">
                      {service.tools.map((tool) => (
                        <span key={tool.name}>{tool.name}</span>
                      ))}
                    </span>
                  </span>
                  <span className="sv__name">{service.title}</span>
                  <span className="sv__desc">
                    {service.summary} {service.bullets.join('. ')}.
                  </span>
                  
                  {/* 3D Coverflow Project Frames Showcase */}
                  {frames.length > 0 && (
                    <ServiceCoverflow frames={frames} />
                  )}

                  <span className="sv__explore">
                    {servicesSection.explore}
                    <ArrowUpRight size={14} weight="bold" aria-hidden />
                  </span>
                </div>
                <span className="sv__dim" aria-hidden />
              </Link>
            </li>
          )
        })}
        {/* Room for the finished pile to hold (services.css .sv__tail): sticky range ends at the list's content box. */}
        <li className="sv__tail" aria-hidden />
      </ol>
    </section>
  )
}

