#!/bin/bash
./node_modules/.bin/webdriver-manager start --detach
npm run test
#get user name and passwrod from config file for test quality app
env=$(cat config.json | jq '.env')
email=$(cat config.json | jq '.testQualityEmail')
password=$(cat config.json | jq '.testQualityPassword')
planName="community app test plan-"$env
sudo chmod 755 testquality-linux
./testquality-linux login ${email} ${password}  --save 
./testquality-linux upload_test_run test-results/junitresults-TopcoderAccountPageTests.xml --project_name='Community App' --plan_name="'$planName'"
./testquality-linux upload_test_run test-results/junitresults-TopcoderChallengeDetailPageTests.xml --project_name='Community App' --plan_name="'$planName'"
./testquality-linux upload_test_run test-results/junitresults-TopcoderChallengeListingPageTests.xml --project_name='Community App' --plan_name="'$planName'"
./testquality-linux upload_test_run test-results/junitresults-TopcoderDashboardTests.xml --project_name='Community App' --plan_name="'$planName'"
./testquality-linux upload_test_run test-results/junitresults-TopcoderFooterTests.xml --project_name='Community App' --plan_name="'$planName'"
./testquality-linux upload_test_run test-results/junitresults-TopcoderHeaderTests.xml --project_name='Community App' --plan_name="'$planName'"
./testquality-linux upload_test_run test-results/junitresults-TopcoderPreferencesPageTests.xml --project_name='Community App' --plan_name="'$planName'"
./testquality-linux upload_test_run test-results/junitresults-TopcoderProfilePageTests.xml --project_name='Community App' --plan_name="'$planName'"
./testquality-linux upload_test_run test-results/junitresults-TopcoderToolsPageTests.xml --project_name='Community App' --plan_name="'$planName'"


if [ $? -eq 0 ]; then
  echo "Test case successfully completed for $planName "
else
  echo "Test case Failed  - $result"
  exit 1
fi
