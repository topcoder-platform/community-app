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
var login_helper_1 = require("../page-objects/pages/topcoder/login/login.helper");
var tools_helper_1 = require("../page-objects/pages/topcoder/tools/tools.helper");
var common_helper_1 = require("../page-objects/common/common.helper");
var challenge_listing_helper_1 = require("../page-objects/pages/topcoder/challenge-listing/challenge-listing.helper");
var header_helper_1 = require("../page-objects/pages/topcoder/header/header.helper");
var home_helper_1 = require("../page-objects/pages/topcoder/home/home.helper");
describe('Topcoder Tools Page Tests: ', function () {
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
    it('should verify User can Add/Update/Delete Device', function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, tools_helper_1.ToolsPageHelper.get()];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, tools_helper_1.ToolsPageHelper.addDevice()];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, tools_helper_1.ToolsPageHelper.editDevice()];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, tools_helper_1.ToolsPageHelper.deleteDevice()];
                case 4:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('should Verify User can Add/Update/Delete Software', function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, tools_helper_1.ToolsPageHelper.get()];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, common_helper_1.commonPageHelper.switchTab('software', 'Software')];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, tools_helper_1.ToolsPageHelper.addSoftware()];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, tools_helper_1.ToolsPageHelper.editSoftware()];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, tools_helper_1.ToolsPageHelper.deleteSoftware()];
                case 5:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('should Verify User can Add/Update/Delete Service Provider', function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, tools_helper_1.ToolsPageHelper.get()];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, common_helper_1.commonPageHelper.switchTab('service providers', 'Service Providers')];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, tools_helper_1.ToolsPageHelper.addServiceProvider()];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, tools_helper_1.ToolsPageHelper.editServiceProvider()];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, tools_helper_1.ToolsPageHelper.deleteServiceProvider()];
                case 5:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('should Verify User can Add/Update/Delete Subscriptions ', function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, tools_helper_1.ToolsPageHelper.get()];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, common_helper_1.commonPageHelper.switchTab('subscriptions', 'Subscriptions')];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, tools_helper_1.ToolsPageHelper.addSubscription()];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, tools_helper_1.ToolsPageHelper.editSubscription()];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, tools_helper_1.ToolsPageHelper.deleteSubscription()];
                case 5:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGMtdG9vbHMuc3BlYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3Rlc3Qtc3VpdGVzL3RjLXRvb2xzLnNwZWMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsaUJBd0RHOztBQXhESCx5Q0FBcUM7QUFDckMsa0ZBQW9GO0FBRXBGLGtGQUFvRjtBQUNwRixzRUFBd0U7QUFDeEUsc0hBQXVIO0FBQ3ZILHFGQUFtRjtBQUNuRiwrRUFBaUY7QUFFakYsUUFBUSxDQUFDLDZCQUE2QixFQUFFO0lBQ3BDLFNBQVMsQ0FBQzs7O3dCQUNOLHFCQUFNLG9CQUFPLENBQUMsTUFBTSxDQUFDLE1BQU0sRUFBRSxDQUFDLE1BQU0sRUFBRSxDQUFDLFFBQVEsRUFBRSxFQUFBOztvQkFBakQsU0FBaUQsQ0FBQztvQkFDbEQsb0JBQU8sQ0FBQyxxQkFBcUIsR0FBRyxLQUFLLENBQUM7b0JBRXRDLHFCQUFNLDhCQUFlLENBQUMsR0FBRyxFQUFFLEVBQUE7O29CQUEzQixTQUEyQixDQUFDO29CQUM1QixxQkFBTSw4QkFBZSxDQUFDLGdCQUFnQixFQUFFLEVBQUE7O29CQUF4QyxTQUF3QyxDQUFDO29CQUN6QyxxQkFBTSw4QkFBZSxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsRUFBQTs7b0JBQTFDLFNBQTBDLENBQUM7b0JBQzNDLHFCQUFNLDhCQUFlLENBQUMsb0NBQW9DLEVBQUUsRUFBQTs7b0JBQTVELFNBQTRELENBQUM7Ozs7U0FDaEUsQ0FBQyxDQUFDO0lBRUgsUUFBUSxDQUFDOzs7d0JBQ0wscUJBQU0scURBQTBCLENBQUMsR0FBRyxFQUFFLEVBQUE7O29CQUF0QyxTQUFzQyxDQUFDO29CQUN2QyxxQkFBTSw0QkFBWSxDQUFDLGlCQUFpQixFQUFFLEVBQUE7O29CQUF0QyxTQUFzQyxDQUFDO29CQUN2QyxxQkFBTSw0QkFBYyxDQUFDLGNBQWMsRUFBRSxFQUFBOztvQkFBckMsU0FBcUMsQ0FBQzs7OztTQUN6QyxDQUFDLENBQUM7SUFFSCxFQUFFLENBQUMsaURBQWlELEVBQUU7Ozt3QkFDbEQscUJBQU0sOEJBQWUsQ0FBQyxHQUFHLEVBQUUsRUFBQTs7b0JBQTNCLFNBQTJCLENBQUM7b0JBQzVCLHFCQUFNLDhCQUFlLENBQUMsU0FBUyxFQUFFLEVBQUE7O29CQUFqQyxTQUFpQyxDQUFDO29CQUNsQyxxQkFBTSw4QkFBZSxDQUFDLFVBQVUsRUFBRSxFQUFBOztvQkFBbEMsU0FBa0MsQ0FBQztvQkFDbkMscUJBQU0sOEJBQWUsQ0FBQyxZQUFZLEVBQUUsRUFBQTs7b0JBQXBDLFNBQW9DLENBQUM7Ozs7U0FDeEMsQ0FBQyxDQUFDO0lBRUgsRUFBRSxDQUFDLG1EQUFtRCxFQUFFOzs7d0JBQ3BELHFCQUFNLDhCQUFlLENBQUMsR0FBRyxFQUFFLEVBQUE7O29CQUEzQixTQUEyQixDQUFDO29CQUM1QixxQkFBTSxnQ0FBZ0IsQ0FBQyxTQUFTLENBQUMsVUFBVSxFQUFFLFVBQVUsQ0FBQyxFQUFBOztvQkFBeEQsU0FBd0QsQ0FBQztvQkFDekQscUJBQU0sOEJBQWUsQ0FBQyxXQUFXLEVBQUUsRUFBQTs7b0JBQW5DLFNBQW1DLENBQUM7b0JBQ3BDLHFCQUFNLDhCQUFlLENBQUMsWUFBWSxFQUFFLEVBQUE7O29CQUFwQyxTQUFvQyxDQUFDO29CQUNyQyxxQkFBTSw4QkFBZSxDQUFDLGNBQWMsRUFBRSxFQUFBOztvQkFBdEMsU0FBc0MsQ0FBQzs7OztTQUMxQyxDQUFDLENBQUM7SUFFSCxFQUFFLENBQUMsMkRBQTJELEVBQUU7Ozt3QkFDNUQscUJBQU0sOEJBQWUsQ0FBQyxHQUFHLEVBQUUsRUFBQTs7b0JBQTNCLFNBQTJCLENBQUM7b0JBQzVCLHFCQUFNLGdDQUFnQixDQUFDLFNBQVMsQ0FBQyxtQkFBbUIsRUFBRSxtQkFBbUIsQ0FBQyxFQUFBOztvQkFBMUUsU0FBMEUsQ0FBQztvQkFDM0UscUJBQU0sOEJBQWUsQ0FBQyxrQkFBa0IsRUFBRSxFQUFBOztvQkFBMUMsU0FBMEMsQ0FBQztvQkFDM0MscUJBQU0sOEJBQWUsQ0FBQyxtQkFBbUIsRUFBRSxFQUFBOztvQkFBM0MsU0FBMkMsQ0FBQztvQkFDNUMscUJBQU0sOEJBQWUsQ0FBQyxxQkFBcUIsRUFBRSxFQUFBOztvQkFBN0MsU0FBNkMsQ0FBQzs7OztTQUNqRCxDQUFDLENBQUM7SUFFSCxFQUFFLENBQUMseURBQXlELEVBQUU7Ozt3QkFDMUQscUJBQU0sOEJBQWUsQ0FBQyxHQUFHLEVBQUUsRUFBQTs7b0JBQTNCLFNBQTJCLENBQUM7b0JBQzVCLHFCQUFNLGdDQUFnQixDQUFDLFNBQVMsQ0FBQyxlQUFlLEVBQUUsZUFBZSxDQUFDLEVBQUE7O29CQUFsRSxTQUFrRSxDQUFDO29CQUNuRSxxQkFBTSw4QkFBZSxDQUFDLGVBQWUsRUFBRSxFQUFBOztvQkFBdkMsU0FBdUMsQ0FBQztvQkFDeEMscUJBQU0sOEJBQWUsQ0FBQyxnQkFBZ0IsRUFBRSxFQUFBOztvQkFBeEMsU0FBd0MsQ0FBQztvQkFDekMscUJBQU0sOEJBQWUsQ0FBQyxrQkFBa0IsRUFBRSxFQUFBOztvQkFBMUMsU0FBMEMsQ0FBQzs7OztTQUM5QyxDQUFDLENBQUM7QUFDUCxDQUFDLENBQUMsQ0FBQyJ9