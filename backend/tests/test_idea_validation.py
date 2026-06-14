from datetime import datetime, timezone
from uuid import UUID

from httpx import AsyncClient

from app.application.dto import IdeaValidationRequest
from app.application.use_cases.idea_use_cases import IdeaUseCases
from app.core.security import Principal
from app.domain.entities import Project, Report
from app.domain.value_objects import ProjectStatus, ReportStatus, ReportType


class FakeProjectRepository:
    def __init__(self) -> None:
        self.created = []

    async def create_project(self, organization_id, created_by, name, description):
        project = Project(
            id=UUID("11111111-1111-1111-1111-111111111111"),
            organization_id=organization_id,
            created_by=created_by,
            name=name,
            description=description,
            status=ProjectStatus.ACTIVE,
            created_at=datetime.now(timezone.utc),
            updated_at=datetime.now(timezone.utc),
        )
        self.created.append(project)
        return project


class FakeReportRepository:
    def __init__(self) -> None:
        self.created = []

    async def create_report(self, organization_id, project_id, created_by, report_type, title, summary):
        report = Report(
            id=UUID("22222222-2222-2222-2222-222222222222"),
            organization_id=organization_id,
            project_id=project_id,
            created_by=created_by,
            report_type=ReportType.VALIDATION,
            title=title,
            summary=summary,
            status=ReportStatus.DRAFT,
            score=74.0,
            confidence_score=81.0,
            created_at=datetime.now(timezone.utc),
            updated_at=datetime.now(timezone.utc),
        )
        self.created.append(report)
        return report


class FakeContainer:
    def __init__(self) -> None:
        self.projects = FakeProjectRepository()
        self.reports = FakeReportRepository()

    def idea_use_cases(self) -> IdeaUseCases:
        return IdeaUseCases(projects=self.projects, reports=self.reports)


async def test_validate_idea_creates_project_and_report(client: AsyncClient) -> None:
    principal = Principal(
        user_id=UUID("aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa"),
        organization_id=UUID("bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb"),
        role="owner",
    )
    container = FakeContainer()

    app = client._transport.app
    app.dependency_overrides.clear()
    from app.api.deps import get_container, get_current_principal

    app.dependency_overrides[get_current_principal] = lambda: principal
    app.dependency_overrides[get_container] = lambda: container

    response = await client.post(
        "/api/v1/ideas/validate",
        json=IdeaValidationRequest(
            idea="A B2B AI copilot that turns product feedback into roadmap priorities.",
            project_name="Feedback Copilot",
        ).model_dump(),
    )

    assert response.status_code == 201
    payload = response.json()
    assert payload["project"]["name"] == "Feedback Copilot"
    assert payload["report"]["report_type"] == "validation"
    assert payload["analysis"]["score"] >= 40
