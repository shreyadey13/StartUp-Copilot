from fastapi import FastAPI, Request
from fastapi.responses import ORJSONResponse
from pydantic import ValidationError
from starlette.exceptions import HTTPException as StarletteHTTPException

from app.domain.exceptions import DomainError


def register_exception_handlers(app: FastAPI) -> None:
    @app.exception_handler(DomainError)
    async def domain_error_handler(_: Request, exc: DomainError) -> ORJSONResponse:
        return ORJSONResponse(
            status_code=exc.status_code,
            content={"error": {"code": exc.code, "message": exc.message}},
        )

    @app.exception_handler(StarletteHTTPException)
    async def http_error_handler(_: Request, exc: StarletteHTTPException) -> ORJSONResponse:
        return ORJSONResponse(
            status_code=exc.status_code,
            content={"error": {"code": "http_error", "message": exc.detail}},
        )

    @app.exception_handler(ValidationError)
    async def validation_error_handler(_: Request, exc: ValidationError) -> ORJSONResponse:
        return ORJSONResponse(
            status_code=422,
            content={"error": {"code": "validation_error", "message": exc.errors()}},
        )

    @app.exception_handler(Exception)
    async def unhandled_error_handler(_: Request, exc: Exception) -> ORJSONResponse:
        return ORJSONResponse(
            status_code=500,
            content={"error": {"code": "internal_server_error", "message": "Unexpected error"}},
        )

