import * as config from "../../../../config.json";
import { commonPageHelper } from "../../../common/common.helper.js";

export class ProfilePageConstants {
    static get url() {
        return config.profile.testingUrl;
    }

    static getMyProfileUrl() {
        const userName = commonPageHelper.getConfigUserName();
        let url = config.login.homePageUrl;
        return url + 'members/' + userName;
    }
}