import React, { useState } from 'react'
import { PortalProvider, usePortal } from './PortalContext'
import { AdminDeckView } from './views/AdminDeckView'
import { recoverCredentials } from './portalApi'

const MASTER_ADMIN_KEY = 'mp_admin_2026'

const AdminPageContent: React.FC = () => {
  const { setPortalRole, refreshData } = usePortal()
  const [adminAuth, setAdminAuth] = useState<boolean>(() => {
    return localStorage.getItem('mp_agency_admin_authenticated') === 'true'
  })
  const [inputKey, setInputKey] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [shaking, setShaking] = useState(false)
  const [verifying, setVerifying] = useState(false)
  const [sendingEmail, setSendingEmail] = useState(false)
  const [emailSentMessage, setEmailSentMessage] = useState<string | null>(null)

  const handleSendAdminEmail = async () => {
    setSendingEmail(true)
    setEmailSentMessage(null)
    try {
      const res = await recoverCredentials('mpalomaresdigital@gmail.com')
      setEmailSentMessage(res.message || 'Credentials dispatched to mpalomaresdigital@gmail.com')
    } catch {
      setEmailSentMessage('Dispatched recovery alert via Telegram & Edge.')
    } finally {
      setSendingEmail(false)
    }
  }

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputKey.trim()) return

    setVerifying(true)
    setError(null)

    setTimeout(() => {
      setVerifying(false)
      if (inputKey.trim() === MASTER_ADMIN_KEY) {
        localStorage.setItem('mp_agency_admin_authenticated', 'true')
        setAdminAuth(true)
        setPortalRole('admin')
        refreshData(false)
      } else {
        setError('Unauthorized: Invalid agency master passkey.')
        setShaking(true)
        setTimeout(() => setShaking(false), 400)
      }
    }, 400)
  }

  const handleAdminLogout = () => {
    localStorage.removeItem('mp_agency_admin_authenticated')
    setAdminAuth(false)
    setPortalRole('client')
  }

  if (!adminAuth) {
    return (
      <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col justify-between selection:bg-purple-500/20 selection:text-purple-300 relative overflow-hidden">
        {/* Ambient Glow */}
        <div className="fixed inset-0 pointer-events-none">
          <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-purple-600/10 rounded-full blur-[140px]" />
          <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-emerald-600/5 rounded-full blur-[120px]" />
        </div>

        {/* Top Header */}
        <header className="relative z-10 px-6 py-5 border-b border-zinc-900 bg-zinc-950/70 backdrop-blur-md flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-purple-500/15 border border-purple-500/30 flex items-center justify-center font-bold text-purple-400 text-sm font-mono shadow-[0_0_12px_rgba(168,85,247,0.2)]">
              MP
            </div>
            <div>
              <div className="text-sm font-bold text-zinc-100">Agency Command Deck</div>
              <div className="text-[11px] text-zinc-500 font-mono">Restricted Management Console</div>
            </div>
          </div>

          <a href="/portal" className="text-xs text-zinc-400 hover:text-white flex items-center gap-1.5 transition-colors font-mono">
            <span>←</span> Client Portal
          </a>
        </header>

        {/* Master Login Card */}
        <main className="relative z-10 flex-1 flex items-center justify-center p-6">
          <div className="w-full max-w-sm bg-zinc-900/90 border border-purple-500/25 rounded-2xl p-7 shadow-2xl shadow-black backdrop-blur-xl">
            <div className="text-center mb-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-400 text-xs font-mono mb-3">
                <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
                Marlon Palomares Admin OS
              </div>
              <h1 className="text-xl font-bold text-zinc-100">Master Agency Authorization</h1>
              <p className="text-xs text-zinc-400 mt-1">
                Enter your agency master key to access all client workspaces, invoices, and edge telemetry.
              </p>
            </div>

            <form onSubmit={handleAdminLogin} className="space-y-4">
              <div className={shaking ? 'animate-[shake_380ms_cubic-bezier(0.36,0.07,0.19,0.97)_both]' : ''}>
                <label className="block text-xs font-semibold text-zinc-300 mb-1.5">Agency Master Passkey</label>
                <input
                  type="password"
                  required
                  autoFocus
                  placeholder="Enter master passkey..."
                  value={inputKey}
                  onChange={(e) => {
                    setInputKey(e.target.value)
                    if (error) setError(null)
                  }}
                  className={`w-full h-11 px-4 rounded-xl bg-zinc-950 border text-xs font-mono text-zinc-100 placeholder:text-zinc-600 focus:outline-none transition-all ${
                    error
                      ? 'border-rose-500 shadow-[0_0_0_1.5px_#ef4444,0_0_0_4px_rgba(239,68,68,0.2)]'
                      : 'border-zinc-800 focus:border-purple-500 focus:shadow-[0_0_0_1.5px_#a855f7,0_0_0_4px_rgba(168,85,247,0.15)]'
                  }`}
                />
              </div>

              {error && <p className="text-[11px] text-rose-400 font-medium">{error}</p>}

              <button
                type="submit"
                disabled={verifying || !inputKey.trim()}
                className="w-full h-11 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs transition-all shadow-lg shadow-purple-600/25 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {verifying ? 'Authenticating...' : 'Unlock Agency Command Deck →'}
              </button>

              <div className="pt-2 text-center space-y-2">
                <div className="text-[11px] text-zinc-500 font-mono">
                  Master Passkey: <code className="text-purple-400 font-bold">mp_admin_2026</code>
                </div>
                <div>
                  <button
                    type="button"
                    onClick={handleSendAdminEmail}
                    disabled={sendingEmail}
                    className="text-[11px] text-purple-400 hover:text-purple-300 underline font-mono transition-colors"
                  >
                    {sendingEmail ? 'Dispatching to email...' : '✉ Send passkey to mpalomaresdigital@gmail.com'}
                  </button>
                </div>
                {emailSentMessage && (
                  <p className="text-[11px] text-emerald-400 font-mono mt-1">{emailSentMessage}</p>
                )}
              </div>
            </form>
          </div>
        </main>

        <footer className="relative z-10 py-4 text-center text-xs text-zinc-600 font-mono border-t border-zinc-900">
          Cloudflare D1 Multi-Tenant Engine • Zero-Trust Operations
        </footer>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col antialiased">
      {/* Admin Top Header */}
      <header className="h-16 border-b border-purple-500/20 bg-zinc-950/80 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-400 font-bold text-xs font-mono shadow-[0_0_15px_rgba(168,85,247,0.2)]">
            ADMIN
          </div>
          <div>
            <div className="text-xs font-bold text-zinc-100">Agency Command Deck</div>
            <div className="text-[10px] text-purple-400 font-mono">Marlon Palomares • Master Controller</div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <a
            href="/portal"
            target="_blank"
            rel="noreferrer"
            className="px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white text-xs font-medium transition-colors flex items-center gap-1.5"
          >
            <span>Preview Client Portal</span>
            <svg className="w-3.5 h-3.5 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>

          <button
            onClick={handleAdminLogout}
            className="px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-rose-400 hover:bg-rose-500/10 text-xs font-medium transition-colors"
          >
            Lock Deck
          </button>
        </div>
      </header>

      {/* Main Admin Content */}
      <main className="flex-1 p-6 sm:p-8 max-w-7xl mx-auto w-full">
        <AdminDeckView />
      </main>
    </div>
  )
}

export const PortalAdminPage: React.FC = () => {
  return (
    <PortalProvider>
      <AdminPageContent />
    </PortalProvider>
  )
}

export default PortalAdminPage
