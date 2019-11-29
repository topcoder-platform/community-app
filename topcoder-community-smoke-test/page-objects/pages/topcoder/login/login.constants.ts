import * as config from "../../../../config.json";
import { commonPageHelper } from "../../../common/common.helper.js";

export class LoginPageConstants {
    static get url() {
        return config.login.testingUrl; 
    }

    static get content() {
        return {
            loginRedirectionUrlFromSRMTab: 'https://accounts.' + config.baseUrl + '/member?retUrl=https:%2F%2Farena.' + config.baseUrl + '%2Findex.html',
            loginRedirectionUrlFromChallengeListingLoginLink: 'https://accounts.' + config.baseUrl + '/member?retUrl=https:%2F%2Fwww.' + config.baseUrl + '%2Fchallenges&utm_source=community-app-main',
            loginRedirectionUrlFromCompetitiveProgrammingLink: 'https://accounts.' + config.baseUrl + '/member?retUrl=https:%2F%2Farena.' + config.baseUrl + '%2Findex.html',
            pageTitle: 'Login | Topcoder',
            forgotPasswordUrl: 'https://accounts.' + config.baseUrl + '/member/forgot-password',
            dashboardUrl: 'https://www.' + config.baseUrl + '/my-dashboard',
            logoutUrl: 'https://www.' + config.baseUrl + '/logout',
        };
    }

    static get homePageUrl() {
        return config.login.homePageUrl;
    }
}
