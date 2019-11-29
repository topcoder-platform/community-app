import * as config from "../../../../config.json";

export class TermsPageConstants {
    static get url() {
        return 'https://www.' + config.baseUrl + '/community/how-it-works/terms/';
    }

    static get content() {
        return {
            redirectUrl: 'https://www.' + config.baseUrl + '/challenges/terms/detail/21303'
        };
    }
}