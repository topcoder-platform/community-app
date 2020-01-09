import { commonPageHelper } from "../../../common/common.helper";

export class HomePageConstants {
    static get url() {
        return 'https://www.' + commonPageHelper.getConfig().baseUrl + '/';
    }
}