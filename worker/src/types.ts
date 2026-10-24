export interface Env {
  DEEPSEEK_API_KEY?: string
  ALLOWED_ORIGINS?: string
  DB: D1Database
  ASSETS_BUCKET: R2Bucket
  TELEGRAM_BOT_TOKEN?: string
  TELEGRAM_CHAT_ID?: string
  NOTIFICATION_WEBHOOK_URL?: string
  STRIPE_WEBHOOK_SECRET?: string
}

export interface ClientRecord {
  id: string
  name: string
  company: string
  email: string
  passkey: string
  avatar_url: string | null
  project_name: string
  tier: string
  status: string
  created_at: string
}

export interface OnboardingStepRecord {
  id: string
  client_id: string
  step_number: number
  title: string
  description: string
  status: 'pending' | 'in_progress' | 'completed'
  form_type: string
  submitted_data: string | null
  completed_at: string | null
  created_at: string
}

export interface ContractRecord {
  id: string
  client_id: string
  title: string
  version: string
  status: 'draft' | 'awaiting_signature' | 'signed'
  markdown_content: string
  pdf_r2_key: string | null
  signer_name: string | null
  signer_signature: string | null
  signer_ip: string | null
  signed_at: string | null
  created_at: string
}

export interface InvoiceRecord {
  id: string
  client_id: string
  invoice_number: string
  description: string
  amount_cents: number
  currency: string
  status: 'draft' | 'issued' | 'paid' | 'overdue'
  due_date: string
  paid_at: string | null
  stripe_payment_url: string | null
  pdf_r2_key: string | null
  created_at: string
}

export interface ChatMessageRecord {
  id: string
  client_id: string
  sender: 'client' | 'agency' | 'system'
  sender_name: string
  message_text: string
  attachment_url: string | null
  read_at: string | null
  created_at: string
}

export interface ApprovalRecord {
  id: string
  client_id: string
  deliverable_name: string
  deliverable_type: string
  version: string
  description: string
  preview_url: string | null
  status: 'pending' | 'approved' | 'revisions_requested'
  client_notes: string | null
  decided_at: string | null
  created_at: string
}

export interface PortalDashboardData {
  client: ClientRecord
  onboardingSteps: OnboardingStepRecord[]
  contracts: ContractRecord[]
  invoices: InvoiceRecord[]
  messages: ChatMessageRecord[]
  approvals: ApprovalRecord[]
}
