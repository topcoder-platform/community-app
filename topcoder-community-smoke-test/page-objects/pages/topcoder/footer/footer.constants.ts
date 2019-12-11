import { commonPageHelper } from "../../../common/common.helper.js";

export class FooterConstants {
    static get content() {
        return {
            aboutUrl: 'https://www.' + commonPageHelper.getConfig().baseUrl + '/community/about',
            contactUrl: 'https://www.' + commonPageHelper.getConfig().baseUrl + '/community/contact',
            helpUrl: commonPageHelper.getHelpUrl(),
            privacyUrl: 'https://www.' + commonPageHelper.getConfig().baseUrl + '/community/how-it-works/privacy-policy/',
            termsUrl: 'https://www.' + commonPageHelper.getConfig().baseUrl + '/community/how-it-works/terms/',
            fbUrl: 'https://www.facebook.com/topcoder',
            twitterUrl: 'https://twitter.com/topcoder',
            linkedInUrl: 'https://www.linkedin.com/company/topcoder',
            instagramUrl: 'https://www.instagram.com/topcoder/'
        }
    }
}