# Architecture Overview

## Stack

### Backend (`TaskTrackerAPI/`)
- **Core Framework:** .NET 10, ASP.NET Core Web API
- **Routing:** Carter 9.0 (module-based, replaces controller classes)
- **Database:** PostgreSQL (via Npgsql)
- **ORM:** Entity Framework Core 9
- **CQRS / Mediator:** MediatR 14
- **Object Mapping:** Mapster 10
- **Validation:** FluentValidation 12
- **Error Handling:** ErrorOr 2 (functional Result type)
- **Rate Limiting:** ASP.NET Core built-in `FixedWindowRateLimiter` (60 req/min per IP)

### Frontend (`TaskTrackerApp/`)
- Responsive web app (implementation in progress)
- Consumes the REST API

## Pattern
Clean Architecture with CQRS on the backend:
- Commands and queries flow API → Application → Domain / Infrastructure
- Domain has zero dependencies on outer layers
- Infrastructure implements interfaces defined in Application

## Directory Structure
```
/
├── TaskTrackerAPI/          # .NET 10 REST API
│   ├── Domain/              # Entities (TaskItem, User), enums — no dependencies
│   ├── Application/         # CQRS handlers, validators, pipeline behaviors, interfaces
│   ├── Infrastructure/      # EF Core AppDbContext, TaskRepository, migrations
│   ├── API/                 # Carter modules, ApiResults, LoggingHelper, GlobalExceptionHandler
│   └── Contracts/           # Public request/response DTOs (Auth + Tasks)
├── TaskTrackerApp/          # Frontend web app (responsive)
├── CLAUDE.md                # Dallio house conventions (source of truth — migrated to .claude/)
└── AGENTS.md                # Same as CLAUDE.md (multi-agent duplicate)
```

## Middleware Pipeline (API)
`UseSecurityHeaders` → `UseCors` → `UseHttpsRedirection` → `UseRateLimiter` → `UseExceptionHandler` → `MapCarter` → `MapHealthCheck`

## Deployment
- **Target:** Personal VPS
- **Orchestration:** Docker Compose — API container + frontend container + PostgreSQL container
- **CI/CD:** GitHub Actions — build, test, push images, deploy to VPS on merge to main
- **Health check:** `GET /health` returns `{ "status": "Healthy" }` (anonymous)
