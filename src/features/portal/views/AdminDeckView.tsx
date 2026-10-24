import React, { useState } from 'react'
import { usePortal } from '../PortalContext'

export const AdminDeckView: React.FC = () => {
  const {
    adminData,
    availableClients,
    handleCreateInvoice,
    handleCreateDeliverable,
    handleCreateClient,
    setClientId,
    setActiveTab,
  } = usePortal()

  // Modal states
  const [invoiceModal, setInvoiceModal] = useState(false)
  const [deliverableModal, setDeliverableModal] = useState(false)
  const [clientModal, setClientModal] = useState(false)
  const [inviteModal, setInviteModal] = useState(false)
  const [copiedLink, setCopiedLink] = useState(false)
  const [copiedEmail, setCopiedEmail] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  // Active Invite Modal Data
  const [activeInvite, setActiveInvite] = useState<{
    name: string
    company: string
    email: string
    passkey: string
    clientId: string
  }>({
    name: '',
    company: '',
    email: '',
    passkey: '',
    clientId: '',
  })

  // Invoice Form
  const [invForm, setInvForm] = useState({
    clientId: availableClients[0]?.id || '',
    invoiceNumber: `INV-2026-${Math.floor(100 + Math.random() * 900)}`,
    description: '',
    amountDollars: '1500',
    dueDate: new Date(Date.now() + 14 * 86400000).toISOString().slice(0, 10),
    stripePaymentUrl: '',
  })

  // Deliverable Form
  const [delivForm, setDelivForm] = useState({
    clientId: availableClients[0]?.id || '',
    deliverableName: '',
    deliverableType: 'n8n_workflow',
    version: 'v1.0',
    description: '',
    previewUrl: 'https://mpalomaresdigitalsolutions.vercel.app/#work',
  })

  // Client Form
  const [cliForm, setCliForm] = useState({
    name: '',
    company: '',
    email: '',
    passkey: '',
    projectName: '',
    tier: 'Enterprise Automation Retainer',
  })

  const onIssueInvoice = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      await handleCreateInvoice({
        clientId: invForm.clientId,
        invoiceNumber: invForm.invoiceNumber,
        description: invForm.description,
        amountCents: Math.round(parseFloat(invForm.amountDollars) * 100),
        dueDate: invForm.dueDate,
        stripePaymentUrl: invForm.stripePaymentUrl || undefined,
      })
      setInvoiceModal(false)
    } finally {
      setSubmitting(false)
    }
  }

  const onPublishDeliverable = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      await handleCreateDeliverable({
        clientId: delivForm.clientId,
        deliverableName: delivForm.deliverableName,
        deliverableType: delivForm.deliverableType,
        version: delivForm.version,
        description: delivForm.description,
        previewUrl: delivForm.previewUrl || undefined,
      })
      setDeliverableModal(false)
    } finally {
      setSubmitting(false)
    }
  }

  const onAddClient = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      await handleCreateClient(cliForm)
      setClientModal(false)
      // Open Invite & Email Template modal
      setActiveInvite({
        name: cliForm.name,
        company: cliForm.company,
        email: cliForm.email,
        passkey: cliForm.passkey,
        clientId: `client_${cliForm.company.toLowerCase().replace(/[^a-z0-9]/g, '')}`,
      })
      setInviteModal(true)
      // Reset form
      setCliForm({
        name: '',
        company: '',
        email: '',
        passkey: '',
        projectName: '',
        tier: 'Enterprise Automation Retainer',
      })
    } finally {
      setSubmitting(false)
    }
  }

  const metrics = adminData?.metrics || {
    activeClients: availableClients.length || 0,
    estimatedMRRCents: 0,
    totalCollectedCents: 0,
    totalOutstandingCents: 0,
    pendingContracts: 0,
    pendingApprovals: 0,
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-emerald-950/40 via-zinc-900 to-zinc-950 border border-emerald-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              AGENCY OWNER DECK
            </span>
            <span className="text-xs text-zinc-500 font-mono">Cloudflare D1 Global Instance</span>
          </div>
          <h1 className="text-xl font-bold text-zinc-100">Marlon's Agency Command Console</h1>
          <p className="text-xs text-zinc-400 mt-1 max-w-xl">
            Centralized control deck to manage client workspaces, dispatch retainer invoices, publish automated deliverables, and monitor cross-tenant revenue.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setInvoiceModal(true)}
            className="px-3.5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-zinc-950 font-bold text-xs transition-colors flex items-center gap-1.5 shadow-md shadow-cyan-500/20"
          >
            <span>+ Issue Invoice</span>
          </button>
          <button
            onClick={() => setDeliverableModal(true)}
            className="px-3.5 py-2 rounded-xl bg-purple-500 hover:bg-purple-400 text-zinc-950 font-bold text-xs transition-colors flex items-center gap-1.5 shadow-md shadow-purple-500/20"
          >
            <span>+ Publish Deliverable</span>
          </button>
          <button
            onClick={() => setClientModal(true)}
            className="px-3.5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-xs transition-colors flex items-center gap-1.5 shadow-md shadow-emerald-500/20"
          >
            <span>+ Onboard Client</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-xl bg-zinc-900/60 border border-zinc-800">
          <div className="text-xs font-medium text-zinc-400">Total Pipeline MRR</div>
          <div className="mt-2 text-2xl font-bold font-mono text-emerald-400">
            ${(metrics.estimatedMRRCents / 100).toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </div>
          <div className="mt-1 text-[10px] text-zinc-500 font-mono">Retainer Contracts Active</div>
        </div>

        <div className="p-5 rounded-xl bg-zinc-900/60 border border-zinc-800">
          <div className="text-xs font-medium text-zinc-400">Active Workspaces</div>
          <div className="mt-2 text-2xl font-bold font-mono text-zinc-100">{metrics.activeClients}</div>
          <div className="mt-1 text-[10px] text-zinc-500 font-mono">Multi-Tenant D1 Isolation</div>
        </div>

        <div className="p-5 rounded-xl bg-zinc-900/60 border border-zinc-800">
          <div className="text-xs font-medium text-zinc-400">Collected Revenue</div>
          <div className="mt-2 text-2xl font-bold font-mono text-cyan-400">
            ${(metrics.totalCollectedCents / 100).toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </div>
          <div className="mt-1 text-[10px] text-zinc-500 font-mono">
            Outstanding: ${(metrics.totalOutstandingCents / 100).toLocaleString('en-US')}
          </div>
        </div>

        <div className="p-5 rounded-xl bg-zinc-900/60 border border-zinc-800">
          <div className="text-xs font-medium text-zinc-400">Action Queue</div>
          <div className="mt-2 text-2xl font-bold font-mono text-amber-400">
            {metrics.pendingContracts + metrics.pendingApprovals}
          </div>
          <div className="mt-1 text-[10px] text-zinc-500 font-mono">
            {metrics.pendingContracts} Signatures • {metrics.pendingApprovals} Approvals
          </div>
        </div>
      </div>

      {/* Client Accounts Table */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-950/60 overflow-hidden">
        <div className="px-5 py-4 bg-zinc-900/80 border-b border-zinc-800 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-zinc-200">Client Workspaces on Cloudflare D1</h3>
          <span className="text-xs font-mono text-zinc-500">{adminData?.clients.length || availableClients.length} Accounts</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-zinc-900/50 text-zinc-400 border-b border-zinc-800 font-mono text-[10px] uppercase">
              <tr>
                <th className="px-5 py-3.5">Company & Lead</th>
                <th className="px-5 py-3.5">Project Scope</th>
                <th className="px-5 py-3.5">Retainer Tier</th>
                <th className="px-5 py-3.5">Passkey</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60">
              {(adminData?.clients || availableClients).length > 0 ? (
                (adminData?.clients || availableClients).map((c) => (
                  <tr key={c.id} className="hover:bg-zinc-900/40 transition-colors">
                    <td className="px-5 py-4">
                      <div className="font-semibold text-zinc-200">{c.company}</div>
                      <div className="text-[11px] text-zinc-400">{c.name} • {c.email}</div>
                    </td>
                    <td className="px-5 py-4 text-zinc-300 max-w-xs truncate">{c.project_name}</td>
                    <td className="px-5 py-4">
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        {c.tier}
                      </span>
                    </td>
                    <td className="px-5 py-4 font-mono text-zinc-400">{c.passkey}</td>
                    <td className="px-5 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => {
                            setActiveInvite({
                              name: c.name,
                              company: c.company,
                              email: c.email,
                              passkey: c.passkey || 'solis2026',
                              clientId: c.id,
                            })
                            setInviteModal(true)
                          }}
                          className="px-2.5 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 hover:bg-emerald-500/20 text-emerald-400 text-xs font-medium transition-colors flex items-center gap-1.5"
                          title="Generate 1-Click Client Onboarding Link & Email Template"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                          </svg>
                          <span>Invite Link</span>
                        </button>

                        <button
                          onClick={() => {
                            setClientId(c.id)
                            setActiveTab('overview')
                          }}
                          className="px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-300 hover:text-white text-xs font-medium transition-colors"
                        >
                          Client View &rarr;
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="py-14 text-center">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto mb-3">
                      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                    </div>
                    <h4 className="text-sm font-bold text-zinc-100">No client workspaces provisioned yet</h4>
                    <p className="text-xs text-zinc-400 mt-1 max-w-sm mx-auto">
                      All demo data has been cleared. Onboard your first real client workspace to generate their private 1-click onboarding link and kickstart automations.
                    </p>
                    <button
                      type="button"
                      onClick={() => setClientModal(true)}
                      className="mt-4 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-xs shadow-lg shadow-emerald-500/20 transition-colors inline-flex items-center gap-2"
                    >
                      <span>+ Onboard Your First Client</span>
                    </button>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL 1: Issue Invoice */}
      {invoiceModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-2xl relative">
            <h3 className="text-base font-bold text-zinc-100">Issue Retainer Invoice</h3>
            <p className="text-xs text-zinc-400 mt-1">Generates record in D1 and notifies client in their private chat.</p>

            <form onSubmit={onIssueInvoice} className="mt-4 space-y-3.5">
              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1">Target Client Workspace</label>
                <select
                  value={invForm.clientId}
                  onChange={(e) => setInvForm({ ...invForm, clientId: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-xs text-zinc-200 focus:outline-none focus:border-cyan-500"
                >
                  {(adminData?.clients || availableClients).map((c) => (
                    <option key={c.id} value={c.id}>{c.company} ({c.name})</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1">Invoice Number</label>
                  <input
                    type="text"
                    required
                    value={invForm.invoiceNumber}
                    onChange={(e) => setInvForm({ ...invForm, invoiceNumber: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-xs text-zinc-200 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1">Amount ($ USD)</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={invForm.amountDollars}
                    onChange={(e) => setInvForm({ ...invForm, amountDollars: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-xs text-zinc-200 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1">Description / Deliverable</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sprint 2: DeepSeek AI Triage Webhook"
                  value={invForm.description}
                  onChange={(e) => setInvForm({ ...invForm, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-xs text-zinc-200"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1">Due Date</label>
                <input
                  type="date"
                  required
                  value={invForm.dueDate}
                  onChange={(e) => setInvForm({ ...invForm, dueDate: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-xs text-zinc-200 font-mono"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setInvoiceModal(false)}
                  className="px-4 py-2 rounded-lg text-xs text-zinc-400 hover:text-zinc-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-zinc-950 font-bold text-xs"
                >
                  {submitting ? 'Generating...' : 'Issue Invoice'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: Publish Deliverable */}
      {deliverableModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-2xl relative">
            <h3 className="text-base font-bold text-zinc-100">Publish Deliverable for Approval</h3>
            <p className="text-xs text-zinc-400 mt-1">Sends sprint deliverable to client approval queue.</p>

            <form onSubmit={onPublishDeliverable} className="mt-4 space-y-3.5">
              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1">Target Client Workspace</label>
                <select
                  value={delivForm.clientId}
                  onChange={(e) => setDelivForm({ ...delivForm, clientId: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-xs text-zinc-200"
                >
                  {(adminData?.clients || availableClients).map((c) => (
                    <option key={c.id} value={c.id}>{c.company} ({c.name})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1">Deliverable Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. n8n Multi-Branch Webhook Router"
                  value={delivForm.deliverableName}
                  onChange={(e) => setDelivForm({ ...delivForm, deliverableName: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-xs text-zinc-200"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1">Category</label>
                  <select
                    value={delivForm.deliverableType}
                    onChange={(e) => setDelivForm({ ...delivForm, deliverableType: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-xs text-zinc-200"
                  >
                    <option value="n8n_workflow">n8n Workflow</option>
                    <option value="ghl_snapshot">GoHighLevel Snapshot</option>
                    <option value="ai_agent">AI Agent / Webhook</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1">Version</label>
                  <input
                    type="text"
                    required
                    value={delivForm.version}
                    onChange={(e) => setDelivForm({ ...delivForm, version: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-xs text-zinc-200 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1">Description / Notes</label>
                <textarea
                  rows={2}
                  required
                  value={delivForm.description}
                  onChange={(e) => setDelivForm({ ...delivForm, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-xs text-zinc-200 resize-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setDeliverableModal(false)}
                  className="px-4 py-2 rounded-lg text-xs text-zinc-400 hover:text-zinc-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 rounded-lg bg-purple-500 hover:bg-purple-400 text-zinc-950 font-bold text-xs"
                >
                  {submitting ? 'Publishing...' : 'Publish Deliverable'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: Onboard New Client */}
      {clientModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-2xl relative">
            <h3 className="text-base font-bold text-zinc-100">Provision Client Workspace</h3>
            <p className="text-xs text-zinc-400 mt-1">Initializes dedicated tenant database records and onboarding pipeline.</p>

            <form onSubmit={onAddClient} className="mt-4 space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1">Contact Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. John Doe"
                    value={cliForm.name}
                    onChange={(e) => setCliForm({ ...cliForm, name: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-xs text-zinc-200"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1">Company</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Solis Medical"
                    value={cliForm.company}
                    onChange={(e) => setCliForm({ ...cliForm, company: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-xs text-zinc-200"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1">Contact Email</label>
                <input
                  type="email"
                  required
                  placeholder="contact@company.com"
                  value={cliForm.email}
                  onChange={(e) => setCliForm({ ...cliForm, email: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-xs text-zinc-200"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1">Portal Passkey</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. solis2026"
                    value={cliForm.passkey}
                    onChange={(e) => setCliForm({ ...cliForm, passkey: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-xs text-zinc-200 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1">Retainer Tier</label>
                  <input
                    type="text"
                    required
                    value={cliForm.tier}
                    onChange={(e) => setCliForm({ ...cliForm, tier: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-xs text-zinc-200"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1">Project Scope</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Lead Qualification AI Webhook"
                  value={cliForm.projectName}
                  onChange={(e) => setCliForm({ ...cliForm, projectName: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-xs text-zinc-200"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setClientModal(false)}
                  className="px-4 py-2 rounded-lg text-xs text-zinc-400 hover:text-zinc-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-xs"
                >
                  {submitting ? 'Provisioning...' : 'Provision Workspace'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 4: 1-Click Client Invite Link & Email Template */}
      {inviteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-zinc-900 border border-emerald-500/30 rounded-2xl p-6 shadow-2xl relative">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <h3 className="text-base font-bold text-zinc-100">Client Onboarding Invite Suite</h3>
              </div>
              <button
                onClick={() => setInviteModal(false)}
                className="text-zinc-500 hover:text-white p-1 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-zinc-400 mt-2">
              Send this 1-click link to <strong className="text-zinc-200">{activeInvite.name}</strong> ({activeInvite.company}). It automatically logs them directly into their private workspace with zero admin exposure.
            </p>

            {/* 1-Click Link Box */}
            <div className="mt-4 p-3 rounded-xl bg-zinc-950 border border-zinc-800">
              <label className="block text-[11px] font-mono text-zinc-400 mb-1.5 uppercase tracking-wider">
                1-Click Direct Access Link
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={`https://mpalomaresdigitalsolutions.vercel.app/portal?client=${activeInvite.clientId}&key=${activeInvite.passkey}`}
                  className="flex-1 bg-transparent text-xs font-mono text-emerald-400 focus:outline-none truncate select-all"
                />
                <button
                  type="button"
                  onClick={() => {
                    const url = `https://mpalomaresdigitalsolutions.vercel.app/portal?client=${activeInvite.clientId}&key=${activeInvite.passkey}`
                    navigator.clipboard.writeText(url)
                    setCopiedLink(true)
                    setTimeout(() => setCopiedLink(false), 2000)
                  }}
                  className="px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-zinc-950 text-xs font-bold transition-colors shrink-0"
                >
                  {copiedLink ? 'Copied!' : 'Copy Link'}
                </button>
              </div>
            </div>

            {/* Ready-to-Send Email Template Preview */}
            <div className="mt-4 p-3 rounded-xl bg-zinc-950 border border-zinc-800">
              <div className="flex items-center justify-between mb-2">
                <label className="block text-[11px] font-mono text-zinc-400 uppercase tracking-wider">
                  Ready-to-Send Email Template
                </label>
                <button
                  type="button"
                  onClick={() => {
                    const url = `https://mpalomaresdigitalsolutions.vercel.app/portal?client=${activeInvite.clientId}&key=${activeInvite.passkey}`
                    const emailBody = `Hi ${activeInvite.name},\n\nYour dedicated client operations workspace for ${activeInvite.company} is ready! You can review your onboarding checklist, sign project agreements, inspect live deliverables, and chat directly with our engineering desk here:\n\n👉 Launch Workspace: ${url}\n\nNo complicated setup needed—clicking the link above will automatically authenticate you into your private workspace.\n\nBest regards,\nMarlon Palomares\nMP Digital Solutions | Operations & AI Automation`
                    navigator.clipboard.writeText(emailBody)
                    setCopiedEmail(true)
                    setTimeout(() => setCopiedEmail(false), 2000)
                  }}
                  className="text-xs text-emerald-400 hover:text-emerald-300 font-semibold"
                >
                  {copiedEmail ? 'Copied Body!' : 'Copy Email Body'}
                </button>
              </div>

              <div className="p-3 rounded-lg bg-zinc-900 border border-zinc-800/80 text-xs text-zinc-300 font-mono space-y-2 max-h-40 overflow-y-auto leading-relaxed">
                <div><strong>To:</strong> {activeInvite.email || 'client@company.com'}</div>
                <div><strong>Subject:</strong> Welcome to your Client Operations Portal — MP Digital Solutions</div>
                <div className="pt-2 text-zinc-400 whitespace-pre-line text-[11px]">
                  {`Hi ${activeInvite.name || 'Partner'},\n\nYour dedicated client operations workspace for ${activeInvite.company} is ready! You can review your onboarding checklist, sign project agreements, inspect live deliverables, and chat directly with our engineering desk here:\n\n👉 Launch Workspace: https://mpalomaresdigitalsolutions.vercel.app/portal?client=${activeInvite.clientId}&key=${activeInvite.passkey}\n\nNo complicated setup needed—clicking the link above will automatically authenticate you into your private workspace.\n\nBest regards,\nMarlon Palomares\nMP Digital Solutions | Operations & AI Automation`}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-5 flex items-center justify-between pt-3 border-t border-zinc-800">
              <a
                href={`mailto:${activeInvite.email}?subject=${encodeURIComponent(
                  'Welcome to your Client Operations Portal — MP Digital Solutions'
                )}&body=${encodeURIComponent(
                  `Hi ${activeInvite.name},\n\nYour dedicated client operations workspace for ${activeInvite.company} is ready! You can review your onboarding checklist, sign project agreements, inspect live deliverables, and chat directly with our engineering desk here:\n\n👉 Launch Workspace: https://mpalomaresdigitalsolutions.vercel.app/portal?client=${activeInvite.clientId}&key=${activeInvite.passkey}\n\nNo complicated setup needed—clicking the link above will automatically authenticate you into your private workspace.\n\nBest regards,\nMarlon Palomares\nMP Digital Solutions | Operations & AI Automation`
                )}`}
                className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold flex items-center gap-2 transition-colors"
              >
                <svg className="w-3.5 h-3.5 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span>Open in Mail App (Draft)</span>
              </a>

              <button
                type="button"
                onClick={() => setInviteModal(false)}
                className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-semibold transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
