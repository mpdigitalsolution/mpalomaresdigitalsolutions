import React, { useState } from 'react'
import { usePortal } from '../PortalContext'
import { loginWithPasskey } from '../portalApi'

export const PortalHeader: React.FC = () => {
  const { client, clientId, setClientId, availableClients, loading, refreshData, setMobileNavOpen } = usePortal()
  const [switcherOpen, setSwitcherOpen] = useState(false)
  const [passkeyInput, setPasskeyInput] = useState('')
  const [loginError, setLoginError] = useState<string | null>(null)
  const [authenticating, setAuthenticating] = useState(false)

  const handlePasskeyLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!passkeyInput.trim()) return
    setAuthenticating(true)
    setLoginError(null)
    try {
      const authenticatedClient = await loginWithPasskey(passkeyInput.trim())
      setClientId(authenticatedClient.id)
      setSwitcherOpen(false)
      setPasskeyInput('')
    } catch (err: unknown) {
      setLoginError(err instanceof Error ? err.message : 'Invalid passkey')
    } finally {
      setAuthenticating(false)
    }
  }

  return (
    <>
      <header className="h-16 border-b border-zinc-800/80 bg-zinc-950/70 backdrop-blur-md px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30">
        {/* Left: Mobile Drawer Trigger + Active Project Meta */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          <button
            onClick={() => setMobileNavOpen(true)}
            className="md:hidden p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white transition-colors"
            title="Open Navigation Menu"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          <button
            onClick={() => setSwitcherOpen(true)}
            className="flex items-center gap-2.5 text-left group p-1 -m-1 rounded-xl hover:bg-zinc-900/60 transition-colors"
            title="Click to Switch Client Workspace"
          >
          {client?.avatar_url ? (
            <img
              src={client.avatar_url}
              alt={client.name}
              className="w-9 h-9 rounded-full object-cover ring-1 ring-zinc-700/80 group-hover:ring-emerald-500 transition-all"
            />
          ) : (
            <div className="w-9 h-9 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-xs font-semibold text-zinc-300">
              {client?.company?.slice(0, 2).toUpperCase() || 'CL'}
            </div>
          )}
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-semibold text-zinc-100 group-hover:text-emerald-400 transition-colors">
                {client?.company || 'Loading Client...'}
              </h2>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                {client?.tier || 'Automation Client'}
              </span>
              <svg className="w-3.5 h-3.5 text-zinc-500 group-hover:text-zinc-300 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
            <p className="text-xs text-zinc-400 truncate max-w-xs md:max-w-md">
              {client?.name ? `${client.name} • ${client.project_name}` : 'Multi-Tenant Operations'}
            </p>
          </div>
        </button>
      </div>

      {/* Right: Cloudflare Edge Status & Refresh */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSwitcherOpen(true)}
            className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white hover:border-zinc-700 text-xs font-medium transition-colors"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Switch Workspace</span>
          </button>

          <button
            onClick={() => refreshData(false)}
            disabled={loading}
            title="Refresh from Cloudflare Edge"
            className="p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700 transition-colors disabled:opacity-50"
          >
            <svg
              className={`w-4 h-4 ${loading ? 'animate-spin text-emerald-400' : ''}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
        </div>
      </header>

      {/* Workspace Switcher & Passkey Modal */}
      {switcherOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-2xl relative">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
              <h3 className="text-base font-bold text-zinc-100">Select Client Workspace</h3>
              <button
                onClick={() => setSwitcherOpen(false)}
                className="text-zinc-500 hover:text-zinc-300 p-1 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-zinc-400 mt-2">
              Each workspace demonstrates strict tenant isolation (RLS) on Cloudflare D1. Switch accounts or enter an invite passkey:
            </p>

            {/* Presets List */}
            <div className="mt-4 space-y-2">
              {availableClients.length > 0 ? (
                availableClients.map((c) => {
                  const isActive = c.id === clientId
                  return (
                    <button
                      key={c.id}
                      onClick={() => {
                        setClientId(c.id)
                        setSwitcherOpen(false)
                      }}
                      className={`w-full p-3 rounded-xl border text-left flex items-center justify-between transition-all ${
                        isActive
                          ? 'bg-emerald-500/10 border-emerald-500/40 shadow-sm'
                          : 'bg-zinc-950/60 border-zinc-800 hover:border-zinc-700'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        {c.avatar_url ? (
                          <img
                            src={c.avatar_url}
                            alt={c.name}
                            className="w-8 h-8 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center text-xs font-bold text-zinc-300">
                            {c.company.slice(0, 2).toUpperCase()}
                          </div>
                        )}
                        <div>
                          <div className="text-xs font-bold text-zinc-200">{c.company}</div>
                          <div className="text-[11px] text-zinc-400">{c.name} • {c.tier}</div>
                        </div>
                      </div>

                      {isActive && (
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                          Active
                        </span>
                      )}
                    </button>
                  )
                })
              ) : (
                <div className="space-y-2">
                  <button
                    onClick={() => {
                      setClientId('client_demo')
                      setSwitcherOpen(false)
                    }}
                    className={`w-full p-3 rounded-xl border text-left flex items-center justify-between ${
                      clientId === 'client_demo'
                        ? 'bg-emerald-500/10 border-emerald-500/40'
                        : 'bg-zinc-950/60 border-zinc-800'
                    }`}
                  >
                    <div>
                      <div className="text-xs font-bold text-zinc-200">Apex Health Partners</div>
                      <div className="text-[11px] text-zinc-400">Sarah Lin • Enterprise Retainer</div>
                    </div>
                    {clientId === 'client_demo' && (
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400">
                        Active
                      </span>
                    )}
                  </button>

                  <button
                    onClick={() => {
                      setClientId('client_resilience')
                      setSwitcherOpen(false)
                    }}
                    className={`w-full p-3 rounded-xl border text-left flex items-center justify-between ${
                      clientId === 'client_resilience'
                        ? 'bg-emerald-500/10 border-emerald-500/40'
                        : 'bg-zinc-950/60 border-zinc-800'
                    }`}
                  >
                    <div>
                      <div className="text-xs font-bold text-zinc-200">Resilience Therapy Clinic</div>
                      <div className="text-[11px] text-zinc-400">Dr. Marcus Vance • Clinical Retainer</div>
                    </div>
                    {clientId === 'client_resilience' && (
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400">
                        Active
                      </span>
                    )}
                  </button>
                </div>
              )}
            </div>

            {/* Passkey Login Form */}
            <form onSubmit={handlePasskeyLogin} className="mt-5 pt-4 border-t border-zinc-800 space-y-3">
              <label className="block text-xs font-medium text-zinc-300">
                Or Enter Client Passkey (e.g. <code className="text-emerald-400">apex2026</code> or <code className="text-emerald-400">resilience2026</code>)
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Enter passkey or email..."
                  value={passkeyInput}
                  onChange={(e) => setPasskeyInput(e.target.value)}
                  className="flex-1 px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-xs text-zinc-200 font-mono focus:outline-none focus:border-emerald-500"
                />
                <button
                  type="submit"
                  disabled={authenticating || !passkeyInput.trim()}
                  className="px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-xs transition-colors disabled:opacity-40"
                >
                  {authenticating ? 'Verifying...' : 'Login'}
                </button>
              </div>
              {loginError && <p className="text-[11px] text-rose-400">{loginError}</p>}
            </form>
          </div>
        </div>
      )}
    </>
  )
}
