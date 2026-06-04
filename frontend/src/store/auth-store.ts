"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

type AuthState = {
  accessToken: string | null;
  activeOrganizationId: string | null;
  setSession: (accessToken: string, activeOrganizationId?: string | null) => void;
  setActiveOrganizationId: (organizationId: string) => void;
  logout: () => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      accessToken: null,
      activeOrganizationId: null,
      setSession: (accessToken, activeOrganizationId = null) =>
        set({ accessToken, activeOrganizationId }),
      setActiveOrganizationId: (organizationId) => set({ activeOrganizationId: organizationId }),
      logout: () => set({ accessToken: null, activeOrganizationId: null })
    }),
    { name: "ai-startup-copilot-auth" }
  )
);

