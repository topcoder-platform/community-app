module.exports = {
  API: {
    V2: 'https://api.topcoder.com/v2',
    V3: 'https://api.topcoder.com/v3',
    V4: 'https://api.topcoder.com/v4',
    V5: 'https://api.topcoder.com/v5',
  },
  AUTH0: {
    DOMAIN: 'topcoder.auth0.com',
  },
  CDN: {
    PUBLIC: 'https://d2nl5eqipnb33q.cloudfront.net',
  },
  COOKIES: {
    MAXAGE: 7,
    SECURE: true,
  },
  LOG_ENTRIES_TOKEN: '',
  SERVER_API_KEY: 'aa9ccf36-3936-450c-9983-097ddba51bef',
  URL: {
    ARENA: 'https://arena.topcoder.com',
    APP: 'https://community-app.topcoder.com',

    /* This is the same value as above, but it is used by topcoder-react-lib,
     * as a more verbose name for the param. */
    COMMUNITY_APP: 'https://community-app.topcoder.com',

    AUTH: 'https://accounts.topcoder.com',
    BASE: 'https://www.topcoder.com',
    COMMUNITY: 'https://community.topcoder.com',
    FORUMS: 'https://apps.topcoder.com/forums',
    HELP: 'https://help.topcoder.com',
    MEMBER: 'https://member.topcoder.com',
    ONLINE_REVIEW: 'https://software.topcoder.com',
    PAYMENT_TOOL: 'https://payment.topcoder.com',
    STUDIO: 'https://studio.topcoder.com',
    IOS: 'https://ios.topcoder.com',

    /* Connector URL of the TC accounts App. */
    ACCOUNTS_APP_CONNECTOR: 'https://accounts.topcoder.com/connector.html',
    TCO17: 'https://tco17.topcoder.com/',

    TOPGEAR: 'https://topgear-app.wipro.com',

    COMMUNITY_API: 'http://localhost:8000',

    COMMUNITIES: {
      BLOCKCHAIN: 'https://blockchain.topcoder.com',
      COGNITIVE: 'https://cognitive.topcoder.com',
      ZURICH: 'https://zurich.topcoder.com',
    },
    EMAIL_VERIFY_URL: 'http://www.topcoder.com/settings/account/changeEmail',
  },
  /* Filestack configuration for uploading Submissions
   * These are for the production back end */
  FILESTACK: {
    SUBMISSION_CONTAINER: 'topcoder-submissions-dmz',
  },

  ACCOUNT_MENU_SWITCH_TEXT: {
    title: 'Switch to BUSINESS',
    href: 'https://connect.topcoder.com',
  },
  HEADER_MENU: [
    {
      id: 'business',
      title: 'BUSINESS',
      href: 'https://www.topcoder.com',
    },
    {
      id: 'community', // required for 'Switch to BUSINESS' to work
      title: 'COMMUNITY',
      secondaryMenuForLoggedInUser: [
        {
          title: 'Dashboard',
          href: '/my-dashboard',
        },
        {
          id: 'myprofile',
          title: 'My Profile',
          href: '/members/willFilledByUserName',
        },
        {
          title: 'Payments',
          href: 'https://community.topcoder.com/PactsMemberServlet?module=PaymentHistory&full_list=false',
        },
      ],
      secondaryMenuForGuest: [
        {
          title: 'Overview',
          href: '/community/learn',
        },
        {
          title: 'How It Works',
          href: '/thrive/tracks?track=Topcoder',
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
              href: 'https://arena.topcoder.com',
            },
          ],
        },
        {
          title: 'Tracks',
          subMenu: [
            {
              title: 'Competitive Programming',
              href: '/community/competitive-programming',
            },
            {
              title: 'Data Science',
              href: '/community/data-science',
            },
            {
              title: 'Design',
              href: '/community/design',
            },
            {
              title: 'Development',
              href: '/community/development',
            },
            {
              title: 'QA',
              href: '/community/qa',
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
              href: 'https://apps.topcoder.com/forums',
            },
            {
              title: 'Statistics',
              href: '/community/statistics',
            },
            {
              title: 'Events',
              href: '/community/events',
            },
            {
              title: 'Blog',
              href: 'https://www.topcoder.com/blog',
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
    href: 'https://accounts.topcoder.com/member/registration?utm_source=community-app-main',
    location: 'https://accounts.topcoder.com/member?retUrl=%S&utm_source=community-app-main',
  },
  ACCOUNT_MENU: [
    {
      title: 'Settings',
      href: '/settings/profile',
    },
    { separator: true },
    {
      title: 'Help',
      href: 'https://help.topcoder.com/',
    },
    { separator: true },
    {
      title: 'Log Out',
      href: 'https://www.topcoder.com/logout',
    },
  ],
  // Config for TC EDU - THRIVE
  TC_EDU_BASE_PATH: '/thrive',
  TC_EDU_TRACKS_PATH: '/tracks',
  TC_EDU_ARTICLES_PATH: '/articles',
  TC_EDU_SEARCH_PATH: '/search',
  TC_EDU_SEARCH_BAR_MAX_RESULTS_EACH_GROUP: 3,
};
