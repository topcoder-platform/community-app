import { commonPageHelper } from "../../../common/common.helper";

export class SettingsPageConstants {
    static get url() {
        return commonPageHelper.getConfig().profile.testingUrl;
    }
}