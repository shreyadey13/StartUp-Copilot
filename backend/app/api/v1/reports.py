from uuid import UUID

from fastapi import APIRouter, Depends, Query, status

from app.api.deps import get_container, get_current_principal
from app.application.dto import ReportCreate, ReportRead
from app.core.container import RequestContainer
from app.core.pagination import Page
from app.core.security import Principal

router = APIRouter(prefix="/projects/{project_id}/reports", tags=["reports"])


@router.get("", response_model=Page[ReportRead])
async def list_reports(
    project_id: UUID,
    limit: int = Query(default=50, ge=1, le=100),
    offset: int = Query(default=0, ge=0),
    principal: Principal = Depends(get_current_principal),
    container: RequestContainer = Depends(get_container),
) -> Page[ReportRead]:
    page = await container.report_use_cases().list_reports(
        organization_id=principal.organization_id,
        project_id=project_id,
        limit=limit,
        offset=offset,
    )
    return Page[ReportRead](
        items=[ReportRead.model_validate(item) for item in page.items],
        total=page.total,
        limit=page.limit,
        offset=page.offset,
    )


@router.post("", response_model=ReportRead, status_code=status.HTTP_201_CREATED)
async def create_report(
    project_id: UUID,
    request: ReportCreate,
    principal: Principal = Depends(get_current_principal),
    container: RequestContainer = Depends(get_container),
) -> ReportRead:
    report = await container.report_use_cases().create_report(
        organization_id=principal.organization_id,
        project_id=project_id,
        user_id=principal.user_id,
        role=principal.role,
        request=request,
    )
    return ReportRead.model_validate(report)

