from dataclasses import dataclass
from datetime import datetime
from uuid import UUID

from app.domain.value_objects import ProjectStatus, ReportStatus, ReportType, Role


@dataclass(frozen=True)
class Organization:
    id: UUID
    name: str
    slug: str
    plan_code: str
    status: str
    created_at: datetime


@dataclass(frozen=True)
class User:
    id: UUID
    email: str
    full_name: str | None
    status: str
    created_at: datetime


@dataclass(frozen=True)
class PasswordIdentity:
    id: UUID
    email: str
    password_hash: str
    status: str


@dataclass(frozen=True)
class Membership:
    id: UUID
    organization_id: UUID
    user_id: UUID
    role: Role
    status: str


@dataclass(frozen=True)
class Project:
    id: UUID
    organization_id: UUID
    created_by: UUID
    name: str
    description: str | None
    status: ProjectStatus
    created_at: datetime
    updated_at: datetime


@dataclass(frozen=True)
class Report:
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
