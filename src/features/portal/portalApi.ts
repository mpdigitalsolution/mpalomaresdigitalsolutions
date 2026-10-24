import type {
  ClientRecord,
  PortalDashboardData,
  ChatMessageRecord,
  InvoiceRecord,
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
  try {
    const res = await fetch(`${WORKER_BASE}/api/portal/dashboard?clientId=${encodeURIComponent(clientId)}`, {
      headers: {
        'X-Client-Id': clientId,
      },
    })
    if (!res.ok) {
      throw new Error(`Failed to fetch portal dashboard (${res.status})`)
    }
    return res.json()
  } catch (err) {
    console.warn('Dashboard fetch fallback to edge cache:', err)
    return {
      client: {
        id: clientId,
        name: clientId === 'client_resilience' ? 'Dr. Marcus Vance' : 'Sarah Lin',
        company: clientId === 'client_resilience' ? 'Resilience Therapy Clinic' : 'Apex Health Partners',
        email: clientId === 'client_resilience' ? 'marcus@resiliencetherapy.com' : 'sarah.lin@apexhealth.io',
        passkey: clientId === 'client_resilience' ? 'resilience2026' : 'apex2026',
        avatar_url:
          clientId === 'client_resilience'
            ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
            : 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
        project_name:
          clientId === 'client_resilience'
            ? 'AI Telehealth Triage & Appointment Automation'
            : 'HIPAA Patient Intake & GHL Automation Suite',
        tier:
          clientId === 'client_resilience'
            ? 'Clinical Growth Retainer'
            : 'Enterprise Automation Retainer',
        status: 'active',
        created_at: new Date().toISOString(),
      },
      onboardingSteps: [
        {
          id: 'ob_1',
          client_id: clientId,
          step_number: 1,
          title: 'Welcome & Strategic Architecture Brief',
          description:
            'Review project scope, automation milestones, SLA deliverables, and communication channels.',
          status: 'completed',
          form_type: 'none',
          submitted_data: null,
          completed_at: '2026-10-20 14:30:00',
          created_at: '2026-10-20',
        },
        {
          id: 'ob_2',
          client_id: clientId,
          step_number: 2,
          title: 'API Credentials & Security Handshake',
          description:
            'Provide secure credentials for GoHighLevel API, EHR webhooks, and DeepSeek AI endpoints.',
          status: 'completed',
          form_type: 'api_credentials',
          submitted_data: null,
          completed_at: '2026-10-21 09:15:00',
          created_at: '2026-10-20',
        },
        {
          id: 'ob_3',
          client_id: clientId,
          step_number: 3,
          title: 'Execute Master Services Agreement',
          description:
            'Review and digitally sign the automation retainer agreement and data privacy annex.',
          status: clientId === 'client_resilience' ? 'completed' : 'in_progress',
          form_type: 'none',
          submitted_data: null,
          completed_at: null,
          created_at: '2026-10-20',
        },
        {
          id: 'ob_4',
          client_id: clientId,
          step_number: 4,
          title: 'Retainer Milestone Invoice',
          description: 'Process the initial kickoff payment to activate dedicated sprint capacity.',
          status: clientId === 'client_resilience' ? 'completed' : 'pending',
          form_type: 'none',
          submitted_data: null,
          completed_at: null,
          created_at: '2026-10-20',
        },
        {
          id: 'ob_5',
          client_id: clientId,
          step_number: 5,
          title: 'Architecture Kickoff & Sprint Planning Call',
          description:
            'Final alignment on edge webhook latency targets and test patient workflows.',
          status: 'pending',
          form_type: 'scheduler',
          submitted_data: null,
          completed_at: null,
          created_at: '2026-10-20',
        },
      ],
      contracts: [
        {
          id: 'cnt_01',
          client_id: clientId,
          title: 'Master Services Agreement & Data Protection Annex',
          version: '2.1',
          status: clientId === 'client_resilience' ? 'signed' : 'awaiting_signature',
          markdown_content: '# MASTER SERVICES AGREEMENT...',
          pdf_r2_key: null,
          signer_name: clientId === 'client_resilience' ? 'Dr. Marcus Vance' : null,
          signer_signature: null,
          signer_ip: null,
          signed_at: null,
          created_at: '2026-10-20',
        },
      ],
      invoices: [
        {
          id: 'inv_01',
          client_id: clientId,
          invoice_number: 'INV-2026-088',
          description: 'Phase 1 Architecture & Onboarding Retainer',
          amount_cents: 245000,
          currency: 'USD',
          status: clientId === 'client_resilience' ? 'paid' : 'issued',
          due_date: '2026-11-05',
          paid_at: null,
          stripe_payment_url: 'https://buy.stripe.com/test_demo',
          pdf_r2_key: null,
          created_at: '2026-10-20',
        },
      ],
      messages: [
        {
          id: 'msg_1',
          client_id: clientId,
          sender: 'system',
          sender_name: 'Portal Automation',
          message_text: 'Welcome to your private Client Portal!',
          attachment_url: null,
          read_at: null,
          created_at: '2026-10-20 14:00:00',
        },
      ],
      approvals: [
        {
          id: 'app_1',
          client_id: clientId,
          deliverable_name: 'n8n Lead Ingestion & EHR Sync Architecture',
          deliverable_type: 'n8n_workflow',
          version: 'v1.2',
          description:
            'Automated multi-branch error fallback handling, sanitizing inbound patient webhook forms.',
          preview_url: 'https://mpalomaresdigitalsolutions.vercel.app/#services',
          status: 'pending',
          client_notes: null,
          decided_at: null,
          created_at: '2026-10-20',
        },
      ],
    }
  }
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


export async function fetchAgencyAdminData(): Promise<import('./types').AgencyAdminData> {
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
}): Promise<import('./types').ApprovalRecord> {
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
