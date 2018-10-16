/* All availalbe configuration options should be documented in the default
 * config file, even when they are overriden in every custom configuration. */

module.exports = {
  /* Configuration of Topcoder APIs. */
  API: {
    V2: 'https://api.topcoder-dev.com/v2',
    V3: 'https://api.topcoder-dev.com/v3',
    V4: 'https://api.topcoder-dev.com/v4',
  },

  /* Auth0 config */
  AUTH0: {
    DOMAIN: 'topcoder-dev.auth0.com',
    CLIENT_ID: 'JFDo7HMkf0q2CkVFHojy3zHWafziprhT',
  },

  /* Amount of time [seconds] before expiration of authentication tokens,
   * when the code will treat them as expired (to prevent attempts to
   * authenticate with an expired token). */
  AUTH_DROP_TIME: 25,

  /* CDN configuration. */
  CDN: {
    PUBLIC: 'https://d1aahxkjiobka8.cloudfront.net',
  },

  /* Time in MS to wait before refreshing challenge details after register
   * and unregister.  Used to allow API sufficent time to update.
   */
  CHALLENGE_DETAILS_REFRESH_DELAY: 3000,

  COOKIES: {
    /* Expiration time [days] for browser cookies set by the App. */
    MAXAGE: 7,

    /* If true the cookies set by this App will only be transmitted over secure
     * protocols like https. */
    SECURE: false,
  },

  /* If set, the challenge listing component will automatically reload all
   * challenges once per this amount of seconds. */
  CHALLENGE_LISTING_AUTO_REFRESH: 300,

  CONTENTFUL: {
    LOCAL_MODE: false,
    DEFAULT_SPACE_NAME: 'default',
    DEFAULT_ENVIRONMENT: 'master',
  },

  /**
   * Disable PWA service worker.
   */
  DISABLE_SERVICE_WORKER: false,

  /* API token for logentries.com. The token below is just for local testing of
   * the setup. To override it use LOG_ENTRIES_TOKEN environment variable. */
  LOG_ENTRIES_TOKEN: '816f5574-0d4a-49f9-ab3b-00d791f7c1f7',

  /* When set to true, terms service is short-cut so that each time
   * a user goes to challenge details page or community page, it tells that none of
   * terms is agrees, and takes care that user is taken through the terms
   * agreement flow. */
  MOCK_TERMS_SERVICE: false,

  /* Holds params to signup for different newsletters. */
  NEWSLETTER_SIGNUP: {
    COGNITIVE: {
      APIKEY: '',
      URL: '',
    },
  },

  /* Amount of time [seconds] before expiration of authentication tokens,
   * when the frontend will automatically trigger their refreshment. Once
   * ready, it will either write to the Redux store fresh token, or will
   * remove auth tokens from the store.
   * NOTE: With the current implementation of accounts-app this value must be
   * smaller than 60 seconds (earlier than 60 seconds before expiration of an
   * auth token, a call to the getFreshToken() method returns the old token,
   * due to caching). */
  REAUTH_TIME: 55,

  /* API key for Segment.io. For development environment the value is set inside
   * development.json, for production environment it is set via CircleCI
   * variables. */
  SEGMENT_IO_API_KEY: '',

  SERVER_API_KEY: '',

  SWIFT_PROGRAM_ID: 3445,

  /* Various URLs. Most of them lead to different segments of Topcoder
   * platform. */
  URL: {
    /* Connector URL of the TC accounts App. */
    ACCOUNTS_APP_CONNECTOR: 'https://accounts.topcoder-dev.com/connector.html',

    /* The remote address where the app is deployed. */
    APP: 'https://community-app.topcoder-dev.com',

    /* This is the same value as above, but it is used by topcoder-react-lib,
     * as a more verbose name for the param. */
    COMMUNITY_APP: 'https://community-app.topcoder-dev.com',

    ARENA: 'https://arena.topcoder-dev.com',
    AUTH: 'http://accounts.topcoder-dev.com',
    BASE: 'https://www.topcoder-dev.com',
    BLOG: 'https://www.topcoder.com/blog',
    BLOG_FEED: 'https://www.topcoder.com/blog/feed/',
    COMMUNITY: 'https://community.topcoder-dev.com',
    FORUMS: 'https://apps.topcoder-dev.com/forums',
    HELP: 'https://help.topcoder-dev.com',

    COMMUNITIES: {
      BLOCKCHAIN: 'https://blockchain.topcoder-dev.com',
      COGNITIVE: 'https://cognitive.topcoder-dev.com',
    },

    /* Dedicated section to group together links to various articles in
     * Topcoder help center. */
    INFO: {
      DESIGN_CHALLENGES: 'http://help.topcoder.com/hc/en-us/categories/202610437-DESIGN',
      DESIGN_CHALLENGE_CHECKPOINTS: 'https://help.topcoder.com/hc/en-us/articles/219240807-Multi-Round-Checkpoint-Design-Challenges',
      DESIGN_CHALLENGE_SUBMISSION: 'http://help.topcoder.com/hc/en-us/articles/219122667-Formatting-Your-Submission-for-Design-Challenges',
      DESIGN_CHALLENGE_TYPES: 'http://help.topcoder.com/hc/en-us/articles/217481388-Choosing-a-Design-Challenge',
      RELIABILITY_RATINGS_AND_BONUSES: 'https://help.topcoder.com/hc/en-us/articles/219240797-Development-Reliability-Ratings-and-Bonuses',
      STOCK_ART_POLICY: 'http://help.topcoder.com/hc/en-us/articles/217481408-Policy-for-Stock-Artwork-in-Design-Submissions',
      STUDIO_FONTS_POLICY:
      'http://help.topcoder.com/hc/en-us/articles/217959447-Font-Policy-for-Design-Challenges',
      TOPCODER_TERMS: 'https://www.topcoder.com/community/how-it-works/terms/',
    },

    IOS: 'https://ios.topcoder-dev.com',
    MEMBER: 'https://members.topcoder-dev.com',
    ONLINE_REVIEW: 'https://software.topcoder-dev.com',
    PAYMENT_TOOL: 'https://payment.topcoder-dev.com',
    STUDIO: 'https://studio.topcoder-dev.com',
    TCO: 'https://www.topcoder.com/tco',
    TCO17: 'https://tco17.topcoder.com/',

    TOPGEAR: 'https://dev-topgear.wipro.com',

    USER_SETTINGS: 'https://lc1-user-settings-service.herokuapp.com',
    WIPRO: 'https://wipro.topcoder.com',
    COMMUNITY_API: 'http://localhost:8000',
    COMMUNITY_APP_GITHUB_ISSUES: 'https://github.com/topcoder-platform/community-app/issues',
  },

  /* Information about Topcoder user groups can be cached in various places.
   * This value [seconds] specifies the maximum age after which a group data
   * object should be considered outdated, and updated as soon as possible. */
  USER_GROUP_MAXAGE: 600,

  /* Filestack configuration for uploading Submissions
   * These are for the development back end */
  FILESTACK: {
    API_KEY: 'AzFINuQoqTmqw0QEoaw9az',
    REGION: 'us-east-1',
    SUBMISSION_CONTAINER: 'submission-staging-dev',
  },

  /* Secret part of the configuration. Nest into this section any sensitive
   * parameters that should never be send to the client side. */
  SECRET: {
    /* Space ID and API keys for Contenful CMS. */
    CONTENTFUL: {
      CDN_API_KEY: '',
      PREVIEW_API_KEY: '',
      SPACE_ID: '',
    },

    OPEN_EXCHANGE_RATES_KEY: '',
  },
};
