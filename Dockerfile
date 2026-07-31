# syntax=docker/dockerfile:1.7

# Pin the complete multi-platform image digest so builds cannot silently pick up
# a different base image. Renovate/Dependabot can update the tag and digest
# together when a patched Node image is published.
ARG NODE_IMAGE=node:24.18.0-alpine3.23@sha256:595398b0081eacda8e1c4c5b97b76cd1020e4d58a8ebcb4843b9bca1e79e7436
ARG NODE_BUILD_IMAGE=node:24.18.0-alpine3.23@sha256:595398b0081eacda8e1c4c5b97b76cd1020e4d58a8ebcb4843b9bca1e79e7436

FROM ${NODE_BUILD_IMAGE} AS development-dependencies

WORKDIR /opt/app

# Native build tools stay isolated in the disposable builder stages. The
# Alpine runtime stage below never receives them.
RUN apk add --no-cache git python3 make g++ \
  && git config --global url."https://github.com/".insteadOf "git://github.com/"

COPY package.json package-lock.json .npmrc ./
COPY vendor ./vendor

RUN npm ci

FROM development-dependencies AS test

ENV CI=true

COPY . .

RUN npm test

FROM test AS build

ARG CDN_URL
ARG NODE_CONFIG_ENV=production

ENV BABEL_ENV=production \
    CDN_URL=${CDN_URL} \
    NODE_CONFIG_ENV=${NODE_CONFIG_ENV} \
    NODE_ENV=production

# The browser bundle is built as before. Server/shared sources are then
# precompiled so the runtime does not need Babel or the Webpack toolchain.
RUN npm run build \
  && ./node_modules/.bin/babel src \
    --out-dir /opt/runtime-src \
    --copy-files \
    --extensions ".js,.jsx" \
  && rm -rf \
    /opt/runtime-src/client \
    /opt/runtime-src/styles \
    /opt/runtime-src/test \
  && find /opt/runtime-src -type f \
    ! -name "*.js" \
    ! -name "*.json" \
    -delete \
  && install --directory /opt/runtime-src/assets/images \
  && install --mode=0644 \
    src/assets/images/favicon.ico \
    /opt/runtime-src/assets/images/favicon.ico

FROM development-dependencies AS production-dependencies

ENV NODE_ENV=production

RUN npm prune --omit=dev --ignore-scripts \
  && npm cache clean --force

FROM ${NODE_IMAGE} AS runtime

LABEL org.opencontainers.image.title="Topcoder Community App" \
      org.opencontainers.image.description="Topcoder Community App web server"

ARG CDN_URL
ARG NODE_CONFIG_ENV=production

ENV BABEL_ENV=production \
    CDN_URL=${CDN_URL} \
    NODE_CONFIG_ENV=${NODE_CONFIG_ENV} \
    NODE_ENV=production \
    PORT=3000

WORKDIR /opt/app

# The application starts Node directly, so package-manager executables and
# their dependency trees are unnecessary attack surface in production.
RUN rm -rf \
    /opt/yarn-* \
    /usr/local/lib/node_modules/corepack \
    /usr/local/lib/node_modules/npm \
  && rm -f \
    /usr/local/bin/corepack \
    /usr/local/bin/npm \
    /usr/local/bin/npx \
    /usr/local/bin/yarn \
    /usr/local/bin/yarnpkg

COPY --from=production-dependencies --chown=node:node /opt/app/vendor ./vendor
COPY --from=production-dependencies --chown=node:node /opt/app/node_modules ./node_modules
COPY --from=build --chown=node:node /opt/app/build ./build
COPY --from=build --chown=node:node /opt/app/.build-info ./.build-info
COPY --from=build --chown=node:node /opt/runtime-src ./src
COPY --from=build --chown=node:node \
  /opt/app/config/custom-environment-variables.js \
  /opt/app/config/default.js \
  /opt/app/config/development.js \
  /opt/app/config/production.js \
  /opt/app/config/qa.js \
  ./config/
COPY --from=build --chown=node:node /opt/app/config/contentful ./config/contentful
COPY --chown=node:node package.json ./package.json
COPY --chown=node:node bin/runtime.js ./bin/runtime.js

USER node

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=30s --retries=3 \
  CMD ["node", "-e", "const http=require('http');const req=http.get({host:'127.0.0.1',port:process.env.PORT||3000,path:'/api/cdn/public/ping',timeout:3000},res=>{res.resume();process.exit(res.statusCode===200?0:1);});req.on('timeout',()=>{req.destroy();process.exit(1);});req.on('error',()=>process.exit(1));"]

STOPSIGNAL SIGTERM

CMD ["node", "--max-old-space-size=8192", "bin/runtime.js"]
