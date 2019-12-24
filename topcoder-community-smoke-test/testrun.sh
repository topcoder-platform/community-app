#!/bin/bash
#./node_modules/.bin/webdriver-manager start --versions.chrome=75.0.3770.142 --detach
./node_modules/.bin/webdriver-manager start --detach
npm run test
#get user name and passwrod from config file for test quality app
email=$(cat config.json | jq '.testQualityEmail') 
password=$(cat config.json | jq '.testQualityPassword') 
sudo chmod 755 testquality-linux
./testquality-linux login ${email} ${password}  --save 
./testquality-linux upload_test_run test-results/junitresults-TopcoderAccountPageTests.xml --project_name='Connect App' --plan_name='community app test plan' 
./testquality-linux upload_test_run test-results/junitresults-TopcoderChallengeDetailPageTests.xml --project_name='Connect App' --plan_name='community app test plan'
./testquality-linux upload_test_run test-results/junitresults-TopcoderChallengeListingPageTests.xml --project_name='Connect App' --plan_name='community app test plan'
./testquality-linux upload_test_run test-results/junitresults-TopcoderDashboardTests.xml --project_name='Connect App' --plan_name='community app test plan'
./testquality-linux upload_test_run test-results/junitresults-TopcoderFooterTests.xml --project_name='Connect App' --plan_name='community app test plan'
./testquality-linux upload_test_run test-results/junitresults-TopcoderHeaderTests.xml --project_name='Connect App' --plan_name='community app test plan'
./testquality-linux upload_test_run test-results/junitresults-TopcoderPreferencesPageTests.xml --project_name='Connect App' --plan_name='community app test plan'
./testquality-linux upload_test_run test-results/junitresults-TopcoderProfilePageTests.xml --project_name='Connect App' --plan_name='community app test plan'
./testquality-linux upload_test_run test-results/junitresults-TopcoderToolsPageTests.xml --project_name='Connect App' --plan_name='community app test plan'


if [ $? -eq 0 ]; then
  echo "Test case successfully completed"
else
  echo "Test case Failed  - $result"
  exit 1
fi
