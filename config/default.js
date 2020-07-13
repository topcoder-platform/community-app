/* All availalbe configuration options should be documented in the default
 * config file, even when they are overriden in every custom configuration. */

module.exports = {
  /* Configuration of Topcoder APIs. */
  API: {
    V2: 'https://api.topcoder-dev.com/v2',
    V3: 'https://api.topcoder-dev.com/v3',
    V4: 'https://api.topcoder-dev.com/v4',
    V5: 'https://api.topcoder-dev.com/v5',
    MM_BROKER: '/api',
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

  /* Max number of recommended challenges */
  CHALLENGE_DETAILS_MAX_NUMBER_RECOMMENDED_CHALLENGES: 3,

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
  DISABLE_SERVICE_WORKER: true,

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
    DEFAUL_LIST_ID: '28bfd3c062',
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

  /* Google Analytics tracking ID */
  GOOGLE_ANALYTICS_ID: 'UA-161803421-1',

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
    HOME: '/my-dashboard',
    BLOG: 'https://www.topcoder-dev.com/blog',
    BLOG_FEED: 'https://www.topcoder.com/blog/feed/',
    COMMUNITY: 'https://community.topcoder-dev.com',
    FORUMS: 'https://apps.topcoder-dev.com/forums',
    HELP: 'https://www.topcoder.com/thrive/tracks?track=Topcoder&tax=Help%20Articles',

    THRIVE: 'https://www.topcoder.com/thrive',

    COMMUNITIES: {
      BLOCKCHAIN: 'https://blockchain.topcoder-dev.com',
      COGNITIVE: 'https://cognitive.topcoder-dev.com',
      ZURICH: 'https://community-app.topcoder-dev.com/__community__/zurich',
    },

    /* Dedicated section to group together links to various articles in
     * Topcoder help center. */
    INFO: {
      DESIGN_CHALLENGES: 'http://help.topcoder.com/hc/en-us/categories/202610437-DESIGN',
      DESIGN_CHALLENGE_CHECKPOINTS: 'https://help.topcoder.com/hc/en-us/articles/219240807-Multi-Round-Checkpoint-Design-Challenges',
      DESIGN_CHALLENGE_SUBMISSION: 'http://help.topcoder.com/hc/en-us/articles/219122667-Formatting-Your-Submission-for-Design-Challenges',
      DESIGN_CHALLENGE_TYPES: 'http://help.topcoder.com/hc/en-us/articles/217481388-Choosing-a-Design-Challenge',
      RELIABILITY_RATINGS_AND_BONUSES: 'https://www.topcoder.com/thrive/articles/Development%20Reliability%20Ratings%20and%20Bonuses',
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
    EMAIL_VERIFY_URL: 'http://www.topcoder-dev.com/settings/account/changeEmail',
    THRIVE_POLL_FEED: 'https://www.topcoder.com/feed',
  },

  /* Information about Topcoder user groups can be cached in various places.
   * This value [seconds] specifies the maximum age after which a group data
   * object should be considered outdated, and updated as soon as possible. */
  USER_GROUP_MAXAGE: 24 * 60 * 60 * 1000,

  /* Maximum time to wait before timeout on searching past challenges (seconds)
   * when no result at all.
   * Default: 30 seconds.
   */
  SEARCH_TIMEOUT: 30 * 1000,

  /* Filestack configuration for uploading Submissions
   * These are for the development back end */
  FILESTACK: {
    API_KEY: 'AzFINuQoqTmqw0QEoaw9az',
    REGION: 'us-east-1',
    SUBMISSION_CONTAINER: 'topcoder-dev-submissions-dmz',
  },

  /* Secret part of the configuration. Nest into this section any sensitive
   * parameters that should never be send to the client side. */
  SECRET: {
    CONTENTFUL: {
      DEFAULT_SPACE_NAME: 'default',
      DEFAULT_ENVIRONMENT: 'master',
      MANAGEMENT_TOKEN: '', // Personal Access Token to use the Content Management API
      default: { // Human-readable name of space
        SPACE_ID: '',
        master: { // Name of an environment
          CDN_API_KEY: '',
          PREVIEW_API_KEY: '',
        },
      },
      /* Space for expert communities. */
      zurich: {
        SPACE_ID: '',
        master: {
          CDN_API_KEY: '',
          PREVIEW_API_KEY: '',
        },
      },
      /* Contentful Space for TopGear community content. */
      topgear: {
        SPACE_ID: '',
        master: {
          CDN_API_KEY: '',
          PREVIEW_API_KEY: '',
        },
      },
      EDU: {
        SPACE_ID: '',
        master: {
          CDN_API_KEY: '',
          PREVIEW_API_KEY: '',
        },
      },
      comcast: {
        SPACE_ID: '',
        master: {
          CDN_API_KEY: '',
          PREVIEW_API_KEY: '',
        },
      },
    },

    MAILCHIMP: {
      default: {
        API_KEY: '',
        MAILCHIMP_BASE_URL: '',
      },
    },

    OPEN_EXCHANGE_RATES_KEY: '',

    /* These credentials allow Community App server to communicate with
     * protected TC API endpoints (on behalf of the app itself). */
    TC_M2M: {
      CLIENT_ID: '',
      CLIENT_SECRET: '',
      AUTH0_AUDIENCE: '',
      GRANT_TYPE: '',
      AUTH0_PROXY_SERVER_URL: '',
      AUTH0_URL: '',
      TOKEN_CACHE_TIME: '',
    },
  },

  AUTH_CONFIG: {
    AUTH0_URL: 'TC_M2M_AUTH0_URL',
    AUTH0_AUDIENCE: 'TC_M2M_AUDIENCE',
    AUTH0_PROXY_SERVER_URL: 'TC_M2M_AUTH0_PROXY_SERVER_URL',
    TOKEN_CACHE_TIME: 'TOKEN_CACHE_TIME',
  },

  ACCOUNT_MENU_SWITCH_TEXT: {
    title: 'Switch to BUSINESS',
    href: 'https://connect.topcoder-dev.com',
  },
  HEADER_MENU: [
    {
      id: 'business',
      title: 'BUSINESS',
      href: 'https://www.topcoder-dev.com',
    },
    {
      id: 'community', // required for 'Switch to BUSINESS' to work
      title: 'COMMUNITY',
      secondaryMenu: [
        {
          title: 'Dashboard',
          href: '/my-dashboard',
          logged: true,
        },
        {
          id: 'myprofile',
          title: 'My Profile',
          href: '/members/willFilledByUserName',
          logged: true,
        },
        {
          title: 'Payments',
          href: 'https://community.topcoder-dev.com/PactsMemberServlet?module=PaymentHistory&full_list=false',
          logged: true,
          openNewTab: true,
        },
        {
          title: 'Overview',
          href: '/community/learn',
          logged: false,
        },
        {
          title: 'How It Works',
          href: '/thrive/tracks?track=Topcoder',
          logged: false,
        },
      ],
      subMenu: [
        {
          title: 'Compete',
          subMenu: [
            {
              title: 'All Challenges',
              href: '/challenges',
            },
            {
              title: 'Competitive Programming',
              href: '/community/arena',
            },
            {
              title: 'Gig Work',
              href: '/community/taas',
            },
            {
              title: 'Practice',
              href: '/community/practice',
            },
          ],
        },
        {
          title: 'Tracks',
          subMenu: [
            {
              title: 'Competitive Programming',
              href: '/thrive/tracks?track=Competitive%20Programming',
            },
            {
              title: 'Data Science',
              href: '/thrive/tracks?track=Data%20Science&tax=',
            },
            {
              title: 'Design',
              href: '/thrive/tracks?track=Design&tax=',
            },
            {
              title: 'Development',
              href: '/thrive/tracks?track=Development&tax=',
            },
            {
              title: 'QA',
              href: '/thrive/tracks?track=QA&tax=',
            },
          ],
        },
        {
          title: 'Explore',
          subMenu: [
            {
              title: 'TCO',
              href: '/community/member-programs/topcoder-open',
            },
            {
              title: 'Programs',
              href: '/community/member-programs',
            },
            {
              title: 'Forums',
              href: 'https://apps.topcoder-dev.com/forums',
              openNewTab: true,
            },
            {
              title: 'Statistics',
              href: '/community/statistics',
            },
            {
              title: 'Blog',
              href: 'https://www.topcoder-dev.com/blog',
            },
            {
              title: 'Thrive',
              href: '/thrive',
            },
          ],
        },
      ],
    },
  ],
  HEADER_MENU_THEME: 'light',
  HEADER_AUTH_URLS: {
    href: 'https://accounts.topcoder-dev.com/member/registration?utm_source=community-app-main',
    location: 'https://accounts.topcoder-dev.com/member?retUrl=%S&utm_source=community-app-main',
  },
  ACCOUNT_MENU: [
    {
      title: 'Settings',
      href: '/settings/profile',
    },
    { separator: true },
    {
      title: 'Help',
      href: 'https://community-app.topcoder-dev.com/thrive/tracks?track=Topcoder&tax=Help%20Articles',
    },
    { separator: true },
    {
      title: 'Log Out',
      href: 'https://www.topcoder-dev.com/logout',
    },
  ],
  // Config for TC EDU - THRIVE
  TC_EDU_BASE_PATH: '/thrive',
  TC_EDU_TRACKS_PATH: '/tracks',
  TC_EDU_ARTICLES_PATH: '/articles',
  TC_EDU_SEARCH_PATH: '/search',
  TC_EDU_SEARCH_BAR_MAX_RESULTS_EACH_GROUP: 3,
};
