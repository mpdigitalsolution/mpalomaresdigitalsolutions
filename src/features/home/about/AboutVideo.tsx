import { useEffect, useRef, useState } from 'react'
import { Pause, Play } from '@phosphor-icons/react'
import { useMediaQuery } from '@/hooks/use-media-query'
import './about-video.css'

function SoundOnIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
      <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
      <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
    </svg>
  )
}

function SoundOffIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
      <line x1="22" y1="9" x2="16" y2="15" />
      <line x1="16" y1="9" x2="22" y2="15" />
    </svg>
  )
}

export function AboutVideo() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const reduce = useMediaQuery('(prefers-reduced-motion: reduce)')
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [hasInteracted, setHasInteracted] = useState(false)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    // Default to unmuted
    video.muted = false

    const unmuteAndPlay = () => {
      video.muted = false
      setIsMuted(false)
      video.play().catch(() => {
        // If unmuted playback is blocked by browser autoplay policy before user gesture,
        // start muted and unmute immediately on the first user interaction anywhere
        video.muted = true
        setIsMuted(true)
        video.play().catch(() => setIsPlaying(false))

        const enableAudioOnGesture = () => {
          if (videoRef.current) {
            videoRef.current.muted = false
            setIsMuted(false)
            videoRef.current.play().catch(() => {})
          }
          window.removeEventListener('pointerdown', enableAudioOnGesture)
          window.removeEventListener('click', enableAudioOnGesture)
          window.removeEventListener('touchstart', enableAudioOnGesture)
          window.removeEventListener('keydown', enableAudioOnGesture)
          window.removeEventListener('scroll', enableAudioOnGesture)
        }

        window.addEventListener('pointerdown', enableAudioOnGesture, { once: true, passive: true })
        window.addEventListener('click', enableAudioOnGesture, { once: true, passive: true })
        window.addEventListener('touchstart', enableAudioOnGesture, { once: true, passive: true })
        window.addEventListener('keydown', enableAudioOnGesture, { once: true, passive: true })
        window.addEventListener('scroll', enableAudioOnGesture, { once: true, passive: true })
      })
    }

    // If reduced motion is requested, do not autoplay
    if (reduce && !hasInteracted) {
      video.pause()
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          unmuteAndPlay()
        } else {
          video.pause()
        }
      },
      { threshold: 0.25 },
    )

    observer.observe(video)
    return () => observer.disconnect()
  }, [reduce, hasInteracted])

  const togglePlay = () => {
    setHasInteracted(true)
    const video = videoRef.current
    if (!video) return

    if (isPlaying) {
      video.pause()
    } else {
      video.muted = false
      setIsMuted(false)
      video.play().catch(() => {})
    }
  }

  const toggleMute = () => {
    setHasInteracted(true)
    const video = videoRef.current
    if (!video) return

    const nextMuted = !isMuted
    video.muted = nextMuted
    setIsMuted(nextMuted)
  }

  const handleFrameClick = (e: React.MouseEvent) => {
    // Only handle if clicking video itself, not the control buttons
    if ((e.target as HTMLElement).closest('.ab-video-controls')) return
    const video = videoRef.current
    if (!video) return

    setHasInteracted(true)
    if (video.muted) {
      video.muted = false
      setIsMuted(false)
    }
    if (video.paused) {
      video.play().catch(() => {})
    }
  }

  return (
    <div className="ab-video-wrap" data-reveal>
      <div className="ab-video-glow" aria-hidden="true" />
      <div className="ab-video-frame" onClick={handleFrameClick}>
        {/* Floating Identity Badge */}
        <div className="ab-video-badge">
          <span className="ab-video-dot" aria-hidden="true" />
          <span className="ab-video-title">Marlon Palomares</span>
          <span className="ab-video-role">Founder</span>
        </div>

        {/* Video Element */}
        <video
          ref={videoRef}
          src="/media/about-me.mp4"
          className="ab-video-el"
          playsInline
          muted={isMuted}
          loop
          preload="auto"
          aria-label="Marlon Palomares video introduction"
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
        />

        {/* Floating Controls Bar at Bottom */}
        <div className="ab-video-bottom-bar">
          <div className="ab-video-tag" aria-hidden="true">
            <span className="ab-video-tag-wave" />
            <span>Intro Video</span>
          </div>

          <div className="ab-video-controls" role="group" aria-label="Video controls">
            <button
              type="button"
              className="ab-video-btn"
              onClick={togglePlay}
              aria-label={isPlaying ? 'Pause video' : 'Play video'}
              title={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? <Pause size={15} weight="fill" aria-hidden="true" /> : <Play size={15} weight="fill" aria-hidden="true" />}
            </button>

            <button
              type="button"
              className="ab-video-btn"
              onClick={toggleMute}
              aria-label={isMuted ? 'Unmute video' : 'Mute video'}
              title={isMuted ? 'Unmute' : 'Mute'}
            >
              {isMuted ? <SoundOffIcon /> : <SoundOnIcon />}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
