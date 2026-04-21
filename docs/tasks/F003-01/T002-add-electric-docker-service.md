# Task T002: Add ElectricSQL Docker Service

## Feature
F003-01 — ElectricSQL Migration

## Description
Add the ElectricSQL service to the existing docker-compose file so it runs alongside PostgreSQL. ElectricSQL connects to PostgreSQL and acts as the sync layer between PostgreSQL and mobile clients.

## Files
- `server/docker/postgres/docker-compose.yml` — add electric service

## Implementation Steps
1. Open `server/docker/postgres/docker-compose.yml`
2. Add an `electric` service with the following configuration:
   - Image: `electricsql/electric:latest`
   - Container name: `listory_electric`
   - Restart: `always`
   - Depends on: `postgres`
   - Environment variables:
     - `DATABASE_URL`: `postgresql://postgres:${POSTGRES_PASSWORD}@postgres:5432/${POSTGRES_DB}`
     - `ELECTRIC_WRITE_TO_PG_MODE`: `direct_writes`
     - `AUTH_MODE`: `insecure`
   - Ports: `5133:5133`
3. Save the file

## Constraints
- Do not modify the existing `postgres` service configuration
- The electric service must declare `depends_on: postgres` to ensure correct startup order
- Use the `insecure` auth mode for local development (auth will be handled separately in a future task)

## Acceptance Criteria
- `docker-compose.yml` contains both `postgres` and `electric` services
- The `electric` service references postgres via the Docker service name (`postgres`), not `localhost`
- Running `docker compose up` starts both services without errors

## Test Steps
1. Open `server/docker/postgres/docker-compose.yml` and verify the `electric` service block is present
2. Run `docker compose up` from the `server/docker/postgres/` directory
3. Confirm both containers start and ElectricSQL logs show a connection to PostgreSQL

## Notes
ElectricSQL runs on port 5133 by default. Mobile clients will connect to this port, not to PostgreSQL directly.
