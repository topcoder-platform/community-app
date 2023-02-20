module.exports = {
  API: {
    V2: 'https://api.topcoder-qa.com/v2',
    V3: 'https://api.topcoder-qa.com/v3',
    V4: 'https://api.topcoder-qa.com/v4',
    V5: 'https://api.topcoder-qa.com/v5',
  },
  AUTH0: {
    DOMAIN: 'topcoder-qa.auth0.com',
  },
  CDN: {
    PUBLIC: 'https://d1aahxkjiobka8.cloudfront.net',
  },
  COOKIES: {
    MAXAGE: 7,
    SECURE: true,
  },
  LOG_ENTRIES_TOKEN: '',
  URL: {
    ARENA: 'https://arena.topcoder-qa.com',
    APP: 'https://community-app.topcoder-qa.com',

    /* This is the same value as above, but it is used by topcoder-react-lib,
     * as a more verbose name for the param. */
    COMMUNITY_APP: 'https://community-app.topcoder-qa.com',
    CHALLENGES_URL: 'https://www.topcoder-qa.com/challenges',
    TCO_OPEN_URL: 'https://www.topcoder-qa.com/community/member-programs/topcoder-open',

    AUTH: 'https://accounts-auth0.topcoder-qa.com',
    BASE: 'https://www.topcoder-qa.com',
    HOME: '/home',
    COMMUNITY: 'https://community.topcoder-qa.com',
    FORUMS: 'https://apps.topcoder-qa.com/forums',
    FORUMS_VANILLA: 'https://discussions.topcoder-qa.com',
    HELP: 'https://www.topcoder-qa.com/thrive/tracks?track=Topcoder&tax=Help%20Articles',
    SUBMISSION_REVIEW: 'https://submission-review.topcoder-qa.com',
    MEMBER: 'https://member.topcoder-qa.com',
    ONLINE_REVIEW: 'https://software.topcoder-qa.com',
    PAYMENT_TOOL: 'https://payment.topcoder-qa.com',
    STUDIO: 'https://studio.topcoder-qa.com',
    IOS: 'https://ios.topcoder-qa.com',

    /* Connector URL of the TC accounts App. */
    ACCOUNTS_APP_CONNECTOR: 'https://accounts-auth0.topcoder-qa.com/',
    TCO17: 'https://tco17.topcoder-qa.com/',
    TCO19: 'https://tco19.topcoder-qa.com/',

    TOPGEAR: 'https://topgear-app.wipro.com',

    COMMUNITY_API: 'http://localhost:8000',

    THRIVE: 'https://www.topcoder-qa.com/thrive',

    COMMUNITIES: {
      BLOCKCHAIN: 'https://blockchain.topcoder-qa.com',
      COGNITIVE: 'https://cognitive.topcoder-qa.com',
      ZURICH: 'https://zurich.topcoder-qa.com',
      COMCAST: 'https://comcast.topcoder-qa.com',
      CS: 'https://cs.topcoder-qa.com',
    },
    EMAIL_VERIFY_URL: 'http://www.topcoder-qa.com/settings/account/changeEmail',
    THRIVE_FEED: 'https://topcoder-qa.com/api/feeds/thrive',
    TIMELINE_WALL_API: 'https://api.topcoder-qa.com/v5/timeline-wall',
  },
  /* Filestack configuration for uploading Submissions
   * These are for the production back end */
  FILESTACK: {
    SUBMISSION_CONTAINER: 'topcoder-submissions-dmz',
  },

  ACCOUNT_MENU_SWITCH_TEXT: {
    title: 'Switch to BUSINESS',
    href: 'https://connect.topcoder-qa.com?ref=nav',
  },
  HEADER_MENU: [
    {
      id: 'business',
      title: 'BUSINESS',
      href: 'https://www.topcoder-qa.com?ref=nav',
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
          href: 'https://community.topcoder-qa.com/PactsMemberServlet?module=PaymentHistory&full_list=false&ref=nav',
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
              href: 'https://discussions.topcoder-qa.com?ref=nav',
            },
            {
              title: 'Statistics',
              href: '/community/statistics?ref=nav',
            },
            {
              title: 'Blog',
              href: 'https://www.topcoder-qa.com/blog?ref=nav',
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
          href: 'https://platform-ui.topcoder-qa.com/learn',
          openNewTab: true,
        },
      ],
    },
  ],
  HEADER_MENU_THEME: 'light',
  HEADER_AUTH_URLS: {
    href: 'https://accounts-auth0.topcoder-qa.com?utm_source=community-app-main',
    location: 'https://accounts-auth0.topcoder-qa.com?retUrl=%S&utm_source=community-app-main',
  },
  ACCOUNT_MENU: [
    {
      title: 'Settings',
      href: '/settings/profile?ref=nav',
    },
    { separator: true },
    {
      title: 'Help',
      href: 'https://www.topcoder-qa.com/thrive/tracks?track=Topcoder&tax=Help%20Articles&ref=nav',
    },
    { separator: true },
    {
      title: 'Log Out',
      href: 'https://www.topcoder-qa.com/logout?ref=nav',
    },
  ],
  // Config for TC EDU - THRIVE
  TC_EDU_BASE_PATH: '/thrive',
  TC_EDU_TRACKS_PATH: '/tracks',
  TC_EDU_ARTICLES_PATH: '/articles',
  TC_EDU_SEARCH_PATH: '/search',
  TC_EDU_SEARCH_BAR_MAX_RESULTS_EACH_GROUP: 3,
  ENABLE_RECOMMENDER: true,
  PLATFORM_SITE_URL: 'https://platform.topcoder-qa.com',
  PLATFORMUI_SITE_URL: 'https://platform-ui.topcoder-qa.com',
  DICE_VERIFY_URL: 'https://accounts-auth0.topcoder-qa.com',
  /* development id - makes surveys have warning about environment */
  UNIVERSAL_NAV_URL: '//uni-nav.topcoder-qa.com/v1/tc-universal-nav.js',
};
