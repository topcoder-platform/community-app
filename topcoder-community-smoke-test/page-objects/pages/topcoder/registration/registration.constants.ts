import { commonPageHelper } from "../../../common/common.helper";

export class RegistrationPageConstants {
    static get url() {
        return 'https://accounts.' + commonPageHelper.getConfig().baseUrl + '/member/registration'; 
    }

    static get content() {
        return {
            joinNowRedirectionUrl: 'https://accounts.' + commonPageHelper.getConfig().baseUrl + '/member/registration?utm_source=community-app-main',
            pageTitle: 'Register | Topcoder',
            joinTopcoder: 'JOIN TOPCODER',
            termsUrl: 'http://www.' + commonPageHelper.getConfig().baseUrl + '/community/how-it-works/terms/',
            loginUrl: 'https://accounts.' + commonPageHelper.getConfig().baseUrl + '/member',
            loginUrlAfterConfirmation: 'https://accounts.' + commonPageHelper.getConfig().baseUrl + '/member?retUrl=https:%2F%2Fwww.' + commonPageHelper.getConfig().baseUrl + '%2Fsettings%2Fprofile&utm_source=community-app-main',
            privacyPolicyUrl: 'https://www.topcoder.com/community/how-it-works/privacy-policy/',
            privacyPolicyPageTitle: 'Community - How It Works - Privacy Policy',
            registrationSuccessUrl: 'https://accounts.' + commonPageHelper.getConfig().baseUrl + '/member/registration-success?retUrl=https:%2F%2Fwww.' + commonPageHelper.getConfig().baseUrl + '%2Fsettings%2Fprofile',
            registrationSuccessMsg: `Thanks for joining Topcoder. We've sent you a confirmation link. Please check your email and click the link to activate your account. If you can't find the message, please email support@topcoder.com.`
        };
    }

    static get registrationValues() {
        return {
            firstName: 'test',
            lastName: 'user',
            country: 'India',
            password: 'Password@123'
        }
    }
}
