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
var preferences_constants_1 = require("./preferences.constants");
var protractor_1 = require("protractor");
var preferences_po_1 = require("./preferences.po");
var ptor_1 = require("protractor/built/ptor");
var common_helper_1 = require("../../../common/common.helper");
var PreferencesPageHelper = /** @class */ (function () {
    function PreferencesPageHelper() {
    }
    PreferencesPageHelper.get = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, protractor_1.browser.get(preferences_constants_1.PreferencesPageConstants.url)];
                    case 1:
                        _a.sent();
                        // waiting for preferences to get loaded
                        return [4 /*yield*/, protractor_1.browser.sleep(5000)];
                    case 2:
                        // waiting for preferences to get loaded
                        _a.sent();
                        return [4 /*yield*/, console.log('User navigated to Preferences Page')];
                    case 3:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    PreferencesPageHelper.verifyEmailPreferences = function () {
        return __awaiter(this, void 0, void 0, function () {
            var until, status, expectedStatus, el, actualStatus, i;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        until = ptor_1.protractor.ExpectedConditions;
                        return [4 /*yield*/, this.getStatusOfNewsletters()];
                    case 1:
                        status = _a.sent();
                        expectedStatus = [];
                        return [4 /*yield*/, preferences_po_1.PreferencesPageObject.designNewsletterLabel];
                    case 2:
                        el = _a.sent();
                        return [4 /*yield*/, el.click()];
                    case 3:
                        _a.sent();
                        // since there is no success message, waiting for 5 secs after every operation
                        // FIXME - below condition has to be fixed by Topcoder Devs
                        // await browser.wait(until.visibilityOf(PreferencesPageObject.successMsg));
                        return [4 /*yield*/, protractor_1.browser.sleep(5000)];
                    case 4:
                        // since there is no success message, waiting for 5 secs after every operation
                        // FIXME - below condition has to be fixed by Topcoder Devs
                        // await browser.wait(until.visibilityOf(PreferencesPageObject.successMsg));
                        _a.sent();
                        expectedStatus.push(!status[0]);
                        expectedStatus.push(status[1]);
                        return [4 /*yield*/, preferences_po_1.PreferencesPageObject.dataScienceNewsletterLabel];
                    case 5:
                        el = _a.sent();
                        return [4 /*yield*/, el.click()];
                    case 6:
                        _a.sent();
                        return [4 /*yield*/, protractor_1.browser.sleep(5000)];
                    case 7:
                        _a.sent();
                        expectedStatus.push(!status[2]);
                        return [4 /*yield*/, this.get()];
                    case 8:
                        _a.sent();
                        return [4 /*yield*/, this.getStatusOfNewsletters()];
                    case 9:
                        actualStatus = _a.sent();
                        for (i = 0; i < actualStatus.length; i++) {
                            expect(actualStatus[i]).toEqual(expectedStatus[i]);
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    PreferencesPageHelper.verifyExternalLink = function (tabName, expectedUrl) {
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
    PreferencesPageHelper.getStatusOfNewsletters = function () {
        return __awaiter(this, void 0, void 0, function () {
            var status, backgroundColor;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        status = [];
                        return [4 /*yield*/, preferences_po_1.PreferencesPageObject.designNewsletterLabel.getCssValue('background-color')];
                    case 1:
                        backgroundColor = _a.sent();
                        status.push(this.getStatus(backgroundColor));
                        return [4 /*yield*/, preferences_po_1.PreferencesPageObject.developmentNewsletterLabel.getCssValue('background-color')];
                    case 2:
                        backgroundColor = _a.sent();
                        status.push(this.getStatus(backgroundColor));
                        return [4 /*yield*/, preferences_po_1.PreferencesPageObject.dataScienceNewsletterLabel.getCssValue('background-color')];
                    case 3:
                        backgroundColor = _a.sent();
                        status.push(this.getStatus(backgroundColor));
                        console.log(status);
                        return [2 /*return*/, status];
                }
            });
        });
    };
    PreferencesPageHelper.getStatus = function (color) {
        return color == 'rgba(192, 192, 192, 1)' ? false : true;
    };
    return PreferencesPageHelper;
}());
exports.PreferencesPageHelper = PreferencesPageHelper;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJlZmVyZW5jZXMuaGVscGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vcGFnZS1vYmplY3RzL3BhZ2VzL3RvcGNvZGVyL3ByZWZlcmVuY2VzL3ByZWZlcmVuY2VzLmhlbHBlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsaUVBQW1FO0FBQ25FLHlDQUFxQztBQUNyQyxtREFBeUQ7QUFDekQsOENBQW1EO0FBQ25ELCtEQUFpRTtBQUVqRTtJQUFBO0lBbUVBLENBQUM7SUFsRWdCLHlCQUFHLEdBQWhCOzs7OzRCQUNJLHFCQUFNLG9CQUFPLENBQUMsR0FBRyxDQUFDLGdEQUF3QixDQUFDLEdBQUcsQ0FBQyxFQUFBOzt3QkFBL0MsU0FBK0MsQ0FBQzt3QkFDaEQsd0NBQXdDO3dCQUN4QyxxQkFBTSxvQkFBTyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsRUFBQTs7d0JBRHpCLHdDQUF3Qzt3QkFDeEMsU0FBeUIsQ0FBQzt3QkFDMUIscUJBQU0sT0FBTyxDQUFDLEdBQUcsQ0FBQyxvQ0FBb0MsQ0FBQyxFQUFBOzt3QkFBdkQsU0FBdUQsQ0FBQzs7Ozs7S0FDM0Q7SUFFWSw0Q0FBc0IsR0FBbkM7Ozs7Ozt3QkFDVSxLQUFLLEdBQUcsaUJBQVUsQ0FBQyxrQkFBa0IsQ0FBQzt3QkFFN0IscUJBQU0sSUFBSSxDQUFDLHNCQUFzQixFQUFFLEVBQUE7O3dCQUE1QyxNQUFNLEdBQUcsU0FBbUM7d0JBQzVDLGNBQWMsR0FBRyxFQUFFLENBQUM7d0JBRWpCLHFCQUFNLHNDQUFxQixDQUFDLHFCQUFxQixFQUFBOzt3QkFBdEQsRUFBRSxHQUFHLFNBQWlEO3dCQUMxRCxxQkFBTSxFQUFFLENBQUMsS0FBSyxFQUFFLEVBQUE7O3dCQUFoQixTQUFnQixDQUFDO3dCQUVqQiw4RUFBOEU7d0JBQzlFLDJEQUEyRDt3QkFDM0QsNEVBQTRFO3dCQUM1RSxxQkFBTSxv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