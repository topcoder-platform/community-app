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
var terms_constants_1 = require("./terms.constants");
var terms_po_1 = require("./terms.po");
var common_po_1 = require("../../../common/common.po");
var TermsPageHelper = /** @class */ (function () {
    function TermsPageHelper() {
    }
    TermsPageHelper.verifyTermsAuthenticationError = function () {
        return __awaiter(this, void 0, void 0, function () {
            var until, errorElement, url;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        until = protractor_1.protractor.ExpectedConditions;
                        errorElement = common_po_1.commonPageObjects.findElementByText('div', 'Authentication credential was missing.');
                        return [4 /*yield*/, protractor_1.browser.wait(until.visibilityOf(errorElement))];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, protractor_1.browser.getCurrentUrl()];
                    case 2:
                        url = _a.sent();
                        expect(url).toEqual(terms_constants_1.TermsPageConstants.content.redirectUrl);
                        return [2 /*return*/];
                }
            });
        });
    };
    TermsPageHelper.verifyTermsPage = function () {
        return __awaiter(this, void 0, void 0, function () {
            var until, browserUrl;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        until = protractor_1.protractor.ExpectedConditions;
                        return [4 /*yield*/, protractor_1.browser.wait(until.visibilityOf(terms_po_1.TermsPageObject.container))];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, protractor_1.browser.getCurrentUrl()];
                    case 2:
                        browserUrl = _a.sent();
                        expect(browserUrl).toEqual(terms_constants_1.TermsPageConstants.content.redirectUrl);
                        console.log('User redirected to terms page');
                        return [2 /*return*/];
                }
            });
        });
    };
    return TermsPageHelper;
}());
exports.TermsPageHelper = TermsPageHelper;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGVybXMuaGVscGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vcGFnZS1vYmplY3RzL3BhZ2VzL3RvcGNvZGVyL3Rlcm1zL3Rlcm1zLmhlbHBlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEseUNBQWlEO0FBQ2pELHFEQUF1RDtBQUN2RCx1Q0FBNkM7QUFDN0MsdURBQThEO0FBRTlEO0lBQUE7SUFpQkEsQ0FBQztJQWhCZ0IsOENBQThCLEdBQTNDOzs7Ozs7d0JBQ1UsS0FBSyxHQUFHLHVCQUFVLENBQUMsa0JBQWtCLENBQUM7d0JBQ3RDLFlBQVksR0FBRyw2QkFBaUIsQ0FBQyxpQkFBaUIsQ0FBQyxLQUFLLEVBQUUsd0NBQXdDLENBQUMsQ0FBQzt3QkFDMUcscUJBQU0sb0JBQU8sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLFlBQVksQ0FBQyxZQUFZLENBQUMsQ0FBQyxFQUFBOzt3QkFBcEQsU0FBb0QsQ0FBQzt3QkFFekMscUJBQU0sb0JBQU8sQ0FBQyxhQUFhLEVBQUUsRUFBQTs7d0JBQW5DLEdBQUcsR0FBRyxTQUE2Qjt3QkFDekMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxvQ0FBa0IsQ0FBQyxPQUFPLENBQUMsV0FBVyxDQUFDLENBQUM7Ozs7O0tBQy9EO0lBRVksK0JBQWUsR0FBNUI7Ozs7Ozt3QkFDVSxLQUFLLEdBQUcsdUJBQVUsQ0FBQyxrQkFBa0IsQ0FBQzt3QkFDNUMscUJBQU0sb0JBQU8sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLFlBQVksQ0FBQywwQkFBZSxDQUFDLFNBQVMsQ0FBQyxDQUFDLEVBQUE7O3dCQUFqRSxTQUFpRSxDQUFDO3dCQUMvQyxxQkFBTSxvQkFBTyxDQUFDLGFBQWEsRUFBRSxFQUFBOzt3QkFBMUMsVUFBVSxHQUFHLFNBQTZCO3dCQUNoRCxNQUFNLENBQUMsVUFBVSxDQUFDLENBQUMsT0FBTyxDQUFDLG9DQUFrQixDQUFDLE9BQU8sQ0FBQyxXQUFXLENBQUMsQ0FBQzt3QkFDbkUsT0FBTyxDQUFDLEdBQUcsQ0FBQywrQkFBK0IsQ0FBQyxDQUFDOzs7OztLQUNoRDtJQUNMLHNCQUFDO0FBQUQsQ0FBQyxBQWpCRCxJQWlCQztBQWpCWSwwQ0FBZSJ9