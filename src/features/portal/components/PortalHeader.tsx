import React from 'react'
import { usePortal } from '../PortalContext'

export const PortalHeader: React.FC = () => {
  const { client, loading, refreshData } = usePortal()

  return (
    <header className="h-16 border-b border-zinc-800/80 bg-zinc-950/70 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-30">
      {/* Left: Active Project Meta */}
      <div className="flex items-center gap-3">
        {client?.avatar_url ? (
          <img
            src={client.avatar_url}
            alt={client.name}
            className="w-9 h-9 rounded-full object-cover ring-1 ring-zinc-700/80"
          />
        ) : (
          <div className="w-9 h-9 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-xs font-semibold text-zinc-300">
            {client?.company?.slice(0, 2).toUpperCase() || 'CL'}
          </div>
        )}
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-semibold text-zinc-100">{client?.company || 'Loading Client...'}</h2>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              {client?.tier || 'Automation Client'}
            </span>
          </div>
          <p className="text-xs text-zinc-400 truncate max-w-xs md:max-w-md">
            {client?.project_name || 'Workflow & Pipeline Operations'}
          </p>
        </div>
      </div>

      {/* Right: Cloudflare Edge Status & Refresh */}
      <div className="flex items-center gap-3">
        <div className="hidden sm:flex items-center gap-2 px-2.5 py-1 rounded-md bg-zinc-900/80 border border-zinc-800 text-zinc-400 text-xs font-mono">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Edge RLS: Enforced</span>
        </div>

        <button
          onClick={refreshData}
          disabled={loading}
          title="Refresh Data from Cloudflare D1"
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
  )
}
