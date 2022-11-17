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
    ACCOUNTS_APP_CONNECTOR: 'https://accounts-auth0.topcoder-dev.com',

    /* The remote address where the app is deployed. */
    APP: 'https://community-app.topcoder-dev.com',

    /* This is the same value as above, but it is used by topcoder-react-lib,
     * as a more verbose name for the param. */
    COMMUNITY_APP: 'https://community-app.topcoder-dev.com',
    CHALLENGES_URL: 'https://www.topcoder-dev.com/challenges',
    TCO_OPEN_URL: 'https://www.topcoder-dev.com/community/member-programs/topcoder-open',
    ARENA: 'https://arena.topcoder-dev.com',
    AUTH: 'https://accounts-auth0.topcoder-dev.com',
    BASE: 'https://www.topcoder-dev.com',
    HOME: '/home',
    BLOG: 'https://www.topcoder-dev.com/blog',
    BLOG_FEED: 'https://www.topcoder.com/blog/feed/',
    THRIVE_FEED: 'https://topcoder-dev.com/api/feeds/thrive',
    COMMUNITY: 'https://community.topcoder-dev.com',
    FORUMS: 'https://apps.topcoder-dev.com/forums',
    FORUMS_VANILLA: 'https://vanilla.topcoder-dev.com',
    HELP: 'https://www.topcoder.com/thrive/tracks?track=Topcoder&tax=Help%20Articles',
    SUBMISSION_REVIEW: 'https://submission-review.topcoder-dev.com',

    THRIVE: 'https://community-app.topcoder-dev.com/thrive',

    COMMUNITIES: {
      BLOCKCHAIN: 'https://blockchain.topcoder-dev.com',
      COGNITIVE: 'https://cognitive.topcoder-dev.com',
      ZURICH: 'https://community-app.topcoder-dev.com/__community__/zurich',
      COMCAST: 'https://community-app.topcoder-dev.com/__community__/comcast',
      CS: 'https://community-app.topcoder-dev.com/__community__/cs',
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
      HOWTOCOMPETEINMARATHON: 'https://www.topcoder.com/thrive/articles/How%20To%20Compete%20in%20a%20Marathon%20Match',
      USABLECODEDEV: 'https://www.topcoder.com/thrive/articles/Usable%20Code%20in%20Dev%20Challenges',
      EXTENSIONVSCODE: 'https://marketplace.visualstudio.com/items?itemName=Topcoder.topcoder-workflow&ssr=false#overview',
      TEMPLATES_REPO: 'https://github.com/topcoder-platform-templates',
    },

    IOS: 'https://ios.topcoder-dev.com',
    MEMBER: 'https://members.topcoder-dev.com',
    ONLINE_REVIEW: 'https://software.topcoder-dev.com',
    PAYMENT_TOOL: 'https://payment.topcoder-dev.com',
    STUDIO: 'https://studio.topcoder-dev.com',
    TCO: 'https://www.topcoder.com/tco',
    TCO17: 'https://tco17.topcoder.com/',
    TCO19: 'https://community-app.topcoder-dev.com/__community__/tco19',

    TOPGEAR: 'https://dev-topgear.wipro.com',

    USER_SETTINGS: 'https://lc1-user-settings-service.herokuapp.com',
    WIPRO: 'https://wipro.topcoder.com',
    COMMUNITY_API: 'http://localhost:8000',
    COMMUNITY_APP_GITHUB_ISSUES: 'https://github.com/topcoder-platform/community-app/issues',
    EMAIL_VERIFY_URL: 'http://www.topcoder-dev.com/settings/account/changeEmail',
    ABANDONMENT_EMBED: 'https://43d132d5dbff47c59d9d53ad448f93c2.js.ubembed.com',
    // If a logged in user is a member of any of these groups, when they land on
    // their profile page (members/:handle), they'll be redirected to the "userProfile" url
    SUBDOMAIN_PROFILE_CONFIG: [{
      groupId: '20000000', communityId: 'wipro', communityName: 'topgear', userProfile: 'https://topgear-app.wipro.com/user-details',
    }],
    TIMELINE_WALL_API: 'https://api.topcoder-dev.com/v5/timeline-wall',
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
      EDU: {
        SPACE_ID: '',
        master: {
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

    RECRUITCRM_API_KEY: '',
    GROWSURF_API_KEY: '',
    SENDGRID_API_KEY: '',
    JWT_AUTH: {
      SECRET: 'mysecret',
      AUTH_SECRET: 'mysecret',
      VALID_ISSUERS: '["https://api.topcoder-dev.com", "https://api.topcoder.com", "https://topcoder-dev.auth0.com/", "https://auth.topcoder-dev.com/","https://topcoder.auth0.com/","https://auth.topcoder.com/"]',
    },
    CHAMELEON_VERIFICATION_SECRET: 'mysecret',
  },
  GROWSURF_CAMPAIGN_ID: '',
  GROWSURF_COOKIE: '_tc_gigs_ref',
  GROWSURF_COOKIE_SETTINGS: {
    secure: true,
    domain: '',
    expires: 30, // days
  },

  GSHEETS_API_KEY: 'AIzaSyBRdKySN5JNCb2H6ZxJdTTvp3cWU51jiOQ',
  GOOGLE_SERVICE_ACCOUNT_EMAIL: 'communityappserviceacc@tc-sheets-to-contentful.iam.gserviceaccount.com',
  GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY: '',
  GIG_REFERRALS_SHEET: '1xilx7NxDAvzAzOTbPpvb3lL3RWv1VD5W24OEMAoF9HU',

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
          id: 'home',
          title: 'Home',
          href: '/home',
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
              href: '/gigs',
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
              href: '/thrive/tracks?track=Data%20Science',
            },
            {
              title: 'Design',
              href: '/thrive/tracks?track=Design',
            },
            {
              title: 'Development',
              href: '/thrive/tracks?track=Development',
            },
            {
              title: 'QA',
              href: '/thrive/tracks?track=QA',
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
              href: 'https://vanilla.topcoder-dev.com',
            },
            {
              title: 'Statistics',
              href: '/community/statistics',
            },
            {
              title: 'Blog',
              href: 'https://www.topcoder-dev.com/blog',
              openNewTab: true,
            },
            {
              title: 'Thrive',
              href: '/thrive',
            },
          ],
        },
        {
          title: 'Discord',
          href: 'https://discord.gg/topcoder',
          openNewTab: true,
        },
        {
          title: 'Learn',
          href: 'https://platform-ui.topcoder-dev.com/learn',
          openNewTab: true,
        },
      ],
    },
  ],
  HEADER_MENU_THEME: 'light',
  HEADER_AUTH_URLS: {
    href: 'https://accounts-auth0.topcoder-dev.com?utm_source=community-app-main',
    location: 'https://accounts-auth0.topcoder-dev.com?retUrl=%S&utm_source=community-app-main',
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
  POLICY_PAGES_PATH: '/policy',
  GIGS_PAGES_PATH: '/gigs',
  GIGS_LISTING_CACHE_TIME: 300, // in seconds
  START_PAGE_PATH: '/start',
  TC_ACADEMY_BASE_PATH: '/learn',
  GUIKIT: {
    DEBOUNCE_ON_CHANGE_TIME: 150,
  },
  ENABLE_RECOMMENDER: true,
  OPTIMIZELY: {
    SDK_KEY: '7V4CJhurXT3Y3bnzv1hv1',
  },
  GAMIFICATION: {
    ORG_ID: '6052dd9b-ea80-494b-b258-edd1331e27a3',
    ENABLE_BADGE_UI: true,
  },
  PLATFORMUI_SITE_URL: 'https://platform-ui.topcoder-dev.com',
  DICE_VERIFY_URL: 'https://accounts-auth0.topcoder-dev.com',
  TIMELINE: {
    REJECTION_EVENT_REASONS: ['Duplicate Event', 'Violates the Topcoder terms', 'Inaccurate or Invalid'],
    ALLOWED_FILETYPES: ['image/jpeg', 'image/png', 'video/mp4', 'video/x-msvideo', 'video/webm'],
    FETCHING_PENDING_APPROVAL_EVENTS_INTERVAL: 5 * 60 * 1000, // 5 minutes
    FORUM_LINK: 'https://discussions.topcoder.com/discussion/24281/add-your-memory-to-the-topcoder-timeline-wall',
  },
};
