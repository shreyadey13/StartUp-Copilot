from uuid import UUID

from sqlalchemy import Select, func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.domain.entities import Membership, Organization, PasswordIdentity, Project, Report, User
from app.domain.repositories import (
    MembershipRepository,
    OrganizationRepository,
    ProjectRepository,
    ReportRepository,
    UserRepository,
)
from app.domain.value_objects import ProjectStatus, ReportStatus, ReportType, Role
from app.infrastructure.db.models import (
    OrganizationMembershipModel,
    OrganizationModel,
    ProjectModel,
    ReportModel,
    UserModel,
)


def _project_entity(model: ProjectModel) -> Project:
    return Project(
        id=model.id,
        organization_id=model.organization_id,
        created_by=model.created_by,
        name=model.name,
        description=model.description,
        status=ProjectStatus(model.status),
        created_at=model.created_at,
        updated_at=model.updated_at,
    )


def _organization_entity(model: OrganizationModel) -> Organization:
    return Organization(
        id=model.id,
        name=model.name,
        slug=model.slug,
        plan_code=model.plan_code,
        status=model.status,
        created_at=model.created_at,
    )


def _report_entity(model: ReportModel) -> Report:
    return Report(
        id=model.id,
        organization_id=model.organization_id,
        project_id=model.project_id,
        created_by=model.created_by,
        report_type=ReportType(model.report_type),
        title=model.title,
        summary=model.summary,
        status=ReportStatus(model.status),
        score=float(model.score) if model.score is not None else None,
        confidence_score=float(model.confidence_score) if model.confidence_score is not None else None,
        created_at=model.created_at,
        updated_at=model.updated_at,
    )


async def _count(session: AsyncSession, statement: Select[tuple]) -> int:
    count_stmt = select(func.count()).select_from(statement.subquery())
    result = await session.execute(count_stmt)
    return int(result.scalar_one())


class SqlAlchemyUserRepository(UserRepository):
    def __init__(self, session: AsyncSession) -> None:
        self.session = session

    async def get_by_email(self, email: str) -> User | None:
        result = await self.session.execute(select(UserModel).where(UserModel.email == email))
        model = result.scalar_one_or_none()
        if not model:
            return None
        return User(
            id=model.id,
            email=model.email,
            full_name=model.full_name,
            status=model.status,
            created_at=model.created_at,
        )

    async def get_by_id(self, user_id: UUID) -> User | None:
        model = await self.session.get(UserModel, user_id)
        if not model:
            return None
        return User(
            id=model.id,
            email=model.email,
            full_name=model.full_name,
            status=model.status,
            created_at=model.created_at,
        )

    async def get_password_identity(self, email: str) -> PasswordIdentity | None:
        result = await self.session.execute(select(UserModel).where(UserModel.email == email))
        model = result.scalar_one_or_none()
        if not model or not model.password_hash:
            return None
        return PasswordIdentity(
            id=model.id,
            email=model.email,
            password_hash=model.password_hash,
            status=model.status,
        )

    async def create_user(self, email: str, password_hash: str, full_name: str | None) -> User:
        model = UserModel(
            email=email,
            password_hash=password_hash,
            full_name=full_name,
            auth_provider="email",
            auth_subject=email,
        )
        self.session.add(model)
        await self.session.commit()
        await self.session.refresh(model)
        return User(
            id=model.id,
            email=model.email,
            full_name=model.full_name,
            status=model.status,
            created_at=model.created_at,
        )


class SqlAlchemyMembershipRepository(MembershipRepository):
    def __init__(self, session: AsyncSession) -> None:
        self.session = session

    async def get_active_membership(self, user_id: UUID, organization_id: UUID) -> Membership | None:
        result = await self.session.execute(
            select(OrganizationMembershipModel).where(
                OrganizationMembershipModel.user_id == user_id,
                OrganizationMembershipModel.organization_id == organization_id,
                OrganizationMembershipModel.status == "active",
            )
        )
        model = result.scalar_one_or_none()
        if not model:
            return None
        return Membership(
            id=model.id,
            organization_id=model.organization_id,
            user_id=model.user_id,
            role=Role(model.role),
            status=model.status,
        )

    async def create_owner_membership(self, user_id: UUID, organization_id: UUID) -> Membership:
        model = OrganizationMembershipModel(
            user_id=user_id,
            organization_id=organization_id,
            role=Role.OWNER.value,
            status="active",
        )
        self.session.add(model)
        await self.session.commit()
        await self.session.refresh(model)
        return Membership(
            id=model.id,
            organization_id=model.organization_id,
            user_id=model.user_id,
            role=Role(model.role),
            status=model.status,
        )


