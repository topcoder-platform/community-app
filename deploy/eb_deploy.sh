#!/bin/bash

APP=$1
ENV=$2
TAG_SUFFIX=$3
KEYNAME=$4

TAG="$ENV.$TAG_SUFFIX"
ENV_LOWER=`echo "$ENV" | awk '{print tolower($0)}'`

echo "Deploying to Elasticbeanstalk"
echo "############################"
export AWS_ACCESS_KEY_ID=$(eval "echo \$${ENV}_AWS_ACCESS_KEY_ID")
export AWS_SECRET_ACCESS_KEY=$(eval "echo \$${ENV}_AWS_SECRET_ACCESS_KEY")

mkdir .elasticbeanstalk
envsub -e EC2_KEYNAME=$KEYNAME -e APPLICATION_NAME=$APP deploy/eb-config.yml .elasticbeanstalk/config.yml
eb deploy $APP-${ENV_LOWER} -l $TAG -r us-east-1 --timeout 10
