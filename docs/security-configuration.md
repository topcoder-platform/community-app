# Security-sensitive configuration

Credential defaults in the tracked configuration files are intentionally
empty. Supply credentials at runtime using the mappings in
`config/custom-environment-variables.js`; never add a real value to a tracked
configuration file.

## Server-only credentials

The following values must come from the deployment secret store when their
corresponding integration is enabled:

- `SERVER_API_KEY`
- `LOG_ENTRIES_TOKEN`
- `AUTH_SECRET`
- `CHAMELEON_VERIFICATION_SECRET`
- `CONTENTFUL_MANAGEMENT_TOKEN`
- the `CONTENTFUL_*_CDN_API_KEY` and `CONTENTFUL_*_PREVIEW_API_KEY` variables
- `TC_M2M_CLIENT_SECRET` (along with the related M2M client configuration)
- `COGNITIVE_NEWSLETTER_SIGNUP_APIKEY`
- `MAILCHIMP_API_KEY`
- `OPEN_EXCHANGE_RATES_KEY`
- `RECRUITCRM_API_KEY`
- `SENDGRID_API_KEY`
- `GSHEETS_API_KEY`
- `GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY`

Do not pass these values as Docker build arguments. Inject them into the
running container from the deployment platform's secret store. Rotate a
credential immediately if it has ever been committed, exposed in a build log,
or embedded in an image layer.

### Contentful

Published content in the default space uses `CONTENTFUL_SPACE_ID` and
`CONTENTFUL_CDN_API_KEY`. Preview requests additionally require
`CONTENTFUL_PREVIEW_API_KEY`. Configure the corresponding space-prefixed
variables (for example, `CONTENTFUL_EDU_SPACE_ID` and
`CONTENTFUL_EDU_CDN_API_KEY`) only for the additional spaces enabled in that
deployment.

Contentful clients are created lazily for the requested space, environment,
and delivery mode. A missing optional-space or preview credential therefore
does not disable unrelated routes. A request that actually needs an
unconfigured Contentful service reports the exact missing runtime variable;
the deployment must supply that credential for the CMS content to render.

## Browser-visible integration keys

`AUTH0_CLIENT_ID`, `FILESTACK_API_KEY`, `SEGMENT_IO_API_KEY`, and
`OPTIMIZELY_SDK_KEY` are delivered to browser code. They cannot be treated as
confidential. Configure a separate value for each environment and use each
provider's origin, domain, operation, and quota restrictions to limit abuse.
They still belong in deployment configuration rather than tracked source.

## Local development

Export only the variables needed for the integration being exercised. Keep
local values in an untracked shell or secret-manager file. The server can run
with optional integration credentials empty, but authenticated server routes
require a strong, randomly generated `AUTH_SECRET`.

The JMeter plan reads its M2M credentials from JMeter properties. Pass them at
runtime as `-JTC_M2M_CLIENT_ID=...` and `-JTC_M2M_CLIENT_SECRET=...`; never save
the values in the `.jmx` file.
