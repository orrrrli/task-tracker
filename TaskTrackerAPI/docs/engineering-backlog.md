# Engineering Backlog — Task Tracker Backlog

**Generated from** the backlog manifest (single source of truth — edit the manifest and re-run `render_docs.py`).
**Totals:** 8 epics · 50 stories · 113 tasks = **171 GitHub issues**.
**Tracked in:** [Project #5](https://github.com/users/orrrrli/projects/5) · assignee `orrrrli`.

| Level | GitHub object | Labels |
|---|---|---|
| Epic | parent Issue | `type:epic`, `epic:<slug>`, `phase:N`, `fr:N` |
| Story | sub-issue of epic | `type:story`, `area:*` |
| Task | sub-issue of story | `type:task`, `area:*` |

---

## Sprint plan

| Sprint | Phase | Epics (size) |
|---|---|---|
| Sprint 0 | 1, 2, 3, 4, 5 | EPIC-DOMAIN (S), EPIC-APPLICATION (L), EPIC-INFRASTRUCTURE (M), EPIC-CONTRACTS (S), EPIC-CARTER (M) |
| Sprint 1 | 6 | EPIC-DOCKER (S) |
| Sprint 2 | 7 | EPIC-FRONTEND (L) |
| Sprint 3 | 8 | EPIC-AUTH (L) |

---

## EPIC-DOMAIN — Domain (COMPLETADA ✅)
*Fase 1 · phase 1 · size S · 3 backend stories · 4 tasks*

Domain models and enums for tasks and users.

### BE-DOMAIN-1 — As a developer, I want a TaskItem domain model with Title, Description, Status, Priority, Creator, and AssignedTo fields, so that the business entity is properly represented in code.
`area:backend` · estimate S (2 pts)

**Acceptance criteria:**
- Given the domain layer, When I inspect TaskItem, Then it has Title, Description, Status, Priority, Creator, and AssignedTo fields.

**Tasks (1):**
- `BE-DOMAIN-1-T1` Create TaskItem entity

### BE-DOMAIN-2 — As a developer, I want TaskItemStatus and TaskItemPriority enums, so that status and priority values are type-safe and constrained.
`area:backend` · estimate XS (1 pts)

**Acceptance criteria:**
- Given the domain layer, When I inspect enums, Then TaskItemStatus and TaskItemPriority exist with appropriate values.

**Tasks (2):**
- `BE-DOMAIN-2-T1` Create TaskItemStatus enum
- `BE-DOMAIN-2-T2` Create TaskItemPriority enum

### BE-DOMAIN-3 — As a developer, I want a User domain model with unique email, so that task ownership and assignment are trackable.
`area:backend` · estimate S (2 pts)

**Acceptance criteria:**
- Given the domain layer, When I inspect User, Then it has Id, Name, Email, PasswordHash, CreatedAt, UpdatedAt fields.

**Tasks (1):**
- `BE-DOMAIN-3-T1` Create User entity

---

## EPIC-APPLICATION — Application Layer — CQRS (COMPLETADA ✅)
*Fase 2 · phase 2 · size L · 8 backend stories · 15 tasks*

CQRS commands, queries, handlers, validators, and mappings.

### BE-APP-1 — As a developer, I want a CreateTaskCommand and handler, so that task creation logic is encapsulated and testable in isolation.
`area:backend` · estimate S (2 pts)

**Acceptance criteria:**
- Given a CreateTaskCommand, When the handler runs, Then a new task is created.

**Tasks (2):**
- `BE-APP-1-T1` Create CreateTaskCommand
- `BE-APP-1-T2` Implement CreateTaskCommandHandler

### BE-APP-2 — As a developer, I want an UpdateTaskCommand and handler with partial-update semantics, so that only the provided fields are modified on the task.
`area:backend` · estimate M (3 pts)

**Acceptance criteria:**
- Given an UpdateTaskCommand with partial fields, When the handler runs, Then only the provided fields are updated.

**Tasks (2):**
- `BE-APP-2-T1` Create UpdateTaskCommand
- `BE-APP-2-T2` Implement UpdateTaskCommandHandler

### BE-APP-3 — As a developer, I want a DeleteTaskCommand and handler, so that tasks can be removed by id.
`area:backend` · estimate S (2 pts)

**Acceptance criteria:**
- Given a DeleteTaskCommand, When the handler runs, Then the task is deleted.

**Tasks (2):**
- `BE-APP-3-T1` Create DeleteTaskCommand
- `BE-APP-3-T2` Implement DeleteTaskCommandHandler

### BE-APP-4 — As a developer, I want a GetTaskByIdQuery and handler, so that a single task can be retrieved with full creator and assignee details.
`area:backend` · estimate S (2 pts)

**Acceptance criteria:**
- Given a GetTaskByIdQuery, When the handler runs, Then the task is returned with creator and assignee details.

**Tasks (2):**
- `BE-APP-4-T1` Create GetTaskByIdQuery
- `BE-APP-4-T2` Implement GetTaskByIdQueryHandler

### BE-APP-5 — As a developer, I want a ListTasksQuery and handler that supports filtering by Status, Priority, and AssignedToId, sorting by Title, Priority, or CreatedAt, and 1-based pagination with configurable page size (default 7), so that consumers can browse and filter the task list efficiently.
`area:backend` · estimate M (3 pts)

**Acceptance criteria:**
- Given a ListTasksQuery with filters, When the handler runs, Then filtered, sorted, paginated tasks are returned.

**Tasks (2):**
- `BE-APP-5-T1` Create ListTasksQuery
- `BE-APP-5-T2` Implement ListTasksQueryHandler with filtering, sorting, pagination

### BE-APP-6 — As a developer, I want ITaskRepository and IUserRepository interfaces, so that the application layer is decoupled from the persistence implementation.
`area:backend` · estimate S (2 pts)

**Acceptance criteria:**
- Given the application layer, When I inspect interfaces, Then ITaskRepository and IUserRepository exist.

**Tasks (2):**
- `BE-APP-6-T1` Create ITaskRepository interface
- `BE-APP-6-T2` Create IUserRepository interface

### BE-APP-7 — As a developer, I want FluentValidation validators for CreateTaskCommand and UpdateTaskCommand, so that constraint violations surface with clear error messages before handler execution.
`area:backend` · estimate S (2 pts)

**Acceptance criteria:**
- Given invalid input, When the validator runs, Then validation errors are returned.

**Tasks (2):**
- `BE-APP-7-T1` Create CreateTaskCommandValidator
- `BE-APP-7-T2` Create UpdateTaskCommandValidator

### BE-APP-8 — As a developer, I want AutoMapper mappings from TaskItem to TaskResult, so that domain models are safely projected to application DTOs without leaking persistence internals.
`area:backend` · estimate S (2 pts)

**Acceptance criteria:**
- Given a TaskItem, When mapped, Then a TaskResult is returned with correct fields.

**Tasks (1):**
- `BE-APP-8-T1` Create TaskMappingConfig with AutoMapper

---

## EPIC-INFRASTRUCTURE — Infrastructure — Persistence (COMPLETADA ✅)
*Fase 3 · phase 3 · size M · 4 backend stories · 5 tasks*

PostgreSQL persistence with EF Core.

### BE-INFRA-1 — As a developer, I want a PostgreSQL-backed AppDbContext with EF Core, so that tasks and users are persisted in a relational store.
`area:backend` · estimate M (3 pts)

**Acceptance criteria:**
- Given the infrastructure layer, When I inspect AppDbContext, Then it connects to PostgreSQL.

**Tasks (2):**
- `BE-INFRA-1-T1` Create AppDbContext with EF Core
- `BE-INFRA-1-T2` Configure PostgreSQL connection

### BE-INFRA-2 — As a developer, I want a TaskRepository implementing ITaskRepository with GetByIdAsync, GetAllAsync, AddAsync, UpdateAsync, and DeleteAsync, so that all CRUD operations are available to the application layer.
`area:backend` · estimate M (3 pts)

**Acceptance criteria:**
- Given a TaskRepository, When I call CRUD methods, Then tasks are persisted correctly.

**Tasks (1):**
- `BE-INFRA-2-T1` Implement TaskRepository with all CRUD methods

### BE-INFRA-3 — As a developer, I want an EF Core migration (Init) that creates the Tasks and Users tables, so that the schema is version-controlled and reproducible.
`area:backend` · estimate S (2 pts)

**Acceptance criteria:**
- Given the migration, When applied, Then Tasks and Users tables exist.

**Tasks (1):**
- `BE-INFRA-3-T1` Create Init migration

### BE-INFRA-4 — As a developer, I want Status and Priority stored as strings in the database, so that enum values are human-readable in the DB and resilient to reordering.
`area:backend` · estimate XS (1 pts)

**Acceptance criteria:**
- Given the schema, When I inspect Status and Priority columns, Then they are stored as strings.

**Tasks (1):**
- `BE-INFRA-4-T1` Configure enum-to-string conversion in EF Core

---

## EPIC-CONTRACTS — HTTP Contracts (COMPLETADA ✅)
*Fase 4 · phase 4 · size S · 3 backend stories · 6 tasks*

Request and response DTOs for HTTP API.

### BE-CONTRACTS-1 — As a developer, I want CreateTaskRequest, UpdateTaskRequest, and TaskListRequest DTOs, so that HTTP input shapes are explicitly defined and decoupled from domain commands.
`area:backend` · estimate S (2 pts)

**Acceptance criteria:**
- Given the contracts layer, When I inspect request DTOs, Then CreateTaskRequest, UpdateTaskRequest, and TaskListRequest exist.

**Tasks (3):**
- `BE-CONTRACTS-1-T1` Create CreateTaskRequest
- `BE-CONTRACTS-1-T2` Create UpdateTaskRequest
- `BE-CONTRACTS-1-T3` Create TaskListRequest

### BE-CONTRACTS-2 — As a developer, I want TaskResponse and TaskListResponse DTOs, so that HTTP output shapes are stable and versioned independently of the domain model.
`area:backend` · estimate S (2 pts)

**Acceptance criteria:**
- Given the contracts layer, When I inspect response DTOs, Then TaskResponse and TaskListResponse exist.

**Tasks (2):**
- `BE-CONTRACTS-2-T1` Create TaskResponse
- `BE-CONTRACTS-2-T2` Create TaskListResponse

### BE-CONTRACTS-3 — As a developer, I want all API responses wrapped in { "ok": true, "data": ... } on success and { "ok": false, "error": { "code": "...", "message": "..." } } on failure, so that clients have a uniform response contract regardless of the operation.
`area:backend` · estimate S (2 pts)

**Acceptance criteria:**
- Given an API response, When I inspect the envelope, Then it has ok and data/error fields.

**Tasks (1):**
- `BE-CONTRACTS-3-T1` Create ApiResult helper with envelope format

---

## EPIC-CARTER — API — Carter Endpoint Modules (COMPLETADA ✅)
*Fase 5 · phase 5 · size M · 7 backend stories · 7 tasks*

Carter modules exposing task CRUD endpoints.

### BE-CARTER-1 — As an API consumer, I want GET /tasks with optional ?status=, ?priority=, ?assignedToId=, ?sortBy=, ?sortDesc=, ?page=, and ?size= query params, so that I can retrieve a filtered, sorted, paginated list of tasks directly from a browser address bar.
`area:backend` · estimate S (2 pts)

**Acceptance criteria:**
- Given the /tasks endpoint, When I call it with query params, Then filtered, sorted, paginated tasks are returned.

**Tasks (1):**
- `BE-CARTER-1-T1` Implement GET /tasks route in TasksModule

### BE-CARTER-2 — As an API consumer, I want GET /tasks/{id}, so that I can retrieve the full detail of a single task including creator name and assignee name.
`area:backend` · estimate XS (1 pts)

**Acceptance criteria:**
- Given the /tasks/{id} endpoint, When I call it, Then the task detail is returned.

**Tasks (1):**
- `BE-CARTER-2-T1` Implement GET /tasks/{id} route in TasksModule

### BE-CARTER-3 — As an API consumer, I want GET /tasks/create?title=&description=&priority=&assignedToId=&creatorId=, so that I can create a new task by navigating to a URL or pasting it in a browser for easy demoing.
`area:backend` · estimate S (2 pts)

**Acceptance criteria:**
- Given the /tasks/create endpoint, When I call it with query params, Then a new task is created.

**Tasks (1):**
- `BE-CARTER-3-T1` Implement GET /tasks/create route in TasksModule

### BE-CARTER-4 — As an API consumer, I want GET /tasks/{id}/update?title=&description=&status=&priority=&assignedToId=, so that I can partially update a task with only the fields I pass.
`area:backend` · estimate S (2 pts)

**Acceptance criteria:**
- Given the /tasks/{id}/update endpoint, When I call it with query params, Then the task is partially updated.

**Tasks (1):**
- `BE-CARTER-4-T1` Implement GET /tasks/{id}/update route in TasksModule

### BE-CARTER-5 — As an API consumer, I want GET /tasks/{id}/delete, so that I can delete a task by navigating to a single URL.
`area:backend` · estimate XS (1 pts)

**Acceptance criteria:**
- Given the /tasks/{id}/delete endpoint, When I call it, Then the task is deleted.

**Tasks (1):**
- `BE-CARTER-5-T1` Implement GET /tasks/{id}/delete route in TasksModule

### BE-CARTER-6 — As an API consumer, I want all request and response bodies (including Authorization headers and credentials) logged at info level, so that every interaction is fully reproducible from logs.
`area:backend` · estimate S (2 pts)

**Acceptance criteria:**
- Given an API call, When it is made, Then the request and response are logged at info level.

**Tasks (1):**
- `BE-CARTER-6-T1` Implement logging middleware for request/response bodies

### BE-CARTER-7 — As a developer, I want Carter ICarterModule implementations registered via app.MapCarter(), so that routes are organized by resource without manual route registration boilerplate.
`area:backend` · estimate XS (1 pts)

**Acceptance criteria:**
- Given the API, When it starts, Then Carter modules are registered and routes are available.

**Tasks (1):**
- `BE-CARTER-7-T1` Register Carter modules in Program.cs

---

## EPIC-DOCKER — Docker Compose — Portabilidad
*Fase 6 · phase 6 · size S · Sprint 1 · 3 devops stories · 8 tasks*

Containerize the API + PostgreSQL stack for one-command startup.

### OPS-DOCKER-1 — As a developer, I want a docker-compose.yml that starts the API and PostgreSQL with a single command, so the entire stack runs without local dependency installation.
`area:devops` · estimate M (3 pts)

**Acceptance criteria:**
- Given docker-compose.yml exists, When I run docker compose up, Then both api and db containers start and the API is reachable on port 5255.

**Tasks (4):**
- `OPS-DOCKER-1-T1` Write docker-compose.yml with api and db services
- `OPS-DOCKER-1-T2` Configure PostgreSQL 16 image with healthcheck
- `OPS-DOCKER-1-T3` Wire ConnectionStrings__DefaultConnection via environment
- `OPS-DOCKER-1-T4` Test docker compose up from clean checkout

### OPS-DOCKER-2 — As a developer, I want the API container to run EF Core migrations on startup, so a fresh environment is schema-ready without manual steps.
`area:devops` · estimate S (2 pts)

**Acceptance criteria:**
- Given a fresh PostgreSQL container, When the API container starts, Then migrations are applied and the Tasks/Users tables exist.

**Tasks (2):**
- `OPS-DOCKER-2-T1` Add migration runner to Program.cs startup
- `OPS-DOCKER-2-T2` Verify migrations run on first boot

### OPS-DOCKER-3 — As a developer, I want environment variables for connection strings and secrets managed via Docker Compose, so the app is configurable without changing code.
`area:devops` · estimate S (2 pts)

**Acceptance criteria:**
- Given docker-compose.yml, When I set environment variables, Then the API picks them up without code changes.

**Tasks (2):**
- `OPS-DOCKER-3-T1` Document required env vars in README
- `OPS-DOCKER-3-T2` Add .env.example with defaults

---

## EPIC-FRONTEND — Frontend — UI Responsive
*Fase 7 · phase 7 · size L · Sprint 2 · 9 frontend stories · 31 tasks*

Build a responsive, mobile-first task management UI.

### FE-FE-1 — As a user, I want a task list view that shows all tasks with their title, status, priority, and assignee, so I have an at-a-glance overview of the project.
`area:frontend` · estimate M (3 pts)

**Acceptance criteria:**
- Given tasks exist, When I load the list view, Then each task shows title, status, priority, and assignee.

**Tasks (4):**
- `FE-FE-1-T1` Scaffold frontend project (React/Vue/Svelte TBD)
- `FE-FE-1-T2` Create task list component
- `FE-FE-1-T3` Wire GET /tasks API call
- `FE-FE-1-T4` Render task cards with key fields

### FE-FE-2 — As a user, I want to filter the task list by status and priority from the UI, so I can focus on the tasks that are relevant to me.
`area:frontend` · estimate S (2 pts)

**Acceptance criteria:**
- Given the task list, When I apply a status filter, Then only matching tasks are shown.

**Tasks (3):**
- `FE-FE-2-T1` Add filter dropdowns for status and priority
- `FE-FE-2-T2` Wire query params to API call
- `FE-FE-2-T3` Update list on filter change

### FE-FE-3 — As a user, I want to sort the task list by title, priority, or creation date, so I can organize my view to match my workflow.
`area:frontend` · estimate S (2 pts)

**Acceptance criteria:**
- Given the task list, When I click a sort header, Then tasks are reordered accordingly.

**Tasks (3):**
- `FE-FE-3-T1` Add sortable column headers
- `FE-FE-3-T2` Wire sortBy and sortDesc query params
- `FE-FE-3-T3` Update list on sort change

### FE-FE-4 — As a user, I want pagination controls in the task list (previous/next, page indicator), so I can navigate large datasets without overwhelming the view.
`area:frontend` · estimate S (2 pts)

**Acceptance criteria:**
- Given a paginated task list, When I click next, Then the next page of tasks is loaded.

**Tasks (3):**
- `FE-FE-4-T1` Add pagination controls (prev/next/page indicator)
- `FE-FE-4-T2` Wire page and size query params
- `FE-FE-4-T3` Handle empty pages gracefully

### FE-FE-5 — As a user, I want a task detail view showing all fields of a task, so I can see the full context of a work item.
`area:frontend` · estimate S (2 pts)

**Acceptance criteria:**
- Given a task in the list, When I click it, Then a detail view shows all fields.

**Tasks (3):**
- `FE-FE-5-T1` Create task detail component
- `FE-FE-5-T2` Wire GET /tasks/{id} API call
- `FE-FE-5-T3` Display all task fields

### FE-FE-6 — As a user, I want a form to create a new task with fields for title, description, priority, and assignee, so I can add work items to the system.
`area:frontend` · estimate M (3 pts)

**Acceptance criteria:**
- Given the create form, When I fill it and submit, Then a new task is created and appears in the list.

**Tasks (4):**
- `FE-FE-6-T1` Create task form component
- `FE-FE-6-T2` Add fields for title, description, priority, assignee
- `FE-FE-6-T3` Wire GET /tasks/create API call
- `FE-FE-6-T4` Redirect to list on success

### FE-FE-7 — As a user, I want to edit an existing task's title, description, status, priority, and assignee from the UI, so I can keep task information up to date.
`area:frontend` · estimate M (3 pts)

**Acceptance criteria:**
- Given a task in edit mode, When I change fields and save, Then the task is updated.

**Tasks (4):**
- `FE-FE-7-T1` Create edit form component
- `FE-FE-7-T2` Pre-populate with current values
- `FE-FE-7-T3` Wire GET /tasks/{id}/update API call
- `FE-FE-7-T4` Handle validation errors

### FE-FE-8 — As a user, I want a delete confirmation and one-click delete for a task, so I can remove completed or invalid items.
`area:frontend` · estimate S (2 pts)

**Acceptance criteria:**
- Given a task, When I click delete, Then a confirmation appears and the task is removed on confirm.

**Tasks (4):**
- `FE-FE-8-T1` Add delete button to task detail
- `FE-FE-8-T2` Show confirmation dialog
- `FE-FE-8-T3` Wire GET /tasks/{id}/delete API call
- `FE-FE-8-T4` Redirect to list on success

### FE-FE-9 — As a user, I want the UI to be fully responsive and usable on mobile, tablet, and desktop, so I can manage tasks from any device.
`area:frontend` · estimate M (3 pts)

**Acceptance criteria:**
- Given the UI, When I resize the browser, Then the layout adapts gracefully.

**Tasks (3):**
- `FE-FE-9-T1` Apply responsive CSS (mobile-first)
- `FE-FE-9-T2` Test on mobile/tablet/desktop viewports
- `FE-FE-9-T3` Fix layout issues

---

## EPIC-AUTH — Authentication
*Épica 2 · phase 8 · size L · Sprint 3 · 8 backend + 5 frontend stories · 37 tasks*

Implement JWT-based authentication for secure task management.

### BE-AUTH-1 — As a developer, I want a UserRepository implementing IUserRepository, so user lookup and creation are available to auth handlers.
`area:backend` · estimate M (3 pts)

**Acceptance criteria:**
- Given a user email, When I call GetByEmailAsync, Then the user is returned if they exist.

**Tasks (2):**
- `BE-AUTH-1-T1` Implement UserRepository with EF Core
- `BE-AUTH-1-T2` Register in DI

### BE-AUTH-2 — As a developer, I want a RegisterCommand and handler that creates a new User with a hashed password, so new users can be onboarded.
`area:backend` · estimate M (3 pts)

**Acceptance criteria:**
- Given a registration request, When the handler runs, Then a user is created with a hashed password.

**Tasks (3):**
- `BE-AUTH-2-T1` Create RegisterCommand
- `BE-AUTH-2-T2` Implement handler with password hashing
- `BE-AUTH-2-T3` Add FluentValidation validator

### BE-AUTH-3 — As a developer, I want a LoginQuery and handler that validates credentials and returns a JWT, so authenticated sessions can be established.
`area:backend` · estimate M (3 pts)

**Acceptance criteria:**
- Given valid credentials, When the handler runs, Then a JWT is returned.

**Tasks (3):**
- `BE-AUTH-3-T1` Create LoginQuery
- `BE-AUTH-3-T2` Implement handler with credential validation
- `BE-AUTH-3-T3` Generate JWT on success

### BE-AUTH-4 — As a developer, I want an IJwtTokenGenerator implementation that signs tokens with a secret and expiration, so token generation is centralized and configurable.
`area:backend` · estimate S (2 pts)

**Acceptance criteria:**
- Given a user, When I call GenerateToken, Then a signed JWT is returned.

**Tasks (3):**
- `BE-AUTH-4-T1` Implement JwtTokenGenerator
- `BE-AUTH-4-T2` Configure secret and expiration from appsettings
- `BE-AUTH-4-T3` Register in DI

### BE-AUTH-5 — As a developer, I want an IPasswordHasher implementation, so passwords are never stored in plain text.
`area:backend` · estimate S (2 pts)

**Acceptance criteria:**
- Given a password, When I hash it, Then a secure hash is returned.

**Tasks (2):**
- `BE-AUTH-5-T1` Implement PasswordHasher (e.g., BCrypt)
- `BE-AUTH-5-T2` Register in DI

### BE-AUTH-6 — As an API consumer, I want GET /auth/register?email=&password=&name=, so new accounts can be created from a browser.
`area:backend` · estimate S (2 pts)

**Acceptance criteria:**
- Given the register endpoint, When I call it with valid params, Then a user is created.

**Tasks (3):**
- `BE-AUTH-6-T1` Create AuthModule with register route
- `BE-AUTH-6-T2` Wire RegisterCommand
- `BE-AUTH-6-T3` Return success envelope

### BE-AUTH-7 — As an API consumer, I want GET /auth/login?email=&password= returning { ok: true, data: { token: ... } }, so a session token can be obtained from a browser.
`area:backend` · estimate S (2 pts)

**Acceptance criteria:**
- Given the login endpoint, When I call it with valid credentials, Then a JWT is returned.

**Tasks (3):**
- `BE-AUTH-7-T1` Add login route to AuthModule
- `BE-AUTH-7-T2` Wire LoginQuery
- `BE-AUTH-7-T3` Return token in envelope

### BE-AUTH-8 — As an API consumer, I want unauthorized requests to task endpoints to return { ok: false, error: { code: Auth.Unauthorized, message: ... } }, so protected resources are inaccessible without a valid token.
`area:backend` · estimate M (3 pts)

**Acceptance criteria:**
- Given a protected endpoint, When I call it without a token, Then a 401 error is returned.

**Tasks (3):**
- `BE-AUTH-8-T1` Add JWT authentication middleware
- `BE-AUTH-8-T2` Protect task endpoints with [Authorize]
- `BE-AUTH-8-T3` Return error envelope on auth failure

### FE-AUTH-1 — As a user, I want a login page with email and password fields, so I can authenticate and access the task management UI.
`area:frontend` · estimate M (3 pts)

**Acceptance criteria:**
- Given the login page, When I enter credentials and submit, Then I am logged in.

**Tasks (4):**
- `FE-AUTH-1-T1` Create login form component
- `FE-AUTH-1-T2` Wire GET /auth/login API call
- `FE-AUTH-1-T3` Store JWT in localStorage
- `FE-AUTH-1-T4` Redirect to task list on success

### FE-AUTH-2 — As a user, I want a registration page with name, email, and password fields, so I can create a new account.
`area:frontend` · estimate M (3 pts)

**Acceptance criteria:**
- Given the registration page, When I fill it and submit, Then an account is created.

**Tasks (3):**
- `FE-AUTH-2-T1` Create registration form component
- `FE-AUTH-2-T2` Wire GET /auth/register API call
- `FE-AUTH-2-T3` Redirect to login on success

### FE-AUTH-3 — As a user, I want to be redirected to the task list after a successful login, so I land in a productive state immediately.
`area:frontend` · estimate S (2 pts)

**Acceptance criteria:**
- Given a successful login, When the response is received, Then I am redirected to the task list.

**Tasks (2):**
- `FE-AUTH-3-T1` Add redirect logic after login success
- `FE-AUTH-3-T2` Test redirect flow

### FE-AUTH-4 — As a user, I want my session to persist across browser refreshes (JWT stored client-side), so I do not need to re-authenticate on every visit.
`area:frontend` · estimate S (2 pts)

**Acceptance criteria:**
- Given a logged-in session, When I refresh the page, Then I remain logged in.

**Tasks (3):**
- `FE-AUTH-4-T1` Store JWT in localStorage
- `FE-AUTH-4-T2` Load JWT on app init
- `FE-AUTH-4-T3` Attach JWT to all API requests

### FE-AUTH-5 — As a user, I want a logout button that clears my session, so I can safely end my session on a shared device.
`area:frontend` · estimate S (2 pts)

**Acceptance criteria:**
- Given a logged-in session, When I click logout, Then the JWT is cleared and I am redirected to login.

**Tasks (3):**
- `FE-AUTH-5-T1` Add logout button to UI
- `FE-AUTH-5-T2` Clear JWT from localStorage
- `FE-AUTH-5-T3` Redirect to login page

---

