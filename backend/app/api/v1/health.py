from fastapi import APIRouter, Depends
from redis.asyncio import Redis
from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncSession

from app.infrastructure.db.session import get_session
from app.infrastructure.redis.client import get_redis

router = APIRouter(tags=["health"])


@router.get("/health")
async def health_check() -> dict[str, str]:
    return {"status": "ok"}


@router.get("/health/deep")
async def deep_health_check(
    session: AsyncSession = Depends(get_session),
    redis: Redis = Depends(get_redis),
) -> dict[str, str]:
    await session.execute(text("SELECT 1"))
    await redis.ping()
    return {"status": "ok", "postgres": "ok", "redis": "ok"}

