#!/bin/bash

# Builds Docker image of Community App application. Doing it with a series of
# docker commands rather than with Dockerfile and "docker build" allows better
# control over build performance.

NODE_ENV=$1

$TAG = $PROD_AWS_ACCOUNT_ID.dkr.ecr.$PROD_AWS_REGION.amazonaws.com/community-app:$CIRCLE_SHA1

if [ -d node_modules ]
then
  docker create --name app -w /opt/app node:8.2.1
  docker cp node_modules app:/opt/app
  docker commit app prebuild
  docker build --build-arg IMAGE=prebuild --build-arg NODE_ENV=$NODE_ENV -t $TAG .
else
  docker build --build-arg NODE_ENV=$NODE_ENV -t $TAG .
  docker create --name app $TAG
  docker cp app:/opt/app/node_modules .
fi
