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
var challenge_listing_constants_1 = require("./challenge-listing.constants");
var common_helper_1 = require("../../../common/common.helper");
var challenge_listing_po_1 = require("./challenge-listing.po");
var config = require("../../../../config.json");
var common_po_1 = require("../../../common/common.po");
var ChallengeListingPageHelper = /** @class */ (function () {
    function ChallengeListingPageHelper() {
    }
    ChallengeListingPageHelper.get = function () {
        return __awaiter(this, void 0, void 0, function () {
            var isSurveyModalDisplayed;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, protractor_1.browser.get(challenge_listing_constants_1.ChallengeListingPageConstants.url)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, console.log('User navigated to Challenges Page')];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, challenge_listing_po_1.ChallengeListingPageObject.surveyModal.isPresent()];
                    case 3:
                        isSurveyModalDisplayed = _a.sent();
                        if (!isSurveyModalDisplayed) return [3 /*break*/, 5];
                        // Survey modal displayed, refreshing page again
                        return [4 /*yield*/, protractor_1.browser.get(challenge_listing_constants_1.ChallengeListingPageConstants.url)];
                    case 4:
                        // Survey modal displayed, refreshing page again
                        _a.sent();
                        _a.label = 5;
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    ChallengeListingPageHelper.clickJoinNow = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, common_helper_1.commonPageHelper.clickOnAnchorText('Join')];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, console.log('Join now button clicked')];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ChallengeListingPageHelper.clickLogin = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, common_helper_1.commonPageHelper.clickOnAnchorText('Log In')];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, console.log('Login button clicked')];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ChallengeListingPageHelper.verifyChallengesAfterLogin = function () {
        return __awaiter(this, void 0, void 0, function () {
            var until, headers, expectedHeaders, i, headerText;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        until = protractor_1.protractor.ExpectedConditions;
                        return [4 /*yield*/, protractor_1.browser.wait(until.visibilityOf(protractor_1.element(protractor_1.by.tagName('h2'))))];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, challenge_listing_po_1.ChallengeListingPageObject.h2Fields];
                    case 2:
                        headers = _a.sent();
                        expectedHeaders = ['My Challenges', 'Open for registration', 'Ongoing challenges'];
                        if (headers.length === 2) {
                            expectedHeaders = ['Open for registration', 'Ongoing challenges'];
                        }
                        i = 0;
                        _a.label = 3;
                    case 3:
                        if (!(i < headers.length)) return [3 /*break*/, 6];
                        return [4 /*yield*/, headers[i].getText()];
                    case 4:
                        headerText = _a.sent();
                        expect(headerText).toEqual(expectedHeaders[i]);
                        _a.label = 5;
                    case 5:
                        i++;
                        return [3 /*break*/, 3];
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    ChallengeListingPageHelper.verifyOpenForRegistrationChallenges = function () {
        return __awaiter(this, void 0, void 0, function () {
            var until, headers, registrationChallenges;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        until = protractor_1.protractor.ExpectedConditions;
                        return [4 /*yield*/, protractor_1.browser.wait(until.visibilityOf(protractor_1.element(protractor_1.by.tagName('h2'))))];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, challenge_listing_po_1.ChallengeListingPageObject.h2Fields];
                    case 2:
                        headers = _a.sent();
                        return [4 /*yield*/, headers[0].getText()];
                    case 3:
                        registrationChallenges = _a.sent();
                        expect(registrationChallenges).toEqual('Open for registration');
                        return [2 /*return*/];
                }
            });
        });
    };
    ChallengeListingPageHelper.verifyOngoingChallenges = function () {
        return __awaiter(this, void 0, void 0, function () {
            var until, headers, ongoingChallenges;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        until = protractor_1.protractor.ExpectedConditions;
                        return [4 /*yield*/, protractor_1.browser.wait(until.visibilityOf(protractor_1.element(protractor_1.by.tagName('h2'))))];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, challenge_listing_po_1.ChallengeListingPageObject.h2Fields];
                    case 2:
                        headers = _a.sent();
                        return [4 /*yield*/, headers[1].getText()];
                    case 3:
                        ongoingChallenges = _a.sent();
                        expect(ongoingChallenges).toEqual('Ongoing challenges');
                        return [2 /*return*/];
                }
            });
        });
    };
    ChallengeListingPageHelper.verifyAllChallenges = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.verifyOpenForRegistrationChallenges()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.verifyOngoingChallenges()];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ChallengeListingPageHelper.waitTillOnlyOneHeaderPresentWithText = function (header) {
        return __awaiter(this, void 0, void 0, function () {
            var headers;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, challenge_listing_po_1.ChallengeListingPageObject.h2Fields];
                    case 1:
                        headers = _a.sent();
                        return [4 /*yield*/, protractor_1.browser.wait(function () { return __awaiter(_this, void 0, void 0, function () {
                                var text;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: return [4 /*yield*/, headers[0].getText()];
                                        case 1:
                                            text = _a.sent();
                                            return [2 /*return*/, headers.length === 1 && text === header];
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
    ChallengeListingPageHelper.verifyOpenForRegistrationChallengesOnly = function () {
        return __awaiter(this, void 0, void 0, function () {
            var openForRegistrationLink;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, challenge_listing_po_1.ChallengeListingPageObject.filterChallengesBy('Open for registration')];
                    case 1:
                        openForRegistrationLink = _a.sent();
                        return [4 /*yield*/, openForRegistrationLink.click()];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, this.waitTillOnlyOneHeaderPresentWithText('Open for registration')];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, this.verifyOpenForRegistrationChallenges()];
                    case 4:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ChallengeListingPageHelper.verifyOngoingChallengesOnly = function () {
        return __awaiter(this, void 0, void 0, function () {
            var until, ongoingChallengesLink, endsEl;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        until = protractor_1.protractor.ExpectedConditions;
                        return [4 /*yield*/, challenge_listing_po_1.ChallengeListingPageObject.filterChallengesBy('Ongoing challenges')];
                    case 1:
                        ongoingChallengesLink = _a.sent();
                        return [4 /*yield*/, ongoingChallengesLink.click()];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, this.waitTillOnlyOneHeaderPresentWithText('Ongoing challenges')];
                    case 3:
                        _a.sent();
                        endsEl = common_po_1.commonPageObjects.findElementByText('span', 'Ends ');
                        return [4 /*yield*/, protractor_1.browser.wait(until.visibilityOf(endsEl))];
                    case 4:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ChallengeListingPageHelper.verifyOpenForReviewChallengesOnly = function () {
        return __awaiter(this, void 0, void 0, function () {
            var until, openForReviewLink, iterativeReviewEl, headers;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        until = protractor_1.protractor.ExpectedConditions;
                        return [4 /*yield*/, challenge_listing_po_1.ChallengeListingPageObject.filterChallengesBy('Open for review')];
                    case 1:
                        openForReviewLink = _a.sent();
                        return [4 /*yield*/, openForReviewLink.click()];
                    case 2:
                        _a.sent();
                        iterativeReviewEl = common_po_1.commonPageObjects.findElementByText('span', 'Iterative Review');
                        return [4 /*yield*/, protractor_1.browser.wait(until.visibilityOf(iterativeReviewEl))];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, this.verifyOpenForReviewChallenges()];
                    case 4:
                        _a.sent();
                        return [4 /*yield*/, challenge_listing_po_1.ChallengeListingPageObject.h2Fields];
                    case 5:
                        headers = _a.sent();
                        expect(headers.length).toEqual(1);
                        return [2 /*return*/];
                }
            });
        });
    };
    ChallengeListingPageHelper.verifyOpenForReviewChallenges = function () {
        return __awaiter(this, void 0, void 0, function () {
            var reviewStatusEls, i, el, status_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, challenge_listing_po_1.ChallengeListingPageObject.reviewStatusElements()];
                    case 1:
                        reviewStatusEls = _a.sent();
                        i = 0;
                        _a.label = 2;
                    case 2:
                        if (!(i < reviewStatusEls.length)) return [3 /*break*/, 5];
                        el = reviewStatusEls[i];
                        return [4 /*yield*/, el.getText()];
                    case 3:
                        status_1 = _a.sent();
                        expect(status_1.includes('Review')).toBe(true);
                        _a.label = 4;
                    case 4:
                        i++;
                        return [3 /*break*/, 2];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    ChallengeListingPageHelper.verifyPastChallengesOnly = function () {
        return __awaiter(this, void 0, void 0, function () {
            var until, pastChallengesLink, endedEl, headers;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        until = protractor_1.protractor.ExpectedConditions;
                        return [4 /*yield*/, challenge_listing_po_1.ChallengeListingPageObject.filterChallengesBy('Past challenges')];
                    case 1:
                        pastChallengesLink = _a.sent();
                        return [4 /*yield*/, pastChallengesLink.click()];
                    case 2:
                        _a.sent();
                        endedEl = common_po_1.commonPageObjects.findElementByText('span', 'Ended ');
                        return [4 /*yield*/, protractor_1.browser.wait(until.visibilityOf(endedEl))];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, challenge_listing_po_1.ChallengeListingPageObject.h2Fields];
                    case 4:
                        headers = _a.sent();
                        expect(headers.length).toEqual(1);
                        return [2 /*return*/];
                }
            });
        });
    };
    ChallengeListingPageHelper.verifyWithAllSwitchesTurnedOff = function () {
        return __awaiter(this, void 0, void 0, function () {
            var until, el, ongoingChallengesLink, headers, openForReviewLink, noReviewElement, isDisplayed;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        until = protractor_1.protractor.ExpectedConditions;
                        return [4 /*yield*/, challenge_listing_po_1.ChallengeListingPageObject.designSwitch()];
                    case 1:
                        el = _a.sent();
                        return [4 /*yield*/, el.click()];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, protractor_1.browser.wait(until.presenceOf(challenge_listing_po_1.ChallengeListingPageObject.designSwitchTurnedOff))];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, challenge_listing_po_1.ChallengeListingPageObject.developmentSwitch()];
                    case 4:
                        el = _a.sent();
                        return [4 /*yield*/, el.click()];
                    case 5:
                        _a.sent();
                        return [4 /*yield*/, protractor_1.browser.wait(until.presenceOf(challenge_listing_po_1.ChallengeListingPageObject.developmentSwitchTurnedOff))];
                    case 6:
                        _a.sent();
                        return [4 /*yield*/, challenge_listing_po_1.ChallengeListingPageObject.dataScienceSwitch()];
                    case 7:
                        el = _a.sent();
                        return [4 /*yield*/, el.click()];
                    case 8:
                        _a.sent();
                        return [4 /*yield*/, protractor_1.browser.wait(until.presenceOf(challenge_listing_po_1.ChallengeListingPageObject.dataScienceSwitchTurnedOff))];
                    case 9:
                        _a.sent();
                        return [4 /*yield*/, challenge_listing_po_1.ChallengeListingPageObject.filterChallengesBy('Ongoing challenges')];
                    case 10:
                        ongoingChallengesLink = _a.sent();
                        return [4 /*yield*/, ongoingChallengesLink.click()];
                    case 11:
                        _a.sent();
                        return [4 /*yield*/, challenge_listing_po_1.ChallengeListingPageObject.h2Fields];
                    case 12:
                        headers = _a.sent();
                        expect(headers.length).toBe(0);
                        return [4 /*yield*/, protractor_1.browser.wait(function () { return __awaiter(_this, void 0, void 0, function () {
                                var ongoingChallengesText;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: return [4 /*yield*/, ongoingChallengesLink.getText()];
                                        case 1:
                                            ongoingChallengesText = _a.sent();
                                            return [2 /*return*/, ongoingChallengesText.replace(/(\r\n|\n|\r)/gm, " ") === 'Ongoing challenges 0'];
                                    }
                                });
                            }); }, 15000)];
                    case 13:
                        _a.sent();
                        return [4 /*yield*/, challenge_listing_po_1.ChallengeListingPageObject.filterChallengesBy('Open for review')];
                    case 14:
                        openForReviewLink = _a.sent();
                        return [4 /*yield*/, openForReviewLink.click()];
                    case 15:
                        _a.sent();
                        return [4 /*yield*/, this.waitTillOnlyOneHeaderPresentWithText('Open for review')];
                    case 16:
                        _a.sent();
                        noReviewElement = common_po_1.commonPageObjects.findElementByText('div', 'There are no review opportunities available');
                        return [4 /*yield*/, protractor_1.browser.wait(until.visibilityOf(noReviewElement))];
                    case 17:
                        _a.sent();
                        return [4 /*yield*/, noReviewElement.isDisplayed()];
                    case 18:
                        isDisplayed = _a.sent();
                        expect(isDisplayed).toBe(true);
                        return [2 /*return*/];
                }
            });
        });
    };
    ChallengeListingPageHelper.clickOnRssLink = function () {
        return __awaiter(this, void 0, void 0, function () {
            var el;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, challenge_listing_po_1.ChallengeListingPageObject.rssLink()];
                    case 1:
                        el = _a.sent();
                        return [4 /*yield*/, el.click()];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ChallengeListingPageHelper.verifyRssPage = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, protractor_1.browser.wait(function () { return __awaiter(_this, void 0, void 0, function () {
                            var url;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, protractor_1.browser.getCurrentUrl()];
                                    case 1:
                                        url = _a.sent();
                                        return [2 /*return*/, url === challenge_listing_constants_1.ChallengeListingPageConstants.content.rssFeedUrl];
                                }
                            });
                        }); })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ChallengeListingPageHelper.verifyLinkUnderRss = function (label, expectedUrl) {
        return __awaiter(this, void 0, void 0, function () {
            var el;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, challenge_listing_po_1.ChallengeListingPageObject.getLinkUnderRss(label)];
                    case 1:
                        el = _a.sent();
                        return [4 /*yield*/, el.click()];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, common_helper_1.commonPageHelper.verifyPopupWindowWithUrl(expectedUrl)];
                    case 3:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ChallengeListingPageHelper.verifyLinksUnderRss = function () {
        return __awaiter(this, void 0, void 0, function () {
            var linksConfig, i, linkConfig;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        linksConfig = [
                            {
                                label: 'About',
                                expectedUrl: challenge_listing_constants_1.ChallengeListingPageConstants.content.aboutUrl
                            },
                            {
                                label: 'Contact',
                                expectedUrl: challenge_listing_constants_1.ChallengeListingPageConstants.content.contactUrl
                            },
                            {
                                label: 'Help',
                                expectedUrl: challenge_listing_constants_1.ChallengeListingPageConstants.content.helpUrl
                            },
                            {
                                label: 'Privacy',
                                expectedUrl: challenge_listing_constants_1.ChallengeListingPageConstants.content.privacyUrl
                            },
                            {
                                label: 'Terms',
                                expectedUrl: challenge_listing_constants_1.ChallengeListingPageConstants.content.termsUrl
                            }
                        ];
                        i = 0;
                        _a.label = 1;
                    case 1:
                        if (!(i < linksConfig.length)) return [3 /*break*/, 4];
                        linkConfig = linksConfig[i];
                        return [4 /*yield*/, this.verifyLinkUnderRss(linkConfig.label, linkConfig.expectedUrl)];
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
    ChallengeListingPageHelper.clickOnSRMTab = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, common_helper_1.commonPageHelper.clickOnAnchorText('SRMs')];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, console.log('Clicked on SRM tab')];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ChallengeListingPageHelper.fillAndVerifySearchResults = function () {
        return __awaiter(this, void 0, void 0, function () {
            var until, searchString, challenges, challengeNames;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        until = protractor_1.protractor.ExpectedConditions;
                        return [4 /*yield*/, protractor_1.browser.wait(until.visibilityOf(challenge_listing_po_1.ChallengeListingPageObject.firstChallengeLink))];
                    case 1:
                        _a.sent();
                        searchString = config.challengeListing.search.query;
                        return [4 /*yield*/, challenge_listing_po_1.ChallengeListingPageObject.challengeSearchBox.sendKeys(searchString)];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, challenge_listing_po_1.ChallengeListingPageObject.challengeSearchButton.click()];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, protractor_1.browser.sleep(2000)];
                    case 4:
                        _a.sent();
                        challenges = challenge_listing_po_1.ChallengeListingPageObject.challengeLinks;
                        return [4 /*yield*/, challenges.getText()];
                    case 5:
                        challengeNames = _a.sent();
                        expect(challengeNames).toEqual([searchString]);
                        return [2 /*return*/];
                }
            });
        });
    };
    ChallengeListingPageHelper.verifyFilterToggle = function () {
        return __awaiter(this, void 0, void 0, function () {
            var until, filtersVisibility;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        until = protractor_1.protractor.ExpectedConditions;
                        return [4 /*yield*/, challenge_listing_po_1.ChallengeListingPageObject.filterButton.click()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, protractor_1.browser.wait(until.visibilityOf(challenge_listing_po_1.ChallengeListingPageObject.keywordsLabel))];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, challenge_listing_po_1.ChallengeListingPageObject.keywordsLabel.isDisplayed()];
                    case 3:
                        filtersVisibility = _a.sent();
                        expect(filtersVisibility).toBe(true);
                        return [4 /*yield*/, challenge_listing_po_1.ChallengeListingPageObject.filterButton.click()];
                    case 4:
                        _a.sent();
                        return [4 /*yield*/, challenge_listing_po_1.ChallengeListingPageObject.keywordsLabel.isDisplayed()];
                    case 5:
                        filtersVisibility = _a.sent();
                        expect(filtersVisibility).toBe(false);
                        return [2 /*return*/];
                }
            });
        });
    };
    ChallengeListingPageHelper.verifyFilterByKeywords = function () {
        return __awaiter(this, void 0, void 0, function () {
            var until, filtersVisibility;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        until = protractor_1.protractor.ExpectedConditions;
                        return [4 /*yield*/, challenge_listing_po_1.ChallengeListingPageObject.filterButton.click()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, protractor_1.browser.wait(until.visibilityOf(challenge_listing_po_1.ChallengeListingPageObject.keywordsLabel))];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, challenge_listing_po_1.ChallengeListingPageObject.keywordsLabel.isDisplayed()];
                    case 3:
                        filtersVisibility = _a.sent();
                        expect(filtersVisibility).toBe(true);
                        return [4 /*yield*/, this.selectKeyword('Java')];
                    case 4:
                        _a.sent();
                        return [4 /*yield*/, this.verifyChallengesMatchingKeyword(['Java'])];
                    case 5:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ChallengeListingPageHelper.verifyFilterBySubtrack = function () {
        return __awaiter(this, void 0, void 0, function () {
            var until, filtersVisibility, count;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        until = protractor_1.protractor.ExpectedConditions;
                        return [4 /*yield*/, challenge_listing_po_1.ChallengeListingPageObject.filterButton.click()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, protractor_1.browser.wait(until.visibilityOf(challenge_listing_po_1.ChallengeListingPageObject.subtrackLabel))];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, challenge_listing_po_1.ChallengeListingPageObject.subtrackLabel.isDisplayed()];
                    case 3:
                        filtersVisibility = _a.sent();
                        expect(filtersVisibility).toBe(true);
                        return [4 /*yield*/, this.selectSubtrack('Web Design')];
                    case 4:
                        _a.sent();
                        return [4 /*yield*/, this.getAllChallengesCount()];
                    case 5:
                        count = _a.sent();
                        return [4 /*yield*/, this.verifyChallengesMatchingSubtrack(count, [
                                { name: 'Wb' }
                            ])];
                    case 6:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ChallengeListingPageHelper.verifyFilterByKeywordsAndSubTrack = function () {
        return __awaiter(this, void 0, void 0, function () {
            var count;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.selectKeyword('Java')];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.selectSubtrack('Code')];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, this.verifyChallengesMatchingKeyword(['Java'])];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, this.getAllChallengesCount()];
                    case 4:
                        count = _a.sent();
                        return [4 /*yield*/, this.verifyChallengesMatchingSubtrack(count, [
                                { name: 'Cd' }
                            ])];
                    case 5:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ChallengeListingPageHelper.verifyFilterBySubCommunity = function () {
        return __awaiter(this, void 0, void 0, function () {
            var until, filtersVisibility, challenges, count;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        until = protractor_1.protractor.ExpectedConditions;
                        return [4 /*yield*/, challenge_listing_po_1.ChallengeListingPageObject.filterButton.click()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, protractor_1.browser.wait(until.visibilityOf(challenge_listing_po_1.ChallengeListingPageObject.subCommunityLabel))];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, challenge_listing_po_1.ChallengeListingPageObject.subCommunityLabel.isDisplayed()];
                    case 3:
                        filtersVisibility = _a.sent();
                        expect(filtersVisibility).toBe(true);
                        return [4 /*yield*/, this.selectSubCommunity(1)];
                    case 4:
                        _a.sent();
                        return [4 /*yield*/, challenge_listing_po_1.ChallengeListingPageObject.challengeLinks];
                    case 5:
                        challenges = _a.sent();
                        return [4 /*yield*/, this.getAllChallengesCount()];
                    case 6:
                        count = _a.sent();
                        expect(challenges.length).toEqual(count);
                        return [4 /*yield*/, this.selectSubCommunity(0)];
                    case 7:
                        _a.sent();
                        return [4 /*yield*/, challenge_listing_po_1.ChallengeListingPageObject.challengeLinks];
                    case 8:
                        challenges = _a.sent();
                        return [4 /*yield*/, this.getAllChallengesCount()];
                    case 9:
                        count = _a.sent();
                        expect(challenges.length > 0).toBe(true);
                        return [2 /*return*/];
                }
            });
        });
    };
    ChallengeListingPageHelper.openFiltersPanel = function () {
        return __awaiter(this, void 0, void 0, function () {
            var until, filtersVisibility;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        until = protractor_1.protractor.ExpectedConditions;
                        return [4 /*yield*/, challenge_listing_po_1.ChallengeListingPageObject.filterButton.click()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, protractor_1.browser.wait(until.visibilityOf(challenge_listing_po_1.ChallengeListingPageObject.keywordsLabel))];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, challenge_listing_po_1.ChallengeListingPageObject.keywordsLabel.isDisplayed()];
                    case 3:
                        filtersVisibility = _a.sent();
                        expect(filtersVisibility).toBe(true);
                        return [2 /*return*/];
                }
            });
        });
    };
    ChallengeListingPageHelper.verifyFilterByMultipleKeywords = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.selectKeyword('Java')];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.selectKeyword('HTML5')];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, this.verifyChallengesMatchingKeyword(['Java', 'HTML5'])];
                    case 3:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ChallengeListingPageHelper.verifyFilterByMultipleSubtracks = function () {
        return __awaiter(this, void 0, void 0, function () {
            var count;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.selectSubtrack('Assembly Competition')];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.selectSubtrack('Code')];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, this.getAllChallengesCount()];
                    case 3:
                        count = _a.sent();
                        return [4 /*yield*/, this.verifyChallengesMatchingSubtrack(count, [
                                { name: 'As' },
                                { name: 'Cd' }
                            ])];
                    case 4:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ChallengeListingPageHelper.verifyRemovalOfKeyword = function () {
        return __awaiter(this, void 0, void 0, function () {
            var removeTags;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, challenge_listing_po_1.ChallengeListingPageObject.allRemoveTags()];
                    case 1:
                        removeTags = _a.sent();
                        // remove HTML5 tag
                        return [4 /*yield*/, removeTags[1].click()];
                    case 2:
                        // remove HTML5 tag
                        _a.sent();
                        return [4 /*yield*/, this.verifyChallengesMatchingKeyword(['Java'])];
                    case 3:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ChallengeListingPageHelper.verifyRemovalOfSubtrack = function () {
        return __awaiter(this, void 0, void 0, function () {
            var removeTags, count;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, challenge_listing_po_1.ChallengeListingPageObject.allRemoveTags()];
                    case 1:
                        removeTags = _a.sent();
                        // remove Code subtrack
                        return [4 /*yield*/, removeTags[2].click()];
                    case 2:
                        // remove Code subtrack
                        _a.sent();
                        return [4 /*yield*/, this.getAllChallengesCount()];
                    case 3:
                        count = _a.sent();
                        return [4 /*yield*/, this.verifyChallengesMatchingSubtrack(count, [
                                { name: 'As' }
                            ])];
                    case 4:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ChallengeListingPageHelper.selectKeyword = function (keyword) {
        return __awaiter(this, void 0, void 0, function () {
            var until, keywordElements, matchingKeyword;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        until = protractor_1.protractor.ExpectedConditions;
                        return [4 /*yield*/, challenge_listing_po_1.ChallengeListingPageObject.keywordInput.sendKeys(keyword)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, protractor_1.browser.wait(until.visibilityOf(protractor_1.element(protractor_1.by.className('Select-option'))))];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, challenge_listing_po_1.ChallengeListingPageObject.keywordSelection];
                    case 3:
                        keywordElements = _a.sent();
                        matchingKeyword = keywordElements[0];
                        return [4 /*yield*/, matchingKeyword.click()];
                    case 4:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ChallengeListingPageHelper.selectSubtrack = function (track) {
        return __awaiter(this, void 0, void 0, function () {
            var subtrackElements, matchingTrack;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, challenge_listing_po_1.ChallengeListingPageObject.subtrackInput.sendKeys(track)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, challenge_listing_po_1.ChallengeListingPageObject.subtrackSelection];
                    case 2:
                        subtrackElements = _a.sent();
                        matchingTrack = subtrackElements[0];
                        return [4 /*yield*/, matchingTrack.click()];
                    case 3:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ChallengeListingPageHelper.selectSubCommunity = function (index) {
        return __awaiter(this, void 0, void 0, function () {
            var subCommunityElements, community;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, challenge_listing_po_1.ChallengeListingPageObject.subCommunityDropdown.click()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, challenge_listing_po_1.ChallengeListingPageObject.subCommunitySelection];
                    case 2:
                        subCommunityElements = _a.sent();
                        community = subCommunityElements[index];
                        return [4 /*yield*/, community.click()];
                    case 3:
                        _a.sent();
                        // need to sleep to wait for ajax calls to be completed to filter using the above subtrack
                        return [4 /*yield*/, protractor_1.browser.sleep(5000)];
                    case 4:
                        // need to sleep to wait for ajax calls to be completed to filter using the above subtrack
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ChallengeListingPageHelper.selectDateRange = function () {
        return __awaiter(this, void 0, void 0, function () {
            var dateRangeStartDate;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, challenge_listing_po_1.ChallengeListingPageObject.dateRangeStartDate()];
                    case 1:
                        dateRangeStartDate = _a.sent();
                        return [4 /*yield*/, dateRangeStartDate.click()];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, common_po_1.commonPageObjects.getLinkByAriaLabel('Choose Wednesday, November 27, 2019 as your check-in date. It’s available.').click()];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, protractor_1.browser.sleep(1000)];
                    case 4:
                        _a.sent();
                        return [4 /*yield*/, common_po_1.commonPageObjects.getLinkByAriaLabel('Choose Thursday, November 28, 2019 as your check-out date. It’s available.').click()];
                    case 5:
                        _a.sent();
                        return [4 /*yield*/, protractor_1.browser.sleep(1000)];
                    case 6:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ChallengeListingPageHelper.verifyNumberOfAppliedFilters = function (expectedNumberOfAppliedFilters) {
        return __awaiter(this, void 0, void 0, function () {
            var appliedFiltersText;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, challenge_listing_po_1.ChallengeListingPageObject.appliedFilters.getText()];
                    case 1:
                        appliedFiltersText = _a.sent();
                        if (expectedNumberOfAppliedFilters === 0) {
                            expect(appliedFiltersText).toEqual('Filters');
                        }
                        else {
                            expect(appliedFiltersText).toEqual('Filters' + expectedNumberOfAppliedFilters);
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    ChallengeListingPageHelper.clearFilters = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, common_po_1.commonPageObjects.findElementByText('button', 'Clear filters').click()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ChallengeListingPageHelper.verifySaveFilterState = function (enabled) {
        return __awaiter(this, void 0, void 0, function () {
            var tagName;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, common_po_1.commonPageObjects.findElementByText('div', 'Save filter').getTagName()];
                    case 1:
                        tagName = _a.sent();
                        if (enabled) {
                            expect(tagName).toEqual('button');
                        }
                        else {
                            expect(tagName).toEqual('div');
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    ChallengeListingPageHelper.verifySortingFunctionality = function () {
        return __awaiter(this, void 0, void 0, function () {
            var until, el, submissionEls, numberOfSubmissions, i, text;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        until = protractor_1.protractor.ExpectedConditions;
                        return [4 /*yield*/, protractor_1.browser.sleep(2000)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, challenge_listing_po_1.ChallengeListingPageObject.selectSortOfOpenForRegistrationChallenges()];
                    case 2:
                        el = _a.sent();
                        return [4 /*yield*/, el.click()];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, protractor_1.browser.wait(until.visibilityOf(challenge_listing_po_1.ChallengeListingPageObject.selectNumberOfSubmissions))];
                    case 4:
                        _a.sent();
                        return [4 /*yield*/, challenge_listing_po_1.ChallengeListingPageObject.selectNumberOfSubmissions.click()];
                    case 5:
                        _a.sent();
                        return [4 /*yield*/, challenge_listing_po_1.ChallengeListingPageObject.submissionElements()];
                    case 6:
                        submissionEls = _a.sent();
                        if (!(submissionEls.length > 0)) return [3 /*break*/, 11];
                        return [4 /*yield*/, submissionEls[0].getText()];
                    case 7:
                        numberOfSubmissions = _a.sent();
                        i = 1;
                        _a.label = 8;
                    case 8:
                        if (!(i < submissionEls.length)) return [3 /*break*/, 11];
                        return [4 /*yield*/, submissionEls[i].getText()];
                    case 9:
                        text = _a.sent();
                        expect(parseInt(numberOfSubmissions) >= parseInt(text)).toBe(true);
                        numberOfSubmissions = text;
                        _a.label = 10;
                    case 10:
                        i++;
                        return [3 /*break*/, 8];
                    case 11: return [2 /*return*/];
                }
            });
        });
    };
    ChallengeListingPageHelper.verifyViewMoreChallenges = function () {
        return __awaiter(this, void 0, void 0, function () {
            var els, i, allViewMoreLinks, href, splits, bucket, allChallengesLink;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, challenge_listing_po_1.ChallengeListingPageObject.viewMoreChallenges()];
                    case 1:
                        els = _a.sent();
                        i = 0;
                        _a.label = 2;
                    case 2:
                        if (!(i < els.length)) return [3 /*break*/, 14];
                        return [4 /*yield*/, challenge_listing_po_1.ChallengeListingPageObject.viewMoreChallenges()];
                    case 3:
                        allViewMoreLinks = _a.sent();
                        return [4 /*yield*/, allViewMoreLinks[i].getAttribute('href')];
                    case 4:
                        href = _a.sent();
                        splits = href.split('?bucket=');
                        bucket = splits[1];
                        if (!(bucket == 'openForRegistration')) return [3 /*break*/, 7];
                        return [4 /*yield*/, allViewMoreLinks[i].click()];
                    case 5:
                        _a.sent();
                        return [4 /*yield*/, this.waitTillOnlyOneHeaderPresentWithText('Open for registration')];
                    case 6:
                        _a.sent();
                        return [3 /*break*/, 10];
                    case 7:
                        if (!(bucket == 'ongoing')) return [3 /*break*/, 10];
                        return [4 /*yield*/, allViewMoreLinks[i].click()];
                    case 8:
                        _a.sent();
                        return [4 /*yield*/, this.waitTillOnlyOneHeaderPresentWithText('Ongoing challenges')];
                    case 9:
                        _a.sent();
                        _a.label = 10;
                    case 10: return [4 /*yield*/, challenge_listing_po_1.ChallengeListingPageObject.filterChallengesBy('All Challenges')];
                    case 11:
                        allChallengesLink = _a.sent();
                        return [4 /*yield*/, allChallengesLink.click()];
                    case 12:
                        _a.sent();
                        _a.label = 13;
                    case 13:
                        i++;
                        return [3 /*break*/, 2];
                    case 14: return [2 /*return*/];
                }
            });
        });
    };
    ChallengeListingPageHelper.verifyChallengesByChallengeTag = function () {
        return __awaiter(this, void 0, void 0, function () {
            var until, registrationChallenges, i, skills, ongoingChallenges, i, skills;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        until = protractor_1.protractor.ExpectedConditions;
                        return [4 /*yield*/, protractor_1.browser.wait(until.visibilityOf(challenge_listing_po_1.ChallengeListingPageObject.qaTag))];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, challenge_listing_po_1.ChallengeListingPageObject.qaTag.click()];
                    case 2:
                        _a.sent();
                        // waiting for re-render to happen
                        return [4 /*yield*/, protractor_1.browser.sleep(2000)];
                    case 3:
                        // waiting for re-render to happen
                        _a.sent();
                        return [4 /*yield*/, challenge_listing_po_1.ChallengeListingPageObject.openForRegistrationChallenges];
                    case 4:
                        registrationChallenges = _a.sent();
                        i = 0;
                        _a.label = 5;
                    case 5:
                        if (!(i < registrationChallenges.length)) return [3 /*break*/, 8];
                        return [4 /*yield*/, challenge_listing_po_1.ChallengeListingPageObject.findSkillsForChallenge(registrationChallenges[i])];
                    case 6:
                        skills = _a.sent();
                        expect(skills.includes('QA')).toBe(true);
                        _a.label = 7;
                    case 7:
                        i++;
                        return [3 /*break*/, 5];
                    case 8: return [4 /*yield*/, challenge_listing_po_1.ChallengeListingPageObject.ongoingChallenges];
                    case 9:
                        ongoingChallenges = _a.sent();
                        i = 0;
                        _a.label = 10;
                    case 10:
                        if (!(i < ongoingChallenges.length)) return [3 /*break*/, 13];
                        return [4 /*yield*/, challenge_listing_po_1.ChallengeListingPageObject.findSkillsForChallenge(ongoingChallenges[i])];
                    case 11:
                        skills = _a.sent();
                        expect(skills.includes('QA')).toBe(true);
                        _a.label = 12;
                    case 12:
                        i++;
                        return [3 /*break*/, 10];
                    case 13: return [2 /*return*/];
                }
            });
        });
    };
    ChallengeListingPageHelper.verifyChallengeCountByTogglingDevelopment = function () {
        return __awaiter(this, void 0, void 0, function () {
            var until, openForRegistrationChallenges, el, openForRegistrationChallengesText, afterToggleCount, challenges, beforeToggleCount;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        until = protractor_1.protractor.ExpectedConditions;
                        return [4 /*yield*/, challenge_listing_po_1.ChallengeListingPageObject.filterChallengesBy('Open for registration')];
                    case 1:
                        openForRegistrationChallenges = _a.sent();
                        return [4 /*yield*/, openForRegistrationChallenges.click()];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, this.waitTillOnlyOneHeaderPresentWithText('Open for registration')];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, challenge_listing_po_1.ChallengeListingPageObject.developmentSwitch()];
                    case 4:
                        el = _a.sent();
                        return [4 /*yield*/, el.click()];
                    case 5:
                        _a.sent();
                        return [4 /*yield*/, protractor_1.browser.wait(until.presenceOf(challenge_listing_po_1.ChallengeListingPageObject.developmentSwitchTurnedOff))];
                    case 6:
                        _a.sent();
                        // sleeping since challenge number takes time to update
                        return [4 /*yield*/, protractor_1.browser.sleep(15000)];
                    case 7:
                        // sleeping since challenge number takes time to update
                        _a.sent();
                        return [4 /*yield*/, openForRegistrationChallenges.getText()];
                    case 8:
                        openForRegistrationChallengesText = _a.sent();
                        afterToggleCount = openForRegistrationChallengesText.replace(/(\r\n|\n|\r)/gm, " ");
                        console.log(afterToggleCount);
                        return [4 /*yield*/, challenge_listing_po_1.ChallengeListingPageObject.openForRegistrationChallenges];
                    case 9:
                        challenges = _a.sent();
                        expect(parseInt(afterToggleCount.split('Open for registration ')[1])).toEqual(challenges.length);
                        return [4 /*yield*/, challenge_listing_po_1.ChallengeListingPageObject.developmentSwitch()];
                    case 10:
                        // switch on development once again
                        el = _a.sent();
                        return [4 /*yield*/, el.click()];
                    case 11:
                        _a.sent();
                        return [4 /*yield*/, protractor_1.browser.wait(until.presenceOf(challenge_listing_po_1.ChallengeListingPageObject.developmentSwitchTurnedOn))];
                    case 12:
                        _a.sent();
                        // sleeping since challenge number takes time to update
                        return [4 /*yield*/, protractor_1.browser.sleep(15000)];
                    case 13:
                        // sleeping since challenge number takes time to update
                        _a.sent();
                        return [4 /*yield*/, challenge_listing_po_1.ChallengeListingPageObject.filterChallengesBy('Open for registration')];
                    case 14:
                        openForRegistrationChallenges = _a.sent();
                        return [4 /*yield*/, openForRegistrationChallenges.getText()];
                    case 15:
                        openForRegistrationChallengesText = _a.sent();
                        beforeToggleCount = openForRegistrationChallengesText.replace(/(\r\n|\n|\r)/gm, " ");
                        return [4 /*yield*/, challenge_listing_po_1.ChallengeListingPageObject.openForRegistrationChallenges];
                    case 16:
                        challenges = _a.sent();
                        expect(parseInt(beforeToggleCount.split('Open for registration ')[1])).toEqual(challenges.length);
                        return [2 /*return*/];
                }
            });
        });
    };
    ChallengeListingPageHelper.getOngoingChallengesCount = function () {
        return __awaiter(this, void 0, void 0, function () {
            var ongoingChallenges, ongoingChallengesText, count;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, protractor_1.browser.sleep(5000)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, challenge_listing_po_1.ChallengeListingPageObject.filterChallengesBy('Ongoing challenges')];
                    case 2:
                        ongoingChallenges = _a.sent();
                        return [4 /*yield*/, ongoingChallenges.getText()];
                    case 3:
                        ongoingChallengesText = _a.sent();
                        ongoingChallengesText = ongoingChallengesText.replace(/(\r\n|\n|\r)/gm, " ");
                        console.log(ongoingChallengesText);
                        count = parseInt(ongoingChallengesText.split('Ongoing challenges ')[1]);
                        return [2 /*return*/, count];
                }
            });
        });
    };
    ChallengeListingPageHelper.navigateToFirstChallenge = function () {
        return __awaiter(this, void 0, void 0, function () {
            var challengeLinks;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, challenge_listing_po_1.ChallengeListingPageObject.openForRegistrationChallenges];
                    case 1:
                        challengeLinks = _a.sent();
                        return [4 /*yield*/, challengeLinks[0].click()];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ChallengeListingPageHelper.verifyChallengesMatchingKeyword = function (filters) {
        return __awaiter(this, void 0, void 0, function () {
            var challenges, i, parentDiv, skills, skillsText;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: 
                    // need to sleep to wait for ajax calls to be completed to filter using the above keyword
                    return [4 /*yield*/, protractor_1.browser.sleep(15000)];
                    case 1:
                        // need to sleep to wait for ajax calls to be completed to filter using the above keyword
                        _a.sent();
                        return [4 /*yield*/, challenge_listing_po_1.ChallengeListingPageObject.challengeLinks];
                    case 2:
                        challenges = _a.sent();
                        i = 0;
                        _a.label = 3;
                    case 3:
                        if (!(i < challenges.length)) return [3 /*break*/, 6];
                        parentDiv = challenges[i].element(protractor_1.by.xpath('..'));
                        skills = parentDiv.all(protractor_1.by.css('button[type=button]'));
                        return [4 /*yield*/, skills.getText()];
                    case 4:
                        skillsText = _a.sent();
                        console.log('Found following skills');
                        console.log(skillsText);
                        expect(skillsText.filter(function (s) {
                            for (var j = 0; j < filters.length; j++) {
                                if (s.includes(filters[j])) {
                                    return true;
                                }
                            }
                            return false;
                        }).length > 0).toBe(true);
                        _a.label = 5;
                    case 5:
                        i++;
                        return [3 /*break*/, 3];
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    ChallengeListingPageHelper.verifyChallengesMatchingSubtrack = function (expectedChallengesLength, filters) {
        return __awaiter(this, void 0, void 0, function () {
            var challenges, totalChallenges, j, filter, matchingElements;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: 
                    // need to sleep to wait for ajax calls to be completed to filter using the above subtrack
                    return [4 /*yield*/, protractor_1.browser.sleep(15000)];
                    case 1:
                        // need to sleep to wait for ajax calls to be completed to filter using the above subtrack
                        _a.sent();
                        return [4 /*yield*/, challenge_listing_po_1.ChallengeListingPageObject.challengeLinks];
                    case 2:
                        challenges = _a.sent();
                        totalChallenges = 0;
                        expect(challenges.length).toEqual(expectedChallengesLength);
                        j = 0;
                        _a.label = 3;
                    case 3:
                        if (!(j < filters.length)) return [3 /*break*/, 6];
                        filter = filters[j];
                        return [4 /*yield*/, challenge_listing_po_1.ChallengeListingPageObject.findAllElementsByText('div', filter.name)];
                    case 4:
                        matchingElements = _a.sent();
                        totalChallenges += matchingElements.length;
                        _a.label = 5;
                    case 5:
                        j++;
                        return [3 /*break*/, 3];
                    case 6:
                        expect(totalChallenges).toEqual(expectedChallengesLength);
                        return [2 /*return*/];
                }
            });
        });
    };
    ChallengeListingPageHelper.getAllChallengesCount = function () {
        return __awaiter(this, void 0, void 0, function () {
            var allChallengesPO, allChallengesText, count;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, challenge_listing_po_1.ChallengeListingPageObject.filterChallengesBy('All Challenges')];
                    case 1:
                        allChallengesPO = _a.sent();
                        return [4 /*yield*/, allChallengesPO.getText()];
                    case 2:
                        allChallengesText = _a.sent();
                        count = parseInt(allChallengesText.replace(/(\r\n|\n|\r)/gm, " ").split('All Challenges ')[1]);
                        return [2 /*return*/, count];
                }
            });
        });
    };
    return ChallengeListingPageHelper;
}());
exports.ChallengeListingPageHelper = ChallengeListingPageHelper;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2hhbGxlbmdlLWxpc3RpbmcuaGVscGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vcGFnZS1vYmplY3RzL3BhZ2VzL3RvcGNvZGVyL2NoYWxsZW5nZS1saXN0aW5nL2NoYWxsZW5nZS1saXN0aW5nLmhlbHBlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEseUNBQThEO0FBQzlELDZFQUE4RTtBQUM5RSwrREFBaUU7QUFDakUsK0RBQW9FO0FBQ3BFLGdEQUFrRDtBQUNsRCx1REFBOEQ7QUFFOUQ7SUFBQTtJQTBpQkEsQ0FBQztJQXppQmdCLDhCQUFHLEdBQWhCOzs7Ozs0QkFDSSxxQkFBTSxvQkFBTyxDQUFDLEdBQUcsQ0FBQywyREFBNkIsQ0FBQyxHQUFHLENBQUMsRUFBQTs7d0JBQXBELFNBQW9ELENBQUM7d0JBQ3JELHFCQUFNLE9BQU8sQ0FBQyxHQUFHLENBQUMsbUNBQW1DLENBQUMsRUFBQTs7d0JBQXRELFNBQXNELENBQUM7d0JBRXhCLHFCQUFNLGlEQUEwQixDQUFDLFdBQVcsQ0FBQyxTQUFTLEVBQUUsRUFBQTs7d0JBQWpGLHNCQUFzQixHQUFHLFNBQXdEOzZCQUVuRixzQkFBc0IsRUFBdEIsd0JBQXNCO3dCQUN0QixnREFBZ0Q7d0JBQ2hELHFCQUFNLG9CQUFPLENBQUMsR0FBRyxDQUFDLDJEQUE2QixDQUFDLEdBQUcsQ0FBQyxFQUFBOzt3QkFEcEQsZ0RBQWdEO3dCQUNoRCxTQUFvRCxDQUFDOzs7Ozs7S0FFNUQ7SUFFWSx1Q0FBWSxHQUF6Qjs7Ozs0QkFDSSxxQkFBTSxnQ0FBZ0IsQ0FBQyxpQkFBaUIsQ0FBQyxNQUFNLENBQUMsRUFBQTs7d0JBQWhELFNBQWdELENBQUM7d0JBQ2pELHFCQUFNLE9BQU8sQ0FBQyxHQUFHLENBQUMseUJBQXlCLENBQUMsRUFBQTs7d0JBQTVDLFNBQTRDLENBQUM7Ozs7O0tBQ2hEO0lBRVkscUNB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