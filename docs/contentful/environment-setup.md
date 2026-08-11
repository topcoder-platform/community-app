# Environment Setup

It is not feasible to have a common Contentful environment for development. You
should register your own free Contentful account, and use it for development and
testing. To facilitate review of your solution, provide reviewers with access to
your Contentful space.

To sync with the current config of Topcoder's Contentful account, install
[Contentful CLI](https://www.npmjs.com/package/contentful-cli):
```bash
$ npm install -g contentful-cli contentful-migration-cli
$ contentful login
```

Then download and import
[the TC core](https://github.com/topcoder-platform/community-app/blob/develop/config/contentful/tc-core.json) file which will create all core content types used by Topcoder integration:
```bash
$ contentful space import --space-id <DESTINATION_SPACE_ID> --content-file <JSON_FILE_TO_IMPORT> --content-model-only
```

To run Community App locally against your Contentful account:
1.  In Contentful web-interface, generate API keys for
    [content delivery](https://www.contentful.com/developers/docs/references/content-delivery-api/)
    and [preview](https://www.contentful.com/developers/docs/references/content-preview-api/) APIs.
2.  On your system you should provide them to Community App via environment
    variables. The most convenient way is to create a setup file like this:
    ```bash
    #!/bin/bash
    export CONTENTFUL_CDN_API_KEY="<GENERATED CONTENT DELIVERY KEY>"
    export CONTENTFUL_LOCAL_MODE=1
    export CONTENTFUL_PREVIEW_API_KEY="<GENERATED CONTENT PREVIEW KEY>"
    export CONTENTFUL_SPACE_ID="<YOUR_CONTENTFUL_SPACE_ID>"
    ```
    Then, before running Community App from a new console, source it (provided
    you have named it `set-contentful-env.sh`), and then run the app:
    ```bash
    $ source ./set-contentful-env.sh
    $ NODE_CONFIG_ENV=development npm run dev
    ```
    We have prepared a demo env file you could use to start. You can find it
    [here](https://gist.github.com/kkartunov/594dc65f76bac6aa800b4764cae72d2e).

### Using the Payload CMS compatibility API

Community App can migrate spaces independently while retaining Contentful for
spaces that have not been exported. Set the Delivery and Preview host variables
only for the migrated spaces; values are hostnames without a path. Existing API
keys remain the bearer credentials for the compatibility API.

```bash
# Default space
export CONTENTFUL_CDN_API_HOST="cms.topcoder-dev.com"
export CONTENTFUL_PREVIEW_API_HOST="cms.topcoder-dev.com"

# EDU space
export CONTENTFUL_EDU_CDN_API_HOST="cms.topcoder-dev.com"
export CONTENTFUL_EDU_PREVIEW_API_HOST="cms.topcoder-dev.com"

# TopGear space
export CONTENTFUL_TOPGEAR_CDN_API_HOST="cms.topcoder-dev.com"
export CONTENTFUL_TOPGEAR_PREVIEW_API_HOST="cms.topcoder-dev.com"
```

Zurich and Comcast continue to use Contentful unless host variables are added
for those spaces in a later migration. To store EDU article votes in Payload,
also set the full write endpoint and its service credential:

```bash
export CONTENTFUL_PAYLOAD_VOTE_API_URL="https://cms.topcoder-dev.com/contentful-management/votes"
export CONTENTFUL_PAYLOAD_MANAGEMENT_API_KEY="<PAYLOAD_SERVICE_CREDENTIAL>"
```

When the Payload vote URL is unset, Community App retains the existing
Contentful Management API update-and-publish behavior.
