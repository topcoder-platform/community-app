import * as config from "../../../../config.json";

export class ArenaPageConstants {
    static get url() {
        return 'https://arena.' + config.baseUrl + '/';
    }
}