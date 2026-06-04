# AI Startup Copilot: Milestone Roadmap

## Build Principle

Do not build the full system at once. Build the smallest reliable production slice first, then add AI depth, data sources, evaluations, and deployment maturity in controlled increments.

Each milestone should end with a usable product increment, tests, and acceptance criteria.

## Milestone 0: Product And Engineering Foundation

### Objective

Create the working foundation for a real team: repository conventions, local development, environment configuration, auth basics, and health checks.

### Deliverables

- FastAPI backend skeleton.
- Next.js frontend skeleton.
- Docker Compose for local Postgres and Redis.
- Shared environment config.
- Health endpoint.
- Basic authentication structure.
- Initial architecture docs.

### Folder Structure

```text
backend/
  app/
    api/v1/health.py
    api/v1/auth.py
    core/config.py
    infrastructure/db/
    infrastructure/auth/
  tests/

frontend/
  src/
    app/login/
    app/dashboard/
    components/
    lib/api/
    store/
```

### APIs

```http
GET /api/v1/health
POST /api/v1/auth/signup
POST /api/v1/auth/login
```

### Database Changes

- `users`
- `organizations`
- `organization_members`
- Initial Alembic setup.

### Tests

- Backend health test.
- Auth signup/login tests.
- Frontend build/typecheck.
- Docker Compose boot test.

### Acceptance Criteria

- Developer can run backend, frontend, Postgres, and Redis locally.
- User can sign up and log in.
- Frontend redirects unauthenticated users to login.
- Health endpoint returns `200`.

## Milestone 1: Project Workspace MVP

### Objective

Allow users to create and manage startup ideas as projects. This becomes the core workspace for all future AI workflows.

### Deliverables

- Project CRUD.
- Dashboard showing project count and recent projects.
- Project detail page.
- Basic report placeholder.
- Tenant isolation by organization.

### Folder Structure

```text
backend/
  app/
    api/v1/projects.py
    application/use_cases/project_use_cases.py
    domain/entities.py
    infrastructure/db/repositories.py

frontend/
  src/
    app/projects/
    app/projects/[projectId]/
    features/projects/
    components/app/
```

### APIs

```http
GET /api/v1/projects
POST /api/v1/projects
GET /api/v1/projects/{project_id}
PATCH /api/v1/projects/{project_id}
DELETE /api/v1/projects/{project_id}
```

### Database Changes

- `projects`
- Add organization/user ownership fields.
- Add indexes on `organization_id`, `created_at`.

### Tests

- Project CRUD API tests.
- Tenant isolation tests.
- Frontend project form tests if test framework exists.
- Typecheck and production build.

### Acceptance Criteria

- User can create, edit, view, and delete projects.
- Users cannot access projects from another organization.
- Dashboard reflects project data.
- Empty states are clear and usable.

## Milestone 2: Structured Idea Analysis

### Objective

Turn a raw startup idea into a structured brief with assumptions, target customers, risks, and research keywords.

### Deliverables

- Idea analysis workflow.
- Structured output schema.
- Saved analysis results.
- Human-editable assumptions.
- First LangGraph or workflow-service node.

### Folder Structure

```text
backend/
  app/
    api/v1/idea_analysis.py
    application/use_cases/idea_analysis_use_cases.py
    domain/ai_entities.py
    infrastructure/ai/
      model_client.py
      prompts/

frontend/
  src/
    app/idea-analysis/
    features/ideas/
```

### APIs

```http
POST /api/v1/projects/{project_id}/idea-analysis
GET /api/v1/projects/{project_id}/idea-analysis/latest
PATCH /api/v1/projects/{project_id}/assumptions/{assumption_id}
```

### Database Changes

- `idea_analyses`
- `project_assumptions`
- `agent_runs`

### Tests

- Schema validation tests.
- Prompt output parser tests.
- API tests for creating and retrieving analysis.
- Regression fixture for one sample idea.

### Acceptance Criteria

- User submits an idea and receives a structured brief.
- Output validates against schema.
- Assumptions are clearly labeled, editable, and persisted.
- No market facts or competitors are invented in this milestone.

## Milestone 3: Reports MVP

### Objective

Generate a simple but useful startup validation report from the project and structured idea analysis.

### Deliverables

- Report generation endpoint.
- Report list and report detail page.
- Report sections: summary, assumptions, risks, next steps.
- Export-ready report data model.
- Basic quality gate for schema and unsupported claims.

### Folder Structure

```text
backend/
  app/
    api/v1/reports.py
    application/use_cases/report_use_cases.py
    infrastructure/ai/report_generator.py

frontend/
  src/
    app/reports/
    app/reports/[reportId]/
    features/reports/
```

### APIs

```http
GET /api/v1/projects/{project_id}/reports
POST /api/v1/projects/{project_id}/reports
GET /api/v1/reports/{report_id}
```

### Database Changes

- `reports`
- `report_sections`
- `report_generation_runs`

### Tests

- Report creation API tests.
- Report schema tests.
- Quality gate tests.
- Frontend build/typecheck.

### Acceptance Criteria

