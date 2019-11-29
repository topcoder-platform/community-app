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
var preferences_helper_1 = require("../page-objects/pages/topcoder/preferences/preferences.helper");
var protractor_1 = require("protractor");
var login_helper_1 = require("../page-objects/pages/topcoder/login/login.helper");
var preferences_constants_1 = require("../page-objects/pages/topcoder/preferences/preferences.constants");
var header_helper_1 = require("../page-objects/pages/topcoder/header/header.helper");
var home_helper_1 = require("../page-objects/pages/topcoder/home/home.helper");
var challenge_listing_helper_1 = require("../page-objects/pages/topcoder/challenge-listing/challenge-listing.helper");
describe('Topcoder Preferences Page Tests: ', function () {
    beforeAll(function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, protractor_1.browser.driver.manage().window().maximize()];
                case 1:
                    _a.sent();
                    protractor_1.browser.ignoreSynchronization = false;
                    return [4 /*yield*/, login_helper_1.LoginPageHelper.get()];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, login_helper_1.LoginPageHelper.waitForLoginForm()];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, login_helper_1.LoginPageHelper.fillLoginForm(false)];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, login_helper_1.LoginPageHelper.waitForLoginSuccessWithoutLoggingOut()];
                case 5:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    afterAll(function () { return __awaiter(_this, void 0, void 0, function () {
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
    it('should Verify User can update Email Preferences', function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, preferences_helper_1.PreferencesPageHelper.get()];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, preferences_helper_1.PreferencesPageHelper.verifyEmailPreferences()];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it("should Verify User can redirect to forums's setting page", function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, preferences_helper_1.PreferencesPageHelper.verifyExternalLink('forum', preferences_constants_1.PreferencesPageConstants.content.forumUrl)];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('should Verify User can redirect to Payment details page', function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, preferences_helper_1.PreferencesPageHelper.verifyExternalLink('payment', preferences_constants_1.PreferencesPageConstants.content.paymentUrl)];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('should Verify User can redirect to Request visa letter page', function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, preferences_helper_1.PreferencesPageHelper.verifyExternalLink('invitation letter', preferences_constants_1.PreferencesPageConstants.content.invitationLetterUrl)];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('should Verify User can redirect to Referrals page', function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, preferences_helper_1.PreferencesPageHelper.verifyExternalLink('referrals', preferences_constants_1.PreferencesPageConstants.content.referralsUrl)];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGMtcHJlZmVyZW5jZXMuc3BlYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3Rlc3Qtc3VpdGVzL3RjLXByZWZlcmVuY2VzLnNwZWMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsaUJBNkNHOztBQTdDSCxvR0FBc0c7QUFDdEcseUNBQXFDO0FBQ3JDLGtGQUFvRjtBQUNwRiwwR0FBNEc7QUFDNUcscUZBQW1GO0FBQ25GLCtFQUFpRjtBQUNqRixzSEFBdUg7QUFFdkgsUUFBUSxDQUFDLG1DQUFtQyxFQUFFO0lBQzFDLFNBQVMsQ0FBQzs7O3dCQUNOLHFCQUFNLG9CQUFPLENBQUMsTUFBTSxDQUFDLE1BQU0sRUFBRSxDQUFDLE1BQU0sRUFBRSxDQUFDLFFBQVEsRUFBRSxFQUFBOztvQkFBakQsU0FBaUQsQ0FBQztvQkFDbEQsb0JBQU8sQ0FBQyxxQkFBcUIsR0FBRyxLQUFLLENBQUM7b0JBRXRDLHFCQUFNLDhCQUFlLENBQUMsR0FBRyxFQUFFLEVBQUE7O29CQUEzQixTQUEyQixDQUFDO29CQUM1QixxQkFBTSw4QkFBZSxDQUFDLGdCQUFnQixFQUFFLEVBQUE7O29CQUF4QyxTQUF3QyxDQUFDO29CQUN6QyxxQkFBTSw4QkFBZSxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsRUFBQTs7b0JBQTFDLFNBQTBDLENBQUM7b0JBQzNDLHFCQUFNLDhCQUFlLENBQUMsb0NBQW9DLEVBQUUsRUFBQTs7b0JBQTVELFNBQTRELENBQUM7Ozs7U0FDaEUsQ0FBQyxDQUFDO0lBRUgsUUFBUSxDQUFDOzs7d0JBQ0wscUJBQU0scURBQTBCLENBQUMsR0FBRyxFQUFFLEVBQUE7O29CQUF0QyxTQUFzQyxDQUFDO29CQUN2QyxxQkFBTSw0QkFBWSxDQUFDLGlCQUFpQixFQUFFLEVBQUE7O29CQUF0QyxTQUFzQyxDQUFDO29CQUN2QyxxQkFBTSw0QkFBYyxDQUFDLGNBQWMsRUFBRSxFQUFBOztvQkFBckMsU0FBcUMsQ0FBQzs7OztTQUN6QyxDQUFDLENBQUM7SUFFSCxFQUFFLENBQUMsaURBQWlELEVBQUU7Ozt3QkFDbEQscUJBQU0sMENBQXFCLENBQUMsR0FBRyxFQUFFLEVBQUE7O29CQUFqQyxTQUFpQyxDQUFDO29CQUNsQyxxQkFBTSwwQ0FBcUIsQ0FBQyxzQkFBc0IsRUFBRSxFQUFBOztvQkFBcEQsU0FBb0QsQ0FBQzs7OztTQUN4RCxDQUFDLENBQUM7SUFFSCxFQUFFLENBQUMsMERBQTBELEVBQUU7Ozt3QkFDM0QscUJBQU0sMENBQXFCLENBQUMsa0JBQWtCLENBQUMsT0FBTyxFQUFFLGdEQUF3QixDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsRUFBQTs7b0JBQWxHLFNBQWtHLENBQUM7Ozs7U0FDdEcsQ0FBQyxDQUFDO0lBRUgsRUFBRSxDQUFDLHlEQUF5RCxFQUFFOzs7d0JBQzFELHFCQUFNLDBDQUFxQixDQUFDLGtCQUFrQixDQUFDLFNBQVMsRUFBRSxnREFBd0IsQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDLEVBQUE7O29CQUF0RyxTQUFzRyxDQUFDOzs7O1NBQzFHLENBQUMsQ0FBQztJQUVILEVBQUUsQ0FBQyw2REFBNkQsRUFBRTs7O3dCQUM5RCxxQkFBTSwwQ0FBcUIsQ0FBQyxrQkFBa0IsQ0FBQyxtQkFBbUIsRUFBRSxnREFBd0IsQ0FBQyxPQUFPLENBQUMsbUJBQW1CLENBQUMsRUFBQTs7b0JBQXpILFNBQXlILENBQUM7Ozs7U0FDN0gsQ0FBQyxDQUFDO0lBRUgsRUFBRSxDQUFDLG1EQUFtRCxFQUFFOzs7d0JBQ3BELHFCQUFNLDBDQUFxQixDQUFDLGtCQUFrQixDQUFDLFdBQVcsRUFBRSxnREFBd0IsQ0FBQyxPQUFPLENBQUMsWUFBWSxDQUFDLEVBQUE7O29CQUExRyxTQUEwRyxDQUFDOzs7O1NBQzlHLENBQUMsQ0FBQztBQUNQLENBQUMsQ0FBQyxDQUFDIn0=