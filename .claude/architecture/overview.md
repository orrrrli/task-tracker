# Architecture Overview

## Stack

### Backend (`TaskTrackerAPI/`)
- **Core Framework:** .NET 9, ASP.NET Core Web API (`TargetFramework` pinned in `Directory.Build.props`)
- **Routing:** Carter 9.0 (module-based, replaces controller classes)
- **Database:** PostgreSQL (via Npgsql)
- **ORM:** Entity Framework Core 9
- **CQRS / Mediator:** MediatR 12
- **Object Mapping:** Mapster 10
- **Validation:** FluentValidation 12
- **Auth:** JWT bearer (`Microsoft.AspNetCore.Authentication.JwtBearer` 9) + BCrypt hashing; task endpoints public (guest mode), JWT optional
- **Error Handling:** ErrorOr 2 (functional Result type)
- **Rate Limiting:** ASP.NET Core built-in `FixedWindowRateLimiter` (60 req/min per IP)

### Frontend (`TaskTrackerApp/`)
- **Framework:** React 19 + TypeScript
- **Build:** Vite
- **Data Fetching:** TanStack Query v5 (cache, loading/error states, background refetch)
- **Validation:** Zod (runtime schema validation)
- **API Client:** openapi-ts (generates types + fetch client from OpenAPI spec)
- **Styling:** CSS Modules (co-located per component)
- **Pattern:** Atomic Design — `atoms/`, `molecules/`, `organisms/`

#### Atomic Design Structure
```
src/
├── atoms/          # Button, Input, Badge, Icon — indivisible UI units
├── molecules/       # TaskCard, FilterBar, SearchInput — composed atoms
├── organisms/       # TaskList, TaskForm, Header — composed molecules
├── hooks/          # useTasks, useAuth — TanStack Query wrappers
├── api/            # Generated OpenAPI client
└── pages/          # Route-level components
```

## Pattern
Clean Architecture with CQRS on the backend:
- Commands and queries flow API → Application → Domain / Infrastructure
- Domain has zero dependencies on outer layers
- Infrastructure implements interfaces defined in Application

## Directory Structure
```
/
├── TaskTrackerAPI/          # .NET 9 REST API
│   ├── Domain/              # Entities (TaskItem, User), enums — no dependencies
│   ├── Application/         # CQRS handlers, validators, pipeline behaviors, interfaces; entity→Result Mapster configs
│   ├── Infrastructure/      # EF Core AppDbContext, TaskRepository, migrations, Security (JWT + BCrypt)
│   ├── API/                 # Carter modules, ApiResults, LoggingHelper, GlobalExceptionHandler; Result→Response Mapster configs
│   └── Contracts/           # Public request/response DTOs (Auth + Tasks) — see DTO boundary-mapping rule in engineering/standards.md
├── TaskTrackerApp/          # Frontend web app (responsive)
├── CLAUDE.md                # Dallio house conventions (source of truth — migrated to .claude/)
└── AGENTS.md                # Same as CLAUDE.md (multi-agent duplicate)
```

## Middleware Pipeline (API)
`UseForwardedHeaders` → `UseHttpRequestLogging` → `UseSecurityHeaders` → `UseCors` → `UseHttpsRedirection` → `UseRateLimiter` → `UseExceptionHandler` → `UseAuthentication` → `UseAuthorization` → `MapCarter` → `MapHealthCheck`

## Deployment
- **Target:** Personal VPS
- **Orchestration:** Docker Compose — API container + frontend container + PostgreSQL container
- **CI/CD:** GitHub Actions — build, test, push images, deploy to VPS on merge to main
- **Health check:** `GET /health` returns `{ "status": "Healthy" }` (anonymous)
