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

ENV=$1
APPCONFIGFILENAME=$2
cd topcoder-community-smoke-test
aws s3 cp s3://tc-platform-${ENV}/securitymanager/${APPCONFIGFILENAME} .
track_error $? "Environment setting"
mv ${APPCONFIGFILENAME} config.json
docker build -t comm-smoke:latest .
docker run comm-smoke:latest ./testrun.sh -v /dev/shm:/dev/shm
track_error $? "Test case Failed"
