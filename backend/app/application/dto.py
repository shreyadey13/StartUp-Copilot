from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, ConfigDict, EmailStr, Field

from app.domain.value_objects import ProjectStatus, ReportStatus, ReportType


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"


class SignUpRequest(BaseModel):
    email: EmailStr
    password: str = Field(min_length=8, max_length=128)
    full_name: str | None = Field(default=None, max_length=255)


class LoginRequest(BaseModel):
    email: EmailStr
    password: str
    organization_id: UUID


class OrganizationRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    name: str
    slug: str
    plan_code: str
    status: str
    created_at: datetime


class ProjectCreate(BaseModel):
    name: str = Field(min_length=1, max_length=255)
    description: str | None = None


class ProjectRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    organization_id: UUID
    created_by: UUID
    name: str
    description: str | None
    status: ProjectStatus
    created_at: datetime
    updated_at: datetime


class ReportCreate(BaseModel):
    report_type: ReportType
    title: str = Field(min_length=1, max_length=255)
    summary: str | None = None


class ReportRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    organization_id: UUID
    project_id: UUID
    created_by: UUID
    report_type: ReportType
    title: str
    summary: str | None
    status: ReportStatus
    score: float | None
    confidence_score: float | None
    created_at: datetime
    updated_at: datetime


class IdeaValidationRequest(BaseModel):
    idea: str = Field(min_length=10, max_length=4000)
    project_name: str | None = Field(default=None, max_length=255)


class IdeaValidationAnalysis(BaseModel):
    score: int
    confidence: int
    breakdown: dict[str, int]
    summary: str
    customer: str
    pain: str
    alternatives: str
    strengths: list[str]
    risks: list[str]
    next_steps: list[str]


class IdeaValidationResponse(BaseModel):
    project: ProjectRead
    report: ReportRead
    analysis: IdeaValidationAnalysis
