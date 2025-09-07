You are implementing a single, focused step in the `aryeko/nestjs-opa` repo.

Branch: {date}-rego-package

Rules:
- Only touch files relevant to this step.
- Add unit/policy tests and docs for this step.
- Open a PR titled: "[Step 3] Rego package (@arye/nestjs-opa-rego)" with a clear summary and checklist.
- Run all self-checks before finishing. If anything fails, fix it.

Dependencies:
- Start from `main`. If the previous step’s PR isn’t merged into `main`, stop and report.

WHAT:
- Create `packages/nestjs-opa-rego` with:
  - Policy at `data/authz/result` that returns `{allow: bool}`.
  - Data files: `roles.json`, `actionMaps.json` (with `action_to_perms`, `scoped_actions`, `action_to_spicedb_perm`).
  - CLI `build-bundle` to emit `dist/bundle/{authz.rego, data/*.json, .manifest}` with revision from `BUNDLE_REVISION` or `dev`.
  - Policy tests (`opa test`): public allow, missing-decorator deny, unscoped RBAC allow/deny, scoped allow, time-window caveat pass/fail.

ACCEPTANCE (must pass before PR is ready):
- Commands to run:
  - pnpm -F @arye/nestjs-opa-rego build-bundle
  - pnpm -F @arye/nestjs-opa-rego test:policy
- Expected files created/changed:
  - `packages/nestjs-opa-rego/package.json`
  - `packages/nestjs-opa-rego/policy/authz.rego`
  - `packages/nestjs-opa-rego/data/{roles.json,actionMaps.json}`
  - `packages/nestjs-opa-rego/src/cli/build-bundle.ts` (or equivalent bin)
  - `packages/nestjs-opa-rego/.manifest` (generated into dist during build)
  - `packages/nestjs-opa-rego/test/*` (rego tests)
- CI workflow(s) that must be green:
  - `.github/workflows/ci.yml` main job


