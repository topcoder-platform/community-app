# Builds production version of Community App inside Docker container,
# and runs it against the specified Topcoder backend (development or
# production) when container is executed.

FROM $IMAGE
LABEL app="Community App" version="1.0"

RUN npm install
RUN npm test
RUN npm run build
ENV NODE_ENV=$NODE_ENV

EXPOSE 3000
CMD ["npm", "start"]
