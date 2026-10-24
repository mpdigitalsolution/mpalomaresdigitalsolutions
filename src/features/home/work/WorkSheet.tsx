import { useEffect, useRef, useState, type MouseEvent } from 'react'
import { Link, useLocation, useNavigate } from 'react-router'
import { ArrowRight, ArrowUpRight, MagnifyingGlass, X } from '@phosphor-icons/react'
import { HeadMeta } from '@/app/PageMeta'
import { chapterPath, workChapters } from '@/content/home'
import type { WorkChapter, WorkItem } from '@/content/schema'
import { gsap, MOTION_CONDITIONS, spring } from '@/lib/motion/gsap'
import { chapterJsonLd, chapterTitle } from '@/lib/seo'
import { ImageLightbox, type LightboxItem } from '@/components/lightbox/ImageLightbox'
import { useSheet } from './use-sheet'
import './work-sheet.css'

type SheetState = { sheet?: boolean } | null

/**
 * The showcase for one Work chapter, at its own URL (/work/<chapter>) so it can be shared, indexed
 * and opened directly. A native modal <dialog> (focus trap, Escape, top layer) holding a sheet that
 * rises over Home. Closing goes back in history when the visitor came from Home, so Back closes it
 * too. The last chapter stays rendered while the sheet leaves.
 */
export function WorkSheet({ chapter }: { chapter: WorkChapter | null }) {
  const navigate = useNavigate()
  const location = useLocation()
  const fromHome = !!(location.state as SheetState)?.sheet
  const [shown, setShown] = useState<WorkChapter | null>(chapter)
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)

  if (chapter && chapter !== shown) setShown(chapter)

  const requestClose = () => {
    if (fromHome) navigate(-1)
    else navigate('/', { preventScrollReset: true })
  }
  const { dialogRef, panelRef, scrimRef, onDragStart } = useSheet({
    open: !!chapter,
    onRequestClose: requestClose,
    onClosed: () => {
      setShown(null)
      setLightboxIndex(null)
    },
  })

  // New chapter (opened, or "Next" inside the sheet): back to the top and bring the builds in.
  const bodyRef = useRef<HTMLDivElement>(null)
  const headRef = useRef<HTMLElement>(null)
  useEffect(() => {
    const body = bodyRef.current
    if (!body || !shown) return
    body.scrollTop = 0
    setLightboxIndex(null)
    headRef.current?.removeAttribute('data-scrolled')
    if (window.matchMedia(MOTION_CONDITIONS.reduce).matches) return
    const items = Array.from(body.querySelectorAll('[data-reveal]')).slice(0, 8)
    const tween = gsap.from(items, { y: 22, autoAlpha: 0, stagger: 0.045, delay: 0.08, ...spring({ response: 0.55 }) })
    return () => {
      tween.revert()
    }
  }, [shown])

  const onBodyScroll = () => {
    const scrolled = (bodyRef.current?.scrollTop ?? 0) > 4
    headRef.current?.toggleAttribute('data-scrolled', scrolled)
  }

  const onDialogClick = (event: MouseEvent<HTMLDialogElement>) => {
    if (event.target === scrimRef.current) requestClose()
  }

  const next = shown ? workChapters[(workChapters.indexOf(shown) + 1) % workChapters.length] : undefined

  // Compute all expandable images for the current chapter
  const lightboxItems: LightboxItem[] = shown
    ? shown.lead
      ? [
          {
            src: shown.lead.src,
            alt: shown.lead.alt,
            width: shown.lead.width,
            height: shown.lead.height,
            name: shown.title,
            kicker: shown.line,
            summary: shown.description,
            href: shown.link?.href,
          },
          ...(shown.gallery ?? []).map((img, i) => ({
            src: img.src,
            alt: img.alt,
            width: img.width,
            height: img.height,
            name: img.alt || `${shown.title} - View ${i + 1}`,
            kicker: shown.title,
            summary: shown.description,
            href: shown.link?.href,
          })),
        ]
      : shown.items
          .filter((item) => !!item.image)
          .map((item) => ({
            src: item.image!.src,
            alt: item.image!.alt,
            width: item.image!.width,
            height: item.image!.height,
            name: item.name,
            kicker: item.kicker,
            summary: item.summary,
            href: item.href,
            status: item.status,
          }))
    : []

  return (
    <dialog
      ref={dialogRef}
      className="sh"
      aria-labelledby="sh-title"
      data-lenis-prevent
      onCancel={(event) => {
        event.preventDefault()
        if (lightboxIndex !== null) {
          setLightboxIndex(null)
        } else {
          requestClose()
        }
      }}
      onClick={onDialogClick}
    >
      <div ref={scrimRef} className="sh__scrim" />
      {chapter ? (
        <>
          <HeadMeta title={chapterTitle(chapter)} description={chapter.description} path={chapterPath(chapter.id)} />
          <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: chapterJsonLd(chapter, chapterPath(chapter.id)) }} />
        </>
      ) : null}

      <div ref={panelRef} className="sh__panel" tabIndex={-1}>
        <div className="sh__grab" onPointerDown={onDragStart} aria-hidden>
          <span />
        </div>

        {shown ? (
          <>
            <header ref={headRef} className="sh__head" onPointerDown={onDragStart}>
              <div>
                <p className="wk-count">
                  {shown.count} {shown.unit}
                </p>
                <h2 id="sh-title" className="sh__title">
                  {shown.title}
                </h2>
              </div>
              <button type="button" className="sh__close" onClick={requestClose} aria-label="Close">
                <X size={20} weight="bold" aria-hidden />
              </button>
            </header>

            <div ref={bodyRef} className="sh__body" onScroll={onBodyScroll}>
              <p className="sh__intro">{shown.description}</p>
              {shown.lead ? (
                <Single chapter={shown} onOpenLightbox={(idx) => setLightboxIndex(idx)} />
              ) : shown.items.some((item) => item.image) ? (
                <Showcase
                  items={shown.items}
                  lightboxItems={lightboxItems}
                  onOpenLightbox={(idx) => setLightboxIndex(idx)}
                />
              ) : (
                <Groups items={shown.items} />
              )}

              {next && next !== shown ? (
                <nav className="sh__next" aria-label="More work" data-reveal>
                  <Link to={chapterPath(next.id)} replace state={location.state} preventScrollReset>
                    <span className="wk-count">Next</span>
                    <span className="sh__next-title">{next.title}</span>
                    <ArrowRight size={22} weight="bold" aria-hidden />
                  </Link>
                </nav>
              ) : null}
            </div>
          </>
        ) : null}

        {/* High-definition Lightbox Viewer */}
        <ImageLightbox
          items={lightboxItems}
          index={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
          onNavigate={(newIndex) => setLightboxIndex(newIndex)}
        />
      </div>
    </dialog>
  )
}

