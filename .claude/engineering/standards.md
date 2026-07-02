# Engineering Standards

## Commit Style
Use conventional commits: `feat:`, `chore:`, `fix:`, `refactor:`, `test:` prefixes.
- **Format:** `<type>: <short imperative description>`
- **Body:** Explain the **why**, not the **what** (code shows what it does)
- **Example:** `feat: add JWT authentication with guest mode for task endpoints`

> Historical note: Early take-home docs specified emoji-only commits; actual practice uses conventional commits. Follow conventional commits.

---

## API Conventions — REST + Clean Architecture (Code-Backed)

### Response Envelope
Every response uses this envelope:
- **Success:** `{ "success": true, "data": <payload> }`
- **Failure:** `{ "success": false, "error": { "code": "...", "message": "..." } }`

Implementation: `ApiResults.Success()`, `ApiResults.Problem()`, `ApiResults.Created()` (201), `ApiResults.Error()` (500).

### HTTP Methods
Use REST verbs correctly:
- **GET** — read operations (list, get by id)
- **POST** — create new resources (register user, create task)
- **PATCH** — update existing resources
- **DELETE** — remove resources
- All endpoints are **public** (no `[Authorize]` decorators); JWT bearer token is **optional** for guest/auth mode switching.

### Authentication & Guest Mode
- **JWT Bearer tokens:** `Authorization: Bearer <token>` (optional, not required)
- **Guest mode:** Unauthenticated clients work fully; `creatorId = 2` (test user)
- **Endpoints:** `POST /auth/register`, `POST /auth/login` issue JWTs; task endpoints accept both authenticated and anonymous requests
- **Passwords:** BCrypt hashed; never stored or logged in plaintext
- **Security:** No credentials, tokens, or sensitive payloads logged; auth middleware configured but not enforced on task endpoints

### Database & Persistence (Real Schema)
- **Typed columns:** integers, timestamps, enums as strings — full type safety
- **Foreign keys:** user references (creator, assignee) use FK constraints; referential integrity enforced at DB level
- **Validation:** Input validation via FluentValidation pipeline; handlers trust validated inputs (no re-validation)
- **Queries:** Use `WHERE`, `ORDER BY`, `LIMIT` in LINQ/EF Core — database does the heavy lifting, not application code

> Historical note: Early take-home docs specified TEXT columns, no FKs, and application-level filtering — those were exercise constraints, not best practices. The actual codebase uses proper typing and DB queries.

### Error Handling
- **Framework:** ErrorOr<T> for Result types in handlers
- **Validation:** FluentValidation runs in `ValidationBehavior<,>` pipeline; automatic, no manual validation in handlers
- **HTTP mapping:** Carter modules convert ErrorOr failures to HTTP problem responses via `ApiResults.Problem()`
- **Errors are never silent:** validation errors surface as structured 400 responses; business errors as 4xx/5xx with code + message

### Logging
- **DO NOT log:** credentials, passwords, tokens, sensitive request/response bodies, PII
- **DO log:** request routes, query parameters, business-relevant context (e.g., user ID for audit)
- **Level:** Info for requests, Warning for validation failures, Error for exceptions
- **Implementation:** `LoggingHelper.LogRequest()`, `LoggingHelper.LogWarning()`, `LoggingHelper.LogError()`

> Historical note: Early docs suggested logging full bodies including credentials — that's a security anti-pattern. Never do that.

---

## Architecture Rules (Backend: .NET + CQRS)

### Clean Architecture Layers
- **Domain:** Entities, enums, value objects — zero external dependencies
- **Application:** CQRS commands/queries, handlers, validators, interfaces, pipeline behaviors
- **Infrastructure:** EF Core contexts, repositories, migrations, external service implementations (e.g., `PasswordHasher`, `JwtTokenGenerator`)
- **API (Presentation):** Carter modules, response mapping, logging, exception handling, middleware
- **Contracts:** Request/Response DTOs — boundary types, never cross the API boundary

### CQRS Pattern
- **Queries:** `IRequest<ErrorOr<T>>` for reads (list, get by id)
- **Commands:** `IRequest<ErrorOr<T>>` for writes (create, update, delete)
- **Handlers:** `IRequestHandler<TRequest, ErrorOr<TResponse>>`, one handler per command/query
- **Validators:** `AbstractValidator<TRequest>` per command/query, auto-executed by pipeline
- **MediatR** registers handlers + validators via assembly scan; no manual registration needed

### DTO Boundary Mapping (Critical)
Every feature has three DTO types; **do not collapse them even when shapes are identical**:

1. **Request:** `Contracts/{Feature}/Requests/{X}Request` — bound from HTTP body/query
2. **Application result:** `Application/{Feature}/{X}Result` — handler return type, mapped from Domain entity via Mapster `IRegister` in Application assembly
3. **Response:** `Contracts/{Feature}/Responses/{X}Response` — public payload, mapped from Application result via Mapster `IRegister` in API assembly, returned in envelope

