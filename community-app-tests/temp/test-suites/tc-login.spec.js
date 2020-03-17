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
var testData = require("../test-data/test-data.json");
var config_helper_js_1 = require("../utils/config-helper.js");
describe("Topcoder Login Page Tests: ", function () {
    /**
     * Sets up browser login page
     */
    beforeEach(function () { return __awaiter(_this, void 0, void 0, function () {
        var loginpage;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    protractor_1.browser.driver
                        .manage()
                        .window()
                        .maximize();
                    protractor_1.browser.ignoreSynchronization = false;
                    loginpage = new topcoder_ui_testing_lib_1.LoginPage();
                    return [4 /*yield*/, loginpage.setUrls({
                            homePageUrl: config_helper_js_1.ConfigHelper.getHomePageURL(),
                            loginUrl: config_helper_js_1.ConfigHelper.getLoginURL(),
                            logoutUrl: config_helper_js_1.ConfigHelper.getLogoutURL()
                        })];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, loginpage.get()];
                case 2:
                    _a.sent();
                    topcoder_ui_testing_lib_1.LoginPageHelper.setLoginPage(loginpage);
                    return [2 /*return*/];
            }
        });
    }); });
    /**
     * Restarts browser
     */
    afterEach(function () {
        protractor_1.browser.restart();
    });
    /**
     * Verifies User can login using valid credentials
     */
    it("should Verify User can login using valid credentials", function () { return __awaiter(_this, void 0, void 0, function () {
        var username, password;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    username = config_helper_js_1.ConfigHelper.getUserName();
                    password = config_helper_js_1.ConfigHelper.getPassword();
                    return [4 /*yield*/, topcoder_ui_testing_lib_1.LoginPageHelper.login(username, password)];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    /**
     * Verifies User cannot login using invalid username
     */
    it("should Verify User cannot login using invalid username", function () { return __awaiter(_this, void 0, void 0, function () {
        var invalidUsername, password;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    invalidUsername = testData.login.invalidUsername;
                    password = config_helper_js_1.ConfigHelper.getPassword();
                    return [4 /*yield*/, topcoder_ui_testing_lib_1.LoginPageHelper.loginWithInvalidUserName(invalidUsername, password)];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    /**
     * Verifies User cannot login using invalid password
     */
    it("should Verify User cannot login using invalid password", function () { return __awaiter(_this, void 0, void 0, function () {
        var username, inavlidPassword;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    username = config_helper_js_1.ConfigHelper.getUserName();
                    inavlidPassword = testData.login.invalidPassword;
                    return [4 /*yield*/, topcoder_ui_testing_lib_1.LoginPageHelper.loginWithInvalidPassword(username, inavlidPassword)];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    /**
     * Verifies User ccan logout
     */
    it("should Verify User can logout", function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, topcoder_ui_testing_lib_1.LoginPageHelper.logout()];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGMtbG9naW4uc3BlYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3Rlc3Qtc3VpdGVzL3RjLWxvZ2luLnNwZWMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsaUJBa0VBOztBQWxFQSx5Q0FBcUM7QUFDckMsbUVBQXFFO0FBQ3JFLHNEQUF3RDtBQUN4RCw4REFBeUQ7QUFFekQsUUFBUSxDQUFDLDZCQUE2QixFQUFFO0lBQ3RDOztPQUVHO0lBQ0gsVUFBVSxDQUFDOzs7OztvQkFDVCxvQkFBTyxDQUFDLE1BQU07eUJBQ1gsTUFBTSxFQUFFO3lCQUNSLE1BQU0sRUFBRTt5QkFDUixRQUFRLEVBQUUsQ0FBQztvQkFDZCxvQkFBTyxDQUFDLHFCQUFxQixHQUFHLEtBQUssQ0FBQztvQkFDaEMsU0FBUyxHQUFHLElBQUksbUNBQVMsRUFBRSxDQUFDO29CQUNsQyxxQkFBTSxTQUFTLENBQUMsT0FBTyxDQUFDOzRCQUN0QixXQUFXLEVBQUUsK0JBQVksQ0FBQyxjQUFjLEVBQUU7NEJBQzFDLFFBQVEsRUFBRSwrQkFBWSxDQUFDLFdBQVcsRUFBRTs0QkFDcEMsU0FBUyxFQUFFLCtCQUFZLENBQUMsWUFBWSxFQUFFO3lCQUN2QyxDQUFDLEVBQUE7O29CQUpGLFNBSUUsQ0FBQztvQkFDSCxxQkFBTSxTQUFTLENBQUMsR0FBRyxFQUFFLEVBQUE7O29CQUFyQixTQUFxQixDQUFDO29CQUN0Qix5Q0FBZSxDQUFDLFlBQVksQ0FBQyxTQUFTLENBQUMsQ0FBQzs7OztTQUN6QyxDQUFDLENBQUM7SUFFSDs7T0FFRztJQUNILFNBQVMsQ0FBQztRQUNSLG9CQUFPLENBQUMsT0FBTyxFQUFFLENBQUM7SUFDcEIsQ0FBQyxDQUFDLENBQUM7SUFFSDs7T0FFRztJQUNILEVBQUUsQ0FBQyxzREFBc0QsRUFBRTs7Ozs7b0JBQ25ELFFBQVEsR0FBRywrQkFBWSxDQUFDLFdBQVcsRUFBRSxDQUFDO29CQUN0QyxRQUFRLEdBQUcsK0JBQVksQ0FBQyxXQUFXLEVBQUUsQ0FBQztvQkFDNUMscUJBQU0seUNBQWUsQ0FBQyxLQUFLLENBQUMsUUFBUSxFQUFFLFFBQVEsQ0FBQyxFQUFBOztvQkFBL0MsU0FBK0MsQ0FBQzs7OztTQUNqRCxDQUFDLENBQUM7SUFFSDs7T0FFRztJQUNILEVBQUUsQ0FBQyx3REFBd0QsRUFBRTs7Ozs7b0JBQ3JELGVBQWUsR0FBRyxRQUFRLENBQUMsS0FBSyxDQUFDLGVBQWUsQ0FBQztvQkFDakQsUUFBUSxHQUFHLCtCQUFZLENBQUMsV0FBVyxFQUFFLENBQUM7b0JBQzVDLHFCQUFNLHlDQUFlLENBQUMsd0JBQXdCLENBQUMsZUFBZSxFQUFFLFFBQVEsQ0FBQyxFQUFBOztvQkFBekUsU0FBeUUsQ0FBQzs7OztTQUMzRSxDQUFDLENBQUM7SUFFSDs7T0FFRztJQUNILEVBQUUsQ0FBQyx3REFBd0QsRUFBRTs7Ozs7b0JBQ3JELFFBQVEsR0FBRywrQkFBWSxDQUFDLFdBQVcsRUFBRSxDQUFDO29CQUN0QyxlQUFlLEdBQUcsUUFBUSxDQUFDLEtBQUssQ0FBQyxlQUFlLENBQUM7b0JBQ3ZELHFCQUFNLHlDQUFlLENBQUMsd0JBQXdCLENBQUMsUUFBUSxFQUFFLGVBQWUsQ0FBQyxFQUFBOztvQkFBekUsU0FBeUUsQ0FBQzs7OztTQUMzRSxDQUFDLENBQUM7SUFFSDs7T0FFRztJQUNILEVBQUUsQ0FBQywrQkFBK0IsRUFBRTs7O3dCQUNsQyxxQkFBTSx5Q0FBZSxDQUFDLE1BQU0sRUFBRSxFQUFBOztvQkFBOUIsU0FBOEIsQ0FBQzs7OztTQUNoQyxDQUFDLENBQUM7QUFDTCxDQUFDLENBQUMsQ0FBQyJ9