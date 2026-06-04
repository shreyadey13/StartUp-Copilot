from uuid import UUID

from app.domain.entities import Organization
from app.domain.repositories import OrganizationRepository


class OrganizationUseCases:
    def __init__(self, organizations: OrganizationRepository) -> None:
        self.organizations = organizations

    async def list_organizations(self, user_id: UUID) -> list[Organization]:
        return await self.organizations.list_for_user(user_id)