**Rules:**
- Carter endpoints inject `IMapper` and call `mapper.Map<{X}Response>(result)` before returning
- Never return an Application `Result` or Domain entity across the API boundary
- Create/register endpoints return `CreatedResponse(id, message)` via `ApiResults.Created(route, id)`
- `.Produces<…>()` annotations must match the actual returned type: `{X}Response` for reads/login, `CreatedResponse` for creates/register
- **Reference implementations:** `TasksModule` + `AuthModule` with `TaskMappingConfig` + `AuthMappingConfig` in `API/Common/Mappings/`

### Mapster Configuration
- **Application configs** (`Application/…/TaskMappingConfig.cs`): Domain entity → Application `{X}Result`, e.g., `TaskItem → TaskResult`
- **API configs** (`API/Common/Mappings/{X}MappingConfig.cs`): Application result → Contracts response, e.g., `TaskResult → TaskResponse`
- Register via `TypeAdapterConfig.GlobalSettings.Scan()` (scans all assemblies for `IRegister` implementations)
- Mapping is **not optional** — it's the architectural boundary

### Repository Pattern
- Repositories implement interfaces defined in Application (`ITaskRepository`, `IUserRepository`)
- One repository per aggregate (Task, User)
- Methods return Domain entities, never DTOs
- Async all I/O (`GetAsync`, `AddAsync`, `SaveChangesAsync`)

---

## Frontend Conventions (React + TypeScript)

### State Management & Data Fetching
- **TanStack Query (React Query):** cache, loading/error states, background refetch, automatic invalidation
- **localStorage:** Auth tokens + user info (`getToken()`, `setToken()`, `clearToken()`, `getUser()`)
- **Custom hooks:** `useAuth`, `useLogin`, `useRegister`, `useLogout` wrap TanStack Query mutations

### Authentication Flow
- **Guest mode (default):** No token in localStorage; `creatorId = 2` sent to API
- **Login:** `POST /auth/login` → store token + user in localStorage → routes update
- **Logout:** Clear localStorage → redirect to home → re-fetch with guest creatorId
- **Dynamic creatorId:** `getCurrentUserId()` returns token user ID or 2 (guest fallback)

### API Integration
- **Fetcher:** `customFetch<T>()` injects `Authorization: Bearer <token>` header if token exists
- **Response shape:** `{ data, status, headers }` — parsed JSON, status code, headers
- **Error handling:** Validation errors wrapped in `ValidationError` class (field-level errors); thrown, caught, and displayed inline in forms
- **Types:** Generated from backend OpenAPI spec via orval (or hand-written for custom auth hooks)

### Component Structure (Atomic Design)
- **Atoms:** Button, Input, Label, Badge — primitive UI units
- **Molecules:** TaskCard, TaskFilters — atoms + logic
- **Organisms:** TaskList, TaskForm, TaskDetail — full features
- **Pages:** HomePage, CreateTaskPage, EditTaskPage, LoginPage, RegisterPage — route-level

### Form Validation (Frontend)
- **Zod:** Runtime schema validation (optional; currently used in some flows)
- **TanStack Query:** Mutation errors caught and categorized (validation vs. network vs. server)
- **Field errors:** Extracted from server response (`fieldErrors` prop), displayed inline, auto-clear on keystroke

---

## What We Dropped (Bad Practices from Take-Home Spec)

The following were in early take-home guidance but are **not** implemented; do not follow them:

- ❌ `GET` for all operations (writes use POST/PATCH/DELETE)
- ❌ `{ "ok": true }` envelope (use `{ "success": true }`)
- ❌ TEXT columns for everything (use typed DB columns)
- ❌ No foreign keys / manual sync (use DB FK constraints)
- ❌ Application-level query filtering (use WHERE/ORDER BY/LIMIT in SQL)
- ❌ Log credentials & full request bodies (never do this)
- ❌ `.dallio` marker files in each directory (not enforced)

These were **exercise constraints**, not best practices. The actual implementation follows industry standards for REST, security, and data integrity.

---

## Testing Strategy

### Backend (xUnit + FluentAssertions + NSubstitute)
- **One `[Fact]` per behavior** — one assertion block per test
- **Async suffix:** test methods named `Returns_not_found_when_task_does_not_exist_Async`
- **Mock repositories:** `ITaskRepository`, `IUserRepository` (boundaries); never mock domain logic
- **Framework:** net9.0, xUnit 2.9+

### Frontend (Vitest + React Testing Library)
- **User-centric:** test what users see and do, not implementation details
- **Async:** use `waitFor()` for mutations and async state updates
- **Mocking:** Mock API calls via MSW (Mock Service Worker), never mock React Query itself
- **Framework:** Vitest, React Testing Library

---

## Deployment & CI/CD

- **Local:** `npm run dev:all` (concurrently: backend API + frontend dev server)
- **Docker:** `docker-compose.prod.yml` — API container, frontend container, PostgreSQL container
- **CI/CD:** GitHub Actions — build, test, push images, deploy to personal VPS on main branch merge
- **Health check:** `GET /health` → `{ "status": "Healthy" }` (no auth required)
