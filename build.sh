#!/bin/bash
set -eo pipefail

# Builds the Community App image using BuildKit's layer cache. Only public
# browser configuration is accepted as a build argument; secrets belong in the
# runtime environment.
TAG="community-app:latest"
NODE_CONFIG_ENV="${NODE_CONFIG_ENV:-production}"

echo "NODE_CONFIG_ENV ${NODE_CONFIG_ENV}"

DOCKER_BUILDKIT=1 docker build --tag "${TAG}" \
  --build-arg "CDN_URL=${CDN_URL:-}" \
  --build-arg "NODE_CONFIG_ENV=${NODE_CONFIG_ENV}" \
  .
