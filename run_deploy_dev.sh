#!/usr/bin/env sh
set -eu

SCRIPT_DIR="$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)"
ENV_FILE="${1:-$SCRIPT_DIR/multi-env-deployment/development/deploy.env}"
COMPOSE_FILE="$SCRIPT_DIR/multi-env-deployment/development/docker-compose.yml"

docker compose --env-file "$ENV_FILE" -f "$COMPOSE_FILE" up -d
