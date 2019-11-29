import * as config from "../../../../config.json";

export class PreferencesPageConstants {
    static get url() {
        return config.preferences.testingUrl;
    }

    static get content() {
        return {
            forumUrl: config.preferences.forumUrl,
            paymentUrl: config.preferences.paymentUrl,
            invitationLetterUrl: config.preferences.invitationLetterUrl,
            referralsUrl: config.preferences.referralsUrl
        }
    }
}