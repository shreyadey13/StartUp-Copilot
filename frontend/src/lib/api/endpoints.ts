import { apiClient } from "@/lib/api/client";
import type {
  CreateProjectRequest,
  CreateReportRequest,
  LoginRequest,
  Organization,
  Page,
  Project,
  Report,
  SignupRequest,
  TokenResponse
} from "@/lib/api/types";

export const authApi = {
  login: (payload: LoginRequest) =>
    apiClient<TokenResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify(payload),
      auth: false
    }),
  signup: (payload: SignupRequest) =>
    apiClient<TokenResponse>("/auth/signup", {
      method: "POST",
      body: JSON.stringify(payload),
      auth: false
    })
};

export const organizationApi = {
  list: () => apiClient<Organization[]>("/organizations")
};

export const projectApi = {
  list: () => apiClient<Page<Project>>("/projects"),
  create: (payload: CreateProjectRequest) =>
    apiClient<Project>("/projects", { method: "POST", body: JSON.stringify(payload) })
};

export const reportApi = {
  list: (projectId: string) => apiClient<Page<Report>>(`/projects/${projectId}/reports`),
  create: (projectId: string, payload: CreateReportRequest) =>
    apiClient<Report>(`/projects/${projectId}/reports`, {
      method: "POST",
      body: JSON.stringify(payload)
    })
};

