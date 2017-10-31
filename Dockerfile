# Builds production version of Community App inside Docker container,
# and runs it against the specified Topcoder backend (development or
# production) when container is executed.

FROM node:8.2.1
LABEL app="Community App" version="1.0"

WORKDIR /opt/app
COPY . .

RUN npm install
RUN npm test
RUN npm run build

ARG NODE_ENV
ARG FILESTACK_API_KEY
ARG FILESTACK_SUBMISSION_CONTAINER

RUN echo $FILESTACK_API_KEY

EXPOSE 3000
CMD ["npm", "start"]
