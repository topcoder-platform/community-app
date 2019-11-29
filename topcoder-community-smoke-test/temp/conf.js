"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var protractor_1 = require("protractor");
var HtmlReporter = require('protractor-beautiful-reporter');
var reporters = require('jasmine-reporters');
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
        // '../temp/test-suites/tc-profile.spec.js', 
        // '../temp/test-suites/tc-tools.spec.js', 
        // '../temp/test-suites/tc-account.spec.js', 
        '../temp/test-suites/tc-preferences.spec.js',
    ],
    // Options to be passed to Jasmine.
    jasmineNodeOpts: {
        showColors: true,
        defaultTimeoutInterval: 90000,
        isVerbose: true
    },
    onPrepare: function () {
        protractor_1.browser.manage().window().maximize();
        protractor_1.browser.manage().timeouts().implicitlyWait(5000);
        var junitReporter = new reporters.JUnitXmlReporter({
            savePath: 'test-results',
            consolidateAll: false
        });
        jasmine.getEnv().addReporter(junitReporter);
        // Only for local deployment
        jasmine.getEnv().addReporter(new HtmlReporter({
            baseDirectory: 'test-results',
            preserveDirectory: false,
            screenshotsSubfolder: 'screenshots',
            jsonsSubfolder: 'jsons',
            takeScreenShotsForSkippedSpecs: true,
            takeScreenShotsOnlyForFailedSpecs: false,
            docTitle: 'Test Automation Execution Report',
            docName: 'TestResult.html',
            gatherBrowserLogs: true // Store Browser logs
        }).getJasmine2Reporter());
    }
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29uZi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL2NvbmYudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSx5Q0FBcUM7QUFFckMsSUFBSSxZQUFZLEdBQUcsT0FBTyxDQUFDLCtCQUErQixDQUFDLENBQUM7QUFDNUQsSUFBSSxTQUFTLEdBQUcsT0FBTyxDQUFDLG1CQUFtQixDQUFDLENBQUM7QUFZN0MsT0FBTyxDQUFDLE1BQU0sR0FBRztJQUNiLGFBQWEsRUFBRSxJQUFJO0lBRW5CLHVEQUF1RDtJQUN2RCxZQUFZLEVBQUU7UUFDVixhQUFhLEVBQUUsUUFBUTtRQUN2QixhQUFhLEVBQUU7WUFDWCxJQUFJLEVBQUUsQ0FBQyxZQUFZLEVBQUUsZUFBZSxFQUFFLHdCQUF3QixDQUFDO1NBQ2xFO0tBQ0o7SUFFRCw0Q0FBNEM7SUFDNUMsU0FBUyxFQUFFLFVBQVU7SUFFckIsS0FBSyxFQUFFO1FBQ0gsNkNBQTZDO1FBQzdDLDJDQUEyQztRQUMzQyw2Q0FBNkM7UUFDNUMsNENBQTRDO0tBT2hEO0lBRUQsbUNBQW1DO0lBQ25DLGVBQWUsRUFBRTtRQUNiLFVBQVUsRUFBRSxJQUFJO1FBQ2hCLHNCQUFzQixFQUFFLEtBQUs7UUFDN0IsU0FBUyxFQUFFLElBQUk7S0FDbEI7SUFFRCxTQUFTLEVBQUU7UUFDUCxvQkFBTyxDQUFDLE1BQU0sRUFBRSxDQUFDLE1BQU0sRUFBRSxDQUFDLFFBQVEsRUFBRSxDQUFDO1FBQ3JDLG9CQUFPLENBQUMsTUFBTSxFQUFFLENBQUMsUUFBUSxFQUFFLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ2pELElBQUksYUFBYSxHQUFHLElBQUksU0FBUyxDQUFDLGdCQUFnQixDQUFDO1lBQy9DLFFBQVEsRUFBRSxjQUFjO1lBQ3hCLGNBQWMsRUFBRSxLQUFLO1NBQ3hCLENBQUMsQ0FBQztRQUNILE9BQU8sQ0FBQyxNQUFNLEVBQUUsQ0FBQyxXQUFXLENBQUMsYUFBYSxDQUFDLENBQUM7UUFDNUMsNEJBQTRCO1FBQzVCLE9BQU8sQ0FBQyxNQUFNLEVBQUUsQ0FBQyxXQUFXLENBQUMsSUFBSSxZQUFZLENBQUM7WUFDMUMsYUFBYSxFQUFFLGNBQWM7WUFDN0IsaUJBQWlCLEVBQUUsS0FBSztZQUN4QixvQkFBb0IsRUFBRSxhQUFhO1lBQ25DLGNBQWMsRUFBRSxPQUFPO1lBQ3ZCLDhCQUE4QixFQUFFLElBQUk7WUFDcEMsaUNBQWlDLEVBQUUsS0FBSztZQUN4QyxRQUFRLEVBQUUsa0NBQWtDO1lBQzVDLE9BQU8sRUFBRSxpQkFBaUI7WUFDMUIsaUJBQWlCLEVBQUUsSUFBSSxDQUFDLHFCQUFxQjtTQUNoRCxDQUFDLENBQUMsbUJBQW1CLEVBQUUsQ0FBQyxDQUFDO0lBQzlCLENBQUM7Q0FDSixDQUFBIn0=