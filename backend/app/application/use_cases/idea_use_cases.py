from __future__ import annotations

import re
from dataclasses import dataclass
from uuid import UUID

from app.application.dto import (
    IdeaValidationAnalysis,
    IdeaValidationRequest,
)
from app.domain.entities import Project, Report
from app.domain.exceptions import AuthorizationError
from app.domain.repositories import ProjectRepository, ReportRepository
from app.domain.services import RbacService
from app.domain.value_objects import ReportType


@dataclass(frozen=True)
class IdeaValidationResult:
    project: Project
    report: Report
    analysis: IdeaValidationAnalysis


class IdeaUseCases:
    def __init__(self, projects: ProjectRepository, reports: ReportRepository) -> None:
        self.projects = projects
        self.reports = reports

    async def validate_idea(
        self,
        organization_id: UUID,
        user_id: UUID,
        role: str,
        request: IdeaValidationRequest,
    ) -> IdeaValidationResult:
        if not RbacService.can_write(role):
            raise AuthorizationError("Insufficient permissions to validate ideas")

        project_name = (request.project_name or derive_project_name(request.idea)).strip()
        project = await self.projects.create_project(
            organization_id=organization_id,
            created_by=user_id,
            name=project_name,
            description=request.idea.strip(),
        )

        analysis = analyze_idea(request.idea)
        summary = build_summary(request.idea, analysis.summary)
        report = await self.reports.create_report(
            organization_id=organization_id,
            project_id=project.id,
            created_by=user_id,
            report_type=ReportType.VALIDATION,
            title=f"{project.name} validation",
            summary=summary,
        )

        return IdeaValidationResult(project=project, report=report, analysis=analysis)


def analyze_idea(idea: str) -> IdeaValidationAnalysis:
    normalized = idea.strip().lower()
    has_b2b = bool(re.search(r"\bbusiness|team|enterprise|company|workflow|ops\b", normalized))
    has_consumer = bool(re.search(r"\bcreator|consumer|student|parent|freelancer|founder\b", normalized))
    has_ai = bool(re.search(r"\bai|agent|copilot|assistant|automation\b", normalized))
    has_data = bool(re.search(r"\bmarket|data|analytics|sentiment|reddit|search\b", normalized))
    has_revenue = bool(re.search(r"\bsubscription|pricing|revenue|sell|pay|mrr|saas\b", normalized))

    score = min(
        96,
        38
        + (14 if has_ai else 0)
        + (12 if has_data else 0)
        + (10 if has_revenue else 0)
        + (8 if has_b2b or has_consumer else 0)
        + min(12, len(idea) // 25),
    )
    confidence = min(94, max(52, 48 + len(idea) // 24 + (8 if has_data else 0) + (6 if has_ai else 0)))

    customer = (
        "Mixed audience, likely needs sharper segmentation"
        if has_b2b and has_consumer
        else "B2B operators, founders, or teams"
        if has_b2b
        else "Consumers, creators, or early adopters"
        if has_consumer
        else "Needs a clearer customer segment"
    )

    pain = (
        "They need faster decisions and better signal extraction from noisy inputs."
        if has_data or has_ai
        else "They need a clearer, repeated pain point with an existing workaround."
    )

    alternatives = (
        "Spreadsheets, manual research, ChatGPT prompts, and generic dashboards"
        if has_ai or has_data
        else "Manual workflows, search engines, and existing point solutions"
    )

    strengths = [
        "AI-native" if has_ai else "Clear workflow",
        "Signal driven" if has_data else "Easy to explain",
        "Commercial path" if has_revenue else "Early discovery",
    ]
    risks = [
        "Validate whether users will adopt this over a manual workflow.",
        "Check whether the problem appears weekly, not just once.",
        "Test whether the idea is narrow enough to build a first version quickly.",
    ]
    next_steps = [
        "Interview 5 target users and capture the exact language they use to describe the pain.",
        "List the current workaround and quantify the time or money it burns today.",
        "Define one measurable outcome for a first prototype and test it with a landing page or demo.",
    ]

    summary = (
        f"This idea looks {'promising' if score >= 70 else 'early-stage' if score >= 55 else 'too broad'} "
        "for a first pass. It will need sharper customer definition and a very specific problem statement."
    )
    return IdeaValidationAnalysis(
        score=score,
        confidence=confidence,
        summary=summary,
        customer=customer,
        pain=pain,
        alternatives=alternatives,
        strengths=strengths,
        risks=risks,
        next_steps=next_steps,
    )


def build_summary(idea: str, analysis_summary: str) -> str:
    return f"Idea: {idea.strip()}\n\nAssessment: {analysis_summary}"


def derive_project_name(idea: str) -> str:
    text = idea.strip()
    if not text:
        return "Idea Validation"
    words = re.findall(r"[A-Za-z0-9]+", text)
    if not words:
        return "Idea Validation"
    return " ".join(words[:4]).strip().title()
