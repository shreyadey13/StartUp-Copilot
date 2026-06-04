from uuid import UUID

from app.application.dto import ReportCreate
from app.core.pagination import Page
from app.domain.entities import Report
from app.domain.exceptions import AuthorizationError
from app.domain.repositories import ReportRepository
from app.domain.services import RbacService


class ReportUseCases:
    def __init__(self, reports: ReportRepository) -> None:
        self.reports = reports

    async def list_reports(
        self,
        organization_id: UUID,
        project_id: UUID,
        limit: int,
        offset: int,
    ) -> Page[Report]:
        items, total = await self.reports.list_reports(organization_id, project_id, limit, offset)
        return Page[Report](items=items, total=total, limit=limit, offset=offset)

    async def create_report(
        self,
        organization_id: UUID,
        project_id: UUID,
        user_id: UUID,
        role: str,
        request: ReportCreate,
    ) -> Report:
        if not RbacService.can_write(role):
            raise AuthorizationError("Insufficient permissions to create reports")
        return await self.reports.create_report(
            organization_id=organization_id,
            project_id=project_id,
            created_by=user_id,
            report_type=request.report_type,
            title=request.title,
            summary=request.summary,
        )