- User can generate and view a report.
- Report is based only on known project data and labeled assumptions.
- Report sections are persisted.
- Failed generation does not create partial final reports.

## Milestone 4: RAG Ingestion Foundation

### Objective

Build the ingestion and indexing foundation before adding many data sources. Start with blogs and startup news because they are easiest to validate.

### Deliverables

- Source document model.
- News/blog ingestion jobs.
- Normalization, deduplication, and chunking.
- Embedding pipeline.
- Pinecone indexing.
- Retrieval trace storage.

### Folder Structure

```text
backend/
  app/
    api/v1/ingestion.py
    application/use_cases/ingestion_use_cases.py
    infrastructure/connectors/
      news.py
      blogs.py
    infrastructure/chunking/
    infrastructure/embeddings/
    infrastructure/vectorstores/
    workers/ingestion_jobs.py
```

### APIs

```http
POST /api/v1/ingestion/jobs
GET /api/v1/ingestion/jobs/{job_id}
POST /api/v1/retrieval/query
```

### Database Changes

- `source_documents`
- `source_chunks`
- `ingestion_jobs`
- `retrieval_traces`

### Tests

- Connector fixture tests.
- Chunking tests.
- Deduplication tests.
- Pinecone client contract tests with mocked client.
- Retrieval filter tests.

### Acceptance Criteria

- News/blog documents can be ingested and chunked.
- Chunks are embedded and indexed.
- Retrieval returns source chunks with metadata.
- Ingestion jobs are idempotent.

## Milestone 5: Competitor And Market Research

### Objective

Use RAG and external sources to produce cited competitor and market research for each project.

### Deliverables

- Competitor analysis agent.
- Market research agent.
- Citation-aware outputs.
- Source-backed competitor table.
- Market research workspace.
- Research quality gate.

### Folder Structure

```text
backend/
  app/
    api/v1/research.py
    application/use_cases/research_use_cases.py
    infrastructure/agents/
      competitor_agent.py
      market_agent.py
    infrastructure/citations/

frontend/
  src/
    app/competitor-analysis/
    app/market-research/
    features/competitors/
    features/market/
```

### APIs

```http
POST /api/v1/projects/{project_id}/competitor-analysis
GET /api/v1/projects/{project_id}/competitor-analysis/latest
POST /api/v1/projects/{project_id}/market-research
GET /api/v1/projects/{project_id}/market-research/latest
```

### Database Changes

- `competitor_analyses`
- `competitors`
- `market_research_reports`
- `citations`

### Tests

- Citation validation tests.
- Competitor schema tests.
- Market research schema tests.
- Fake-company prevention fixtures.
- Retrieval trace tests.

### Acceptance Criteria

- Competitors include citations.
- Market claims include citations or are labeled assumptions.
- Unsupported claims are blocked by quality gate.
- User can view competitor and market outputs in the frontend.

## Milestone 6: Reddit Sentiment And Product Hunt Signals

### Objective

Add user sentiment and launch-signal data sources to make research more founder-useful.

### Deliverables

- Reddit connector.
- Product Hunt connector.
- Sentiment classifier.
- Topic clustering.
- PII redaction.
- Sentiment analysis page/module.

### Folder Structure

```text
backend/
  app/
    infrastructure/connectors/
      reddit.py
      product_hunt.py
    infrastructure/safety/
      pii.py
      prompt_injection.py
    infrastructure/agents/
      sentiment_agent.py

frontend/
  src/
    features/sentiment/
```

### APIs

```http
POST /api/v1/projects/{project_id}/sentiment-analysis
GET /api/v1/projects/{project_id}/sentiment-analysis/latest
```

### Database Changes

- `sentiment_analyses`
- `sentiment_topics`
- Add source metadata fields for Reddit/Product Hunt.

### Tests

- PII redaction tests.
- Sentiment label fixture tests.
- Reddit connector mocked API tests.
- Product Hunt connector mocked API tests.
- Prompt-injection filtering tests.

### Acceptance Criteria

- Reddit usernames and sensitive data are not exposed.
- Sentiment summaries cite representative source chunks.
- Product Hunt launches can be retrieved as competitor/product signals.
- Anecdotal sentiment is not framed as statistical proof.

## Milestone 7: Financial Projection Engine

### Objective

Add deterministic financial projections with editable assumptions and AI-written explanations.

### Deliverables

- Financial calculation engine.
- Scenario generation: conservative, base, aggressive.
- Editable assumptions.
- Break-even and runway calculations.
- Human approval checkpoint before final report use.

### Folder Structure

```text
backend/
  app/
    api/v1/financials.py
    domain/financial_entities.py
    application/use_cases/financial_use_cases.py
    infrastructure/financials/calculation_engine.py

frontend/
  src/
    features/financials/
```

### APIs

```http
POST /api/v1/projects/{project_id}/financial-projections
GET /api/v1/projects/{project_id}/financial-projections/latest
PATCH /api/v1/financial-projections/{projection_id}/assumptions
POST /api/v1/financial-projections/{projection_id}/approve
```

### Database Changes

- `financial_projections`
- `financial_scenarios`
- `financial_assumptions`
- `human_approvals`

