import * as config from "../../../../config.json";

export class ForumPageConstants {
    static get url() {
        return 'https://apps.' + config.baseUrl + '/forums';
    }

    static get content() {
        return {
            challengeForumUrl: 'https://apps.' + config.baseUrl + '/forums/?module=Category&categoryID=82117'
        }
    }
}