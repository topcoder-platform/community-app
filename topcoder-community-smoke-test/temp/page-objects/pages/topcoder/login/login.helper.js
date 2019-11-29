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
Object.defineProperty(exports, "__esModule", { value: true });
var protractor_1 = require("protractor");
var login_constants_1 = require("../login/login.constants");
var login_po_1 = require("../login/login.po");
var config = require("../../../../config.json");
var common_helper_1 = require("../../../common/common.helper");
var LoginPageHelper = /** @class */ (function () {
    function LoginPageHelper() {
    }
    LoginPageHelper.get = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, protractor_1.browser.get(login_constants_1.LoginPageConstants.url)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, console.log('User navigated to Topcoder Login Page')];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    LoginPageHelper.waitForLoginForm = function () {
        return __awaiter(this, void 0, void 0, function () {
            var until, loginForm;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        until = protractor_1.protractor.ExpectedConditions;
                        loginForm = login_po_1.LoginPageObject.loginForm;
                        return [4 /*yield*/, protractor_1.browser.wait(until.visibilityOf(loginForm), 15000)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    LoginPageHelper.fillLoginForm = function (shouldFillUsingEmail) {
        return __awaiter(this, void 0, void 0, function () {
            var until, username, password, loginButton;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        until = protractor_1.protractor.ExpectedConditions;
                        username = shouldFillUsingEmail ? common_helper_1.commonPageHelper.getConfigEmail() : common_helper_1.commonPageHelper.getConfigUserName();
                        password = config.login.password;
                        return [4 /*yield*/, protractor_1.browser.wait(until.presenceOf(login_po_1.LoginPageObject.usernameField), 2000)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, login_po_1.LoginPageObject.usernameField.sendKeys(username)];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, login_po_1.LoginPageObject.passwordField.sendKeys(password)];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, console.log('Login form filled with values: username - ' + username + ', password - ' + password)];
                    case 4:
                        _a.sent();
                        loginButton = login_po_1.LoginPageObject.loginButton;
                        expect(loginButton.isEnabled()).toBeTruthy();
                        return [4 /*yield*/, loginButton.click()];
                    case 5:
                        _a.sent();
                        console.log('Submitted login form');
                        return [2 /*return*/];
                }
            });
        });
    };
    LoginPageHelper.waitForLoginSuccessWithoutLoggingOut = function () {
        return __awaiter(this, void 0, void 0, function () {
            var until, currentUrl;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        protractor_1.browser.ignoreSynchronization = true;
                        until = protractor_1.protractor.ExpectedConditions;
                        return [4 /*yield*/, protractor_1.browser.wait(until.visibilityOf(login_po_1.LoginPageObject.homePageDiv), 90000, 'Error: Element did not display within 90 seconds')];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, protractor_1.browser.getCurrentUrl()];
                    case 2:
                        currentUrl = _a.sent();
                        expect(currentUrl).toEqual(login_constants_1.LoginPageConstants.homePageUrl);
                        console.log('Redirected to home page after login');
                        return [2 /*return*/];
                }
            });
        });
    };
    return LoginPageHelper;
}());
exports.LoginPageHelper = LoginPageHelper;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9naW4uaGVscGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vcGFnZS1vYmplY3RzL3BhZ2VzL3RvcGNvZGVyL2xvZ2luL2xvZ2luLmhlbHBlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEseUNBQWlEO0FBQ2pELDREQUE4RDtBQUM5RCw4Q0FBb0Q7QUFDcEQsZ0RBQWtEO0FBQ2xELCtEQUFpRTtBQUVqRTtJQUFBO0lBeUNBLENBQUM7SUF4Q2dCLG1CQUFHLEdBQWhCOzs7OzRCQUNJLHFCQUFNLG9CQUFPLENBQUMsR0FBRyxDQUFDLG9DQUFrQixDQUFDLEdBQUcsQ0FBQyxFQUFBOzt3QkFBekMsU0FBeUMsQ0FBQzt3QkFDMUMscUJBQU0sT0FBTyxDQUFDLEdBQUcsQ0FBQyx1Q0FBdUMsQ0FBQyxFQUFBOzt3QkFBMUQsU0FBMEQsQ0FBQzs7Ozs7S0FDOUQ7SUFFWSxnQ0FBZ0IsR0FBN0I7Ozs7Ozt3QkFDVSxLQUFLLEdBQUcsdUJBQVUsQ0FBQyxrQkFBa0IsQ0FBQzt3QkFDdEMsU0FBUyxHQUFHLDBCQUFlLENBQUMsU0FBUyxDQUFDO3dCQUM1QyxxQkFBTSxvQkFBTyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsWUFBWSxDQUFDLFNBQVMsQ0FBQyxFQUFFLEtBQUssQ0FBQyxFQUFBOzt3QkFBeEQsU0FBd0QsQ0FBQzs7Ozs7S0FDNUQ7SUFFWSw2QkFBYSxHQUExQixVQUEyQixvQkFBNkI7Ozs7Ozt3QkFDOUMsS0FBSyxHQUFHLHVCQUFVLENBQUMsa0JBQWtCLENBQUM7d0JBQ3RDLFFBQVEsR0FBRyxvQkFBb0IsQ0FBQyxDQUFDLENBQUMsZ0NBQWdCLENBQUMsY0FBYyxFQUFFLENBQUMsQ0FBQyxDQUFDLGdDQUFnQixDQUFDLGlCQUFpQixFQUFFLENBQUM7d0JBQzNHLFFBQVEsR0FBRyxNQUFNLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQzt3QkFFdkMscUJBQU0sb0JBQU8sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLFVBQVUsQ0FBQywwQkFBZSxDQUFDLGFBQWEsQ0FBQyxFQUFFLElBQUksQ0FBQyxFQUFBOzt3QkFBekUsU0FBeUUsQ0FBQzt3QkFFMUUscUJBQU0sMEJBQWUsQ0FBQyxhQUFhLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxFQUFBOzt3QkFBdEQsU0FBc0QsQ0FBQzt3QkFDdkQscUJBQU0sMEJBQWUsQ0FBQyxhQUFhLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxFQUFBOzt3QkFBdEQsU0FBc0QsQ0FBQzt3QkFFdkQscUJBQU0sT0FBTyxDQUFDLEdBQUcsQ0FBQyw0Q0FBNEMsR0FBRyxRQUFRLEdBQUcsZUFBZSxHQUFHLFFBQVEsQ0FBQyxFQUFBOzt3QkFBdkcsU0FBdUcsQ0FBQzt3QkFFbEcsV0FBVyxHQUFHLDBCQUFlLENBQUMsV0FBVyxDQUFDO3dCQUNoRCxNQUFNLENBQUMsV0FBVyxDQUFDLFNBQVMsRUFBRSxDQUFDLENBQUMsVUFBVSxFQUFFLENBQUM7d0JBRTdDLHFCQUFNLFdBQVcsQ0FBQyxLQUFLLEVBQUUsRUFBQTs7d0JBQXpCLFNBQXlCLENBQUM7d0JBQzFCLE9BQU8sQ0FBQyxHQUFHLENBQUMsc0JBQXNCLENBQUMsQ0FBQzs7Ozs7S0FDdkM7SUFFWSxvREFBb0MsR0FBakQ7Ozs7Ozt3QkFDSSxvQkFBTyxDQUFDLHFCQUFxQixHQUFHLElBQUksQ0FBQzt3QkFFL0IsS0FBSyxHQUFHLHVCQUFVLENBQUMsa0JBQWtCLENBQUM7d0JBQzVDLHFCQUFNLG9CQUFPLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxZQUFZLENBQUMsMEJBQWUsQ0FBQyxXQUFXLENBQUMsRUFBRSxLQUFLLEVBQUUsa0RBQWtELENBQUMsRUFBQTs7d0JBQTlILFNBQThILENBQUM7d0JBRTVHLHFCQUFNLG9CQUFPLENBQUMsYUFBYSxFQUFFLEVBQUE7O3dCQUExQyxVQUFVLEdBQUcsU0FBNkI7d0JBQ2hELE1BQU0sQ0FBQyxVQUFVLENBQUMsQ0FBQyxPQUFPLENBQUMsb0NBQWtCLENBQUMsV0FBVyxDQUFDLENBQUM7d0JBQzNELE9BQU8sQ0FBQyxHQUFHLENBQUMscUNBQXFDLENBQUMsQ0FBQzs7Ozs7S0FDdEQ7SUFDTCxzQkFBQztBQUFELENBQUMsQUF6Q0QsSUF5Q0M7QUF6Q1ksMENBQWUifQ==