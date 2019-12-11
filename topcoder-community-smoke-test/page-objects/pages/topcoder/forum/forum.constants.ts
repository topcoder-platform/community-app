import { commonPageHelper } from "../../../common/common.helper";


export class ForumPageConstants {
    static get url() {
        return 'https://apps.' + commonPageHelper.getConfig().baseUrl + '/forums';
    }

    static get content() {
        return {
            challengeForumUrl: commonPageHelper.getConfig().challengeForumUrl
        }
    }
}