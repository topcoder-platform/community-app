FROM node:8.2.1
LABEL version="1.0"
LABEL description="Community App"

# Create app directory
RUN mkdir -p /opt/app
ADD package.json /opt/app/package.json
WORKDIR /opt/app
RUN npm install

ADD . /opt/app

ARG BUILD_ENV=prod
ENV BABEL_ENV=production

# TODO: At the moment it should be fixed as "production", because otherwise
# extract-css-chunks-webpack-plugin attempts to be smarter than we need, and
# just breaks our fine setup. Once we get a fix merged into that plugin, we'll
# undo this hacky change.
ENV NODE_ENV=production
RUN npm run build

ENV NODE_ENV=$BUILD_ENV
EXPOSE 3000

CMD ["npm", "start"]
