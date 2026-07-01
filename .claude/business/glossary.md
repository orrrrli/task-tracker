# Domain Glossary (Ubiquitous Language)

*The exact vocabulary Claude and developers MUST use in code, variables, and database tables.*

| Code Name | Business Name | Definition |
|-----------|--------------|------------|
| `TaskItem` | Task | A unit of work with a title, description, status, priority, creator, and optional assignee |
| `TaskItemStatus` | Task Status | Lifecycle stage of a task: Todo, InProgress, Done, Cancelled |
| `TaskItemPriority` | Priority | Urgency level of a task: Low, Medium, High, Critical |
| `User` | User | A registered person who can create and be assigned tasks |

> Note to AI: In code the entity is `TaskItem` (to avoid conflict with C#'s `System.Threading.Tasks.Task`). In all documentation, comments, and user-facing text, call it **Task**. Never use "Ticket".
