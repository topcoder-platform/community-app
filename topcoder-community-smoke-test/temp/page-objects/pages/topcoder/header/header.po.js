"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var protractor_1 = require("protractor");
var common_po_1 = require("../../../common/common.po");
var HeaderPageObject = /** @class */ (function () {
    function HeaderPageObject() {
    }
    Object.defineProperty(HeaderPageObject, "banner", {
        get: function () {
            return common_po_1.commonPageObjects.getLinkByAriaLabel('Topcoder Logo link to Topcoder Homepage');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(HeaderPageObject, "allChallengesLink", {
        get: function () {
            return common_po_1.commonPageObjects.getLinkByAriaLabel('All Challenges');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(HeaderPageObject, "competitiveProgrammingLink", {
        get: function () {
            return common_po_1.commonPageObjects.getLinkByAriaLabel('Competitive Programming');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(HeaderPageObject, "competeLink", {
        get: function () {
            return common_po_1.commonPageObjects.findElementByText('span', 'Compete');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(HeaderPageObject, "tracksLink", {
        get: function () {
            return common_po_1.commonPageObjects.findElementByText('a', 'Tracks');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(HeaderPageObject, "communityLink", {
        get: function () {
            return common_po_1.commonPageObjects.findElementByText('span', 'Community');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(HeaderPageObject, "searchIcon", {
        get: function () {
            return protractor_1.element(protractor_1.by.css('[data-menu="search"]'));
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(HeaderPageObject, "searchInput", {
        get: function () {
            return protractor_1.element(protractor_1.by.css('[placeholder="Find members by username or skill"]'));
        },
        enumerable: true,
        configurable: true
    });
    return HeaderPageObject;
}());
exports.HeaderPageObject = HeaderPageObject;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaGVhZGVyLnBvLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vcGFnZS1vYmplY3RzL3BhZ2VzL3RvcGNvZGVyL2hlYWRlci9oZWFkZXIucG8udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSx5Q0FBeUM7QUFDekMsdURBQThEO0FBRTlEO0lBQUE7SUFnQ0EsQ0FBQztJQS9CRyxzQkFBVywwQkFBTTthQUFqQjtZQUNJLE9BQU8sNkJBQWlCLENBQUMsa0JBQWtCLENBQUMseUNBQXlDLENBQUMsQ0FBQztRQUMzRixDQUFDOzs7T0FBQTtJQUVELHNCQUFXLHFDQUFpQjthQUE1QjtZQUNJLE9BQU8sNkJBQWlCLENBQUMsa0JBQWtCLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztRQUNsRSxDQUFDOzs7T0FBQTtJQUVELHNCQUFXLDhDQUEwQjthQUFyQztZQUNJLE9BQU8sNkJBQWlCLENBQUMsa0JBQWtCLENBQUMseUJBQXlCLENBQUMsQ0FBQztRQUMzRSxDQUFDOzs7T0FBQTtJQUVELHNCQUFXLCtCQUFXO2FBQXRCO1lBQ0ksT0FBTyw2QkFBaUIsQ0FBQyxpQkFBaUIsQ0FBQyxNQUFNLEVBQUUsU0FBUyxDQUFDLENBQUM7UUFDbEUsQ0FBQzs7O09BQUE7SUFFRCxzQkFBVyw4QkFBVTthQUFyQjtZQUNJLE9BQU8sNkJBQWlCLENBQUMsaUJBQWlCLENBQUMsR0FBRyxFQUFFLFFBQVEsQ0FBQyxDQUFDO1FBQzlELENBQUM7OztPQUFBO0lBRUQsc0JBQVcsaUNBQWE7YUFBeEI7WUFDSSxPQUFPLDZCQUFpQixDQUFDLGlCQUFpQixDQUFDLE1BQU0sRUFBRSxXQUFXLENBQUMsQ0FBQztRQUNwRSxDQUFDOzs7T0FBQTtJQUVELHNCQUFXLDhCQUFVO2FBQXJCO1lBQ0ksT0FBTyxvQkFBTyxDQUFDLGVBQUUsQ0FBQyxHQUFHLENBQUMsc0JBQXNCLENBQUMsQ0FBQyxDQUFDO1FBQ25ELENBQUM7OztPQUFBO0lBRUQsc0JBQVcsK0JBQVc7YUFBdEI7WUFDSSxPQUFPLG9CQUFPLENBQUMsZUFBRSxDQUFDLEdBQUcsQ0FBQyxtREFBbUQsQ0FBQyxDQUFDLENBQUM7UUFDaEYsQ0FBQzs7O09BQUE7SUFDTCx1QkFBQztBQUFELENBQUMsQUFoQ0QsSUFnQ0M7QUFoQ1ksNENBQWdCIn0=