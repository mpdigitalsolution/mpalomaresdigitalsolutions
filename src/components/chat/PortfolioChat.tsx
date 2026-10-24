import { useEffect, useRef, useState, type FormEvent, type KeyboardEvent } from 'react'
import { ArrowUpRight, PaperPlaneTilt, X } from '@phosphor-icons/react'
import './portfolio-chat.css'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
}

const CHAT_ENDPOINT =
  import.meta.env.VITE_CHATBOT_API_URL ||
  'https://portfolio-chatbot-worker.portfolio-chatbot-worker.workers.dev/chat'

const STARTER_PROMPTS = [
  '⚡ What n8n automations do you build?',
  '🚀 How do you set up GoHighLevel CRM?',
  '🎯 Tell me about the 22-node AI Job Scraper',
  '📅 How can I contact or hire Marlon?',
]

const INITIAL_MESSAGE: Message = {
  id: 'init-0',
  role: 'assistant',
  content:
    "Hi there! 👋 I'm Marlon's AI Operations Concierge, running on Cloudflare Edge with DeepSeek AI.\n\nAsk me about Marlon's autonomous n8n workflows, GoHighLevel architecture, client case studies, or how we can eliminate bottlenecks in your business!",
}

export function PortfolioChat() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([INITIAL_MESSAGE])
  const [input, setInput] = useState('')
  const [isStreaming, setIsStreaming] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Scroll to latest message
  useEffect(() => {
    if (isOpen) {
      scrollRef.current?.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: 'smooth',
      })
    }
  }, [messages, isOpen])

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 150)
    }
  }, [isOpen])

  const sendMessage = async (contentToSend: string) => {
    const trimmed = contentToSend.trim()
    if (!trimmed || isStreaming) return

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: trimmed,
    }

    const assistantMessageId = `asst-${Date.now()}`
    const placeholderAssistant: Message = {
      id: assistantMessageId,
      role: 'assistant',
      content: '',
    }

    const updatedMessages = [...messages, userMessage]
    setMessages([...updatedMessages, placeholderAssistant])
    setInput('')
    setIsStreaming(true)

    try {
      const response = await fetch(CHAT_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: updatedMessages.map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      })

      if (!response.ok || !response.body) {
        throw new Error(`Server returned ${response.status}`)
      }

      const reader = response.body.getReader()
      const decoder = new TextDecoder()
      let accumulatedText = ''

      while (true) {
        const { value, done } = await reader.read()
        if (done) break

        const chunk = decoder.decode(value, { stream: true })
        const lines = chunk.split('\n')

        for (const line of lines) {
          const trimmedLine = line.trim()
          if (!trimmedLine.startsWith('data:')) continue

          const dataStr = trimmedLine.replace(/^data:\s*/, '')
          if (dataStr === '[DONE]') continue

          try {
            const parsed = JSON.parse(dataStr)
            const delta = parsed.choices?.[0]?.delta?.content || ''
            if (delta) {
              accumulatedText += delta
              setMessages((prev) =>
                prev.map((m) =>
                  m.id === assistantMessageId ? { ...m, content: accumulatedText } : m
                )
              )
            }
          } catch {
            // Non-JSON SSE line or buffer split, continue
          }
        }
      }
    } catch {
      // Friendly fallback if edge endpoint is still initializing or offline
      setMessages((prev) =>
        prev.map((m) =>
          m.id === assistantMessageId
            ? {
                ...m,
                content:
                  "Marlon specializes in production-grade n8n automations, custom AI agents, and high-converting GoHighLevel systems. Feel free to contact him directly at [marlonpalomares04@gmail.com](mailto:marlonpalomares04@gmail.com) to discuss your project!",
              }
            : m
        )
      )
    } finally {
      setIsStreaming(false)
    }
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    sendMessage(input)
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage(input)
    }
  }

  return (
    <aside className="pc" aria-label="Portfolio AI Assistant">
      {/* Floating Launcher Button */}
      {!isOpen && (
        <button
          type="button"
          className="pc__launch"
          onClick={() => setIsOpen(true)}
          aria-label="Open AI Assistant"
        >
          <span className="pc__launch-icon">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
              <line x1="8" y1="10" x2="8.01" y2="10"></line>
              <line x1="12" y1="10" x2="12.01" y2="10"></line>
              <line x1="16" y1="10" x2="16.01" y2="10"></line>
            </svg>
          </span>
          <span className="pc__launch-label">
            <svg className="pc__sparkle" width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0l2.5 8.5L23 11l-8.5 2.5L12 22l-2.5-8.5L1 11l8.5-2.5z"/>
            </svg>
            <span>Ask AI</span>
          </span>
          <span className="pc__launch-ping" aria-hidden />
        </button>
      )}

      {/* Floating Chat Modal / Drawer */}
      {isOpen && (
        <div className="pc__window" role="dialog" aria-modal="false" data-lenis-prevent>
          {/* Header */}
          <header className="pc__header">
            <div className="pc__avatar-wrap">
              <span className="pc__avatar">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0l2.5 8.5L23 11l-8.5 2.5L12 22l-2.5-8.5L1 11l8.5-2.5z"/>
                </svg>
              </span>
              <span className="pc__status-dot" aria-hidden />
            </div>
            <div className="pc__title-box">
              <h3 className="pc__title">Marlon's AI Concierge</h3>
              <p className="pc__subtitle">Cloudflare Worker · DeepSeek AI</p>
            </div>
            <button
              type="button"
              className="pc__close"
              onClick={() => setIsOpen(false)}
              aria-label="Close Chat"
            >
              <X size={18} weight="bold" />
            </button>
          </header>

          {/* Messages Body */}
          <div ref={scrollRef} className="pc__body">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`pc__msg ${m.role === 'user' ? 'pc__msg--user' : 'pc__msg--bot'}`}
              >
                <div className="pc__bubble">
                  <p className="pc__text">{m.content}</p>
                </div>
              </div>
            ))}

            {isStreaming && (
              <div className="pc__typing">
                <span className="pc__typing-dot" />
                <span className="pc__typing-dot" />
                <span className="pc__typing-dot" />
              </div>
            )}
          </div>

          {/* Quick Prompts (only shown when conversation is fresh) */}
          {messages.length <= 2 && !isStreaming && (
            <div className="pc__chips">
              {STARTER_PROMPTS.map((prompt) => (
                <button
                  key={prompt}
                  type="button"
                  className="pc__chip"
                  onClick={() => sendMessage(prompt)}
                >
                  {prompt}
                </button>
              ))}
            </div>
          )}

          {/* Input Footer */}
          <form className="pc__foot" onSubmit={handleSubmit}>
            <input
              ref={inputRef}
              type="text"
              className="pc__input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask about automations, funnels..."
              disabled={isStreaming}
              maxLength={500}
            />
            <button
              type="submit"
              className="pc__send"
              disabled={!input.trim() || isStreaming}
              aria-label="Send message"
            >
              <PaperPlaneTilt size={17} weight="fill" />
            </button>
          </form>

          {/* Quick Contact Link */}
          <div className="pc__meta">
            <a href="mailto:marlonpalomares04@gmail.com" className="pc__email-link">
              <span>Direct: marlonpalomares04@gmail.com</span>
              <ArrowUpRight size={12} weight="bold" />
            </a>
          </div>
        </div>
      )}
    </aside>
  )
}
