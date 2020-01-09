import { commonPageHelper } from "../../../common/common.helper.js";

export class AccountPageConstants {
    static get url() {
        return commonPageHelper.getConfig().account.testingUrl;
    }
}