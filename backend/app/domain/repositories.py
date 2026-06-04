from abc import ABC, abstractmethod
from uuid import UUID

from app.domain.entities import Membership, Organization, PasswordIdentity, Project, Report, User
from app.domain.value_objects import ReportType


class UserRepository(ABC):
    @abstractmethod
    async def get_by_email(self, email: str) -> User | None: ...

    @abstractmethod
    async def get_by_id(self, user_id: UUID) -> User | None: ...

    @abstractmethod
    async def get_password_identity(self, email: str) -> PasswordIdentity | None: ...

    @abstractmethod
    async def create_user(self, email: str, password_hash: str, full_name: str | None) -> User: ...


class OrganizationRepository(ABC):
    @abstractmethod
    async def list_for_user(self, user_id: UUID) -> list[Organization]: ...

    @abstractmethod
    async def create_organization(self, name: str, slug: str) -> Organization: ...


class MembershipRepository(ABC):
    @abstractmethod
    async def get_active_membership(self, user_id: UUID, organization_id: UUID) -> Membership | None: ...

    @abstractmethod
    async def create_owner_membership(self, user_id: UUID, organization_id: UUID) -> Membership: ...


class ProjectRepository(ABC):
    @abstractmethod
    async def list_projects(self, organization_id: UUID, limit: int, offset: int) -> tuple[list[Project], int]: ...

    @abstractmethod
    async def get_project(self, organization_id: UUID, project_id: UUID) -> Project | None: ...

    @abstractmethod
    async def create_project(
        self,
        organization_id: UUID,
        created_by: UUID,
        name: str,
        description: str | None,
    ) -> Project: ...


class ReportRepository(ABC):
    @abstractmethod
    async def list_reports(
        self,
        organization_id: UUID,
        project_id: UUID,
        limit: int,
        offset: int,
    ) -> tuple[list[Report], int]: ...

    @abstractmethod
    async def create_report(
        self,
        organization_id: UUID,
        project_id: UUID,
        created_by: UUID,
        report_type: ReportType,
        title: str,
        summary: str | None,
    ) -> Report: ...
