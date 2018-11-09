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

On your system you should provide them to Community App via environment variables. The most convenient way is to create a setup file like this:

```
#!/bin/bash
export CONTENTFUL_CDN_API_KEY="<GENERATED CONTENT DELIVERY KEY>"
export CONTENTFUL_LOCAL_MODE=1
export CONTENTFUL_PREVIEW_API_KEY="<GENERATED CONTENT PREVIEW KEY>"
export CONTENTFUL_SPACE_ID="<YOUR_CONTENTFUL_SPACE_ID>"
```

Then, before running Community App from a new console, source it (provided you have named it set-contentful-env.sh), and then run the app:
```
$ source ./set-contentful-env.sh
$ NODE_CONFIG_ENV=development npm run dev
```