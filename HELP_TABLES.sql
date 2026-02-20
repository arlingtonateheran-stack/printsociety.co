-- Help Categories Table
CREATE TABLE IF NOT EXISTS help_categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL,
  description TEXT,
  icon VARCHAR(50), -- Lucide icon name
  sort_order INT DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Help Articles Table
CREATE TABLE IF NOT EXISTS help_articles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  category_id UUID REFERENCES help_categories(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  content TEXT NOT NULL,
  excerpt TEXT,
  image_url TEXT,
  author VARCHAR(100) DEFAULT 'Support Team',
  views INT DEFAULT 0,
  helpful_yes INT DEFAULT 0,
  helpful_no INT DEFAULT 0,
  tags TEXT[], -- Array of tags
  status VARCHAR(20) DEFAULT 'published' CHECK (status IN ('draft', 'published')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- FAQs Table
CREATE TABLE IF NOT EXISTS help_faqs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  category_id UUID REFERENCES help_categories(id) ON DELETE CASCADE,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  sort_order INT DEFAULT 0,
  views INT DEFAULT 0,
  helpful_yes INT DEFAULT 0,
  helpful_no INT DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE help_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE help_articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE help_faqs ENABLE ROW LEVEL SECURITY;

-- Categories RLS
DROP POLICY IF EXISTS "Public can view help categories" ON help_categories;
CREATE POLICY "Public can view help categories" ON help_categories
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admins can manage help categories" ON help_categories;
CREATE POLICY "Admins can manage help categories" ON help_categories
  FOR ALL USING (auth.jwt() ->> 'role' = 'admin')
  WITH CHECK (auth.jwt() ->> 'role' = 'admin');

-- Articles RLS
DROP POLICY IF EXISTS "Public can view published help articles" ON help_articles;
CREATE POLICY "Public can view published help articles" ON help_articles
  FOR SELECT USING (status = 'published');

DROP POLICY IF EXISTS "Admins can manage help articles" ON help_articles;
CREATE POLICY "Admins can manage help articles" ON help_articles
  FOR ALL USING (auth.jwt() ->> 'role' = 'admin')
  WITH CHECK (auth.jwt() ->> 'role' = 'admin');

-- FAQs RLS
DROP POLICY IF EXISTS "Public can view help faqs" ON help_faqs;
CREATE POLICY "Public can view help faqs" ON help_faqs
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admins can manage help faqs" ON help_faqs;
CREATE POLICY "Admins can manage help faqs" ON help_faqs
  FOR ALL USING (auth.jwt() ->> 'role' = 'admin')
  WITH CHECK (auth.jwt() ->> 'role' = 'admin');

-- Add triggers for updated_at
CREATE TRIGGER help_categories_updated_at BEFORE UPDATE ON help_categories
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER help_articles_updated_at BEFORE UPDATE ON help_articles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER help_faqs_updated_at BEFORE UPDATE ON help_faqs
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
