import * as config from "../../../../config.json";

export class ScorecardPageConstants {
    static get url() {
        return 'https://software.' + config.baseUrl + '/review/actions/ViewScorecard?scid=30002133'
    }
}