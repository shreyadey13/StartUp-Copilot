-- AI Startup Copilot: Production PostgreSQL Schema
-- Version: 1.0
-- Date: 2026-06-03

CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE EXTENSION IF NOT EXISTS citext;

-- =========================================================
-- Common Utilities
-- =========================================================

CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- =========================================================
-- Multi-Tenant Identity And Access
-- =========================================================

CREATE TABLE organizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug CITEXT NOT NULL UNIQUE,
  plan_code TEXT NOT NULL DEFAULT 'free',
  billing_customer_id TEXT,
  status TEXT NOT NULL DEFAULT 'active'
    CHECK (status IN ('active', 'suspended', 'deleted')),
  metadata JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);

CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email CITEXT NOT NULL UNIQUE,
  full_name TEXT,
  avatar_url TEXT,
  auth_provider TEXT NOT NULL DEFAULT 'email',
  auth_subject TEXT UNIQUE,
  status TEXT NOT NULL DEFAULT 'active'
    CHECK (status IN ('active', 'invited', 'disabled', 'deleted')),
  last_login_at TIMESTAMPTZ,
  metadata JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);

CREATE TABLE organization_memberships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('owner', 'admin', 'editor', 'viewer')),
  status TEXT NOT NULL DEFAULT 'active'
    CHECK (status IN ('active', 'invited', 'disabled')),
  invited_by UUID REFERENCES users(id) ON DELETE SET NULL,
  joined_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (organization_id, user_id)
);

-- =========================================================
-- Projects And Startup Ideas
-- =========================================================

CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  created_by UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  name TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'active'
    CHECK (status IN ('draft', 'active', 'archived', 'deleted')),
  visibility TEXT NOT NULL DEFAULT 'private'
    CHECK (visibility IN ('private', 'workspace')),
  metadata JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);

CREATE TABLE startup_ideas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  created_by UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  title TEXT NOT NULL,
  raw_description TEXT NOT NULL,
  canonical_description TEXT,
  problem_statement TEXT,
  solution_summary TEXT,
  target_customer TEXT,
  industry TEXT,
  geography TEXT,
  stage TEXT CHECK (stage IN ('idea', 'prototype', 'launched', 'scaling')),
  validation_status TEXT NOT NULL DEFAULT 'unvalidated'
    CHECK (validation_status IN ('unvalidated', 'in_progress', 'validated', 'rejected', 'needs_revision')),
  confidence_score NUMERIC(5,2) CHECK (confidence_score BETWEEN 0 AND 100),
  metadata JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMPTZ,
  UNIQUE (organization_id, project_id, title)
);

CREATE TABLE startup_idea_assumptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  startup_idea_id UUID NOT NULL REFERENCES startup_ideas(id) ON DELETE CASCADE,
  assumption_type TEXT NOT NULL
    CHECK (assumption_type IN ('customer', 'market', 'product', 'revenue', 'distribution', 'technical', 'financial', 'other')),
  content TEXT NOT NULL,
  risk_level TEXT NOT NULL DEFAULT 'medium'
    CHECK (risk_level IN ('low', 'medium', 'high')),
  validation_status TEXT NOT NULL DEFAULT 'untested'
    CHECK (validation_status IN ('untested', 'testing', 'validated', 'invalidated')),
  confidence_score NUMERIC(5,2) CHECK (confidence_score BETWEEN 0 AND 100),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =========================================================
-- Reports And Sources
-- =========================================================

CREATE TABLE reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  startup_idea_id UUID REFERENCES startup_ideas(id) ON DELETE SET NULL,
  created_by UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  report_type TEXT NOT NULL
    CHECK (report_type IN ('validation', 'competitor_analysis', 'market_research', 'reddit_sentiment', 'swot', 'mvp_plan', 'revenue_model', 'investor_readiness', 'financial_projection', 'persona', 'gtm_plan', 'pitch_deck')),
  title TEXT NOT NULL,
  summary TEXT,
  status TEXT NOT NULL DEFAULT 'draft'
    CHECK (status IN ('draft', 'generating', 'ready', 'failed', 'archived')),
  score NUMERIC(5,2) CHECK (score BETWEEN 0 AND 100),
  confidence_score NUMERIC(5,2) CHECK (confidence_score BETWEEN 0 AND 100),
  current_version INTEGER NOT NULL DEFAULT 1,
  metadata JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);

