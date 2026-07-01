# Business Overview

## Purpose
A take-home full-stack project demonstrating REST API CRUD mastery and a responsive web frontend. It manages tasks (work items) that users can create, assign, and track through a lifecycle of statuses. Hiring reviewers evaluate API design, Clean Architecture enforcement, and full-stack delivery.

## Core Users
Backend and frontend engineers building the project; hiring reviewers assessing architecture, data-layer competency, and UI quality.

## Success Metrics
- Full CRUD coverage for tasks with pagination, filtering, and sorting
- Clean Architecture correctly enforced (no domain logic leaking into API or Infrastructure)
- Business rules enforced consistently across all endpoints
- Responsive web app that consumes the API
- Deployed to a personal VPS via Docker Compose; a single `docker compose up` starts the API, frontend, and database with no local setup required
