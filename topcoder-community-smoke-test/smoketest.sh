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
LOGICAL_PATH=$3

cd topcoder-community-smoke-test
aws s3 cp s3://tc-platform-${LOGICAL_PATH}/securitymanager/${APPCONFIGFILENAME} .
track_error $? "Environment setting"
cp ${APPCONFIGFILENAME} config.json
if [ $ENV == 'qa' ]; then
  mv  $cAPPCONFIGFILENAME config-qa.json
elif [ $ENV == 'dev' ]; then
   mv  $APPCONFIGFILENAME config-dev.json
else
   mv  $APPCONFIGFILENAME config-prod.json
fi

docker build -t comm-smoke:latest .
docker run --shm-size=2g comm-smoke:latest ./testrun.sh ${ENV} -d -p 4444:4444
track_error $? "Test case Failed"
