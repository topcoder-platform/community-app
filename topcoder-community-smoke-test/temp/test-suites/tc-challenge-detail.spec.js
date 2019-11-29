"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
var protractor_1 = require("protractor");
var challenge_listing_helper_1 = require("../page-objects/pages/topcoder/challenge-listing/challenge-listing.helper");
var login_helper_1 = require("../page-objects/pages/topcoder/login/login.helper");
var challenge_listing_constants_1 = require("../page-objects/pages/topcoder/challenge-listing/challenge-listing.constants");
var challenge_detail_helper_1 = require("../page-objects/pages/topcoder/challenge-detail/challenge-detail.helper");
var submission_helper_1 = require("../page-objects/pages/topcoder/submission/submission.helper");
var scorecard_helper_1 = require("../page-objects/pages/topcoder/scorecard/scorecard.helper");
var terms_helper_1 = require("../page-objects/pages/topcoder/terms/terms.helper");
var config = require("../config.json");
var header_helper_1 = require("../page-objects/pages/topcoder/header/header.helper");
var home_helper_1 = require("../page-objects/pages/topcoder/home/home.helper");
describe('Topcoder Challenge Detail Page Tests: ', function () {
    beforeEach(function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, protractor_1.browser.driver.manage().window().maximize()];
                case 1:
                    _a.sent();
                    protractor_1.browser.ignoreSynchronization = true;
                    return [2 /*return*/];
            }
        });
    }); });
    it('should verify whether the  error message is displayed on clicking the Challenge Terms link.', function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, challenge_detail_helper_1.ChallengeDetailPageHelper.get()];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, challenge_detail_helper_1.ChallengeDetailPageHelper.clickOnTermsLink()];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, terms_helper_1.TermsPageHelper.verifyTermsAuthenticationError()];
                case 3:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    describe('Pre-condition of login', function () {
        beforeAll(function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, login_helper_1.LoginPageHelper.get()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, login_helper_1.LoginPageHelper.waitForLoginForm()];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, login_helper_1.LoginPageHelper.fillLoginForm(false)];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, login_helper_1.LoginPageHelper.waitForLoginSuccessWithoutLoggingOut()];
                    case 4:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        afterAll(function () { return __awaiter(_this, void 0, void 0, function () {
            var e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 4, , 6]);
                        return [4 /*yield*/, challenge_listing_helper_1.ChallengeListingPageHelper.get()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, header_helper_1.HeaderHelper.clickOnLogoutLink()];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, home_helper_1.HomePageHelper.verifyHomePage()];
                    case 3:
                        _a.sent();
                        return [3 /*break*/, 6];
                    case 4:
                        e_1 = _a.sent();
                        return [4 /*yield*/, protractor_1.browser.restart()];
                    case 5:
                        _a.sent();
                        return [3 /*break*/, 6];
                    case 6: return [2 /*return*/];
                }
            });
        }); });
        it('should verify that back button redirects user to challenge', function () { return __awaiter(_this, void 0, void 0, function () {
            var url;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, challenge_listing_helper_1.ChallengeListingPageHelper.get()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, challenge_detail_helper_1.ChallengeDetailPageHelper.get()];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, challenge_detail_helper_1.ChallengeDetailPageHelper.clickOnBackButton()];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, protractor_1.browser.getCurrentUrl()];
                    case 4:
                        url = _a.sent();
                        expect(url).toEqual(challenge_listing_constants_1.ChallengeListingPageConstants.url);
                        return [2 /*return*/];
                }
            });
        }); });
        it('should verify that a user is able to successfully enter a submission to a code challenge', function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, challenge_detail_helper_1.ChallengeDetailPageHelper.getUsingCustomUrl(config.challengeDetail.customUrl)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, challenge_detail_helper_1.ChallengeDetailPageHelper.registerIfNotAlreadyRegistered()];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, challenge_detail_helper_1.ChallengeDetailPageHelper.uploadSubmission()];
                    case 3:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('should verify whether the user is registered to the particular challenge on clicking the Register button.', function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, challenge_detail_helper_1.ChallengeDetailPageHelper.get()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, challenge_detail_helper_1.ChallengeDetailPageHelper.register()];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, challenge_detail_helper_1.ChallengeDetailPageHelper.verifyChallengeForumLink()];
                    case 3:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('should verify whether the user is unregistered into particular challenge on clicking the UnRegister button.', function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, challenge_detail_helper_1.ChallengeDetailPageHelper.get()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, challenge_detail_helper_1.ChallengeDetailPageHelper.register()];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, challenge_detail_helper_1.ChallengeDetailPageHelper.unregister()];
                    case 3:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('should verify whether the user is redirected to the Submission page on clicking the Submit button.', function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, challenge_detail_helper_1.ChallengeDetailPageHelper.get()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, challenge_detail_helper_1.ChallengeDetailPageHelper.register()];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, challenge_detail_helper_1.ChallengeDetailPageHelper.clickOnSubmitButton()];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, submission_helper_1.SubmissionPageHelper.verifySubmissionPage()];
                    case 4:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('should verify whether the deadlines(time zone) for the particular challenge on clicking the show Deadlines.', function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, challenge_detail_helper_1.ChallengeDetailPageHelper.get()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, challenge_detail_helper_1.ChallengeDetailPageHelper.verifyDeadlines()];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('should verify whether the details of the challenges are displayed on clicking the Details tab.', function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, challenge_detail_helper_1.ChallengeDetailPageHelper.get()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, challenge_detail_helper_1.ChallengeDetailPageHelper.switchToDetailsTab()];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, challenge_detail_helper_1.ChallengeDetailPageHelper.verifyDetailsTab()];
                    case 3:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('should verify whether the registered members of the challenges are displayed on clicking the Registrants tab.', function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, challenge_detail_helper_1.ChallengeDetailPageHelper.get()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, challenge_detail_helper_1.ChallengeDetailPageHelper.switchToRegistrantsTab()];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, challenge_detail_helper_1.ChallengeDetailPageHelper.verifyRegistrantsTab()];
                    case 3:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('should verify whether the  Solution submitted members  are displayed on clicking the Submissions tab.', function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, challenge_detail_helper_1.ChallengeDetailPageHelper.get()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, challenge_detail_helper_1.ChallengeDetailPageHelper.switchToSubmissionsTab()];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, challenge_detail_helper_1.ChallengeDetailPageHelper.verifySubmissionsTab()];
                    case 3:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('should verify whether the  user is redirected to the Review Scorecard page on clicking the Review Scorecard link.', function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, challenge_detail_helper_1.ChallengeDetailPageHelper.get()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, challenge_detail_helper_1.ChallengeDetailPageHelper.clickOnReviewScorecardLink()];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, scorecard_helper_1.ScorecardPageHelper.verifyScorecardPage()];
                    case 3:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('should verify whether the  user is redirected to the Challenge Terms page on clicking the Challenge Terms link.', function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, challenge_detail_helper_1.ChallengeDetailPageHelper.get()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, challenge_detail_helper_1.ChallengeDetailPageHelper.clickOnTermsLink()];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, terms_helper_1.TermsPageHelper.verifyTermsPage()];
                    case 3:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGMtY2hhbGxlbmdlLWRldGFpbC5zcGVjLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vdGVzdC1zdWl0ZXMvdGMtY2hhbGxlbmdlLWRldGFpbC5zcGVjLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLGlCQWdIRzs7QUFoSEgseUNBQXFDO0FBQ3JDLHNIQUF1SDtBQUN2SCxrRkFBb0Y7QUFDcEYsNEhBQTZIO0FBQzdILG1IQUFvSDtBQUVwSCxpR0FBbUc7QUFDbkcsOEZBQWdHO0FBQ2hHLGtGQUFvRjtBQUNwRix1Q0FBeUM7QUFDekMscUZBQW1GO0FBQ25GLCtFQUFpRjtBQUVqRixRQUFRLENBQUMsd0NBQXdDLEVBQUU7SUFDL0MsVUFBVSxDQUFDOzs7d0JBQ1AscUJBQU0sb0JBQU8sQ0FBQyxNQUFNLENBQUMsTUFBTSxFQUFFLENBQUMsTUFBTSxFQUFFLENBQUMsUUFBUSxFQUFFLEVBQUE7O29CQUFqRCxTQUFpRCxDQUFDO29CQUNsRCxvQkFBTyxDQUFDLHFCQUFxQixHQUFHLElBQUksQ0FBQzs7OztTQUN4QyxDQUFDLENBQUM7SUFFSCxFQUFFLENBQUMsNkZBQTZGLEVBQUU7Ozt3QkFDOUYscUJBQU0sbURBQXlCLENBQUMsR0FBRyxFQUFFLEVBQUE7O29CQUFyQyxTQUFxQyxDQUFDO29CQUN0QyxxQkFBTSxtREFBeUIsQ0FBQyxnQkFBZ0IsRUFBRSxFQUFBOztvQkFBbEQsU0FBa0QsQ0FBQztvQkFDbkQscUJBQU0sOEJBQWUsQ0FBQyw4QkFBOEIsRUFBRSxFQUFBOztvQkFBdEQsU0FBc0QsQ0FBQzs7OztTQUMxRCxDQUFDLENBQUM7SUFFSCxRQUFRLENBQUMsd0JBQXdCLEVBQUU7UUFDL0IsU0FBUyxDQUFDOzs7NEJBQ04scUJBQU0sOEJBQWUsQ0FBQyxHQUFHLEVBQUUsRUFBQTs7d0JBQTNCLFNBQTJCLENBQUM7d0JBQzVCLHFCQUFNLDhCQUFlLENBQUMsZ0JB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