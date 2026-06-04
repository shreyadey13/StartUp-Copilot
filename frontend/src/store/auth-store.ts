"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

import { decodeJwtPayload } from "@/lib/auth";

type AuthState = {
  accessToken: string | null;
  activeOrganizationId: string | null;
  hasHydrated: boolean;
  setSession: (accessToken: string, activeOrganizationId?: string | null) => void;
  setActiveOrganizationId: (organizationId: string | null) => void;
  setHasHydrated: (hasHydrated: boolean) => void;
  logout: () => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      accessToken: null,
      activeOrganizationId: null,
      hasHydrated: false,
      setSession: (accessToken, activeOrganizationId = null) =>
        set({
          accessToken,
          activeOrganizationId:
            activeOrganizationId ?? getOrganizationIdFromToken(accessToken)
        }),
      setActiveOrganizationId: (organizationId) => set({ activeOrganizationId: organizationId }),
      setHasHydrated: (hasHydrated) => set({ hasHydrated }),
      logout: () => set({ accessToken: null, activeOrganizationId: null })
    }),
    {
      name: "ai-startup-copilot-auth",
      partialize: (state) => ({
        accessToken: state.accessToken,
        activeOrganizationId: state.activeOrganizationId
      }),
      onRehydrateStorage: () => (state) => {
        const activeOrganizationId =
          state?.activeOrganizationId ?? getOrganizationIdFromToken(state?.accessToken ?? null);
        state?.setActiveOrganizationId(activeOrganizationId);
        state?.setHasHydrated(true);
      }
    }
  )
);

function getOrganizationIdFromToken(token: string | null) {
  if (!token) {
    return null;
  }

  const payload = decodeJwtPayload(token);
  return typeof payload?.organization_id === "string" ? payload.organization_id : null;
}
