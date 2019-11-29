"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var protractor_1 = require("protractor");
var common_po_1 = require("../../../common/common.po");
var ToolsPageObject = /** @class */ (function () {
    function ToolsPageObject() {
    }
    Object.defineProperty(ToolsPageObject, "selectOptions", {
        get: function () {
            return protractor_1.element.all(protractor_1.by.className('Select-option'));
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ToolsPageObject, "deviceTypeInput", {
        get: function () {
            return protractor_1.element(protractor_1.by.css('[aria-activedescendant="react-select-2--value"]'));
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ToolsPageObject, "softwareInput", {
        get: function () {
            return protractor_1.element(protractor_1.by.css('[aria-activedescendant="react-select-6--value"]'));
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ToolsPageObject, "serviceProviderInput", {
        get: function () {
            return protractor_1.element(protractor_1.by.css('[aria-activedescendant="react-select-6--value"]'));
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ToolsPageObject, "manufacturer", {
        get: function () {
            return protractor_1.element(protractor_1.by.id('manufacturer'));
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ToolsPageObject, "model", {
        get: function () {
            return protractor_1.element(protractor_1.by.id('model'));
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ToolsPageObject, "os", {
        get: function () {
            return protractor_1.element(protractor_1.by.id('operating-system'));
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ToolsPageObject, "osVersion", {
        get: function () {
            return protractor_1.element(protractor_1.by.id('os-version'));
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ToolsPageObject, "osLang", {
        get: function () {
            return protractor_1.element(protractor_1.by.id('os-language'));
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ToolsPageObject, "softwareName", {
        get: function () {
            return protractor_1.element(protractor_1.by.id('name'));
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ToolsPageObject, "serviceProviderName", {
        get: function () {
            return protractor_1.element(protractor_1.by.id('name'));
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ToolsPageObject, "subscriptionName", {
        get: function () {
            return protractor_1.element(protractor_1.by.id('name'));
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ToolsPageObject, "successMsg", {
        get: function () {
            return common_po_1.commonPageObjects.findElementByText('div', 'Your information has been updated');
        },
        enumerable: true,
        configurable: true
    });
    ToolsPageObject.getEdit = function (name) {
        return common_po_1.commonPageObjects.findElementByText('div', name)
            .element(protractor_1.by.xpath('..'))
            .element(protractor_1.by.xpath('..'))
            .element(protractor_1.by.xpath('..'))
            .element(protractor_1.by.xpath('//p[contains(text(), "Edit")]'));
    };
    ToolsPageObject.getDelete = function (name) {
        return common_po_1.commonPageObjects.findElementByText('div', name)
            .element(protractor_1.by.xpath('..'))
            .element(protractor_1.by.xpath('..'))
            .element(protractor_1.by.xpath('..'))
            .element(protractor_1.by.xpath('//p[contains(text(), "Delete")]'));
    };
    Object.defineProperty(ToolsPageObject, "deleteConfirmation", {
        get: function () {
            return common_po_1.commonPageObjects.findElementByText('button', 'Yes, Delete');
        },
        enumerable: true,
        configurable: true
    });
    ToolsPageObject.getAddButton = function (type) {
        return common_po_1.commonPageObjects.findElementByText('button', 'Add ' + type + ' to your list');
    };
    ToolsPageObject.getEditButton = function (type) {
        return common_po_1.commonPageObjects.findElementByText('button', 'Edit ' + type + ' to your list');
    };
    return ToolsPageObject;
}());
exports.ToolsPageObject = ToolsPageObject;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidG9vbHMucG8uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9wYWdlLW9iamVjdHMvcGFnZXMvdG9wY29kZXIvdG9vbHMvdG9vbHMucG8udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSx5Q0FBeUM7QUFDekMsdURBQThEO0FBRTlEO0lBQUE7SUFnRkEsQ0FBQztJQS9FRyxzQkFBVyxnQ0FBYTthQUF4QjtZQUNJLE9BQU8sb0JBQU8sQ0FBQyxHQUFHLENBQUMsZUFBRSxDQUFDLFNBQVMsQ0FBQyxlQUFlLENBQUMsQ0FBQyxDQUFDO1FBQ3RELENBQUM7OztPQUFBO0lBRUQsc0JBQVcsa0NBQWU7YUFBMUI7WUFDSSxPQUFPLG9CQUFPLENBQUMsZUFBRSxDQUFDLEdBQUcsQ0FBQyxpREFBaUQsQ0FBQyxDQUFDLENBQUM7UUFDOUUsQ0FBQzs7O09BQUE7SUFFRCxzQkFBVyxnQ0FBYTthQUF4QjtZQUNJLE9BQU8sb0JBQU8sQ0FBQyxlQUFFLENBQUMsR0FBRyxDQUFDLGlEQUFpRCxDQUFDLENBQUMsQ0FBQztRQUM5RSxDQUFDOzs7T0FBQTtJQUVELHNCQUFXLHVDQUFvQjthQUEvQjtZQUNJLE9BQU8sb0JBQU8sQ0FBQyxlQUFFLENBQUMsR0FBRyxDQUFDLGlEQUFpRCxDQUFDLENBQUMsQ0FBQztRQUM5RSxDQUFDOzs7T0FBQTtJQUVELHNCQUFXLCtCQUFZO2FBQXZCO1lBQ0ksT0FBTyxvQkFBTyxDQUFDLGVBQUUsQ0FBQyxFQUFFLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQztRQUMxQyxDQUFDOzs7T0FBQTtJQUVELHNCQUFXLHdCQUFLO2FBQWhCO1lBQ0ksT0FBTyxvQkFBTyxDQUFDLGVBQUUsQ0FBQyxFQUFFLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztRQUNuQyxDQUFDOzs7T0FBQTtJQUVELHNCQUFXLHFCQUFFO2FBQWI7WUFDSSxPQUFPLG9CQUFPLENBQUMsZUFBRSxDQUFDLEVBQUUsQ0FBQyxrQkFBa0IsQ0FB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