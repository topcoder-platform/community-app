import * as config from "../../../../config.json";

export class HomePageConstants {
    static get url() {
        return 'https://www.' + config.baseUrl + '/';
    }
}