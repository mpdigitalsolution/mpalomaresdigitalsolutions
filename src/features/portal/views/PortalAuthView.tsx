import React, { useState } from 'react'
import { usePortal } from '../PortalContext'
import { loginWithPasskey, createAdminClient } from '../portalApi'
import type { ClientRecord } from '../types'

interface PortalAuthViewProps {
  onLoginSuccess?: (client: ClientRecord) => void
}

export const PortalAuthView: React.FC<PortalAuthViewProps> = () => {
  const { setClientId, availableClients, loading } = usePortal()
  const [mode, setMode] = useState<'login' | 'signup' | 'demo'>('login')

  // Log in form state
  const [passkey, setPasskey] = useState('')
  const [loggingIn, setLoggingIn] = useState(false)
  const [loginError, setLoginError] = useState<string | null>(null)

  // Sign up form state
  const [company, setCompany] = useState('')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [newPasskey, setNewPasskey] = useState('')
  const [projectName, setProjectName] = useState('')
  const [tier, setTier] = useState('Enterprise Automation Retainer')
  const [signingUp, setSigningUp] = useState(false)
  const [signupError, setSignupError] = useState<string | null>(null)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!passkey.trim()) return
    setLoggingIn(true)
    setLoginError(null)

    try {
      const client = await loginWithPasskey(passkey.trim())
      setClientId(client.id)
    } catch (err: unknown) {
      setLoginError(
        err instanceof Error
          ? err.message
          : 'Invalid passkey. Try demo passkeys: apex2026 or resilience2026'
      )
    } finally {
      setLoggingIn(false)
    }
  }

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!company.trim() || !email.trim() || !newPasskey.trim()) {
      setSignupError('Please fill in company name, email, and a passkey.')
      return
    }

    setSigningUp(true)
    setSignupError(null)

    try {
      const created = await createAdminClient({
        company: company.trim(),
        name: name.trim() || 'Lead Executive',
        email: email.trim(),
        passkey: newPasskey.trim(),
        projectName: projectName.trim() || `${company.trim()} AI Automation Suite`,
        tier,
      })
      setClientId(created.id)
    } catch (err: unknown) {
      setSignupError(err instanceof Error ? err.message : 'Failed to register workspace.')
    } finally {
      setSigningUp(false)
    }
  }

  const handleSelectDemo = (client: ClientRecord) => {
    setClientId(client.id)
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col justify-between relative selection:bg-emerald-500/20 selection:text-emerald-300">
      {/* Background ambient glow */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-emerald-500/10 rounded-full blur-[140px]" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-teal-500/5 rounded-full blur-[120px]" />
      </div>

      {/* Top Navigation Bar */}
      <header className="relative z-10 border-b border-zinc-900 bg-zinc-950/80 backdrop-blur-md px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-mono text-sm font-bold shadow-sm shadow-emerald-500/20">
            MP
          </div>
          <div>
            <div className="text-sm font-bold tracking-tight text-zinc-100">Client Operations Portal OS</div>
            <div className="text-[11px] text-zinc-400 font-mono">Edge-Native Distributed Workspace</div>
          </div>
        </div>

        <a
          href="/"
          className="text-xs text-zinc-400 hover:text-white flex items-center gap-1.5 transition-colors font-mono"
        >
          <span>←</span> Back to Portfolio
        </a>
      </header>

      {/* Main Authentication Card */}
      <main className="relative z-10 flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-lg bg-zinc-900/90 border border-zinc-800 rounded-2xl p-6 sm:p-8 shadow-2xl shadow-black/80 backdrop-blur-xl">
          {/* Header */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono mb-3">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Cloudflare D1 + R2 Multi-Tenant
            </div>
            <h1 className="text-2xl font-bold text-zinc-100 tracking-tight">Access Client Workspace</h1>
            <p className="text-xs text-zinc-400 mt-1 max-w-sm mx-auto">
              Authenticate into your secure client portal for real-time onboarding, digital contracts, deliverable reviews, and chat.
            </p>
          </div>

          {/* Mode Switcher Tabs */}
          <div className="flex p-1 bg-zinc-950 border border-zinc-800 rounded-xl mb-6">
            <button
              onClick={() => setMode('login')}
              className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
                mode === 'login'
                  ? 'bg-zinc-800 text-white shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Log In
            </button>
            <button
              onClick={() => setMode('signup')}
              className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
                mode === 'signup'
                  ? 'bg-zinc-800 text-white shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Register Workspace
            </button>
            <button
              onClick={() => setMode('demo')}
              className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
                mode === 'demo'
                  ? 'bg-zinc-800 text-emerald-400 shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Demo Profiles
            </button>
          </div>

          {/* 1. Log In Mode */}
          {mode === 'login' && (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                  Client Passkey or Email
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    placeholder="Enter passkey (e.g. apex2026)"
                    value={passkey}
                    onChange={(e) => setPasskey(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-sm text-zinc-100 font-mono placeholder:text-zinc-600 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
                  />
                </div>
                <div className="mt-2 flex items-center justify-between text-[11px] text-zinc-400 font-mono">
                  <span>Demo passkey: <code className="text-emerald-400 font-bold">apex2026</code></span>
                  <span>Or: <code className="text-emerald-400 font-bold">resilience2026</code></span>
                </div>
              </div>

              {loginError && (
                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs">
                  {loginError}
                </div>
              )}

              <button
                type="submit"
                disabled={loggingIn || !passkey.trim()}
                className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-sm transition-all shadow-lg shadow-emerald-500/20 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loggingIn ? (
                  <>
                    <div className="w-4 h-4 border-2 border-zinc-950 border-t-transparent rounded-full animate-spin" />
                    <span>Verifying Credentials...</span>
                  </>
                ) : (
                  <span>Sign In to Client Workspace →</span>
                )}
              </button>

              <div className="pt-2 text-center">
                <button
                  type="button"
                  onClick={() => setMode('demo')}
                  className="text-xs text-zinc-500 hover:text-emerald-400 transition-colors"
                >
                  Don't have a passkey? Explore pre-configured demo workspaces →
                </button>
              </div>
            </form>
          )}

          {/* 2. Sign Up / Register Workspace Mode */}
          {mode === 'signup' && (
            <form onSubmit={handleSignup} className="space-y-3.5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">
                    Company / Organization
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Elevate Ventures"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-xs text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">
                    Your Full Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Morgan Vance"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-xs text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">
                    Work Email
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="morgan@elevate.io"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-xs text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">
                    Create Workspace Passkey
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. elevate2026"
                    value={newPasskey}
                    onChange={(e) => setNewPasskey(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-xs text-zinc-100 font-mono placeholder:text-zinc-600 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">
                  Project or Automation Scope
                </label>
                <input
                  type="text"
                  placeholder="e.g. n8n Lead Funnel & GoHighLevel CRM Sync"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-xs text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">
                  Service Retainer Tier
                </label>
                <select
                  value={tier}
                  onChange={(e) => setTier(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-xs text-zinc-100 focus:outline-none focus:border-emerald-500"
                >
                  <option value="Enterprise Automation Retainer">Enterprise Automation Retainer ($3,200/mo)</option>
                  <option value="Clinical Growth Retainer">Clinical Growth Retainer ($2,450/mo)</option>
                  <option value="Custom AI Infrastructure">Custom AI Infrastructure (Fixed Sprint)</option>
                </select>
              </div>

              {signupError && (
                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs">
                  {signupError}
                </div>
              )}

              <button
                type="submit"
                disabled={signingUp || !company.trim() || !email.trim() || !newPasskey.trim()}
                className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-sm transition-all shadow-lg shadow-emerald-500/20 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {signingUp ? (
                  <>
                    <div className="w-4 h-4 border-2 border-zinc-950 border-t-transparent rounded-full animate-spin" />
                    <span>Provisioning D1 Isolated Workspace...</span>
                  </>
                ) : (
                  <span>Create Workspace & Enter Portal →</span>
                )}
              </button>
            </form>
          )}

          {/* 3. Demo Profiles Mode */}
          {mode === 'demo' && (
            <div className="space-y-3">
              <p className="text-xs text-zinc-400 mb-3">
                Experience real multi-tenant data isolation. Click any client profile to launch their dedicated workspace:
              </p>

              {availableClients && availableClients.length > 0 ? (
                availableClients.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => handleSelectDemo(c)}
                    className="w-full p-4 rounded-xl bg-zinc-950/70 border border-zinc-800 hover:border-emerald-500/50 hover:bg-zinc-950 flex items-center justify-between text-left transition-all group"
                  >
                    <div className="flex items-center gap-3.5">
                      {c.avatar_url ? (
                        <img
                          src={c.avatar_url}
                          alt={c.name}
                          className="w-10 h-10 rounded-full object-cover ring-1 ring-zinc-700 group-hover:ring-emerald-500"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center font-bold text-xs text-zinc-200">
                          {c.company.slice(0, 2).toUpperCase()}
                        </div>
                      )}
                      <div>
                        <div className="text-sm font-bold text-zinc-200 group-hover:text-emerald-400 transition-colors">
                          {c.company}
                        </div>
                        <div className="text-xs text-zinc-400">
                          {c.name} • <span className="text-zinc-500">{c.tier}</span>
                        </div>
                        <div className="text-[11px] text-zinc-500 mt-0.5 truncate max-w-xs">
                          {c.project_name}
                        </div>
                      </div>
                    </div>

                    <span className="text-xs font-medium text-emerald-400 group-hover:translate-x-1 transition-transform">
                      Enter →
                    </span>
                  </button>
                ))
              ) : (
                <div className="text-center py-6 text-xs text-zinc-500">
                  {loading ? 'Loading demo profiles from Cloudflare D1...' : 'No demo profiles available'}
                </div>
              )}

              <div className="pt-2 text-center">
                <button
                  type="button"
                  onClick={() => setMode('login')}
                  className="text-xs text-zinc-400 hover:text-white transition-colors"
                >
                  Have your own client passkey? Log in here →
                </button>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-zinc-900 bg-zinc-950/80 px-6 py-4 text-center text-xs text-zinc-400 font-mono">
        Cloudflare Edge D1 • R2 Assets • Webhook Automation Telemetry • ESIGN Compliant Audit Trail
      </footer>
    </div>
  )
}
