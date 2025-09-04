You are implementing a single, focused step in the `aryeko/nestjs-opa` repo.

Branch: {date}-seed-crud-actions

Rules:
- Only touch files relevant to this step.
- Add unit/policy tests and docs for this step.
- Open a PR titled: "[Step 7] Seed + CRUD + actions" with a clear summary and checklist.
- Run all self-checks before finishing. If anything fails, fix it.

Dependencies:
- Start from `main`. If the previous step’s PR isn’t merged into `main`, stop and report.

WHAT:
- Implement DB seed for domain entities and users (dad/mom/babysitter/grandma…).
- CRUD controllers for homes, groups, devices.
- Action routes: `light.toggle`, `thermostat.set`, `camera.stream` guarded by OPA.
- Ensure outbox rows are generated and writer processes them, logging SpiceDB writes.

ACCEPTANCE (must pass before PR is ready):
- Commands to run:
  - docker compose up -d
  - pnpm -F smarthome-api seed
  - curl happy-path routes (document commands) → 2xx for allowed, 403 for denied
  - verify outbox processed logs
- Expected files created/changed:
  - `examples/smarthome-api/src/{entities,controllers,services}/**/*`
  - `examples/smarthome-api/scripts/seed.ts`
  - wiring to `@arye/nestjs-spicedb-writer`
- CI workflow(s) that must be green:
  - `.github/workflows/e2e.yml` basic smoke


