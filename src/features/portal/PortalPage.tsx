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
import { LiveTelemetryView } from './views/LiveTelemetryView'
import { PortalAuthView } from './views/PortalAuthView'

const PortalContent: React.FC = () => {
  const { activeTab, loading, error, client } = usePortal()

  if (loading && !client) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-12 text-center min-h-[50vh]">
        <div className="w-10 h-10 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mb-4" />
        <h3 className="text-sm font-semibold text-zinc-200">Connecting to Cloudflare Edge...</h3>
        <p className="text-xs text-zinc-500 font-mono mt-1">Authenticating D1 multi-tenant session</p>
      </div>
    )
  }

  if (error && !client) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-12 text-center min-h-[50vh]">
        <div className="w-12 h-12 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20 flex items-center justify-center mb-3 text-lg font-bold">
          !
        </div>
        <h3 className="text-sm font-semibold text-zinc-200">Session Notice</h3>
        <p className="text-xs text-zinc-400 max-w-sm mt-1">{error}</p>
        <button
          onClick={() => {
            localStorage.removeItem('mp_portal_client_id')
            window.location.href = '/portal'
          }}
          className="mt-4 px-4 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-xs text-zinc-200 hover:text-white hover:border-zinc-700 transition-colors"
        >
          Return to Sign In →
        </button>
      </div>
    )
  }

  return (
    <div className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
      {activeTab === 'overview' && <OverviewDashboardView />}
      {activeTab === 'onboarding' && <OnboardingView />}
      {activeTab === 'contracts' && <ContractsView />}
      {activeTab === 'invoices' && <InvoicesView />}
      {activeTab === 'chat' && <ChatView />}
      {activeTab === 'approvals' && <ApprovalsView />}
      {activeTab === 'assets' && <AssetHubView />}
      {activeTab === 'telemetry' && <LiveTelemetryView />}
      {activeTab === 'admin' && <OverviewDashboardView />}
    </div>
  )
}

const PortalInner: React.FC = () => {
  const { clientId, client, loading, mobileNavOpen, setMobileNavOpen } = usePortal()

  // If unauthenticated or no client workspace selected, show the Sign In / Profile Access Gate!
  if (!clientId || (!client && !loading)) {
    return <PortalAuthView />
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col md:flex-row antialiased relative">
      {/* Desktop Sidebar (hidden on small screens) */}
      <div className="hidden md:flex shrink-0">
        <PortalSidebar />
      </div>

      {/* Mobile Slide-Over Navigation Drawer */}
      {mobileNavOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          {/* Backdrop Blur */}
          <div
            onClick={() => setMobileNavOpen(false)}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
          />

          {/* Drawer content */}
          <div className="relative w-72 max-w-[80vw] bg-zinc-950 h-full flex flex-col shadow-2xl z-10 border-r border-zinc-800">
            <div className="flex justify-end p-2 border-b border-zinc-800/60">
              <button
                onClick={() => setMobileNavOpen(false)}
                className="p-2 text-zinc-400 hover:text-white"
                title="Close Navigation"
              >
                ✕
              </button>
            </div>
            <div className="flex-1 overflow-y-auto">
              <PortalSidebar />
            </div>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <PortalHeader />
        <main className="flex-1 overflow-y-auto pb-12">
          <PortalContent />
        </main>
      </div>
    </div>
  )
}

export const PortalPage: React.FC = () => {
  return (
    <PortalProvider>
      <PortalInner />
    </PortalProvider>
  )
}
export default PortalPage
