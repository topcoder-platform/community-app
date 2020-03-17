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
var topcoder_ui_testing_lib_1 = require("topcoder-ui-testing-lib");
var tools_helper_1 = require("../page-objects/pages/topcoder/tools/tools.helper");
var tools_po_1 = require("../page-objects/pages/topcoder/tools/tools.po");
var testData = require("../test-data/test-data.json");
var config_helper_1 = require("../utils/config-helper");
describe("Topcoder Tools Page Tests: ", function () {
    /**
     * Sets up the browser and logs in
     */
    beforeAll(function () { return __awaiter(_this, void 0, void 0, function () {
        var loginpage;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, protractor_1.browser.restart()];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, protractor_1.browser.driver
                            .manage()
                            .window()
                            .maximize()];
                case 2:
                    _a.sent();
                    loginpage = new topcoder_ui_testing_lib_1.LoginPage();
                    return [4 /*yield*/, loginpage.setUrls({
                            homePageUrl: config_helper_1.ConfigHelper.getHomePageURL(),
                            loginUrl: config_helper_1.ConfigHelper.getLoginURL(),
                            logoutUrl: config_helper_1.ConfigHelper.getLogoutURL()
                        })];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, loginpage.get()];
                case 4:
                    _a.sent();
                    topcoder_ui_testing_lib_1.LoginPageHelper.setLoginPage(loginpage);
                    return [4 /*yield*/, topcoder_ui_testing_lib_1.LoginPageHelper.login(config_helper_1.ConfigHelper.getUserName(), config_helper_1.ConfigHelper.getPassword())];
                case 5:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    /**
     * Logs out
     */
    afterAll(function () { return __awaiter(_this, void 0, void 0, function () {
        var e_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 4]);
                    return [4 /*yield*/, topcoder_ui_testing_lib_1.LoginPageHelper.logout()];
                case 1:
                    _a.sent();
                    return [3 /*break*/, 4];
                case 2:
                    e_1 = _a.sent();
                    return [4 /*yield*/, protractor_1.browser.restart()];
                case 3:
                    _a.sent();
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); });
    /**
     * Verifies Add/Update/Delete Subscriptions functionalty
     */
    it("should Verify User can Add/Update/Delete Subscriptions", function () { return __awaiter(_this, void 0, void 0, function () {
        var toolsPage;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    toolsPage = new tools_po_1.ToolsPage();
                    return [4 /*yield*/, toolsPage.get()];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, toolsPage.switchTab("subscriptions")];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, toolsPage.deleteAll()];
                case 3:
                    _a.sent();
                    tools_helper_1.ToolsPageHelper.setToolsPage(toolsPage);
                    return [4 /*yield*/, tools_helper_1.ToolsPageHelper.verifyAddSubscription(testData.tools.subscription)];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, tools_helper_1.ToolsPageHelper.verifyEditSubscription(testData.tools.subscription, testData.tools.newSubscription)];
                case 5:
                    _a.sent();
                    return [4 /*yield*/, tools_helper_1.ToolsPageHelper.verifyDeleteSubscription(testData.tools.newSubscription)];
                case 6:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGMtdG9vbHMuc3BlYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3Rlc3Qtc3VpdGVzL3RjLXRvb2xzLnNwZWMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsaUJBNkRBOztBQTdEQSx5Q0FBcUM7QUFDckMsbUVBQXFFO0FBQ3JFLGtGQUFvRjtBQUNwRiwwRUFBMEU7QUFDMUUsc0RBQXdEO0FBQ3hELHdEQUFzRDtBQUV0RCxRQUFRLENBQUMsNkJBQTZCLEVBQUU7SUFDdEM7O09BRUc7SUFDSCxTQUFTLENBQUM7Ozs7d0JBQ1IscUJBQU0sb0JBQU8sQ0FBQyxPQUFPLEVBQUUsRUFBQTs7b0JBQXZCLFNBQXVCLENBQUM7b0JBQ3hCLHFCQUFNLG9CQUFPLENBQUMsTUFBTTs2QkFDakIsTUFBTSxFQUFFOzZCQUNSLE1BQU0sRUFBRTs2QkFDUixRQUFRLEVBQUUsRUFBQTs7b0JBSGIsU0FHYSxDQUFDO29CQUNSLFNBQVMsR0FBRyxJQUFJLG1DQUFTLEVBQUUsQ0FBQztvQkFDbEMscUJBQU0sU0FBUyxDQUFDLE9BQU8sQ0FBQzs0QkFDdEIsV0FBVyxFQUFFLDRCQUFZLENBQUMsY0FBYyxFQUFFOzRCQUMxQyxRQUFRLEVBQUUsNEJBQVksQ0FBQyxXQUFXLEVBQUU7NEJBQ3BDLFNBQVMsRUFBRSw0QkFBWSxDQUFDLFlBQVksRUFBRTt5QkFDdkMsQ0FBQyxFQUFBOztvQkFKRixTQUlFLENBQUM7b0JBQ0gscUJBQU0sU0FBUyxDQUFDLEdBQUcsRUFBRSxFQUFBOztvQkFBckIsU0FBcUIsQ0FBQztvQkFDdEIseUNBQWUsQ0FBQyxZQUFZLENBQUMsU0FBUyxDQUFDLENBQUM7b0JBQ3hDLHFCQUFNLHlDQUFlLENBQUMsS0FBSyxDQUN6Qiw0QkFBWSxDQUFDLFdBQVcsRUFBRSxFQUMxQiw0QkFBWSxDQUFDLFdBQVcsRUFBRSxDQUMzQixFQUFBOztvQkFIRCxTQUdDLENBQUM7Ozs7U0FDSCxDQUFDLENBQUM7SUFFSDs7T0FFRztJQUNILFFBQVEsQ0FBQzs7Ozs7O29CQUVMLHFCQUFNLHlDQUFlLENBQUMsTUFBTSxFQUFFLEVBQUE7O29CQUE5QixTQUE4QixDQUFDOzs7O29CQUUvQixxQkFBTSxvQkFBTyxDQUFDLE9BQU8sRUFBRSxFQUFBOztvQkFBdkIsU0FBdUIsQ0FBQzs7Ozs7U0FFM0IsQ0FBQyxDQUFDO0lBRUg7O09BRUc7SUFDSCxFQUFFLENBQUMsd0RBQXdELEVBQUU7Ozs7O29CQUNyRCxTQUFTLEdBQUcsSUFBSSxvQkFBUyxFQUFFLENBQUM7b0JBQ2xDLHFCQUFNLFNBQVMsQ0FBQyxHQUFHLEVBQUUsRUFBQTs7b0JBQXJCLFNBQXFCLENBQUM7b0JBQ3RCLHFCQUFNLFNBQVMsQ0FBQyxTQUFTLENBQUMsZUFBZSxDQUFDLEVBQUE7O29CQUExQyxTQUEwQyxDQUFDO29CQUMzQyxxQkFBTSxTQUFTLENBQUMsU0FBUyxFQUFFLEVBQUE7O29CQUEzQixTQUEyQixDQUFDO29CQUM1Qiw4QkFBZSxDQUFDLFlBQVksQ0FBQyxTQUFTLENBQUMsQ0FBQztvQkFDeEMscUJBQU0sOEJBQWUsQ0FBQyxxQkFBcUIsQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLFlBQVksQ0FBQyxFQUFBOztvQkFBeEUsU0FBd0UsQ0FBQztvQkFDekUscUJBQU0sOEJBQWUsQ0FBQyxzQkFBc0IsQ0FDMUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxZQUFZLEVBQzNCLFFBQVEsQ0FBQyxLQUFLLENBQUMsZUFBZSxDQUMvQixFQUFBOztvQkFIRCxTQUdDLENBQUM7b0JBQ0YscUJBQU0sOEJBQWUsQ0FBQyx3QkFBd0IsQ0FDNUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxlQUFlLENBQy9CLEVBQUE7O29CQUZELFNBRUMsQ0FBQzs7OztTQUNILENBQUMsQ0FBQztBQUNMLENBQUMsQ0FBQyxDQUFDIn0=