import * as config from "../../../../config.json";

export class FooterConstants {
    static get content() {
        return {
            aboutUrl: 'https://www.' + config.baseUrl + '/community/about',
            contactUrl: 'https://www.' + config.baseUrl + '/community/contact',
            helpUrl: 'https://help.' + config.baseUrl + '/hc/en-us',
            privacyUrl: 'https://www.' + config.baseUrl + '/community/how-it-works/privacy-policy/',
            termsUrl: 'https://www.' + config.baseUrl + '/community/how-it-works/terms/',
            fbUrl: 'https://www.facebook.com/topcoder',
            twitterUrl: 'https://twitter.com/topcoder',
            linkedInUrl: 'https://www.linkedin.com/company/topcoder',
            instagramUrl: 'https://www.instagram.com/topcoder/'
        }
    }
}