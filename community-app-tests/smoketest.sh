#!/bin/bash

log()
{
   echo "`date +'%D %T'` : $1"
}
track_error()
{
   if [ $1 != "0" ]; then
        log "$2 exited with error code $1"
        log "completed execution IN ERROR at `date`"
        exit $1
   fi

}

APPCONFIGFILENAME=$1
LOGICAL_PATH=$2

cd community-app-tests
aws s3 cp s3://tc-platform-${LOGICAL_PATH}/securitymanager/${APPCONFIGFILENAME} .
track_error $? "Environment setting"
cp ${APPCONFIGFILENAME} config.json

docker build -t comm-smoke:latest .
docker run --shm-size=2g comm-smoke:latest ./testrun.sh -d -p 4444:4444
track_error $? "Test case Failed"
