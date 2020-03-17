# Topcoder Testing Project - E2E Tests

#### Software Required

Nodejs v8.11.4+
Chrome Browser

#### Installation:

- Install protractor
  `npm install -g protractor`
- Install Typescript
  `npm install -g typescript`
- Install webdriver
  `npm install -g webdriver-manager`
- Install dependencies
  `npm install`
- In case the webdriver needs to be updated, run the below command
  `webdriver-manager update`

---

- To install lib locally
  Place the library folder on the same level as your project folder  
  `npm install ../topcoder-ui-testing-lib`

- To install published lib from npm  
  `npm install topcoder-ui-testing-lib`

---

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

#### Implementation Details:

- Login Specs (4)
- Tools Spec (1)

#### Configuration details:

- config.json holds the data level configuration, like user credentials etc
- conf.ts holds the application configuration, like jasmine reporters to be configured, specs to be run etc.
