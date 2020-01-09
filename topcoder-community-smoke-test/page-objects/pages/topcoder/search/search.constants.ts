import { commonPageHelper } from "../../../common/common.helper";

export class SearchPageConstants {
    static getUrl(query: string) {
        return 'https://www.' + commonPageHelper.getConfig().baseUrl + '/search/members/?q=' + query;
    }
}