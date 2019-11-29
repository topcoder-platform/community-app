import * as config from "../../../../config.json";

export class SubmissionPageConstants {
    static getUrl(challengeId: string) {
        return 'https://www.' + config.baseUrl + '/challenges/' + challengeId + '/submit';
    }
}