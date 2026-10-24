import React, { useState, useRef, useEffect } from 'react'
import { usePortal } from '../PortalContext'

export const ChatView: React.FC = () => {
  const { messages, client, handleSendMessage } = usePortal()
  const [inputText, setInputText] = useState('')
  const [isSending, setIsSending] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement | null>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputText.trim() || isSending) return

    const text = inputText.trim()
    setInputText('')
    setIsSending(true)
    try {
      await handleSendMessage(text)
    } finally {
      setIsSending(false)
    }
  }

  return (
    <div className="flex flex-col h-[calc(100vh-10rem)] rounded-2xl bg-zinc-950 border border-zinc-800/90 overflow-hidden shadow-2xl">
      {/* Thread Header */}
      <div className="px-6 py-4 bg-zinc-900/80 border-b border-zinc-800 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-9 h-9 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center font-bold text-emerald-400 text-xs">
              MP
            </div>
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-zinc-900" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-zinc-100">Agency Engineering Channel</h3>
            <p className="text-[11px] text-zinc-400">
              Direct connection with Marlon Palomares • Dedicated Sprint Chat
            </p>
          </div>
        </div>

        <div className="text-[10px] font-mono text-zinc-500 bg-zinc-950 px-2.5 py-1 rounded border border-zinc-800">
          TLS 1.3 End-to-End Encrypted
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.map((msg) => {
          const isMe = msg.sender === 'client'
          const isSystem = msg.sender === 'system'

          if (isSystem) {
            return (
              <div key={msg.id} className="flex justify-center my-2">
                <div className="px-3 py-1.5 rounded-full bg-zinc-900/90 border border-zinc-800 text-[11px] text-zinc-400 font-mono text-center max-w-md flex items-center gap-2">
                  <span>⚙️</span>
                  <span>{msg.message_text}</span>
                </div>
              </div>
            )
          }

          return (
            <div
              key={msg.id}
              className={`flex items-end gap-2.5 ${isMe ? 'justify-end' : 'justify-start'}`}
            >
              {!isMe && (
                <div className="w-7 h-7 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-[10px] font-bold text-emerald-400 shrink-0 mb-1">
                  MP
                </div>
              )}

              <div className={`max-w-md space-y-1 ${isMe ? 'items-end' : 'items-start'}`}>
                <div className={`flex items-center gap-2 text-[10px] text-zinc-500 ${isMe ? 'justify-end' : ''}`}>
                  <span className="font-semibold text-zinc-400">{msg.sender_name}</span>
                  <span>•</span>
                  <span>
                    {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>

                <div
                  className={`p-3.5 rounded-2xl text-xs leading-relaxed ${
                    isMe
                      ? 'bg-emerald-600 text-white rounded-br-none shadow-md shadow-emerald-900/20'
                      : 'bg-zinc-900 text-zinc-200 border border-zinc-800/80 rounded-bl-none'
                  }`}
                >
                  {msg.message_text}
                </div>
              </div>

              {isMe && (
                <div className="w-7 h-7 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-[10px] font-bold text-zinc-300 shrink-0 mb-1">
                  {client?.name ? client.name.slice(0, 2).toUpperCase() : 'ME'}
                </div>
              )}
            </div>
          )
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input Bar */}
      <form onSubmit={handleSend} className="p-4 bg-zinc-900/90 border-t border-zinc-800 flex items-center gap-3 shrink-0">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Ask a question or request a sprint adjustment..."
          className="flex-1 px-4 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-emerald-500 transition-colors"
        />
        <button
          type="submit"
          disabled={!inputText.trim() || isSending}
          className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-xs transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5 shadow-md shadow-emerald-500/20"
        >
          <span>Send</span>
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </button>
      </form>
    </div>
  )
}
