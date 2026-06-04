"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { authApi, organizationApi, projectApi, reportApi } from "@/lib/api/endpoints";
import type { CreateProjectRequest, CreateReportRequest, LoginRequest, SignupRequest } from "@/lib/api/types";
import { useAuthStore } from "@/store/auth-store";

export const queryKeys = {
  organizations: ["organizations"] as const,
  projects: ["projects"] as const,
  reports: (projectId: string) => ["reports", projectId] as const
};

export function useLoginMutation() {
  const setSession = useAuthStore((state) => state.setSession);
  return useMutation({
    mutationFn: (payload: LoginRequest) => authApi.login(payload),
    onSuccess: (data, variables) => setSession(data.access_token, variables.organization_id)
  });
}

export function useSignupMutation() {
  const setSession = useAuthStore((state) => state.setSession);
  return useMutation({
    mutationFn: (payload: SignupRequest) => authApi.signup(payload),
    onSuccess: (data) => setSession(data.access_token)
  });
}

export function useOrganizationsQuery() {
  return useQuery({
    queryKey: queryKeys.organizations,
    queryFn: organizationApi.list
  });
}

export function useProjectsQuery() {
  return useQuery({
    queryKey: queryKeys.projects,
    queryFn: projectApi.list
  });
}

export function useCreateProjectMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateProjectRequest) => projectApi.create(payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.projects })
  });
}

export function useReportsQuery(projectId: string | null) {
  return useQuery({
    queryKey: projectId ? queryKeys.reports(projectId) : ["reports", "disabled"],
    queryFn: () => reportApi.list(projectId as string),
    enabled: Boolean(projectId)
  });
}

export function useCreateReportMutation(projectId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateReportRequest) => reportApi.create(projectId, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.reports(projectId) })
  });
}

