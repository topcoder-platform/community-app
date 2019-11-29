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
var common_po_1 = require("../../../common/common.po");
var ChallengeListingPageObject = /** @class */ (function () {
    function ChallengeListingPageObject() {
    }
    Object.defineProperty(ChallengeListingPageObject, "h2Fields", {
        get: function () {
            return protractor_1.element.all(protractor_1.by.tagName('h2'));
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ChallengeListingPageObject, "challengeSearchBox", {
        get: function () {
            return protractor_1.element(protractor_1.by.id('search-challenges'));
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ChallengeListingPageObject, "challengeSearchButton", {
        get: function () {
            return protractor_1.element(protractor_1.by.css('label[for=search-challenges]')).element(protractor_1.by.css('span[role=button]'));
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ChallengeListingPageObject, "challengeLinks", {
        get: function () {
            return protractor_1.element.all(protractor_1.by.className('vir_2D'));
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ChallengeListingPageObject, "firstChallengeLink", {
        get: function () {
            return protractor_1.element(protractor_1.by.className('vir_2D'));
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ChallengeListingPageObject, "openForRegistrationChallenges", {
        get: function () {
            return this.getChallenges('Open for registration');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ChallengeListingPageObject, "ongoingChallenges", {
        get: function () {
            return this.getChallenges('Ongoing challenges');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ChallengeListingPageObject, "filterButton", {
        get: function () {
            return protractor_1.element(protractor_1.by.className('tc-outline-btn'));
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ChallengeListingPageObject, "dateRangeLabel", {
        get: function () {
            return protractor_1.element(protractor_1.by.css('label[for="date-range-picker-two-months"]'));
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ChallengeListingPageObject, "keywordsLabel", {
        get: function () {
            return protractor_1.element(protractor_1.by.css('label[for=keyword-select]'));
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ChallengeListingPageObject, "keywordInput", {
        get: function () {
            return protractor_1.element(protractor_1.by.id('keyword-select'));
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ChallengeListingPageObject, "keywordSelection", {
        get: function () {
            return protractor_1.element.all(protractor_1.by.className('Select-option'));
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ChallengeListingPageObject, "subtrackLabel", {
        get: function () {
            return protractor_1.element(protractor_1.by.css('label[for=track-select]'));
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ChallengeListingPageObject, "subtrackInput", {
        get: function () {
            return protractor_1.element(protractor_1.by.id('track-select'));
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ChallengeListingPageObject, "subtrackSelection", {
        get: function () {
            return protractor_1.element.all(protractor_1.by.className('Select-option'));
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ChallengeListingPageObject, "subCommunityLabel", {
        get: function () {
            return protractor_1.element(protractor_1.by.css('label[for=community-select]'));
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ChallengeListingPageObject, "subCommunityDropdown", {
        get: function () {
            return protractor_1.element(protractor_1.by.id('react-select-3--value-item'));
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ChallengeListingPageObject, "subCommunitySelection", {
        get: function () {
            return protractor_1.element.all(protractor_1.by.className('Select-option'));
        },
        enumerable: true,
        configurable: true
    });
    ChallengeListingPageObject.findAllElementsByText = function (elementType, text) {
        return protractor_1.element.all(protractor_1.by.xpath('//' + elementType + '[contains(text(), "' + text + '")]'));
    };
    ChallengeListingPageObject.dateRangeStartDate = function () {
        return __awaiter(this, void 0, void 0, function () {
            var els;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, protractor_1.element.all(protractor_1.by.className('DateInput_input_1'))];
                    case 1:
                        els = _a.sent();
                        return [2 /*return*/, els[2]];
                }
            });
        });
    };
    ChallengeListingPageObject.dateRangeEndDate = function () {
        return __awaiter(this, void 0, void 0, function () {
            var els;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, protractor_1.element.all(protractor_1.by.className('DateInput_input_1'))];
                    case 1:
                        els = _a.sent();
                        return [2 /*return*/, els[3]];
                }
            });
        });
    };
    Object.defineProperty(ChallengeListingPageObject, "appliedFilters", {
        get: function () {
            return protractor_1.element(protractor_1.by.className('tc-outline-btn'));
        },
        enumerable: true,
        configurable: true
    });
    ChallengeListingPageObject.allRemoveTags = function () {
        return __awaiter(this, void 0, void 0, function () {
            var crossTags, filteredCrossTags, i, className;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, ChallengeListingPageObject.findAllElementsByText('span', '×')];
                    case 1:
                        crossTags = _a.sent();
                        filteredCrossTags = [];
                        i = 0;
                        _a.label = 2;
                    case 2:
                        if (!(i < crossTags.length)) return [3 /*break*/, 5];
                        return [4 /*yield*/, crossTags[i].getWebElement().getAttribute('class')];
                    case 3:
                        className = _a.sent();
                        if (className === 'Select-value-icon') {
                            filteredCrossTags.push(crossTags[i]);
                        }
                        _a.label = 4;
                    case 4:
                        i++;
                        return [3 /*break*/, 2];
                    case 5: return [2 /*return*/, filteredCrossTags];
                }
            });
        });
    };
    ChallengeListingPageObject.filterChallengesBy = function (filter) {
        return __awaiter(this, void 0, void 0, function () {
            var els;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, protractor_1.element.all(protractor_1.by.xpath('//div[contains(text(), "' + filter + '")]'))];
                    case 1:
                        els = _a.sent();
                        return [2 /*return*/, els[1]];
                }
            });
        });
    };
    ChallengeListingPageObject.reviewStatusElements = function () {
        return __awaiter(this, void 0, void 0, function () {
            var headers, elements;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.h2Fields];
                    case 1:
                        headers = _a.sent();
                        return [4 /*yield*/, headers[0]
                                .element(protractor_1.by.xpath('..'))
                                .element(protractor_1.by.xpath('..'))
                                .getWebElement().findElements(protractor_1.by.className('_1YwVym'))];
                    case 2:
                        elements = _a.sent();
                        return [2 /*return*/, elements];
                }
            });
        });
    };
    ChallengeListingPageObject.submissionElements = function () {
        return __awaiter(this, void 0, void 0, function () {
            var headers, elements;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.h2Fields];
                    case 1:
                        headers = _a.sent();
                        return [4 /*yield*/, headers[0]
                                .element(protractor_1.by.xpath('..'))
                                .element(protractor_1.by.xpath('..'))
                                .getWebElement().findElements(protractor_1.by.className('_2Kuu31'))];
                    case 2:
                        elements = _a.sent();
                        return [2 /*return*/, elements];
                }
            });
        });
    };
    ChallengeListingPageObject.designSwitch = function () {
        return __awaiter(this, void 0, void 0, function () {
            var els, el;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, protractor_1.element.all(protractor_1.by.css('div[role="switch"]'))];
                    case 1:
                        els = _a.sent();
                        return [4 /*yield*/, els[0].element(protractor_1.by.tagName('div'))];
                    case 2:
                        el = _a.sent();
                        return [2 /*return*/, el];
                }
            });
        });
    };
    Object.defineProperty(ChallengeListingPageObject, "designSwitchTurnedOff", {
        get: function () {
            return common_po_1.commonPageObjects.getLinkByAriaLabel('Design toggle button pressed Off');
        },
        enumerable: true,
        configurable: true
    });
    ChallengeListingPageObject.developmentSwitch = function () {
        return __awaiter(this, void 0, void 0, function () {
            var els, el;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, protractor_1.element.all(protractor_1.by.css('div[role="switch"]'))];
                    case 1:
                        els = _a.sent();
                        return [4 /*yield*/, els[1].element(protractor_1.by.tagName('div'))];
                    case 2:
                        el = _a.sent();
                        return [2 /*return*/, el];
                }
            });
        });
    };
    Object.defineProperty(ChallengeListingPageObject, "developmentSwitchTurnedOff", {
        get: function () {
            return common_po_1.commonPageObjects.getLinkByAriaLabel('Development toggle button pressed Off');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ChallengeListingPageObject, "developmentSwitchTurnedOn", {
        get: function () {
            return common_po_1.commonPageObjects.getLinkByAriaLabel('Development toggle button pressed On');
        },
        enumerable: true,
        configurable: true
    });
    ChallengeListingPageObject.dataScienceSwitch = function () {
        return __awaiter(this, void 0, void 0, function () {
            var els, el;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, protractor_1.element.all(protractor_1.by.css('div[role="switch"]'))];
                    case 1:
                        els = _a.sent();
                        return [4 /*yield*/, els[2].element(protractor_1.by.tagName('div'))];
                    case 2:
                        el = _a.sent();
                        return [2 /*return*/, el];
                }
            });
        });
    };
    Object.defineProperty(ChallengeListingPageObject, "dataScienceSwitchTurnedOff", {
        get: function () {
            return common_po_1.commonPageObjects.getLinkByAriaLabel('Data Science toggle button pressed Off');
        },
        enumerable: true,
        configurable: true
    });
    ChallengeListingPageObject.rssLink = function () {
        return __awaiter(this, void 0, void 0, function () {
            var els;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, protractor_1.element.all(protractor_1.by.xpath("//a[contains(text(),'Get the RSS feed')]"))];
                    case 1:
                        els = _a.sent();
                        return [2 /*return*/, els[1]];
                }
            });
        });
    };
    ChallengeListingPageObject.getLinkUnderRss = function (label) {
        return __awaiter(this, void 0, void 0, function () {
            var els;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, common_po_1.commonPageObjects.getAllLinksByAriaLabel(label)];
                    case 1:
                        els = _a.sent();
                        return [2 /*return*/, els[1]];
                }
            });
        });
    };
    ChallengeListingPageObject.selectSortOfOpenForRegistrationChallenges = function () {
        return __awaiter(this, void 0, void 0, function () {
            var els;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, protractor_1.element.all(protractor_1.by.className('Select--single'))];
                    case 1:
                        els = _a.sent();
                        return [2 /*return*/, els[1]];
                }
            });
        });
    };
    Object.defineProperty(ChallengeListingPageObject, "selectNumberOfSubmissions", {
        get: function () {
            return common_po_1.commonPageObjects.findElementByText('div', '# of submissions');
        },
        enumerable: true,
        configurable: true
    });
    ChallengeListingPageObject.viewMoreChallenges = function () {
        return __awaiter(this, void 0, void 0, function () {
            var els;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.findAllElementsByText('a', 'View more challenges')];
                    case 1:
                        els = _a.sent();
                        return [2 /*return*/, els];
                }
            });
        });
    };
    Object.defineProperty(ChallengeListingPageObject, "qaTag", {
        get: function () {
            return common_po_1.commonPageObjects.findElementByText('button', 'QA');
        },
        enumerable: true,
        configurable: true
    });
    ChallengeListingPageObject.findSkillsForChallenge = function (challenge) {
        return __awaiter(this, void 0, void 0, function () {
            var buttons, skills, j, skill;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, challenge.findElement(protractor_1.by.xpath('..')).findElements(protractor_1.by.tagName('button'))];
                    case 1:
                        buttons = _a.sent();
                        skills = [];
                        j = 0;
                        _a.label = 2;
                    case 2:
                        if (!(j < buttons.length)) return [3 /*break*/, 5];
                        return [4 /*yield*/, buttons[j].getText()];
                    case 3:
                        skill = _a.sent();
                        skills.push(skill);
                        _a.label = 4;
                    case 4:
                        j++;
                        return [3 /*break*/, 2];
                    case 5: return [2 /*return*/, skills];
                }
            });
        });
    };
    Object.defineProperty(ChallengeListingPageObject, "surveyModal", {
        get: function () {
            return protractor_1.element(protractor_1.by.className('smcx-modal-title'));
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ChallengeListingPageObject, "surveyCloseButton", {
        get: function () {
            return protractor_1.element(protractor_1.by.className('smcx-modal-close'));
        },
        enumerable: true,
        configurable: true
    });
    ChallengeListingPageObject.getChallenges = function (type) {
        return protractor_1.element(protractor_1.by.xpath('//h2[contains(text(), "' + type + '")]'))
            .element(protractor_1.by.xpath('..'))
            .element(protractor_1.by.xpath('..'))
            .getWebElement().findElements(protractor_1.by.className('vir_2D'));
    };
    return ChallengeListingPageObject;
}());
exports.ChallengeListingPageObject = ChallengeListingPageObject;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2hhbGxlbmdlLWxpc3RpbmcucG8uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9wYWdlLW9iamVjdHMvcGFnZXMvdG9wY29kZXIvY2hhbGxlbmdlLWxpc3RpbmcvY2hhbGxlbmdlLWxpc3RpbmcucG8udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLHlDQUE2RTtBQUM3RSx1REFBOEQ7QUFFOUQ7SUFBQTtJQXVOQSxDQUFDO0lBck5HLHNCQUFXLHNDQUFRO2FBQW5CO1lBQ0ksT0FBTyxvQkFBTyxDQUFDLEdBQUcsQ0FBQyxlQUFFLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7UUFDekMsQ0FBQzs7O09BQUE7SUFFRCxzQkFBVyxnREFBa0I7YUFBN0I7WUFDSSxPQUFPLG9CQUFPLENBQUMsZUFBRSxDQUFDLEVBQUUsQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDLENBQUE7UUFDOUMsQ0FBQzs7O09BQUE7SUFFRCxzQkFBVyxtREFBcUI7YUFBaEM7WUFDSSxPQUFPLG9CQUFPLENBQUMsZUFBRSxDQUFDLEdBQUcsQ0FBQyw4QkFBOEIsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLGVBQUUsQ0FBQyxHQUFHLENBQUMsbUJBQW1CLENBQUMsQ0FBQyxDQUFDO1FBQ2hHLENBQUM7OztPQUFBO0lBRUQsc0JBQVcsNENBQWM7YUFBekI7WUFDSSxPQUFPLG9CQUFPLENBQUMsR0FBRyxDQUFDLGVBQUUsQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQztRQUMvQyxDQUFDOzs7T0FBQTtJQUVELHNCQUFXLGdEQUFrQjthQUE3QjtZQUNJLE9BQU8sb0JBQU8sQ0FBQyxlQUFFLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUM7UUFDM0MsQ0FBQzs7O09BQUE7SUFFRCxzQkFBVywyREFBNkI7YUFBeEM7WUFDSSxPQUFPLElBQUksQ0FB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