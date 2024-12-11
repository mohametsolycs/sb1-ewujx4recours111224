-- Add payments table
CREATE TABLE IF NOT EXISTS payments (
  id TEXT PRIMARY KEY,
  reference TEXT NOT NULL,
  payer_company_id TEXT NOT NULL,
  receiver_company_id TEXT NOT NULL,
  amount INTEGER NOT NULL,
  status TEXT NOT NULL,
  proof_document TEXT,
  created_at DATETIME NOT NULL,
  updated_at DATETIME NOT NULL,
  validated_at DATETIME,
  created_by TEXT NOT NULL,
  FOREIGN KEY (payer_company_id) REFERENCES insurance_companies(id),
  FOREIGN KEY (receiver_company_id) REFERENCES insurance_companies(id)
);

-- Add payment_claims junction table
CREATE TABLE IF NOT EXISTS payment_claims (
  payment_id TEXT NOT NULL,
  claim_id TEXT NOT NULL,
  PRIMARY KEY (payment_id, claim_id),
  FOREIGN KEY (payment_id) REFERENCES payments(id) ON DELETE CASCADE,
  FOREIGN KEY (claim_id) REFERENCES claims(id) ON DELETE CASCADE
);

-- Add payment_comments table
CREATE TABLE IF NOT EXISTS payment_comments (
  id TEXT PRIMARY KEY,
  payment_id TEXT NOT NULL,
  content TEXT NOT NULL,
  author_id TEXT NOT NULL,
  author_name TEXT NOT NULL,
  created_at DATETIME NOT NULL,
  FOREIGN KEY (payment_id) REFERENCES payments(id) ON DELETE CASCADE
);