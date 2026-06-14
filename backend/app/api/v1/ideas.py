from fastapi import APIRouter, Depends, status

from app.api.deps import get_container, get_current_principal
from app.application.dto import (
    IdeaValidationAnalysis,
    IdeaValidationRequest,
    IdeaValidationResponse,
    ProjectRead,
    ReportRead,
)
from app.core.container import RequestContainer
from app.core.security import Principal

router = APIRouter(prefix="/ideas", tags=["ideas"])


@router.post("/validate", response_model=IdeaValidationResponse, status_code=status.HTTP_201_CREATED)
async def validate_idea(
    request: IdeaValidationRequest,
    principal: Principal = Depends(get_current_principal),
    container: RequestContainer = Depends(get_container),
) -> IdeaValidationResponse:
    result = await container.idea_use_cases().validate_idea(
        organization_id=principal.organization_id,
        user_id=principal.user_id,
        role=principal.role,
        request=request,
    )
    return IdeaValidationResponse(
        project=ProjectRead.model_validate(result.project),
        report=ReportRead.model_validate(result.report),
        analysis=IdeaValidationAnalysis.model_validate(result.analysis),
    )
