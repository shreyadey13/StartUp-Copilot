class DomainError(Exception):
    status_code = 400
    code = "domain_error"

    def __init__(self, message: str = "Domain error") -> None:
        self.message = message
        super().__init__(message)


class NotFoundError(DomainError):
    status_code = 404
    code = "not_found"


class AuthenticationError(DomainError):
    status_code = 401
    code = "authentication_error"


class AuthorizationError(DomainError):
    status_code = 403
    code = "authorization_error"


class ConflictError(DomainError):
    status_code = 409
    code = "conflict"

