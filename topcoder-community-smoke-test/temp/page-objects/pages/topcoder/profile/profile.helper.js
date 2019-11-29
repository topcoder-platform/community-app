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
var profile_constants_1 = require("./profile.constants");
var profile_po_1 = require("./profile.po");
var common_po_1 = require("../../../common/common.po");
var ProfilePageHelper = /** @class */ (function () {
    function ProfilePageHelper() {
    }
    ProfilePageHelper.get = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, protractor_1.browser.get(profile_constants_1.ProfilePageConstants.url)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, protractor_1.browser.sleep(1000)];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, console.log('User navigated to Profile Page')];
                    case 3:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ProfilePageHelper.verifyProfilePage = function () {
        return __awaiter(this, void 0, void 0, function () {
            var until, browserUrl;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        until = protractor_1.protractor.ExpectedConditions;
                        return [4 /*yield*/, protractor_1.browser.wait(until.visibilityOf(profile_po_1.ProfilePageObject.container))];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, protractor_1.browser.getCurrentUrl()];
                    case 2:
                        browserUrl = _a.sent();
                        expect(browserUrl).toEqual(profile_constants_1.ProfilePageConstants.getMyProfileUrl());
                        console.log('User redirected to profile page');
                        return [2 /*return*/];
                }
            });
        });
    };
    ProfilePageHelper.fillPersonalDetails = function () {
        return __awaiter(this, void 0, void 0, function () {
            var firstSelectableLabel, today, formatted, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, profile_po_1.ProfilePageObject.firstName.clear()];
                    case 1:
                        _b.sent();
                        return [4 /*yield*/, profile_po_1.ProfilePageObject.firstName.sendKeys('Test1')];
                    case 2:
                        _b.sent();
                        return [4 /*yield*/, profile_po_1.ProfilePageObject.lastName.clear()];
                    case 3:
                        _b.sent();
                        return [4 /*yield*/, profile_po_1.ProfilePageObject.lastName.sendKeys('User1')];
                    case 4:
                        _b.sent();
                        return [4 /*yield*/, profile_po_1.ProfilePageObject.dob.click()];
                    case 5:
                        _b.sent();
                        return [4 /*yield*/, profile_po_1.ProfilePageObject.getFirstSelectableDate()];
                    case 6:
                        firstSelectableLabel = _b.sent();
                        today = new Date();
                        formatted = this.getDate(today);
                        if (!(formatted === firstSelectableLabel)) return [3 /*break*/, 11];
                        return [4 /*yield*/, profile_po_1.ProfilePageObject.leftDatePickNavButton.click()];
                    case 7:
                        _b.sent();
                        return [4 /*yield*/, protractor_1.browser.sleep(1000)];
                    case 8:
                        _b.sent();
                        return [4 /*yield*/, profile_po_1.ProfilePageObject.getFirstSelectableDate()];
                    case 9:
                        firstSelectableLabel = _b.sent();
                        return [4 /*yield*/, common_po_1.commonPageObjects.getLinkByAriaLabel(firstSelectableLabel).click()];
                    case 10:
                        _b.sent();
                        return [3 /*break*/, 13];
                    case 11: return [4 /*yield*/, common_po_1.commonPageObjects.getLinkByAriaLabel(firstSelectableLabel).click()];
                    case 12:
                        _b.sent();
                        _b.label = 13;
                    case 13:
                        _a = this;
                        return [4 /*yield*/, profile_po_1.ProfilePageObject.dob.getAttribute('value')];
                    case 14:
                        _a.DATE = _b.sent();
                        return [4 /*yield*/, profile_po_1.ProfilePageObject.address1.clear()];
                    case 15:
                        _b.sent();
                        return [4 /*yield*/, profile_po_1.ProfilePageObject.address1.sendKeys('Address1')];
                    case 16:
                        _b.sent();
                        return [4 /*yield*/, profile_po_1.ProfilePageObject.address2.clear()];
                    case 17:
                        _b.sent();
                        return [4 /*yield*/, profile_po_1.ProfilePageObject.address2.sendKeys('Address2')];
                    case 18:
                        _b.sent();
                        return [4 /*yield*/, profile_po_1.ProfilePageObject.city.clear()];
                    case 19:
                        _b.sent();
                        return [4 /*yield*/, profile_po_1.ProfilePageObject.city.sendKeys('TestCity')];
                    case 20:
                        _b.sent();
                        return [4 /*yield*/, profile_po_1.ProfilePageObject.state.clear()];
                    case 21:
                        _b.sent();
                        return [4 /*yield*/, profile_po_1.ProfilePageObject.state.sendKeys('TestState')];
                    case 22:
                        _b.sent();
                        return [4 /*yield*/, profile_po_1.ProfilePageObject.zip.clear()];
                    case 23:
                        _b.sent();
                        return [4 /*yield*/, profile_po_1.ProfilePageObject.zip.sendKeys('560000')];
                    case 24:
                        _b.sent();
                        return [4 /*yield*/, this.operateSelect(profile_po_1.ProfilePageObject.countryInput, 'India')];
                    case 25:
                        _b.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ProfilePageHelper.fillAboutYou = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.operateSelect(profile_po_1.ProfilePageObject.genderInput, 'Male')];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.operateSelect(profile_po_1.ProfilePageObject.sizeInput, 'XXS')];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, profile_po_1.ProfilePageObject.currentLocation.clear()];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, profile_po_1.ProfilePageObject.currentLocation.sendKeys('India')];
                    case 4:
                        _a.sent();
                        return [4 /*yield*/, profile_po_1.ProfilePageObject.primaryInterestInTopcoder.clear()];
                    case 5:
                        _a.sent();
                        return [4 /*yield*/, profile_po_1.ProfilePageObject.primaryInterestInTopcoder.sendKeys('Coding')];
                    case 6:
                        _a.sent();
                        return [4 /*yield*/, profile_po_1.ProfilePageObject.description.clear()];
                    case 7:
                        _a.sent();
                        return [4 /*yield*/, profile_po_1.ProfilePageObject.description.sendKeys('Lorem Ipsum lorem ipsum')];
                    case 8:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ProfilePageHelper.fillTrackDetails = function () {
        return __awaiter(this, void 0, void 0, function () {
            var disabledTracks, switches;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, profile_po_1.ProfilePageObject.getTrackSwitchesDisabled()];
                    case 1:
                        disabledTracks = _a.sent();
                        return [4 /*yield*/, profile_po_1.ProfilePageObject.trackSwitches];
                    case 2:
                        switches = _a.sent();
                        if (!disabledTracks.includes('design')) return [3 /*break*/, 4];
                        return [4 /*yield*/, switches[0].click()];
                    case 3:
                        _a.sent();
                        _a.label = 4;
                    case 4:
                        if (!disabledTracks.includes('data_science')) return [3 /*break*/, 6];
                        return [4 /*yield*/, switches[2].click()];
                    case 5:
                        _a.sent();
                        _a.label = 6;
                    case 6:
                        if (!!disabledTracks.includes('develop')) return [3 /*break*/, 8];
                        return [4 /*yield*/, switches[1].click()];
                    case 7:
                        _a.sent();
                        _a.label = 8;
                    case 8: return [2 /*return*/];
                }
            });
        });
    };
    ProfilePageHelper.saveChanges = function () {
        return __awaiter(this, void 0, void 0, function () {
            var until, successEl;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        until = protractor_1.protractor.ExpectedConditions;
                        return [4 /*yield*/, profile_po_1.ProfilePageObject.saveButton.click()];
                    case 1:
                        _a.sent();
                        successEl = profile_po_1.ProfilePageObject.successMsg;
                        return [4 /*yield*/, protractor_1.browser.wait(until.visibilityOf(successEl))];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ProfilePageHelper.verifyPersonalDetails = function () {
        return __awaiter(this, void 0, void 0, function () {
            var firstName, lastName, dob, address1, address2, city, state, zip, country;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, profile_po_1.ProfilePageObject.firstName.getAttribute('value')];
                    case 1:
                        firstName = _a.sent();
                        expect(firstName).toEqual('Test1');
                        return [4 /*yield*/, profile_po_1.ProfilePageObject.lastName.getAttribute('value')];
                    case 2:
                        lastName = _a.sent();
                        expect(lastName).toEqual('User1');
                        return [4 /*yield*/, profile_po_1.ProfilePageObject.dob.getAttribute('value')];
                    case 3:
                        dob = _a.sent();
                        expect(dob).toEqual(this.DATE);
                        return [4 /*yield*/, profile_po_1.ProfilePageObject.address1.getAttribute('value')];
                    case 4:
                        address1 = _a.sent();
                        expect(address1).toEqual('Address1');
                        return [4 /*yield*/, profile_po_1.ProfilePageObject.address2.getAttribute('value')];
                    case 5:
                        address2 = _a.sent();
                        expect(address2).toEqual('Address2');
                        return [4 /*yield*/, profile_po_1.ProfilePageObject.city.getAttribute('value')];
                    case 6:
                        city = _a.sent();
                        expect(city).toEqual('TestCity');
                        return [4 /*yield*/, profile_po_1.ProfilePageObject.state.getAttribute('value')];
                    case 7:
                        state = _a.sent();
                        expect(state).toEqual('TestState');
                        return [4 /*yield*/, profile_po_1.ProfilePageObject.zip.getAttribute('value')];
                    case 8:
                        zip = _a.sent();
                        expect(zip).toEqual('560000');
                        return [4 /*yield*/, profile_po_1.ProfilePageObject.countryHidden.getAttribute('value')];
                    case 9:
                        country = _a.sent();
                        expect(country).toEqual('India');
                        return [2 /*return*/];
                }
            });
        });
    };
    ProfilePageHelper.verifyAboutYou = function () {
        return __awaiter(this, void 0, void 0, function () {
            var gender, tshirtSize, currentLocation, primaryInterestInTopcoder, description;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, profile_po_1.ProfilePageObject.genderHidden.getAttribute('value')];
                    case 1:
                        gender = _a.sent();
                        expect(gender).toEqual('Male');
                        return [4 /*yield*/, profile_po_1.ProfilePageObject.tshirtSizeHidden.getAttribute('value')];
                    case 2:
                        tshirtSize = _a.sent();
                        expect(tshirtSize).toEqual('XXS');
                        return [4 /*yield*/, profile_po_1.ProfilePageObject.currentLocation.getAttribute('value')];
                    case 3:
                        currentLocation = _a.sent();
                        expect(currentLocation).toEqual('India');
                        return [4 /*yield*/, profile_po_1.ProfilePageObject.primaryInterestInTopcoder.getAttribute('value')];
                    case 4:
                        primaryInterestInTopcoder = _a.sent();
                        expect(primaryInterestInTopcoder).toEqual('Coding');
                        return [4 /*yield*/, profile_po_1.ProfilePageObject.description.getAttribute('value')];
                    case 5:
                        description = _a.sent();
                        expect(description).toEqual('Lorem Ipsum lorem ipsum');
                        return [2 /*return*/];
                }
            });
        });
    };
    ProfilePageHelper.verifyTrackDetails = function () {
        return __awaiter(this, void 0, void 0, function () {
            var disabledTracks;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, profile_po_1.ProfilePageObject.getTrackSwitchesDisabled()];
                    case 1:
                        disabledTracks = _a.sent();
                        expect(disabledTracks.length).toEqual(1);
                        expect(disabledTracks[0]).toEqual('develop');
                        return [2 /*return*/];
                }
            });
        });
    };
    ProfilePageHelper.addLanguage = function () {
        return __awaiter(this, void 0, void 0, function () {
            var until, successEl, el, isDisplayed, text;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        until = protractor_1.protractor.ExpectedConditions;
                        return [4 /*yield*/, this.operateSelect(profile_po_1.ProfilePageObject.languageInput, 'English')];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.operateSelect(profile_po_1.ProfilePageObject.spokenLevelInput, 'Basic')];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, this.operateSelect(profile_po_1.ProfilePageObject.writtenLevelInput, 'Basic')];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, profile_po_1.ProfilePageObject.addLanguageButton.click()];
                    case 4:
                        _a.sent();
                        successEl = profile_po_1.ProfilePageObject.successMsg;
                        return [4 /*yield*/, protractor_1.browser.wait(until.visibilityOf(successEl))];
                    case 5:
                        _a.sent();
                        return [4 /*yield*/, protractor_1.browser.wait(until.invisibilityOf(successEl))];
                    case 6:
                        _a.sent();
                        el = common_po_1.commonPageObjects.findElementByText('div', 'Spoken: BASIC | Written: BASIC');
                        return [4 /*yield*/, el.isDisplayed()];
                    case 7:
                        isDisplayed = _a.sent();
                        expect(isDisplayed).toBe(true);
                        return [4 /*yield*/, el.element(protractor_1.by.xpath('..')).getText()];
                    case 8:
                        text = _a.sent();
                        expect(text.includes('English')).toBe(true);
                        return [2 /*return*/];
                }
            });
        });
    };
    ProfilePageHelper.editLanguage = function () {
        return __awaiter(this, void 0, void 0, function () {
            var until, successEl, el, isDisplayed, text;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        until = protractor_1.protractor.ExpectedConditions;
                        return [4 /*yield*/, profile_po_1.ProfilePageObject.getEdit('English').click()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.operateSelect(profile_po_1.ProfilePageObject.spokenLevelInput, 'Advanced')];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, this.operateSelect(profile_po_1.ProfilePageObject.writtenLevelInput, 'Basic')];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, profile_po_1.ProfilePageObject.editLanguageButton.click()];
                    case 4:
                        _a.sent();
                        successEl = profile_po_1.ProfilePageObject.successMsg;
                        return [4 /*yield*/, protractor_1.browser.wait(until.visibilityOf(successEl))];
                    case 5:
                        _a.sent();
                        return [4 /*yield*/, protractor_1.browser.wait(until.invisibilityOf(successEl))];
                    case 6:
                        _a.sent();
                        el = common_po_1.commonPageObjects.findElementByText('div', 'Spoken: ADVANCED | Written: BASIC');
                        return [4 /*yield*/, el.isDisplayed()];
                    case 7:
                        isDisplayed = _a.sent();
                        expect(isDisplayed).toBe(true);
                        return [4 /*yield*/, el.element(protractor_1.by.xpath('..')).getText()];
                    case 8:
                        text = _a.sent();
                        expect(text.includes('English')).toBe(true);
                        return [2 /*return*/];
                }
            });
        });
    };
    ProfilePageHelper.deleteLanguage = function () {
        return __awaiter(this, void 0, void 0, function () {
            var until, successEl, el, isDisplayed;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        until = protractor_1.protractor.ExpectedConditions;
                        return [4 /*yield*/, profile_po_1.ProfilePageObject.getDelete('English').click()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, profile_po_1.ProfilePageObject.deleteConfirmation.click()];
                    case 2:
                        _a.sent();
                        successEl = profile_po_1.ProfilePageObject.successMsg;
                        return [4 /*yield*/, protractor_1.browser.wait(until.visibilityOf(successEl))];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, protractor_1.browser.wait(until.invisibilityOf(successEl))];
                    case 4:
                        _a.sent();
                        el = common_po_1.commonPageObjects.findElementByText('div', 'Spoken: ADVANCED | Written: BASIC');
                        return [4 /*yield*/, el.isPresent()];
                    case 5:
                        isDisplayed = _a.sent();
                        expect(isDisplayed).toBe(false);
                        return [2 /*return*/];
                }
            });
        });
    };
    ProfilePageHelper.addEducation = function () {
        return __awaiter(this, void 0, void 0, function () {
            var until, elm, successEl;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        until = protractor_1.protractor.ExpectedConditions;
                        return [4 /*yield*/, profile_po_1.ProfilePageObject.schoolCollegeName.clear()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, profile_po_1.ProfilePageObject.schoolCollegeName.sendKeys('Test college')];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, profile_po_1.ProfilePageObject.major.clear()];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, profile_po_1.ProfilePageObject.major.sendKeys('Test Major')];
                    case 4:
                        _a.sent();
                        elm = profile_po_1.ProfilePageObject.dateFrom;
                        return [4 /*yield*/, protractor_1.browser.executeScript('arguments[0].removeAttribute("readonly");', elm.getWebElement())];
                    case 5:
                        _a.sent();
                        return [4 /*yield*/, protractor_1.browser.sleep(1000)];
                    case 6:
                        _a.sent();
                        return [4 /*yield*/, profile_po_1.ProfilePageObject.dateFrom.sendKeys('01/06/2010')];
                    case 7:
                        _a.sent();
                        return [4 /*yield*/, protractor_1.browser.sleep(1000)];
                    case 8:
                        _a.sent();
                        elm = profile_po_1.ProfilePageObject.dateTo;
                        return [4 /*yield*/, protractor_1.browser.executeScript('arguments[0].removeAttribute("readonly");', elm.getWebElement())];
                    case 9:
                        _a.sent();
                        return [4 /*yield*/, protractor_1.browser.sleep(1000)];
                    case 10:
                        _a.sent();
                        return [4 /*yield*/, profile_po_1.ProfilePageObject.dateTo.sendKeys('01/06/2014')];
                    case 11:
                        _a.sent();
                        return [4 /*yield*/, protractor_1.browser.sleep(1000)];
                    case 12:
                        _a.sent();
                        return [4 /*yield*/, profile_po_1.ProfilePageObject.graduatedLabel.click()];
                    case 13:
                        _a.sent();
                        return [4 /*yield*/, profile_po_1.ProfilePageObject.addEducationButton.click()];
                    case 14:
                        _a.sent();
                        successEl = profile_po_1.ProfilePageObject.successMsg;
                        return [4 /*yield*/, protractor_1.browser.wait(until.visibilityOf(successEl))];
                    case 15:
                        _a.sent();
                        return [4 /*yield*/, protractor_1.browser.wait(until.invisibilityOf(successEl))];
                    case 16:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ProfilePageHelper.editEducation = function () {
        return __awaiter(this, void 0, void 0, function () {
            var until, successEl, el, isDisplayed;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        until = protractor_1.protractor.ExpectedConditions;
                        return [4 /*yield*/, profile_po_1.ProfilePageObject.getEdit('Test college').click()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, profile_po_1.ProfilePageObject.schoolCollegeName.sendKeys('Test college1')];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, profile_po_1.ProfilePageObject.editEducationButton.click()];
                    case 3:
                        _a.sent();
                        successEl = profile_po_1.ProfilePageObject.successMsg;
                        return [4 /*yield*/, protractor_1.browser.wait(until.visibilityOf(successEl))];
                    case 4:
                        _a.sent();
                        return [4 /*yield*/, protractor_1.browser.wait(until.invisibilityOf(successEl))];
                    case 5:
                        _a.sent();
                        el = common_po_1.commonPageObjects.findElementByText('div', 'Test college1');
                        return [4 /*yield*/, el.isDisplayed()];
                    case 6:
                        isDisplayed = _a.sent();
                        expect(isDisplayed).toBe(true);
                        return [2 /*return*/];
                }
            });
        });
    };
    ProfilePageHelper.deleteEducation = function () {
        return __awaiter(this, void 0, void 0, function () {
            var until, successEl, el, isDisplayed;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        until = protractor_1.protractor.ExpectedConditions;
                        return [4 /*yield*/, profile_po_1.ProfilePageObject.getDelete('Test college1').click()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, profile_po_1.ProfilePageObject.deleteConfirmation.click()];
                    case 2:
                        _a.sent();
                        successEl = profile_po_1.ProfilePageObject.successMsg;
                        return [4 /*yield*/, protractor_1.browser.wait(until.visibilityOf(successEl))];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, protractor_1.browser.wait(until.invisibilityOf(successEl))];
                    case 4:
                        _a.sent();
                        el = common_po_1.commonPageObjects.findElementByText('div', 'Test college1');
                        return [4 /*yield*/, el.isPresent()];
                    case 5:
                        isDisplayed = _a.sent();
                        expect(isDisplayed).toBe(false);
                        return [2 /*return*/];
                }
            });
        });
    };
    ProfilePageHelper.addWork = function () {
        return __awaiter(this, void 0, void 0, function () {
            var until, elm, successEl;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        until = protractor_1.protractor.ExpectedConditions;
                        return [4 /*yield*/, profile_po_1.ProfilePageObject.company.clear()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, profile_po_1.ProfilePageObject.company.sendKeys('Test company')];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, profile_po_1.ProfilePageObject.position.clear()];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, profile_po_1.ProfilePageObject.position.sendKeys('Test Position')];
                    case 4:
                        _a.sent();
                        return [4 /*yield*/, profile_po_1.ProfilePageObject.industry.clear()];
                    case 5:
                        _a.sent();
                        return [4 /*yield*/, profile_po_1.ProfilePageObject.industry.sendKeys('Test Industry')];
                    case 6:
                        _a.sent();
                        return [4 /*yield*/, profile_po_1.ProfilePageObject.cityTown.clear()];
                    case 7:
                        _a.sent();
                        return [4 /*yield*/, profile_po_1.ProfilePageObject.cityTown.sendKeys('Test City')];
                    case 8:
                        _a.sent();
                        elm = profile_po_1.ProfilePageObject.dateFrom;
                        return [4 /*yield*/, protractor_1.browser.executeScript('arguments[0].removeAttribute("readonly");', elm.getWebElement())];
                    case 9:
                        _a.sent();
                        return [4 /*yield*/, protractor_1.browser.sleep(1000)];
                    case 10:
                        _a.sent();
                        return [4 /*yield*/, profile_po_1.ProfilePageObject.dateFrom.sendKeys('01/06/2015')];
                    case 11:
                        _a.sent();
                        return [4 /*yield*/, protractor_1.browser.sleep(1000)];
                    case 12:
                        _a.sent();
                        elm = profile_po_1.ProfilePageObject.dateTo;
                        return [4 /*yield*/, protractor_1.browser.executeScript('arguments[0].removeAttribute("readonly");', elm.getWebElement())];
                    case 13:
                        _a.sent();
                        return [4 /*yield*/, protractor_1.browser.sleep(1000)];
                    case 14:
                        _a.sent();
                        return [4 /*yield*/, profile_po_1.ProfilePageObject.dateTo.sendKeys('01/06/2016')];
                    case 15:
                        _a.sent();
                        return [4 /*yield*/, protractor_1.browser.sleep(1000)];
                    case 16:
                        _a.sent();
                        return [4 /*yield*/, profile_po_1.ProfilePageObject.addWorkButton.click()];
                    case 17:
                        _a.sent();
                        successEl = profile_po_1.ProfilePageObject.successMsg;
                        return [4 /*yield*/, protractor_1.browser.wait(until.visibilityOf(successEl))];
                    case 18:
                        _a.sent();
                        return [4 /*yield*/, protractor_1.browser.wait(until.invisibilityOf(successEl))];
                    case 19:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ProfilePageHelper.editWork = function () {
        return __awaiter(this, void 0, void 0, function () {
            var until, successEl, el, isDisplayed;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        until = protractor_1.protractor.ExpectedConditions;
                        return [4 /*yield*/, profile_po_1.ProfilePageObject.getEdit('Test company').click()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, profile_po_1.ProfilePageObject.company.clear()];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, profile_po_1.ProfilePageObject.company.sendKeys('Test company1')];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, profile_po_1.ProfilePageObject.editWorkButton.click()];
                    case 4:
                        _a.sent();
                        successEl = profile_po_1.ProfilePageObject.successMsg;
                        return [4 /*yield*/, protractor_1.browser.wait(until.visibilityOf(successEl))];
                    case 5:
                        _a.sent();
                        return [4 /*yield*/, protractor_1.browser.wait(until.invisibilityOf(successEl))];
                    case 6:
                        _a.sent();
                        el = common_po_1.commonPageObjects.findElementByText('div', 'Test company1');
                        return [4 /*yield*/, el.isDisplayed()];
                    case 7:
                        isDisplayed = _a.sent();
                        expect(isDisplayed).toBe(true);
                        return [2 /*return*/];
                }
            });
        });
    };
    ProfilePageHelper.deleteWork = function () {
        return __awaiter(this, void 0, void 0, function () {
            var until, successEl, el, isDisplayed;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        until = protractor_1.protractor.ExpectedConditions;
                        return [4 /*yield*/, profile_po_1.ProfilePageObject.getDelete('Test company1').click()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, profile_po_1.ProfilePageObject.deleteConfirmation.click()];
                    case 2:
                        _a.sent();
                        successEl = profile_po_1.ProfilePageObject.successMsg;
                        return [4 /*yield*/, protractor_1.browser.wait(until.visibilityOf(successEl))];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, protractor_1.browser.wait(until.invisibilityOf(successEl))];
                    case 4:
                        _a.sent();
                        el = common_po_1.commonPageObjects.findElementByText('div', 'Test company1');
                        return [4 /*yield*/, el.isPresent()];
                    case 5:
                        isDisplayed = _a.sent();
                        expect(isDisplayed).toBe(false);
                        return [2 /*return*/];
                }
            });
        });
    };
    ProfilePageHelper.addSkill = function () {
        return __awaiter(this, void 0, void 0, function () {
            var until, el, isDisplayed;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        until = protractor_1.protractor.ExpectedConditions;
                        return [4 /*yield*/, this.operateSelect(profile_po_1.ProfilePageObject.skillInput, 'API')];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, profile_po_1.ProfilePageObject.addSkillButton.click()];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, protractor_1.browser.sleep(1000)];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, protractor_1.browser.wait(until.visibilityOf(profile_po_1.ProfilePageObject.skillSuccessMsg))];
                    case 4:
                        _a.sent();
                        return [4 /*yield*/, protractor_1.browser.wait(until.invisibilityOf(profile_po_1.ProfilePageObject.skillSuccessMsg))];
                    case 5:
                        _a.sent();
                        el = common_po_1.commonPageObjects.findElementByText('div', 'API');
                        return [4 /*yield*/, el.isDisplayed()];
                    case 6:
                        isDisplayed = _a.sent();
                        expect(isDisplayed).toBe(true);
                        return [2 /*return*/];
                }
            });
        });
    };
    ProfilePageHelper.deleteSkill = function () {
        return __awaiter(this, void 0, void 0, function () {
            var until, el, isDisplayed;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        until = protractor_1.protractor.ExpectedConditions;
                        return [4 /*yield*/, profile_po_1.ProfilePageObject.apiSkill.click()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, profile_po_1.ProfilePageObject.deleteConfirmation.click()];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, protractor_1.browser.sleep(1000)];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, protractor_1.browser.wait(until.visibilityOf(profile_po_1.ProfilePageObject.skillSuccessMsg))];
                    case 4:
                        _a.sent();
                        return [4 /*yield*/, protractor_1.browser.wait(until.invisibilityOf(profile_po_1.ProfilePageObject.skillSuccessMsg))];
                    case 5:
                        _a.sent();
                        el = common_po_1.commonPageObjects.findElementByText('div', 'API');
                        return [4 /*yield*/, el.isPresent()];
                    case 6:
                        isDisplayed = _a.sent();
                        expect(isDisplayed).toBe(false);
                        return [2 /*return*/];
                }
            });
        });
    };
    ProfilePageHelper.addHobby = function () {
        return __awaiter(this, void 0, void 0, function () {
            var until, successEl;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        until = protractor_1.protractor.ExpectedConditions;
                        return [4 /*yield*/, profile_po_1.ProfilePageObject.hobby.clear()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, profile_po_1.ProfilePageObject.hobby.sendKeys('Test hobby')];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, profile_po_1.ProfilePageObject.description.clear()];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, profile_po_1.ProfilePageObject.description.sendKeys('Test Description')];
                    case 4:
                        _a.sent();
                        return [4 /*yield*/, profile_po_1.ProfilePageObject.addHobbyButton.click()];
                    case 5:
                        _a.sent();
                        successEl = profile_po_1.ProfilePageObject.successMsg;
                        return [4 /*yield*/, protractor_1.browser.wait(until.visibilityOf(successEl))];
                    case 6:
                        _a.sent();
                        return [4 /*yield*/, protractor_1.browser.wait(until.invisibilityOf(successEl))];
                    case 7:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ProfilePageHelper.editHobby = function () {
        return __awaiter(this, void 0, void 0, function () {
            var until, successEl, el, isDisplayed;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        until = protractor_1.protractor.ExpectedConditions;
                        return [4 /*yield*/, profile_po_1.ProfilePageObject.getEdit('Test hobby').click()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, profile_po_1.ProfilePageObject.hobby.clear()];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, profile_po_1.ProfilePageObject.hobby.sendKeys('Test hobby1')];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, profile_po_1.ProfilePageObject.editHobbyButton.click()];
                    case 4:
                        _a.sent();
                        successEl = profile_po_1.ProfilePageObject.successMsg;
                        return [4 /*yield*/, protractor_1.browser.wait(until.visibilityOf(successEl))];
                    case 5:
                        _a.sent();
                        return [4 /*yield*/, protractor_1.browser.wait(until.invisibilityOf(successEl))];
                    case 6:
                        _a.sent();
                        el = common_po_1.commonPageObjects.findElementByText('div', 'Test hobby1');
                        return [4 /*yield*/, el.isDisplayed()];
                    case 7:
                        isDisplayed = _a.sent();
                        expect(isDisplayed).toBe(true);
                        return [2 /*return*/];
                }
            });
        });
    };
    ProfilePageHelper.deleteHobby = function () {
        return __awaiter(this, void 0, void 0, function () {
            var until, successEl, el, isDisplayed;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, protractor_1.browser.sleep(3000)];
                    case 1:
                        _a.sent();
                        until = protractor_1.protractor.ExpectedConditions;
                        return [4 /*yield*/, profile_po_1.ProfilePageObject.getDelete('Test hobby1').click()];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, profile_po_1.ProfilePageObject.deleteConfirmation.click()];
                    case 3:
                        _a.sent();
                        successEl = profile_po_1.ProfilePageObject.successMsg;
                        return [4 /*yield*/, protractor_1.browser.wait(until.visibilityOf(successEl))];
                    case 4:
                        _a.sent();
                        return [4 /*yield*/, protractor_1.browser.wait(until.invisibilityOf(successEl))];
                    case 5:
                        _a.sent();
                        el = common_po_1.commonPageObjects.findElementByText('div', 'Test hobby1');
                        return [4 /*yield*/, el.isPresent()];
                    case 6:
                        isDisplayed = _a.sent();
                        expect(isDisplayed).toBe(false);
                        return [2 /*return*/];
                }
            });
        });
    };
    ProfilePageHelper.verifyBlockchainCommunity = function () {
        return __awaiter(this, void 0, void 0, function () {
            var el, until;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, profile_po_1.ProfilePageObject.blockchainCommunity()];
                    case 1:
                        el = _a.sent();
                        return [4 /*yield*/, el.click()];
                    case 2:
                        _a.sent();
                        until = protractor_1.protractor.ExpectedConditions;
                        return [4 /*yield*/, protractor_1.browser.wait(until.visibilityOf(profile_po_1.ProfilePageObject.successMsg))];
                    case 3:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ProfilePageHelper.operateSelect = function (el, selection) {
        return __awaiter(this, void 0, void 0, function () {
            var until, elements, matchingEl;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        until = protractor_1.protractor.ExpectedConditions;
                        return [4 /*yield*/, el.sendKeys(selection)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, protractor_1.browser.wait(until.visibilityOf(protractor_1.element(protractor_1.by.className('Select-option'))))];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, profile_po_1.ProfilePageObject.selectOptions];
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
    ProfilePageHelper.getDate = function (date) {
        var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        return (date.toLocaleDateString("en-US", options));
    };
    return ProfilePageHelper;
}());
exports.ProfilePageHelper = ProfilePageHelper;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJvZmlsZS5oZWxwZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9wYWdlLW9iamVjdHMvcGFnZXMvdG9wY29kZXIvcHJvZmlsZS9wcm9maWxlLmhlbHBlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEseUNBQStFO0FBQy9FLHlEQUEyRDtBQUMzRCwyQ0FBaUQ7QUFDakQsdURBQThEO0FBRTlEO0lBQUE7SUEwYUEsQ0FBQztJQXZhZ0IscUJBQUcsR0FBaEI7Ozs7NEJBQ0kscUJBQU0sb0JBQU8sQ0FBQyxHQUFHLENBQUMsd0NBQW9CLENBQUMsR0FBRyxDQUFDLEVBQUE7O3dCQUEzQyxTQUEyQyxDQUFDO3dCQUM1QyxxQkFBTSxvQkFBTyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsRUFBQTs7d0JBQXpCLFNBQXlCLENBQUM7d0JBQzFCLHFCQUFNLE9BQU8sQ0FBQyxHQUFHLENBQUMsZ0NBQWdDLENBQUMsRUFBQTs7d0JBQW5ELFNBQW1ELENBQUM7Ozs7O0tBQ3ZEO0lBRVksbUNBQWlCLEdBQTlCOzs7Ozs7d0JBQ1UsS0FBSyxHQUFHLHVCQUFVLENBQUMsa0JBQWtCLENBQUM7d0JBQzVDLHFCQUFNLG9CQUFPLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxZQUFZLENBQUMsOEJBQWlCLENBQUMsU0FBUyxDQUFDLENBQUMsRUFBQTs7d0JBQW5FLFNBQW1FLENBQUM7d0JBQ2pELHFCQUFNLG9CQUFPLENBQUMsYUFBYSxFQUFFLEVBQUE7O3dCQUExQyxVQUFVLEdBQUcsU0FBNkI7d0JBQ2hELE1BQU0sQ0FBQyxVQUFVLENBQUMsQ0FBQyxPQUFPLENBQUMsd0NBQW9CLENBQUMsZUFBZSxFQUFFLENBQUMsQ0FBQzt3QkFDbkUsT0FBTyxDQUFDLEdBQUcsQ0FBQyxpQ0FBaUMsQ0FBQyxDQUFDOzs7OztLQUNsRDtJQUVZLHFDQUFtQixHQUFoQzs7Ozs7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