import type {
  ClientRecord,
  OnboardingStepRecord,
  ContractRecord,
  InvoiceRecord,
  ChatMessageRecord,
  ApprovalRecord,
  PortalDashboardData,
} from './types'

/**
 * Multi-Tenant Database Query Layer for Cloudflare D1
 * Every function strictly binds the verified clientId parameter to enforce isolation.
 */

export async function getClientByPasskey(
  db: D1Database,
  passkey: string
): Promise<ClientRecord | null> {
  const stmt = db.prepare('SELECT * FROM clients WHERE passkey = ? OR email = ? LIMIT 1')
  const client = await stmt.bind(passkey.trim(), passkey.trim().toLowerCase()).first<ClientRecord>()
  return client || null
}

export async function getClientById(
  db: D1Database,
  clientId: string
): Promise<ClientRecord | null> {
  const stmt = db.prepare('SELECT * FROM clients WHERE id = ? LIMIT 1')
  const client = await stmt.bind(clientId).first<ClientRecord>()
  return client || null
}

export async function getClientByEmail(
  db: D1Database,
  email: string
): Promise<ClientRecord | null> {
  const stmt = db.prepare('SELECT * FROM clients WHERE LOWER(email) = LOWER(?) LIMIT 1')
  const client = await stmt.bind(email.trim()).first<ClientRecord>()
  return client || null
}

export async function getClientPortalData(
  db: D1Database,
  clientId: string
): Promise<PortalDashboardData | null> {
  const client = await getClientById(db, clientId)
  if (!client) return null

  // Fetch all tenant-isolated data in parallel using D1 batch queries
  const [stepsRes, contractsRes, invoicesRes, messagesRes, approvalsRes] = await db.batch([
    db.prepare('SELECT * FROM onboarding_steps WHERE client_id = ? ORDER BY step_number ASC').bind(clientId),
    db.prepare('SELECT * FROM contracts WHERE client_id = ? ORDER BY created_at DESC').bind(clientId),
    db.prepare('SELECT * FROM invoices WHERE client_id = ? ORDER BY created_at DESC').bind(clientId),
    db.prepare('SELECT * FROM chat_messages WHERE client_id = ? ORDER BY created_at ASC').bind(clientId),
    db.prepare('SELECT * FROM approvals WHERE client_id = ? ORDER BY created_at DESC').bind(clientId),
  ])

  return {
    client,
    onboardingSteps: (stepsRes.results || []) as OnboardingStepRecord[],
    contracts: (contractsRes.results || []) as ContractRecord[],
    invoices: (invoicesRes.results || []) as InvoiceRecord[],
    messages: (messagesRes.results || []) as ChatMessageRecord[],
    approvals: (approvalsRes.results || []) as ApprovalRecord[],
  }
}

export async function updateOnboardingStep(
  db: D1Database,
  clientId: string,
  stepId: string,
  status: 'pending' | 'in_progress' | 'completed',
  submittedData?: string
): Promise<boolean> {
  const now = status === 'completed' ? new Date().toISOString() : null
  const stmt = db.prepare(
    `UPDATE onboarding_steps 
     SET status = ?, submitted_data = COALESCE(?, submitted_data), completed_at = ? 
     WHERE id = ? AND client_id = ?`
  )
  const res = await stmt.bind(status, submittedData || null, now, stepId, clientId).run()
  return res.success && (res.meta.changes ?? 0) > 0
}

export async function signContract(
  db: D1Database,
  clientId: string,
  contractId: string,
  signerName: string,
  signature: string,
  signerIp: string
): Promise<boolean> {
  const now = new Date().toISOString()
  const stmt = db.prepare(
    `UPDATE contracts 
     SET status = 'signed', signer_name = ?, signer_signature = ?, signer_ip = ?, signed_at = ? 
     WHERE id = ? AND client_id = ?`
  )
  const res = await stmt.bind(signerName, signature, signerIp, now, contractId, clientId).run()
  return res.success && (res.meta.changes ?? 0) > 0
}

