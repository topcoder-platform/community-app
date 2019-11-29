"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var config = require("../../../../config.json");
var PreferencesPageConstants = /** @class */ (function () {
    function PreferencesPageConstants() {
    }
    Object.defineProperty(PreferencesPageConstants, "url", {
        get: function () {
            return config.preferences.testingUrl;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PreferencesPageConstants, "content", {
        get: function () {
            return {
                forumUrl: config.preferences.forumUrl,
                paymentUrl: config.preferences.paymentUrl,
                invitationLetterUrl: config.preferences.invitationLetterUrl,
                referralsUrl: config.preferences.referralsUrl
            };
        },
        enumerable: true,
        configurable: true
    });
    return PreferencesPageConstants;
}());
exports.PreferencesPageConstants = PreferencesPageConstants;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJlZmVyZW5jZXMuY29uc3RhbnRzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vcGFnZS1vYmplY3RzL3BhZ2VzL3RvcGNvZGVyL3ByZWZlcmVuY2VzL3ByZWZlcmVuY2VzLmNvbnN0YW50cy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLGdEQUFrRDtBQUVsRDtJQUFBO0lBYUEsQ0FBQztJQVpHLHNCQUFXLCtCQUFHO2FBQWQ7WUFDSSxPQUFPLE1BQU0sQ0FBQyxXQUFXLENBQUMsVUFBVSxDQUFDO1FBQ3pDLENBQUM7OztPQUFBO0lBRUQsc0JBQVcsbUNBQU87YUFBbEI7WUFDSSxPQUFPO2dCQUNILFFBQVEsRUFBRSxNQUFNLENBQUMsV0FBVyxDQUFDLFFBQVE7Z0JBQ3JDLFVBQVUsRUFBRSxNQUFNLENBQUMsV0FBVyxDQUFDLFVBQVU7Z0JBQ3pDLG1CQUFtQixFQUFFLE1BQU0sQ0FBQyxXQUFXLENBQUMsbUJBQW1CO2dCQUMzRCxZQUFZLEVBQUUsTUFBTSxDQUFDLFdBQVcsQ0FBQyxZQUFZO2FBQ2hELENBQUE7UUFDTCxDQUFDOzs7T0FBQTtJQUNMLCtCQUFDO0FBQUQsQ0FBQyxBQWJELElBYUM7QUFiWSw0REFBd0IifQ==