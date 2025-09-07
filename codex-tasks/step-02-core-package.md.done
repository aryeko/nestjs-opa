You are implementing a single, focused step in the `aryeko/nestjs-opa` repo.

Branch: {date}-core-package

Rules:
- Only touch files relevant to this step.
- Add unit/policy tests and docs for this step.
- Open a PR titled: "[Step 2] Core package (@arye/nestjs-opa-core)" with a clear summary and checklist.
- Run all self-checks before finishing. If anything fails, fix it.

Dependencies:
- Start from `main`. If the previous step’s PR isn’t merged into `main`, stop and report.

WHAT:
- Create `packages/nestjs-opa-core` implementing:
  - `Authorize(spec)` and `Public()` decorators.
  - `AuthzModule.forRoot(options)` and `AuthzGuard`.
  - `OpaService` (wrapper over `@styra/opa`).
  - Generic types: `AuthorizeSpec`, `OpaInput`, `OpaDecision`, `AuthzOptions` (as specified).
- Add unit tests (decorator metadata, guard behavior for public/protected/missing decorator).
- Add Typedoc config and package README with usage snippet.

ACCEPTANCE (must pass before PR is ready):
- Commands to run:
  - pnpm -F @arye/nestjs-opa-core build
  - pnpm -F @arye/nestjs-opa-core test
  - pnpm -r lint
- Expected files created/changed:
  - `packages/nestjs-opa-core/package.json`
  - `packages/nestjs-opa-core/src/{decorators.ts,module.ts,guard.ts,opa.service.ts,index.ts}`
  - `packages/nestjs-opa-core/tsconfig.json`
  - `packages/nestjs-opa-core/test/*`
  - `packages/nestjs-opa-core/typedoc.json` (or root typedoc with package entry)
  - `packages/nestjs-opa-core/README.md`
- CI workflow(s) that must be green:
  - `.github/workflows/ci.yml` main job


