/* Specifies environment variables, which, when set, will override their
 * counterparts from configuration files. */

module.exports = {
  CONTENTFUL: {
    LOCAL_MODE: 'CONTENTFUL_LOCAL_MODE',
  },
  AUTH0: {
    CLIENT_ID: 'AUTH0_CLIENT_ID',
  },

  LOG_ENTRIES_TOKEN: 'LOG_ENTRIES_TOKEN',
  MOCK_TERMS_SERVICE: 'MOCK_TERMS_SERVICE',

  NEWSLETTER_SIGNUP: {
    COGNITIVE: {
      APIKEY: 'COGNITIVE_NEWSLETTER_SIGNUP_APIKEY',
      URL: 'COGNITIVE_NEWSLETTER_SIGNUP_URL',
    },
  },

  FILESTACK: {
    API_KEY: 'FILESTACK_API_KEY',
    SUBMISSION_CONTAINER: 'FILESTACK_SUBMISSION_CONTAINER',
  },

  SEGMENT_IO_API_KEY: 'SEGMENT_IO_API_KEY',
  SERVER_API_KEY: 'SERVER_API_KEY',

  SECRET: {

    CONTENTFUL: {
      default: {
        SPACE_ID: 'CONTENTFUL_SPACE_ID',
        master: {
          CDN_API_KEY: 'CONTENTFUL_CDN_API_KEY',
          PREVIEW_API_KEY: 'CONTENTFUL_PREVIEW_API_KEY',
        },
      },
      topgear: {
        SPACE_ID: 'CONTENTFUL_TOPGEAR_SPACE_ID',
        master: {
          CDN_API_KEY: 'CONTENTFUL_TOPGEAR_CDN_API_KEY',
          PREVIEW_API_KEY: 'CONTENTFUL_TOPGEAR_PREVIEW_API_KEY',
        },
      },
    },

    MAILCHIMP: {
      default: {
        API_KEY: 'MAILCHIMP_API_KEY',
        MAILCHIMP_BASE_URL: 'MAILCHIMP_BASE_URL',
      },
    },

    OPEN_EXCHANGE_RATES_KEY: 'OPEN_EXCHANGE_RATES_KEY',
  },
};
