FROM node:lts-alpine

# Install youtube-dl
RUN apk add --no-cache python
RUN apk add --no-cache youtube-dl

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./

RUN npm ci --only=production

# Bundle app source
COPY . .

# Run app
CMD npm start