/** Picture-led builds: the first one leads in a wide row, the rest in a grid. */
function Showcase({
  items,
  lightboxItems,
  onOpenLightbox,
}: {
  items: WorkItem[]
  lightboxItems: LightboxItem[]
  onOpenLightbox: (index: number) => void
}) {
  // Items with a `group` (Websites) render as one titled grid per group, in first-seen order.
  const groups = [...new Set(items.map((item) => item.group ?? ''))]
  return (
    <div className="sh__sets">
      {groups.map((group, gi) => (
        <section key={group} className="sh__set">
          {group ? (
            <h3 className="sh__group-title" data-reveal>
              {group}
            </h3>
          ) : null}
          <Grid
            items={items.filter((item) => (item.group ?? '') === group)}
            lead={gi === 0}
            lightboxItems={lightboxItems}
            onOpenLightbox={onOpenLightbox}
          />
        </section>
      ))}
    </div>
  )
}

function Grid({
  items,
  lead,
  lightboxItems,
  onOpenLightbox,
}: {
  items: WorkItem[]
  lead: boolean
  lightboxItems: LightboxItem[]
  onOpenLightbox: (index: number) => void
}) {
  return (
    <ul className="sh__grid">
      {items.map((item, i) => {
        // Find corresponding index in the full lightbox list
        const lbIndex = item.image
          ? lightboxItems.findIndex((lb) => lb.src === item.image?.src)
          : -1

        return (
          <li key={item.id} className={lead && i === 0 ? 'sh__item sh__item--lead' : 'sh__item'} data-reveal>
            <div className="sh__link">
              <div
                className={
                  item.href
                    ? 'sh__shot sh__shot--zoomable'
                    : 'sh__shot sh__shot--contain sh__shot--zoomable'
                }
                role="button"
                tabIndex={0}
                aria-label={`Expand image: ${item.name}`}
                title="Click to expand image"
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  if (lbIndex >= 0) onOpenLightbox(lbIndex)
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    e.stopPropagation()
                    if (lbIndex >= 0) onOpenLightbox(lbIndex)
                  }
                }}
              >
                {item.image ? (
                  <img
                    src={item.image.src}
                    alt={item.image.alt}
                    width={item.image.width}
                    height={item.image.height}
                    loading={i < 3 ? 'eager' : 'lazy'}
                    decoding="async"
                  />
                ) : null}
                <span className="sh__shot-expand" aria-hidden>
                  <MagnifyingGlass size={16} weight="bold" />
                </span>
              </div>

              <div className="sh__cap">
                <span className="wk-count">
                  {item.kicker}
                  {item.status ? <span className="sh__status">{item.status}</span> : null}
                </span>

                {item.href ? (
                  <a
                    className="sh__name sh__name--link"
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <span>{item.name}</span>
                    <ArrowUpRight size={16} weight="bold" aria-hidden />
                  </a>
                ) : (
                  <h3 className="sh__name">{item.name}</h3>
                )}

                <span className="sh__sum">{item.summary}</span>
              </div>
            </div>
          </li>
        )
      })}
    </ul>
  )
}