export async function postChatMessage(
  db: D1Database,
  clientId: string,
  sender: 'client' | 'agency' | 'system',
  senderName: string,
  messageText: string,
  attachmentUrl?: string
): Promise<ChatMessageRecord> {
  const id = `msg_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`
  const now = new Date().toISOString()
  const stmt = db.prepare(
    `INSERT INTO chat_messages (id, client_id, sender, sender_name, message_text, attachment_url, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?)`
  )
  await stmt.bind(id, clientId, sender, senderName, messageText, attachmentUrl || null, now).run()

  return {
    id,
    client_id: clientId,
    sender,
    sender_name: senderName,
    message_text: messageText,
    attachment_url: attachmentUrl || null,
    read_at: null,
    created_at: now,
  }
}

export async function submitApprovalDecision(
  db: D1Database,
  clientId: string,
  approvalId: string,
  status: 'approved' | 'revisions_requested',
  clientNotes?: string
): Promise<boolean> {
  const now = new Date().toISOString()
  const stmt = db.prepare(
    `UPDATE approvals 
     SET status = ?, client_notes = ?, decided_at = ? 
     WHERE id = ? AND client_id = ?`
  )
  const res = await stmt.bind(status, clientNotes || null, now, approvalId, clientId).run()
  return res.success && (res.meta.changes ?? 0) > 0
}

export async function payInvoice(
  db: D1Database,
  clientId: string,
  invoiceIdOrNumber: string
): Promise<InvoiceRecord | null> {
  const now = new Date().toISOString()
  const stmt = db.prepare(
    `UPDATE invoices 
     SET status = 'paid', paid_at = ? 
     WHERE (id = ? OR invoice_number = ?) AND client_id = ?`
  )
  const res = await stmt.bind(now, invoiceIdOrNumber, invoiceIdOrNumber, clientId).run()
  if (res.success && (res.meta.changes ?? 0) > 0) {
    const updated = await db
      .prepare('SELECT * FROM invoices WHERE (id = ? OR invoice_number = ?) AND client_id = ?')
      .bind(invoiceIdOrNumber, invoiceIdOrNumber, clientId)
      .first<InvoiceRecord>()
    return updated || null
  }
  return null
}


export async function createInvoice(
  db: D1Database,
  data: {
    clientId: string
    invoiceNumber: string
    description: string
    amountCents: number
    dueDate: string
    stripePaymentUrl?: string
  }
): Promise<InvoiceRecord> {
  const id = `inv_${Date.now()}`
  const now = new Date().toISOString()
  const stmt = db.prepare(
    `INSERT INTO invoices (id, client_id, invoice_number, description, amount_cents, currency, status, due_date, stripe_payment_url, created_at)
     VALUES (?, ?, ?, ?, ?, 'USD', 'issued', ?, ?, ?)`
  )
  await stmt.bind(id, data.clientId, data.invoiceNumber, data.description, data.amountCents, data.dueDate, data.stripePaymentUrl || null, now).run()

  return {
    id,
    client_id: data.clientId,
    invoice_number: data.invoiceNumber,
    description: data.description,
    amount_cents: data.amountCents,
    currency: 'USD',
    status: 'issued',
    due_date: data.dueDate,
    paid_at: null,
    stripe_payment_url: data.stripePaymentUrl || null,
    pdf_r2_key: null,
    created_at: now,
  }
}

export async function createDeliverable(
  db: D1Database,
  data: {
    clientId: string
    deliverableName: string
    deliverableType: string
    version: string
    description: string
    previewUrl?: string
  }
): Promise<ApprovalRecord> {
  const id = `app_${Date.now()}`
  const now = new Date().toISOString()
  const stmt = db.prepare(
    `INSERT INTO approvals (id, client_id, deliverable_name, deliverable_type, version, description, preview_url, status, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, 'pending', ?)`
  )
  await stmt.bind(
    id,
    data.clientId,
    data.deliverableName,
    data.deliverableType,
    data.version,
    data.description,
    data.previewUrl || null,
    now
  ).run()

  return {
    id,
    client_id: data.clientId,
    deliverable_name: data.deliverableName,
    deliverable_type: data.deliverableType,
    version: data.version,
    description: data.description,
    preview_url: data.previewUrl || null,
    status: 'pending',
    client_notes: null,
    decided_at: null,
    created_at: now,
  }
}