### Tests

- Formula unit tests.
- Scenario consistency tests.
- Outlier assumption tests.
- Approval workflow tests.

### Acceptance Criteria

- Calculations are deterministic and tested.
- AI cannot invent historical traction.
- User can edit and approve assumptions.
- Final report only uses approved or clearly labeled financial assumptions.

## Milestone 8: Evaluation And Reliability Layer

### Objective

Make quality measurable before scaling usage. Add automated evals, judge scoring, and human review.

### Deliverables

- Evaluation runner.
- Benchmark datasets.
- LLM-as-a-Judge rubrics.
- Human review queue.
- Reliability dashboard data model.
- Release gates for critical AI failures.

### Folder Structure

```text
backend/
  app/
    api/v1/evaluations.py
    api/v1/reviews.py
    application/use_cases/evaluation_run_use_cases.py
    infrastructure/evaluation/
      runner.py
      deterministic_checks.py
      llm_judges.py
      rubrics.py

evals/
  datasets/
    competitor_accuracy/
    market_analysis/
    financial_projection/
    sentiment/
    recommendations/
```

### APIs

```http
POST /api/v1/evaluations/runs
GET /api/v1/evaluations/runs/{run_id}
GET /api/v1/reviews/queue
POST /api/v1/reviews/{review_id}/complete
```

### Database Changes

- `evaluation_runs`
- `evaluation_cases`
- `evaluation_results`
- `human_reviews`

### Tests

- Deterministic evaluator tests.
- Judge output schema tests.
- Benchmark fixture tests.
- Human review workflow tests.

### Acceptance Criteria

- Critical eval failures block release.
- Fabricated citations are detected.
- Financial formula regressions are detected.
- Human corrections are stored and can become future benchmark cases.

## Milestone 9: Production Deployment

### Objective

Deploy the product on AWS with secure CI/CD, monitoring, alerting, and cost controls.

### Deliverables

- ECR repositories.
- EKS cluster.
- RDS PostgreSQL.
- ElastiCache Redis.
- S3 report/source artifact buckets.
- Secrets Manager integration.
- GitHub Actions deployment pipeline.
- Helm chart.
- Monitoring dashboards and alerts.

### Folder Structure

```text
infra/
  terraform/
    modules/
    envs/
      dev/
      staging/
      prod/
  helm/
    startup-copilot/

.github/
  workflows/
    pr-checks.yml
    deploy-staging.yml
    deploy-production.yml
```

### APIs

No new product APIs required. Add operational endpoints if needed:

```http
GET /api/v1/health
GET /api/v1/ready
```

### Database Changes

- No product schema changes.
- Add migration discipline and backup process.

### Tests

- CI tests.
- Docker image build tests.
- Helm template tests.
- Staging smoke tests.
- Production readiness checks.

### Acceptance Criteria

- Staging deploys automatically from `main`.
- Production deploy requires approval.
- Rollback path is tested.
- Secrets are not stored in GitHub or images.
- Alerts fire for API errors, worker backlog, DB pressure, and AI cost spikes.

## Milestone 10: Scale, Governance, And Enterprise Readiness

### Objective

Harden the platform for real customers, larger workloads, and team operations.

### Deliverables

- Role-based access control.
- Audit logs.
- Usage limits and billing-ready metering.
- Cost dashboards.
- Advanced report export.
- Source review workflow.
- SLOs and incident runbooks.

### Folder Structure

```text
backend/
  app/
    api/v1/audit.py
    api/v1/usage.py
    domain/billing_entities.py
    infrastructure/metering/

frontend/
  src/
    app/settings/
    features/admin/
    features/usage/
```

### APIs

```http
GET /api/v1/audit/events
GET /api/v1/usage/current
GET /api/v1/usage/costs
PATCH /api/v1/organizations/{organization_id}/members/{user_id}/role
```

### Database Changes

- `audit_events`
- `usage_events`
- `organization_limits`
- Add user roles/permissions.

### Tests

- RBAC permission tests.
- Audit log tests.
- Usage metering tests.
- Cost limit tests.

### Acceptance Criteria

- Admins can manage roles.
- Important actions are audited.
- Organizations have usage limits.
- Cost and reliability metrics are visible.
- System has runbooks for common incidents.

## Recommended Team Execution Order

1. Milestone 0: Foundation
2. Milestone 1: Project Workspace MVP
3. Milestone 2: Structured Idea Analysis
4. Milestone 3: Reports MVP
5. Milestone 4: RAG Ingestion Foundation
6. Milestone 5: Competitor And Market Research
7. Milestone 6: Reddit Sentiment And Product Hunt Signals
8. Milestone 7: Financial Projection Engine
9. Milestone 8: Evaluation And Reliability Layer
10. Milestone 9: Production Deployment
11. Milestone 10: Scale, Governance, And Enterprise Readiness

## Startup-Team Rule

Each milestone should ship only after:

- The product slice works end to end.
- Data model changes are migrated.
- API contracts are tested.
- Frontend builds cleanly.
- Backend tests pass.
- Acceptance criteria are reviewed.
- Known risks are written down.

