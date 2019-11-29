"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var config = require("../../../../config.json");
var LoginPageConstants = /** @class */ (function () {
    function LoginPageConstants() {
    }
    Object.defineProperty(LoginPageConstants, "url", {
        get: function () {
            return config.login.testingUrl;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(LoginPageConstants, "content", {
        get: function () {
            return {
                loginRedirectionUrlFromSRMTab: 'https://accounts.' + config.baseUrl + '/member?retUrl=https:%2F%2Farena.' + config.baseUrl + '%2Findex.html',
                loginRedirectionUrlFromChallengeListingLoginLink: 'https://accounts.' + config.baseUrl + '/member?retUrl=https:%2F%2Fwww.' + config.baseUrl + '%2Fchallenges&utm_source=community-app-main',
                loginRedirectionUrlFromCompetitiveProgrammingLink: 'https://accounts.' + config.baseUrl + '/member?retUrl=https:%2F%2Farena.' + config.baseUrl + '%2Findex.html',
                pageTitle: 'Login | Topcoder',
                forgotPasswordUrl: 'https://accounts.' + config.baseUrl + '/member/forgot-password',
                dashboardUrl: 'https://www.' + config.baseUrl + '/my-dashboard',
                logoutUrl: 'https://www.' + config.baseUrl + '/logout',
            };
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(LoginPageConstants, "homePageUrl", {
        get: function () {
            return config.login.homePageUrl;
        },
        enumerable: true,
        configurable: true
    });
    return LoginPageConstants;
}());
exports.LoginPageConstants = LoginPageConstants;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9naW4uY29uc3RhbnRzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vcGFnZS1vYmplY3RzL3BhZ2VzL3RvcGNvZGVyL2xvZ2luL2xvZ2luLmNvbnN0YW50cy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLGdEQUFrRDtBQUdsRDtJQUFBO0lBb0JBLENBQUM7SUFuQkcsc0JBQVcseUJBQUc7YUFBZDtZQUNJLE9BQU8sTUFBTSxDQUFDLEtBQUssQ0FBQyxVQUFVLENBQUM7UUFDbkMsQ0FBQzs7O09BQUE7SUFFRCxzQkFBVyw2QkFBTzthQUFsQjtZQUNJLE9BQU87Z0JBQ0gsNkJBQTZCLEVBQUUsbUJBQW1CLEdBQUcsTUFBTSxDQUFDLE9BQU8sR0FBRyxtQ0FBbUMsR0FBRyxNQUFNLENBQUMsT0FBTyxHQUFHLGVBQWU7Z0JBQzVJLGdEQUFnRCxFQUFFLG1CQUFtQixHQUFHLE1BQU0sQ0FBQyxPQUFPLEdBQUcsaUNBQWlDLEdBQUcsTUFBTSxDQUFDLE9BQU8sR0FBRyw2Q0FBNkM7Z0JBQzNMLGlEQUFpRCxFQUFFLG1CQUFtQixHQUFHLE1BQU0sQ0FBQyxPQUFPLEdBQUcsbUNBQW1DLEdBQUcsTUFBTSxDQUFDLE9BQU8sR0FBRyxlQUFlO2dCQUNoSyxTQUFTLEVBQUUsa0JBQWtCO2dCQUM3QixpQkFBaUIsRUFBRSxtQkFBbUIsR0FBRyxNQUFNLENBQUMsT0FBTyxHQUFHLHlCQUF5QjtnQkFDbkYsWUFBWSxFQUFFLGNBQWMsR0FBRyxNQUFNLENBQUMsT0FBTyxHQUFHLGVBQWU7Z0JBQy9ELFNBQVMsRUFBRSxjQUFjLEdBQUcsTUFBTSxDQUFDLE9BQU8sR0FBRyxTQUFTO2FBQ3pELENBQUM7UUFDTixDQUFDOzs7T0FBQTtJQUVELHNCQUFXLGlDQUFXO2FBQXRCO1lBQ0ksT0FBTyxNQUFNLENBQUMsS0FBSyxDQUFDLFdBQVcsQ0FBQztRQUNwQyxDQUFDOzs7T0FBQTtJQUNMLHlCQUFDO0FBQUQsQ0FBQyxBQXBCRCxJQW9CQztBQXBCWSxnREFBa0IifQ==