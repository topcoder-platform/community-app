"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var config = require("../../../../config.json");
var DashboardPageConstants = /** @class */ (function () {
    function DashboardPageConstants() {
    }
    Object.defineProperty(DashboardPageConstants, "url", {
        get: function () {
            return 'https://www.' + config.baseUrl + '/my-dashboard';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DashboardPageConstants, "content", {
        get: function () {
            return {
                loginRedirectionUrl: 'https://accounts.' + config.baseUrl + '/member?retUrl=https:%2F%2Fwww.' + config.baseUrl + '%2Fmy-dashboard&utm_source=community-app-main'
            };
        },
        enumerable: true,
        configurable: true
    });
    return DashboardPageConstants;
}());
exports.DashboardPageConstants = DashboardPageConstants;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGFzaGJvYXJkLmNvbnN0YW50cy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3BhZ2Utb2JqZWN0cy9wYWdlcy90b3Bjb2Rlci9kYXNoYm9hcmQvZGFzaGJvYXJkLmNvbnN0YW50cy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLGdEQUFrRDtBQUVsRDtJQUFBO0lBVUEsQ0FBQztJQVRHLHNCQUFXLDZCQUFHO2FBQWQ7WUFDSSxPQUFPLGNBQWMsR0FBRyxNQUFNLENBQUMsT0FBTyxHQUFHLGVBQWUsQ0FBQztRQUM3RCxDQUFDOzs7T0FBQTtJQUVELHNCQUFXLGlDQUFPO2FBQWxCO1lBQ0ksT0FBTztnQkFDSCxtQkFBbUIsRUFBRSxtQkFBbUIsR0FBRyxNQUFNLENBQUMsT0FBTyxHQUFHLGlDQUFpQyxHQUFHLE1BQU0sQ0FBQyxPQUFPLEdBQUcsK0NBQStDO2FBQ25LLENBQUE7UUFDTCxDQUFDOzs7T0FBQTtJQUNMLDZCQUFDO0FBQUQsQ0FBQyxBQVZELElBVUM7QUFWWSx3REFBc0IifQ==