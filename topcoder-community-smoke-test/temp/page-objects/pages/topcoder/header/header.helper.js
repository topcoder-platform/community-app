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
var header_po_1 = require("./header.po");
var challenge_listing_helper_1 = require("../challenge-listing/challenge-listing.helper");
var config = require("../../../../config.json");
var common_po_1 = require("../../../common/common.po");
var common_helper_1 = require("../../../common/common.helper");
var arena_constants_1 = require("../arena/arena.constants");
var forum_constants_1 = require("../forum/forum.constants");
var HeaderHelper = /** @class */ (function () {
    function HeaderHelper() {
    }
    HeaderHelper.clickOnBanner = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, header_po_1.HeaderPageObject.banner.click()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    HeaderHelper.clickOnAllChallengesLink = function () {
        return __awaiter(this, void 0, void 0, function () {
            var until, allChallengesLink;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        until = protractor_1.protractor.ExpectedConditions;
                        return [4 /*yield*/, protractor_1.browser.actions().mouseMove(header_po_1.HeaderPageObject.competeLink).perform()];
                    case 1:
                        _a.sent();
                        allChallengesLink = header_po_1.HeaderPageObject.allChallengesLink;
                        return [4 /*yield*/, protractor_1.browser.wait(until.elementToBeClickable(allChallengesLink), 5000)];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, allChallengesLink.click()];
                    case 3:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    HeaderHelper.clickOnCompetitiveProgrammingLink = function () {
        return __awaiter(this, void 0, void 0, function () {
            var until, competitiveProgrammingLink;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        until = protractor_1.protractor.ExpectedConditions;
                        return [4 /*yield*/, protractor_1.browser.actions().mouseMove(header_po_1.HeaderPageObject.competeLink).perform()];
                    case 1:
                        _a.sent();
                        competitiveProgrammingLink = header_po_1.HeaderPageObject.competitiveProgrammingLink;
                        return [4 /*yield*/, protractor_1.browser.wait(until.elementToBeClickable(competitiveProgrammingLink), 5000)];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, competitiveProgrammingLink.click()];
                    case 3:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    HeaderHelper.verifyCompetitiveProgrammingLink = function () {
        return __awaiter(this, void 0, void 0, function () {
            var competitiveProgrammingLink, href;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, protractor_1.browser.actions().mouseMove(header_po_1.HeaderPageObject.competeLink).perform()];
                    case 1:
                        _a.sent();
                        competitiveProgrammingLink = header_po_1.HeaderPageObject.competitiveProgrammingLink.element(protractor_1.by.xpath('..'));
                        return [4 /*yield*/, competitiveProgrammingLink.getAttribute('href')];
                    case 2:
                        href = _a.sent();
                        expect(href).toEqual(arena_constants_1.ArenaPageConstants.url);
                        return [2 /*return*/];
                }
            });
        });
    };
    HeaderHelper.verifyAllTrackLinks = function () {
        return __awaiter(this, void 0, void 0, function () {
            var links, i, until, trackLink;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        links = ['Competitive Programming', 'Data Science', 'Design', 'Development', 'QA'];
                        i = 0;
                        _a.label = 1;
                    case 1:
                        if (!(i < links.length)) return [3 /*break*/, 8];
                        until = protractor_1.protractor.ExpectedConditions;
                        return [4 /*yield*/, challenge_listing_helper_1.ChallengeListingPageHelper.get()];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, protractor_1.browser.actions().mouseMove(header_po_1.HeaderPageObject.tracksLink).perform()];
                    case 3:
                        _a.sent();
                        trackLink = common_po_1.commonPageObjects.getLinkByAriaLabel(links[i]);
                        return [4 /*yield*/, protractor_1.browser.wait(until.elementToBeClickable(trackLink), 5000)];
                    case 4:
                        _a.sent();
                        return [4 /*yield*/, trackLink.click()];
                    case 5:
                        _a.sent();
                        return [4 /*yield*/, protractor_1.browser.wait(until.visibilityOf(protractor_1.element(protractor_1.by.id('react-view'))))];
                    case 6:
                        _a.sent();
                        console.log('User navigated to ' + links[i] + ' page');
                        _a.label = 7;
                    case 7:
                        i++;
                        return [3 /*break*/, 1];
                    case 8: return [2 /*return*/];
                }
            });
        });
    };
    HeaderHelper.verifyAllCommunityLinks = function () {
        return __awaiter(this, void 0, void 0, function () {
            var links, urls, i, until, communityLink, href;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        links = ['TCO', 'Programs', 'Statistics', 'Events', 'Blog', 'Thrive'];
                        urls = ['https://www.' + config.baseUrl + '/tco', 'https://www.' + config.baseUrl + '/community/member-programs', 'https://www.' + config.baseUrl + '/community/statistics', 'https://www.' + config.baseUrl + '/community/events', 'https://www.' + config.baseUrl + '/blog', 'https://www.' + config.baseUrl + '/thrive'];
                        i = 0;
                        _a.label = 1;
                    case 1:
                        if (!(i < links.length)) return [3 /*break*/, 6];
                        until = protractor_1.protractor.ExpectedConditions;
                        return [4 /*yield*/, challenge_listing_helper_1.ChallengeListingPageHelper.get()];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, protractor_1.browser.actions().mouseMove(header_po_1.HeaderPageObject.communityLink).perform()];
                    case 3:
                        _a.sent();
                        communityLink = common_po_1.commonPageObjects.getLinkByAriaLabel(links[i]).element(protractor_1.by.xpath('..'));
                        return [4 /*yield*/, communityLink.getAttribute('href')];
                    case 4:
                        href = _a.sent();
                        expect(href).toEqual(urls[i]);
                        _a.label = 5;
                    case 5:
                        i++;
                        return [3 /*break*/, 1];
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    HeaderHelper.clickForumCommunityLink = function () {
        return __awaiter(this, void 0, void 0, function () {
            var until, communityLink;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        until = protractor_1.protractor.ExpectedConditions;
                        return [4 /*yield*/, challenge_listing_helper_1.ChallengeListingPageHelper.get()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, protractor_1.browser.actions().mouseMove(header_po_1.HeaderPageObject.communityLink).perform()];
                    case 2:
                        _a.sent();
                        communityLink = common_po_1.commonPageObjects.getLinkByAriaLabel('Forums');
                        return [4 /*yield*/, protractor_1.browser.wait(until.elementToBeClickable(communityLink), 5000)];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, communityLink.click()];
                    case 4:
                        _a.sent();
                        console.log('Forum community link clicked');
                        return [2 /*return*/];
                }
            });
        });
    };
    HeaderHelper.verifyForumCommunityLink = function () {
        return __awaiter(this, void 0, void 0, function () {
            var communityLink, href;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, challenge_listing_helper_1.ChallengeListingPageHelper.get()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, protractor_1.browser.actions().mouseMove(header_po_1.HeaderPageObject.communityLink).perform()];
                    case 2:
                        _a.sent();
                        communityLink = common_po_1.commonPageObjects.getLinkByAriaLabel('Forums').element(protractor_1.by.xpath('..'));
                        return [4 /*yield*/, communityLink.getAttribute('href')];
                    case 3:
                        href = _a.sent();
                        expect(href).toEqual(forum_constants_1.ForumPageConstants.url);
                        return [2 /*return*/];
                }
            });
        });
    };
    HeaderHelper.clickOnDashboardLink = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.clickOnUserSpecificLink('Dashboard')];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    HeaderHelper.clickOnMyProfileLink = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.clickOnUserSpecificLink('My Profile')];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    HeaderHelper.clickOnPaymentsLink = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.clickOnUserSpecificLink('Payments')];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    HeaderHelper.clickOnSettingsLink = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.clickOnUserSpecificLink('Settings')];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    HeaderHelper.clickOnLogoutLink = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.clickOnUserSpecificLink('Log Out')];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    HeaderHelper.search = function (inputString) {
        return __awaiter(this, void 0, void 0, function () {
            var searchIcon;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        searchIcon = header_po_1.HeaderPageObject.searchIcon;
                        return [4 /*yield*/, protractor_1.browser.actions().mouseMove(searchIcon).perform()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, header_po_1.HeaderPageObject.searchInput.sendKeys(inputString)];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, header_po_1.HeaderPageObject.searchInput.sendKeys(protractor_1.protractor.Key.ENTER)];
                    case 3:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    HeaderHelper.clickOnUserSpecificLink = function (label) {
        return __awaiter(this, void 0, void 0, function () {
            var until, myUsernameLink, link;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        until = protractor_1.protractor.ExpectedConditions;
                        myUsernameLink = common_po_1.commonPageObjects.findElementByText('div', common_helper_1.commonPageHelper.getConfigUserName());
                        return [4 /*yield*/, protractor_1.browser.actions().mouseMove(myUsernameLink).perform()];
                    case 1:
                        _a.sent();
                        link = common_po_1.commonPageObjects.getLinkByAriaLabel(label);
                        return [4 /*yield*/, protractor_1.browser.wait(until.elementToBeClickable(link), 5000)];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, link.click()];
                    case 3:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    return HeaderHelper;
}());
exports.HeaderHelper = HeaderHelper;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaGVhZGVyLmhlbHBlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3BhZ2Utb2JqZWN0cy9wYWdlcy90b3Bjb2Rlci9oZWFkZXIvaGVhZGVyLmhlbHBlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEseUNBQThEO0FBQzlELHlDQUErQztBQUMvQywwRkFBMkY7QUFDM0YsZ0RBQWtEO0FBQ2xELHVEQUE4RDtBQUM5RCwrREFBaUU7QUFDakUsNERBQThEO0FBQzlELDREQUE4RDtBQUU5RDtJQUFBO0lBMEhBLENBQUM7SUF4SGdCLDBCQUFhLEdBQTFCOzs7OzRCQUNJLHFCQUFNLDRCQUFnQixDQUFDLE1BQU0sQ0FBQyxLQUFLLEVBQUUsRUFBQTs7d0JBQXJDLFNBQXFDLENBQUM7Ozs7O0tBQ3pDO0lBRVkscUNBQXdCLEdBQXJDOzs7Ozs7d0JBQ1UsS0FBSyxHQUFHLHVCQUFVLENBQUMsa0JBQWtCLENBQUM7d0JBQzVDLHFCQUFNLG9CQUFPLENBQUMsT0FBTyxFQUFFLENBQUMsU0FBUyxDQUFDLDRCQUFnQixDQUFDLFdBQVcsQ0FBQyxDQUFDLE9BQU8sRUFBRSxFQUFBOzt3QkFBekUsU0FBeUUsQ0FBQzt3QkFFcEUsaUJBQWlCLEdBQUcsNEJBQWdCLENBQUMsaUJBQWlCLENBQUM7d0JBQzdELHFCQUFNLG9CQUFPLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxvQkFBb0IsQ0FBQyxpQkFBaUIsQ0FBQyxFQUFFLElBQUksQ0FBQyxFQUFBOzt3QkFBdkUsU0FBdUUsQ0FBQzt3QkFFeEUscUJBQU0saUJBQWlCLENBQUMsS0FBSyxFQUFFLEVBQUE7O3dCQUEvQixTQUErQixDQUFDOzs7OztLQUNuQztJQUVZLDhDQUFpQyxHQUE5Qzs7Ozs7O3dCQUNVLEtBQUssR0FBRyx1QkFBVSxDQUFDLGtCQUFrQixDQUFDO3dCQUM1QyxxQkFBTSxvQkFBTyxDQUFDLE9B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