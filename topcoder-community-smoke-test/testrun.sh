#!/bin/bash
#./node_modules/.bin/webdriver-manager start --versions.chrome=75.0.3770.142 --detach
/node_modules/.bin/webdriver-manager start --detach
npm run test
