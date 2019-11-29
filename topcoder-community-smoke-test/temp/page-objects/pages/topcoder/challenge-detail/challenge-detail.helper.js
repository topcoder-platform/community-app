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
var challenge_detail_constants_1 = require("./challenge-detail.constants");
var challenge_detail_po_1 = require("./challenge-detail.po");
var common_po_1 = require("../../../common/common.po");
var forum_constants_1 = require("../forum/forum.constants");
var path = require('path');
var ChallengeDetailPageHelper = /** @class */ (function () {
    function ChallengeDetailPageHelper() {
    }
    ChallengeDetailPageHelper.get = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, protractor_1.browser.get(challenge_detail_constants_1.ChallengeDetailPageConstants.url)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, protractor_1.browser.sleep(1000)];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, protractor_1.browser.get(challenge_detail_constants_1.ChallengeDetailPageConstants.url)];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, console.log('User navigated to Challenge Detail Page')];
                    case 4:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ChallengeDetailPageHelper.getUsingCustomUrl = function (url) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, protractor_1.browser.get(url)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, console.log('User navigated to Challenge Detail Page with url ' + url)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ChallengeDetailPageHelper.clickOnBackButton = function () {
        return __awaiter(this, void 0, void 0, function () {
            var until;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        until = protractor_1.protractor.ExpectedConditions;
                        return [4 /*yield*/, protractor_1.browser.wait(until.visibilityOf(challenge_detail_po_1.ChallengeDetailPageObject.backButton))];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, challenge_detail_po_1.ChallengeDetailPageObject.backButton.click()];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, console.log('Back button pressed on challenge detail page')];
                    case 3:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ChallengeDetailPageHelper.clickOnTermsLink = function () {
        return __awaiter(this, void 0, void 0, function () {
            var link;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, common_po_1.commonPageObjects.findElementByText('a', 'Standard Terms for Topcoder Competitions v2.2')];
                    case 1:
                        link = _a.sent();
                        return [4 /*yield*/, link.click()];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, console.log('Terms link clicked')];
                    case 3:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ChallengeDetailPageHelper.register = function () {
        return __awaiter(this, void 0, void 0, function () {
            var until, registerButton, isRegisterButtonPresent, unregisterButton, isUnregisterButtonPresent;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        until = protractor_1.protractor.ExpectedConditions;
                        registerButton = common_po_1.commonPageObjects.findElementByText('button', 'Register');
                        return [4 /*yield*/, registerButton.isPresent()];
                    case 1:
                        isRegisterButtonPresent = _a.sent();
                        if (!!isRegisterButtonPresent) return [3 /*break*/, 4];
                        unregisterButton = common_po_1.commonPageObjects.findElementByText('button', 'Unregister');
                        isUnregisterButtonPresent = unregisterButton.isPresent();
                        if (!isUnregisterButtonPresent) return [3 /*break*/, 4];
                        return [4 /*yield*/, unregisterButton.click()];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, protractor_1.browser.wait(until.visibilityOf(common_po_1.commonPageObjects.findElementByText('button', 'Register')))];
                    case 3:
                        _a.sent();
                        _a.label = 4;
                    case 4: return [4 /*yield*/, common_po_1.commonPageObjects.findElementByText('button', 'Register').click()];
                    case 5:
                        _a.sent();
                        return [4 /*yield*/, this.acceptTermsIfNeeded()];
                    case 6:
                        _a.sent();
                        return [4 /*yield*/, protractor_1.browser.wait(until.visibilityOf(common_po_1.commonPageObjects.findElementByText('button', 'Unregister')))];
                    case 7:
                        _a.sent();
                        return [4 /*yield*/, protractor_1.browser.wait(until.visibilityOf(common_po_1.commonPageObjects.clickOnLinkText('CHALLENGE FORUM')))];
                    case 8:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ChallengeDetailPageHelper.registerIfNotAlreadyRegistered = function () {
        return __awaiter(this, void 0, void 0, function () {
            var until, registerButton, isRegisterButtonPresent;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        until = protractor_1.protractor.ExpectedConditions;
                        registerButton = common_po_1.commonPageObjects.findElementByText('button', 'Register');
                        return [4 /*yield*/, registerButton.isPresent()];
                    case 1:
                        isRegisterButtonPresent = _a.sent();
                        if (!isRegisterButtonPresent) {
                            return [2 /*return*/];
                        }
                        return [4 /*yield*/, common_po_1.commonPageObjects.findElementByText('button', 'Register').click()];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, this.acceptTermsIfNeeded()];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, protractor_1.browser.wait(until.visibilityOf(common_po_1.commonPageObjects.findElementByText('button', 'Unregister')))];
                    case 4:
                        _a.sent();
                        return [4 /*yield*/, protractor_1.browser.wait(until.visibilityOf(common_po_1.commonPageObjects.clickOnLinkText('CHALLENGE FORUM')))];
                    case 5:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ChallengeDetailPageHelper.acceptTermsIfNeeded = function () {
        return __awaiter(this, void 0, void 0, function () {
            var termsAgreementButton, termsAgreementButtonVisibility;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        termsAgreementButton = common_po_1.commonPageObjects.findElementByText('button', 'I Agree');
                        return [4 /*yield*/, termsAgreementButton.isPresent()];
                    case 1:
                        termsAgreementButtonVisibility = _a.sent();
                        if (!termsAgreementButtonVisibility) return [3 /*break*/, 3];
                        return [4 /*yield*/, termsAgreementButton.click()];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    ChallengeDetailPageHelper.verifyChallengeForumLink = function () {
        return __awaiter(this, void 0, void 0, function () {
            var href;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, common_po_1.commonPageObjects.clickOnLinkText('CHALLENGE FORUM').getAttribute('href')];
                    case 1:
                        href = _a.sent();
                        expect(href).toEqual(forum_constants_1.ForumPageConstants.content.challengeForumUrl);
                        return [2 /*return*/];
                }
            });
        });
    };
    ChallengeDetailPageHelper.unregister = function () {
        return __awaiter(this, void 0, void 0, function () {
            var until, unregisterButton, isUnregisterButtonPresent, registerButton, isRegisterButtonPresent;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        until = protractor_1.protractor.ExpectedConditions;
                        unregisterButton = common_po_1.commonPageObjects.findElementByText('button', 'Unregister');
                        isUnregisterButtonPresent = unregisterButton.isPresent();
                        if (!isUnregisterButtonPresent) return [3 /*break*/, 3];
                        return [4 /*yield*/, unregisterButton.click()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, protractor_1.browser.wait(until.visibilityOf(common_po_1.commonPageObjects.findElementByText('button', 'Register')))];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3:
                        registerButton = common_po_1.commonPageObjects.findElementByText('button', 'Register');
                        return [4 /*yield*/, registerButton.isPresent()];
                    case 4:
                        isRegisterButtonPresent = _a.sent();
                        expect(isRegisterButtonPresent).toBe(true);
                        return [2 /*return*/];
                }
            });
        });
    };
    ChallengeDetailPageHelper.clickOnSubmitButton = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, common_po_1.commonPageObjects.clickOnAnchorText('Submit').click()];
                    case 1:
                        _a.sent();
                        console.log('Submit button clicked');
                        return [2 /*return*/];
                }
            });
        });
    };
    ChallengeDetailPageHelper.switchToDetailsTab = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, common_po_1.commonPageObjects.clickOnAnchorText('DETAILS').click()];
                    case 1:
                        _a.sent();
                        console.log('Switched to Details tab');
                        return [2 /*return*/];
                }
            });
        });
    };
    ChallengeDetailPageHelper.switchToRegistrantsTab = function () {
        return __awaiter(this, void 0, void 0, function () {
            var tabs;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getAllTabs()];
                    case 1:
                        tabs = _a.sent();
                        return [4 /*yield*/, tabs[1].click()];
                    case 2:
                        _a.sent();
                        console.log('Switched to Registrants tab');
                        return [2 /*return*/];
                }
            });
        });
    };
    ChallengeDetailPageHelper.switchToSubmissionsTab = function () {
        return __awaiter(this, void 0, void 0, function () {
            var tabs;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getAllTabs()];
                    case 1:
                        tabs = _a.sent();
                        return [4 /*yield*/, tabs[2].click()];
                    case 2:
                        _a.sent();
                        console.log('Switched to Submissions tab');
                        return [2 /*return*/];
                }
            });
        });
    };
    ChallengeDetailPageHelper.getAllTabs = function () {
        return __awaiter(this, void 0, void 0, function () {
            var tabs;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, common_po_1.commonPageObjects.clickOnAnchorText('DETAILS')
                            .element(protractor_1.by.xpath('..'))
                            .getWebElement().findElements(protractor_1.by.tagName('a'))];
                    case 1:
                        tabs = _a.sent();
                        return [2 /*return*/, tabs];
                }
            });
        });
    };
    ChallengeDetailPageHelper.verifyDetailsTab = function () {
        return __awaiter(this, void 0, void 0, function () {
            var challengeOverviewEl, isDisplayed, tabs, ariaLabel;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        challengeOverviewEl = common_po_1.commonPageObjects.getTextFromH2('Challenge Overview');
                        return [4 /*yield*/, challengeOverviewEl.isDisplayed()];
                    case 1:
                        isDisplayed = _a.sent();
                        expect(isDisplayed).toBe(true);
                        return [4 /*yield*/, this.getAllTabs()];
                    case 2:
                        tabs = _a.sent();
                        return [4 /*yield*/, tabs[0].getAttribute('aria-selected')];
                    case 3:
                        ariaLabel = _a.sent();
                        expect(ariaLabel).toBe('true');
                        return [2 /*return*/];
                }
            });
        });
    };
    ChallengeDetailPageHelper.verifyRegistrantsTab = function () {
        return __awaiter(this, void 0, void 0, function () {
            var isDisplayed, tabs, ariaLabel;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, challenge_detail_po_1.ChallengeDetailPageObject.registrantsTable.isDisplayed()];
                    case 1:
                        isDisplayed = _a.sent();
                        expect(isDisplayed).toBe(true);
                        return [4 /*yield*/, this.getAllTabs()];
                    case 2:
                        tabs = _a.sent();
                        return [4 /*yield*/, tabs[1].getAttribute('aria-selected')];
                    case 3:
                        ariaLabel = _a.sent();
                        expect(ariaLabel).toBe('true');
                        return [2 /*return*/];
                }
            });
        });
    };
    ChallengeDetailPageHelper.verifySubmissionsTab = function () {
        return __awaiter(this, void 0, void 0, function () {
            var isUsernameDisplayed, isSubmissionDateDisplayed, tabs, ariaLabel;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, common_po_1.commonPageObjects.findElementByText('div', 'Username').isDisplayed()];
                    case 1:
                        isUsernameDisplayed = _a.sent();
                        expect(isUsernameDisplayed).toBe(true);
                        return [4 /*yield*/, common_po_1.commonPageObjects.findElementByText('div', 'Submission Date').isDisplayed()];
                    case 2:
                        isSubmissionDateDisplayed = _a.sent();
                        expect(isSubmissionDateDisplayed).toBe(true);
                        return [4 /*yield*/, this.getAllTabs()];
                    case 3:
                        tabs = _a.sent();
                        return [4 /*yield*/, tabs[2].getAttribute('aria-selected')];
                    case 4:
                        ariaLabel = _a.sent();
                        expect(ariaLabel).toBe('true');
                        return [2 /*return*/];
                }
            });
        });
    };
    ChallengeDetailPageHelper.clickOnReviewScorecardLink = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, common_po_1.commonPageObjects.clickOnAnchorText('Review Scorecard').click()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, console.log('Review Scorecard link clicked')];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ChallengeDetailPageHelper.verifyDeadlines = function () {
        return __awaiter(this, void 0, void 0, function () {
            var el, isDisplayed, tabPanel, timezone, childDivs, expectedDeadlines, i, text;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, common_po_1.commonPageObjects.findElementByText('span', 'Show Deadlines')];
                    case 1:
                        el = _a.sent();
                        return [4 /*yield*/, el.click()];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, common_po_1.commonPageObjects.findElementByText('span', 'Hide Deadlines')];
                    case 3:
                        el = _a.sent();
                        return [4 /*yield*/, el.isDisplayed()];
                    case 4:
                        isDisplayed = _a.sent();
                        expect(isDisplayed).toBe(true);
                        tabPanel = challenge_detail_po_1.ChallengeDetailPageObject.tabPanel;
                        return [4 /*yield*/, tabPanel.element(protractor_1.by.tagName('p')).getText()];
                    case 5:
                        timezone = _a.sent();
                        console.log(timezone);
                        expect(timezone.startsWith('Timezone')).toBe(true);
                        return [4 /*yield*/, tabPanel.getWebElement().findElements(protractor_1.by.tagName('div'))];
                    case 6:
                        childDivs = _a.sent();
                        expectedDeadlines = ['Started', 'Registration', 'Submission', 'Review', 'Winners'];
                        i = 0;
                        _a.label = 7;
                    case 7:
                        if (!(i < childDivs.length)) return [3 /*break*/, 10];
                        return [4 /*yield*/, childDivs[i].getText()];
                    case 8:
                        text = _a.sent();
                        console.log(text);
                        expect(text.startsWith(expectedDeadlines[i])).toBe(true);
                        _a.label = 9;
                    case 9:
                        i++;
                        return [3 /*break*/, 7];
                    case 10: return [2 /*return*/];
                }
            });
        });
    };
    ChallengeDetailPageHelper.uploadSubmission = function () {
        return __awaiter(this, void 0, void 0, function () {
            var until;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        until = protractor_1.protractor.ExpectedConditions;
                        return [4 /*yield*/, this.clickOnSubmitButton()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, protractor_1.browser.wait(until.visibilityOf(challenge_detail_po_1.ChallengeDetailPageObject.pickFile))];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, challenge_detail_po_1.ChallengeDetailPageObject.pickFile.click()];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, protractor_1.browser.wait(until.visibilityOf(challenge_detail_po_1.ChallengeDetailPageObject.fileModal))];
                    case 4:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    return ChallengeDetailPageHelper;
}());
exports.ChallengeDetailPageHelper = ChallengeDetailPageHelper;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2hhbGxlbmdlLWRldGFpbC5oZWxwZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9wYWdlLW9iamVjdHMvcGFnZXMvdG9wY29kZXIvY2hhbGxlbmdlLWRldGFpbC9jaGFsbGVuZ2UtZGV0YWlsLmhlbHBlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEseUNBQThEO0FBQzlELDJFQUE0RTtBQUM1RSw2REFBa0U7QUFDbEUsdURBQThEO0FBQzlELDREQUE4RDtBQUM5RCxJQUFNLElBQUksR0FBRyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUM7QUFFN0I7SUFBQTtJQTRNQSxDQUFDO0lBM01nQiw2QkFBRyxHQUFoQjs7Ozs0QkFDSSxxQkFBTSxvQkFBTyxDQUFDLEdBQUcsQ0FBQyx5REFBNEIsQ0FBQyxHQUFHLENBQUMsRUFBQTs7d0JBQW5ELFNBQW1ELENBQUM7d0JBQ3BELHFCQUFNLG9CQUFPLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxFQUFBOzt3QkFBekIsU0FBeUIsQ0FBQzt3QkFDMUIscUJBQU0sb0JBQU8sQ0FBQyxHQUFHLENBQUMseURBQTRCLENBQUMsR0FBRyxDQUFDLEVBQUE7O3dCQUFuRCxTQUFtRCxDQUFDO3dCQUNwRCxxQkFBTSxPQUFPLENBQUMsR0FBRyxDQUFDLHlDQUF5QyxDQUFDLEVBQUE7O3dCQUE1RCxTQUE0RCxDQUFDOzs7OztLQUNoRTtJQUVZLDJDQUFpQixHQUE5QixVQUErQixHQUFXOzs7OzRCQUN0QyxxQkFBTSxvQkFBTyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsRUFBQTs7d0JBQXRCLFNBQXNCLENBQUM7d0JBQ3ZCLHFCQUFNLE9BQU8sQ0FBQyxHQUFHLENBQUMsbURBQW1ELEdBQUcsR0FBRyxDQUFDLEVBQUE7O3dCQUE1RSxTQUE0RSxDQUFDOzs7OztLQUNoRjtJQUVZLDJDQUFpQixHQUE5Qjs7Ozs7O3dC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