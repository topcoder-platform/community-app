import { commonPageHelper } from "../../../common/common.helper.js";

export class ArenaPageConstants {
    static get url() {
        return 'https://arena.' + commonPageHelper.getConfig().baseUrl + '/';
    }
}