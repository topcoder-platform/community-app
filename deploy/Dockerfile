FROM node:6.10.2
LABEL version="1.0"
LABEL description="Community App"

# Create app directory
ADD package.json /tmp/package.json
RUN cd /tmp && npm install

RUN mkdir -p /opt/app && cp -a /tmp/node_modules /opt/app/
WORKDIR /opt/app
ADD . /opt/app

ARG BUILD_ENV=prod
RUN npm run build:$BUILD_ENV

EXPOSE 3000

CMD ["npm", "start"]
