# @arye/nestjs-opa-rego

Rego policy bundle for `nestjs-opa`. Includes RBAC/ReBAC policy and data.

## Usage

```bash
pnpm -F @arye/nestjs-opa-rego build-bundle
```

Bundles `policy/authz.rego` and data files into `dist/bundle` with a `.manifest`.

Run policy tests with:

```bash
pnpm -F @arye/nestjs-opa-rego test:policy
```
