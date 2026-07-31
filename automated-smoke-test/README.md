# Topcoder Testing Project - E2E Tests

#### Software Required

- Node.js 24.18.x
- npm 11.16.x
- Chrome browser

#### Installation:

- Installs
  `npm ci`

- To run tests
  `cd automated-smoke-test`
  `npm run test`
- To run tests locally
  `cd automated-smoke-test`
  `npm run local-test`

Note: To run the script for a different environment, create `config.json`. For example, to run against dev:
  `cd automated-smoke-test`
  `cp config/automation-config-dev.json config/config.json`
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

- TBD

#### Configuration details:

- config.json holds the data level configuration, like user credentials etc
- conf.ts holds the application configuration, like jasmine reporters to be configured, specs to be run etc.
