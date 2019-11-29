"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var config = require("../../../../config.json");
var ForumPageConstants = /** @class */ (function () {
    function ForumPageConstants() {
    }
    Object.defineProperty(ForumPageConstants, "url", {
        get: function () {
            return 'https://apps.' + config.baseUrl + '/forums';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ForumPageConstants, "content", {
        get: function () {
            return {
                challengeForumUrl: 'https://apps.' + config.baseUrl + '/forums/?module=Category&categoryID=82117'
            };
        },
        enumerable: true,
        configurable: true
    });
    return ForumPageConstants;
}());
exports.ForumPageConstants = ForumPageConstants;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZm9ydW0uY29uc3RhbnRzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vcGFnZS1vYmplY3RzL3BhZ2VzL3RvcGNvZGVyL2ZvcnVtL2ZvcnVtLmNvbnN0YW50cy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLGdEQUFrRDtBQUVsRDtJQUFBO0lBVUEsQ0FBQztJQVRHLHNCQUFXLHlCQUFHO2FBQWQ7WUFDSSxPQUFPLGVBQWUsR0FBRyxNQUFNLENBQUMsT0FBTyxHQUFHLFNBQVMsQ0FBQztRQUN4RCxDQUFDOzs7T0FBQTtJQUVELHNCQUFXLDZCQUFPO2FBQWxCO1lBQ0ksT0FBTztnQkFDSCxpQkFBaUIsRUFBRSxlQUFlLEdBQUcsTUFBTSxDQUFDLE9BQU8sR0FBRywyQ0FBMkM7YUFDcEcsQ0FBQTtRQUNMLENBQUM7OztPQUFBO0lBQ0wseUJBQUM7QUFBRCxDQUFDLEFBVkQsSUFVQztBQVZZLGdEQUFrQiJ9