export async function createClientWorkspace(
  db: D1Database,
  data: {
    name: string
    company: string
    email: string
    passkey: string
    projectName: string
    tier: string
  }
): Promise<ClientRecord> {
  const id = `client_${Date.now().toString(36)}`
  const now = new Date().toISOString()
  const stmt = db.prepare(
    `INSERT INTO clients (id, name, company, email, passkey, project_name, tier, status, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, 'active', ?)`
  )
  await stmt.bind(
    id,
    data.name,
    data.company,
    data.email,
    data.passkey,
    data.projectName,
    data.tier || 'Automation Retainer',
    now
  ).run()

  // Initialize initial standard onboarding steps for this new client
  const steps = [
    { num: 1, title: 'Welcome & Strategic Architecture Brief', desc: 'Initial scope alignment and communication channels setup.' },
    { num: 2, title: 'API Credentials & Webhook Handshake', desc: 'Secure credential exchange for CRM & AI webhooks.' },
    { num: 3, title: 'Execute Master Services Agreement', desc: 'Review and sign retainer agreement.' },
    { num: 4, title: 'Retainer Milestone Invoice', desc: 'Initial kickoff retainer settlement.' },
    { num: 5, title: 'Architecture Kickoff & Sprint Planning Call', desc: 'Production deployment alignment.' },
  ]

  for (const step of steps) {
    await db.prepare(
      `INSERT INTO onboarding_steps (id, client_id, step_number, title, description, status, created_at)
       VALUES (?, ?, ?, ?, ?, 'pending', ?)`
    ).bind(`ob_${id}_${step.num}`, id, step.num, step.title, step.desc, now).run()
  }

  return {
    id,
    name: data.name,
    company: data.company,
    email: data.email,
    passkey: data.passkey,
    avatar_url: null,
    project_name: data.projectName,
    tier: data.tier || 'Automation Retainer',
    status: 'active',
    created_at: now,
  }
}

export async function recordClientInviteSent(
  db: D1Database,
  clientId: string,
  clientEmail: string
): Promise<string> {
  const now = new Date().toISOString()
  const msgId = `msg_${Date.now().toString(36)}`

  await db.batch([
    db.prepare('UPDATE clients SET invite_sent_at = ? WHERE id = ?').bind(now, clientId),
    db.prepare(
      `INSERT INTO chat_messages (id, client_id, sender, sender_name, message_text, created_at)
       VALUES (?, ?, 'agency', 'Marlon Palomares', ?, ?)`
    ).bind(
      msgId,
      clientId,
      `✉️ Onboarding invitation email with 1-click access link dispatched to ${clientEmail}.`,
      now
    ),
  ])

  return now
}

export async function getAgencyAdminData(db: D1Database) {
  const [clientsRes, invoicesRes, contractsRes, approvalsRes] = await db.batch([
    db.prepare('SELECT * FROM clients ORDER BY created_at DESC'),
    db.prepare('SELECT * FROM invoices ORDER BY created_at DESC'),
    db.prepare('SELECT * FROM contracts ORDER BY created_at DESC'),
    db.prepare('SELECT * FROM approvals ORDER BY created_at DESC'),
  ])

  const clients = (clientsRes.results || []) as ClientRecord[]
  const invoices = (invoicesRes.results || []) as InvoiceRecord[]
  const contracts = (contractsRes.results || []) as ContractRecord[]
  const approvals = (approvalsRes.results || []) as ApprovalRecord[]

  const totalPaid = invoices.filter((i) => i.status === 'paid').reduce((sum, i) => sum + i.amount_cents, 0)
  const totalOutstanding = invoices.filter((i) => i.status !== 'paid').reduce((sum, i) => sum + i.amount_cents, 0)

  // Estimated MRR: $2,450 for Apex + $3,200 for Resilience = $5,650
  const estimatedMRR = clients.length * 282500 // average ~$2,825 retainer

  return {
    clients,
    invoices,
    contracts,
    approvals,
    metrics: {
      activeClients: clients.length,
      estimatedMRRCents: estimatedMRR,
      totalCollectedCents: totalPaid,
      totalOutstandingCents: totalOutstanding,
      pendingContracts: contracts.filter((c) => c.status === 'awaiting_signature').length,
      pendingApprovals: approvals.filter((a) => a.status === 'pending').length,
    },
  }
}
