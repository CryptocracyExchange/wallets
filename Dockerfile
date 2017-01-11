FROM node:7.4-alpine

ENV DEEPSTREAM_AUTH_ROLE=provider \
    DEEPSTREAM_AUTH_USERNAME=wallets-service

RUN mkdir /usr/local/wallets
WORKDIR /usr/local/wallets
COPY . /usr/local/wallets
RUN npm install

CMD [ "npm", "run", "start-prod"]