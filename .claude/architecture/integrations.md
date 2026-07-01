# Integrations

*External services this project depends on.*

| Service | Purpose | Where configured |
|---------|---------|-----------------|
| PostgreSQL | Primary data store for tasks and users | `ConnectionStrings:DefaultConnection` in `appsettings.Development.json`; overridden by env var in Docker Compose |
| Docker Compose | Orchestrates API + frontend + DB containers for one-command local startup and VPS deployment | `docker-compose.yml` at repo root (planned) |
| GitHub Actions | CI/CD pipeline — build, test, push Docker images, deploy to VPS on merge | `.github/workflows/` (planned) |
| CORS | Allows the frontend origin to call the API | `CorsSettings:AllowedOrigins` in config; falls back to `AllowAnyOrigin` if unset |
