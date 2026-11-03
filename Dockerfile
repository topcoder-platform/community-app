# Builds production version of Community App inside Docker container,
# and runs it against the specified Topcoder backend (development or
# production) when container is executed.

FROM node:24.22.2-alpine3.24@sha256:8a32c8cf649a49915a66e81e7a609223c708d0adabf288ee3f4077d765542f85 AS tested-source
LABEL app="Community App" version="1.0"
RUN apk upgrade --no-cache && apk add --no-cache --virtual .build-deps git python3 make g++ \
    && addgroup -S -g 10001 appuser && adduser -S -D -u 10001 -G appuser appuser

WORKDIR /opt/app
COPY package.json package-lock.json ./
COPY tools ./tools

RUN chown -R appuser:appuser /opt/app
USER appuser

ENV NPM_CONFIG_LEGACY_PEER_DEPS=true NPM_CONFIG_INSTALL_LINKS=true

RUN npm ci
COPY --chown=appuser:appuser . .
RUN npm run test:security
RUN npm test

FROM tested-source AS development
ENV NODE_CONFIG_ENV=development CDN_URL=""
RUN npm run build

# The server loads its build configuration at runtime, so keep application
# dependencies, but exclude package managers and native build tools.
USER root
RUN apk del .build-deps \
    && rm -rf /usr/local/lib/node_modules/npm /usr/local/lib/node_modules/corepack /opt/yarn* \
      /usr/local/bin/npm /usr/local/bin/npx /usr/local/bin/corepack /usr/local/bin/yarn /usr/local/bin/yarnpkg \
      /home/appuser/.npm
ENV NODE_ENV=production BABEL_ENV=production
USER appuser
EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=5s --start-period=60s --retries=3 \
    CMD node -e "fetch('http://127.0.0.1:' + (process.env.PORT || '3000') + '/community-app-assets/manifest.json', {signal: AbortSignal.timeout(4000)}).then(r => process.exit(r.ok ? 0 : 1)).catch(() => process.exit(1))"
CMD ["node", "--max-old-space-size=8192", "./bin/www"]

FROM tested-source AS production
ENV NODE_CONFIG_ENV=production CDN_URL=""
RUN npm run build

# The server loads its build configuration at runtime, so keep application
# dependencies, but exclude package managers and native build tools.
USER root
RUN apk del .build-deps \
    && rm -rf /usr/local/lib/node_modules/npm /usr/local/lib/node_modules/corepack /opt/yarn* \
      /usr/local/bin/npm /usr/local/bin/npx /usr/local/bin/corepack /usr/local/bin/yarn /usr/local/bin/yarnpkg \
      /home/appuser/.npm
ENV NODE_ENV=production BABEL_ENV=production
USER appuser
EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=5s --start-period=60s --retries=3 \
    CMD node -e "fetch('http://127.0.0.1:' + (process.env.PORT || '3000') + '/community-app-assets/manifest.json', {signal: AbortSignal.timeout(4000)}).then(r => process.exit(r.ok ? 0 : 1)).catch(() => process.exit(1))"
CMD ["node", "--max-old-space-size=8192", "./bin/www"]
