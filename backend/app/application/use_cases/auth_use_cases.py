from uuid import UUID

from app.application.dto import LoginRequest, SignUpRequest, TokenResponse
from app.domain.exceptions import AuthenticationError, AuthorizationError, ConflictError
from app.domain.repositories import MembershipRepository, OrganizationRepository, UserRepository
from app.infrastructure.auth.jwt_service import JwtService
from app.infrastructure.auth.password_service import PasswordService


class AuthUseCases:
    def __init__(
        self,
        users: UserRepository,
        organizations: OrganizationRepository,
        memberships: MembershipRepository,
        jwt_service: JwtService,
        password_service: PasswordService,
    ) -> None:
        self.users = users
        self.organizations = organizations
        self.memberships = memberships
        self.jwt_service = jwt_service
        self.password_service = password_service

    async def signup(self, request: SignUpRequest) -> TokenResponse:
        existing = await self.users.get_by_email(request.email)
        if existing:
            raise ConflictError("A user with this email already exists")

        password_hash = self.password_service.hash_password(request.password)
        user = await self.users.create_user(request.email, password_hash, request.full_name)
        org_name = f"{request.full_name or request.email}'s Workspace"
        slug = f"{request.email.split('@')[0]}-workspace".lower().replace(".", "-").replace("_", "-")
        organization = await self.organizations.create_organization(org_name, slug)
        membership = await self.memberships.create_owner_membership(user.id, organization.id)
        token = self.jwt_service.create_access_token(
            subject=str(user.id),
            claims={"organization_id": str(organization.id), "role": str(membership.role)},
        )
        return TokenResponse(access_token=token)

    async def login(self, request: LoginRequest) -> TokenResponse:
        user_model = await self.users.get_password_identity(request.email)
        if not user_model:
            raise AuthenticationError("Invalid credentials")

        if not self.password_service.verify_password(request.password, user_model.password_hash):
            raise AuthenticationError("Invalid credentials")

        membership = await self.memberships.get_active_membership(user_model.id, request.organization_id)
        if not membership:
            raise AuthorizationError("User is not a member of this organization")

        token = self.jwt_service.create_access_token(
            subject=str(user_model.id),
            claims={"organization_id": str(request.organization_id), "role": str(membership.role)},
        )
        return TokenResponse(access_token=token)
