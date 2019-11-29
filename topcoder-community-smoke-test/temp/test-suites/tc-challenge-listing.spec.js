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
var registration_constants_1 = require("../page-objects/pages/topcoder/registration/registration.constants");
var registration_helper_1 = require("../page-objects/pages/topcoder/registration/registration.helper");
var login_constants_1 = require("../page-objects/pages/topcoder/login/login.constants");
var login_helper_1 = require("../page-objects/pages/topcoder/login/login.helper");
var challenge_listing_helper_1 = require("../page-objects/pages/topcoder/challenge-listing/challenge-listing.helper");
var header_helper_1 = require("../page-objects/pages/topcoder/header/header.helper");
var dashboard_helper_1 = require("../page-objects/pages/topcoder/dashboard/dashboard.helper");
var profile_helper_1 = require("../page-objects/pages/topcoder/profile/profile.helper");
var payments_helper_1 = require("../page-objects/pages/topcoder/payments/payments.helper");
var settings_helper_1 = require("../page-objects/pages/topcoder/settings/settings.helper");
var home_helper_1 = require("../page-objects/pages/topcoder/home/home.helper");
var search_helper_1 = require("../page-objects/pages/topcoder/search/search.helper");
var arena_helper_1 = require("../page-objects/pages/topcoder/arena/arena.helper");
var challenge_detail_helper_1 = require("../page-objects/pages/topcoder/challenge-detail/challenge-detail.helper");
var common_helper_1 = require("../page-objects/common/common.helper");
describe('Topcoder Challenge Listing Page Tests: ', function () {
    beforeEach(function () {
        protractor_1.browser.driver.manage().window().maximize();
        protractor_1.browser.ignoreSynchronization = true;
    });
    it('should verify whether the current page is redirected to Registration page on clicking the Join button', function () { return __awaiter(_this, void 0, void 0, function () {
        var registrationUrl;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, challenge_listing_helper_1.ChallengeListingPageHelper.get()];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, challenge_listing_helper_1.ChallengeListingPageHelper.clickJoinNow()];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, registration_helper_1.RegistrationPageHelper.waitForRegistrationForm()];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, protractor_1.browser.getCurrentUrl()];
                case 4:
                    registrationUrl = _a.sent();
                    expect(registrationUrl).toEqual(registration_constants_1.RegistrationPageConstants.content.joinNowRedirectionUrl);
                    return [2 /*return*/];
            }
        });
    }); });
    it('should verify whether the current page is redirected to Login page on clicking the Log in button.', function () { return __awaiter(_this, void 0, void 0, function () {
        var loginUrl;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, challenge_listing_helper_1.ChallengeListingPageHelper.get()];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, challenge_listing_helper_1.ChallengeListingPageHelper.clickLogin()];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, login_helper_1.LoginPageHelper.waitForLoginForm()];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, protractor_1.browser.getCurrentUrl()];
                case 4:
                    loginUrl = _a.sent();
                    expect(loginUrl).toEqual(login_constants_1.LoginPageConstants.content.loginRedirectionUrlFromChallengeListingLoginLink);
                    return [2 /*return*/];
            }
        });
    }); });
    it('should verify whether the user is able to search the member by their username/skill using the search icon.', function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, challenge_listing_helper_1.ChallengeListingPageHelper.get()];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, header_helper_1.HeaderHelper.search(common_helper_1.commonPageHelper.getConfigUserName())];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, search_helper_1.SearchPageHelper.verifySearchErrorPage(common_helper_1.commonPageHelper.getConfigUserName())];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, challenge_listing_helper_1.ChallengeListingPageHelper.get()];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, header_helper_1.HeaderHelper.search('Java')];
                case 5:
                    _a.sent();
                    return [4 /*yield*/, search_helper_1.SearchPageHelper.verifySearchErrorPage('Java')];
                case 6:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('should verify whether all the open for registration and Ongoing challenges are listed on clicking the Challenge tab.', function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, challenge_listing_helper_1.ChallengeListingPageHelper.get()];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, challenge_listing_helper_1.ChallengeListingPageHelper.verifyOpenForRegistrationChallenges()];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, challenge_listing_helper_1.ChallengeListingPageHelper.verifyOngoingChallenges()];
                case 3:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('should verify whether login page is opened on clicking the SRM tab.', function () { return __awaiter(_this, void 0, void 0, function () {
        var windows, loginUrl;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, challenge_listing_helper_1.ChallengeListingPageHelper.get()];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, challenge_listing_helper_1.ChallengeListingPageHelper.clickOnSRMTab()];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, protractor_1.browser.getAllWindowHandles()];
                case 3:
                    windows = _a.sent();
                    expect(windows.length).toBe(2);
                    return [4 /*yield*/, protractor_1.browser.switchTo().window(windows[1])];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, login_helper_1.LoginPageHelper.waitForLoginForm()];
                case 5:
                    _a.sent();
                    return [4 /*yield*/, protractor_1.browser.getCurrentUrl()];
                case 6:
                    loginUrl = _a.sent();
                    expect(loginUrl).toEqual(login_constants_1.LoginPageConstants.content.loginRedirectionUrlFromSRMTab);
                    return [4 /*yield*/, protractor_1.browser.close()];
                case 7:
                    _a.sent();
                    return [4 /*yield*/, protractor_1.browser.switchTo().window(windows[0])];
                case 8:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('should verify whether the user is able to search for a challenge by using the Search challenges textbox.', function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, challenge_listing_helper_1.ChallengeListingPageHelper.get()];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, challenge_listing_helper_1.ChallengeListingPageHelper.fillAndVerifySearchResults()];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('should verify that the "Filter" button is working correctly', function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, challenge_listing_helper_1.ChallengeListingPageHelper.get()];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, challenge_listing_helper_1.ChallengeListingPageHelper.verifyFilterToggle()];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('should verify that the "Filter" option "keywords" is working correctly', function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, challenge_listing_helper_1.ChallengeListingPageHelper.get()];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, challenge_listing_helper_1.ChallengeListingPageHelper.verifyFilterByKeywords()];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('should verify that the "Filter" option "Subtrack" is working correctly', function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, challenge_listing_helper_1.ChallengeListingPageHelper.get()];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, challenge_listing_helper_1.ChallengeListingPageHelper.verifyFilterBySubtrack()];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('should verify that the "Filter" option "Sub Community" is working correctly', function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, challenge_listing_helper_1.ChallengeListingPageHelper.get()];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, challenge_listing_helper_1.ChallengeListingPageHelper.verifyFilterBySubCommunity()];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('should verify that the "Filter" option for "Date range" is workingcorrectly', function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, challenge_listing_helper_1.ChallengeListingPageHelper.get()];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, challenge_listing_helper_1.ChallengeListingPageHelper.openFiltersPanel()];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, challenge_listing_helper_1.ChallengeListingPageHelper.selectDateRange()];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, challenge_listing_helper_1.ChallengeListingPageHelper.verifyNumberOfAppliedFilters(1)];
                case 4:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('should verify whether the challenges are filtered according to the keyword/Subtrack/Sub community/Date range fields selected under the Filter function.', function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, challenge_listing_helper_1.ChallengeListingPageHelper.get()];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, challenge_listing_helper_1.ChallengeListingPageHelper.openFiltersPanel()];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, challenge_listing_helper_1.ChallengeListingPageHelper.verifyFilterByKeywordsAndSubTrack()];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, challenge_listing_helper_1.ChallengeListingPageHelper.verifyNumberOfAppliedFilters(2)];
                case 4:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('should verify whether the user is able to select more than one keyword/Subtrack under the filter function.', function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, challenge_listing_helper_1.ChallengeListingPageHelper.get()];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, challenge_listing_helper_1.ChallengeListingPageHelper.openFiltersPanel()];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, challenge_listing_helper_1.ChallengeListingPageHelper.verifyFilterByMultipleKeywords()];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, challenge_listing_helper_1.ChallengeListingPageHelper.verifyFilterByMultipleSubtracks()];
                case 4:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('should verify whether the cross symbol inside the textbox keyword/Subtrack filters removes the selected keyword/Subtrack.', function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, challenge_listing_helper_1.ChallengeListingPageHelper.get()];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, challenge_listing_helper_1.ChallengeListingPageHelper.openFiltersPanel()];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, challenge_listing_helper_1.ChallengeListingPageHelper.verifyFilterByMultipleKeywords()];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, challenge_listing_helper_1.ChallengeListingPageHelper.verifyFilterByMultipleSubtracks()];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, challenge_listing_helper_1.ChallengeListingPageHelper.verifyRemovalOfKeyword()];
                case 5:
                    _a.sent();
                    return [4 /*yield*/, challenge_listing_helper_1.ChallengeListingPageHelper.verifyRemovalOfSubtrack()];
                case 6:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('should verify whether the number of filters applied are shown into Filter button according to the keyword/Subtrack/Sub community/Date range fields selected.', function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, challenge_listing_helper_1.ChallengeListingPageHelper.get()];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, challenge_listing_helper_1.ChallengeListingPageHelper.openFiltersPanel()];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, challenge_listing_helper_1.ChallengeListingPageHelper.selectKeyword('Java')];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, challenge_listing_helper_1.ChallengeListingPageHelper.selectSubtrack('Code')];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, challenge_listing_helper_1.ChallengeListingPageHelper.selectSubCommunity(1)];
                case 5:
                    _a.sent();
                    return [4 /*yield*/, challenge_listing_helper_1.ChallengeListingPageHelper.verifyNumberOfAppliedFilters(2)];
                case 6:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('should verify whether the clear filter button clears all the filters selected and all the challenges are displayed.', function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, challenge_listing_helper_1.ChallengeListingPageHelper.get()];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, challenge_listing_helper_1.ChallengeListingPageHelper.openFiltersPanel()];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, challenge_listing_helper_1.ChallengeListingPageHelper.selectKeyword('Java')];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, challenge_listing_helper_1.ChallengeListingPageHelper.selectSubtrack('Code')];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, challenge_listing_helper_1.ChallengeListingPageHelper.selectSubCommunity(1)];
                case 5:
                    _a.sent();
                    return [4 /*yield*/, challenge_listing_helper_1.ChallengeListingPageHelper.verifyNumberOfAppliedFilters(2)];
                case 6:
                    _a.sent();
                    return [4 /*yield*/, challenge_listing_helper_1.ChallengeListingPageHelper.clearFilters()];
                case 7:
                    _a.sent();
                    return [4 /*yield*/, challenge_listing_helper_1.ChallengeListingPageHelper.verifyNumberOfAppliedFilters(0)];
                case 8:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('should verify whether the Save filter button is deactivated into filter function.', function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, challenge_listing_helper_1.ChallengeListingPageHelper.get()];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, challenge_listing_helper_1.ChallengeListingPageHelper.openFiltersPanel()];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, challenge_listing_helper_1.ChallengeListingPageHelper.selectKeyword('Java')];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, challenge_listing_helper_1.ChallengeListingPageHelper.verifySaveFilterState(false)];
                case 4:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('should verify whether the Sort by select option under the Open for registration/Ongoing Challenges list sorts the challenges according to the selected option.', function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, challenge_listing_helper_1.ChallengeListingPageHelper.get()];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, challenge_listing_helper_1.ChallengeListingPageHelper.verifySortingFunctionality()];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('should verify whether the View more challenges link under the Open for registration/Ongoing Challenges list displays all the Open for registration/Ongoing challenges.', function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, challenge_listing_helper_1.ChallengeListingPageHelper.get()];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, challenge_listing_helper_1.ChallengeListingPageHelper.verifyViewMoreChallenges()];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('should verify that when user selects a challenge "tag", only challenges under the selected tag are shown.', function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, challenge_listing_helper_1.ChallengeListingPageHelper.get()];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, challenge_listing_helper_1.ChallengeListingPageHelper.verifyChallengesByChallengeTag()];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('should verify that the challenge count matches the number of challenges displayed', function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, challenge_listing_helper_1.ChallengeListingPageHelper.get()];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, challenge_listing_helper_1.ChallengeListingPageHelper.verifyChallengeCountByTogglingDevelopment()];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('should verify that the challenge count remains the same when switching to the challenge details and then back to the challenge listings page ', function () { return __awaiter(_this, void 0, void 0, function () {
        var beforeCount, afterCount;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, challenge_listing_helper_1.ChallengeListingPageHelper.get()];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, challenge_listing_helper_1.ChallengeListingPageHelper.getOngoingChallengesCount()];
                case 2:
                    beforeCount = _a.sent();
                    return [4 /*yield*/, challenge_listing_helper_1.ChallengeListingPageHelper.navigateToFirstChallenge()];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, challenge_detail_helper_1.ChallengeDetailPageHelper.clickOnBackButton()];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, challenge_listing_helper_1.ChallengeListingPageHelper.getOngoingChallengesCount()];
                case 5:
                    afterCount = _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('should verify All Challenges link functionality with the design, development, and data sceince toggle switches on', function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, challenge_listing_helper_1.ChallengeListingPageHelper.get()];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, challenge_listing_helper_1.ChallengeListingPageHelper.verifyAllChallenges()];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, challenge_listing_helper_1.ChallengeListingPageHelper.verifyOpenForRegistrationChallengesOnly()];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, challenge_listing_helper_1.ChallengeListingPageHelper.verifyOngoingChallengesOnly()];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, challenge_listing_helper_1.ChallengeListingPageHelper.verifyOpenForReviewChallengesOnly()];
                case 5:
                    _a.sent();
                    return [4 /*yield*/, challenge_listing_helper_1.ChallengeListingPageHelper.verifyPastChallengesOnly()];
                case 6:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('should verify All Challenges link functionality with the design, development, and data sceince toggle switches Off', function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, challenge_listing_helper_1.ChallengeListingPageHelper.get()];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, challenge_listing_helper_1.ChallengeListingPageHelper.verifyWithAllSwitchesTurnedOff()];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('should verify whether the page is redirected to the RSS Feed page on clicking the RSS feed link.', function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, challenge_listing_helper_1.ChallengeListingPageHelper.get()];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, challenge_listing_helper_1.ChallengeListingPageHelper.clickOnRssLink()];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, challenge_listing_helper_1.ChallengeListingPageHelper.verifyRssPage()];
                case 3:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('should verify whether the page is redirected to the respective page on clicking the link(About, Contact, Help, Privacy, Terms).', function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, challenge_listing_helper_1.ChallengeListingPageHelper.get()];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, challenge_listing_helper_1.ChallengeListingPageHelper.verifyLinksUnderRss()];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    describe('After login test cases', function () {
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
        it('should verify whether the current page is redirected to my Dashboard page on clicking the Dashboard under the Username menu.', function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, challenge_listing_helper_1.ChallengeListingPageHelper.get()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, header_helper_1.HeaderHelper.clickOnDashboardLink()];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, dashboard_helper_1.DashboardPageHelper.verifyDashboardPage()];
                    case 3:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('should verify whether the current page is redirected to my profile page on clicking the my profile under the Username menu.', function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, challenge_listing_helper_1.ChallengeListingPageHelper.get()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, header_helper_1.HeaderHelper.clickOnMyProfileLink()];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, profile_helper_1.ProfilePageHelper.verifyProfilePage()];
                    case 3:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('should verify whether the current page is redirected to the payments page on clicking the payments under the Username menu.', function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, challenge_listing_helper_1.ChallengeListingPageHelper.get()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, header_helper_1.HeaderHelper.clickOnPaymentsLink()];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, payments_helper_1.PaymentsPageHelper.verifyPaymentsPage()];
                    case 3:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('should verify whether the current page is redirected to the settings page on clicking the settings under the Username menu.', function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, challenge_listing_helper_1.ChallengeListingPageHelper.get()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, header_helper_1.HeaderHelper.clickOnSettingsLink()];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, settings_helper_1.SettingsPageHelper.verifySettingsPage()];
                    case 3:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('should verify whether the user is able to search the member by their username/skill using the search icon.', function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, challenge_listing_helper_1.ChallengeListingPageHelper.get()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, header_helper_1.HeaderHelper.search(common_helper_1.commonPageHelper.getConfigUserName())];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, search_helper_1.SearchPageHelper.verifySearchErrorPage(common_helper_1.commonPageHelper.getConfigUserName())];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, challenge_listing_helper_1.ChallengeListingPageHelper.get()];
                    case 4:
                        _a.sent();
                        return [4 /*yield*/, header_helper_1.HeaderHelper.search('Java')];
                    case 5:
                        _a.sent();
                        return [4 /*yield*/, search_helper_1.SearchPageHelper.verifySearchErrorPage('Java')];
                    case 6:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('should verify whether all the my challenges, open for registration and Ongoing challenges are listed on clicking the Challenge tab.', function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, challenge_listing_helper_1.ChallengeListingPageHelper.get()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, challenge_listing_helper_1.ChallengeListingPageHelper.verifyChallengesAfterLogin()];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('should verify whether the Topcoder arena page is opened on clicking the SRM tab. ', function () { return __awaiter(_this, void 0, void 0, function () {
            var windows;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, challenge_listing_helper_1.ChallengeListingPageHelper.get()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, challenge_listing_helper_1.ChallengeListingPageHelper.clickOnSRMTab()];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, protractor_1.browser.getAllWindowHandles()];
                    case 3:
                        windows = _a.sent();
                        expect(windows.length).toBe(2);
                        return [4 /*yield*/, protractor_1.browser.switchTo().window(windows[1])];
                    case 4:
                        _a.sent();
                        return [4 /*yield*/, arena_helper_1.ArenaPageHelper.verifyArenaPage()];
                    case 5:
                        _a.sent();
                        return [4 /*yield*/, protractor_1.browser.driver.close()];
                    case 6:
                        _a.sent();
                        return [4 /*yield*/, protractor_1.browser.switchTo().window(windows[0])];
                    case 7:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('should verify whether the logout happens on clicking the logout under the Username menu.', function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, challenge_listing_helper_1.ChallengeListingPageHelper.get()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, header_helper_1.HeaderHelper.clickOnLogoutLink()];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, home_helper_1.HomePageHelper.verifyHomePage()];
                    case 3:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGMtY2hhbGxlbmdlLWxpc3Rpbmcuc3BlYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3Rlc3Qtc3VpdGVzL3RjLWNoYWxsZW5nZS1saXN0aW5nLnNwZWMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsaUJBaVJHOztBQWpSSCx5Q0FBcUM7QUFDckMsNkdBQStHO0FBQy9HLHVHQUF5RztBQUN6Ryx3RkFBMEY7QUFDMUYsa0ZBQW9GO0FBQ3BGLHNIQUF1SDtBQUN2SCxxRkFBbUY7QUFDbkYsOEZBQWdHO0FBQ2hHLHdGQUEwRjtBQUMxRiwyRkFBNkY7QUFDN0YsMkZBQTZGO0FBQzdGLCtFQUFpRjtBQUNqRixxRkFBdUY7QUFDdkYsa0ZBQW9GO0FBQ3BGLG1IQUFvSDtBQUNwSCxzRUFBd0U7QUFFeEUsUUFBUSxDQUFDLHlDQUF5QyxFQUFFO0lBRWhELFVBQVUsQ0FBQztRQUNQLG9CQUFPLENBQUMsTUFBTSxDQUFDLE1BQU0sRUFBRSxDQUFDLE1BQU0sRUFBRSxDQUFDLFFBQVEsRUFBRSxDQUFDO1FBQzVDLG9CQUFPLENBQUMscUJBQXFCLEdBQUcsSUFBSSxDQUFDO0lBQ3pDLENBQUMsQ0FBQyxDQUFDO0lBRUgsRUFBRSxDQUFDLHVHQUF1RyxFQUFFOzs7O3dCQUN4RyxxQkFBTSxxREFBMEIsQ0FBQyxHQUFHLEVBQUUsRUFBQTs7b0JBQXRDLFNBQXNDLENBQUM7b0JBQ3ZDLHFCQUFNLHFEQUEwQixDQUFDLFlBQVksRUFBRSxFQUFBOztvQkFBL0MsU0FBK0MsQ0FBQztvQkFDaEQscUJBQU0sNENBQXNCLENBQUMsdUJBQXVCLEVBQUUsRUFBQTs7b0JBQXRELFNBQXNELENBQUM7b0JBQy9CLHFCQUFNLG9CQUFPLENBQUMsYUFBYSxFQUFFLEVBQUE7O29CQUEvQyxlQUFlLEdBQUcsU0FBNkI7b0JBQ3JELE1BQU0sQ0FBQyxlQUFlLENBQUMsQ0FBQyxPQUFPLENBQUMsa0RB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