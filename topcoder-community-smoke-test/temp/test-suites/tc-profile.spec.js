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
var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
var protractor_1 = require("protractor");
var login_helper_1 = require("../page-objects/pages/topcoder/login/login.helper");
var profile_helper_1 = require("../page-objects/pages/topcoder/profile/profile.helper");
var common_helper_1 = require("../page-objects/common/common.helper");
var header_helper_1 = require("../page-objects/pages/topcoder/header/header.helper");
var home_helper_1 = require("../page-objects/pages/topcoder/home/home.helper");
var challenge_listing_helper_1 = require("../page-objects/pages/topcoder/challenge-listing/challenge-listing.helper");
describe('Topcoder Profile Page Tests: ', function () {
    beforeAll(function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, protractor_1.browser.driver.manage().window().maximize()];
                case 1:
                    _a.sent();
                    protractor_1.browser.ignoreSynchronization = false;
                    return [4 /*yield*/, login_helper_1.LoginPageHelper.get()];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, login_helper_1.LoginPageHelper.waitForLoginForm()];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, login_helper_1.LoginPageHelper.fillLoginForm(false)];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, login_helper_1.LoginPageHelper.waitForLoginSuccessWithoutLoggingOut()];
                case 5:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    afterAll(function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, challenge_listing_helper_1.ChallengeListingPageHelper.get()];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, header_helper_1.HeaderHelper.clickOnLogoutLink()];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, home_helper_1.HomePageHelper.verifyHomePage()];
                case 3:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('should verify whether the current user can update basic information.', function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, profile_helper_1.ProfilePageHelper.get()];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, profile_helper_1.ProfilePageHelper.fillPersonalDetails()];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, profile_helper_1.ProfilePageHelper.fillAboutYou()];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, profile_helper_1.ProfilePageHelper.fillTrackDetails()];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, profile_helper_1.ProfilePageHelper.saveChanges()];
                case 5:
                    _a.sent();
                    return [4 /*yield*/, profile_helper_1.ProfilePageHelper.get()];
                case 6:
                    _a.sent();
                    return [4 /*yield*/, profile_helper_1.ProfilePageHelper.verifyPersonalDetails()];
                case 7:
                    _a.sent();
                    return [4 /*yield*/, profile_helper_1.ProfilePageHelper.verifyAboutYou()];
                case 8:
                    _a.sent();
                    return [4 /*yield*/, profile_helper_1.ProfilePageHelper.verifyTrackDetails()];
                case 9:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('should verify User can Add/Update/Delete language', function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, profile_helper_1.ProfilePageHelper.get()];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, common_helper_1.commonPageHelper.switchTab('language', 'Language')];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, profile_helper_1.ProfilePageHelper.addLanguage()];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, profile_helper_1.ProfilePageHelper.editLanguage()];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, profile_helper_1.ProfilePageHelper.deleteLanguage()];
                case 5:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('should verify User can Add/Update/Delete Education', function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, profile_helper_1.ProfilePageHelper.get()];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, common_helper_1.commonPageHelper.switchTab('education', 'Education')];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, profile_helper_1.ProfilePageHelper.addEducation()];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, profile_helper_1.ProfilePageHelper.editEducation()];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, profile_helper_1.ProfilePageHelper.deleteEducation()];
                case 5:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('should verify User can Add/Update/Delete work ', function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, profile_helper_1.ProfilePageHelper.get()];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, common_helper_1.commonPageHelper.switchTab('work', 'Work')];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, profile_helper_1.ProfilePageHelper.addWork()];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, profile_helper_1.ProfilePageHelper.editWork()];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, profile_helper_1.ProfilePageHelper.deleteWork()];
                case 5:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('should verify User can Add/Delete skill.', function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, profile_helper_1.ProfilePageHelper.get()];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, common_helper_1.commonPageHelper.switchTab('skills', 'Skill')];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, profile_helper_1.ProfilePageHelper.addSkill()];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, profile_helper_1.ProfilePageHelper.deleteSkill()];
                case 4:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('should verify User can Add/Update/Delete the hobby.', function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, profile_helper_1.ProfilePageHelper.get()];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, common_helper_1.commonPageHelper.switchTab('hobbies', 'Hobby')];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, profile_helper_1.ProfilePageHelper.addHobby()];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, profile_helper_1.ProfilePageHelper.editHobby()];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, profile_helper_1.ProfilePageHelper.deleteHobby()];
                case 5:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('should verify User can update the community.', function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, profile_helper_1.ProfilePageHelper.get()];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, common_helper_1.commonPageHelper.switchTab('communities', 'Community')];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, profile_helper_1.ProfilePageHelper.verifyBlockchainCommunity()];
                case 3:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGMtcHJvZmlsZS5zcGVjLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vdGVzdC1zdWl0ZXMvdGMtcHJvZmlsZS5zcGVjLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLGlCQWlGRzs7QUFqRkgseUNBQXFDO0FBQ3JDLGtGQUFvRjtBQUNwRix3RkFBMEY7QUFDMUYsc0VBQXdFO0FBQ3hFLHFGQUFtRjtBQUNuRiwrRUFBaUY7QUFDakYsc0hBQXVIO0FBRXZILFFBQVEsQ0FBQywrQkFBK0IsRUFBRTtJQUN0QyxTQUFTLENBQUM7Ozt3QkFDTixxQkFBTSxvQkFBTyxDQUFDLE1BQU0sQ0FBQyxNQUFNLEVBQUUsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxRQUFRLEVBQUUsRUFBQTs7b0JBQWpELFNBQWlELENBQUM7b0JBQ2xELG9CQUFPLENBQUMscUJBQXFCLEdBQUcsS0FBSyxDQUFDO29CQUV0QyxxQkFBTSw4QkFBZSxDQUFDLEdBQUcsRUFBRSxFQUFBOztvQkFBM0IsU0FBMkIsQ0FBQztvQkFDNUIscUJBQU0sOEJBQWUsQ0FBQyxnQkFBZ0IsRUFBRSxFQUFBOztvQkFBeEMsU0FBd0MsQ0FBQztvQkFDekMscUJBQU0sOEJBQWUsQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLEVBQUE7O29CQUExQyxTQUEwQyxDQUFDO29CQUMzQyxxQkFBTSw4QkFBZSxDQUFDLG9DQUFvQyxFQUFFLEVBQUE7O29CQUE1RCxTQUE0RCxDQUFDOzs7O1NBQ2hFLENBQUMsQ0FBQztJQUVILFFBQVEsQ0FBQzs7O3dCQUNMLHFCQUFNLHFEQUEwQixDQUFDLEdBQUcsRUFBRSxFQUFBOztvQkFBdEMsU0FBc0MsQ0FBQztvQkFDdkMscUJBQU0sNEJBQVksQ0FBQyxpQkFBaUIsRUFBRSxFQUFBOztvQkFBdEMsU0FBc0MsQ0FBQztvQkFDdkMscUJBQU0sNEJBQWMsQ0FBQyxjQUFjLEVBQUUsRUFBQTs7b0JBQXJD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