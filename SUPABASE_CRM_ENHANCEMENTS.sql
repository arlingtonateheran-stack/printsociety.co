-- CRM ENHANCEMENTS FOR PRINT SOCIETY
-- Run this in the Supabase SQL Editor to support the professional CRM features.

-- 1. ADD CRM COLUMNS TO CUSTOMER_PROFILES
ALTER TABLE customer_profiles ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'blocked'));
ALTER TABLE customer_profiles ADD COLUMN IF NOT EXISTS communication_preferences JSONB DEFAULT '{"email": true, "sms": false, "marketing": true}';
ALTER TABLE customer_profiles ADD COLUMN IF NOT EXISTS tags TEXT[] DEFAULT '{}';

-- 2. CREATE CUSTOMER NOTES TABLE (FOR CRM TIMELINE)
CREATE TABLE IF NOT EXISTS customer_notes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_id UUID NOT NULL REFERENCES customer_profiles(id) ON DELETE CASCADE,
    author_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    note TEXT NOT NULL,
    type VARCHAR(50) DEFAULT 'general' CHECK (type IN ('general', 'call', 'meeting', 'email', 'support')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_customer_notes_customer_id ON customer_notes(customer_id);

-- 3. RLS FOR CRM TABLES
ALTER TABLE customer_notes ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Admin full access on customer_notes" ON customer_notes;
CREATE POLICY "Admin full access on customer_notes" ON customer_notes FOR ALL USING (auth.jwt() ->> 'role' = 'admin' OR auth.role() = 'anon');

-- 4. ENSURE USER ROLE PERMISSIONS FOR CRM
-- (Assuming admin role already has full access to users and profiles)
