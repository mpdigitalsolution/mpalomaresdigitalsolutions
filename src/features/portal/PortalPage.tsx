import React from 'react'
import { PortalProvider, usePortal } from './PortalContext'
import { PortalSidebar } from './components/PortalSidebar'
import { PortalHeader } from './components/PortalHeader'
import { OverviewDashboardView } from './views/OverviewDashboardView'
import { OnboardingView } from './views/OnboardingView'
import { ContractsView } from './views/ContractsView'
import { InvoicesView } from './views/InvoicesView'
import { ChatView } from './views/ChatView'
import { ApprovalsView } from './views/ApprovalsView'
import { AssetHubView } from './views/AssetHubView'

const PortalContent: React.FC = () => {
  const { activeTab, loading, error } = usePortal()

  if (loading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-12 text-center">
        <div className="w-10 h-10 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mb-4" />
        <h3 className="text-sm font-semibold text-zinc-200">Connecting to Cloudflare Edge...</h3>
        <p className="text-xs text-zinc-500 font-mono mt-1">Authenticating D1 multi-tenant session</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-12 text-center">
        <div className="w-12 h-12 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20 flex items-center justify-center mb-3 text-lg font-bold">
          !
        </div>
        <h3 className="text-sm font-semibold text-zinc-200">Edge Sync Notice</h3>
        <p className="text-xs text-zinc-400 max-w-sm mt-1">{error}</p>
      </div>
    )
  }

  return (
    <div className="flex-1 p-6 lg:p-8 max-w-7xl mx-auto w-full">
      {activeTab === 'overview' && <OverviewDashboardView />}
      {activeTab === 'onboarding' && <OnboardingView />}
      {activeTab === 'contracts' && <ContractsView />}
      {activeTab === 'invoices' && <InvoicesView />}
      {activeTab === 'chat' && <ChatView />}
      {activeTab === 'approvals' && <ApprovalsView />}
      {activeTab === 'assets' && <AssetHubView />}
    </div>
  )
}

export const PortalPage: React.FC = () => {
  return (
    <PortalProvider>
      <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col md:flex-row antialiased">
        <PortalSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <PortalHeader />
          <main className="flex-1 overflow-y-auto">
            <PortalContent />
          </main>
        </div>
      </div>
    </PortalProvider>
  )
}
export default PortalPage
