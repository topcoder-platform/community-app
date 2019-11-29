import * as config from "../../../../config.json";

export class DashboardPageConstants {
    static get url() {
        return 'https://www.' + config.baseUrl + '/my-dashboard';
    }

    static get content() {
        return {
            loginRedirectionUrl: 'https://accounts.' + config.baseUrl + '/member?retUrl=https:%2F%2Fwww.' + config.baseUrl + '%2Fmy-dashboard&utm_source=community-app-main'
        }
    }
}