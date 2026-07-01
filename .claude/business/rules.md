# Business Rules

*Rules the code must never break under any circumstances.*

1. **Title required:** A task must always have a non-empty title. Reject any create or update that would leave a task without one. Enforced via `CreateTaskCommandValidator` and `UpdateTaskCommandValidator`.

2. **Creator-only delete:** Only the user who created a task may delete it. Any other user's delete request must be rejected with an authorization error. (Invariant — must be enforced at the handler level once auth is implemented.)

3. **Scoped visibility:** Users may only read tasks they created or are assigned to. List and get-by-id endpoints must filter by this constraint. (Invariant — must be enforced at the handler level once auth is implemented.)
