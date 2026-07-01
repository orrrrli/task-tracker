# Task (TaskItem in code)

## Responsibility
Represents a unit of work that a user creates, optionally assigns to another user, and advances through a status lifecycle.

## Key Fields
| Field | Type | Meaning |
|-------|------|---------|
| `Id` | int | Auto-generated primary key |
| `Title` | string | Required short description of the work |
| `Description` | string? | Optional longer explanation |
| `Status` | TaskItemStatus | Lifecycle stage: Todo → InProgress → Done / Cancelled |
| `Priority` | TaskItemPriority | Urgency: Low / Medium / High / Critical |
| `CreatorId` | int | FK to the User who created this task |
| `AssignedToId` | int? | FK to the User responsible for doing the work |
| `CreatedAt` / `UpdatedAt` | DateTime | UTC timestamps set by the Application layer |

## Business Rules
- `Title` must always be non-empty (enforced via `CreateTaskCommandValidator` and `UpdateTaskCommandValidator`)
- Only the creator may delete a task (enforced once auth is in place)
- Visible only to the creator or the assignee (enforced once auth is in place)

## Relationships
- `Creator` → `User` (required, restrict on delete)
- `AssignedTo` → `User` (optional, set null on delete)

## EF Core Notes
- `Status` and `Priority` stored as strings via `HasConversion<string>()`
- Both navigation properties eager-loaded via `.Include()` in `TaskRepository`
