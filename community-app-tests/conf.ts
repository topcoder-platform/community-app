import { browser } from "protractor";

import reporters = require("jasmine-reporters");
import HtmlReporter = require("protractor-beautiful-reporter");

declare global {
  namespace NodeJS {
    interface IGlobal {
      document: Document;
      window: Window;
      navigator: Navigator;
      forgotPasswordMailListener: any;
      registrationMailListener: any;
    }
  }
}

exports.config = {
  directConnect: true,

  // Capabilities to be passed to the webdriver instance.
  capabilities: {
    browserName: "chrome",
    chromeOptions: {
      args: ["--headless", "--disable-gpu", "--window-size=1325x744"]
      // args: ["--disable-gpu", "--window-size=1325x744"]
    }
  },

  // Framework to use. Jasmine is recommended.
  framework: "jasmine2",

  specs: [
    "../temp/test-suites/tc-login.spec.js",
    "../temp/test-suites/tc-tools.spec.js"
  ],

  // Options to be passed to Jasmine.
  jasmineNodeOpts: {
    defaultTimeoutInterval: 90000,
    isVerbose: true,
    showColors: true
  },

  onPrepare: () => {
    browser
      .manage()
      .window()
      .maximize();
    browser
      .manage()
      .timeouts()
      .implicitlyWait(5000);
    const junitReporter = new reporters.JUnitXmlReporter({
      consolidateAll: false,
      savePath: "test-results"
    });
    jasmine.getEnv().addReporter(junitReporter);
    jasmine.getEnv().addReporter(
      new HtmlReporter({
        baseDirectory: "test-results",
        docName: "TestResult.html", // Change html report file name
        docTitle: "Test Automation Execution Report", // Add title for the html report
        gatherBrowserLogs: true, // Store Browser logs
        jsonsSubfolder: "jsons", // JSONs Subfolder
        preserveDirectory: false, // Preserve base directory
        screenshotsSubfolder: "screenshots",
        takeScreenShotsForSkippedSpecs: true, // Screenshots for skipped test cases
        takeScreenShotsOnlyForFailedSpecs: false // Screenshots only for failed test cases
      }).getJasmine2Reporter()
    );
  }
};
