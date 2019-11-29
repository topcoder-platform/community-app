import * as config from "../../../../config.json";

export class SearchPageConstants {
    static getUrl(query: string) {
        return 'https://www.' + config.baseUrl + '/search/members/?q=' + query;
    }
}