You are implementing a single, focused step in the `aryeko/nestjs-opa` repo.

Branch: {date}-bootstrap-workspace

Rules:
- Only touch files relevant to this step.
- Add unit/policy tests and docs for this step.
- Open a PR titled: "[Step 1] Bootstrap workspace" with a clear summary and checklist.
- Run all self-checks before finishing. If anything fails, fix it.

Dependencies:
- Start from `main`. If the previous step’s PR isn’t merged into `main`, stop and report.

WHAT:
- Initialize pnpm workspaces and root tooling.
- Add TypeScript strict config, ESLint, Prettier, Changesets, MIT LICENSE, README skeleton.
- Add CI workflow stub(s).

ACCEPTANCE (must pass before PR is ready):
- Commands to run:
  - pnpm i
  - pnpm -r build
  - pnpm -r lint
- Expected files created/changed:
  - `package.json` (pnpm workspaces, scripts)
  - `pnpm-workspace.yaml`
  - `tsconfig.base.json`
  - `.eslintrc.cjs`, `.prettierignore`, `.prettierrc` (or `.prettierrc.json`), `.editorconfig`
  - `.gitignore`
  - `.changeset/config.json`
  - `LICENSE` (MIT)
  - `README.md` (skeleton)
  - `.github/workflows/ci.yml` (skeleton running lint/build/test)
- CI workflow(s) that must be green:
  - `.github/workflows/ci.yml` main job


