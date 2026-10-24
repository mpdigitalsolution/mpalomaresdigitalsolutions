import React, { useState } from 'react'
import { usePortal } from '../PortalContext'
import type { ApprovalRecord } from '../types'

export const ApprovalsView: React.FC = () => {
  const { approvals, handleApprovalDecision } = usePortal()
  const [revisionItem, setRevisionItem] = useState<ApprovalRecord | null>(null)
  const [revisionNotes, setRevisionNotes] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleApprove = async (id: string) => {
    await handleApprovalDecision(id, 'approved')
  }

  const handleSubmitRevisions = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!revisionItem) return
    setSubmitting(true)
    try {
      await handleApprovalDecision(revisionItem.id, 'revisions_requested', revisionNotes)
      setRevisionItem(null)
      setRevisionNotes('')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h2 className="text-xl font-bold text-zinc-100">Deliverable Approvals & QA</h2>
        <p className="text-xs text-zinc-400 mt-1">
          Review architecture deliverables, workflow test runs, and CRM configurations before production deployment.
        </p>
      </div>

      {/* Deliverables List */}
      <div className="space-y-4">
        {approvals.map((app) => {
          const isPending = app.status === 'pending'
          const isApproved = app.status === 'approved'
          const isRevisions = app.status === 'revisions_requested'

          return (
            <div
              key={app.id}
              className={`p-6 rounded-2xl border transition-all ${
                isPending
                  ? 'bg-zinc-900/80 border-purple-500/40 shadow-lg shadow-purple-500/5'
                  : 'bg-zinc-950/60 border-zinc-800/80'
              }`}
            >
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-2.5">
                    <h3 className="text-base font-bold text-zinc-100">{app.deliverable_name}</h3>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-300 border border-zinc-700">
                      {app.version}
                    </span>
                    <span
                      className={`text-[10px] font-mono px-2.5 py-0.5 rounded-full border ${
                        isApproved
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                          : isRevisions
                          ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                          : 'bg-purple-500/10 text-purple-400 border-purple-500/20'
                      }`}
                    >
                      {isApproved ? '✓ Approved' : isRevisions ? '⚠️ Revisions Requested' : 'Review Required'}
                    </span>
                  </div>

                  <p className="text-xs text-zinc-300 leading-relaxed max-w-3xl">
                    {app.description}
                  </p>

                  {app.client_notes && (
                    <div className="p-3 rounded-lg bg-zinc-900 border border-zinc-800 text-xs text-amber-300/90 font-mono">
                      Feedback note: "{app.client_notes}"
                    </div>
                  )}

                  {app.decided_at && (
                    <div className="text-[10px] text-zinc-500 font-mono">
                      Decided on: {new Date(app.decided_at).toLocaleString()}
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex flex-row md:flex-col items-center md:items-end gap-2.5 shrink-0">
                  {app.preview_url && (
                    <a
                      href={app.preview_url}
                      target="_blank"
                      rel="noreferrer"
                      className="px-3.5 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-800 text-xs transition-colors flex items-center gap-1.5"
                    >
                      <span>Preview Flow</span>
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                  )}

                  {isPending && (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setRevisionItem(app)}
                        className="px-3.5 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-amber-400 border border-amber-500/30 text-xs font-medium transition-colors"
                      >
                        Request Changes
                      </button>
                      <button
                        onClick={() => handleApprove(app.id)}
                        className="px-4 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-xs transition-colors shadow-sm"
                      >
                        Approve & Ship
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Revision Modal */}
      {revisionItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-2xl relative">
            <h3 className="text-base font-bold text-zinc-100">Request Revisions</h3>
            <p className="text-xs text-zinc-400 mt-1">
              Specify what adjustments or tweaks you would like Marlon to make on{' '}
              <strong className="text-zinc-200">{revisionItem.deliverable_name}</strong>.
            </p>

            <form onSubmit={handleSubmitRevisions} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1">Revision Notes & Details</label>
                <textarea
                  rows={4}
                  required
                  placeholder="e.g. Please update the SMS follow-up delay from 15 minutes to 30 minutes, and add the patient insurance ID field..."
                  value={revisionNotes}
                  onChange={(e) => setRevisionNotes(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-xs text-zinc-200 focus:outline-none focus:border-amber-500 resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setRevisionItem(null)}
                  className="px-4 py-2 rounded-lg text-xs text-zinc-400 hover:text-zinc-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting || !revisionNotes.trim()}
                  className="px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-zinc-950 font-semibold text-xs transition-colors disabled:opacity-50"
                >
                  {submitting ? 'Submitting...' : 'Submit Revisions'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
