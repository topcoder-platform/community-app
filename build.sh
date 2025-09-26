#!/bin/bash
set -eo pipefail

# Builds Docker image of Community App application.
# This script expects a single argument: NODE_CONFIG_ENV, which must be either
# "development" or "production".
# Builds Docker image of the app.
TAG="community-app-v6:latest"

echo "COMMUNITY_APP_URL $COMMUNITY_APP_URL";
echo "NODE_ENV $NODE_CONFIG_ENV";

docker build -t $TAG \
  --build-arg AUTH0_CLIENT_ID=$AUTH0_CLIENT_ID \
  --build-arg CDN_URL=$CDN_URL \
  --build-arg COGNITIVE_NEWSLETTER_SIGNUP_APIKEY=$COGNITIVE_NEWSLETTER_SIGNUP_APIKEY \
  --build-arg COGNITIVE_NEWSLETTER_SIGNUP_URL=$COGNITIVE_NEWSLETTER_SIGNUP_URL \
  --build-arg CONTENTFUL_CDN_API_KEY=$CONTENTFUL_CDN_API_KEY \
  --build-arg CONTENTFUL_PREVIEW_API_KEY=$CONTENTFUL_PREVIEW_API_KEY \
  --build-arg CONTENTFUL_SPACE_ID=$CONTENTFUL_SPACE_ID \
  --build-arg CONTENTFUL_ZURICH_SPACE_ID=$CONTENTFUL_ZURICH_SPACE_ID \
  --build-arg CONTENTFUL_ZURICH_CDN_API_KEY=$CONTENTFUL_ZURICH_CDN_API_KEY \
  --build-arg CONTENTFUL_ZURICH_PREVIEW_API_KEY=$CONTENTFUL_ZURICH_PREVIEW_API_KEY \
  --build-arg CONTENTFUL_TOPGEAR_CDN_API_KEY=$CONTENTFUL_TOPGEAR_CDN_API_KEY \
  --build-arg CONTENTFUL_TOPGEAR_PREVIEW_API_KEY=$CONTENTFUL_TOPGEAR_PREVIEW_API_KEY \
  --build-arg CONTENTFUL_TOPGEAR_SPACE_ID=$CONTENTFUL_TOPGEAR_SPACE_ID \
  --build-arg CONTENTFUL_MANAGEMENT_TOKEN=$CONTENTFUL_MANAGEMENT_TOKEN \
  --build-arg CONTENTFUL_EDU_SPACE_ID=$CONTENTFUL_EDU_SPACE_ID \
  --build-arg CONTENTFUL_EDU_CDN_API_KEY=$CONTENTFUL_EDU_CDN_API_KEY \
  --build-arg CONTENTFUL_EDU_PREVIEW_API_KEY=$CONTENTFUL_EDU_PREVIEW_API_KEY \
  --build-arg FILESTACK_API_KEY=$FILESTACK_API_KEY \
  --build-arg TOPGEAR_ALLOWED_SUBMISSIONS_DOMAINS=$TOPGEAR_ALLOWED_SUBMISSIONS_DOMAINS \
  --build-arg FILESTACK_SUBMISSION_CONTAINER=$FILESTACK_SUBMISSION_CONTAINER \
  --build-arg MAILCHIMP_API_KEY=$MAILCHIMP_API_KEY \
  --build-arg MAILCHIMP_BASE_URL=$MAILCHIMP_BASE_URL \
  --build-arg NODE_CONFIG_ENV=$NODE_CONFIG_ENV \
  --build-arg OPEN_EXCHANGE_RATES_KEY=$OPEN_EXCHANGE_RATES_KEY \
  --build-arg SEGMENT_IO_API_KEY=$SEGMENT_IO_API_KEY \
  --build-arg CHAMELEON_VERIFICATION_SECRET=$CHAMELEON_VERIFICATION_SECRET \
  --build-arg PLATFORM_SITE_URL=$PLATFORM_SITE_URL \
  --build-arg SERVER_API_KEY=$SERVER_API_KEY \
  --build-arg TC_M2M_CLIENT_ID=$TC_M2M_CLIENT_ID \
  --build-arg TC_M2M_CLIENT_SECRET=$TC_M2M_CLIENT_SECRET \
  --build-arg TC_M2M_AUDIENCE=$TC_M2M_AUDIENCE \
  --build-arg TC_M2M_AUTH0_PROXY_SERVER_URL=$TC_M2M_AUTH0_PROXY_SERVER_URL \
  --build-arg TC_M2M_AUTH0_URL=$TC_M2M_AUTH0_URL \
  --build-arg AUTH_SECRET=$AUTH_SECRET \
  --build-arg TC_M2M_GRANT_TYPE=$TC_M2M_GRANT_TYPE \
  --build-arg CONTENTFUL_COMCAST_SPACE_ID=$CONTENTFUL_COMCAST_SPACE_ID \
  --build-arg CONTENTFUL_COMCAST_CDN_API_KEY=$CONTENTFUL_COMCAST_CDN_API_KEY \
  --build-arg CONTENTFUL_COMCAST_PREVIEW_API_KEY=$CONTENTFUL_COMCAST_PREVIEW_API_KEY \
  --build-arg RECRUITCRM_API_KEY=$RECRUITCRM_API_KEY \
  --build-arg SENDGRID_API_KEY=$SENDGRID_API_KEY \
  --build-arg GSHEETS_API_KEY=$GSHEETS_API_KEY \
  --build-arg OPTIMIZELY_SDK_KEY=$OPTIMIZELY_SDK_KEY \
  --build-arg COMMUNITY_APP_URL=$COMMUNITY_APP_URL \
  --build-arg GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY=$GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY \
  --build-arg GAMIFICATION_ORG_ID=$GAMIFICATION_ORG_ID \
  --build-arg VALID_ISSUERS=$VALID_ISSUERS .

# Copies "node_modules" from the created image, if necessary for caching.
docker create --name app $TAG

if [ -d node_modules ]
then
  # If "node_modules" directory already exists, we should compare
  # "package-lock.json" from the code and from the container to decide,
  # whether we need to re-cache, and thus to copy "node_modules" from
  # the Docker container.
  mv package-lock.json old-package-lock.json
  docker cp app:/opt/app/package-lock.json package-lock.json
  set +eo pipefail
  UPDATE_CACHE=$(cmp package-lock.json old-package-lock.json)
  set -eo pipefail
else
  # If "node_modules" does not exist, then cache must be created.
  UPDATE_CACHE=1
fi

if [ "$UPDATE_CACHE" == 1 ]
then
  docker cp app:/opt/app/node_modules .
fi