from fastapi import APIRouter

from app.api.v1 import auth, health, ideas, organizations, projects, reports

api_router = APIRouter()
api_router.include_router(health.router)
api_router.include_router(auth.router)
api_router.include_router(ideas.router)
api_router.include_router(organizations.router)
api_router.include_router(projects.router)
api_router.include_router(reports.router)
