import type {
  ClientRecord,
  PortalDashboardData,
  ChatMessageRecord,
  InvoiceRecord,
  ApprovalRecord,
  AgencyAdminData,
} from './types'

const WORKER_BASE = 'https://portfolio-chatbot-worker.portfolio-chatbot-worker.workers.dev'

export async function fetchClients(): Promise<ClientRecord[]> {
  try {
    const res = await fetch(`${WORKER_BASE}/api/portal/clients`)
    if (!res.ok) throw new Error('Failed to load clients')
    const data = await res.json()
    return data.clients || []
  } catch (err) {
    console.warn('Worker offline or empty client list:', err)
    return []
  }
}

export async function fetchPortalDashboard(clientId: string): Promise<PortalDashboardData> {
  const res = await fetch(`${WORKER_BASE}/api/portal/dashboard?clientId=${encodeURIComponent(clientId)}`, {
    headers: {
      'X-Client-Id': clientId,
    },
  })
  if (!res.ok) {
    throw new Error(`Client workspace "${clientId}" not found or inactive (${res.status})`)
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

export async function settleInvoice(clientId: string, invoiceId: string): Promise<InvoiceRecord> {
  const res = await fetch(`${WORKER_BASE}/api/portal/invoices/pay`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ clientId, invoiceId }),
  })
  if (!res.ok) throw new Error('Invoice payment failed')
  const data = await res.json()
  return data.invoice
}

export async function fetchAgencyAdminData(): Promise<AgencyAdminData> {
  const res = await fetch(`${WORKER_BASE}/api/portal/admin/overview`)
  if (!res.ok) throw new Error('Failed to load agency admin data')
  return res.json()
}

export async function createAdminInvoice(data: {
  clientId: string
  invoiceNumber: string
  description: string
  amountCents: number
  dueDate: string
  stripePaymentUrl?: string
}): Promise<InvoiceRecord> {
  const res = await fetch(`${WORKER_BASE}/api/portal/admin/invoice`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!res.ok) throw new Error('Failed to issue invoice')
  const json = await res.json()
  return json.invoice
}

export async function createAdminDeliverable(data: {
  clientId: string
  deliverableName: string
  deliverableType: string
  version: string
  description: string
  previewUrl?: string
}): Promise<ApprovalRecord> {
  const res = await fetch(`${WORKER_BASE}/api/portal/admin/deliverable`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!res.ok) throw new Error('Failed to publish deliverable')
  const json = await res.json()
  return json.deliverable
}

export async function createAdminClient(data: {
  name: string
  company: string
  email: string
  passkey: string
  projectName: string
  tier: string
}): Promise<ClientRecord> {
  const res = await fetch(`${WORKER_BASE}/api/portal/admin/client`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!res.ok) throw new Error('Failed to onboard client')
  const json = await res.json()
  return json.client
}

export async function simulateTestWebhook(payload: Record<string, unknown>) {
  const res = await fetch(`${WORKER_BASE}/api/portal/webhook/test`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  if (!res.ok) throw new Error('Webhook simulation failed')
  return res.json()
}
