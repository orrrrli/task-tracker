# Testing

## Commands
No test project exists yet. To add one:
```bash
dotnet new xunit -n TaskTrackerAPI.Tests
dotnet sln add TaskTrackerAPI.Tests
dotnet test
```

## Strategy
When tests are added:
- **Unit tests** — Application layer handlers and validators in isolation (mock `ITaskRepository`, `IUserRepository`)
- **Integration tests** — API endpoints against a real PostgreSQL instance (Testcontainers is the .NET convention for spinning up a DB per test run)
- xUnit is the recommended framework for this architecture style

## CI
Tests will run as part of the GitHub Actions pipeline on every push and PR before Docker images are built and deployed.
