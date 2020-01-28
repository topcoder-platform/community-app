# Topcoder account app - E2E Tests - series 3

#### Software Required
Nodejs v8.11.4+
Chrome Browser v79

#### Installation:
- Install protractor
`npm install -g protractor`
- Install Typescript
`npm install -g typescript`
-  Install webdriver
`npm install -g webdriver-manager`
- Install dependencies
`npm install`
- In case the webdriver needs to be updated, run the below command
`webdriver-manager update`
- To run tests for the development environment
`npm run test:dev`
- To run tests for the qa environment
`npm run test:qa`
- To run tests for the production environment
`npm run test:prod`
- Test results are generated in test-results/ folder
```
HTML report - TestResult.html
Junit report - junitresults-TopcoderLoginPageTests.xml and junitresults-TopcoderRegistrationPageTests.xml
```
- To view junit reports into html, install xunit-viewer
`npm i -g xunit-viewer`
- HTML report from Junit reports can be generated using this command
`xunit-viewer --results=test-results/ --output=/home/Documents/`

As of now, the tests are running in headless mode. To view the actual chrome browser running the tests, you can remove `--headless` option from `chromeOptions.args` in `config.ts`
- To test against a different browser version, change the webdriver-manager version in package.json

#### Configuration details:
- config-dev.json contains configuration for the development environment.
- config-qa.json contains configuration for the QA environment (it still uses some configuration for the development environment, since not all the features are implemented in the qa-community-app)
- config.prod.json contains configuration for the production environment.
- conf.ts holds the application configuration, like jasmine reporters to be configured, specs to be run etc.

#### NOTES
- Please check this test and this comment which need to be fixed by TC devs:
Test: `should Verify User can update Email Preferences`
comment: `"FIXME - below condition has to be fixed by Topcoder Devs"`

#### Docker Deployment
Run the below command at project root folder.
-  `./smoketest.sh dev dev-community-app-qavar.json`
-  Note: Give execute permission to your script `chmod +x /path/to/yourscript.sh`
