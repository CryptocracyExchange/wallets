FROM node:7.4-alpine

WORKDIR /usr/local/wallets
COPY . /usr/local/wallets
RUN npm install

ENV DEEPSTREAM_AUTH_ROLE=provider \
    DEEPSTREAM_AUTH_USERNAME=wallets-service

# Define default command.
CMD [ "npm", "run", "start-prod"]

# Expose API webhook listener port.
EXPOSE 8888