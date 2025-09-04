You are implementing a single, focused step in the `aryeko/nestjs-opa` repo.

Branch: {date}-e2e-tests

Rules:
- Only touch files relevant to this step.
- Add unit/policy tests and docs for this step.
- Open a PR titled: "[Step 8] E2E tests" with a clear summary and checklist.
- Run all self-checks before finishing. If anything fails, fix it.

Dependencies:
- Start from `main`. If the previous step’s PR isn’t merged into `main`, stop and report.

WHAT:
- Implement automated e2e tests to validate scenarios:
  - dad streams Parents camera → 200
  - grandma: cameras 403; Parents lights 403; Kids/Living lights 200
  - babysitter: Kids camera within window 200; outside 403
  - route without `@Authorize` → 403
  - `/auth/login` (public) → 200

ACCEPTANCE (must pass before PR is ready):
- Commands to run:
  - docker compose up -d
  - pnpm -F smarthome-api e2e
- Expected files created/changed:
  - `examples/smarthome-api/test/e2e/**/*.spec.ts`
  - `.github/workflows/e2e.yml` jobs running the suite on PR
- CI workflow(s) that must be green:
  - `.github/workflows/e2e.yml`


