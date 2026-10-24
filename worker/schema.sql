-- Marlon Palomares Digital Solutions - Client Portal D1 Schema
-- Multi-Tenant Isolation with Foreign Keys

PRAGMA foreign_keys = ON;

-- 1. Clients Table
CREATE TABLE IF NOT EXISTS clients (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  company TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  passkey TEXT NOT NULL,
  avatar_url TEXT,
  project_name TEXT NOT NULL,
  tier TEXT DEFAULT 'Automation Retainer',
  status TEXT DEFAULT 'active',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_clients_email ON clients(email);
CREATE INDEX IF NOT EXISTS idx_clients_passkey ON clients(passkey);

-- 2. Onboarding Steps
CREATE TABLE IF NOT EXISTS onboarding_steps (
  id TEXT PRIMARY KEY,
  client_id TEXT NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  step_number INTEGER NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'in_progress', 'completed'
  form_type TEXT DEFAULT 'none',
  submitted_data TEXT,
  completed_at DATETIME,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_onboarding_client ON onboarding_steps(client_id, step_number);

-- 3. Contracts Table
CREATE TABLE IF NOT EXISTS contracts (
  id TEXT PRIMARY KEY,
  client_id TEXT NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  version TEXT NOT NULL DEFAULT '1.0',
  status TEXT NOT NULL DEFAULT 'awaiting_signature', -- 'draft', 'awaiting_signature', 'signed'
  markdown_content TEXT NOT NULL,
  pdf_r2_key TEXT,
  signer_name TEXT,
  signer_signature TEXT,
  signer_ip TEXT,
  signed_at DATETIME,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_contracts_client ON contracts(client_id);

-- 4. Invoices Table
CREATE TABLE IF NOT EXISTS invoices (
  id TEXT PRIMARY KEY,
  client_id TEXT NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  invoice_number TEXT NOT NULL,
  description TEXT NOT NULL,
  amount_cents INTEGER NOT NULL,
  currency TEXT NOT NULL DEFAULT 'USD',
  status TEXT NOT NULL DEFAULT 'issued', -- 'draft', 'issued', 'paid', 'overdue'
  due_date TEXT NOT NULL,
  paid_at DATETIME,
  stripe_payment_url TEXT,
  pdf_r2_key TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_invoices_client ON invoices(client_id);

-- 5. Chat Messages Table
CREATE TABLE IF NOT EXISTS chat_messages (
  id TEXT PRIMARY KEY,
  client_id TEXT NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  sender TEXT NOT NULL, -- 'client', 'agency', 'system'
  sender_name TEXT NOT NULL,
  message_text TEXT NOT NULL,
  attachment_url TEXT,
  read_at DATETIME,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_chat_client ON chat_messages(client_id, created_at);

-- 6. Approvals / Deliverables Table
CREATE TABLE IF NOT EXISTS approvals (
  id TEXT PRIMARY KEY,
  client_id TEXT NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  deliverable_name TEXT NOT NULL,
  deliverable_type TEXT NOT NULL, -- 'n8n_workflow', 'ghl_snapshot', 'landing_page', 'ai_agent'
  version TEXT NOT NULL DEFAULT 'v1.0',
  description TEXT NOT NULL,
  preview_url TEXT,
  status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'approved', 'revisions_requested'
  client_notes TEXT,
  decided_at DATETIME,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_approvals_client ON approvals(client_id);
