FROM node:13.7.0-alpine

# Set environment variables
ARG NODE_ENV=production
ARG PUBLIC_PATH

ENV NODE_ENV=$NODE_ENV
ENV PUBLIC_PATH=$PUBLIC_PATH

# Install NPM dependencies
ADD package.json /var/repo/
ADD yarn.lock /var/repo/
WORKDIR /var/repo
RUN yarn

# Clone built files
ADD public /var/repo/public

# Run
CMD npm start
