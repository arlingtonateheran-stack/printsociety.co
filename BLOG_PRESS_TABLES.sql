-- Blog Posts Table
CREATE TABLE IF NOT EXISTS blog_posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  content TEXT NOT NULL,
  excerpt TEXT,
  author_name VARCHAR(100),
  category VARCHAR(50),
  image_url TEXT,
  status VARCHAR(20) DEFAULT 'published' CHECK (status IN ('draft', 'published')),
  published_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Press Items Table
CREATE TABLE IF NOT EXISTS press_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  file_url TEXT NOT NULL,
  file_type VARCHAR(20), -- PDF, ZIP, JPG, etc.
  file_size VARCHAR(20), -- e.g. "2.4 MB"
  category VARCHAR(50), -- logos, photography, documents
  sort_order INT DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE press_items ENABLE ROW LEVEL SECURITY;

-- Blog RLS
DROP POLICY IF EXISTS "Public can view published blogs" ON blog_posts;
CREATE POLICY "Public can view published blogs" ON blog_posts
  FOR SELECT USING (status = 'published');

DROP POLICY IF EXISTS "Admins can manage blogs" ON blog_posts;
CREATE POLICY "Admins can manage blogs" ON blog_posts
  FOR ALL USING (auth.jwt() ->> 'role' = 'admin')
  WITH CHECK (auth.jwt() ->> 'role' = 'admin');

-- Press RLS
DROP POLICY IF EXISTS "Public can view press items" ON press_items;
CREATE POLICY "Public can view press items" ON press_items
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admins can manage press items" ON press_items;
CREATE POLICY "Admins can manage press items" ON press_items
  FOR ALL USING (auth.jwt() ->> 'role' = 'admin')
  WITH CHECK (auth.jwt() ->> 'role' = 'admin');

-- Add triggers for updated_at
CREATE TRIGGER blog_posts_updated_at BEFORE UPDATE ON blog_posts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER press_items_updated_at BEFORE UPDATE ON press_items
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
