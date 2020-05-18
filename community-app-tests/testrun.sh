#!/bin/bash
./node_modules/.bin/webdriver-manager start --detach
npm run test
#get user name and passwrod from config file for test quality app
env=$(cat config.json | jq -r '.env')
planName="Automate Execution-"$env
email=$(cat config_update.json | jq '.testQualityEmail')
password=$(cat config_update.json | jq '.testQualityPassword')
sudo chmod 755 testquality-linux
./testquality-linux login ${email} ${password}  --save 
./testquality-linux upload_test_run test-results/junitresults-TopcoderLoginPageTests.xml --project_name='POC Automation Framework' --plan_name="'$planName'"
./testquality-linux upload_test_run test-results/junitresults-TopcoderToolsPageTests.xml --project_name='POC Automation Framework' --plan_name="'$planName'"
./testquality-linux upload_test_run test-results/junitresults-TopcoderAccountPageTests.xml --project_name='POC Automation Framework' --plan_name="'$planName'"
./testquality-linux upload_test_run test-results/junitresults-TopcoderFooterTests.xml --project_name='POC Automation Framework' --plan_name="'$planName'"
./testquality-linux upload_test_run test-results/junitresults-TopcoderHeaderTests.xml --project_name='POC Automation Framework' --plan_name="'$planName'"
./testquality-linux upload_test_run test-results/junitresults-TopcoderPreferencesPageTests.xml --project_name='POC Automation Framework' --plan_name="'$planName'"
./testquality-linux upload_test_run test-results/junitresults-junitresults-TopcoderProfileSettingsPageTests.xml --project_name='POC Automation Framework' --plan_name="'$planName'"

if [ $? -eq 0 ]; then
  echo "Test case successfully completed"
else
  echo "Test case Failed"
  exit 1
fi
