from fastapi import APIRouter, Depends

from app.api.deps import get_container, get_current_principal
from app.application.dto import OrganizationRead
from app.core.container import RequestContainer
from app.core.security import Principal

router = APIRouter(prefix="/organizations", tags=["organizations"])


@router.get("", response_model=list[OrganizationRead])
async def list_organizations(
    principal: Principal = Depends(get_current_principal),
    container: RequestContainer = Depends(get_container),
) -> list[OrganizationRead]:
    organizations = await container.organization_use_cases().list_organizations(principal.user_id)
    return [OrganizationRead.model_validate(organization) for organization in organizations]

