# Task T002: Server Setup

## Feature
F003 - Sync Engine

## Description
Scaffold the Node.js/Express API server inside `server/`. This is the HTTP layer the mobile client will push to and pull from.

## Files
- `server/package.json` (create)
- `server/tsconfig.json` (create)
- `server/src/index.ts` (create)
- `server/src/db.ts` (create)

## Implementation Steps
1. Create `server/package.json` with:
   - `express`, `pg`, `cors`, `dotenv` as dependencies
   - `typescript`, `ts-node`, `@types/express`, `@types/pg`, `@types/cors`, `@types/node` as devDependencies
   - Scripts: `dev` (ts-node src/index.ts), `build` (tsc)
2. Create `server/tsconfig.json` targeting ES2020, CommonJS, strict mode, output to `dist/`
3. Create `server/src/db.ts`:
   - Import `pg` Pool
   - Read connection config from `process.env` (POSTGRES_USER, POSTGRES_PASSWORD, POSTGRES_DB, POSTGRES_HOST, POSTGRES_PORT)
   - Export a singleton `pool`
4. Create `server/src/index.ts`:
   - Import express, cors, dotenv
   - Call `dotenv.config()`
   - Mount CORS middleware (allow all origins for now)
   - Mount JSON body parser
   - Add a `GET /health` route returning `{ status: "ok" }`
   - Listen on `process.env.PORT` or 3000
5. Update `server/.env` to add: `POSTGRES_HOST=localhost`, `POSTGRES_PORT=5432`, `PORT=3000`

## Constraints
- Use Express 4.x
- Use `pg` (node-postgres) directly — no ORM
- No authentication middleware yet
- Must read all config from environment variables

## Acceptance Criteria
- `npm run dev` starts the server without errors
- `GET /health` returns `{ status: "ok" }` with HTTP 200
- Server connects to the Postgres pool on startup (pool is created, not tested yet)

## Test Steps
1. Run `cd server && npm install && npm run dev`
2. `curl http://localhost:3000/health` returns `{"status":"ok"}`
