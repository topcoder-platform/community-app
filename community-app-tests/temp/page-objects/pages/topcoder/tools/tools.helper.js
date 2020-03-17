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
var topcoder_ui_testing_lib_1 = require("topcoder-ui-testing-lib");
var logger_1 = require("../../../../logger/logger");
var ToolsPageHelper = /** @class */ (function () {
    function ToolsPageHelper() {
    }
    /**
     * gets the Tools page object
     */
    ToolsPageHelper.setToolsPage = function (toolspage) {
        this.toolsPageObject = toolspage;
    };
    /**
     * verifyies that user can add subscription
     */
    ToolsPageHelper.verifyAddSubscription = function (name) {
        return __awaiter(this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.toolsPageObject.addSubscription(name)];
                    case 1:
                        _b.sent();
                        _a = expect;
                        return [4 /*yield*/, topcoder_ui_testing_lib_1.ElementHelper.getTagElementContainingText("div", name).isDisplayed()];
                    case 2:
                        _a.apply(void 0, [_b.sent()]).toBe(true);
                        logger_1.logger.info("subcription added: " + name);
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * verifyies that user can edit subscription
     */
    ToolsPageHelper.verifyEditSubscription = function (name, newname) {
        return __awaiter(this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.toolsPageObject.editSubscription(name, newname)];
                    case 1:
                        _b.sent();
                        _a = expect;
                        return [4 /*yield*/, topcoder_ui_testing_lib_1.ElementHelper.getTagElementContainingText("div", newname).isDisplayed()];
                    case 2:
                        _a.apply(void 0, [_b.sent()]).toBe(true);
                        logger_1.logger.info("subcription edited from: " + name + " to " + newname);
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * verifyies that user can delete subscription
     */
    ToolsPageHelper.verifyDeleteSubscription = function (name) {
        return __awaiter(this, void 0, void 0, function () {
            var el, isDisplayed;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.toolsPageObject.deleteSubscription(name)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, topcoder_ui_testing_lib_1.ElementHelper.getTagElementContainingText("div", name)];
                    case 2:
                        el = _a.sent();
                        return [4 /*yield*/, el.isPresent()];
                    case 3:
                        isDisplayed = _a.sent();
                        expect(isDisplayed).toBe(false);
                        logger_1.logger.info("deleted subcription: " + name);
                        return [2 /*return*/];
                }
            });
        });
    };
    return ToolsPageHelper;
}());
exports.ToolsPageHelper = ToolsPageHelper;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidG9vbHMuaGVscGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vcGFnZS1vYmplY3RzL3BhZ2VzL3RvcGNvZGVyL3Rvb2xzL3Rvb2xzLmhlbHBlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsbUVBQXdEO0FBQ3hELG9EQUFtRDtBQUduRDtJQUFBO0lBNkNBLENBQUM7SUE1Q0M7O09BRUc7SUFDVyw0QkFBWSxHQUExQixVQUEyQixTQUFTO1FBQ2xDLElBQUksQ0FBQyxlQUFlLEdBQUcsU0FBUyxDQUFDO0lBQ25DLENBQUM7SUFFRDs7T0FFRztJQUNpQixxQ0FBcUIsR0FBekMsVUFBMEMsSUFBSTs7Ozs7NEJBQzVDLHFCQUFNLElBQUksQ0FBQyxlQUFlLENBQUMsZUFBZSxDQUFDLElBQUksQ0FBQyxFQUFBOzt3QkFBaEQsU0FBZ0QsQ0FBQzt3QkFDakQsS0FBQSxNQUFNLENBQUE7d0JBQ0oscUJBQU0sdUNBQWEsQ0FBQywyQkFBMkIsQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLENBQUMsV0FBVyxFQUFFLEVBQUE7O3dCQUQ1RSxrQkFDRSxTQUEwRSxFQUMzRSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQzt3QkFDYixlQUFNLENBQUMsSUFBSSxDQUFDLHFCQUFxQixHQUFHLElBQUksQ0FBQyxDQUFDOzs7OztLQUMzQztJQUVEOztPQUVHO0lBQ2lCLHNDQUFzQixHQUExQyxVQUEyQyxJQUFJLEVBQUUsT0FBTzs7Ozs7NEJBQ3RELHFCQUFNLElBQUksQ0FBQyxlQUFlLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxFQUFFLE9BQU8sQ0FBQyxFQUFBOzt3QkFBMUQsU0FBMEQsQ0FBQzt3QkFDM0QsS0FBQSxNQUFNLENBQUE7d0JBQ0oscUJBQU0sdUNBQWEsQ0FBQywyQkFBMkIsQ0FDN0MsS0FBSyxFQUNMLE9BQU8sQ0FDUixDQUFDLFdBQVcsRUFBRSxFQUFBOzt3QkFKakIsa0JBQ0UsU0FHZSxFQUNoQixDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQzt3QkFDYixlQUFNLENBQUMsSUFBSSxDQUFDLDJCQUEyQixHQUFHLElBQUksR0FBRyxNQUFNLEdBQUcsT0FBTyxDQUFDLENBQUM7Ozs7O0tBQ3BFO0lBRUQ7O09BRUc7SUFDaUIsd0NBQXdCLEdBQTVDLFVBQTZDLElBQUk7Ozs7OzRCQUMvQyxxQkFBTSxJQUFJLENBQUMsZUFBZSxDQUFDLGtCQUFrQixDQUFDLElBQUksQ0FBQyxFQUFBOzt3QkFBbkQsU0FBbUQsQ0FBQzt3QkFDekMscUJBQU0sdUNBQWEsQ0FBQywyQkFBMkIsQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLEVBQUE7O3dCQUFqRSxFQUFFLEdBQUcsU0FBNEQ7d0JBQ25ELHFCQUFNLEVBQUUsQ0FBQyxTQUFTLEVBQUUsRUFBQTs7d0JBQWxDLFdBQVcsR0FBRyxTQUFvQjt3QkFDeEMsTUFBTSxDQUFDLFdBQVcsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQzt3QkFDaEMsZUFBTSxDQUFDLElBQUksQ0FBQyx1QkFBdUIsR0FBRyxJQUFJLENBQUMsQ0FBQzs7Ozs7S0FDN0M7SUFHSCxzQkFBQztBQUFELENBQUMsQUE3Q0QsSUE2Q0M7QUE3Q1ksMENBQWUifQ==