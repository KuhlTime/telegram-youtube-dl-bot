FROM node:lts-alpine

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./

RUN npm ci --only=production

# Bundle app source
COPY . .

# Install youtube-dl
RUN apk add --no-cache youtube-dl

# Run app
CMD npm start
