-- Wipe all sample/demo records from Cloudflare D1 database
DELETE FROM chat_messages;
DELETE FROM approvals;
DELETE FROM invoices;
DELETE FROM contracts;
DELETE FROM onboarding_steps;
DELETE FROM clients;
