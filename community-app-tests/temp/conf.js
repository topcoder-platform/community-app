"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var protractor_1 = require("protractor");
var reporters = require("jasmine-reporters");
var HtmlReporter = require("protractor-beautiful-reporter");
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
    onPrepare: function () {
        protractor_1.browser
            .manage()
            .window()
            .maximize();
        protractor_1.browser
            .manage()
            .timeouts()
            .implicitlyWait(5000);
        var junitReporter = new reporters.JUnitXmlReporter({
            consolidateAll: false,
            savePath: "test-results"
        });
        jasmine.getEnv().addReporter(junitReporter);
        jasmine.getEnv().addReporter(new HtmlReporter({
            baseDirectory: "test-results",
            docName: "TestResult.html",
            docTitle: "Test Automation Execution Report",
            gatherBrowserLogs: true,
            jsonsSubfolder: "jsons",
            preserveDirectory: false,
            screenshotsSubfolder: "screenshots",
            takeScreenShotsForSkippedSpecs: true,
            takeScreenShotsOnlyForFailedSpecs: false // Screenshots only for failed test cases
        }).getJasmine2Reporter());
    }
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29uZi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL2NvbmYudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSx5Q0FBcUM7QUFFckMsNkNBQWdEO0FBQ2hELDREQUErRDtBQWMvRCxPQUFPLENBQUMsTUFBTSxHQUFHO0lBQ2YsYUFBYSxFQUFFLElBQUk7SUFFbkIsdURBQXVEO0lBQ3ZELFlBQVksRUFBRTtRQUNaLFdBQVcsRUFBRSxRQUFRO1FBQ3JCLGFBQWEsRUFBRTtZQUNiLElBQUksRUFBRSxDQUFDLFlBQVksRUFBRSxlQUFlLEVBQUUsd0JBQXdCLENBQUM7WUFDL0Qsb0RBQW9EO1NBQ3JEO0tBQ0Y7SUFFRCw0Q0FBNEM7SUFDNUMsU0FBUyxFQUFFLFVBQVU7SUFFckIsS0FBSyxFQUFFO1FBQ0wsc0NBQXNDO1FBQ3RDLHNDQUFzQztLQUN2QztJQUVELG1DQUFtQztJQUNuQyxlQUFlLEVBQUU7UUFDZixzQkFBc0IsRUFBRSxLQUFLO1FBQzdCLFNBQVMsRUFBRSxJQUFJO1FBQ2YsVUFBVSxFQUFFLElBQUk7S0FDakI7SUFFRCxTQUFTLEVBQUU7UUFDVCxvQkFBTzthQUNKLE1BQU0sRUFBRTthQUNSLE1BQU0sRUFBRTthQUNSLFFBQVEsRUFBRSxDQUFDO1FBQ2Qsb0JBQU87YUFDSixNQUFNLEVBQUU7YUFDUixRQUFRLEVBQUU7YUFDVixjQUFjLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDeEIsSUFBTSxhQUFhLEdBQUcsSUFBSSxTQUFTLENBQUMsZ0JBQWdCLENBQUM7WUFDbkQsY0FBYyxFQUFFLEtBQUs7WUFDckIsUUFBUSxFQUFFLGNBQWM7U0FDekIsQ0FBQyxDQUFDO1FBQ0gsT0FBTyxDQUFDLE1BQU0sRUFBRSxDQUFDLFdBQVcsQ0FBQyxhQUFhLENBQUMsQ0FBQztRQUM1QyxPQUFPLENBQUMsTUFBTSxFQUFFLENBQUMsV0FBVyxDQUMxQixJQUFJLFlBQVksQ0FBQztZQUNmLGFBQWEsRUFBRSxjQUFjO1lBQzdCLE9BQU8sRUFBRSxpQkFBaUI7WUFDMUIsUUFBUSxFQUFFLGtDQUFrQztZQUM1QyxpQkFBaUIsRUFBRSxJQUFJO1lBQ3ZCLGNBQWMsRUFBRSxPQUFPO1lBQ3ZCLGlCQUFpQixFQUFFLEtBQUs7WUFDeEIsb0JBQW9CLEVBQUUsYUFBYTtZQUNuQyw4QkFBOEIsRUFBRSxJQUFJO1lBQ3BDLGlDQUFpQyxFQUFFLEtBQUssQ0FBQyx5Q0FBeUM7U0FDbkYsQ0FBQyxDQUFDLG1CQUFtQixFQUFFLENBQ3pCLENBQUM7SUFDSixDQUFDO0NBQ0YsQ0FBQyJ9