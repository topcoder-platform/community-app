# Payload CMS compatibility environment setup

Community App retains Contentful-shaped route, schema, and environment-variable
names while content models are migrated. These names are compatibility
contracts only: the running application does not fall back to Contentful APIs
or asset hosts.

For each supported space, configure its legacy space identifier, Delivery and
Preview bearer keys, and the Payload compatibility host. Hosts must be Topcoder
Payload hostnames without a path. Missing hosts fail closed before an outbound
request is made.

```bash
# Default space
export CONTENTFUL_SPACE_ID="<DEFAULT_COMPATIBILITY_SPACE_ID>"
export CONTENTFUL_CDN_API_KEY="<PAYLOAD_DELIVERY_KEY>"
export CONTENTFUL_PREVIEW_API_KEY="<PAYLOAD_PREVIEW_KEY>"
export CONTENTFUL_CDN_API_HOST="cms.topcoder-dev.com"
export CONTENTFUL_PREVIEW_API_HOST="cms.topcoder-dev.com"

# EDU space
export CONTENTFUL_EDU_SPACE_ID="<EDU_COMPATIBILITY_SPACE_ID>"
export CONTENTFUL_EDU_CDN_API_KEY="<PAYLOAD_DELIVERY_KEY>"
export CONTENTFUL_EDU_PREVIEW_API_KEY="<PAYLOAD_PREVIEW_KEY>"
export CONTENTFUL_EDU_CDN_API_HOST="cms.topcoder-dev.com"
export CONTENTFUL_EDU_PREVIEW_API_HOST="cms.topcoder-dev.com"

# TopGear space
export CONTENTFUL_TOPGEAR_SPACE_ID="<TOPGEAR_COMPATIBILITY_SPACE_ID>"
export CONTENTFUL_TOPGEAR_CDN_API_KEY="<PAYLOAD_DELIVERY_KEY>"
export CONTENTFUL_TOPGEAR_PREVIEW_API_KEY="<PAYLOAD_PREVIEW_KEY>"
export CONTENTFUL_TOPGEAR_CDN_API_HOST="cms.topcoder-dev.com"
export CONTENTFUL_TOPGEAR_PREVIEW_API_HOST="cms.topcoder-dev.com"
```

Zurich and Comcast have no compatibility host variables in the application
configuration. Requests for those unsupported spaces fail closed; they must be
migrated and explicitly configured before they can serve live content again.

Configure the Payload application, its S3-backed public asset origin, and the
article-vote write-through endpoint separately:

```bash
export PAYLOAD_CMS_URL="https://cms.topcoder-dev.com"
export PAYLOAD_CMS_ASSET_URL="https://assets.topcoder-dev.com"
export CONTENTFUL_PAYLOAD_VOTE_API_URL="https://cms.topcoder-dev.com/contentful-management/votes"
export CONTENTFUL_PAYLOAD_MANAGEMENT_API_KEY="<PAYLOAD_SERVICE_CREDENTIAL>"
# Optional; defaults to 10000 and is clamped to the 1000-30000 ms range.
export CONTENTFUL_PAYLOAD_REQUEST_TIMEOUT_MS="10000"
```

The vote URL and credential are required for article voting. There is no
management-API fallback. Compatibility API and vote requests do not follow HTTP
redirects, and every request uses the bounded timeout above. Asset redirects are
accepted only when their destination matches `PAYLOAD_CMS_ASSET_URL`;
compatibility responses containing retired provider URLs are rejected.

Use production equivalents (`cms.topcoder.com` and `assets.topcoder.com`) in
production. Run `npm run verify:no-retired-cms-targets` after building to scan
runtime sources, deployment inputs, and generated assets for retired CMS API or
CDN URL targets.
