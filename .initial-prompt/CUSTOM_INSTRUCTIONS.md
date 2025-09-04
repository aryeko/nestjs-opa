Paste this into Codex “Custom instructions” for this repository:

Before committing:
- Run: `pnpm -r build && pnpm -r test && (if rego pkg changed) pnpm -F @arye/nestjs-opa-rego test:policy`
- If the example app changed: bring up Docker Compose and run the e2e smoke; do not open a PR with failing checks.
- Start each step from `main`; if the previous step’s PR isn’t merged, stop and report.


