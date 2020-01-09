import { commonPageHelper } from "../../../common/common.helper.js";

export class LoginPageConstants {
    static get url() {
        return commonPageHelper.getConfig().login.testingUrl; 
    }

    static get content() {
        return {
            loginRedirectionUrlFromSRMTab: 'https://accounts.' + commonPageHelper.getConfig().baseUrl + '/member?retUrl=https:%2F%2Farena.' + commonPageHelper.getConfig().baseUrl + '%2Findex.html',
            loginRedirectionUrlFromChallengeListingLoginLink: 'https://accounts.' + commonPageHelper.getConfig().baseUrl + '/member?retUrl=https:%2F%2Fwww.' + commonPageHelper.getConfig().baseUrl + '%2Fchallenges&utm_source=community-app-main',
            loginRedirectionUrlFromCompetitiveProgrammingLink: 'https://accounts.' + commonPageHelper.getConfig().baseUrl + '/member?retUrl=https:%2F%2Farena.' + commonPageHelper.getConfig().baseUrl + '%2Findex.html',
            pageTitle: 'Login | Topcoder',
            forgotPasswordUrl: 'https://accounts.' + commonPageHelper.getConfig().baseUrl + '/member/forgot-password',
            dashboardUrl: 'https://www.' + commonPageHelper.getConfig().baseUrl + '/my-dashboard',
            logoutUrl: 'https://www.' + commonPageHelper.getConfig().baseUrl + '/logout',
        };
    }

    static get homePageUrl() {
        return commonPageHelper.getConfig().login.homePageUrl;
    }
}
