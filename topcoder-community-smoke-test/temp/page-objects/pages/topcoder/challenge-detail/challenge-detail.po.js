"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var common_po_1 = require("../../../common/common.po");
var protractor_1 = require("protractor");
var ChallengeDetailPageObject = /** @class */ (function () {
    function ChallengeDetailPageObject() {
    }
    Object.defineProperty(ChallengeDetailPageObject, "backButton", {
        get: function () {
            return common_po_1.commonPageObjects.getLinkByAriaLabel('Back to challenge list');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ChallengeDetailPageObject, "registrantsTable", {
        get: function () {
            return common_po_1.commonPageObjects.getLinkByAriaLabel('Registrants');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ChallengeDetailPageObject, "tabPanel", {
        get: function () {
            return protractor_1.element(protractor_1.by.css('[role="tabpanel"]'));
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ChallengeDetailPageObject, "pickFile", {
        get: function () {
            return common_po_1.commonPageObjects.getLinkByAriaLabel('Select file to upload');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ChallengeDetailPageObject, "fileModal", {
        get: function () {
            return protractor_1.element(protractor_1.by.className('fsp-picker'));
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ChallengeDetailPageObject, "inputFile", {
        get: function () {
            return protractor_1.element(protractor_1.by.css('input[type="file"]'));
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ChallengeDetailPageObject, "agreeToTerms", {
        get: function () {
            return protractor_1.element(protractor_1.by.css('label[for="agree"]'));
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ChallengeDetailPageObject, "submitButton", {
        get: function () {
            return common_po_1.commonPageObjects.findElementByText('button', 'Submit');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ChallengeDetailPageObject, "viewMySubmissions", {
        get: function () {
            return common_po_1.commonPageObjects.findElementByText('a', 'View My Submissions');
        },
        enumerable: true,
        configurable: true
    });
    return ChallengeDetailPageObject;
}());
exports.ChallengeDetailPageObject = ChallengeDetailPageObject;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2hhbGxlbmdlLWRldGFpbC5wby5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3BhZ2Utb2JqZWN0cy9wYWdlcy90b3Bjb2Rlci9jaGFsbGVuZ2UtZGV0YWlsL2NoYWxsZW5nZS1kZXRhaWwucG8udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSx1REFBOEQ7QUFDOUQseUNBQXlDO0FBRXpDO0lBQUE7SUFvQ0EsQ0FBQztJQW5DRyxzQkFBVyx1Q0FBVTthQUFyQjtZQUNJLE9BQU8sNkJBQWlCLENBQUMsa0JBQWtCLENBQUMsd0JBQXdCLENBQUMsQ0FBQztRQUMxRSxDQUFDOzs7T0FBQTtJQUVELHNCQUFXLDZDQUFnQjthQUEzQjtZQUNJLE9BQU8sNkJBQWlCLENBQUMsa0JBQWtCLENBQUMsYUFBYSxDQUFDLENBQUM7UUFDL0QsQ0FBQzs7O09BQUE7SUFFRCxzQkFBVyxxQ0FBUTthQUFuQjtZQUNJLE9BQU8sb0JBQU8sQ0FBQyxlQUFFLENBQUMsR0FBRyxDQUFDLG1CQUFtQixDQUFDLENBQUMsQ0FBQztRQUNoRCxDQUFDOzs7T0FBQTtJQUVELHNCQUFXLHFDQUFRO2FBQW5CO1lBQ0ksT0FBTyw2QkFBaUIsQ0FBQyxrQkFBa0IsQ0FBQyx1QkFBdUIsQ0FBQyxDQUFDO1FBQ3pFLENBQUM7OztPQUFBO0lBRUQsc0JBQVcsc0NBQVM7YUFBcEI7WUFDSSxPQUFPLG9CQUFPLENBQUMsZUFBRSxDQUFDLFNBQVMsQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDO1FBQy9DLENBQUM7OztPQUFBO0lBRUQsc0JBQVcsc0NBQVM7YUFBcEI7WUFDSSxPQUFPLG9CQUFPLENBQUMsZUFBRSxDQUFDLEdBQUcsQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDLENBQUM7UUFDakQsQ0FBQzs7O09BQUE7SUFFRCxzQkFBVyx5Q0FBWTthQUF2QjtZQUNJLE9BQU8sb0JBQU8sQ0FBQyxlQUFFLENBQUMsR0FBRyxDQUFDLG9CQUFvQixDQUFDLENBQUMsQ0FBQztRQUNqRCxDQUFDOzs7T0FBQTtJQUVELHNCQUFXLHlDQUFZO2FBQXZCO1lBQ0ksT0FBTyw2QkFBaUIsQ0FBQyxpQkFBaUIsQ0FBQyxRQUFRLEVBQUUsUUFBUSxDQUFDLENBQUM7UUFDbkUsQ0FBQzs7O09BQUE7SUFFRCxzQkFBVyw4Q0FBaUI7YUFBNUI7WUFDSSxPQUFPLDZCQUFpQixDQUFDLGlCQUFpQixDQUFDLEdBQUcsRUFBRSxxQkFBcUIsQ0FBQyxDQUFDO1FBQzNFLENBQUM7OztPQUFBO0lBQ0wsZ0NBQUM7QUFBRCxDQUFDLEFBcENELElBb0NDO0FBcENZLDhEQUF5QiJ9