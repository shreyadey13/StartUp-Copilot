# AI Startup Copilot Backend

Production-grade FastAPI backend using Clean Architecture and Domain Driven Design.

## Run Locally

```bash
cd backend
cp .env.example .env
docker compose up --build
```

API docs:

- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`
- Health: `http://localhost:8000/api/v1/health`

## Architecture

- `domain`: enterprise entities, repository ports, domain services, exceptions.
- `application`: use cases and DTOs.
- `infrastructure`: SQLAlchemy, Redis, JWT, password hashing, logging.
- `api`: FastAPI routers, dependencies, exception handlers.
- `core`: configuration, dependency container, shared utilities.

