import * as config from "../../../../config.json";

export class ChallengeListingPageConstants {
    static get url() {
        return 'https://www.' + config.baseUrl + '/challenges'
    }

    static get content() {
        return {
            rssFeedUrl: 'http://feeds.topcoder.com/challenges/feed?list=active&contestType=all',
            aboutUrl: 'https://www.topcoder.com/about-the-2018-topcoder-open/',
            contactUrl: 'https://help.' + config.baseUrl + '/hc/en-us/articles/219069687-Contact-Support',
            helpUrl: 'https://help.' + config.baseUrl + '/hc/en-us',
            privacyUrl: 'https://www.' + config.baseUrl + '/community/how-it-works/privacy-policy/',
            termsUrl: 'https://www.' + config.baseUrl + '/community/how-it-works/terms/'
        }
    }
}
