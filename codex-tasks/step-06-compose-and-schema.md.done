You are implementing a single, focused step in the `aryeko/nestjs-opa` repo.

Branch: {date}-compose-opa-spicedb

Rules:
- Only touch files relevant to this step.
- Add unit/policy tests and docs for this step.
- Open a PR titled: "[Step 6] Compose + OPA(plugin) + SpiceDB schema" with a clear summary and checklist.
- Run all self-checks before finishing. If anything fails, fix it.

Dependencies:
- Start from `main`. If the previous step’s PR isn’t merged into `main`, stop and report.

WHAT:
- Add `docker-compose.yml` bringing up Postgres, SpiceDB (with DB), OPA (with SpiceDB plugin), and sample API.
- Mount `packages/nestjs-opa-rego/dist/bundle` into OPA at `/policy/bundle`.
- Provide schema file and a script to apply it to SpiceDB.
- Wire sample app env to services; add healthchecks.

ACCEPTANCE (must pass before PR is ready):
- Commands to run:
  - docker compose up -d
  - scripts/apply-schema.sh (or equivalent)
  - docker compose ps (healthchecks healthy)
- Expected files created/changed:
  - `docker-compose.yml`
  - `scripts/apply-schema.sh`
  - `spicedb/schema.zed`
  - `.env.example` for service config
- CI workflow(s) that must be green:
  - `.github/workflows/e2e.yml` environment boot/health step


