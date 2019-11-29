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
var dashboard_helper_1 = require("../page-objects/pages/topcoder/dashboard/dashboard.helper");
var login_helper_1 = require("../page-objects/pages/topcoder/login/login.helper");
var dashboard_constants_1 = require("../page-objects/pages/topcoder/dashboard/dashboard.constants");
var challenge_listing_helper_1 = require("../page-objects/pages/topcoder/challenge-listing/challenge-listing.helper");
var home_helper_1 = require("../page-objects/pages/topcoder/home/home.helper");
var header_helper_1 = require("../page-objects/pages/topcoder/header/header.helper");
describe('Topcoder Dashboard Tests: ', function () {
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
    describe('After login tests', function () {
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
        it('To verify that user is able to view dashboard when logged in', function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, dashboard_helper_1.DashboardPageHelper.get()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, dashboard_helper_1.DashboardPageHelper.verifyDashboardPage()];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    it('should verify whether the user is redirected to the topcoder social sites on clicking the social sites icon.', function () { return __awaiter(_this, void 0, void 0, function () {
        var url;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, dashboard_helper_1.DashboardPageHelper.get()];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, login_helper_1.LoginPageHelper.waitForLoginForm()];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, protractor_1.browser.getCurrentUrl()];
                case 3:
                    url = _a.sent();
                    expect(url).toEqual(dashboard_constants_1.DashboardPageConstants.content.loginRedirectionUrl);
                    return [2 /*return*/];
            }
        });
    }); });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGMtZGFzaGJvYXJkLnNwZWMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi90ZXN0LXN1aXRlcy90Yy1kYXNoYm9hcmQuc3BlYy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSxpQkF3Q0c7O0FBeENILHlDQUFxQztBQUNyQyw4RkFBZ0c7QUFDaEcsa0ZBQW9GO0FBQ3BGLG9HQUFzRztBQUN0RyxzSEFBdUg7QUFDdkgsK0VBQWlGO0FBQ2pGLHFGQUFtRjtBQUVuRixRQUFRLENBQUMsNEJBQTRCLEVBQUU7SUFDbkMsVUFBVSxDQUFDOzs7d0JBQ1AscUJBQU0sb0JBQU8sQ0FBQyxNQUFNLENBQUMsTUFBTSxFQUFFLENBQUMsTUFBTSxFQUFFLENBQUMsUUFBUSxFQUFFLEVBQUE7O29CQUFqRCxTQUFpRCxDQUFDO29CQUNsRCxvQkFBTyxDQUFDLHFCQUFxQixHQUFHLElBQUksQ0FBQzs7OztTQUN4QyxDQUFDLENBQUM7SUFFSCxRQUFRLENBQUMsbUJBQW1CLEVBQUU7UUFDMUIsU0FBUyxDQUFDOzs7NEJBQ04scUJBQU0sOEJBQWUsQ0FBQyxHQUFHLEVBQUUsRUFBQTs7d0JBQTNCLFNBQTJCLENBQUM7d0JBQzVCLHFCQUFNLDhCQUFlLENBQUMsZ0JBQWdCLEVBQUUsRUFBQTs7d0JBQXhDLFNBQXdDLENBQUM7d0JBQ3pDLHFCQUFNLDhCQUFlLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxFQUFBOzt3QkFBMUMsU0FBMEMsQ0FBQzt3QkFDM0MscUJBQU0sOEJBQWUsQ0FBQyxvQ0FBb0MsRUFBRSxFQUFBOzt3QkFBNUQsU0FBNEQsQ0FBQzs7OzthQUNoRSxDQUFDLENBQUM7UUFFSCxRQUFRLENBQUM7Ozs0QkFDTCxxQkFBTSxxREFBMEIsQ0FBQyxHQUFHLEVBQUUsRUFBQTs7d0JBQXRDLFNBQXNDLENBQUM7d0JBQ3ZDLHFCQUFNLDRCQUFZLENBQUMsaUJBQWlCLEVBQUUsRUFBQTs7d0JBQXRDLFNBQXNDLENBQUM7d0JBQ3ZDLHFCQUFNLDRCQUFjLENBQUMsY0FBYyxFQUFFLEVBQUE7O3dCQUFyQyxTQUFxQyxDQUFDOzs7O2FBQ3pDLENBQUMsQ0FBQztRQUVILEVBQUUsQ0FBQyw4REFBOEQsRUFBRTs7OzRCQUMvRCxxQkFBTSxzQ0FBbUIsQ0FBQyxHQUFHLEVBQUUsRUFBQTs7d0JBQS9CLFNBQStCLENBQUM7d0JBQ2hDLHFCQUFNLHNDQUFtQixDQUFDLG1CQUFtQixFQUFFLEVBQUE7O3dCQUEvQyxTQUErQyxDQUFDOzs7O2FBQ25ELENBQUMsQ0FBQztJQUNQLENBQUMsQ0FBQyxDQUFBO0lBRUYsRUFBRSxDQUFDLDhHQUE4RyxFQUFFOzs7O3dCQUMvRyxxQkFBTSxzQ0FBbUIsQ0FBQyxHQUFHLEVBQUUsRUFBQTs7b0JBQS9CLFNBQStCLENBQUM7b0JBQ2hDLHFCQUFNLDhCQUFlLENBQUMsZ0JBQWdCLEVBQUUsRUFBQTs7b0JBQXhDLFNBQXdDLENBQUM7b0JBQzdCLHFCQUFNLG9CQUFPLENBQUMsYUFBYSxFQUFFLEVBQUE7O29CQUFuQyxHQUFHLEdBQUcsU0FBNkI7b0JBQ3pDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxPQUFPLENBQUMsNENBQXNCLENBQUMsT0FBTyxDQUFDLG1CQUFtQixDQUFDLENBQUM7Ozs7U0FDM0UsQ0FBQyxDQUFDO0FBQ1AsQ0FBQyxDQUFDLENBQUMifQ==