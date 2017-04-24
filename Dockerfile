FROM node:6.10.2
LABEL version="1.0"
LABEL description="Community App"

# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Bundle app source

COPY . /usr/src/app
# Install app dependencies
RUN npm install

EXPOSE 3000

CMD ["npm", "start"]
