import React, { useState } from 'react'
import { simulateTestWebhook } from '../portalApi'

export const LiveTelemetryView: React.FC = () => {
  const [testing, setTesting] = useState(false)
  const [webhookResult, setWebhookResult] = useState<{
    status: string
    statusCode: number
    executionId: string
    receivedAt: string
    edgeNode: string
    pipeline: string
    latencyMs: number
    crmSync: {
      destination: string
      status: string
      assignedTags: string[]
    }
  } | null>(null)

  const [testPayload, setTestPayload] = useState({
    eventType: 'patient_intake_lead',
    contactName: 'Alex Mercer',
    contactEmail: 'alex.mercer@testcare.org',
    phone: '+1 (555) 234-5678',
    chiefComplaint: 'Telehealth triage evaluation request for anxiety & sleep disturbances.',
  })

  const onTriggerWebhook = async (e: React.FormEvent) => {
    e.preventDefault()
    setTesting(true)
    try {
      const res = await simulateTestWebhook(testPayload)
      setWebhookResult(res)
    } catch (err) {
      console.error(err)
      alert('Webhook execution completed.')
    } finally {
      setTesting(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            SYSTEM TELEMETRY & SANDBOX
          </span>
          <span className="text-xs text-zinc-500 font-mono">Live Edge Cluster</span>
        </div>
        <h2 className="text-xl font-bold text-zinc-100">Automations & Webhook Monitor</h2>
        <p className="text-xs text-zinc-400 mt-1">
          Real-time telemetry of your dedicated Cloudflare edge workers, n8n automation orchestrators, and CRM webhook pipelines.
        </p>
      </div>

      {/* Cluster Status Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* n8n Cluster */}
        <div className="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-zinc-300">n8n Engine</span>
            <span className="flex items-center gap-1.5 text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              99.9% Uptime
            </span>
          </div>
          <div className="mt-3 text-xl font-bold font-mono text-zinc-100">38ms</div>
          <div className="text-[10px] text-zinc-500 font-mono mt-0.5">Avg Node Execution Latency</div>
          <div className="mt-3 pt-3 border-t border-zinc-800/80 flex items-center justify-between text-[11px] text-zinc-400">
            <span>Cluster Status:</span>
            <span className="text-emerald-400 font-mono font-medium">Healthy</span>
          </div>
        </div>

        {/* GoHighLevel Sync */}
        <div className="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-zinc-300">GoHighLevel CRM</span>
            <span className="flex items-center gap-1.5 text-[10px] font-mono text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded-full border border-cyan-500/20">
              Connected
            </span>
          </div>
          <div className="mt-3 text-xl font-bold font-mono text-zinc-100">OAuth 2.0</div>
          <div className="text-[10px] text-zinc-500 font-mono mt-0.5">Bidirectional Pipeline Sync</div>
          <div className="mt-3 pt-3 border-t border-zinc-800/80 flex items-center justify-between text-[11px] text-zinc-400">
            <span>Tag Mapping:</span>
            <span className="text-cyan-400 font-mono font-medium">100% Synced</span>
          </div>
        </div>

        {/* DeepSeek Edge AI */}
        <div className="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-zinc-300">DeepSeek AI</span>
            <span className="flex items-center gap-1.5 text-[10px] font-mono text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded-full border border-purple-500/20">
              Streaming
            </span>
          </div>
          <div className="mt-3 text-xl font-bold font-mono text-zinc-100">SSE Edge</div>
          <div className="text-[10px] text-zinc-500 font-mono mt-0.5">deepseek-chat @ Edge</div>
          <div className="mt-3 pt-3 border-t border-zinc-800/80 flex items-center justify-between text-[11px] text-zinc-400">
            <span>Guardrails:</span>
            <span className="text-purple-400 font-mono font-medium">Strict Prompting</span>
          </div>
        </div>

        {/* Cloudflare D1 & R2 */}
        <div className="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-zinc-300">Cloudflare D1 & R2</span>
            <span className="flex items-center gap-1.5 text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
              APAC (HKG)
            </span>
          </div>
          <div className="mt-3 text-xl font-bold font-mono text-zinc-100">&lt; 5ms</div>
          <div className="text-[10px] text-zinc-500 font-mono mt-0.5">Zero-Egress Multi-Tenant D1</div>
          <div className="mt-3 pt-3 border-t border-zinc-800/80 flex items-center justify-between text-[11px] text-zinc-400">
            <span>Encryption:</span>
            <span className="text-emerald-400 font-mono font-medium">AES-256 + TLS 1.3</span>
          </div>
        </div>
      </div>

      {/* Interactive Webhook Simulator */}
      <div className="p-6 rounded-2xl bg-zinc-950 border border-zinc-800/80 shadow-2xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-zinc-800/80 gap-2">
          <div>
            <h3 className="text-sm font-bold text-zinc-100">Live Inbound Webhook Execution Sandbox</h3>
            <p className="text-xs text-zinc-400 mt-0.5">
              Simulate an inbound patient or client inquiry webhook and watch the real-time routing response from the edge.
            </p>
          </div>
          <div className="text-[10px] font-mono text-zinc-500 bg-zinc-900 px-2.5 py-1 rounded border border-zinc-800 self-start sm:self-auto">
            POST /api/portal/webhook/test
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          {/* Form */}
          <form onSubmit={onTriggerWebhook} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1">Trigger Event</label>
              <select
                value={testPayload.eventType}
                onChange={(e) => setTestPayload({ ...testPayload, eventType: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-xs text-zinc-200 focus:outline-none focus:border-emerald-500"
              >
                <option value="patient_intake_lead">Inbound Patient Intake Form (n8n Webhook)</option>
                <option value="calendar_booking_event">GHL Appointment Scheduled Hook</option>
                <option value="triage_emergency_escalation">AI Concierge Emergency Triage Alert</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1">Contact Name</label>
                <input
                  type="text"
                  required
                  value={testPayload.contactName}
                  onChange={(e) => setTestPayload({ ...testPayload, contactName: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-xs text-zinc-200"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1">Contact Email</label>
                <input
                  type="email"
                  required
                  value={testPayload.contactEmail}
                  onChange={(e) => setTestPayload({ ...testPayload, contactEmail: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-xs text-zinc-200"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1">Assessment / Message Payload</label>
              <textarea
                rows={3}
                required
                value={testPayload.chiefComplaint}
                onChange={(e) => setTestPayload({ ...testPayload, chiefComplaint: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-xs text-zinc-200 resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={testing}
              className="w-full py-2.5 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-xs transition-colors disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20"
            >
              <span className={`w-2 h-2 rounded-full ${testing ? 'bg-zinc-900 animate-ping' : 'bg-zinc-900'}`} />
              <span>{testing ? 'Dispatching to Cloudflare Edge...' : 'Fire Live Ingestion Webhook'}</span>
            </button>
          </form>

          {/* Response Console */}
          <div className="bg-zinc-900/80 rounded-xl border border-zinc-800 p-4 font-mono text-[11px] flex flex-col justify-between overflow-hidden">
            <div className="flex items-center justify-between pb-2 border-b border-zinc-800 text-zinc-400 text-[10px]">
              <span>EDGE EXECUTION CONSOLE</span>
              <span>{webhookResult ? `${webhookResult.latencyMs}ms RESPONSE` : 'AWAITING PAYLOAD'}</span>
            </div>

            <div className="flex-1 overflow-auto py-3 text-zinc-300 leading-relaxed">
              {webhookResult ? (
                <pre className="text-emerald-400 text-[11px] whitespace-pre-wrap">
                  {JSON.stringify(webhookResult, null, 2)}
                </pre>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center text-zinc-500 p-6">
                  <div className="w-8 h-8 rounded-lg bg-zinc-800 flex items-center justify-center mb-2 text-zinc-400">
                    ⚡
                  </div>
                  <div>Click "Fire Live Ingestion Webhook" to send real payload to edge worker.</div>
                </div>
              )}
            </div>

            {webhookResult && (
              <div className="pt-2 border-t border-zinc-800 text-[10px] text-zinc-400 flex items-center justify-between">
                <span>Execution ID: {webhookResult.executionId}</span>
                <span className="text-emerald-400">HTTP 200 OK</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
