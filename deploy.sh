#!/usr/bin/env bash
set -eo pipefail

# Skips deployment for tags on no-master branch.
if [ ! -z $CIRCLE_TAG ] && [ $CIRCLE_BRANCH !== "master" ]
then
  exit 0
fi

# more bash-friendly output for jq
JQ="jq --raw-output --exit-status"

ENV=$1
TAG=$2
AWS_REGION=$(eval "echo \$${ENV}_AWS_REGION")
AWS_ECS_CLUSTER=$(eval "echo \$${ENV}_AWS_ECS_CLUSTER")
ACCOUNT_ID=$(eval "echo \$${ENV}_AWS_ACCOUNT_ID")

configure_aws_cli() {
	AWS_ACCESS_KEY_ID=$(eval "echo \$${ENV}_AWS_ACCESS_KEY_ID")
	AWS_SECRET_ACCESS_KEY=$(eval "echo \$${ENV}_AWS_SECRET_ACCESS_KEY")
	aws --version
	aws configure set aws_access_key_id $AWS_ACCESS_KEY_ID
	aws configure set aws_secret_access_key $AWS_SECRET_ACCESS_KEY
	aws configure set default.region $AWS_REGION
	aws configure set default.output json
  echo "Configured AWS CLI."
}

deploy_cluster() {

    family="community-app-task"

    make_task_def
    register_definition

		if [[ $(aws ecs update-service --cluster $AWS_ECS_CLUSTER --service $AWS_ECS_SERVICE --task-definition $revision | \
                   $JQ '.service.taskDefinition') != $revision ]]; then
        echo "Error updating service."
        return 1
    fi

    echo "Deployed!"
    return 0
}

make_task_def(){
	task_template='[
		{
				"name": "community-app",
				"image": "%s.dkr.ecr.%s.amazonaws.com/%s:%s",
				"essential": true,
				"memory": 500,
				"cpu": 100,
				"environment": [
						{
								"name": "NODE_ENV",
								"value": "%s"
						}
				],
				"portMappings": [
						{
								"hostPort": 0,
								"containerPort": 3000,
								"protocol": "tcp"
						}
				],
				"logConfiguration": {
						"logDriver": "awslogs",
						"options": {
								"awslogs-group": "/aws/ecs/%s",
								"awslogs-region": "%s",
								"awslogs-stream-prefix": "community-app"
						}
				}
		}
	]'
	
	if [ "$ENV" = "PROD" ]; then
			NODE_ENV=production
	elif [ "$ENV" = "DEV" ]; then
			NODE_ENV=development
	fi

	task_def=$(printf "$task_template" $ACCOUNT_ID $AWS_REGION $AWS_REPOSITORY $TAG $NODE_ENV $AWS_ECS_CLUSTER $AWS_REGION)
}

push_ecr_image() {
  echo "Pushing Docker Image..."
	eval $(aws ecr get-login --region $AWS_REGION --no-include-email)
	docker push $ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/$AWS_REPOSITORY:$TAG
  echo "Docker Image published."
}

register_definition() {
    if revision=$(aws ecs register-task-definition --container-definitions "$task_def" --family $family | $JQ '.taskDefinition.taskDefinitionArn'); then
        echo "Revision: $revision"
    else
        echo "Failed to register task definition"
        return 1
    fi

}

configure_aws_cli
push_ecr_image
deploy_cluster
