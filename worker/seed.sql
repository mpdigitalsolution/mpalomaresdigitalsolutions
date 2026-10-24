-- Seed Data for Marlon Palomares Digital Solutions Client Portal

-- Clean old seed records
DELETE FROM chat_messages;
DELETE FROM approvals;
DELETE FROM invoices;
DELETE FROM contracts;
DELETE FROM onboarding_steps;
DELETE FROM clients;

-- 1. Demo Client: Apex Health Partners
INSERT INTO clients (id, name, company, email, passkey, avatar_url, project_name, tier, status)
VALUES (
  'client_demo',
  'Sarah Lin',
  'Apex Health Partners',
  'sarah.lin@apexhealth.io',
  'apex2026',
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
  'HIPAA Patient Intake & GHL Automation Suite',
  'Enterprise Automation Retainer',
  'active'
);

-- Onboarding Steps for Apex Health
INSERT INTO onboarding_steps (id, client_id, step_number, title, description, status, form_type, completed_at) VALUES
('ob_1', 'client_demo', 1, 'Welcome & Strategic Architecture Brief', 'Review project scope, automation milestones, SLA deliverables, and communication channels.', 'completed', 'none', '2026-10-20 14:30:00'),
('ob_2', 'client_demo', 2, 'API Credentials & Security Handshake', 'Provide secure credentials for GoHighLevel API, EHR webhooks, and DeepSeek AI endpoints.', 'completed', 'api_credentials', '2026-10-21 09:15:00'),
('ob_3', 'client_demo', 3, 'Execute Master Services Agreement', 'Review and digitally sign the automation retainer agreement and data privacy annex.', 'in_progress', 'none', NULL),
('ob_4', 'client_demo', 4, 'Retainer Milestone Invoice', 'Process the initial kickoff payment ($2,450.00) to activate dedicated sprint capacity.', 'pending', 'none', NULL),
('ob_5', 'client_demo', 5, 'Architecture Kickoff & Sprint Planning Call', 'Final alignment on edge webhook latency targets and test patient workflows.', 'pending', 'scheduler', NULL);

-- Contract for Apex Health
INSERT INTO contracts (id, client_id, title, version, status, markdown_content) VALUES (
  'cnt_apex_01',
  'client_demo',
  'Master Services Agreement & Data Protection Annex',
  '2.1',
  'awaiting_signature',
  '# MASTER SERVICES AGREEMENT

**Client:** Apex Health Partners  
**Agency:** Marlon Palomares Digital Solutions  
**Effective Date:** October 24, 2026  

## 1. Scope of Engagement
Marlon Palomares Digital Solutions agrees to design, construct, test, and deploy an automated patient intake, CRM pipeline, and conversational AI concierge system utilizing **Cloudflare Workers, n8n orchestrations, and GoHighLevel CRM**.

## 2. Deliverables & Milestones
- **Milestone A:** Production n8n multi-agent webhook routing engine with 99.9% uptime SLA.
- **Milestone B:** GoHighLevel custom custom fields, automated tagging, and SMS follow-up pipelines.
- **Milestone C:** DeepSeek-powered streaming triage chatbot with strict medical compliance guardrails.
- **Milestone D:** Cloudflare R2 encrypted asset and form submission storage.

## 3. Financial Terms & Retainer
- Monthly Retainer: **$2,450.00 USD**
- Invoicing Cycle: 1st of each calendar month via Stripe / Wire transfer.
- Payment Terms: Net 15 days from issuance.

## 4. Confidentiality & Security
All proprietary customer data, API credentials, and workflow logic remain 100% property of Apex Health Partners. Encryption at rest (Cloudflare D1 & R2) and transport layer security (TLS 1.3) are strictly enforced.'
);

-- Invoices for Apex Health
INSERT INTO invoices (id, client_id, invoice_number, description, amount_cents, currency, status, due_date, stripe_payment_url) VALUES
('inv_001', 'client_demo', 'INV-2026-088', 'Phase 1 Architecture & Onboarding Retainer', 245000, 'USD', 'issued', '2026-11-05', 'https://buy.stripe.com/test_demo_invoice_88'),
('inv_000', 'client_demo', 'INV-2026-064', 'Initial Workflow Audit & Systems Blueprint', 75000, 'USD', 'paid', '2026-10-15', 'https://buy.stripe.com/test_demo_invoice_64');

UPDATE invoices SET paid_at = '2026-10-15 16:42:00' WHERE id = 'inv_000';

-- Chat Messages
INSERT INTO chat_messages (id, client_id, sender, sender_name, message_text, created_at) VALUES
('msg_1', 'client_demo', 'system', 'Portal Automation', 'Welcome to your private Client Portal! All documents, active workflows, and sprint approvals will be tracked here.', '2026-10-20 14:00:00'),
('msg_2', 'client_demo', 'agency', 'Marlon Palomares', 'Hi Sarah! I have set up your custom D1 database and Cloudflare worker endpoints. We are ready for you to review and sign the Master Services Agreement whenever you have a moment.', '2026-10-22 10:15:00'),
('msg_3', 'client_demo', 'client', 'Sarah Lin', 'Awesome progress Marlon! The webhook test payload passed our staging server with 42ms response time. Reviewing the contract today!', '2026-10-23 15:45:00');

-- Deliverable Approvals
INSERT INTO approvals (id, client_id, deliverable_name, deliverable_type, version, description, preview_url, status) VALUES
(
  'app_1',
  'client_demo',
  'n8n Lead Ingestion & EHR Sync Architecture',
  'n8n_workflow',
  'v1.2',
  'Automated multi-branch error fallback handling, sanitizing inbound patient webhook forms and synchronizing securely with GoHighLevel custom contact records.',
  'https://mpalomaresdigitalsolutions.vercel.app/#services',
  'pending'
),
(
  'app_2',
  'client_demo',
  'GoHighLevel 14-Day Automated Nurture Pipeline',
  'ghl_snapshot',
  'v1.0',
  'Pre-configured SMS triggers, appointment booking calendar reminders, and no-show automated re-engagement campaign.',
  'https://mpalomaresdigitalsolutions.vercel.app/#work',
  'approved'
);

UPDATE approvals SET decided_at = '2026-10-23 11:20:00', client_notes = 'Approved without revisions. Pipeline tags match our CRM spec.' WHERE id = 'app_2';
