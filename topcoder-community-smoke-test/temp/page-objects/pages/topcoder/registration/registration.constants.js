"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var config = require("../../../../config.json");
var RegistrationPageConstants = /** @class */ (function () {
    function RegistrationPageConstants() {
    }
    Object.defineProperty(RegistrationPageConstants, "url", {
        get: function () {
            return 'https://accounts.' + config.baseUrl + '/member/registration';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RegistrationPageConstants, "content", {
        get: function () {
            return {
                joinNowRedirectionUrl: 'https://accounts.' + config.baseUrl + '/member/registration?utm_source=community-app-main',
                pageTitle: 'Register | Topcoder',
                joinTopcoder: 'JOIN TOPCODER',
                termsUrl: 'http://www.' + config.baseUrl + '/community/how-it-works/terms/',
                loginUrl: 'https://accounts.' + config.baseUrl + '/member',
                loginUrlAfterConfirmation: 'https://accounts.' + config.baseUrl + '/member?retUrl=https:%2F%2Fwww.' + config.baseUrl + '%2Fsettings%2Fprofile&utm_source=community-app-main',
                privacyPolicyUrl: 'https://www.topcoder.com/community/how-it-works/privacy-policy/',
                privacyPolicyPageTitle: 'Community - How It Works - Privacy Policy',
                registrationSuccessUrl: 'https://accounts.' + config.baseUrl + '/member/registration-success?retUrl=https:%2F%2Fwww.' + config.baseUrl + '%2Fsettings%2Fprofile',
                registrationSuccessMsg: "Thanks for joining Topcoder. We've sent you a confirmation link. Please check your email and click the link to activate your account. If you can't find the message, please email support@topcoder.com."
            };
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RegistrationPageConstants, "registrationValues", {
        get: function () {
            return {
                firstName: 'test',
                lastName: 'user',
                country: 'India',
                password: 'Password@123'
            };
        },
        enumerable: true,
        configurable: true
    });
    return RegistrationPageConstants;
}());
exports.RegistrationPageConstants = RegistrationPageConstants;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVnaXN0cmF0aW9uLmNvbnN0YW50cy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3BhZ2Utb2JqZWN0cy9wYWdlcy90b3Bjb2Rlci9yZWdpc3RyYXRpb24vcmVnaXN0cmF0aW9uLmNvbnN0YW50cy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLGdEQUFrRDtBQUVsRDtJQUFBO0lBNEJBLENBQUM7SUEzQkcsc0JBQVcsZ0NBQUc7YUFBZDtZQUNJLE9BQU8sbUJBQW1CLEdBQUcsTUFBTSxDQUFDLE9BQU8sR0FBRyxzQkFBc0IsQ0FBQztRQUN6RSxDQUFDOzs7T0FBQTtJQUVELHNCQUFXLG9DQUFPO2FBQWxCO1lBQ0ksT0FBTztnQkFDSCxxQkFBcUIsRUFBRSxtQkFBbUIsR0FBRyxNQUFNLENBQUMsT0FBTyxHQUFHLG9EQUFvRDtnQkFDbEgsU0FBUyxFQUFFLHFCQUFxQjtnQkFDaEMsWUFBWSxFQUFFLGVBQWU7Z0JBQzdCLFFBQVEsRUFBRSxhQUFhLEdBQUcsTUFBTSxDQUFDLE9BQU8sR0FBRyxnQ0FBZ0M7Z0JBQzNFLFFBQVEsRUFBRSxtQkFBbUIsR0FBRyxNQUFNLENBQUMsT0FBTyxHQUFHLFNBQVM7Z0JBQzFELHlCQUF5QixFQUFFLG1CQUFtQixHQUFHLE1BQU0sQ0FBQyxPQUFPLEdBQUcsaUNBQWlDLEdBQUcsTUFBTSxDQUFDLE9BQU8sR0FBRyxxREFBcUQ7Z0JBQzVLLGdCQUFnQixFQUFFLGlFQUFpRTtnQkFDbkYsc0JBQXNCLEVBQUUsMkNBQTJDO2dCQUNuRSxzQkFBc0IsRUFBRSxtQkFBbUIsR0FBRyxNQUFNLENBQUMsT0FBTyxHQUFHLHNEQUFzRCxHQUFHLE1BQU0sQ0FBQyxPQUFPLEdBQUcsdUJBQXVCO2dCQUNoSyxzQkFBc0IsRUFBRSx5TUFBeU07YUFDcE8sQ0FBQztRQUNOLENBQUM7OztPQUFBO0lBRUQsc0JBQVcsK0NBQWtCO2FBQTdCO1lBQ0ksT0FBTztnQkFDSCxTQUFTLEVBQUUsTUFBTTtnQkFDakIsUUFBUSxFQUFFLE1BQU07Z0JBQ2hCLE9BQU8sRUFBRSxPQUFPO2dCQUNoQixRQUFRLEVBQUUsY0FBYzthQUMzQixDQUFBO1FBQ0wsQ0FBQzs7O09BQUE7SUFDTCxnQ0FBQztBQUFELENBQUMsQUE1QkQsSUE0QkM7QUE1QlksOERBQXlCIn0=