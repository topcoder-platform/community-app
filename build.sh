#!/bin/bash
set -eo pipefail

# Builds the Community App image using BuildKit's layer cache. The deployment
# pipeline supplies the default Contentful delivery configuration from
# Parameter Store and persists it in the runtime image.
TAG="community-app:latest"
NODE_CONFIG_ENV="${NODE_CONFIG_ENV:-production}"

: "${CONTENTFUL_SPACE_ID:?CONTENTFUL_SPACE_ID must be set by the build environment}"
: "${CONTENTFUL_CDN_API_KEY:?CONTENTFUL_CDN_API_KEY must be set by the build environment}"

echo "NODE_CONFIG_ENV ${NODE_CONFIG_ENV}"

DOCKER_BUILDKIT=1 docker build --tag "${TAG}" \
  --build-arg "CDN_URL=${CDN_URL:-}" \
  --build-arg "CONTENTFUL_CDN_API_KEY=${CONTENTFUL_CDN_API_KEY}" \
  --build-arg "CONTENTFUL_SPACE_ID=${CONTENTFUL_SPACE_ID}" \
  --build-arg "NODE_CONFIG_ENV=${NODE_CONFIG_ENV}" \
  .
