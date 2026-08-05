# Topcoder authentication library compatibility adapter

The upstream `@topcoder-platform/tc-auth-lib@1.0.2` source mixes CommonJS
`require()` calls with ESM `export` declarations in the same files. Node 24
detects those files as ESM and rejects the CommonJS calls before the Community
App server can start.

This package preserves the public API using consistent CommonJS modules. It
also restricts connector messages to the configured iframe and its exact
origin. The adapter can be removed once the upstream package publishes an
equivalent Node-compatible release.
