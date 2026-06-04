from fastapi import APIRouter, Depends, status

from app.api.deps import get_container
from app.application.dto import LoginRequest, SignUpRequest, TokenResponse
from app.core.container import RequestContainer

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/signup", response_model=TokenResponse, status_code=status.HTTP_201_CREATED)
async def signup(
    request: SignUpRequest,
    container: RequestContainer = Depends(get_container),
) -> TokenResponse:
    return await container.auth_use_cases().signup(request)


@router.post("/login", response_model=TokenResponse)
async def login(
    request: LoginRequest,
    container: RequestContainer = Depends(get_container),
) -> TokenResponse:
    return await container.auth_use_cases().login(request)

