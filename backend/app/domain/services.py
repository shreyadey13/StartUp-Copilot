from app.domain.value_objects import Role


class RbacService:
    WRITE_ROLES = {Role.OWNER, Role.ADMIN, Role.EDITOR}
    ADMIN_ROLES = {Role.OWNER, Role.ADMIN}

    @staticmethod
    def can_write(role: str) -> bool:
        return role in RbacService.WRITE_ROLES

    @staticmethod
    def can_admin(role: str) -> bool:
        return role in RbacService.ADMIN_ROLES

