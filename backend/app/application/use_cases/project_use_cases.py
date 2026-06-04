from uuid import UUID

from app.application.dto import ProjectCreate
from app.core.pagination import Page
from app.domain.entities import Project
from app.domain.exceptions import AuthorizationError, NotFoundError
from app.domain.repositories import ProjectRepository
from app.domain.services import RbacService


class ProjectUseCases:
    def __init__(self, projects: ProjectRepository) -> None:
        self.projects = projects

    async def list_projects(
        self,
        organization_id: UUID,
        limit: int,
        offset: int,
    ) -> Page[Project]:
        items, total = await self.projects.list_projects(organization_id, limit, offset)
        return Page[Project](items=items, total=total, limit=limit, offset=offset)

    async def get_project(self, organization_id: UUID, project_id: UUID) -> Project:
        project = await self.projects.get_project(organization_id, project_id)
        if not project:
            raise NotFoundError("Project not found")
        return project

    async def create_project(
        self,
        organization_id: UUID,
        user_id: UUID,
        role: str,
        request: ProjectCreate,
    ) -> Project:
        if not RbacService.can_write(role):
            raise AuthorizationError("Insufficient permissions to create projects")
        return await self.projects.create_project(
            organization_id=organization_id,
            created_by=user_id,
            name=request.name,
            description=request.description,
        )

