# Task Tracker

A full-stack task management application built with **.NET 9** and **React 19**. Demonstrates REST API design, Clean Architecture, CQRS, and a responsive frontend — all deployed via Docker Compose to a personal VPS.

**Live:** [tasks.orlando.codes](https://tasks.orlando.codes)

---

## Stack

| Layer | Technology |
|---|---|
| **API** | .NET 9 · ASP.NET Core · Carter (module-based routing) |
| **CQRS** | MediatR 12 |
| **Database** | PostgreSQL · Entity Framework Core 9 |
| **Validation** | FluentValidation 12 |
| **Mapping** | Mapster 10 |
| **Auth** | JWT Bearer · BCrypt |
| **Error handling** | ErrorOr 2 (functional Result type) |
| **Rate limiting** | ASP.NET Core built-in (60 req/min per IP) |
| **Frontend** | React 19 · TypeScript · Vite |
| **Data fetching** | TanStack Query v5 |
| **Styling** | CSS Modules (Atomic Design) |
| **Testing** | xUnit · FluentAssertions · NSubstitute · Vitest · React Testing Library |
| **CI/CD** | GitHub Actions → Docker → VPS |

---

## Architecture

Clean Architecture with CQRS on the backend. Dependency flow is strictly inward — Domain has zero external dependencies.

```
TaskTrackerAPI/
├── Domain/          # Entities (TaskItem, User), enums — no dependencies
├── Application/     # CQRS handlers, validators, pipeline behaviors, interfaces
├── Infrastructure/  # EF Core, repositories, migrations, JWT, BCrypt
├── API/             # Carter modules, response mapping, middleware, exception handler
└── Contracts/       # Public request/response DTOs — never cross the API boundary
```

### Request flow

```
HTTP Request
    │
    ▼
Carter Module          (Contracts: Request DTO)
    │  mapper.Map<Command/Query>()
    ▼
MediatR Pipeline       (ValidationBehavior → Handler)
    │
    ▼
Handler                (Application layer — returns ErrorOr<Result>)
    │
    ├─► Repository     (Infrastructure — returns Domain entity)
    │
    ▼
Carter Module          (mapper.Map<Response DTO>() → ApiResults envelope)
    │
    ▼
HTTP Response          { "success": true, "data": { ... } }
```

### Middleware pipeline

`UseForwardedHeaders` → `UseHttpRequestLogging` → `UseSecurityHeaders` → `UseCors` → `UseHttpsRedirection` → `UseRateLimiter` → `UseExceptionHandler` → `UseAuthentication` → `UseAuthorization` → `MapCarter` → `MapHealthCheck`

---

## API Reference

All responses use a consistent envelope:

```json
// Success
{ "success": true, "data": { ... } }

// Error
{ "success": false, "error": { "code": "...", "message": "..." } }
```

### Auth

| Method | Endpoint | Body | Response |
|---|---|---|---|
| `POST` | `/auth/register` | `{ name, email, password }` | `201 { id, message }` |
| `POST` | `/auth/login` | `{ email, password }` | `200 { token, userId, name, email }` |

### Tasks

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/tasks` | List tasks — supports filtering & sorting |
| `GET` | `/tasks/{id}` | Get task by ID |
| `POST` | `/tasks` | Create a task |
| `PATCH` | `/tasks/{id}` | Update a task |
| `DELETE` | `/tasks/{id}` | Delete a task |

**Query parameters for `GET /tasks`:**

| Parameter | Type | Description |
|---|---|---|
| `status` | `Todo \| InProgress \| Done \| Cancelled` | Filter by status |
| `priority` | `Low \| Medium \| High \| Critical` | Filter by priority |
| `assignedToId` | `int` | Filter by assigned user |
| `creatorId` | `int` | Filter by creator |
| `sortBy` | `string` | Field to sort by |
| `sortDesc` | `bool` | Sort descending (default: `false`) |

### Authentication & Guest mode

JWT Bearer token is **optional**. Unauthenticated requests work in guest mode (`creatorId = 2`). Pass `Authorization: Bearer <token>` to operate as the authenticated user.

---

## Database Schema

```sql
Users (Id, Name, Email, PasswordHash, CreatedAt, UpdatedAt)
Tasks (Id, Title, Description, Status, Priority, CreatorId, AssignedToId, CreatedAt, UpdatedAt)
```

- `Tasks.CreatorId` → `Users.Id` (ON DELETE RESTRICT)
- `Tasks.AssignedToId` → `Users.Id` (ON DELETE SET NULL)
- `Users.Email` has a unique index
- `Status` and `Priority` stored as strings via EF Core value conversion

---

## Frontend

React 19 + TypeScript app following **Atomic Design**:

```
src/
├── atoms/       # Button, Input, Label, Badge
├── molecules/   # TaskCard, TaskFilters
├── organisms/   # TaskList, TaskForm, TaskDetail
├── pages/       # WelcomePage, LoginPage, RegisterPage
├── hooks/       # useAuth, useTasks — TanStack Query wrappers
└── api/         # Generated OpenAPI client
```

Authentication is stored in `localStorage`. Unauthenticated users land on the welcome page; login issues a JWT and updates all query keys.

---

## Running locally

### Prerequisites

- .NET 9 SDK
- Node.js 20+
- PostgreSQL (or Docker)

### Backend

```bash
cd TaskTrackerAPI
dotnet restore
dotnet run --project API
# API available at http://localhost:5000
# Swagger UI at http://localhost:5000/swagger
```

### Frontend

```bash
cd TaskTrackerApp
npm install
npm run dev
# Dev server at http://localhost:5173
```

### Both together

```bash
npm run dev:all   # runs concurrently from repo root
```

---

## Tests

### Backend (xUnit)

```bash
cd TaskTrackerAPI
dotnet test
```

Covers: CQRS handler behavior, FluentValidation rules, and smoke tests. Repositories are mocked via NSubstitute; domain logic is never mocked.

### Frontend (Vitest)

```bash
cd TaskTrackerApp
npm test
```

Tests use React Testing Library against user-visible behavior, not implementation details.

---

## Deployment

Production uses Docker Compose with three containers: API, frontend (Nginx), and PostgreSQL.

```bash
# On the VPS — images are pulled automatically by GitHub Actions on push to main
docker compose -f docker-compose.prod.yml up -d
```

### CI/CD (GitHub Actions)

On every push to `main`:

1. Build & test the .NET solution
2. Build & test the React app
3. Build Docker images and push to GHCR
4. SSH into the VPS and run `docker compose pull && docker compose up -d`

### Health check

```
GET /health
→ 200 { "status": "Healthy" }
```

---

## Business rules

1. **Title required** — tasks must always have a non-empty title; enforced at the validator level.
2. **Creator-only delete** — only the user who created a task may delete it.
3. **Scoped visibility** — users may only read tasks they created or are assigned to.
