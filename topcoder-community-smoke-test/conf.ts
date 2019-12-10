import { browser } from "protractor";

var HtmlReporter = require('protractor-beautiful-reporter');
var reporters = require('jasmine-reporters');

declare global {
    namespace NodeJS {
      interface Global {
         document: Document;
         window: Window;
         navigator: Navigator;         
      } 
    }
}

exports.config = {
    directConnect: true,

    // Capabilities to be passed to the webdriver instance.
    capabilities: {
        'browserName': 'chrome',
        chromeOptions: {
            args: ['--headless', '--disable-gpu', '--window-size=1325x744']
        }
    },

    // Framework to use. Jasmine is recommended.
    framework: 'jasmine2',

    specs: [
        '../temp/test-suites/tc-profile.spec.js', 
        '../temp/test-suites/tc-tools.spec.js', 
        '../temp/test-suites/tc-account.spec.js', 
        '../temp/test-suites/tc-preferences.spec.js',

        '../temp/test-suites/tc-challenge-listing.spec.js', 
        '../temp/test-suites/tc-challenge-detail.spec.js', 
        '../temp/test-suites/tc-dashboard.spec.js', 
        '../temp/test-suites/tc-footer.spec.js', 
        '../temp/test-suites/tc-header.spec.js'
    ],

    // Options to be passed to Jasmine.
    jasmineNodeOpts: {
        showColors: true,
        defaultTimeoutInterval: 90000,
        isVerbose: true
    },

    onPrepare: () => {
        browser.manage().window().maximize();
        browser.manage().timeouts().implicitlyWait(5000);
        var junitReporter = new reporters.JUnitXmlReporter({
            savePath: 'test-results',
            consolidateAll: false
        });
        jasmine.getEnv().addReporter(junitReporter);
        // Only for local deployment
        jasmine.getEnv().addReporter(new HtmlReporter({
            baseDirectory: 'test-results',
            preserveDirectory: false, // Preserve base directory
            screenshotsSubfolder: 'screenshots',
            jsonsSubfolder: 'jsons', // JSONs Subfolder
            takeScreenShotsForSkippedSpecs: true, // Screenshots for skipped test cases
            takeScreenShotsOnlyForFailedSpecs: false, // Screenshots only for failed test cases
            docTitle: 'Test Automation Execution Report', // Add title for the html report
            docName: 'TestResult.html', // Change html report file name
            gatherBrowserLogs: true // Store Browser logs
        }).getJasmine2Reporter());
    }
}