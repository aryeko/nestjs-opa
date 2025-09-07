#!/usr/bin/env bash
set -euo pipefail

docker compose exec spicedb \
  spicedb schema write /schema/schema.zed \
  --grpc-preshared-key ${SPICEDB_PRESHARED_KEY:-spicedb_token} \
  --grpc-no-tls