/** Builds with no pictures (side projects and experiments): grouped rows. */
function Groups({ items }: { items: WorkItem[] }) {
  const groups = [...new Set(items.map((item) => item.kicker))]
  return (
    <div className="sh__groups">
      {groups.map((group) => (
        <section key={group} className="sh__group" data-reveal>
          <h3 className="sh__group-title">{group}</h3>
          <ul>
            {items
              .filter((item) => item.kicker === group)
              .map((item) => (
                <li key={item.id} className="sh__row">
                  <h4 className="sh__name">{item.name}</h4>
                  <p className="sh__sum">{item.summary}</p>
                  <p className="wk-count">
                    {item.stack}
                    {item.status ? <span className="sh__status">{item.status}</span> : null}
                  </p>
                </li>
              ))}
          </ul>
        </section>
      ))}
    </div>
  )
}

/** One build with a gallery (the featured project and crm architecture). */
function Single({
  chapter,
  onOpenLightbox,
}: {
  chapter: WorkChapter
  onOpenLightbox: (index: number) => void
}) {
  const { lead, gallery = [], link } = chapter
  return (
    <div className="sh__single">
      {lead ? (
        <div
          className="sh__shot sh__shot--lead sh__shot--zoomable"
          role="button"
          tabIndex={0}
          aria-label={`Expand image: ${lead.alt || chapter.title}`}
          title="Click to expand image"
          onClick={() => onOpenLightbox(0)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault()
              onOpenLightbox(0)
            }
          }}
          data-reveal
        >
          <img src={lead.src} alt={lead.alt} width={lead.width} height={lead.height} decoding="async" />
          <span className="sh__shot-expand" aria-hidden>
            <MagnifyingGlass size={18} weight="bold" />
          </span>
        </div>
      ) : null}

      {link ? (
        <a className="btn-line sh__live" href={link.href} target="_blank" rel="noopener" data-reveal>
          {link.label}
          <ArrowUpRight size={16} weight="bold" aria-hidden />
        </a>
      ) : null}

      <ul className="sh__gallery">
        {gallery.map((img, idx) => (
          <li key={img.src} data-reveal>
            <div
              className="sh__shot sh__shot--zoomable"
              role="button"
              tabIndex={0}
              aria-label={`Expand image: ${img.alt || `View ${idx + 1}`}`}
              title="Click to expand image"
              onClick={() => onOpenLightbox(lead ? idx + 1 : idx)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  onOpenLightbox(lead ? idx + 1 : idx)
                }
              }}
            >
              <img src={img.src} alt={img.alt} width={img.width} height={img.height} loading="lazy" decoding="async" />
              <span className="sh__shot-expand" aria-hidden>
                <MagnifyingGlass size={16} weight="bold" />
              </span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
