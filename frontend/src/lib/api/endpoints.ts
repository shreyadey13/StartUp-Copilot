import { ApiError, apiClient } from "@/lib/api/client";
import {
  createDemoProject,
  createDemoToken,
  listDemoOrganizations,
  listDemoProjects
} from "@/lib/api/demo";
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
    }).catch(withDemoToken),
  signup: (payload: SignupRequest) =>
    apiClient<TokenResponse>("/auth/signup", {
      method: "POST",
      body: JSON.stringify(payload),
      auth: false
    }).catch(withDemoToken)
};

export const organizationApi = {
  list: () => apiClient<Organization[]>("/organizations").catch((error) => {
    if (isNetworkError(error)) {
      return listDemoOrganizations();
    }
    throw error;
  })
};

export const projectApi = {
  list: () => apiClient<Page<Project>>("/projects").catch((error) => {
    if (isNetworkError(error)) {
      return listDemoProjects();
    }
    throw error;
  }),
  create: (payload: CreateProjectRequest) =>
    apiClient<Project>("/projects", { method: "POST", body: JSON.stringify(payload) }).catch((error) => {
      if (isNetworkError(error)) {
        return createDemoProject(payload);
      }
      throw error;
    })
};

export const reportApi = {
  list: (projectId: string) => apiClient<Page<Report>>(`/projects/${projectId}/reports`),
  create: (projectId: string, payload: CreateReportRequest) =>
    apiClient<Report>(`/projects/${projectId}/reports`, {
      method: "POST",
      body: JSON.stringify(payload)
    })
};

function withDemoToken(error: unknown) {
  if (isNetworkError(error)) {
    return createDemoToken();
  }

  throw error;
}

function isNetworkError(error: unknown) {
  return error instanceof ApiError && error.code === "network_error";
}
