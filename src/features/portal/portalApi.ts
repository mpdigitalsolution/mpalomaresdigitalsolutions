import type {
  ClientRecord,
  PortalDashboardData,
  ChatMessageRecord,
} from './types'

const WORKER_BASE = 'https://portfolio-chatbot-worker.portfolio-chatbot-worker.workers.dev'

export async function fetchClients(): Promise<ClientRecord[]> {
  try {
    const res = await fetch(`${WORKER_BASE}/api/portal/clients`)
    if (!res.ok) throw new Error('Failed to load clients')
    const data = await res.json()
    return data.clients || []
  } catch (err) {
    console.warn('Worker offline or fallback to default client:', err)
    return [
      {
        id: 'client_demo',
        name: 'Sarah Lin',
        company: 'Apex Health Partners',
        email: 'sarah.lin@apexhealth.io',
        passkey: 'apex2026',
        avatar_url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
        project_name: 'HIPAA Patient Intake & GHL Automation Suite',
        tier: 'Enterprise Automation Retainer',
        status: 'active',
        created_at: new Date().toISOString(),
      },
    ]
  }
}

export async function fetchPortalDashboard(clientId: string): Promise<PortalDashboardData> {
  const res = await fetch(`${WORKER_BASE}/api/portal/dashboard?clientId=${encodeURIComponent(clientId)}`, {
    headers: {
      'X-Client-Id': clientId,
    },
  })
  if (!res.ok) {
    throw new Error(`Failed to fetch portal dashboard (${res.status})`)
  }
  return res.json()
}

export async function loginWithPasskey(passkey: string): Promise<ClientRecord> {
  const res = await fetch(`${WORKER_BASE}/api/portal/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ passkey }),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.error || 'Invalid credentials')
  }
  const data = await res.json()
  return data.client
}

export async function completeOnboardingStep(
  clientId: string,
  stepId: string,
  status: 'pending' | 'in_progress' | 'completed',
  submittedData?: Record<string, unknown>
): Promise<boolean> {
  const res = await fetch(`${WORKER_BASE}/api/portal/onboarding/complete-step`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ clientId, stepId, status, submittedData }),
  })
  const data = await res.json().catch(() => ({}))
  return !!data.success
}

export async function signContractDocument(
  clientId: string,
  contractId: string,
  signerName: string,
  signature: string
): Promise<{ success: boolean; signedAt: string }> {
  const res = await fetch(`${WORKER_BASE}/api/portal/contracts/sign`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ clientId, contractId, signerName, signature }),
  })
  if (!res.ok) throw new Error('Contract signature submission failed')
  return res.json()
}

export async function sendChatMessage(
  clientId: string,
  sender: 'client' | 'agency',
  senderName: string,
  messageText: string,
  attachmentUrl?: string
): Promise<ChatMessageRecord> {
  const res = await fetch(`${WORKER_BASE}/api/portal/messages`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ clientId, sender, senderName, messageText, attachmentUrl }),
  })
  if (!res.ok) throw new Error('Failed to post message')
  const data = await res.json()
  return data.message
}

export async function decideDeliverableApproval(
  clientId: string,
  approvalId: string,
  status: 'approved' | 'revisions_requested',
  clientNotes?: string
): Promise<boolean> {
  const res = await fetch(`${WORKER_BASE}/api/portal/approvals/decide`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ clientId, approvalId, status, clientNotes }),
  })
  const data = await res.json().catch(() => ({}))
  return !!data.success
}
