# Topcoder account app - E2E Tests - series 2

#### Software Required
Nodejs v8.11.4+
Chrome Browser v78

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
- To run tests
`npm run test`
- Test results are generated in test-results/ folder
```
HTML report - TestResult.html
Junit report - junitresults-TopcoderLoginPageTests.xml and junitresults-TopcoderRegistrationPageTests.xml
```
- To view junit reports into html, install xunit-viewer
`npm i -g xunit-viewer`
- HTML report from Junit reports can be generated using this command
`xunit-viewer --results=test-results/ --output=/home/Documents/`

As of now, the tests are running in headless mode. To view the actual chrom browser running the tests, you can remove `--headless` option from `chromeOptions.args` in `config.ts` 
- To test against a different browser version, change the webdriver-manager version in package.json

#### Circle CI deployment:
`config.yml` in `.circleci` folder has been updated to run `npm run test` during Circle CI deployment.

#### Implementation Details:
- Total of 80 specs added, covering all scenarios present in the test-cases folder
- ```80 specs, 0 failures
Finished in 1625.705 seconds```
- Along with Junit XML Reporter, Jasmine HTML reporter has also been added for convenience. 

#### Configuration details:
- config.json holds the data level configuration, 
 - in case the credentials need to be changed, `config.login.username` and `config.login.password` need to be updated
 - in case the environment has to be changed, the `config.baseUrl` field need to be changed
- conf.ts holds the application configuration, like jasmine reporters to be configured, specs to be run etc.

#### NOTES
- Please check this test and this comment which need to be fixed by TC devs:
Test: `should Verify User can update Email Preferences`
comment: `"FIXME - below condition has to be fixed by Topcoder Devs"`

#### Docker Deployment
Run the below command at project root folder.
-  `docker build -t comm-smoke:latest .`
-  `docker run comm-smoke:latest ./testrun.sh` 
-  Give execute permission to your script `chmod +x /path/to/yourscript.sh`
