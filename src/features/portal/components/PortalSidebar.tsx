import React from 'react'
import { Link } from 'react-router'
import { usePortal, type PortalTab } from '../PortalContext'

export const PortalSidebar: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    portalRole,
    setPortalRole,
    onboardingSteps,
    contracts,
    invoices,
    approvals,
    messages,
    adminData,
  } = usePortal()

  const pendingOnboarding = onboardingSteps.filter((s) => s.status !== 'completed').length
  const pendingContracts = contracts.filter((c) => c.status === 'awaiting_signature').length
  const unpaidInvoices = invoices.filter((i) => i.status !== 'paid').length
  const pendingApprovals = approvals.filter((a) => a.status === 'pending').length

  const clientNavItems: {
    id: PortalTab
    label: string
    badge?: string
    badgeColor?: string
    icon: React.ReactNode
  }[] = [
    {
      id: 'overview',
      label: 'Overview',
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      ),
    },
    {
      id: 'onboarding',
      label: 'Onboarding Checklist',
      badge: pendingOnboarding > 0 ? `${pendingOnboarding}` : undefined,
      badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
        </svg>
      ),
    },
    {
      id: 'contracts',
      label: 'Contracts & E-Sign',
      badge: pendingContracts > 0 ? `${pendingContracts} Due` : undefined,
      badgeColor: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
        </svg>
      ),
    },
    {
      id: 'invoices',
      label: 'Invoices & Billing',
      badge: unpaidInvoices > 0 ? `${unpaidInvoices}` : undefined,
      badgeColor: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      id: 'chat',
      label: 'Direct Messaging',
      badge: messages.length > 0 ? `${messages.length}` : undefined,
      badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      ),
    },
    {
      id: 'approvals',
      label: 'Deliverable Approvals',
      badge: pendingApprovals > 0 ? `${pendingApprovals} Pending` : undefined,
      badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      id: 'telemetry',
      label: 'Live Workflows',
      badge: '99.9%',
      badgeColor: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
    },
    {
      id: 'assets',
      label: 'Asset Hub (R2)',
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
        </svg>
      ),
    },
  ]

  const adminNavItems: {
    id: PortalTab
    label: string
    badge?: string
    badgeColor?: string
    icon: React.ReactNode
  }[] = [
    {
      id: 'admin',
      label: 'Admin Command Deck',
      badge: `${adminData?.metrics.activeClients || 2} Clients`,
      badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
    },
    {
      id: 'telemetry',
      label: 'Live Webhook Sandbox',
      badge: 'Edge HKG',
      badgeColor: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
    },
    {
      id: 'overview',
      label: 'Active Client Workspace',
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
      ),
    },
  ]

  const activeList = portalRole === 'admin' ? adminNavItems : clientNavItems

  return (
    <aside className="w-full md:w-64 bg-zinc-950/95 border-r border-zinc-800/80 flex flex-col shrink-0 min-h-full">
      {/* Brand Header */}
      <div className="p-4 border-b border-zinc-800/60">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 font-bold text-sm tracking-tight shadow-[0_0_15px_rgba(16,185,129,0.2)]">
            MP
          </div>
          <div>
            <div className="text-xs font-semibold text-zinc-200 tracking-wide">
              {portalRole === 'admin' ? 'AGENCY ADMIN' : 'CLIENT PORTAL'}
            </div>
            <div className="text-[10px] text-zinc-500 uppercase tracking-wider font-mono">
              {portalRole === 'admin' ? 'Operations Console' : 'Edge Automation OS'}
            </div>
          </div>
        </div>

        {/* Role Switcher Pill */}
        <div className="mt-3 grid grid-cols-2 p-0.5 rounded-lg bg-zinc-900 border border-zinc-800 text-[11px] font-medium">
          <button
            onClick={() => setPortalRole('client')}
            className={`py-1 rounded-md transition-all ${
              portalRole === 'client'
                ? 'bg-zinc-800 text-emerald-400 font-semibold shadow-sm'
                : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            Client View
          </button>
          <button
            onClick={() => setPortalRole('admin')}
            className={`py-1 rounded-md transition-all ${
              portalRole === 'admin'
                ? 'bg-zinc-800 text-emerald-400 font-semibold shadow-sm'
                : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            Admin Deck
          </button>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 p-3 space-y-1">
        {activeList.map((item) => {
          const isActive = activeTab === item.id
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-xs font-medium transition-all ${
                isActive
                  ? 'bg-zinc-800/90 text-white shadow-sm border border-zinc-700/60'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/60'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className={isActive ? 'text-emerald-400' : 'text-zinc-500'}>{item.icon}</span>
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${item.badgeColor || 'bg-zinc-800 text-zinc-300 border-zinc-700'}`}>
                  {item.badge}
                </span>
              )}
            </button>
          )
        })}
      </nav>

      {/* Footer Info & Main Site Link */}
      <div className="p-4 border-t border-zinc-800/60 bg-zinc-950/60">
        <Link
          to="/"
          className="flex items-center justify-center gap-2 w-full py-2 px-3 rounded-lg bg-zinc-900 border border-zinc-800 text-xs text-zinc-400 hover:text-white hover:border-zinc-700 transition-colors"
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Portfolio
        </Link>
        <div className="mt-3 flex items-center justify-between text-[10px] text-zinc-500 font-mono">
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Cloudflare Edge (D1+R2)
          </span>
          <span>v2.5</span>
        </div>
      </div>
    </aside>
  )
}
