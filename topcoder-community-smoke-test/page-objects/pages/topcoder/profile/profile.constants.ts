import { commonPageHelper } from "../../../common/common.helper.js";

export class ProfilePageConstants {
    static get url() {
        return commonPageHelper.getConfig().profile.testingUrl;
    }

    static getMyProfileUrl() {
        const userName = commonPageHelper.getConfigUserName();
        let url = commonPageHelper.getConfig().login.homePageUrl;
        return url + 'members/' + userName;
    }
}