CREATE TABLE report_versions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  report_id UUID NOT NULL REFERENCES reports(id) ON DELETE CASCADE,
  version_number INTEGER NOT NULL,
  content JSONB NOT NULL,
  summary TEXT,
  score NUMERIC(5,2) CHECK (score BETWEEN 0 AND 100),
  confidence_score NUMERIC(5,2) CHECK (confidence_score BETWEEN 0 AND 100),
  model_name TEXT,
  prompt_version TEXT,
  generation_job_id UUID,
  created_by UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (report_id, version_number)
);

CREATE TABLE report_sources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  report_id UUID NOT NULL REFERENCES reports(id) ON DELETE CASCADE,
  report_version_id UUID REFERENCES report_versions(id) ON DELETE CASCADE,
  source_type TEXT NOT NULL
    CHECK (source_type IN ('web', 'reddit', 'market_database', 'company_database', 'user_upload', 'internal_memory', 'other')),
  title TEXT,
  url TEXT,
  publisher TEXT,
  author TEXT,
  retrieved_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  published_at TIMESTAMPTZ,
  credibility_score NUMERIC(5,2) CHECK (credibility_score BETWEEN 0 AND 100),
  relevance_score NUMERIC(5,2) CHECK (relevance_score BETWEEN 0 AND 100),
  metadata JSONB NOT NULL DEFAULT '{}'
);

-- =========================================================
-- Competitors
-- =========================================================

CREATE TABLE competitors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  startup_idea_id UUID REFERENCES startup_ideas(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  website_url TEXT,
  competitor_type TEXT NOT NULL
    CHECK (competitor_type IN ('direct', 'indirect', 'adjacent')),
  description TEXT,
  target_customer TEXT,
  positioning TEXT,
  pricing_summary TEXT,
  feature_summary TEXT,
  funding_summary TEXT,
  similarity_score NUMERIC(5,2) CHECK (similarity_score BETWEEN 0 AND 100),
  source_confidence_score NUMERIC(5,2) CHECK (source_confidence_score BETWEEN 0 AND 100),
  metadata JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);

CREATE TABLE competitor_sources (
  competitor_id UUID NOT NULL REFERENCES competitors(id) ON DELETE CASCADE,
  report_source_id UUID NOT NULL REFERENCES report_sources(id) ON DELETE CASCADE,
  PRIMARY KEY (competitor_id, report_source_id)
);

-- =========================================================
-- Market Research
-- =========================================================

