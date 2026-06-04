from dataclasses import dataclass
from uuid import UUID


@dataclass(frozen=True)
class Principal:
    user_id: UUID
    organization_id: UUID
    role: str

    def require_role(self, allowed_roles: set[str]) -> None:
        from app.domain.exceptions import AuthorizationError

        if self.role not in allowed_roles:
            raise AuthorizationError("Insufficient permissions")

