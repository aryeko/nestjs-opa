You are implementing a single, focused step in the `aryeko/nestjs-opa` repo.

Branch: {date}-{feature}

Rules:
- Only touch files relevant to this step.
- Add unit/policy tests and docs for this step.
- Open a PR titled: "[Step {N}] {feature}" with a clear summary and checklist.
- Run all self-checks before finishing. If anything fails, fix it.

Dependencies:
- Start from `main`. If the previous step’s PR isn’t merged into `main`, stop and report.

WHAT:
- Describe exactly what to build/change in this step.

ACCEPTANCE (must pass before PR is ready):
- Commands to run:
  - List exact shell commands that must succeed (install/build/test/compose/etc.).
- Expected files created/changed:
  - List precise paths that must be added or edited in this step only.
- CI workflow(s) that must be green:
  - List workflow file(s) and job(s) expected to pass on the PR.

Notes:
- Keep the diff small and focused. Prefer adding stubs that will be filled in future steps.
- After merge, the next task must branch from the updated `main` and re-run all checks.


