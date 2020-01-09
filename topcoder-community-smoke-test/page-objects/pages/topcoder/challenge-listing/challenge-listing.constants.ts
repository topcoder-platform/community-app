import { commonPageHelper } from "../../../common/common.helper.js";

export class ChallengeListingPageConstants {
    static get url() {
        return 'https://www.' + commonPageHelper.getConfig().baseUrl + '/challenges'
    }

    static get content() {
        return {
            rssFeedUrl: 'http://feeds.topcoder.com/challenges/feed?list=active&contestType=all',
            aboutUrl: 'https://www.topcoder.com/about-the-2018-topcoder-open/',
            contactUrl: 'https://help.' + commonPageHelper.getConfig().baseUrl + '/hc/en-us/articles/219069687-Contact-Support',
            helpUrl: commonPageHelper.getHelpUrl(),
            privacyUrl: 'https://www.' + commonPageHelper.getConfig().baseUrl + '/community/how-it-works/privacy-policy/',
            termsUrl: 'https://www.' + commonPageHelper.getConfig().baseUrl + '/community/how-it-works/terms/'
        }
    }
}
