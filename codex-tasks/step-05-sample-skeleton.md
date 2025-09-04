You are implementing a single, focused step in the `aryeko/nestjs-opa` repo.

Branch: {date}-sample-skeleton

Rules:
- Only touch files relevant to this step.
- Add unit/policy tests and docs for this step.
- Open a PR titled: "[Step 5] Sample app skeleton (smarthome-api)" with a clear summary and checklist.
- Run all self-checks before finishing. If anything fails, fix it.

Dependencies:
- Start from `main`. If the previous step’s PR isn’t merged into `main`, stop and report.

WHAT:
- Create `examples/smarthome-api` minimal Nest app.
- Implement JWT verify (via `jose`).
- Wire `AuthzModule.forRoot` with `buildInput`/`selectDecision` adapter.
- Add minimal placeholder routes.

ACCEPTANCE (must pass before PR is ready):
- Commands to run:
  - pnpm -F smarthome-api build
  - pnpm -F smarthome-api test (if present)
  - pnpm -r lint
- Expected files created/changed:
  - `examples/smarthome-api/package.json`, `tsconfig.json`, `src/{main.ts,app.module.ts}`
  - `examples/smarthome-api/src/auth/auth.module.ts` and JWT verify utility
  - `examples/smarthome-api/src/authz/authz.module.ts` adapter to `@arye/nestjs-opa-core`
  - minimal controllers under `examples/smarthome-api/src/*`
- CI workflow(s) that must be green:
  - `.github/workflows/e2e.yml` stub passes


