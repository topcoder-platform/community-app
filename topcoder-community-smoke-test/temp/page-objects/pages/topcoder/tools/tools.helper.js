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
var ptor_1 = require("protractor/built/ptor");
var protractor_1 = require("protractor");
var tools_po_1 = require("./tools.po");
var common_po_1 = require("../../../common/common.po");
var tools_constants_1 = require("./tools.constants");
var ToolsPageHelper = /** @class */ (function () {
    function ToolsPageHelper() {
    }
    ToolsPageHelper.get = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, protractor_1.browser.get(tools_constants_1.ToolsPageConstants.url)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, protractor_1.browser.sleep(1000)];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, console.log('User navigated to Tools Page')];
                    case 3:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ToolsPageHelper.addDevice = function () {
        return __awaiter(this, void 0, void 0, function () {
            var until, successEl, el, isDisplayed;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        until = ptor_1.protractor.ExpectedConditions;
                        return [4 /*yield*/, this.operateSelect(tools_po_1.ToolsPageObject.deviceTypeInput, 'Desktop')];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, tools_po_1.ToolsPageObject.manufacturer.clear()];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, tools_po_1.ToolsPageObject.manufacturer.sendKeys('Test manufacturer')];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, tools_po_1.ToolsPageObject.model.clear()];
                    case 4:
                        _a.sent();
                        return [4 /*yield*/, tools_po_1.ToolsPageObject.model.sendKeys('Test Model')];
                    case 5:
                        _a.sent();
                        return [4 /*yield*/, tools_po_1.ToolsPageObject.os.clear()];
                    case 6:
                        _a.sent();
                        return [4 /*yield*/, tools_po_1.ToolsPageObject.os.sendKeys('Linux')];
                    case 7:
                        _a.sent();
                        return [4 /*yield*/, tools_po_1.ToolsPageObject.osVersion.clear()];
                    case 8:
                        _a.sent();
                        return [4 /*yield*/, tools_po_1.ToolsPageObject.osVersion.sendKeys('Ubuntu')];
                    case 9:
                        _a.sent();
                        return [4 /*yield*/, tools_po_1.ToolsPageObject.osLang.clear()];
                    case 10:
                        _a.sent();
                        return [4 /*yield*/, tools_po_1.ToolsPageObject.osLang.sendKeys('English')];
                    case 11:
                        _a.sent();
                        return [4 /*yield*/, tools_po_1.ToolsPageObject.getAddButton('device').click()];
                    case 12:
                        _a.sent();
                        successEl = tools_po_1.ToolsPageObject.successMsg;
                        return [4 /*yield*/, protractor_1.browser.wait(until.visibilityOf(successEl))];
                    case 13:
                        _a.sent();
                        return [4 /*yield*/, protractor_1.browser.wait(until.invisibilityOf(successEl))];
                    case 14:
                        _a.sent();
                        el = common_po_1.commonPageObjects.findElementByText('div', 'Test manufacturer | Test Model | Desktop');
                        return [4 /*yield*/, el.isDisplayed()];
                    case 15:
                        isDisplayed = _a.sent();
                        expect(isDisplayed).toBe(true);
                        el = common_po_1.commonPageObjects.findElementByText('div', 'Linux Ubuntu English');
                        return [4 /*yield*/, el.isDisplayed()];
                    case 16:
                        isDisplayed = _a.sent();
                        expect(isDisplayed).toBe(true);
                        return [2 /*return*/];
                }
            });
        });
    };
    ToolsPageHelper.editDevice = function () {
        return __awaiter(this, void 0, void 0, function () {
            var until, successEl, el, isDisplayed;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        until = ptor_1.protractor.ExpectedConditions;
                        return [4 /*yield*/, tools_po_1.ToolsPageObject.getEdit('Test manufacturer').click()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, tools_po_1.ToolsPageObject.manufacturer.sendKeys('Test manufacturer1')];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, tools_po_1.ToolsPageObject.getEditButton('device').click()];
                    case 3:
                        _a.sent();
                        successEl = tools_po_1.ToolsPageObject.successMsg;
                        return [4 /*yield*/, protractor_1.browser.wait(until.visibilityOf(successEl))];
                    case 4:
                        _a.sent();
                        return [4 /*yield*/, protractor_1.browser.wait(until.invisibilityOf(successEl))];
                    case 5:
                        _a.sent();
                        el = common_po_1.commonPageObjects.findElementByText('div', 'Test manufacturer1 | Test Model | Desktop');
                        return [4 /*yield*/, el.isDisplayed()];
                    case 6:
                        isDisplayed = _a.sent();
                        expect(isDisplayed).toBe(true);
                        return [2 /*return*/];
                }
            });
        });
    };
    ToolsPageHelper.deleteDevice = function () {
        return __awaiter(this, void 0, void 0, function () {
            var until, successEl, el, isDisplayed;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        until = ptor_1.protractor.ExpectedConditions;
                        return [4 /*yield*/, tools_po_1.ToolsPageObject.getDelete('Test manufacturer1 | Test Model | Desktop').click()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, tools_po_1.ToolsPageObject.deleteConfirmation.click()];
                    case 2:
                        _a.sent();
                        successEl = tools_po_1.ToolsPageObject.successMsg;
                        return [4 /*yield*/, protractor_1.browser.wait(until.visibilityOf(successEl))];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, protractor_1.browser.wait(until.invisibilityOf(successEl))];
                    case 4:
                        _a.sent();
                        el = common_po_1.commonPageObjects.findElementByText('div', 'Test manufacturer1 | Test Model | Desktop');
                        return [4 /*yield*/, el.isPresent()];
                    case 5:
                        isDisplayed = _a.sent();
                        expect(isDisplayed).toBe(false);
                        return [2 /*return*/];
                }
            });
        });
    };
    ToolsPageHelper.addSoftware = function () {
        return __awaiter(this, void 0, void 0, function () {
            var until, successEl, el, isDisplayed;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        until = ptor_1.protractor.ExpectedConditions;
                        return [4 /*yield*/, this.operateSelect(tools_po_1.ToolsPageObject.softwareInput, 'Developer Tools')];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, tools_po_1.ToolsPageObject.softwareName.clear()];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, tools_po_1.ToolsPageObject.softwareName.sendKeys('TestSoftware')];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, tools_po_1.ToolsPageObject.getAddButton('software').click()];
                    case 4:
                        _a.sent();
                        successEl = tools_po_1.ToolsPageObject.successMsg;
                        return [4 /*yield*/, protractor_1.browser.wait(until.visibilityOf(successEl))];
                    case 5:
                        _a.sent();
                        return [4 /*yield*/, protractor_1.browser.wait(until.invisibilityOf(successEl))];
                    case 6:
                        _a.sent();
                        el = common_po_1.commonPageObjects.findElementByText('div', 'TestSoftware');
                        return [4 /*yield*/, el.isDisplayed()];
                    case 7:
                        isDisplayed = _a.sent();
                        expect(isDisplayed).toBe(true);
                        el = common_po_1.commonPageObjects.findElementByText('div', 'Developer Tools');
                        return [4 /*yield*/, el.isDisplayed()];
                    case 8:
                        isDisplayed = _a.sent();
                        expect(isDisplayed).toBe(true);
                        return [2 /*return*/];
                }
            });
        });
    };
    ToolsPageHelper.editSoftware = function () {
        return __awaiter(this, void 0, void 0, function () {
            var until, successEl, el, isDisplayed;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        until = ptor_1.protractor.ExpectedConditions;
                        return [4 /*yield*/, tools_po_1.ToolsPageObject.getEdit('TestSoftware').click()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, tools_po_1.ToolsPageObject.softwareName.clear()];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, tools_po_1.ToolsPageObject.softwareName.sendKeys('TestSoftware1')];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, tools_po_1.ToolsPageObject.getEditButton('software').click()];
                    case 4:
                        _a.sent();
                        successEl = tools_po_1.ToolsPageObject.successMsg;
                        return [4 /*yield*/, protractor_1.browser.wait(until.visibilityOf(successEl))];
                    case 5:
                        _a.sent();
                        return [4 /*yield*/, protractor_1.browser.wait(until.invisibilityOf(successEl))];
                    case 6:
                        _a.sent();
                        el = common_po_1.commonPageObjects.findElementByText('div', 'TestSoftware1');
                        return [4 /*yield*/, el.isDisplayed()];
                    case 7:
                        isDisplayed = _a.sent();
                        expect(isDisplayed).toBe(true);
                        return [2 /*return*/];
                }
            });
        });
    };
    ToolsPageHelper.deleteSoftware = function () {
        return __awaiter(this, void 0, void 0, function () {
            var until, successEl, el, isDisplayed;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        until = ptor_1.protractor.ExpectedConditions;
                        return [4 /*yield*/, tools_po_1.ToolsPageObject.getDelete('TestSoftware1').click()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, tools_po_1.ToolsPageObject.deleteConfirmation.click()];
                    case 2:
                        _a.sent();
                        successEl = tools_po_1.ToolsPageObject.successMsg;
                        return [4 /*yield*/, protractor_1.browser.wait(until.visibilityOf(successEl))];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, protractor_1.browser.wait(until.invisibilityOf(successEl))];
                    case 4:
                        _a.sent();
                        el = common_po_1.commonPageObjects.findElementByText('div', 'TestSoftware1');
                        return [4 /*yield*/, el.isPresent()];
                    case 5:
                        isDisplayed = _a.sent();
                        expect(isDisplayed).toBe(false);
                        return [2 /*return*/];
                }
            });
        });
    };
    ToolsPageHelper.addServiceProvider = function () {
        return __awaiter(this, void 0, void 0, function () {
            var until, successEl, el, isDisplayed;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        until = ptor_1.protractor.ExpectedConditions;
                        return [4 /*yield*/, this.operateSelect(tools_po_1.ToolsPageObject.serviceProviderInput, 'Television')];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, tools_po_1.ToolsPageObject.serviceProviderName.clear()];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, tools_po_1.ToolsPageObject.serviceProviderName.sendKeys('Test provider')];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, tools_po_1.ToolsPageObject.getAddButton('service provider').click()];
                    case 4:
                        _a.sent();
                        successEl = tools_po_1.ToolsPageObject.successMsg;
                        return [4 /*yield*/, protractor_1.browser.wait(until.visibilityOf(successEl))];
                    case 5:
                        _a.sent();
                        return [4 /*yield*/, protractor_1.browser.wait(until.invisibilityOf(successEl))];
                    case 6:
                        _a.sent();
                        el = common_po_1.commonPageObjects.findElementByText('div', 'Test provider');
                        return [4 /*yield*/, el.isDisplayed()];
                    case 7:
                        isDisplayed = _a.sent();
                        expect(isDisplayed).toBe(true);
                        el = common_po_1.commonPageObjects.findElementByText('div', 'Television');
                        return [4 /*yield*/, el.isDisplayed()];
                    case 8:
                        isDisplayed = _a.sent();
                        expect(isDisplayed).toBe(true);
                        return [2 /*return*/];
                }
            });
        });
    };
    ToolsPageHelper.editServiceProvider = function () {
        return __awaiter(this, void 0, void 0, function () {
            var until, successEl, el, isDisplayed;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        until = ptor_1.protractor.ExpectedConditions;
                        return [4 /*yield*/, tools_po_1.ToolsPageObject.getEdit('Test provider').click()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, tools_po_1.ToolsPageObject.serviceProviderName.clear()];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, tools_po_1.ToolsPageObject.serviceProviderName.sendKeys('Test provider1')];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, tools_po_1.ToolsPageObject.getEditButton('service provider').click()];
                    case 4:
                        _a.sent();
                        successEl = tools_po_1.ToolsPageObject.successMsg;
                        return [4 /*yield*/, protractor_1.browser.wait(until.visibilityOf(successEl))];
                    case 5:
                        _a.sent();
                        return [4 /*yield*/, protractor_1.browser.wait(until.invisibilityOf(successEl))];
                    case 6:
                        _a.sent();
                        el = common_po_1.commonPageObjects.findElementByText('div', 'Test provider1');
                        return [4 /*yield*/, el.isDisplayed()];
                    case 7:
                        isDisplayed = _a.sent();
                        expect(isDisplayed).toBe(true);
                        return [2 /*return*/];
                }
            });
        });
    };
    ToolsPageHelper.deleteServiceProvider = function () {
        return __awaiter(this, void 0, void 0, function () {
            var until, successEl, el, isDisplayed;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        until = ptor_1.protractor.ExpectedConditions;
                        return [4 /*yield*/, tools_po_1.ToolsPageObject.getDelete('Test provider1').click()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, tools_po_1.ToolsPageObject.deleteConfirmation.click()];
                    case 2:
                        _a.sent();
                        successEl = tools_po_1.ToolsPageObject.successMsg;
                        return [4 /*yield*/, protractor_1.browser.wait(until.visibilityOf(successEl))];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, protractor_1.browser.wait(until.invisibilityOf(successEl))];
                    case 4:
                        _a.sent();
                        el = common_po_1.commonPageObjects.findElementByText('div', 'Test provider1');
                        return [4 /*yield*/, el.isPresent()];
                    case 5:
                        isDisplayed = _a.sent();
                        expect(isDisplayed).toBe(false);
                        return [2 /*return*/];
                }
            });
        });
    };
    ToolsPageHelper.addSubscription = function () {
        return __awaiter(this, void 0, void 0, function () {
            var until, successEl, el, isDisplayed;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        until = ptor_1.protractor.ExpectedConditions;
                        return [4 /*yield*/, tools_po_1.ToolsPageObject.subscriptionName.clear()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, tools_po_1.ToolsPageObject.subscriptionName.sendKeys('Test subscription')];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, tools_po_1.ToolsPageObject.getAddButton('subscription').click()];
                    case 3:
                        _a.sent();
                        successEl = tools_po_1.ToolsPageObject.successMsg;
                        return [4 /*yield*/, protractor_1.browser.wait(until.visibilityOf(successEl))];
                    case 4:
                        _a.sent();
                        return [4 /*yield*/, protractor_1.browser.wait(until.invisibilityOf(successEl))];
                    case 5:
                        _a.sent();
                        el = common_po_1.commonPageObjects.findElementByText('div', 'Test subscription');
                        return [4 /*yield*/, el.isDisplayed()];
                    case 6:
                        isDisplayed = _a.sent();
                        expect(isDisplayed).toBe(true);
                        return [2 /*return*/];
                }
            });
        });
    };
    ToolsPageHelper.editSubscription = function () {
        return __awaiter(this, void 0, void 0, function () {
            var until, successEl, el, isDisplayed;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        until = ptor_1.protractor.ExpectedConditions;
                        return [4 /*yield*/, tools_po_1.ToolsPageObject.getEdit('Test subscription').click()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, tools_po_1.ToolsPageObject.subscriptionName.clear()];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, tools_po_1.ToolsPageObject.subscriptionName.sendKeys('Test subscription1')];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, tools_po_1.ToolsPageObject.getEditButton('subscription').click()];
                    case 4:
                        _a.sent();
                        successEl = tools_po_1.ToolsPageObject.successMsg;
                        return [4 /*yield*/, protractor_1.browser.wait(until.visibilityOf(successEl))];
                    case 5:
                        _a.sent();
                        return [4 /*yield*/, protractor_1.browser.wait(until.invisibilityOf(successEl))];
                    case 6:
                        _a.sent();
                        el = common_po_1.commonPageObjects.findElementByText('div', 'Test subscription1');
                        return [4 /*yield*/, el.isDisplayed()];
                    case 7:
                        isDisplayed = _a.sent();
                        expect(isDisplayed).toBe(true);
                        return [2 /*return*/];
                }
            });
        });
    };
    ToolsPageHelper.deleteSubscription = function () {
        return __awaiter(this, void 0, void 0, function () {
            var until, successEl, el, isDisplayed;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        until = ptor_1.protractor.ExpectedConditions;
                        return [4 /*yield*/, tools_po_1.ToolsPageObject.getDelete('Test subscription1').click()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, tools_po_1.ToolsPageObject.deleteConfirmation.click()];
                    case 2:
                        _a.sent();
                        successEl = tools_po_1.ToolsPageObject.successMsg;
                        return [4 /*yield*/, protractor_1.browser.wait(until.visibilityOf(successEl))];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, protractor_1.browser.wait(until.invisibilityOf(successEl))];
                    case 4:
                        _a.sent();
                        el = common_po_1.commonPageObjects.findElementByText('div', 'Test subscription1');
                        return [4 /*yield*/, el.isPresent()];
                    case 5:
                        isDisplayed = _a.sent();
                        expect(isDisplayed).toBe(false);
                        return [2 /*return*/];
                }
            });
        });
    };
    ToolsPageHelper.operateSelect = function (el, selection) {
        return __awaiter(this, void 0, void 0, function () {
            var until, elements, matchingEl;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        until = ptor_1.protractor.ExpectedConditions;
                        return [4 /*yield*/, el.sendKeys(selection)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, protractor_1.browser.wait(until.visibilityOf(protractor_1.element(protractor_1.by.className('Select-option'))))];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, tools_po_1.ToolsPageObject.selectOptions];
                    case 3:
                        elements = _a.sent();
                        matchingEl = elements[0];
                        return [4 /*yield*/, matchingEl.click()];
                    case 4:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    return ToolsPageHelper;
}());
exports.ToolsPageHelper = ToolsPageHelper;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidG9vbHMuaGVscGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vcGFnZS1vYmplY3RzL3BhZ2VzL3RvcGNvZGVyL3Rvb2xzL3Rvb2xzLmhlbHBlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsOENBQW1EO0FBQ25ELHlDQUFrRDtBQUNsRCx1Q0FBNkM7QUFDN0MsdURBQThEO0FBQzlELHFEQUF1RDtBQUV2RDtJQUFBO0lBNE9BLENBQUM7SUEzT2dCLG1CQUFHLEdBQWhCOzs7OzRCQUNJLHFCQUFNLG9CQUFPLENBQUMsR0FBRyxDQUFDLG9DQUFrQixDQUFDLEdBQUcsQ0FBQyxFQUFBOzt3QkFBekMsU0FBeUMsQ0FBQzt3QkFDMUMscUJBQU0sb0JBQU8sQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLEVBQUE7O3dCQUF6QixTQUF5QixDQUFDO3dCQUMxQixxQkFBTSxPQUFPLENBQUMsR0FBRyxDQUFDLDhCQUE4QixDQUFDLEVBQUE7O3dCQUFqRCxTQUFpRCxDQUFDOzs7OztLQUNyRDtJQUVZLHlCQUFTLEdBQXRCOzs7Ozs7d0JBQ1UsS0FBSyxHQUFHLGlCQUFVLENBQUMsa0JBQWtCLENBQUM7d0JBRTVDLHFCQUFNLElBQUksQ0FBQyxhQUFhLENBQUMsMEJBQWUsQ0FBQyxlQUFlLEVBQUUsU0FBUyxDQUFDLEVBQUE7O3dCQUFwRSxTQUFvRSxDQUFDO3dCQUVyRSxxQkFBTSwwQkFBZSxDQUFDLFlBQVksQ0FBQyxLQUFLLEVBQUUsRUFBQTs7d0JBQTFDLFNBQTBDLENBQUM7d0JBQzNDLHFCQUFNLDBCQUFlLENBQUMsWUFBWSxDQUFDLFFBQVEsQ0FBQyxtQkFBbUIsQ0FBQyxFQUFBOzt3QkFBaEUsU0FBZ0UsQ0FBQzt3QkFFakUscUJBQU0sMEJBQWUsQ0FBQyxLQUFLLENBQUMsS0FBSyxFQUFFLEVBQUE7O3dCQUFuQyxTQUFtQyxDQUFDO3dCQUNwQyxx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