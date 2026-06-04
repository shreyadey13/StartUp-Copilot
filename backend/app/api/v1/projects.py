from uuid import UUID

from fastapi import APIRouter, Depends, Query, status

from app.api.deps import get_container, get_current_principal
from app.application.dto import ProjectCreate, ProjectRead
from app.core.container import RequestContainer
from app.core.pagination import Page
from app.core.security import Principal

router = APIRouter(prefix="/projects", tags=["projects"])


@router.get("", response_model=Page[ProjectRead])
async def list_projects(
    limit: int = Query(default=50, ge=1, le=100),
    offset: int = Query(default=0, ge=0),
    principal: Principal = Depends(get_current_principal),
    container: RequestContainer = Depends(get_container),
) -> Page[ProjectRead]:
    page = await container.project_use_cases().list_projects(
        organization_id=principal.organization_id,
        limit=limit,
        offset=offset,
    )
    return Page[ProjectRead](
        items=[ProjectRead.model_validate(item) for item in page.items],
        total=page.total,
        limit=page.limit,
        offset=page.offset,
    )


@router.post("", response_model=ProjectRead, status_code=status.HTTP_201_CREATED)
async def create_project(
    request: ProjectCreate,
    principal: Principal = Depends(get_current_principal),
    container: RequestContainer = Depends(get_container),
) -> ProjectRead:
    project = await container.project_use_cases().create_project(
        organization_id=principal.organization_id,
        user_id=principal.user_id,
        role=principal.role,
        request=request,
    )
    return ProjectRead.model_validate(project)


@router.get("/{project_id}", response_model=ProjectRead)
async def get_project(
    project_id: UUID,
    principal: Principal = Depends(get_current_principal),
    container: RequestContainer = Depends(get_container),
) -> ProjectRead:
    project = await container.project_use_cases().get_project(
        organization_id=principal.organization_id,
        project_id=project_id,
    )
    return ProjectRead.model_validate(project)

