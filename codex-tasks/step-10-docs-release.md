You are implementing a single, focused step in the `aryeko/nestjs-opa` repo.

Branch: {date}-docs-and-release

Rules:
- Only touch files relevant to this step.
- Add unit/policy tests and docs for this step.
- Open a PR titled: "[Step 10] Docs polish & release setup" with a clear summary and checklist.
- Run all self-checks before finishing. If anything fails, fix it.

Dependencies:
- Start from `main`. If the previous step’s PR isn’t merged into `main`, stop and report.

WHAT:
- Polish root `README` with badges (CI, license), architecture diagram, quickstart, links to packages, how to run sample and benchmarks.
- Add `docs/getting-started.md`, `docs/architecture.md`, `docs/troubleshooting.md`.
- Ensure Typedoc generation is configured.
- Add release workflow gated on `NPM_TOKEN` using Changesets.

ACCEPTANCE (must pass before PR is ready):
- Commands to run:
  - pnpm -r build && pnpm -r test
  - pnpm -F @arye/nestjs-opa-rego test:policy
  - docs build command (if applicable)
- Expected files created/changed:
  - `README.md`, `docs/{getting-started.md,architecture.md,troubleshooting.md}`
  - `.github/workflows/release.yml`
  - typedoc configs and generated docs (if emitted in CI artifacts)
- CI workflow(s) that must be green:
  - `.github/workflows/ci.yml`
  - `.github/workflows/e2e.yml`


