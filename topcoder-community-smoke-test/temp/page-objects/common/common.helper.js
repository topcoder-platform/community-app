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
var path = require('path');
var protractor_1 = require("protractor");
var common_po_1 = require("./common.po");
var config = require("../../config.json");
var jsdom = require("jsdom");
var JSDOM = jsdom.JSDOM;
var commonPageHelper = /** @class */ (function () {
    function commonPageHelper() {
    }
    commonPageHelper.clickOnAnchorText = function (text) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, common_po_1.commonPageObjects.clickOnAnchorText(text).click()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, console.log('Click on link with text ' + text)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    commonPageHelper.verifyPageTitle = function (pageTitle) {
        return __awaiter(this, void 0, void 0, function () {
            var title;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, protractor_1.browser.getTitle()];
                    case 1:
                        title = _a.sent();
                        return [4 /*yield*/, console.log('Got page title: ' + title)];
                    case 2:
                        _a.sent();
                        expect(title).toEqual(pageTitle);
                        return [4 /*yield*/, console.log('Verified Page Title')];
                    case 3:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    commonPageHelper.verifyCurrentUrl = function (currentUrl) {
        return __awaiter(this, void 0, void 0, function () {
            var getURL;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, protractor_1.browser.getCurrentUrl()];
                    case 1:
                        getURL = _a.sent();
                        return [4 /*yield*/, console.log('Got page url: ' + getURL)];
                    case 2:
                        _a.sent();
                        expect(getURL).toEqual(currentUrl);
                        return [4 /*yield*/, console.log('Verified Current Url')];
                    case 3:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    commonPageHelper.verifyPopupWindow = function () {
        return __awaiter(this, void 0, void 0, function () {
            var windows;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, protractor_1.browser.getAllWindowHandles()];
                    case 1:
                        windows = _a.sent();
                        expect(windows.length).toBe(2);
                        return [4 /*yield*/, protractor_1.browser.switchTo().window(windows[1])];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, protractor_1.browser.close()];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, protractor_1.browser.switchTo().window(windows[0])];
                    case 4:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    commonPageHelper.verifyPopupWindowWithTitle = function (title) {
        return __awaiter(this, void 0, void 0, function () {
            var windows, until, windowTitle, popupWindowTitle;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, protractor_1.browser.getAllWindowHandles()];
                    case 1:
                        windows = _a.sent();
                        until = protractor_1.protractor.ExpectedConditions;
                        windowTitle = protractor_1.element(protractor_1.by.xpath('//title'));
                        expect(windows.length).toBe(2);
                        protractor_1.browser.ignoreSynchronization = true;
                        return [4 /*yield*/, protractor_1.browser.switchTo().window(windows[1])];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, protractor_1.browser.wait(until.presenceOf(windowTitle))];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, protractor_1.browser.getTitle()];
                    case 4:
                        popupWindowTitle = _a.sent();
                        expect(popupWindowTitle).toEqual(title);
                        return [4 /*yield*/, protractor_1.browser.close()];
                    case 5:
                        _a.sent();
                        return [4 /*yield*/, protractor_1.browser.switchTo().window(windows[0])];
                    case 6:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    commonPageHelper.verifyPopupWindowWithUrl = function (expectedUrl) {
        return __awaiter(this, void 0, void 0, function () {
            var windows, url;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, protractor_1.browser.getAllWindowHandles()];
                    case 1:
                        windows = _a.sent();
                        expect(windows.length).toBe(2);
                        return [4 /*yield*/, protractor_1.browser.switchTo().window(windows[1])];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, protractor_1.browser.getCurrentUrl()];
                    case 3:
                        url = _a.sent();
                        expect(url).toEqual(expectedUrl);
                        return [4 /*yield*/, protractor_1.browser.close()];
                    case 4:
                        _a.sent();
                        return [4 /*yield*/, protractor_1.browser.switchTo().window(windows[0])];
                    case 5:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    commonPageHelper.verifyNewLink = function (text, hrefText) {
        return __awaiter(this, void 0, void 0, function () {
            var href;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, common_po_1.commonPageObjects.getHrefTextByText(text)];
                    case 1:
                        href = _a.sent();
                        expect(href).toEqual(hrefText);
                        return [2 /*return*/];
                }
            });
        });
    };
    commonPageHelper.switchTab = function (tab, header) {
        return __awaiter(this, void 0, void 0, function () {
            var until, headerEl;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        until = protractor_1.protractor.ExpectedConditions;
                        return [4 /*yield*/, common_po_1.commonPageObjects.findElementByText('span', tab).click()];
                    case 1:
                        _a.sent();
                        headerEl = common_po_1.commonPageObjects.getTextFromH1(header);
                        return [4 /*yield*/, protractor_1.browser.wait(until.visibilityOf(headerEl))];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    commonPageHelper.switchTabWithoutVerifyingHeader = function (tab) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, common_po_1.commonPageObjects.findElementByText('span', tab).click()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    commonPageHelper.getConfigUserName = function () {
        return config.login.username;
    };
    commonPageHelper.getConfigEmail = function () {
        return config.login.email;
    };
    return commonPageHelper;
}());
exports.commonPageHelper = commonPageHelper;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29tbW9uLmhlbHBlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3BhZ2Utb2JqZWN0cy9jb21tb24vY29tbW9uLmhlbHBlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsSUFBSSxJQUFJLEdBQUcsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBRTNCLHlDQUE4RDtBQUM5RCx5Q0FBZ0Q7QUFDaEQsMENBQTRDO0FBRTVDLElBQU0sS0FBSyxHQUFHLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQztBQUN2QixJQUFBLG1CQUFLLENBQVc7QUFFeEI7SUFBQTtJQTRFQSxDQUFDO0lBMUVnQixrQ0FBaUIsR0FBOUIsVUFBK0IsSUFBWTs7Ozs0QkFDdkMscUJBQU0sNkJBQWlCLENBQUMsaUJBQWlCLENBQUMsSUFBSSxDQUFDLENBQUMsS0FBSyxFQUFFLEVBQUE7O3dCQUF2RCxTQUF1RCxDQUFDO3dCQUN4RCxxQkFBTSxPQUFPLENBQUMsR0FBRyxDQUFDLDBCQUEwQixHQUFHLElBQUksQ0FBQyxFQUFBOzt3QkFBcEQsU0FBb0QsQ0FBQzs7Ozs7S0FDeEQ7SUFFWSxnQ0FBZSxHQUE1QixVQUE2QixTQUFpQjs7Ozs7NEJBQzVCLHFCQUFNLG9CQUFPLENBQUMsUUFBUSxFQUFFLEVBQUE7O3dCQUFoQyxLQUFLLEdBQUcsU0FBd0I7d0JBQ3RDLHFCQUFNLE9BQU8sQ0FBQyxHQUFHLENBQUMsa0JBQWtCLEdBQUcsS0FBSyxDQUFDLEVBQUE7O3dCQUE3QyxTQUE2QyxDQUFDO3dCQUM5QyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxDQUFDO3dCQUNqQyxxQkFBTSxPQUFPLENBQUMsR0FBRyxDQUFDLHFCQUFxQixDQUFDLEVBQUE7O3dCQUF4QyxTQUF3QyxDQUFDOzs7OztLQUM1QztJQUVZLGlDQUFnQixHQUE3QixVQUE4QixVQUFrQjs7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