"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var config = require("../../../../config.json");
var common_helper_js_1 = require("../../../common/common.helper.js");
var ProfilePageConstants = /** @class */ (function () {
    function ProfilePageConstants() {
    }
    Object.defineProperty(ProfilePageConstants, "url", {
        get: function () {
            return config.profile.testingUrl;
        },
        enumerable: true,
        configurable: true
    });
    ProfilePageConstants.getMyProfileUrl = function () {
        var userName = common_helper_js_1.commonPageHelper.getConfigUserName();
        var url = config.login.homePageUrl;
        return url + 'members/' + userName;
    };
    return ProfilePageConstants;
}());
exports.ProfilePageConstants = ProfilePageConstants;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJvZmlsZS5jb25zdGFudHMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9wYWdlLW9iamVjdHMvcGFnZXMvdG9wY29kZXIvcHJvZmlsZS9wcm9maWxlLmNvbnN0YW50cy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLGdEQUFrRDtBQUNsRCxxRUFBb0U7QUFFcEU7SUFBQTtJQVVBLENBQUM7SUFURyxzQkFBVywyQkFBRzthQUFkO1lBQ0ksT0FBTyxNQUFNLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQztRQUNyQyxDQUFDOzs7T0FBQTtJQUVNLG9DQUFlLEdBQXRCO1FBQ0ksSUFBTSxRQUFRLEdBQUcsbUNBQWdCLENBQUMsaUJBQWlCLEVBQUUsQ0FBQztRQUN0RCxJQUFJLEdBQUcsR0FBRyxNQUFNLENBQUMsS0FBSyxDQUFDLFdBQVcsQ0FBQztRQUNuQyxPQUFPLEdBQUcsR0FBRyxVQUFVLEdBQUcsUUFBUSxDQUFDO0lBQ3ZDLENBQUM7SUFDTCwyQkFBQztBQUFELENBQUMsQUFWRCxJQVVDO0FBVlksb0RBQW9CIn0=