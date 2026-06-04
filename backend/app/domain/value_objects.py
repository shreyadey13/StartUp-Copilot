from enum import StrEnum


class Role(StrEnum):
    OWNER = "owner"
    ADMIN = "admin"
    EDITOR = "editor"
    VIEWER = "viewer"


class ProjectStatus(StrEnum):
    DRAFT = "draft"
    ACTIVE = "active"
    ARCHIVED = "archived"
    DELETED = "deleted"


class ReportStatus(StrEnum):
    DRAFT = "draft"
    GENERATING = "generating"
    READY = "ready"
    FAILED = "failed"
    ARCHIVED = "archived"


class ReportType(StrEnum):
    VALIDATION = "validation"
    COMPETITOR_ANALYSIS = "competitor_analysis"
    MARKET_RESEARCH = "market_research"
    REDDIT_SENTIMENT = "reddit_sentiment"
    SWOT = "swot"
    MVP_PLAN = "mvp_plan"
    REVENUE_MODEL = "revenue_model"
    INVESTOR_READINESS = "investor_readiness"
    FINANCIAL_PROJECTION = "financial_projection"
    PERSONA = "persona"
    GTM_PLAN = "gtm_plan"
    PITCH_DECK = "pitch_deck"

