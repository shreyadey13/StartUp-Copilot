from dataclasses import dataclass

from redis.asyncio import Redis
from sqlalchemy.ext.asyncio import AsyncSession

from app.application.use_cases.auth_use_cases import AuthUseCases
from app.application.use_cases.idea_use_cases import IdeaUseCases
from app.application.use_cases.organization_use_cases import OrganizationUseCases
from app.application.use_cases.project_use_cases import ProjectUseCases
from app.application.use_cases.report_use_cases import ReportUseCases
from app.infrastructure.auth.jwt_service import JwtService
from app.infrastructure.auth.password_service import PasswordService
from app.infrastructure.db.repositories import (
    SqlAlchemyMembershipRepository,
    SqlAlchemyOrganizationRepository,
    SqlAlchemyProjectRepository,
    SqlAlchemyReportRepository,
    SqlAlchemyUserRepository,
)


@dataclass
class RequestContainer:
    session: AsyncSession
    redis: Redis
    jwt_service: JwtService
    password_service: PasswordService

    def auth_use_cases(self) -> AuthUseCases:
        return AuthUseCases(
            users=SqlAlchemyUserRepository(self.session),
            organizations=SqlAlchemyOrganizationRepository(self.session),
            memberships=SqlAlchemyMembershipRepository(self.session),
            jwt_service=self.jwt_service,
            password_service=self.password_service,
        )

    def organization_use_cases(self) -> OrganizationUseCases:
        return OrganizationUseCases(organizations=SqlAlchemyOrganizationRepository(self.session))

    def project_use_cases(self) -> ProjectUseCases:
        return ProjectUseCases(projects=SqlAlchemyProjectRepository(self.session))

    def report_use_cases(self) -> ReportUseCases:
        return ReportUseCases(reports=SqlAlchemyReportRepository(self.session))

    def idea_use_cases(self) -> IdeaUseCases:
        return IdeaUseCases(
            projects=SqlAlchemyProjectRepository(self.session),
            reports=SqlAlchemyReportRepository(self.session),
        )
