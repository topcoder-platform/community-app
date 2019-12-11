import { commonPageHelper } from "../../../common/common.helper";

export class PreferencesPageConstants {
    static get url() {
        return commonPageHelper.getConfig().preferences.testingUrl;
    }

    static get content() {
        return {
            forumUrl: commonPageHelper.getConfig().preferences.forumUrl,
            paymentUrl: commonPageHelper.getConfig().preferences.paymentUrl,
            invitationLetterUrl: commonPageHelper.getConfig().preferences.invitationLetterUrl,
            referralsUrl: commonPageHelper.getConfig().preferences.referralsUrl
        }
    }
}