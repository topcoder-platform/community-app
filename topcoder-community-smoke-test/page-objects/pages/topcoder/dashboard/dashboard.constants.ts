import { commonPageHelper } from "../../../common/common.helper.js";

export class DashboardPageConstants {
    static get url() {
        return 'https://www.' + commonPageHelper.getConfig().baseUrl + '/my-dashboard';
    }

    static get content() {
        return {
            loginRedirectionUrl: 'https://accounts.' + commonPageHelper.getConfig().baseUrl + '/member?retUrl=https:%2F%2Fwww.' + commonPageHelper.getConfig().baseUrl + '%2Fmy-dashboard&utm_source=community-app-main'
        }
    }
}