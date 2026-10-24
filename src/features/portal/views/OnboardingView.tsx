import React, { useState } from 'react'
import { usePortal } from '../PortalContext'

export const OnboardingView: React.FC = () => {
  const { onboardingSteps, handleCompleteStep, setActiveTab } = usePortal()
  const [activeFormStep, setActiveFormStep] = useState<string | null>(null)
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
      <div className="space-y-4">
        {onboardingSteps.map((step) => {
          const isCompleted = step.status === 'completed'
          const isInProgress = step.status === 'in_progress'

          return (
            <div
              key={step.id}
              className={`p-5 rounded-xl border transition-all ${
                isCompleted
                  ? 'bg-zinc-900/40 border-zinc-800/60'
                  : isInProgress
                  ? 'bg-zinc-900/90 border-emerald-500/40 shadow-lg shadow-emerald-500/5'
                  : 'bg-zinc-950/40 border-zinc-900 opacity-70'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
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
                    {step.completed_at && (
                      <p className="text-[10px] text-zinc-500 font-mono mt-1">
                        Completed: {new Date(step.completed_at).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="sm:self-center shrink-0">
                  {isCompleted ? (
                    <span className="text-xs font-medium text-emerald-400 flex items-center gap-1.5">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Verified
                    </span>
                  ) : step.step_number === 3 ? (
                    <button
                      onClick={() => setActiveTab('contracts')}
                      className="px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-semibold text-xs transition-colors flex items-center gap-1.5 shadow-md shadow-emerald-500/10"
                    >
                      Sign Agreement &rarr;
                    </button>
                  ) : step.step_number === 4 ? (
                    <button
                      onClick={() => setActiveTab('invoices')}
                      className="px-4 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-zinc-950 font-semibold text-xs transition-colors flex items-center gap-1.5"
                    >
                      View Invoice &rarr;
                    </button>
                  ) : step.form_type === 'api_credentials' ? (
                    <button
                      onClick={() => setActiveFormStep(step.id)}
                      className="px-4 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-medium text-xs transition-colors border border-zinc-700"
                    >
                      Submit Credentials
                    </button>
                  ) : (
                    <button
                      onClick={() => handleCompleteStep(step.id)}
                      className="px-4 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-medium text-xs transition-colors border border-zinc-700"
                    >
                      Mark Complete
                    </button>
                  )}
                </div>
              </div>
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
