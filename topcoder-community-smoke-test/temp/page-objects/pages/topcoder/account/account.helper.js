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
var account_constants_1 = require("./account.constants");
var protractor_1 = require("protractor");
var account_po_1 = require("./account.po");
var ptor_1 = require("protractor/built/ptor");
var common_helper_1 = require("../../../common/common.helper");
var common_po_1 = require("../../../common/common.po");
var AccountPageHelper = /** @class */ (function () {
    function AccountPageHelper() {
    }
    AccountPageHelper.get = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, protractor_1.browser.get(account_constants_1.AccountPageConstants.url)];
                    case 1:
                        _a.sent();
                        // waiting for preferences to get loaded
                        return [4 /*yield*/, protractor_1.browser.sleep(5000)];
                    case 2:
                        // waiting for preferences to get loaded
                        _a.sent();
                        return [4 /*yield*/, console.log('User navigated to Account Page')];
                    case 3:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    AccountPageHelper.verifyConsentPreference = function () {
        return __awaiter(this, void 0, void 0, function () {
            var until, status, el, expectedStatus, actualStatus;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        until = ptor_1.protractor.ExpectedConditions;
                        return [4 /*yield*/, this.getStatusOfConsent()];
                    case 1:
                        status = _a.sent();
                        return [4 /*yield*/, account_po_1.AccountPageObject.consentLabel];
                    case 2:
                        el = _a.sent();
                        return [4 /*yield*/, el.click()];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, protractor_1.browser.wait(until.visibilityOf(account_po_1.AccountPageObject.successMsg))];
                    case 4:
                        _a.sent();
                        return [4 /*yield*/, protractor_1.browser.wait(until.invisibilityOf(account_po_1.AccountPageObject.successMsg))];
                    case 5:
                        _a.sent();
                        expectedStatus = !status;
                        return [4 /*yield*/, this.get()];
                    case 6:
                        _a.sent();
                        return [4 /*yield*/, this.getStatusOfConsent()];
                    case 7:
                        actualStatus = _a.sent();
                        expect(actualStatus).toBe(expectedStatus);
                        return [2 /*return*/];
                }
            });
        });
    };
    AccountPageHelper.verifyExternalLink = function (tabName, expectedUrl) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.get()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, common_helper_1.commonPageHelper.switchTabWithoutVerifyingHeader(tabName)];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, protractor_1.browser.wait(function () { return __awaiter(_this, void 0, void 0, function () {
                                var url;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: return [4 /*yield*/, protractor_1.browser.getCurrentUrl()];
                                        case 1:
                                            url = _a.sent();
                                            return [2 /*return*/, url === expectedUrl];
                                    }
                                });
                            }); })];
                    case 3:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    AccountPageHelper.addLink = function () {
        return __awaiter(this, void 0, void 0, function () {
            var until, isDisplayed;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        until = ptor_1.protractor.ExpectedConditions;
                        return [4 /*yield*/, account_po_1.AccountPageObject.externalLinkInput.sendKeys('www.test.com')];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, account_po_1.AccountPageObject.externalLinkAddButton.click()];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, protractor_1.browser.wait(until.visibilityOf(account_po_1.AccountPageObject.externalLinkSuccessMsg))];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, protractor_1.browser.wait(until.invisibilityOf(account_po_1.AccountPageObject.externalLinkSuccessMsg))];
                    case 4:
                        _a.sent();
                        return [4 /*yield*/, common_po_1.commonPageObjects.findElementByText('a', 'http://www.test.com').isDisplayed()];
                    case 5:
                        isDisplayed = _a.sent();
                        expect(isDisplayed).toBe(true);
                        return [2 /*return*/];
                }
            });
        });
    };
    AccountPageHelper.deleteLink = function () {
        return __awaiter(this, void 0, void 0, function () {
            var until, deleteEl, isDisplayed;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        until = ptor_1.protractor.ExpectedConditions;
                        return [4 /*yield*/, account_po_1.AccountPageObject.externalLinkDeleteButton('http://www.test.com')];
                    case 1:
                        deleteEl = _a.sent();
                        return [4 /*yield*/, deleteEl.click()];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, protractor_1.browser.wait(until.visibilityOf(account_po_1.AccountPageObject.deleteConfirmation))];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, account_po_1.AccountPageObject.deleteConfirmation.click()];
                    case 4:
                        _a.sent();
                        return [4 /*yield*/, protractor_1.browser.wait(until.visibilityOf(account_po_1.AccountPageObject.getExternalLinkDeletionMsg()))];
                    case 5:
                        _a.sent();
                        return [4 /*yield*/, protractor_1.browser.wait(until.invisibilityOf(account_po_1.AccountPageObject.getExternalLinkDeletionMsg()))];
                    case 6:
                        _a.sent();
                        return [4 /*yield*/, common_po_1.commonPageObjects.findElementByText('a', 'http://www.test.com').isPresent()];
                    case 7:
                        isDisplayed = _a.sent();
                        expect(isDisplayed).toBe(false);
                        return [2 /*return*/];
                }
            });
        });
    };
    AccountPageHelper.getStatusOfConsent = function () {
        return __awaiter(this, void 0, void 0, function () {
            var backgroundColor;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, account_po_1.AccountPageObject.consentLabel.getCssValue('background-color')];
                    case 1:
                        backgroundColor = _a.sent();
                        return [2 /*return*/, this.getStatus(backgroundColor)];
                }
            });
        });
    };
    AccountPageHelper.getStatus = function (color) {
        return color == 'rgba(192, 192, 192, 1)' ? false : true;
    };
    return AccountPageHelper;
}());
exports.AccountPageHelper = AccountPageHelper;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWNjb3VudC5oZWxwZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9wYWdlLW9iamVjdHMvcGFnZXMvdG9wY29kZXIvYWNjb3VudC9hY2NvdW50LmhlbHBlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEseURBQTJEO0FBQzNELHlDQUFxQztBQUNyQywyQ0FBaUQ7QUFDakQsOENBQW1EO0FBQ25ELCtEQUFpRTtBQUNqRSx1REFBOEQ7QUFFOUQ7SUFBQTtJQXNFQSxDQUFDO0lBckVnQixxQkFBRyxHQUFoQjs7Ozs0QkFDSSxxQkFBTSxvQkFBTyxDQUFDLEdBQUcsQ0FBQyx3Q0FBb0IsQ0FBQyxHQUFHLENBQUMsRUFBQTs7d0JBQTNDLFNBQTJDLENBQUM7d0JBQzVDLHdDQUF3Qzt3QkFDeEMscUJBQU0sb0JBQU8sQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLEVBQUE7O3dCQUR6Qix3Q0FBd0M7d0JBQ3hDLFNBQXlCLENBQUM7d0JBQzFCLHFCQUFNLE9BQU8sQ0FBQyxHQUFHLENBQUMsZ0NBQWdDLENBQUMsRUFBQTs7d0JBQW5ELFNBQW1ELENBQUM7Ozs7O0tBQ3ZEO0lBRVkseUNBQXVCLEdBQXBDOzs7Ozs7d0JBQ1UsS0FBSyxHQUFHLGlCQUFVLENBQUMsa0JBQWtCLENBQUM7d0JBRTdCLHFCQUFNLElBQUksQ0FBQyxrQkFBa0IsRUFBRSxFQUFBOzt3QkFBeEMsTUFBTSxHQUFHLFNBQStCO3dCQUVyQyxxQkFBTSw4QkFBaUIsQ0FBQyxZQUFZLEVBQUE7O3dCQUF6QyxFQUFFLEdBQUcsU0FBb0M7d0JBQzdDLHFCQUFNLEVBQUUsQ0FBQyxLQUFLLEVBQUUsRUFBQTs7d0JBQWhCLFNBQWdCLENBQUM7d0JBRWpCLHFCQUFNLG9CQUFPLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxZQUFZLENBQUMsOEJBQWlCLENBQUMsVUFBVSxDQUFDLENBQUMsRUFB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