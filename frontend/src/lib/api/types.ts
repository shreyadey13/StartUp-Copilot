export type TokenResponse = {
  access_token: string;
  token_type: "bearer";
};

export type LoginRequest = {
  email: string;
  password: string;
  organization_id: string;
};

export type SignupRequest = {
  email: string;
  password: string;
  full_name?: string;
};

export type Organization = {
  id: string;
  name: string;
  slug: string;
  plan_code: string;
  status: string;
  created_at: string;
};

export type Project = {
  id: string;
  organization_id: string;
  created_by: string;
  name: string;
  description: string | null;
  status: "draft" | "active" | "archived" | "deleted";
  created_at: string;
  updated_at: string;
};

export type Report = {
  id: string;
  organization_id: string;
  project_id: string;
  created_by: string;
  report_type: string;
  title: string;
  summary: string | null;
  status: string;
  score: number | null;
  confidence_score: number | null;
  created_at: string;
  updated_at: string;
};

export type Page<T> = {
  items: T[];
  total: number;
  limit: number;
  offset: number;
};

export type CreateProjectRequest = {
  name: string;
  description?: string;
};

export type CreateReportRequest = {
  report_type: string;
  title: string;
  summary?: string;
};

export type IdeaValidationRequest = {
  idea: string;
  project_name?: string;
};

export type IdeaValidationAnalysis = {
  score: number;
  confidence: number;
  breakdown: Record<string, number>;
  summary: string;
  customer: string;
  pain: string;
  alternatives: string;
  strengths: string[];
  risks: string[];
  next_steps: string[];
};

export type IdeaValidationResponse = {
  project: Project;
  report: Report;
  analysis: IdeaValidationAnalysis;
};

export type IdeaValidationHistoryEntry = {
  id: string;
  idea: string;
  projectName: string;
  reportTitle: string;
  score: number;
  confidence: number;
  breakdown: Record<string, number>;
  createdAt: string;
  customer: string;
  summary: string;
  reportSummary: string;
  reportType: string;
};
