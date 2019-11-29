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
var common_helper_1 = require("../../../common/common.helper");
var ProfilePageObject = /** @class */ (function () {
    function ProfilePageObject() {
    }
    Object.defineProperty(ProfilePageObject, "container", {
        get: function () {
            return common_po_1.commonPageObjects.getTextFromH1(common_helper_1.commonPageHelper.getConfigUserName());
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ProfilePageObject, "firstName", {
        get: function () {
            return protractor_1.element(protractor_1.by.id('firstName'));
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ProfilePageObject, "lastName", {
        get: function () {
            return protractor_1.element(protractor_1.by.id('lastName'));
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ProfilePageObject, "dob", {
        get: function () {
            return protractor_1.element(protractor_1.by.id('date-range-picker1'));
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ProfilePageObject, "currentDate", {
        get: function () {
            return protractor_1.element(protractor_1.by.className('CalendarDay__selected'));
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ProfilePageObject, "address1", {
        get: function () {
            return protractor_1.element(protractor_1.by.name('streetAddr1'));
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ProfilePageObject, "address2", {
        get: function () {
            return protractor_1.element(protractor_1.by.name('streetAddr2'));
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ProfilePageObject, "city", {
        get: function () {
            return protractor_1.element(protractor_1.by.id('city'));
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ProfilePageObject, "state", {
        get: function () {
            return protractor_1.element(protractor_1.by.id('state'));
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ProfilePageObject, "zip", {
        get: function () {
            return protractor_1.element(protractor_1.by.id('zipCode'));
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ProfilePageObject, "countryHidden", {
        get: function () {
            return protractor_1.element(protractor_1.by.name('country'));
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ProfilePageObject, "languageInput", {
        get: function () {
            return protractor_1.element(protractor_1.by.css('[aria-activedescendant="react-select-14--value"]'));
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ProfilePageObject, "spokenLevelInput", {
        get: function () {
            return protractor_1.element(protractor_1.by.css('[aria-activedescendant="react-select-15--value"]'));
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ProfilePageObject, "writtenLevelInput", {
        get: function () {
            return protractor_1.element(protractor_1.by.css('[aria-activedescendant="react-select-16--value"]'));
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ProfilePageObject, "countryInput", {
        get: function () {
            return protractor_1.element(protractor_1.by.css('[aria-activedescendant="react-select-2--value"]'));
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ProfilePageObject, "genderInput", {
        get: function () {
            return protractor_1.element(protractor_1.by.css('[aria-activedescendant="react-select-3--value"]'));
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ProfilePageObject, "sizeInput", {
        get: function () {
            return protractor_1.element(protractor_1.by.css('[aria-activedescendant="react-select-4--value"]'));
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ProfilePageObject, "skillInput", {
        get: function () {
            return protractor_1.element(protractor_1.by.css('[aria-activedescendant="react-select-10--value"]'));
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ProfilePageObject, "genderHidden", {
        get: function () {
            return protractor_1.element(protractor_1.by.name('gender'));
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ProfilePageObject, "tshirtSizeHidden", {
        get: function () {
            return protractor_1.element(protractor_1.by.name('tshirtSize'));
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ProfilePageObject, "selectOptions", {
        get: function () {
            return protractor_1.element.all(protractor_1.by.className('Select-option'));
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ProfilePageObject, "currentLocation", {
        get: function () {
            return protractor_1.element(protractor_1.by.id('currentLocation'));
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ProfilePageObject, "primaryInterestInTopcoder", {
        get: function () {
            return protractor_1.element(protractor_1.by.id('primaryInterestInTopcoder'));
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ProfilePageObject, "description", {
        get: function () {
            return protractor_1.element(protractor_1.by.id('description'));
        },
        enumerable: true,
        configurable: true
    });
    ProfilePageObject.getTrackSwitchesDisabled = function () {
        return __awaiter(this, void 0, void 0, function () {
            var elements, values, i, el, val;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, protractor_1.element.all(protractor_1.by.className('BZhTou'))];
                    case 1:
                        elements = _a.sent();
                        values = [];
                        i = 0;
                        _a.label = 2;
                    case 2:
                        if (!(i < elements.length)) return [3 /*break*/, 5];
                        el = elements[i];
                        return [4 /*yield*/, el.element(protractor_1.by.className('onoffswitch-checkbox')).getAttribute('value')];
                    case 3:
                        val = _a.sent();
                        values.push(val);
                        _a.label = 4;
                    case 4:
                        i++;
                        return [3 /*break*/, 2];
                    case 5: return [2 /*return*/, values];
                }
            });
        });
    };
    Object.defineProperty(ProfilePageObject, "trackSwitches", {
        get: function () {
            return protractor_1.element.all(protractor_1.by.className('onoffswitch-switch'));
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ProfilePageObject, "languageHeader", {
        get: function () {
            return common_po_1.commonPageObjects.getTextFromH1('Language');
        },
        enumerable: true,
        configurable: true
    });
    ProfilePageObject.getFirstSelectableDate = function () {
        return __awaiter(this, void 0, void 0, function () {
            var els, label, i, isDisplayed;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, protractor_1.element.all(protractor_1.by.className('CalendarDay__default'))];
                    case 1:
                        els = _a.sent();
                        label = '';
                        i = 0;
                        _a.label = 2;
                    case 2:
                        if (!(i < els.length)) return [3 /*break*/, 6];
                        return [4 /*yield*/, els[i].isDisplayed()];
                    case 3:
                        isDisplayed = _a.sent();
                        if (!isDisplayed) return [3 /*break*/, 5];
                        return [4 /*yield*/, els[i].getAttribute('aria-label')];
                    case 4:
                        label = _a.sent();
                        return [2 /*return*/, label];
                    case 5:
                        i++;
                        return [3 /*break*/, 2];
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    Object.defineProperty(ProfilePageObject, "leftDatePickNavButton", {
        get: function () {
            return protractor_1.element(protractor_1.by.className('DayPickerNavigation_button__horizontal'));
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ProfilePageObject, "addLanguageButton", {
        get: function () {
            return common_po_1.commonPageObjects.findElementByText('button', 'Add language to your list');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ProfilePageObject, "apiSkill", {
        get: function () {
            return protractor_1.element(protractor_1.by.id('skill-a-117'));
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ProfilePageObject, "hobby", {
        get: function () {
            return protractor_1.element(protractor_1.by.id('hobby'));
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ProfilePageObject, "addSkillButton", {
        get: function () {
            return common_po_1.commonPageObjects.findElementByText('button', 'Add skill to your list');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ProfilePageObject, "addHobbyButton", {
        get: function () {
            return common_po_1.commonPageObjects.findElementByText('button', 'Add hobby to your list');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ProfilePageObject, "successMsg", {
        get: function () {
            return common_po_1.commonPageObjects.findElementByText('div', 'Your information has been updated');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ProfilePageObject, "skillSuccessMsg", {
        get: function () {
            return common_po_1.commonPageObjects.findElementByText('div', 'Success');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ProfilePageObject, "saveButton", {
        get: function () {
            return common_po_1.commonPageObjects.findElementByText('button', 'Save Changes');
        },
        enumerable: true,
        configurable: true
    });
    ProfilePageObject.getEdit = function (name) {
        return common_po_1.commonPageObjects.findElementByText('div', name)
            .element(protractor_1.by.xpath('..'))
            .element(protractor_1.by.xpath('..'))
            .element(protractor_1.by.xpath('..'))
            .element(protractor_1.by.xpath('//p[contains(text(), "Edit")]'));
    };
    ProfilePageObject.getDelete = function (name) {
        return common_po_1.commonPageObjects.findElementByText('div', name)
            .element(protractor_1.by.xpath('..'))
            .element(protractor_1.by.xpath('..'))
            .element(protractor_1.by.xpath('..'))
            .element(protractor_1.by.xpath('//p[contains(text(), "Delete")]'));
    };
    Object.defineProperty(ProfilePageObject, "editLanguageButton", {
        get: function () {
            return common_po_1.commonPageObjects.findElementByText('button', 'Edit language to your list');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ProfilePageObject, "editEducationButton", {
        get: function () {
            return common_po_1.commonPageObjects.findElementByText('button', 'Edit education to your list');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ProfilePageObject, "editWorkButton", {
        get: function () {
            return common_po_1.commonPageObjects.findElementByText('button', 'Edit workplace to your list');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ProfilePageObject, "editHobbyButton", {
        get: function () {
            return common_po_1.commonPageObjects.findElementByText('button', 'Edit hobby to your list');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ProfilePageObject, "deleteConfirmation", {
        get: function () {
            return common_po_1.commonPageObjects.findElementByText('button', 'Yes, Delete');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ProfilePageObject, "schoolCollegeName", {
        get: function () {
            return protractor_1.element(protractor_1.by.id('schoolCollegeName'));
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ProfilePageObject, "major", {
        get: function () {
            return protractor_1.element(protractor_1.by.id('major'));
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ProfilePageObject, "dateFrom", {
        get: function () {
            return protractor_1.element(protractor_1.by.id('date-from1'));
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ProfilePageObject, "startDateLabel", {
        get: function () {
            return protractor_1.element(protractor_1.by.css('[for="timePeriodFrom"]'));
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ProfilePageObject, "dateTo", {
        get: function () {
            return protractor_1.element(protractor_1.by.id('date-to1'));
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ProfilePageObject, "graduatedLabel", {
        get: function () {
            return protractor_1.element(protractor_1.by.css('[for="graduated"]'));
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ProfilePageObject, "cityTown", {
        get: function () {
            return protractor_1.element(protractor_1.by.id('cityTown'));
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ProfilePageObject, "industry", {
        get: function () {
            return protractor_1.element(protractor_1.by.id('industry'));
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ProfilePageObject, "position", {
        get: function () {
            return protractor_1.element(protractor_1.by.id('position'));
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ProfilePageObject, "company", {
        get: function () {
            return protractor_1.element(protractor_1.by.id('company'));
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ProfilePageObject, "addEducationButton", {
        get: function () {
            return common_po_1.commonPageObjects.findElementByText('button', 'Add education to your list');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ProfilePageObject, "addWorkButton", {
        get: function () {
            return common_po_1.commonPageObjects.findElementByText('button', 'Add workplace to your list');
        },
        enumerable: true,
        configurable: true
    });
    ProfilePageObject.blockchainCommunity = function () {
        return __awaiter(this, void 0, void 0, function () {
            var els;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, protractor_1.element.all(protractor_1.by.className('onoffswitch-switch'))];
                    case 1:
                        els = _a.sent();
                        return [2 /*return*/, els[1]];
                }
            });
        });
    };
    return ProfilePageObject;
}());
exports.ProfilePageObject = ProfilePageObject;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJvZmlsZS5wby5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3BhZ2Utb2JqZWN0cy9wYWdlcy90b3Bjb2Rlci9wcm9maWxlL3Byb2ZpbGUucG8udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLHlDQUF5QztBQUN6Qyx1REFBOEQ7QUFDOUQsK0RBQWlFO0FBRWpFO0lBQUE7SUE0UEEsQ0FBQztJQTNQRyxzQkFBVyw4QkFBUzthQUFwQjtZQUNJLE9BQU8sNkJBQWlCLENBQUMsYUFBYSxDQUFDLGdDQUFnQixDQUFDLGlCQUFpQixFQUFFLENBQUMsQ0FBQztRQUNqRixDQUFDOzs7T0FBQTtJQUVELHNCQUFXLDhCQUFTO2FBQXBCO1lBQ0ksT0FBTyxvQkFBTyxDQUFDLGVBQUUsQ0FBQyxFQUFFLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQztRQUN2QyxDQUFDOzs7T0FBQTtJQUVELHNCQUFXLDZCQUFRO2FBQW5CO1lBQ0ksT0FBTyxvQkFBTyxDQUFDLGVBQUUsQ0FBQyxFQUFFLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQztRQUN0QyxDQUFDOzs7T0FBQTtJQUVELHNCQUFXLHdCQUFHO2FBQWQ7WUFDSSxPQUFPLG9CQUFPLENBQUMsZUFBRSxDQUFDLEVBQUUsQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDLENBQUM7UUFDaEQsQ0FBQzs7O09BQUE7SUFFRCxzQkFBVyxnQ0FBVzthQUF0QjtZQUNJLE9BQU8sb0JBQU8sQ0FBQyxlQUFFLENBQUMsU0FBUyxDQUFDLHVCQUF1QixDQUFDLENBQUMsQ0FBQztRQUMxRCxDQUFDOzs7T0FBQTtJQUVELHNCQUFXLDZCQUFRO2FBQW5CO1lBQ0ksT0FBTyxvQkFBTyxDQUFDLGVBQUUsQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQztRQUMzQyxDQUFDOzs7T0FBQTtJQUVELHNCQUFXLDZCQUFRO2FBQW5CO1lBQ0ks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