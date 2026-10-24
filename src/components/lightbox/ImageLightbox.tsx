import { useEffect, useRef, useState, type MouseEvent } from 'react'
import {
  ArrowUpRight,
  CaretLeft,
  CaretRight,
  MagnifyingGlass,
  X,
} from '@phosphor-icons/react'
import './image-lightbox.css'

export interface LightboxItem {
  src: string
  alt?: string
  width?: number
  height?: number
  name?: string
  kicker?: string
  summary?: string
  href?: string
  status?: string
}

export interface ImageLightboxProps {
  items: LightboxItem[]
  index: number | null
  onClose: () => void
  onNavigate: (index: number) => void
}

export function ImageLightbox({ items, index, onClose, onNavigate }: ImageLightboxProps) {
  const [isZoomed, setIsZoomed] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const activeItem = index !== null && items[index] ? items[index] : null
  const hasMultiple = items.length > 1

  // Reset zoom whenever image index changes
  useEffect(() => {
    setIsZoomed(false)
  }, [index])

  // Handle keyboard events (Escape, Left, Right)
  useEffect(() => {
    if (index === null) return

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        event.stopPropagation()
        onClose()
      } else if (event.key === 'ArrowLeft' && hasMultiple) {
        event.preventDefault()
        onNavigate((index - 1 + items.length) % items.length)
      } else if (event.key === 'ArrowRight' && hasMultiple) {
        event.preventDefault()
        onNavigate((index + 1) % items.length)
      }
    }

    window.addEventListener('keydown', handleKeyDown, true)
    return () => window.removeEventListener('keydown', handleKeyDown, true)
  }, [index, items.length, hasMultiple, onClose, onNavigate])

  if (!activeItem || index === null) return null

  const handleBackdropClick = (e: MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget || (e.target as HTMLElement).classList.contains('lb__stage')) {
      onClose()
    }
  }

  const toggleZoom = () => {
    setIsZoomed((prev) => !prev)
  }

  const prev = (e: MouseEvent) => {
    e.stopPropagation()
    onNavigate((index - 1 + items.length) % items.length)
  }

  const next = (e: MouseEvent) => {
    e.stopPropagation()
    onNavigate((index + 1) % items.length)
  }

  return (
    <div
      ref={containerRef}
      className="lb"
      role="dialog"
      aria-modal="true"
      aria-label={activeItem.name ?? 'Expanded Image View'}
      data-lenis-prevent
      onClick={handleBackdropClick}
    >
      <div className="lb__scrim" />

      {/* Header bar */}
      <header className="lb__header" onClick={(e) => e.stopPropagation()}>
        <div className="lb__meta">
          <div className="lb__tags">
            {activeItem.kicker ? <span className="lb__kicker">{activeItem.kicker}</span> : null}
            {activeItem.status ? <span className="lb__status">{activeItem.status}</span> : null}
            {hasMultiple ? (
              <span className="lb__counter">
                {index + 1} / {items.length}
              </span>
            ) : null}
          </div>
          {activeItem.name ? <h3 className="lb__title">{activeItem.name}</h3> : null}
        </div>

        <div className="lb__actions">
          {activeItem.href ? (
            <a
              href={activeItem.href}
              target="_blank"
              rel="noopener noreferrer"
              className="lb__btn lb__btn--link"
              title="Open Live Project in New Tab"
            >
              <span>Live Project</span>
              <ArrowUpRight size={16} weight="bold" />
            </a>
          ) : null}

          <button
            type="button"
            className="lb__btn lb__btn--zoom"
            onClick={toggleZoom}
            aria-label={isZoomed ? 'Fit to screen' : 'Zoom to actual size (1:1)'}
            title={isZoomed ? 'Fit to screen' : 'Zoom to actual size (1:1)'}
          >
            <MagnifyingGlass size={18} weight="bold" />
            <span>{isZoomed ? 'Fit' : '1:1'}</span>
          </button>

          <button
            type="button"
            className="lb__btn lb__btn--close"
            onClick={onClose}
            aria-label="Close expanded view"
            title="Close (Esc)"
          >
            <X size={20} weight="bold" />
          </button>
        </div>
      </header>

      {/* Stage: Image presentation area */}
      <div className={`lb__stage ${isZoomed ? 'lb__stage--zoomed' : ''}`}>
        {hasMultiple ? (
          <button
            type="button"
            className="lb__nav lb__nav--prev"
            onClick={prev}
            aria-label="Previous image"
            title="Previous (Left Arrow)"
          >
            <CaretLeft size={24} weight="bold" />
          </button>
        ) : null}

        <div className="lb__canvas-wrap">
          <img
            src={activeItem.src}
            alt={activeItem.alt ?? activeItem.name ?? 'Pipeline Screenshot'}
            className={`lb__img ${isZoomed ? 'lb__img--zoomed' : ''}`}
            onClick={toggleZoom}
            title={isZoomed ? 'Click to fit screen' : 'Click to zoom to full size'}
            decoding="async"
          />
        </div>

        {hasMultiple ? (
          <button
            type="button"
            className="lb__nav lb__nav--next"
            onClick={next}
            aria-label="Next image"
            title="Next (Right Arrow)"
          >
            <CaretRight size={24} weight="bold" />
          </button>
        ) : null}
      </div>

      {/* Footer bar */}
      {activeItem.summary ? (
        <footer className="lb__footer" onClick={(e) => e.stopPropagation()}>
          <p className="lb__summary">{activeItem.summary}</p>
          <div className="lb__hints">
            <span>[Esc] Close</span>
            {hasMultiple ? <span>[←/→] Navigate</span> : null}
            <span>[Click] {isZoomed ? 'Fit' : 'Zoom 1:1'}</span>
          </div>
        </footer>
      ) : null}
    </div>
  )
}
