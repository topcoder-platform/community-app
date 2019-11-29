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
var forum_constants_1 = require("./forum.constants");
var ForumPageHelper = /** @class */ (function () {
    function ForumPageHelper() {
    }
    ForumPageHelper.verifyForumPage = function () {
        return __awaiter(this, void 0, void 0, function () {
            var until;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        until = protractor_1.protractor.ExpectedConditions;
                        return [4 /*yield*/, protractor_1.browser.wait(function () { return __awaiter(_this, void 0, void 0, function () {
                                var browserUrl;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: return [4 /*yield*/, protractor_1.browser.getCurrentUrl()];
                                        case 1:
                                            browserUrl = _a.sent();
                                            return [2 /*return*/, browserUrl === forum_constants_1.ForumPageConstants.url];
                                    }
                                });
                            }); }, 15000)];
                    case 1:
                        _a.sent();
                        console.log('User redirected to forums page');
                        return [2 /*return*/];
                }
            });
        });
    };
    ForumPageHelper.verifyChallengeForumPage = function () {
        return __awaiter(this, void 0, void 0, function () {
            var until;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        until = protractor_1.protractor.ExpectedConditions;
                        return [4 /*yield*/, protractor_1.browser.wait(function () { return __awaiter(_this, void 0, void 0, function () {
                                var browserUrl;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: return [4 /*yield*/, protractor_1.browser.getCurrentUrl()];
                                        case 1:
                                            browserUrl = _a.sent();
                                            return [2 /*return*/, browserUrl === forum_constants_1.ForumPageConstants.content.challengeForumUrl];
                                    }
                                });
                            }); }, 15000)];
                    case 1:
                        _a.sent();
                        console.log('User redirected to challenge forums page');
                        return [2 /*return*/];
                }
            });
        });
    };
    return ForumPageHelper;
}());
exports.ForumPageHelper = ForumPageHelper;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZm9ydW0uaGVscGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vcGFnZS1vYmplY3RzL3BhZ2VzL3RvcGNvZGVyL2ZvcnVtL2ZvcnVtLmhlbHBlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEseUNBQWlEO0FBQ2pELHFEQUF1RDtBQUd2RDtJQUFBO0lBc0JBLENBQUM7SUFyQmdCLCtCQUFlLEdBQTVCOzs7Ozs7O3dCQUNVLEtBQUssR0FBRyx1QkFBVSxDQUFDLGtCQUFrQixDQUFDO3dCQUU1QyxxQkFBTSxvQkFBTyxDQUFDLElBQUksQ0FBQzs7OztnREFDSSxxQkFBTSxvQkFBTyxDQUFDLGFBQWEsRUFBRSxFQUFBOzs0Q0FBMUMsVUFBVSxHQUFHLFNBQTZCOzRDQUNoRCxzQkFBTyxVQUFVLEtBQUssb0NBQWtCLENBQUMsR0FBRyxFQUFDOzs7aUNBQ2hELEVBQUUsS0FBSyxDQUFDLEVBQUE7O3dCQUhULFNBR1MsQ0FBQzt3QkFFVixPQUFPLENBQUMsR0FBRyxDQUFDLGdDQUFnQyxDQUFDLENBQUM7Ozs7O0tBQ2pEO0lBRVksd0NBQXdCLEdBQXJDOzs7Ozs7O3dCQUNVLEtBQUssR0FBRyx1QkFBVSxDQUFDLGtCQUFrQixDQUFDO3dCQUU1QyxxQkFBTSxvQkFBTyxDQUFDLElBQUksQ0FBQzs7OztnREFDSSxxQkFBTSxvQkFBTyxDQUFDLGFBQWEsRUFBRSxFQUFBOzs0Q0FBMUMsVUFBVSxHQUFHLFNBQTZCOzRDQUNoRCxzQkFBTyxVQUFVLEtBQUssb0NBQWtCLENBQUMsT0FBTyxDQUFDLGlCQUFpQixFQUFDOzs7aUNBQ3RFLEVBQUUsS0FBSyxDQUFDLEVBQUE7O3dCQUhULFNBR1MsQ0FBQzt3QkFFVixPQUFPLENBQUMsR0FBRyxDQUFDLDBDQUEwQyxDQUFDLENBQUM7Ozs7O0tBQzNEO0lBQ0wsc0JBQUM7QUFBRCxDQUFDLEFBdEJELElBc0JDO0FBdEJZLDBDQUFlIn0=