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
var topcoder_ui_testing_lib_1 = require("topcoder-ui-testing-lib");
var appconfig = require("../../../../app-config.json");
var logger_1 = require("../../../../logger/logger");
var tools_constants_1 = require("./tools.constants");
var ToolsPage = /** @class */ (function () {
    function ToolsPage() {
    }
    /**
     * Gets the Tools page
     */
    ToolsPage.prototype.get = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, protractor_1.browser.get(tools_constants_1.ToolsPageConstants.url)];
                    case 1:
                        _a.sent();
                        logger_1.logger.info("User navigated to Tools Page");
                        return [2 /*return*/];
                }
            });
        });
    };
    Object.defineProperty(ToolsPage.prototype, "subscriptionName", {
        /**
         * Gets the subscription Name textbox
         */
        get: function () {
            return protractor_1.element(protractor_1.by.id("name"));
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ToolsPage.prototype, "successMsg", {
        /**
         * Gets the success message
         */
        get: function () {
            return topcoder_ui_testing_lib_1.ElementHelper.getTagElementContainingText("div", tools_constants_1.ToolsPageConstants.Messages.SuccessMessage);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ToolsPage.prototype, "deleteConfirmation", {
        /**
         * Gets the delete confirmation button
         */
        get: function () {
            return topcoder_ui_testing_lib_1.ElementHelper.getTagElementContainingText("button", "Yes, Delete");
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ToolsPage.prototype, "deleteIcon", {
        /**
         * Gets the delete icon
         */
        get: function () {
            return protractor_1.element(protractor_1.by.css('img[alt="delete-icon"]'));
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Switches tab to given tab name
     * @param {String} tagName
     */
    ToolsPage.prototype.switchTab = function (tabName) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, topcoder_ui_testing_lib_1.CommonHelper.switchTabByClickingOnTagWithText("span", tabName)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Deletes all records on the tools page
     */
    ToolsPage.prototype.deleteAll = function () {
        return __awaiter(this, void 0, void 0, function () {
            var until, delIcons, _i, delIcons_1, _a, successEl;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        until = protractor_1.protractor.ExpectedConditions;
                        return [4 /*yield*/, protractor_1.browser.wait(until.visibilityOf(this.subscriptionName))];
                    case 1:
                        _b.sent();
                        return [4 /*yield*/, this.getDeleteIcons()];
                    case 2:
                        delIcons = _b.sent();
                        _i = 0, delIcons_1 = delIcons;
                        _b.label = 3;
                    case 3:
                        if (!(_i < delIcons_1.length)) return [3 /*break*/, 9];
                        _a = delIcons_1[_i];
                        return [4 /*yield*/, this.deleteIcon.click()];
                    case 4:
                        _b.sent();
                        return [4 /*yield*/, this.deleteConfirmation.click()];
                    case 5:
                        _b.sent();
                        successEl = this.successMsg;
                        return [4 /*yield*/, protractor_1.browser.wait(until.visibilityOf(successEl), appconfig.Timeout.FieldVisibility, "Success message did not display")];
                    case 6:
                        _b.sent();
                        return [4 /*yield*/, protractor_1.browser.wait(until.invisibilityOf(successEl))];
                    case 7:
                        _b.sent();
                        _b.label = 8;
                    case 8:
                        _i++;
                        return [3 /*break*/, 3];
                    case 9: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Adds a subscription with the provided name
     * @param {String} name
     */
    ToolsPage.prototype.addSubscription = function (name) {
        return __awaiter(this, void 0, void 0, function () {
            var until, successEl;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        until = protractor_1.protractor.ExpectedConditions;
                        return [4 /*yield*/, this.setSubsription(name)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.getAddButton("subscription").click()];
                    case 2:
                        _a.sent();
                        successEl = this.successMsg;
                        return [4 /*yield*/, protractor_1.browser.wait(until.visibilityOf(successEl), appconfig.Timeout.FieldVisibility, "Success message did not display")];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, protractor_1.browser.wait(until.invisibilityOf(successEl))];
                    case 4:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Edits the given subscription name with the new provided name
     * @param {String} name
     * @param {String} newname
     * The edit functionality must be upadted to eidt by the provided name. At present it edits the first record
     */
    ToolsPage.prototype.editSubscription = function (name, newname) {
        return __awaiter(this, void 0, void 0, function () {
            var until, successEl;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        until = protractor_1.protractor.ExpectedConditions;
                        return [4 /*yield*/, this.getEditIconbyName(name).click()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.setSubsription(newname)];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, this.getEditButton("subscription").click()];
                    case 3:
                        _a.sent();
                        successEl = this.successMsg;
                        return [4 /*yield*/, protractor_1.browser.wait(until.visibilityOf(successEl), appconfig.Timeout.FieldVisibility, "Success message did not display")];
                    case 4:
                        _a.sent();
                        return [4 /*yield*/, protractor_1.browser.wait(until.invisibilityOf(successEl))];
                    case 5:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Deletes the given subscription
     * @param {String} name
     * The delete functionality must be upadted to delete by the provided name. At present it deletes the first record
     */
    ToolsPage.prototype.deleteSubscription = function (name) {
        return __awaiter(this, void 0, void 0, function () {
            var until, successEl;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        until = protractor_1.protractor.ExpectedConditions;
                        return [4 /*yield*/, this.getDeleteIconbyName(name).click()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.deleteConfirmation.click()];
                    case 2:
                        _a.sent();
                        successEl = this.successMsg;
                        return [4 /*yield*/, protractor_1.browser.wait(until.visibilityOf(successEl), appconfig.Timeout.FieldVisibility, "Success message did not display")];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, protractor_1.browser.wait(until.invisibilityOf(successEl))];
                    case 4:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Fills the subscription name textbox with given name
     * @param {String} name
     * The delete functionality must be upadted to delete by the provided name. At present it deletes the first record
     */
    ToolsPage.prototype.setSubsription = function (name) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.subscriptionName.clear()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.subscriptionName.sendKeys(name)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Gets all delete icons in the page
     */
    ToolsPage.prototype.getDeleteIcons = function () {
        return protractor_1.element.all(protractor_1.by.css('img[alt="delete-icon"]'));
    };
    /**
     * Gets the add button for the given type
     * @param {String} type
     * The delete functionality must be upadted to delete by the provided name. At present it deletes the first record
     */
    ToolsPage.prototype.getAddButton = function (type) {
        return topcoder_ui_testing_lib_1.ElementHelper.getTagElementContainingText("button", "Add " + type + " to your list");
    };
    /**
     * Gets the edit button for the given type
     * @param {String} type
     * The delete functionality must be upadted to delete by the provided name. At present it deletes the first record
     */
    ToolsPage.prototype.getEditButton = function (type) {
        return topcoder_ui_testing_lib_1.ElementHelper.getTagElementContainingText("button", "Edit " + type + " to your list");
    };
    /**
     * Gets the edit icon for the given name
     * @param {String} name
     */
    ToolsPage.prototype.getEditIconbyName = function (name) {
        return protractor_1.element(protractor_1.by.xpath("//*[text()='" + name + "']//following::img[@alt='edit-icon']"));
    };
    /**
     * Gets the delete icon for the given name
     * @param {String} name
     */
    ToolsPage.prototype.getDeleteIconbyName = function (name) {
        return protractor_1.element(protractor_1.by.xpath("//*[text()='" + name + "']//following::img[@alt='delete-icon']"));
    };
    return ToolsPage;
}());
exports.ToolsPage = ToolsPage;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidG9vbHMucG8uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9wYWdlLW9iamVjdHMvcGFnZXMvdG9wY29kZXIvdG9vbHMvdG9vbHMucG8udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLHlDQUE4RDtBQUM5RCxtRUFBc0U7QUFDdEUsdURBQXlEO0FBQ3pELG9EQUFtRDtBQUNuRCxxREFBdUQ7QUFFdkQ7SUFBQTtJQTBMQSxDQUFDO0lBekxDOztPQUVHO0lBRVUsdUJBQUcsR0FBaEI7Ozs7NEJBQ0UscUJBQU0sb0JBQU8sQ0FBQyxHQUFHLENBQUMsb0NBQWtCLENBQUMsR0FBRyxDQUFDLEVBQUE7O3dCQUF6QyxTQUF5QyxDQUFDO3dCQUMxQyxlQUFNLENBQUMsSUFBSSxDQUFDLDhCQUE4QixDQUFDLENBQUM7Ozs7O0tBQzdDO0lBTUQsc0JBQVksdUNBQWdCO1FBSjVCOztXQUVHO2FBRUg7WUFDRSxPQUFPLG9CQUFPLENBQUMsZUFBRSxDQUFDLEVBQUUsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO1FBQ2hDLENBQUM7OztPQUFBO0lBTUQsc0JBQVcsaUNBQVU7UUFKckI7O1dBRUc7YUFFSDtZQUNFLE9BQU8sdUNBQWEsQ0FBQywyQkFBMkIsQ0FDOUMsS0FBSyxFQUNMLG9DQUFrQixDQUFDLFFBQVEsQ0FBQyxjQUFjLENBQzNDLENBQUM7UUFDSixDQUFDOzs7T0FBQTtJQUtELHNCQUFZLHlDQUFrQjtRQUg5Qjs7V0FFRzthQUNIO1lBQ0UsT0FBTyx1Q0FBYSxDQUFDLDJCQUEyQixDQUFDLFFBQVEsRUFBRSxhQUFhLENBQUMsQ0FBQztRQUM1RSxDQUFDOzs7T0FBQTtJQUtELHNCQUFZLGlDQUFVO1FBSHRCOztXQUVHO2FBQ0g7WUFDRSxPQUFPLG9CQUFPLENBQUMsZUFBRSxDQUFDLEdBQUcsQ0FBQyx3QkFBd0IsQ0FBQyxDQUFDLENBQUM7UUFDbkQsQ0FB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