class SqlAlchemyOrganizationRepository(OrganizationRepository):
    def __init__(self, session: AsyncSession) -> None:
        self.session = session

    async def list_for_user(self, user_id: UUID) -> list[Organization]:
        result = await self.session.execute(
            select(OrganizationModel)
            .join(
                OrganizationMembershipModel,
                OrganizationMembershipModel.organization_id == OrganizationModel.id,
            )
            .where(
                OrganizationMembershipModel.user_id == user_id,
                OrganizationMembershipModel.status == "active",
                OrganizationModel.status == "active",
            )
            .order_by(OrganizationModel.created_at.desc())
        )
        return [_organization_entity(model) for model in result.scalars().all()]

    async def create_organization(self, name: str, slug: str) -> Organization:
        candidate = slug
        suffix = 1
        while True:
            existing = await self.session.execute(
                select(OrganizationModel).where(OrganizationModel.slug == candidate)
            )
            if not existing.scalar_one_or_none():
                break
            suffix += 1
            candidate = f"{slug}-{suffix}"

        model = OrganizationModel(name=name, slug=candidate)
        self.session.add(model)
        await self.session.commit()
        await self.session.refresh(model)
        return _organization_entity(model)


class SqlAlchemyProjectRepository(ProjectRepository):
    def __init__(self, session: AsyncSession) -> None:
        self.session = session

    async def list_projects(self, organization_id: UUID, limit: int, offset: int) -> tuple[list[Project], int]:
        stmt = (
            select(ProjectModel)
            .where(ProjectModel.organization_id == organization_id, ProjectModel.status != "deleted")
            .order_by(ProjectModel.updated_at.desc())
        )
        total = await _count(self.session, stmt)
        result = await self.session.execute(stmt.limit(limit).offset(offset))
        return [_project_entity(model) for model in result.scalars().all()], total

    async def get_project(self, organization_id: UUID, project_id: UUID) -> Project | None:
        result = await self.session.execute(
            select(ProjectModel).where(
                ProjectModel.id == project_id,
                ProjectModel.organization_id == organization_id,
                ProjectModel.status != "deleted",
            )
        )
        model = result.scalar_one_or_none()
        return _project_entity(model) if model else None

    async def create_project(
        self,
        organization_id: UUID,
        created_by: UUID,
        name: str,
        description: str | None,
    ) -> Project:
        model = ProjectModel(
            organization_id=organization_id,
            created_by=created_by,
            name=name,
            description=description,
            status=ProjectStatus.ACTIVE.value,
        )
        self.session.add(model)
        await self.session.commit()
        await self.session.refresh(model)
        return _project_entity(model)


class SqlAlchemyReportRepository(ReportRepository):
    def __init__(self, session: AsyncSession) -> None:
        self.session = session

    async def list_reports(
        self,
        organization_id: UUID,
        project_id: UUID,
        limit: int,
        offset: int,
    ) -> tuple[list[Report], int]:
        stmt = (
            select(ReportModel)
            .where(
                ReportModel.organization_id == organization_id,
                ReportModel.project_id == project_id,
                ReportModel.status != "archived",
            )
            .order_by(ReportModel.updated_at.desc())
        )
        total = await _count(self.session, stmt)
        result = await self.session.execute(stmt.limit(limit).offset(offset))
        return [_report_entity(model) for model in result.scalars().all()], total

    async def create_report(
        self,
        organization_id: UUID,
        project_id: UUID,
        created_by: UUID,
        report_type: ReportType,
        title: str,
        summary: str | None,
    ) -> Report:
        model = ReportModel(
            organization_id=organization_id,
            project_id=project_id,
            created_by=created_by,
            report_type=report_type.value,
            title=title,
            summary=summary,
            status=ReportStatus.DRAFT.value,
        )
        self.session.add(model)
        await self.session.commit()
        await self.session.refresh(model)
        return _report_entity(model)
