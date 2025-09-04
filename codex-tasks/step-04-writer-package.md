You are implementing a single, focused step in the `aryeko/nestjs-opa` repo.

Branch: {date}-writer-package

Rules:
- Only touch files relevant to this step.
- Add unit/policy tests and docs for this step.
- Open a PR titled: "[Step 4] SpiceDB writer package (@arye/nestjs-spicedb-writer)" with a clear summary and checklist.
- Run all self-checks before finishing. If anything fails, fix it.

Dependencies:
- Start from `main`. If the previous step’s PR isn’t merged into `main`, stop and report.

WHAT:
- Create `packages/nestjs-spicedb-writer` with:
  - TypeORM `AuthzOutbox` entity capturing tuple deltas.
  - Subscribers to enqueue outbox rows from domain entity mutations (no remote I/O).
  - `SpiceDbWriterService` running on interval (env `AUTHZ_WRITER_INTERVAL_MS`, default 10000) to batch process, mark processed, and retry.
- Unit tests: row→relationship mapping, happy path, retry.

ACCEPTANCE (must pass before PR is ready):
- Commands to run:
  - pnpm -F @arye/nestjs-spicedb-writer build
  - pnpm -F @arye/nestjs-spicedb-writer test
- Expected files created/changed:
  - `packages/nestjs-spicedb-writer/package.json`
  - `packages/nestjs-spicedb-writer/src/{outbox.entity.ts,subscribers/*,writer.service.ts,index.ts}`
  - `packages/nestjs-spicedb-writer/tsconfig.json`
  - `packages/nestjs-spicedb-writer/test/*`
- CI workflow(s) that must be green:
  - `.github/workflows/ci.yml` main job


