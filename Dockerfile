# Builds production version of Community App inside Docker container,
# and runs it against the specified Topcoder backend (development or
# production) when container is executed.

FROM node:8.11.2
LABEL app="Community App" version="1.0"

WORKDIR /opt/app
COPY . .


################################################################################
# Testing and build of the application inside the container.

RUN npm install
RUN npm test
RUN npm run build

EXPOSE 3000
CMD ["npm", "start"]

