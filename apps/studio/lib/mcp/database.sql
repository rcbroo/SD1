CREATE TABLE IF NOT EXISTS mcp_server_installations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  template_id TEXT NOT NULL,
  project_id TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('installing', 'installed', 'failed', 'disabled')),
  config JSONB NOT NULL,
  installed_at TIMESTAMPTZ DEFAULT NOW(),
  last_used TIMESTAMPTZ,
  error_message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS mcp_server_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  template_id TEXT NOT NULL,
  user_id UUID NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  helpful INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS mcp_server_usage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  installation_id UUID REFERENCES mcp_server_installations(id),
  template_id TEXT NOT NULL,
  project_id TEXT NOT NULL,
  usage_type TEXT NOT NULL,
  usage_data JSONB,
  timestamp TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_mcp_installations_project_id ON mcp_server_installations(project_id);
CREATE INDEX IF NOT EXISTS idx_mcp_installations_template_id ON mcp_server_installations(template_id);
CREATE INDEX IF NOT EXISTS idx_mcp_reviews_template_id ON mcp_server_reviews(template_id);
CREATE INDEX IF NOT EXISTS idx_mcp_usage_project_id ON mcp_server_usage(project_id);
CREATE INDEX IF NOT EXISTS idx_mcp_usage_timestamp ON mcp_server_usage(timestamp);

ALTER TABLE mcp_server_installations ENABLE ROW LEVEL SECURITY;
ALTER TABLE mcp_server_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE mcp_server_usage ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their project's MCP installations" ON mcp_server_installations
  FOR SELECT USING (auth.uid() IN (
    SELECT user_id FROM project_members WHERE project_id = mcp_server_installations.project_id
  ));

CREATE POLICY "Users can manage their project's MCP installations" ON mcp_server_installations
  FOR ALL USING (auth.uid() IN (
    SELECT user_id FROM project_members 
    WHERE project_id = mcp_server_installations.project_id 
    AND role IN ('owner', 'admin')
  ));
