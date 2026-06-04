# AI Startup Copilot Frontend Architecture

## 1. Folder Structure

```text
frontend/
  .env.example
  Dockerfile
  README.md
  components.json
  next-env.d.ts
  next.config.ts
  package.json
  postcss.config.mjs
  tailwind.config.ts
  tsconfig.json
  src/
    app/
      globals.css
      layout.tsx
      page.tsx
      login/
        page.tsx
      dashboard/
        page.tsx
      projects/
        page.tsx
      idea-analysis/
        page.tsx
      competitor-analysis/
        page.tsx
      market-research/
        page.tsx
      reports/
        page.tsx
      settings/
        page.tsx
    components/
      app/
        app-header.tsx
        app-shell.tsx
        metric-card.tsx
        sidebar.tsx
      auth/
        login-form.tsx
      providers/
        app-providers.tsx
        react-query-provider.tsx
        theme-provider.tsx
      ui/
        avatar.tsx
        badge.tsx
        button.tsx
        card.tsx
        input.tsx
        label.tsx
        progress.tsx
        select.tsx
        separator.tsx
        tabs.tsx
        textarea.tsx
    config/
      navigation.ts
    features/
      analytics/
        analytics-panel.tsx
      competitors/
        competitor-table.tsx
      ideas/
        idea-validation-workspace.tsx
      market/
        market-research-workspace.tsx
      projects/
        project-list.tsx
      reports/
        report-list.tsx
      settings/
        settings-form.tsx
    lib/
      api/
        client.ts
        endpoints.ts
        hooks.ts
        types.ts
      auth.ts
      cn.ts
      constants.ts
      format.ts
    store/
      auth-store.ts
      ui-store.ts
```

## 2. Component Hierarchy

```text
RootLayout
  AppProviders
    ThemeProvider
    ReactQueryProvider
    AppShell
      Sidebar
      AppHeader
      Page Content
        DashboardPage
          MetricCard
          AnalyticsPanel
        ProjectsPage
          ProjectList
        IdeaAnalysisPage
          IdeaValidationWorkspace
        CompetitorAnalysisPage
          CompetitorTable
        MarketResearchPage
          MarketResearchWorkspace
        ReportsPage
          ReportList
        SettingsPage
          SettingsForm
```

Design rules:

- Application pages use a dense SaaS layout, not a landing page pattern.
- Navigation is persistent on desktop and collapsible on mobile.
- Page sections are unframed layouts; cards are used only for individual data modules.
- Interactive controls use shadcn-style primitives.
- Dark mode is class-based and persisted through `next-themes`.

## 3. State Management Design

### Server State

React Query owns all remote data:

- Organizations
- Projects
- Reports
- Auth mutations
- Future AI job status streams
- Future analytics queries

Query keys are centralized in `src/lib/api/hooks.ts`.

### Client State

Zustand owns lightweight client-only state:

- Auth token and active organization context
- Sidebar collapsed state
- Command/menu state
- Local UI preferences

Auth token is persisted with Zustand middleware. Sensitive production deployments should prefer secure HTTP-only cookies; this scaffold uses bearer tokens to align with the generated FastAPI backend.

### Form State

Local React state is used for small forms. For larger production forms, add `react-hook-form` plus `zod` schemas.

## 4. API Integration Layer

```text
components/features -> React Query hooks -> apiClient -> FastAPI backend
```

API responsibilities:

- Attach JWT bearer token.
- Use `NEXT_PUBLIC_API_BASE_URL`.
- Parse JSON error envelopes from FastAPI.
- Expose typed endpoint functions.
- Keep React Query hooks thin and predictable.

Primary endpoints:

- `POST /auth/login`
- `POST /auth/signup`
- `GET /organizations`
- `GET /projects`
- `POST /projects`
- `GET /projects/{projectId}/reports`
- `POST /projects/{projectId}/reports`

