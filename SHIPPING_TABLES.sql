-- Shipping Batches Table
CREATE TABLE IF NOT EXISTS shipping_batches (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  batch_number VARCHAR(100) UNIQUE NOT NULL,
  carrier VARCHAR(50) NOT NULL CHECK (carrier IN ('usps', 'ups', 'fedex', 'dhl')),
  status VARCHAR(50) DEFAULT 'created' CHECK (status IN ('created', 'processing', 'completed', 'cancelled')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Shipping Labels Table (Ensure it exists and has batch_id)
CREATE TABLE IF NOT EXISTS shipping_labels (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  batch_id UUID REFERENCES shipping_batches(id) ON DELETE SET NULL,
  carrier VARCHAR(50) NOT NULL CHECK (carrier IN ('usps', 'ups', 'fedex', 'dhl')),
  label_url TEXT NOT NULL,
  tracking_number VARCHAR(100) UNIQUE,
  weight DECIMAL(10, 2),
  length DECIMAL(10, 2),
  width DECIMAL(10, 2),
  height DECIMAL(10, 2),
  generated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE shipping_batches ENABLE ROW LEVEL SECURITY;
ALTER TABLE shipping_labels ENABLE ROW LEVEL SECURITY;

-- Admins can manage shipping batches
DROP POLICY IF EXISTS "Admins can manage shipping batches" ON shipping_batches;
CREATE POLICY "Admins can manage shipping batches" ON shipping_batches
  FOR ALL USING (auth.jwt() ->> 'role' = 'admin')
  WITH CHECK (auth.jwt() ->> 'role' = 'admin');

-- Admins can manage shipping labels
DROP POLICY IF EXISTS "Admins can manage shipping labels" ON shipping_labels;
CREATE POLICY "Admins can manage shipping labels" ON shipping_labels
  FOR ALL USING (auth.jwt() ->> 'role' = 'admin')
  WITH CHECK (auth.jwt() ->> 'role' = 'admin');

-- Public/Users can view their own labels
DROP POLICY IF EXISTS "Users can view own shipping labels" ON shipping_labels;
CREATE POLICY "Users can view own shipping labels" ON shipping_labels
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM orders
      WHERE orders.id = shipping_labels.order_id
      AND (
        EXISTS (
          SELECT 1 FROM customer_profiles
          WHERE customer_profiles.id = orders.customer_id
          AND customer_profiles.user_id = auth.uid()
        )
        OR auth.jwt() ->> 'role' = 'admin'
      )
    )
  );

-- Add trigger for updated_at on shipping_batches
DROP TRIGGER IF EXISTS shipping_batches_updated_at ON shipping_batches;
CREATE TRIGGER shipping_batches_updated_at BEFORE UPDATE ON shipping_batches
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
