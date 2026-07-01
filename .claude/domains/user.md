# User

## Responsibility
A registered account that can create tasks and be assigned to tasks.

## Key Fields
| Field | Type | Meaning |
|-------|------|---------|
| `Id` | int | Auto-generated primary key |
| `Name` | string | Display name |
| `Email` | string | Unique login identifier |
| `PasswordHash` | string | Hashed password — never store plaintext |
| `CreatedAt` / `UpdatedAt` | DateTime | UTC timestamps |

## Business Rules
- Email must be unique across all users (enforced via unique index in EF)
- Password is stored as a hash via `IPasswordHasher`

## Relationships
- Can be `Creator` of many tasks
- Can be `AssignedTo` on many tasks

## Auth
JWT-based auth is a bonus feature. Contracts (`LoginRequest`, `RegisterRequest`, `AuthResponse`) and interfaces (`IPasswordHasher`, `IUserRepository`) are defined; implementation is pending in `Infrastructure/Security/`.
