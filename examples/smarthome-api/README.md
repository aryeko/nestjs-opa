# smarthome-api

Minimal sample NestJS application demonstrating wiring with `@arye/nestjs-opa-core`.

## Commands

```bash
pnpm -F smarthome-api build
pnpm -F smarthome-api start
```

## Compose environment

After building packages, you can bring up the full stack with Docker:

```bash
docker compose up -d
./scripts/apply-schema.sh
docker compose ps
```
