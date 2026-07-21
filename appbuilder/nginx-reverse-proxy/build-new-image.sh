#!/usr/bin/env sh
set -eu

SCRIPT_DIR="$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)"
ROOT_DIR="$(CDPATH= cd -- "$SCRIPT_DIR/../.." && pwd)"
ENV_FILE="${1:-$ROOT_DIR/appbuilder/dev-build.env}"

docker compose --env-file "$ENV_FILE" -f "$ROOT_DIR/appbuilder/docker-compose.build.yml" build ocs-nginx-reverse-proxy-manager
