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
var commonPageObjects = /** @class */ (function () {
    function commonPageObjects() {
    }
    commonPageObjects.getTextFromPage = function (text) {
        var loc = "//*[contains(text(),'" + text + "')]";
        return protractor_1.element(protractor_1.by.xpath(loc));
    };
    commonPageObjects.getTextFromH1 = function (text) {
        var loc = "//h1[contains(text(),'" + text + "')]";
        return protractor_1.element(protractor_1.by.xpath(loc));
        // return element(by.tagName('h1'));
    };
    commonPageObjects.getTextFromH2 = function (text) {
        var loc = "//h2[contains(text(),'" + text + "')]";
        return protractor_1.element(protractor_1.by.xpath(loc));
    };
    /**
     * Get text from H3
     * @param h3
     */
    commonPageObjects.getTextFromH3 = function (text) {
        var loc = "//h3[contains(text(),'" + text + "')]";
        return protractor_1.element(protractor_1.by.xpath(loc));
    };
    /**
     * Get text from paragraph
     * @param text
     */
    commonPageObjects.getTextFromPara = function (text) {
        var loc = "//p[contains(text(),'" + text + "')]";
        return protractor_1.element(protractor_1.by.xpath(loc));
    };
    commonPageObjects.clickOnAnchorText = function (text) {
        var loc = "//a[contains(text(),'" + text + "')]";
        return protractor_1.element(protractor_1.by.xpath(loc));
    };
    commonPageObjects.clickOnLinkText = function (text) {
        var loc = "//a[contains(text(),'" + text + "')]";
        return protractor_1.element(protractor_1.by.xpath(loc));
    };
    commonPageObjects.getHrefTextByText = function (text) {
        var loc = "//a[contains(text(),'" + text + "')]";
        return protractor_1.element(protractor_1.by.xpath(loc)).getAttribute('href');
    };
    commonPageObjects.checkbox = function () {
        var loc = "//input[@type='checkbox']";
        // const loc = "//input[@type='checkbox']/(text(),'" + optionText + "')]";
        return protractor_1.element(protractor_1.by.xpath(loc));
    };
    commonPageObjects.dragSource = function () {
        var loc = "column-a";
        return protractor_1.element(protractor_1.by.id(loc));
    };
    commonPageObjects.dropTarget = function () {
        var loc = "column-b";
        return protractor_1.element(protractor_1.by.id(loc));
    };
    commonPageObjects.droppedElement = function () {
        var loc = "//div[@id='column-b']/header[contains(text(),'A')]";
        return protractor_1.element(protractor_1.by.xpath(loc));
    };
    commonPageObjects.chooseFile = function () {
        var loc = "input[type='file']";
        return protractor_1.element(protractor_1.by.css(loc));
    };
    commonPageObjects.uploadButton = function () {
        var loc = "file-submit";
        return protractor_1.element(protractor_1.by.id(loc));
    };
    commonPageObjects.uploadedFile = function (fileName) {
        var loc = "//div[@id='uploaded-files' and contains(text(),'" + fileName + "')]";
        console.log('The loc is: ' + loc);
        return protractor_1.browser.driver.findElement(protractor_1.by.xpath(loc));
    };
    commonPageObjects.findElementByText = function (elementType, text) {
        return protractor_1.element(protractor_1.by.xpath('//' + elementType + '[contains(text(), "' + text + '")]'));
    };
    commonPageObjects.getLinkByAriaLabel = function (label) {
        return protractor_1.element(protractor_1.by.css('[aria-label="' + label + '"]'));
    };
    commonPageObjects.getAllLinksByAriaLabel = function (label) {
        return __awaiter(this, void 0, void 0, function () {
            var els;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, protractor_1.element.all(protractor_1.by.css('[aria-label="' + label + '"]'))];
                    case 1:
                        els = _a.sent();
                        return [2 /*return*/, els];
                }
            });
        });
    };
    return commonPageObjects;
}());
exports.commonPageObjects = commonPageObjects;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29tbW9uLnBvLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vcGFnZS1vYmplY3RzL2NvbW1vbi9jb21tb24ucG8udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLHlDQUFrRDtBQUVsRDtJQUFBO0lBa0dBLENBQUM7SUFoR1UsaUNBQWUsR0FBdEIsVUFBdUIsSUFBWTtRQUMvQixJQUFNLEdBQUcsR0FBRyx1QkFBdUIsR0FBRyxJQUFJLEdBQUcsS0FBSyxDQUFDO1FBQ25ELE9BQU8sb0JBQU8sQ0FBQyxlQUFFLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7SUFDbEMsQ0FBQztJQUVNLCtCQUFhLEdBQXBCLFVBQXFCLElBQVk7UUFDN0IsSUFBTSxHQUFHLEdBQUcsd0JBQXdCLEdBQUcsSUFBSSxHQUFHLEtBQUssQ0FBQztRQUNwRCxPQUFPLG9CQUFPLENBQUMsZUFBRSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO1FBQzlCLG9DQUFvQztJQUN4QyxDQUFDO0lBRU0sK0JBQWEsR0FBcEIsVUFBcUIsSUFBWTtRQUM3QixJQUFNLEdBQUcsR0FBRyx3QkFBd0IsR0FBRyxJQUFJLEdBQUcsS0FBSyxDQUFDO1FBQ3BELE9BQU8sb0JBQU8sQ0FBQyxlQUFFLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7SUFDbEMsQ0FBQztJQUVEOzs7T0FHRztJQUNJLCtCQUFhLEdBQXBCLFVBQXFCLElBQVk7UUFDN0IsSUFBTSxHQUFHLEdBQUcsd0JBQXdCLEdBQUcsSUFBSSxHQUFHLEtBQUssQ0FBQztRQUNwRCxPQUFPLG9CQUFPLENBQUMsZUFBRSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO0lBQ2xDLENBQUM7SUFFRDs7O09BR0c7SUFDSSxpQ0FBZSxHQUF0QixVQUF1QixJQUFZO1FBQy9CLElBQU0sR0FBRyxH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