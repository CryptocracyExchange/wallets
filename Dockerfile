FROM node:7.4-alpine

WORKDIR /usr/local/wallets
RUN apk add --update git
RUN git clone https://github.com/CryptocracyExchange/wallets.git
RUN mv ./wallets/* ./
RUN npm install

ENV DEEPSTREAM_AUTH_ROLE=provider \
    DEEPSTREAM_AUTH_USERNAME=wallets-service

# Link to volumes
# VOLUME [ "/usr/local/wallets" ]

# Define default command.
CMD [ "node", "/usr/local/wallets/src/index.js"]

EXPOSE 88