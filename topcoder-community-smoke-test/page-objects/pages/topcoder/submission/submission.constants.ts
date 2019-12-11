import { commonPageHelper } from "../../../common/common.helper";

export class SubmissionPageConstants {
    static getUrl(challengeId: string) {
        return 'https://www.' + commonPageHelper.getConfig().baseUrl + '/challenges/' + challengeId + '/submit';
    }
}