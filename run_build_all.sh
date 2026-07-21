#!/usr/bin/env sh
set -eu

SCRIPT_DIR="$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)"
ENV_FILE="${1:-$SCRIPT_DIR/appbuilder/dev-build.env}"

docker compose --env-file "$ENV_FILE" -f "$SCRIPT_DIR/appbuilder/docker-compose.build.yml" build
