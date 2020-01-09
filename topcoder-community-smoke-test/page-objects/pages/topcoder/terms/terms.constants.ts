import { commonPageHelper } from "../../../common/common.helper";

export class TermsPageConstants {
    static get url() {
        return 'https://www.' + commonPageHelper.getConfig().baseUrl + '/community/how-it-works/terms/';
    }

    static get content() {
        return {
            redirectUrl: 'https://www.' + commonPageHelper.getConfig().baseUrl + '/challenges/terms/detail/21303'
        };
    }
}