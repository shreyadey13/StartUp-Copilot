from collections.abc import AsyncGenerator
from uuid import UUID

from fastapi import Depends
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from redis.asyncio import Redis
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import Settings, get_settings
from app.core.container import RequestContainer
from app.core.security import Principal
from app.domain.exceptions import AuthenticationError
from app.infrastructure.auth.jwt_service import JwtService
from app.infrastructure.auth.password_service import PasswordService
from app.infrastructure.db.session import get_session
from app.infrastructure.redis.client import get_redis

bearer_scheme = HTTPBearer(auto_error=False)


def get_jwt_service(settings: Settings = Depends(get_settings)) -> JwtService:
    return JwtService(
        secret_key=settings.jwt_secret_key,
        algorithm=settings.jwt_algorithm,
        access_token_expire_minutes=settings.access_token_expire_minutes,
    )


def get_password_service() -> PasswordService:
    return PasswordService()


async def get_container(
    session: AsyncSession = Depends(get_session),
    redis: Redis = Depends(get_redis),
    jwt_service: JwtService = Depends(get_jwt_service),
    password_service: PasswordService = Depends(get_password_service),
) -> AsyncGenerator[RequestContainer, None]:
    yield RequestContainer(
        session=session,
        redis=redis,
        jwt_service=jwt_service,
        password_service=password_service,
    )


async def get_current_principal(
    credentials: HTTPAuthorizationCredentials | None = Depends(bearer_scheme),
    jwt_service: JwtService = Depends(get_jwt_service),
) -> Principal:
    if not credentials:
        raise AuthenticationError("Missing bearer token")

    payload = jwt_service.decode_token(credentials.credentials)
    subject = payload.get("sub")
    organization_id = payload.get("organization_id")
    role = payload.get("role")

    if not subject or not organization_id or not role:
        raise AuthenticationError("Token is missing required claims")

    return Principal(
        user_id=UUID(subject),
        organization_id=UUID(organization_id),
        role=role,
    )

