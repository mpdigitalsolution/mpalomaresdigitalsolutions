import React from 'react'
import { usePortal } from '../PortalContext'

export const OverviewDashboardView: React.FC = () => {
  const {
    client,
    onboardingSteps,
    contracts,
    invoices,
    approvals,
    messages,
    setActiveTab,
  } = usePortal()

  const completedSteps = onboardingSteps.filter((s) => s.status === 'completed').length
  const totalSteps = onboardingSteps.length || 5
  const progressPercent = Math.round((completedSteps / totalSteps) * 100)

  const pendingContract = contracts.find((c) => c.status === 'awaiting_signature')
  const unpaidInvoice = invoices.find((i) => i.status !== 'paid')
  const pendingApproval = approvals.find((a) => a.status === 'pending')

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-br from-zinc-900 via-zinc-900/90 to-zinc-950 border border-zinc-800 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-mono uppercase tracking-widest text-emerald-400">Client Operations Console</span>
              <span className="text-zinc-600">•</span>
              <span className="text-xs text-zinc-400 font-mono">D1 Instance: APAC-01</span>
            </div>
            <h1 className="text-2xl font-bold text-zinc-100">
              Welcome back, {client?.name ? client.name.split(' ')[0] : 'Partner'} 👋
            </h1>
            <p className="mt-1 text-sm text-zinc-400 max-w-xl">
              Track your onboarding progress, sign sprint agreements, review automated deliverables, and chat directly with Marlon's engineering desk.
            </p>
          </div>

          {/* Onboarding Progress Card */}
          <div className="flex items-center gap-4 bg-zinc-950/80 p-4 rounded-xl border border-zinc-800 shrink-0">
            <div className="relative w-14 h-14 flex items-center justify-center">
              <svg className="w-14 h-14 transform -rotate-90">
                <circle
                  cx="28"
                  cy="28"
                  r="24"
                  stroke="currentColor"
                  strokeWidth="5"
                  className="text-zinc-800"
                  fill="transparent"
                />
                <circle
                  cx="28"
                  cy="28"
                  r="24"
                  stroke="currentColor"
                  strokeWidth="5"
                  className="text-emerald-500 transition-all duration-1000 ease-out"
                  strokeDasharray={150.8}
                  strokeDashoffset={150.8 - (150.8 * progressPercent) / 100}
                  strokeLinecap="round"
                  fill="transparent"
                />
              </svg>
              <span className="absolute text-xs font-bold font-mono text-zinc-200">
                {progressPercent}%
              </span>
            </div>
            <div>
              <div className="text-xs font-semibold text-zinc-200">Onboarding Progress</div>
              <div className="text-xs text-zinc-400 mt-0.5">
                {completedSteps} of {totalSteps} milestones complete
              </div>
              <button
                onClick={() => setActiveTab('onboarding')}
                className="mt-1 text-xs text-emerald-400 hover:text-emerald-300 font-medium flex items-center gap-1"
              >
                Continue Setup &rarr;
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Action Needed Urgent Callout (if any) */}
      {(pendingContract || unpaidInvoice || pendingApproval) && (
        <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0 mt-0.5">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-amber-200">Action Required on Your Account</h4>
              <p className="text-xs text-amber-300/80 mt-0.5">
                {pendingContract
                  ? `Your Master Services Agreement "${pendingContract.title}" is awaiting digital signature.`
                  : pendingApproval
                  ? `Deliverable "${pendingApproval.deliverable_name}" is awaiting your sprint sign-off.`
                  : `Invoice #${unpaidInvoice?.invoice_number} is ready for kickoff settlement.`}
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              if (pendingContract) setActiveTab('contracts')
              else if (pendingApproval) setActiveTab('approvals')
              else setActiveTab('invoices')
            }}
            className="px-4 py-2 rounded-lg bg-amber-500 text-zinc-950 font-semibold text-xs hover:bg-amber-400 transition-colors whitespace-nowrap self-start sm:self-center shadow-sm"
          >
            Review & Resolve
          </button>
        </div>
      )}

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div
          onClick={() => setActiveTab('contracts')}
          className="p-5 rounded-xl bg-zinc-900/60 border border-zinc-800/80 hover:border-zinc-700 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-xs font-medium">Contracts</span>
            <span className="w-2 h-2 rounded-full bg-rose-400" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-zinc-100">
              {contracts.filter((c) => c.status === 'signed').length} / {contracts.length}
            </span>
            <span className="text-xs text-zinc-500">Signed</span>
          </div>
          <p className="mt-2 text-xs text-zinc-400 group-hover:text-emerald-400 transition-colors">
            {pendingContract ? '⚠️ 1 Signature pending' : '✓ All agreements current'}
          </p>
        </div>

        <div
          onClick={() => setActiveTab('invoices')}
          className="p-5 rounded-xl bg-zinc-900/60 border border-zinc-800/80 hover:border-zinc-700 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-xs font-medium">Billing & Invoices</span>
            <span className="w-2 h-2 rounded-full bg-cyan-400" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-zinc-100">
              ${(invoices.filter((i) => i.status === 'paid').reduce((acc, i) => acc + i.amount_cents, 0) / 100).toLocaleString()}
            </span>
            <span className="text-xs text-zinc-500">Paid to date</span>
          </div>
          <p className="mt-2 text-xs text-zinc-400 group-hover:text-cyan-400 transition-colors">
            {unpaidInvoice ? `Invoice ${unpaidInvoice.invoice_number} due` : '✓ Account in good standing'}
          </p>
        </div>

        <div
          onClick={() => setActiveTab('approvals')}
          className="p-5 rounded-xl bg-zinc-900/60 border border-zinc-800/80 hover:border-zinc-700 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-xs font-medium">Deliverables</span>
            <span className="w-2 h-2 rounded-full bg-purple-400" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-zinc-100">
              {approvals.filter((a) => a.status === 'approved').length} / {approvals.length}
            </span>
            <span className="text-xs text-zinc-500">Approved</span>
          </div>
          <p className="mt-2 text-xs text-zinc-400 group-hover:text-purple-400 transition-colors">
            {pendingApproval ? '1 deliverable ready for review' : 'All milestones validated'}
          </p>
        </div>

        <div
          onClick={() => setActiveTab('chat')}
          className="p-5 rounded-xl bg-zinc-900/60 border border-zinc-800/80 hover:border-zinc-700 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-xs font-medium">Engineering Thread</span>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-zinc-100">
              {messages.length}
            </span>
            <span className="text-xs text-zinc-500">Messages</span>
          </div>
          <p className="mt-2 text-xs text-zinc-400 group-hover:text-emerald-400 transition-colors">
            Direct link to Marlon's desk &rarr;
          </p>
        </div>
      </div>

      {/* Recent Updates & Fast Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Activity Stream */}
        <div className="lg:col-span-2 p-6 rounded-xl bg-zinc-900/50 border border-zinc-800/80">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-zinc-200">Recent Sprint Updates & Audit Feed</h3>
            <span className="text-xs font-mono text-zinc-500">Live Sync</span>
          </div>

          <div className="space-y-4">
            {messages.slice(-4).reverse().map((msg) => (
              <div key={msg.id} className="flex items-start gap-3 text-xs">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 font-bold ${
                  msg.sender === 'system'
                    ? 'bg-zinc-800 text-zinc-400 border border-zinc-700'
                    : msg.sender === 'agency'
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                    : 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40'
                }`}>
                  {msg.sender === 'system' ? '⚙️' : msg.sender === 'agency' ? 'MP' : 'CL'}
                </div>
                <div className="flex-1 bg-zinc-950/60 p-3 rounded-lg border border-zinc-800/60">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-zinc-300">{msg.sender_name}</span>
                    <span className="text-[10px] text-zinc-500 font-mono">
                      {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className="mt-1 text-zinc-400 text-xs leading-relaxed">{msg.message_text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Operations Panel */}
        <div className="p-6 rounded-xl bg-zinc-900/50 border border-zinc-800/80 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-semibold text-zinc-200 mb-2">Agency Tech Stack</h3>
            <p className="text-xs text-zinc-400 mb-4 leading-relaxed">
              Your dedicated systems are running on modern serverless edge infrastructure with enterprise zero-trust isolation:
            </p>

            <ul className="space-y-2.5 text-xs">
              <li className="flex items-center justify-between p-2 rounded bg-zinc-950/60 border border-zinc-800/50">
                <span className="text-zinc-300 font-medium">Cloudflare D1</span>
                <span className="text-[10px] font-mono text-emerald-400">SQLite @ Edge</span>
              </li>
              <li className="flex items-center justify-between p-2 rounded bg-zinc-950/60 border border-zinc-800/50">
                <span className="text-zinc-300 font-medium">Cloudflare R2</span>
                <span className="text-[10px] font-mono text-cyan-400">Encrypted Assets</span>
              </li>
              <li className="flex items-center justify-between p-2 rounded bg-zinc-950/60 border border-zinc-800/50">
                <span className="text-zinc-300 font-medium">n8n Automation Engine</span>
                <span className="text-[10px] font-mono text-amber-400">99.9% Uptime</span>
              </li>
              <li className="flex items-center justify-between p-2 rounded bg-zinc-950/60 border border-zinc-800/50">
                <span className="text-zinc-300 font-medium">GoHighLevel CRM</span>
                <span className="text-[10px] font-mono text-purple-400">Live Sync</span>
              </li>
            </ul>
          </div>

          <div className="mt-6 pt-4 border-t border-zinc-800/60">
            <button
              onClick={() => setActiveTab('chat')}
              className="w-full py-2.5 px-4 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-semibold text-xs transition-colors flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
              Message Marlon Directly
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
