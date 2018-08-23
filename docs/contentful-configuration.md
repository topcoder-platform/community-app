# Integrate Hall of Fame with Contentful

## Contentful

### 1 Sign Up Contentful
You should register your own free Contentful account, and use it for development and testing

### 2 Install Contentful CLI:
```
$ npm install -g contentful-cli contentful-migration-cli
$ contentful login
```
Then import ./contentful.json file
```
$ contentful space import --space-id <DESTINATION_SPACE_ID> --content-file <JSON_FILE_TO_IMPORT> --content-model-only
```
### 3 Run Community App locally with Contentful account
In Contentful web-interface, generate API keys for [content delivery](https://www.contentful.com/developers/docs/references/content-delivery-api/) and [preview ](https://www.contentful.com/developers/docs/references/content-preview-api/) APIs.

### 3.a Configuring Contentful secrets configuration.

You can change the contentful keys under config/default.js under

```
SECRET: {
    CONTENTFUL: {
      default: { // Human-readable name of space
        SPACE_ID: "<YOUR_CONTENTFUL_SPACE_ID>",
        master: { // Name of an environment
          CDN_API_KEY: "<GENERATED CONTENT DELIVERY KEY>",
          PREVIEW_API_KEY: "<GENERATED CONTENT PREVIEW KEY>",
        },
      },
     // additional CMS space configurations
    },
```

Please note that we support multiple CMS usages parallely.
We just need to add additional space/environment/keys entries under SECRET/CONTENTFUL config.
Pelase see more details in below link :-
1) https://www.topcoder.com/challenges/30069015

### 3.b Configuring/Overriding default Contentful secrets configuration through environment vaiables.

On your system you can provide them to Community App via environment variables. The most convenient way is to create a setup file like this:

```
#!/bin/bash
export CONTENTFUL_DEFAULT_SPACE_ID="<YOUR_CONTENTFUL_SPACE_ID>"
export CONTENTFUL_DEFAULT_CDN_API_KEY="<GENERATED CONTENT DELIVERY KEY>"
export CONTENTFUL_DEFAULT_PREVIEW_API_KEY="<GENERATED CONTENT PREVIEW KEY>"
export CONTENTFUL_LOCAL_MODE=1
```

Please note that above CDN/Preview API Key should be from 'master' environment of your Contentful space as
current code only supports overriding keys for master environment of the specified space.
That is, currently there is no way to override default "cms environment" name through system environment variables.

Then, before running Community App from a new console, source it (provided you have named it set-contentful-env.sh), and then run the app:
```
$ source ./set-contentful-env.sh
$ NODE_CONFIG_ENV=development npm run dev
```
