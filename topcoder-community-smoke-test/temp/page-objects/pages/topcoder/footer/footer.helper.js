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
var common_po_1 = require("../../../common/common.po");
var protractor_1 = require("protractor");
var challenge_listing_helper_1 = require("../challenge-listing/challenge-listing.helper");
var footer_constants_1 = require("./footer.constants");
var common_helper_1 = require("../../../common/common.helper");
var FooterHelper = /** @class */ (function () {
    function FooterHelper() {
    }
    FooterHelper.verifyFooterLinks = function () {
        return __awaiter(this, void 0, void 0, function () {
            var linksConfig, i, linkConfig;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        linksConfig = [
                            {
                                label: 'ABOUT US',
                                expectedUrl: footer_constants_1.FooterConstants.content.aboutUrl
                            },
                            {
                                label: 'CONTACT US',
                                expectedUrl: footer_constants_1.FooterConstants.content.contactUrl
                            },
                            {
                                label: 'HELP CENTER',
                                expectedUrl: footer_constants_1.FooterConstants.content.helpUrl
                            },
                            {
                                label: 'PRIVACY POLICY',
                                expectedUrl: footer_constants_1.FooterConstants.content.privacyUrl
                            },
                            {
                                label: 'TERMS',
                                expectedUrl: footer_constants_1.FooterConstants.content.termsUrl
                            }
                        ];
                        i = 0;
                        _a.label = 1;
                    case 1:
                        if (!(i < linksConfig.length)) return [3 /*break*/, 5];
                        linkConfig = linksConfig[i];
                        return [4 /*yield*/, this.verifyLink(linkConfig.label, linkConfig.expectedUrl)];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, challenge_listing_helper_1.ChallengeListingPageHelper.get()];
                    case 3:
                        _a.sent();
                        _a.label = 4;
                    case 4:
                        i++;
                        return [3 /*break*/, 1];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    FooterHelper.verifyLink = function (label, expectedUrl) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, common_po_1.commonPageObjects.findElementByText('a', label).click()];
                    case 1:
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
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    FooterHelper.verifySocialIcons = function () {
        return __awaiter(this, void 0, void 0, function () {
            var linksConfig, i, linkConfig;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        linksConfig = [
                            {
                                label: 'Facebook',
                                expectedUrl: footer_constants_1.FooterConstants.content.fbUrl
                            },
                            {
                                label: 'Twitter',
                                expectedUrl: footer_constants_1.FooterConstants.content.twitterUrl
                            },
                            {
                                label: 'Linkedin',
                                expectedUrl: footer_constants_1.FooterConstants.content.linkedInUrl
                            },
                            {
                                label: 'Instagram',
                                expectedUrl: footer_constants_1.FooterConstants.content.instagramUrl
                            }
                        ];
                        i = 0;
                        _a.label = 1;
                    case 1:
                        if (!(i < linksConfig.length)) return [3 /*break*/, 4];
                        linkConfig = linksConfig[i];
                        return [4 /*yield*/, this.verifySocialLink(linkConfig.label, linkConfig.expectedUrl)];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3:
                        i++;
                        return [3 /*break*/, 1];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    FooterHelper.verifySocialLink = function (label, expectedUrl) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, common_po_1.commonPageObjects.getLinkByAriaLabel(label).click()];
                    case 1:
                        _a.sent();
                        if (!(label === 'Linkedin')) return [3 /*break*/, 3];
                        // specifically checking differently for linkedin since Linkedin url doesn't always land on the topcoder profile page as it detects that Selenium web-driver is running and hence  shows some verification page
                        return [4 /*yield*/, common_helper_1.commonPageHelper.verifyPopupWindow()];
                    case 2:
                        // specifically checking differently for linkedin since Linkedin url doesn't always land on the topcoder profile page as it detects that Selenium web-driver is running and hence  shows some verification page
                        _a.sent();
                        return [3 /*break*/, 5];
                    case 3: return [4 /*yield*/, common_helper_1.commonPageHelper.verifyPopupWindowWithUrl(expectedUrl)];
                    case 4:
                        _a.sent();
                        _a.label = 5;
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    return FooterHelper;
}());
exports.FooterHelper = FooterHelper;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZm9vdGVyLmhlbHBlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3BhZ2Utb2JqZWN0cy9wYWdlcy90b3Bjb2Rlci9mb290ZXIvZm9vdGVyLmhlbHBlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsdURBQThEO0FBQzlELHlDQUFxQztBQUNyQywwRkFBMkY7QUFDM0YsdURBQXFEO0FBQ3JELCtEQUFpRTtBQUVqRTtJQUFBO0lBeUVBLENBQUM7SUF4RWdCLDhCQUFpQixHQUE5Qjs7Ozs7O3dCQUNVLFdBQVcsR0FBRzs0QkFDaEI7Z0NBQ0ksS0FBSyxFQUFFLFVBQVU7Z0NBQ2pCLFdBQVcsRUFBRSxrQ0FBZSxDQUFDLE9BQU8sQ0FBQyxRQUFROzZCQUNoRDs0QkFDRDtnQ0FDSSxLQUFLLEVBQUUsWUFBWTtnQ0FDbkIsV0FBVyxFQUFFLGtDQUFlLENBQUMsT0FBTyxDQUFDLFVBQVU7NkJBQ2xEOzRCQUNEO2dDQUNJLEtBQUssRUFBRSxhQUFhO2dDQUNwQixXQUFXLEVBQUUsa0NBQWUsQ0FBQyxPQUFPLENBQUMsT0FBTzs2QkFDL0M7NEJBQ0Q7Z0NBQ0ksS0FBSyxFQUFFLGdCQUFnQjtnQ0FDdkIsV0FBVyxFQUFFLGtDQUFlLENBQUMsT0FBTyxDQUFDLFVBQVU7NkJBQ2xEOzRCQUNEO2dDQUNJLEtBQUssRUFBRSxPQUFPO2dDQUNkLFdBQVcsRUFBRSxrQ0FBZSxDQUFDLE9BQU8sQ0FBQyxRQUFROzZCQUNoRDt5QkFDSixDQUFDO3dCQUNPLENBQUMsR0FBRyxDQUFDOzs7NkJBQUUsQ0FBQSxDQUFDLEdBQUcsV0FBVyxDQUFDLE1BQU0sQ0FBQTt3QkFDNUIsVUFBVSxHQUFHLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQzt3QkFDbEMscUJBQU0sSUFBSSxDQUFDLFVBQVUsQ0FBQyxVQUFVLENBQUMsS0FBSyxFQUFFLFVBQVUsQ0FBQyxXQUFXLENBQUMsRUFBQTs7d0JBQS9ELFNBQStELENBQUM7d0JBQ2hFLHFCQUFNLHFEQUEwQixDQUFDLEdBQUcsRUFBRSxFQUFBOzt3QkFBdEMsU0FBc0MsQ0FBQzs7O3dCQUhILENBQUMsRUFBRSxDQUFBOzs7Ozs7S0FLOUM7SUFFWSx1QkFBVSxHQUF2QixVQUF3QixLQUFhLEVBQUUsV0FBbUI7Ozs7OzRCQUN0RCxxQkFBTSw2QkFBaUIsQ0FBQyxpQkFBaUIsQ0FBQyxHQUFHLEVBQUUsS0FBSyxDQUFDLENBQUMsS0FBSyxFQUFFLEVBQUE7O3dCQUE3RCxTQUE2RCxDQUFDO3dCQUM5RCxxQkFBTSxvQkFBTyxDQUFDLElBQUksQ0FBQzs7OztnREFDSCxxQkFBTSxvQkFBTyxDQUFDLGFBQWEsRUFBRSxFQUFBOzs0Q0FBbkMsR0FBRyxHQUFHLFNBQTZCOzRDQUN6QyxzQkFBTyxHQUFHLEtBQUssV0FBVyxFQUFDOzs7aUNBQzlCLENBQUMsRUFBQTs7d0JBSEYsU0FHRSxDQUFDOzs7OztLQUNOO0lBRVksOEJBQWlCLEdBQTlCOzs7Ozs7d0JBQ1UsV0FBVyxHQUFHOzRCQUNoQjtnQ0FDSSxLQUFLLEVBQUUsVUFBVTtnQ0FDakIsV0FBVyxFQUFFLGtDQUFlLENBQUMsT0FBTyxDQUFDLEtBQUs7NkJBQzdDOzRCQUNEO2dDQUNJLEtBQUssRUFBRSxTQUFTO2dDQUNoQixXQUFXLEVBQUUsa0NBQWUsQ0FBQyxPQUFPLENBQUMsVUFBVTs2QkFDbEQ7NEJBQ0Q7Z0NBQ0ksS0FBSyxFQUFFLFVBQVU7Z0NBQ2pCLFdBQVcsRUFBRSxrQ0FBZSxDQUFDLE9BQU8sQ0FBQyxXQUFXOzZCQUNuRDs0QkFDRDtnQ0FDSSxLQUFLLEVBQUUsV0FBVztnQ0FDbEIsV0FBVyxFQUFFLGtDQUFlLENBQUMsT0FBTyxDQUFDLFlBQVk7NkJBQ3BEO3lCQUNKLENBQUM7d0JBQ08sQ0FBQyxHQUFHLENBQUM7Ozs2QkFBRSxDQUFBLENBQUMsR0FBRyxXQUFXLENBQUMsTUFBTSxDQUFBO3dCQUM1QixVQUFVLEdBQUcsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDO3dCQUNsQyxxQkFBTSxJQUFJLENBQUMsZ0JBQWdCLENBQUMsVUFBVSxDQUFDLEtBQUssRUFBRSxVQUFVLENBQUMsV0FBVyxDQUFDLEVBQUE7O3dCQUFyRSxTQUFxRSxDQUFDOzs7d0JBRmxDLENBQUMsRUFBRSxDQUFBOzs7Ozs7S0FJOUM7SUFFWSw2QkFBZ0IsR0FBN0IsVUFBOEIsS0FBYSxFQUFFLFdBQW1COzs7OzRCQUM1RCxxQkFBTSw2QkFBaUIsQ0FBQyxrQkFBa0IsQ0FBQyxLQUFLLENBQUMsQ0FBQyxLQUFLLEVBQUUsRUFBQTs7d0JBQXpELFNBQXlELENBQUM7NkJBQ3RELENBQUEsS0FBSyxLQUFLLFVBQVUsQ0FBQSxFQUFwQix3QkFBb0I7d0JBQ3BCLCtNQUErTTt3QkFDL00scUJBQU0sZ0NBQWdCLENBQUMsaUJBQWlCLEVBQUUsRUFBQTs7d0JBRDFDLCtNQUErTTt3QkFDL00sU0FBMEMsQ0FBQzs7NEJBRTNDLHFCQUFNLGdDQUFnQixDQUFDLHdCQUF3QixDQUFDLFdBQVcsQ0FBQyxFQUFBOzt3QkFBNUQsU0FBNEQsQ0FBQzs7Ozs7O0tBRXBFO0lBQ0wsbUJBQUM7QUFBRCxDQUFDLEFBekVELElBeUVDO0FBekVZLG9DQUFZIn0=