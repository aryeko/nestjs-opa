You are implementing a single, focused step in the `aryeko/nestjs-opa` repo.

Branch: {date}-bench-harness

Rules:
- Only touch files relevant to this step.
- Add unit/policy tests and docs for this step.
- Open a PR titled: "[Step 9] Benchmark harness" with a clear summary and checklist.
- Run all self-checks before finishing. If anything fails, fix it.

Dependencies:
- Start from `main`. If the previous step’s PR isn’t merged into `main`, stop and report.

WHAT:
- Add `bench/seed/generate-smarthome.ts` dataset generator.
- Add k6 scenarios under `bench/scenarios/` (list-devices.js, toggle-lights.js, stream-cameras.js).
- Add Makefile/scripts to run profiles; store JSON and markdown reports under `bench/reports/`.
- Add CI workflow `bench-smoke.yml` for a tiny run (1k tuples, 10VUs, 20s).

ACCEPTANCE (must pass before PR is ready):
- Commands to run:
  - make bench-small
- Expected files created/changed:
  - `bench/seed/generate-smarthome.ts`
  - `bench/scenarios/{list-devices.js,toggle-lights.js,stream-cameras.js}`
  - `bench/reports/*.md` (generated)
  - `Makefile` or `package.json` scripts
  - `.github/workflows/bench-smoke.yml`
- CI workflow(s) that must be green:
  - `.github/workflows/bench-smoke.yml`


