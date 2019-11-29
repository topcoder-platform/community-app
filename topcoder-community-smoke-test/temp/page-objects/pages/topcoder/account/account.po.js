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
var AccountPageObject = /** @class */ (function () {
    function AccountPageObject() {
    }
    Object.defineProperty(AccountPageObject, "consentLabel", {
        get: function () {
            return protractor_1.element(protractor_1.by.css('label[for="pre-onoffswitch-user-consent"]'));
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AccountPageObject, "successMsg", {
        get: function () {
            return common_po_1.commonPageObjects.findElementByText('div', 'Your information has been updated');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AccountPageObject, "externalLinkInput", {
        get: function () {
            return protractor_1.element(protractor_1.by.name('addWebLinkFrm'))
                .element(protractor_1.by.id('web-link-input'));
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AccountPageObject, "externalLinkAddButton", {
        get: function () {
            return protractor_1.element(protractor_1.by.className('button-add-link'));
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AccountPageObject, "externalLinkSuccessMsg", {
        get: function () {
            return common_po_1.commonPageObjects.findElementByText('div', 'Your link has been added. Data from your link will be visible on your profile shortly.');
        },
        enumerable: true,
        configurable: true
    });
    AccountPageObject.externalLinkDeleteButton = function (link) {
        return __awaiter(this, void 0, void 0, function () {
            var linkEl, el;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        linkEl = common_po_1.commonPageObjects.findElementByText('a', link);
                        return [4 /*yield*/, linkEl.element(protractor_1.by.xpath('..'))
                                .element(protractor_1.by.xpath('..'))
                                .element(protractor_1.by.xpath('..'))
                                .element(protractor_1.by.css('[role=button]'))];
                    case 1:
                        el = _a.sent();
                        return [2 /*return*/, el];
                }
            });
        });
    };
    Object.defineProperty(AccountPageObject, "deleteConfirmation", {
        get: function () {
            return common_po_1.commonPageObjects.findElementByText('button', 'Yes, Delete Link');
        },
        enumerable: true,
        configurable: true
    });
    AccountPageObject.getExternalLinkDeletionMsg = function () {
        return common_po_1.commonPageObjects.findElementByText('div', 'was removed.');
    };
    return AccountPageObject;
}());
exports.AccountPageObject = AccountPageObject;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWNjb3VudC5wby5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3BhZ2Utb2JqZWN0cy9wYWdlcy90b3Bjb2Rlci9hY2NvdW50L2FjY291bnQucG8udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLHlDQUF5QztBQUN6Qyx1REFBOEQ7QUFFOUQ7SUFBQTtJQXNDQSxDQUFDO0lBckNHLHNCQUFXLGlDQUFZO2FBQXZCO1lBQ0ksT0FBTyxvQkFBTyxDQUFDLGVBQUUsQ0FBQyxHQUFHLENBQUMsMkNBQTJDLENBQUMsQ0FBQyxDQUFBO1FBQ3ZFLENBQUM7OztPQUFBO0lBRUQsc0JBQVcsK0JBQVU7YUFBckI7WUFDSSxPQUFPLDZCQUFpQixDQUFDLGlCQUFpQixDQUFDLEtBQUssRUFBRSxtQ0FBbUMsQ0FBQyxDQUFDO1FBQzNGLENBQUM7OztPQUFBO0lBRUQsc0JBQVcsc0NBQWlCO2FBQTVCO1lBQ0ksT0FBTyxvQkFBTyxDQUFDLGVBQUUsQ0FBQyxJQUFJLENBQUMsZUFBZSxDQUFDLENBQUM7aUJBQ3ZDLE9BQU8sQ0FBQyxlQUFFLENBQUMsRUFBRSxDQUFDLGdCQUFnQixDQUFDLENBQUMsQ0FBQztRQUN0QyxDQUFDOzs7T0FBQTtJQUVELHNCQUFXLDBDQUFxQjthQUFoQztZQUNJLE9BQU8sb0JBQU8sQ0FBQyxlQUFFLENBQUMsU0FBUyxDQUFDLGlCQUFpQixDQUFDLENBQUMsQ0FBQTtRQUNuRCxDQUFDOzs7T0FBQTtJQUVELHNCQUFXLDJDQUFzQjthQUFqQztZQUNJLE9BQU8sNkJBQWlCLENBQUMsaUJBQWlCLENBQUMsS0FBSyxFQUFFLHdGQUF3RixDQUFDLENBQUM7UUFDaEosQ0FBQzs7O09BQUE7SUFFWSwwQ0FBd0IsR0FBckMsVUFBc0MsSUFBWTs7Ozs7O3dCQUN4QyxNQUFNLEdBQUcsNkJBQWlCLENBQUMsaUJBQWlCLENBQUMsR0FBRyxFQUFFLElBQUksQ0FBQyxDQUFDO3dCQUNuRCxxQkFBTSxNQUFNLENBQUMsT0FBTyxDQUFDLGVBQUUsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUM7aUNBQzlDLE9BQU8sQ0FBQyxlQUFFLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDO2lDQUN2QixPQUFPLENBQUMsZUFBRSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQztpQ0FDdkIsT0FBTyxDQUFDLGVBQUUsQ0FBQyxHQUFHLENBQUMsZUFBZSxDQUFDLENBQUMsRUFBQTs7d0JBSDNCLEVBQUUsR0FBRyxTQUdzQjt3QkFDakMsc0JBQU8sRUFBRSxFQUFDOzs7O0tBQ2I7SUFFRCxzQkFBVyx1Q0FBa0I7YUFBN0I7WUFDSSxPQUFPLDZCQUFpQixDQUFDLGlCQUFpQixDQUFDLFFBQVEsRUFBRSxrQkFBa0IsQ0FBQyxDQUFDO1FBQzdFLENBQUM7OztPQUFBO0lBRU0sNENBQTBCLEdBQWpDO1FBQ0ksT0FBTyw2QkFBaUIsQ0FBQyxpQkFBaUIsQ0FBQyxLQUFLLEVBQUUsY0FBYyxDQUFDLENBQUM7SUFDdEUsQ0FBQztJQUNMLHdCQUFDO0FBQUQsQ0FBQyxBQXRDRCxJQXNDQztBQXRDWSw4Q0FBaUIifQ==