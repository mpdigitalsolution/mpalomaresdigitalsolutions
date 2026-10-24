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
