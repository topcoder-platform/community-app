"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var config = require("../../../../config.json");
var ChallengeListingPageConstants = /** @class */ (function () {
    function ChallengeListingPageConstants() {
    }
    Object.defineProperty(ChallengeListingPageConstants, "url", {
        get: function () {
            return 'https://www.' + config.baseUrl + '/challenges';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ChallengeListingPageConstants, "content", {
        get: function () {
            return {
                rssFeedUrl: 'http://feeds.topcoder.com/challenges/feed?list=active&contestType=all',
                aboutUrl: 'https://www.topcoder.com/about-the-2018-topcoder-open/',
                contactUrl: 'https://help.' + config.baseUrl + '/hc/en-us/articles/219069687-Contact-Support',
                helpUrl: 'https://help.' + config.baseUrl + '/hc/en-us',
                privacyUrl: 'https://www.' + config.baseUrl + '/community/how-it-works/privacy-policy/',
                termsUrl: 'https://www.' + config.baseUrl + '/community/how-it-works/terms/'
            };
        },
        enumerable: true,
        configurable: true
    });
    return ChallengeListingPageConstants;
}());
exports.ChallengeListingPageConstants = ChallengeListingPageConstants;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2hhbGxlbmdlLWxpc3RpbmcuY29uc3RhbnRzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vcGFnZS1vYmplY3RzL3BhZ2VzL3RvcGNvZGVyL2NoYWxsZW5nZS1saXN0aW5nL2NoYWxsZW5nZS1saXN0aW5nLmNvbnN0YW50cy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLGdEQUFrRDtBQUVsRDtJQUFBO0lBZUEsQ0FBQztJQWRHLHNCQUFXLG9DQUFHO2FBQWQ7WUFDSSxPQUFPLGNBQWMsR0FBRyxNQUFNLENBQUMsT0FBTyxHQUFHLGFBQWEsQ0FBQTtRQUMxRCxDQUFDOzs7T0FBQTtJQUVELHNCQUFXLHdDQUFPO2FBQWxCO1lBQ0ksT0FBTztnQkFDSCxVQUFVLEVBQUUsdUVBQXVFO2dCQUNuRixRQUFRLEVBQUUsd0RBQXdEO2dCQUNsRSxVQUFVLEVBQUUsZUFBZSxHQUFHLE1BQU0sQ0FBQyxPQUFPLEdBQUcsOENBQThDO2dCQUM3RixPQUFPLEVBQUUsZUFBZSxHQUFHLE1BQU0sQ0FBQyxPQUFPLEdBQUcsV0FBVztnQkFDdkQsVUFBVSxFQUFFLGNBQWMsR0FBRyxNQUFNLENBQUMsT0FBTyxHQUFHLHlDQUF5QztnQkFDdkYsUUFBUSxFQUFFLGNBQWMsR0FBRyxNQUFNLENBQUMsT0FBTyxHQUFHLGdDQUFnQzthQUMvRSxDQUFBO1FBQ0wsQ0FBQzs7O09BQUE7SUFDTCxvQ0FBQztBQUFELENBQUMsQUFmRCxJQWVDO0FBZlksc0VBQTZCIn0=