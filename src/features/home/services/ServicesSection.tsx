import { useRef, type CSSProperties } from 'react'
import { Link } from 'react-router'
import { ArrowUpRight } from '@phosphor-icons/react'
import { chapterPath } from '@/content/home'
import { services, servicesSection } from '@/content/services'
import { useScrollScene } from '@/hooks/use-scroll-scene'
import { servicesScene } from './services-scene'
import './services.css'

const pad = (n: number) => String(n).padStart(2, '0')

// Map service IDs to relevant visual assets from work.ts
const serviceFrames: Record<string, { src: string; alt: string }[]> = {
  'service-1': [
    { src: '/images/n8n/job-scraper-canvas.png', alt: 'AI Job Scraper & ATS Optimizer n8n Canvas' },
    { src: '/images/n8n/gmail-triage-canvas.png', alt: 'Autonomous Gmail Operations Hub' },
    { src: '/images/n8n/job-scraper-output.png', alt: 'Real-Time Webhook Pipeline' },
  ],
  'service-2': [
    { src: '/images/ghl/ghl-sales-pipeline-kanban.png', alt: 'GoHighLevel Sales Pipeline Kanban' },
    { src: '/images/ghl/ghl-multi-pipeline-architecture.png', alt: 'Multi-Pipeline Hierarchy' },
    { src: '/images/ghl/ghl-automotive-branch-nurture.png', alt: 'GoHighLevel Branch Nurture' },
  ],
  'service-3': [
    { src: '/images/ghl/ghl-contacts-smart-lists.png', alt: 'Direct-Response Funnels' },
    { src: '/images/app-script/outreach-dashboard.png', alt: 'Operations Web App' },
  ],
  'service-4': [
    { src: '/images/case-studies/non-profit/After.jpg', alt: 'Google Ads & Telemetry Mastery' },
  ],
  'service-5': [
    { src: '/images/n8n/pipeline-overview.png', alt: 'End-to-End Multi-Stage Architecture Flow' },
    { src: '/images/app-script/outreach-dashboard.png', alt: 'Full-Stack Custom Operations' },
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
                  
                  {/* Visual Project Frames Gallery */}
                  {frames.length > 0 && (
                    <div className="sv__gallery" aria-label={`${service.title} Project Frames`}>
                      {frames.map((frame, idx) => (
                        <div key={idx} className="sv__frame">
                          <img src={frame.src} alt={frame.alt} loading="lazy" />
                        </div>
                      ))}
                    </div>
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