CREATE TABLE market_research (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  startup_idea_id UUID REFERENCES startup_ideas(id) ON DELETE SET NULL,
  report_id UUID REFERENCES reports(id) ON DELETE SET NULL,
  market_name TEXT NOT NULL,
  geography TEXT,
  market_summary TEXT,
  tam_value NUMERIC(18,2),
  sam_value NUMERIC(18,2),
  som_value NUMERIC(18,2),
  currency_code CHAR(3),
  sizing_methodology TEXT,
  confidence_score NUMERIC(5,2) CHECK (confidence_score BETWEEN 0 AND 100),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE market_segments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  market_research_id UUID NOT NULL REFERENCES market_research(id) ON DELETE CASCADE,
  segment_name TEXT NOT NULL,
  description TEXT,
  customer_needs TEXT,
  willingness_to_pay_signal TEXT CHECK (willingness_to_pay_signal IN ('low', 'medium', 'high', 'unknown')),
  priority INTEGER,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE market_trends (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  market_research_id UUID NOT NULL REFERENCES market_research(id) ON DELETE CASCADE,
  trend_name TEXT NOT NULL,
  description TEXT,
  impact_level TEXT NOT NULL CHECK (impact_level IN ('low', 'medium', 'high')),
  source_id UUID REFERENCES report_sources(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =========================================================
-- SWOT Analysis
-- =========================================================

CREATE TABLE swot_analysis (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  startup_idea_id UUID REFERENCES startup_ideas(id) ON DELETE SET NULL,
  report_id UUID REFERENCES reports(id) ON DELETE SET NULL,
  strategic_summary TEXT,
  confidence_score NUMERIC(5,2) CHECK (confidence_score BETWEEN 0 AND 100),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE swot_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  swot_analysis_id UUID NOT NULL REFERENCES swot_analysis(id) ON DELETE CASCADE,
  item_type TEXT NOT NULL CHECK (item_type IN ('strength', 'weakness', 'opportunity', 'threat')),
  item_text TEXT NOT NULL,
  rationale TEXT,
  recommended_action TEXT,
  priority INTEGER,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE swot_item_sources (
  swot_item_id UUID NOT NULL REFERENCES swot_items(id) ON DELETE CASCADE,
  report_source_id UUID NOT NULL REFERENCES report_sources(id) ON DELETE CASCADE,
  PRIMARY KEY (swot_item_id, report_source_id)
);

-- =========================================================
-- Personas
-- =========================================================

CREATE TABLE personas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  startup_idea_id UUID REFERENCES startup_ideas(id) ON DELETE SET NULL,
  report_id UUID REFERENCES reports(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  persona_type TEXT NOT NULL DEFAULT 'primary'
    CHECK (persona_type IN ('primary', 'secondary', 'buyer', 'user', 'influencer')),
  role_title TEXT,
  demographic_summary TEXT,
  goals TEXT,
  pain_points TEXT,
  buying_triggers TEXT,
  objections TEXT,
  preferred_channels TEXT,
  messaging_angle TEXT,
  confidence_score NUMERIC(5,2) CHECK (confidence_score BETWEEN 0 AND 100),
  metadata JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =========================================================
-- Financial Models
-- =========================================================

CREATE TABLE financial_models (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  startup_idea_id UUID REFERENCES startup_ideas(id) ON DELETE SET NULL,
  report_id UUID REFERENCES reports(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  currency_code CHAR(3) NOT NULL DEFAULT 'USD',
  scenario TEXT NOT NULL CHECK (scenario IN ('conservative', 'base', 'aggressive', 'custom')),
  starting_cash NUMERIC(18,2) NOT NULL DEFAULT 0,
  assumptions JSONB NOT NULL DEFAULT '{}',
  runway_months INTEGER,
  break_even_month INTEGER,
  confidence_score NUMERIC(5,2) CHECK (confidence_score BETWEEN 0 AND 100),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE financial_model_lines (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  financial_model_id UUID NOT NULL REFERENCES financial_models(id) ON DELETE CASCADE,
  month_number INTEGER NOT NULL CHECK (month_number >= 1),
  calendar_month DATE,
  customers INTEGER NOT NULL DEFAULT 0,
  revenue NUMERIC(18,2) NOT NULL DEFAULT 0,
  cogs NUMERIC(18,2) NOT NULL DEFAULT 0,
  gross_profit NUMERIC(18,2) NOT NULL DEFAULT 0,
  operating_expenses NUMERIC(18,2) NOT NULL DEFAULT 0,
  net_income NUMERIC(18,2) NOT NULL DEFAULT 0,
  cash_balance NUMERIC(18,2) NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (financial_model_id, month_number)
);

-- =========================================================
-- Investor Readiness
-- =========================================================

CREATE TABLE investor_readiness (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  startup_idea_id UUID REFERENCES startup_ideas(id) ON DELETE SET NULL,
  report_id UUID REFERENCES reports(id) ON DELETE SET NULL,
  overall_score NUMERIC(5,2) NOT NULL CHECK (overall_score BETWEEN 0 AND 100),
  fundraising_stage_fit TEXT NOT NULL
    CHECK (fundraising_stage_fit IN ('not_ready', 'pre_seed_ready', 'seed_ready', 'series_a_ready')),
  summary TEXT,
  confidence_score NUMERIC(5,2) CHECK (confidence_score BETWEEN 0 AND 100),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE investor_readiness_component_scores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  investor_readiness_id UUID NOT NULL REFERENCES investor_readiness(id) ON DELETE CASCADE,
  component TEXT NOT NULL,
  score NUMERIC(5,2) NOT NULL CHECK (score BETWEEN 0 AND 100),
  rationale TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (investor_readiness_id, component)
);

CREATE TABLE investor_readiness_gaps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  investor_readiness_id UUID NOT NULL REFERENCES investor_readiness(id) ON DELETE CASCADE,
  gap_text TEXT NOT NULL,
  severity TEXT NOT NULL CHECK (severity IN ('low', 'medium', 'high')),
  recommended_action TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =========================================================
-- Generated Pitch Decks
-- =========================================================

CREATE TABLE generated_pitch_decks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  startup_idea_id UUID REFERENCES startup_ideas(id) ON DELETE SET NULL,
  report_id UUID REFERENCES reports(id) ON DELETE SET NULL,
  created_by UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  title TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'draft'
    CHECK (status IN ('draft', 'generating', 'ready', 'failed', 'archived')),
  current_version INTEGER NOT NULL DEFAULT 1,
  theme TEXT,
  metadata JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);

CREATE TABLE pitch_deck_versions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  pitch_deck_id UUID NOT NULL REFERENCES generated_pitch_decks(id) ON DELETE CASCADE,
  version_number INTEGER NOT NULL,
  slides JSONB NOT NULL,
  created_by UUID REFERENCES users(id) ON DELETE SET NULL,
  model_name TEXT,
  prompt_version TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (pitch_deck_id, version_number)
);

CREATE TABLE generated_assets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  report_id UUID REFERENCES reports(id) ON DELETE SET NULL,
  pitch_deck_id UUID REFERENCES generated_pitch_decks(id) ON DELETE SET NULL,
  asset_type TEXT NOT NULL CHECK (asset_type IN ('pdf', 'pptx', 'docx', 'xlsx', 'markdown', 'image', 'other')),
  file_name TEXT NOT NULL,
  storage_bucket TEXT NOT NULL,
  storage_key TEXT NOT NULL,
  content_type TEXT NOT NULL,
  size_bytes BIGINT,
  checksum_sha256 TEXT,
  created_by UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (storage_bucket, storage_key)
);

-- =========================================================
-- AI Jobs, Audit Logs, And Version History
-- =========================================================

CREATE TABLE ai_jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  startup_idea_id UUID REFERENCES startup_ideas(id) ON DELETE SET NULL,
  requested_by UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  job_type TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'queued'
    CHECK (status IN ('queued', 'running', 'succeeded', 'failed', 'cancelled')),
  priority INTEGER NOT NULL DEFAULT 100,
  input_payload JSONB NOT NULL DEFAULT '{}',
  output_payload JSONB NOT NULL DEFAULT '{}',
  error_code TEXT,
  error_message TEXT,
  progress_percentage INTEGER NOT NULL DEFAULT 0 CHECK (progress_percentage BETWEEN 0 AND 100),
  idempotency_key TEXT,
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (organization_id, idempotency_key)
);

CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES organizations(id) ON DELETE SET NULL,
  actor_user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  resource_type TEXT NOT NULL,
  resource_id UUID,
  before_data JSONB,
  after_data JSONB,
  ip_address INET,
  user_agent TEXT,
  request_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE entity_versions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  entity_type TEXT NOT NULL,
  entity_id UUID NOT NULL,
  version_number INTEGER NOT NULL,
  snapshot JSONB NOT NULL,
  change_summary TEXT,
  changed_by UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (entity_type, entity_id, version_number)
);

-- =========================================================
-- Indexing Strategy
-- =========================================================

-- Tenant and membership lookup
CREATE INDEX idx_org_memberships_user ON organization_memberships (user_id, status);
CREATE INDEX idx_org_memberships_org_role ON organization_memberships (organization_id, role, status);

-- Project and idea access paths
CREATE INDEX idx_projects_org_status_updated ON projects (organization_id, status, updated_at DESC);
CREATE INDEX idx_projects_created_by ON projects (created_by);
CREATE INDEX idx_startup_ideas_org_project ON startup_ideas (organization_id, project_id);
CREATE INDEX idx_startup_ideas_org_status ON startup_ideas (organization_id, validation_status, updated_at DESC);
CREATE INDEX idx_startup_ideas_industry_geo ON startup_ideas (organization_id, industry, geography);
CREATE INDEX idx_startup_idea_assumptions_idea ON startup_idea_assumptions (startup_idea_id, assumption_type);

-- Reports and version history
CREATE INDEX idx_reports_org_project_type ON reports (organization_id, project_id, report_type);
CREATE INDEX idx_reports_org_status_updated ON reports (organization_id, status, updated_at DESC);
CREATE INDEX idx_report_versions_report_version ON report_versions (report_id, version_number DESC);
CREATE INDEX idx_report_sources_report ON report_sources (report_id);
CREATE INDEX idx_report_sources_url ON report_sources (url);

-- Competitor lookup
CREATE INDEX idx_competitors_org_project ON competitors (organization_id, project_id);
CREATE INDEX idx_competitors_name ON competitors (organization_id, lower(name));
CREATE INDEX idx_competitors_similarity ON competitors (organization_id, project_id, similarity_score DESC);

-- Market research
CREATE INDEX idx_market_research_project ON market_research (organization_id, project_id);
CREATE INDEX idx_market_segments_research ON market_segments (market_research_id);
CREATE INDEX idx_market_trends_research ON market_trends (market_research_id);

-- SWOT
CREATE INDEX idx_swot_analysis_project ON swot_analysis (organization_id, project_id);
CREATE INDEX idx_swot_items_analysis_type ON swot_items (swot_analysis_id, item_type);

-- Personas
CREATE INDEX idx_personas_project_type ON personas (organization_id, project_id, persona_type);

-- Financial models
CREATE INDEX idx_financial_models_project ON financial_models (organization_id, project_id, scenario);
CREATE INDEX idx_financial_model_lines_model_month ON financial_model_lines (financial_model_id, month_number);

-- Investor readiness
CREATE INDEX idx_investor_readiness_project ON investor_readiness (organization_id, project_id, created_at DESC);
CREATE INDEX idx_investor_component_scores_parent ON investor_readiness_component_scores (investor_readiness_id);
CREATE INDEX idx_investor_gaps_parent ON investor_readiness_gaps (investor_readiness_id, severity);

-- Pitch decks and assets
CREATE INDEX idx_pitch_decks_project ON generated_pitch_decks (organization_id, project_id, updated_at DESC);
CREATE INDEX idx_pitch_deck_versions_deck ON pitch_deck_versions (pitch_deck_id, version_number DESC);
CREATE INDEX idx_generated_assets_project ON generated_assets (organization_id, project_id, created_at DESC);

-- Jobs, audit, generic versions
CREATE INDEX idx_ai_jobs_org_status_priority ON ai_jobs (organization_id, status, priority, created_at);
CREATE INDEX idx_ai_jobs_project_created ON ai_jobs (project_id, created_at DESC);
CREATE INDEX idx_audit_logs_org_created ON audit_logs (organization_id, created_at DESC);
CREATE INDEX idx_audit_logs_resource ON audit_logs (resource_type, resource_id, created_at DESC);
CREATE INDEX idx_entity_versions_entity ON entity_versions (entity_type, entity_id, version_number DESC);

-- JSONB indexes for flexible metadata and AI payload filtering
CREATE INDEX idx_projects_metadata_gin ON projects USING GIN (metadata);
CREATE INDEX idx_startup_ideas_metadata_gin ON startup_ideas USING GIN (metadata);
CREATE INDEX idx_reports_metadata_gin ON reports USING GIN (metadata);
CREATE INDEX idx_ai_jobs_input_payload_gin ON ai_jobs USING GIN (input_payload);

-- =========================================================
-- Updated-At Triggers
-- =========================================================

CREATE TRIGGER trg_organizations_updated_at
BEFORE UPDATE ON organizations
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trg_users_updated_at
BEFORE UPDATE ON users
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trg_org_memberships_updated_at
BEFORE UPDATE ON organization_memberships
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trg_projects_updated_at
BEFORE UPDATE ON projects
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trg_startup_ideas_updated_at
BEFORE UPDATE ON startup_ideas
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trg_startup_idea_assumptions_updated_at
BEFORE UPDATE ON startup_idea_assumptions
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trg_reports_updated_at
BEFORE UPDATE ON reports
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trg_competitors_updated_at
BEFORE UPDATE ON competitors
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trg_market_research_updated_at
BEFORE UPDATE ON market_research
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trg_swot_analysis_updated_at
BEFORE UPDATE ON swot_analysis
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trg_personas_updated_at
BEFORE UPDATE ON personas
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trg_financial_models_updated_at
BEFORE UPDATE ON financial_models
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trg_investor_readiness_updated_at
BEFORE UPDATE ON investor_readiness
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trg_generated_pitch_decks_updated_at
BEFORE UPDATE ON generated_pitch_decks
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trg_ai_jobs_updated_at
BEFORE UPDATE ON ai_jobs
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- =========================================================
-- Optional Row-Level Security Foundation
-- =========================================================
-- Application should set:
--   SET app.current_organization_id = '<organization_uuid>';
-- Then enable and attach tenant policies table by table as needed.

ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE startup_ideas ENABLE ROW LEVEL SECURITY;
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE competitors ENABLE ROW LEVEL SECURITY;
ALTER TABLE market_research ENABLE ROW LEVEL SECURITY;
ALTER TABLE swot_analysis ENABLE ROW LEVEL SECURITY;
ALTER TABLE personas ENABLE ROW LEVEL SECURITY;
ALTER TABLE financial_models ENABLE ROW LEVEL SECURITY;
ALTER TABLE investor_readiness ENABLE ROW LEVEL SECURITY;
ALTER TABLE generated_pitch_decks ENABLE ROW LEVEL SECURITY;

CREATE POLICY tenant_isolation_projects ON projects
  USING (organization_id = current_setting('app.current_organization_id', true)::UUID);

CREATE POLICY tenant_isolation_startup_ideas ON startup_ideas
  USING (organization_id = current_setting('app.current_organization_id', true)::UUID);

CREATE POLICY tenant_isolation_reports ON reports
  USING (organization_id = current_setting('app.current_organization_id', true)::UUID);

CREATE POLICY tenant_isolation_competitors ON competitors
  USING (organization_id = current_setting('app.current_organization_id', true)::UUID);

CREATE POLICY tenant_isolation_market_research ON market_research
  USING (organization_id = current_setting('app.current_organization_id', true)::UUID);

CREATE POLICY tenant_isolation_swot_analysis ON swot_analysis
  USING (organization_id = current_setting('app.current_organization_id', true)::UUID);

CREATE POLICY tenant_isolation_personas ON personas
  USING (organization_id = current_setting('app.current_organization_id', true)::UUID);

CREATE POLICY tenant_isolation_financial_models ON financial_models
  USING (organization_id = current_setting('app.current_organization_id', true)::UUID);

CREATE POLICY tenant_isolation_investor_readiness ON investor_readiness
  USING (organization_id = current_setting('app.current_organization_id', true)::UUID);

CREATE POLICY tenant_isolation_generated_pitch_decks ON generated_pitch_decks
  USING (organization_id = current_setting('app.current_organization_id', true)::UUID);

