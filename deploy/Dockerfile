FROM node:6.10.2
LABEL version="1.0"
LABEL description="Community App"

# Create app directory
RUN mkdir -p /opt/app
ADD package.json /opt/app/package.json
WORKDIR /opt/app
RUN npm install

ADD . /opt/app

ARG BUILD_ENV=prod
RUN npm run build:$BUILD_ENV

EXPOSE 3000

CMD ["npm", "start"]
