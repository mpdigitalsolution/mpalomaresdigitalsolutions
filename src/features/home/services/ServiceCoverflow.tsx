import { useState, useEffect, useRef, type KeyboardEvent, type MouseEvent } from 'react'

export interface CoverflowFrame {
  src: string
  alt: string
  title: string
  caption: string
}

interface ServiceCoverflowProps {
  frames: CoverflowFrame[]
  autoAdvanceMs?: number
}

export function ServiceCoverflow({ frames, autoAdvanceMs = 3800 }: ServiceCoverflowProps) {
  const [active, setActive] = useState(0)
  const [isHovered, setIsHovered] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  // Auto-advance when not hovered or focused
  useEffect(() => {
    if (isHovered || frames.length <= 1) return

    const timer = setInterval(() => {
      setActive((prev) => (prev + 1) % frames.length)
    }, autoAdvanceMs)

    return () => clearInterval(timer)
  }, [isHovered, frames.length, autoAdvanceMs])

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'ArrowRight') {
      e.preventDefault()
      setActive((prev) => Math.min(frames.length - 1, prev + 1))
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault()
      setActive((prev) => Math.max(0, prev - 1))
    }
  }

  const handleCoverClick = (e: MouseEvent, index: number) => {
    e.preventDefault()
    e.stopPropagation()
    setActive(index)
  }

  if (!frames.length) return null

  const currentFrame = frames[active] ?? frames[0]
  if (!currentFrame) return null

  return (
    <div
      ref={containerRef}
      className="sv__cf"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onKeyDown={handleKeyDown}
      role="region"
      aria-label="Interactive 3D Project Coverflow"
      tabIndex={0}
    >
      <div className="sv__cf-stage">
        {frames.map((frame, i) => {
          const d = i - active
          const side = Math.sign(d)
          const abs = Math.abs(d)

          // 3D Coverflow geometry: side translation, push back, rotate along Y axis
          const translateX = side * (abs ? 66 + (abs - 1) * 24 : 0)
          const translateZ = abs ? -110 - abs * 40 : 40
          const rotateY = -side * (abs ? 54 : 0)
          const zIndex = 10 - abs
          const opacity = abs > 2 ? 0 : 1

          const transform = `translateX(${translateX}%) translateZ(${translateZ}px) rotateY(${rotateY}deg)`

          return (
            <button
              key={frame.src}
              type="button"
              className="sv__cf-item"
              onClick={(e) => handleCoverClick(e, i)}
              style={{
                transform,
                zIndex,
                opacity,
              }}
              aria-label={`${frame.title} - ${frame.caption}`}
              aria-pressed={i === active}
            >
              <div className="sv__cf-img-wrap">
                <img
                  src={frame.src}
                  alt={frame.alt}
                  loading="lazy"
                  draggable={false}
                />
              </div>
            </button>
          )
        })}
      </div>

      {/* Dynamic Title and Caption */}
      <div className="sv__cf-caption" aria-live="polite">
        <b className="sv__cf-title">{currentFrame.title}</b>
        <span className="sv__cf-sub">{currentFrame.caption}</span>
      </div>

      {/* Pagination Indicators */}
      <div className="sv__cf-dots" aria-hidden="true">
        {frames.map((_, i) => (
          <button
            key={i}
            type="button"
            className={`sv__cf-dot ${i === active ? 'is-active' : ''}`}
            onClick={(e) => handleCoverClick(e, i)}
            tabIndex={-1}
            aria-label={`Jump to slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  )
}
