# @arye/nestjs-opa-rego

Rego policy bundle for `nestjs-opa`. Ships a generic RBAC/ReBAC policy and a CLI to bundle it with your app's data.

## Usage

```bash
pnpm -F @arye/nestjs-opa-rego build-bundle
```

Bundles files under `policy/` (and `data/` if present) into `dist/bundle` with a `.manifest`.

Run policy tests with:

```bash
pnpm -F @arye/nestjs-opa-rego test:policy
```
