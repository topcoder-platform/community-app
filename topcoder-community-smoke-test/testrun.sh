#!/bin/bash
#./node_modules/.bin/webdriver-manager start --versions.chrome=75.0.3770.142 --detach
./node_modules/.bin/webdriver-manager start --detach
npm run test
if [ $? -eq 0 ]; then
  echo "Test case successfully completed"
else
  echo "Test case Failed  - $result"
  exit 1
fi
