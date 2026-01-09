module.exports = {
  API: {
    V2: 'https://api.topcoder.com/v2',
    V3: 'https://api.topcoder.com/v3',
    V4: 'https://api.topcoder.com/v4',
    V5: 'https://api.topcoder.com/v5',
    V6: 'https://api.topcoder.com/v6',
    ENGAGEMENTS: 'https://api.topcoder.com/v6/engagements',
  },
  AUTH0: {
    DOMAIN: 'topcoder.auth0.com',
  },
  CDN: {
    PUBLIC: 'https://community-app-cdn.topcoder.com',
  },
  COOKIES: {
    MAXAGE: 7,
    SECURE: true,
  },
  LOG_ENTRIES_TOKEN: '',
  SERVER_API_KEY: 'aa9ccf36-3936-450c-9983-097ddba51bef',
  GOOGLE_ANALYTICS_ID: 'UA-6340959-1',
  URL: {
    ARENA: 'https://arena.topcoder.com',
    APP: 'https://community-app.topcoder.com',

    /* This is the same value as above, but it is used by topcoder-react-lib,
     * as a more verbose name for the param. */
    COMMUNITY_APP: 'https://community-app.topcoder.com',
    CHALLENGES_URL: 'https://www.topcoder.com/challenges',
    COPILOTS_URL: 'https://copilots.topcoder.com',
    ENGAGEMENTS_APP: 'https://engagements.topcoder.com',
    TCO_OPEN_URL: 'https://www.topcoder.com/community/member-programs/topcoder-open',

    AUTH: 'https://accounts-auth0.topcoder.com',
    BASE: 'https://www.topcoder.com',
    HOME: '/home',
    COMMUNITY: 'https://community.topcoder.com',
    FORUMS: 'https://apps.topcoder.com/forums',
    FORUMS_VANILLA: 'https://discussions.topcoder.com',
    HELP: 'https://www.topcoder.com/thrive/tracks?track=Topcoder&tax=Help%20Articles',
    MEMBER: 'https://member.topcoder.com',
    ONLINE_REVIEW: 'https://software.topcoder.com',
    PAYMENT_TOOL: 'https://payment.topcoder.com',
    STUDIO: 'https://studio.topcoder.com',
    IOS: 'https://ios.topcoder.com',

    /* Connector URL of the TC accounts App. */
    ACCOUNTS_APP_CONNECTOR: 'https://accounts-auth0.topcoder.com/',
    TCO17: 'https://tco17.topcoder.com/',
    TCO19: 'https://tco19.topcoder.com/',

    TOPGEAR: 'https://topgear-app.wipro.com',

    COMMUNITY_API: 'http://localhost:8000',

    THRIVE: 'https://www.topcoder.com/thrive',

    COMMUNITIES: {
      BLOCKCHAIN: 'https://blockchain.topcoder.com',
      COGNITIVE: 'https://cognitive.topcoder.com',
      ZURICH: 'https://zurich.topcoder.com',
      COMCAST: 'https://comcast.topcoder.com',
      CS: 'https://cs.topcoder.com',
    },
    EMAIL_VERIFY_URL: 'http://www.topcoder.com/settings/account/changeEmail',
    THRIVE_FEED: 'https://topcoder.com/api/feeds/thrive',
    TIMELINE_WALL_API: 'https://api.topcoder.com/v5/timeline-wall',
    REVIEW_TYPES_API_URL: '/reviewTypes',
    REVIEW_SUMMATIONS_API_URL: '/reviewSummations',
  },

  REVIEW_APP_URL: 'https://review.topcoder.com',

  /* Filestack configuration for uploading Submissions
   * These are for the production back end */
  FILESTACK: {
    SUBMISSION_CONTAINER: 'topcoder-submissions-dmz',
  },

  ACCOUNT_MENU_SWITCH_TEXT: {
    title: 'Switch to BUSINESS',
    href: 'https://connect.topcoder.com?ref=nav',
  },
  HEADER_MENU: [
    {
      id: 'business',
      title: 'BUSINESS',
      href: 'https://www.topcoder.com?ref=nav',
    },
    {
      id: 'community', // required for 'Switch to BUSINESS' to work
      title: 'COMMUNITY',
      secondaryMenu: [
        {
          id: 'home',
          title: 'Home',
          href: '/home?ref=nav',
          logged: true,
        },
        {
          id: 'myprofile',
          title: 'My Profile',
          href: '/members/willFilledByUserName?ref=nav',
          logged: true,
        },
        {
          title: 'Payments',
          href: 'https://community.topcoder.com/PactsMemberServlet?module=PaymentHistory&full_list=false&ref=nav',
          logged: true,
          openNewTab: true,
        },
        {
          title: 'Overview',
          href: '/community/learn?ref=nav',
          logged: false,
        },
        {
          title: 'How It Works',
          href: '/thrive/tracks?track=Topcoder&ref=nav',
          logged: false,
        },
      ],
      subMenu: [
        {
          title: 'Compete',
          subMenu: [
            {
              title: 'All Challenges',
              href: '/challenges?ref=nav',
            },
            {
              title: 'Engagements',
              href: '/engagements?ref=nav',
            },
            {
              title: 'Competitive Programming',
              href: '/community/arena?ref=nav',
            },
            {
              title: 'Gig Work',
              href: '/gigs?ref=nav',
            },
            {
              title: 'Practice',
              href: '/community/practice?ref=nav',
            },
          ],
        },
        {
          title: 'Tracks',
          subMenu: [
            {
              title: 'Competitive Programming',
              href: '/thrive/tracks?track=Competitive%20Programming&ref=nav',
            },
            {
              title: 'Data Science',
              href: '/thrive/tracks?track=Data%20Science&ref=nav',
            },
            {
              title: 'Design',
              href: '/thrive/tracks?track=Design&ref=nav',
            },
            {
              title: 'Development',
              href: '/thrive/tracks?track=Development&ref=nav',
            },
            {
              title: 'QA',
              href: '/thrive/tracks?track=QA&ref=nav',
            },
          ],
        },
        {
          title: 'Explore',
          subMenu: [
            {
              title: 'TCO',
              href: '/community/member-programs/topcoder-open?ref=nav',
            },
            {
              title: 'Programs',
              href: '/community/member-programs?ref=nav',
            },
            {
              title: 'Forums',
              href: 'https://discussions.topcoder.com?ref=nav',
            },
            {
              title: 'Statistics',
              href: '/community/statistics?ref=nav',
            },
            {
              title: 'Blog',
              href: 'https://www.topcoder.com/blog?ref=nav',
              openNewTab: true,
            },
            {
              title: 'Thrive',
              href: '/thrive?ref=nav',
            },
          ],
        },
        {
          title: 'Discord',
          href: 'https://discord.gg/topcoder?ref=nav',
          openNewTab: true,
        },
        {
          title: 'Learn',
          href: 'https://platform-ui.topcoder.com/learn',
          openNewTab: true,
        },
      ],
    },
  ],
  HEADER_MENU_THEME: 'light',
  HEADER_AUTH_URLS: {
    href: 'https://accounts-auth0.topcoder.com?utm_source=community-app-main',
    location: 'https://accounts-auth0.topcoder.com?retUrl=%S&utm_source=community-app-main',
  },
  ACCOUNT_MENU: [
    {
      title: 'Settings',
      href: '/settings/account',
    },
    { separator: true },
    {
      title: 'Help',
      href: 'https://www.topcoder.com/thrive/tracks?track=Topcoder&tax=Help%20Articles&ref=nav',
    },
    { separator: true },
    {
      title: 'Log Out',
      href: 'https://www.topcoder.com/logout?ref=nav',
    },
  ],
  // Config for TC EDU - THRIVE
  TC_EDU_BASE_PATH: '/thrive',
  TC_EDU_TRACKS_PATH: '/tracks',
  TC_EDU_ARTICLES_PATH: '/articles',
  TC_EDU_SEARCH_PATH: '/search',
  TC_EDU_SEARCH_BAR_MAX_RESULTS_EACH_GROUP: 3,
  ENABLE_RECOMMENDER: false,
  PLATFORM_SITE_URL: 'https://platform.topcoder.com',
  PLATFORMUI_SITE_URL: 'https://platform-ui.topcoder.com',
  DICE_VERIFY_URL: 'https://accounts-auth0.topcoder.com',
  /* development id - makes surveys have warning about environment */
  UNIVERSAL_NAV_URL: '//uni-nav.topcoder.com/v1/tc-universal-nav.js',
  MEMBER_PROFILE_REDIRECT_URL: 'https://profiles.topcoder.com',
  MEMBER_SEARCH_REDIRECT_URL: 'https://talent-search.topcoder.com',
  ACCOUNT_SETTINGS_REDIRECT_URL: 'https://account-settings.topcoder.com',
};
