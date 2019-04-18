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
