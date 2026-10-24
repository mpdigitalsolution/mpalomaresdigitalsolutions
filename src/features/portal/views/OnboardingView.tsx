import React, { useState } from 'react'
import { usePortal } from '../PortalContext'

export const OnboardingView: React.FC = () => {
  const { onboardingSteps, handleCompleteStep, setActiveTab } = usePortal()
  const [activeFormStep, setActiveFormStep] = useState<string | null>(null)
  const [expandedStepId, setExpandedStepId] = useState<string | null>(() => {
    const firstIncomplete = onboardingSteps.find((s) => s.status !== 'completed')
    return firstIncomplete?.id || null
  })

  const [apiCredentials, setApiCredentials] = useState({
    crmType: 'GoHighLevel',
    apiKey: '',
    webhookUrl: '',
    notes: '',
  })
  const [submitting, setSubmitting] = useState(false)

  const handleCredentialsSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!activeFormStep) return
    setSubmitting(true)
    try {
      await handleCompleteStep(activeFormStep, apiCredentials)
      setActiveFormStep(null)
    } finally {
      setSubmitting(false)
    }
  }

  const toggleAccordion = (id: string) => {
    setExpandedStepId((prev) => (prev === id ? null : id))
  }

  const getSubTasksForStep = (stepNumber: number) => {
    switch (stepNumber) {
      case 1:
        return [
          'Review automation architecture blueprint and edge routing logic',
          'Confirm SLA response thresholds (24-hour critical response)',
          'Establish dedicated Telegram / Slack agency communication bridge',
        ]
      case 2:
        return [
          'Provide GoHighLevel CRM location API key or HubSpot private app token',
          'Configure inbound patient webhook endpoints',
          'Validate token encryption at rest on Cloudflare D1',
        ]
      case 3:
        return [
          'Review Master Services Agreement scope of work',
          'Review Data Protection & HIPAA BAA security annexes',
          'Execute digital signature with cryptographic audit seal',
        ]
      case 4:
        return [
          'Review Phase 1 architecture retainer invoice',
          'Submit settlement via Stripe (Credit Card / Apple Pay) or Wire transfer',
          'Receive automated tax receipt and sprint capacity allocation',
        ]
      case 5:
        return [
          'Schedule 45-minute live technical walkthrough with Marlon',
          'Conduct end-to-end sandbox form submission test',
          'Deploy production webhooks to live CRM pipeline',
        ]
      default:
        return ['Standard milestone verification and acceptance checklist']
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-zinc-100">Client Onboarding Workflow</h2>
        <p className="text-xs text-zinc-400 mt-1">
          Complete each phase below to streamline project kickoff, configure API integrations, and initiate automated operations.
        </p>
      </div>

      {/* Steps List */}
      <div className="space-y-3">
        {onboardingSteps.map((step) => {
          const isCompleted = step.status === 'completed'
          const isInProgress = step.status === 'in_progress'
          const isExpanded = expandedStepId === step.id
          const subTasks = getSubTasksForStep(step.step_number)

          return (
            <div
              key={step.id}
              className={`rounded-2xl border transition-all overflow-hidden ${
                isCompleted
                  ? 'bg-zinc-900/30 border-zinc-800/60'
                  : isInProgress
                  ? 'bg-zinc-900/90 border-emerald-500/40 shadow-lg shadow-emerald-500/5'
                  : 'bg-zinc-950/40 border-zinc-900 opacity-80'
              }`}
            >
              {/* Accordion Summary Row */}
              <div
                onClick={() => toggleAccordion(step.id)}
                className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer select-none hover:bg-zinc-900/40 transition-colors"
              >
                <div className="flex items-start gap-4">
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 font-mono text-xs font-bold ${
                      isCompleted
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : isInProgress
                        ? 'bg-emerald-500 text-zinc-950 shadow-md shadow-emerald-500/30'
                        : 'bg-zinc-800 text-zinc-400 border border-zinc-700'
                    }`}
                  >
                    {isCompleted ? '✓' : step.step_number}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-semibold text-zinc-100">{step.title}</h4>
                      <span
                        className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${
                          isCompleted
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                            : isInProgress
                            ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                            : 'bg-zinc-800/80 text-zinc-400 border-zinc-700'
                        }`}
                      >
                        {isCompleted ? 'Completed' : isInProgress ? 'Action Required' : 'Pending'}
                      </span>
                    </div>
                    <p className="text-xs text-zinc-400 mt-1 max-w-2xl leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 self-end sm:self-center">
                  <span className="text-[11px] font-medium text-zinc-500 hover:text-zinc-300">
                    {isExpanded ? 'Collapse' : 'Details'}
                  </span>
                  <svg
                    className={`w-4 h-4 text-zinc-400 transform transition-transform ${
                      isExpanded ? 'rotate-180 text-emerald-400' : ''
                    }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>

              {/* Accordion Expandable Content */}
              {isExpanded && (
                <div className="px-6 pb-6 pt-2 border-t border-zinc-800/50 bg-zinc-950/40 space-y-4">
                  <div>
                    <div className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider font-mono mb-2">
                      Milestone Scope & Requirements
                    </div>
                    <ul className="space-y-1.5 text-xs text-zinc-300">
                      {subTasks.map((task, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className={`mt-0.5 text-xs ${isCompleted ? 'text-emerald-400' : 'text-zinc-500'}`}>
                            {isCompleted ? '✓' : '•'}
                          </span>
                          <span>{task}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {step.completed_at && (
                    <div className="text-[11px] text-zinc-500 font-mono">
                      Completed: {new Date(step.completed_at).toLocaleString()}
                    </div>
                  )}

                  {/* Actions Bar */}
                  <div className="pt-3 border-t border-zinc-800/50 flex flex-wrap items-center justify-between gap-3">
                    <div className="text-[11px] text-zinc-400 font-mono">
                      Status: <span className={isCompleted ? 'text-emerald-400' : 'text-amber-400'}>{step.status.toUpperCase()}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      {isCompleted ? (
                        <button
                          type="button"
                          onClick={() => handleCompleteStep(step.id)}
                          className="px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-zinc-200 text-xs transition-colors"
                        >
                          Reopen Step
                        </button>
                      ) : step.step_number === 3 ? (
                        <button
                          type="button"
                          onClick={() => setActiveTab('contracts')}
                          className="px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-xs transition-colors flex items-center gap-1.5 shadow-md shadow-emerald-500/20"
                        >
                          Open & Sign Agreement &rarr;
                        </button>
                      ) : step.step_number === 4 ? (
                        <button
                          type="button"
                          onClick={() => setActiveTab('invoices')}
                          className="px-4 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-zinc-950 font-bold text-xs transition-colors flex items-center gap-1.5"
                        >
                          View & Settle Invoice &rarr;
                        </button>
                      ) : step.form_type === 'api_credentials' ? (
                        <button
                          type="button"
                          onClick={() => setActiveFormStep(step.id)}
                          className="px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-xs transition-colors shadow-md shadow-emerald-500/20"
                        >
                          Submit API Credentials
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleCompleteStep(step.id)}
                          className="px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-xs transition-colors shadow-md shadow-emerald-500/20"
                        >
                          Mark Milestone Complete
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Secure API Credentials Modal */}
      {activeFormStep && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-2xl relative">
            <h3 className="text-base font-bold text-zinc-100">Provide Secure API Credentials</h3>
            <p className="text-xs text-zinc-400 mt-1">
              Encrypted at rest with Cloudflare D1. Used strictly for your dedicated n8n automation and CRM workflows.
            </p>

            <form onSubmit={handleCredentialsSubmit} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1">CRM / Tool Platform</label>
                <select
                  value={apiCredentials.crmType}
                  onChange={(e) => setApiCredentials({ ...apiCredentials, crmType: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-xs text-zinc-200 focus:outline-none focus:border-emerald-500"
                >
                  <option value="GoHighLevel">GoHighLevel (GHL Location Key)</option>
                  <option value="HubSpot">HubSpot Private App Token</option>
                  <option value="Salesforce">Salesforce OAuth / Webhook</option>
                  <option value="Custom Webhook">Custom REST Webhook</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1">API Key / Bearer Token</label>
                <input
                  type="password"
                  required
                  placeholder="ghl_live_sec_..."
                  value={apiCredentials.apiKey}
                  onChange={(e) => setApiCredentials({ ...apiCredentials, apiKey: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-xs text-zinc-200 font-mono focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1">Optional Webhook URL</label>
                <input
                  type="url"
                  placeholder="https://yourdomain.com/webhook/..."
                  value={apiCredentials.webhookUrl}
                  onChange={(e) => setApiCredentials({ ...apiCredentials, webhookUrl: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-xs text-zinc-200 font-mono focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1">Special Security Notes</label>
                <textarea
                  rows={2}
                  placeholder="Any IP whitelisting or test contact constraints..."
                  value={apiCredentials.notes}
                  onChange={(e) => setApiCredentials({ ...apiCredentials, notes: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-xs text-zinc-200 focus:outline-none focus:border-emerald-500 resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setActiveFormStep(null)}
                  className="px-4 py-2 rounded-lg text-xs text-zinc-400 hover:text-zinc-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-semibold text-xs transition-colors disabled:opacity-50"
                >
                  {submitting ? 'Saving...' : 'Submit & Complete Step'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
