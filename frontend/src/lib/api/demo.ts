import type {
  CreateProjectRequest,
  Organization,
  Page,
  Project,
  TokenResponse
} from "@/lib/api/types";

const ORGANIZATION_ID = "8f5d3dbf-2ab8-4fb5-9c6a-4b65b1e62f31";
const USER_ID = "d1d7b5d8-5e1a-4d55-93b7-24ce4d06f447";
const PROJECTS_KEY = "ai-startup-copilot-demo-projects";

const seedProjects: Project[] = [
  {
    id: "2d7611d6-7d04-4d11-9726-b72603ad4110",
    organization_id: ORGANIZATION_ID,
    created_by: USER_ID,
    name: "AI hiring analyst",
    description: "A copilot that screens hiring signals and summarizes candidate-market fit.",
    status: "active",
    created_at: "2026-06-01T08:30:00.000Z",
    updated_at: "2026-06-04T08:30:00.000Z"
  },
  {
    id: "4fd89594-23ac-4ff4-9ad3-9f1f0a520b24",
    organization_id: ORGANIZATION_ID,
    created_by: USER_ID,
    name: "Founder signal map",
    description: "Market validation from public communities, competitor moves, and search intent.",
    status: "draft",
    created_at: "2026-06-02T10:15:00.000Z",
    updated_at: "2026-06-04T10:15:00.000Z"
  }
];

export function createDemoToken(): TokenResponse {
  const payload = {
    sub: USER_ID,
    organization_id: ORGANIZATION_ID,
    role: "owner",
    exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 14
  };

  return {
    access_token: `${encodeBase64Url({ alg: "none", typ: "JWT" })}.${encodeBase64Url(payload)}.demo`,
    token_type: "bearer"
  };
}

export function listDemoOrganizations(): Organization[] {
  return [
    {
      id: ORGANIZATION_ID,
      name: "Founder Workspace",
      slug: "founder-workspace",
      plan_code: "demo",
      status: "active",
      created_at: "2026-06-01T08:00:00.000Z"
    }
  ];
}

export function listDemoProjects(): Page<Project> {
  const items = readProjects();
  return {
    items,
    total: items.length,
    limit: 50,
    offset: 0
  };
}

export function createDemoProject(payload: CreateProjectRequest): Project {
  const now = new Date().toISOString();
  const project: Project = {
    id: createId(),
    organization_id: ORGANIZATION_ID,
    created_by: USER_ID,
    name: payload.name,
    description: payload.description || null,
    status: "draft",
    created_at: now,
    updated_at: now
  };
  const projects = [project, ...readProjects()];
  window.localStorage.setItem(PROJECTS_KEY, JSON.stringify(projects));
  return project;
}

function readProjects(): Project[] {
  if (typeof window === "undefined") {
    return seedProjects;
  }

  const stored = window.localStorage.getItem(PROJECTS_KEY);
  if (!stored) {
    window.localStorage.setItem(PROJECTS_KEY, JSON.stringify(seedProjects));
    return seedProjects;
  }

  try {
    return JSON.parse(stored) as Project[];
  } catch {
    window.localStorage.setItem(PROJECTS_KEY, JSON.stringify(seedProjects));
    return seedProjects;
  }
}

function createId() {
  return globalThis.crypto?.randomUUID?.() ?? `demo-${Date.now()}`;
}

function encodeBase64Url(value: Record<string, unknown>) {
  return btoa(JSON.stringify(value)).replaceAll("+", "-").replaceAll("/", "_").replaceAll("=", "");
}
