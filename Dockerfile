FROM node:alpine

WORKDIR /usr/local/wallets
RUN apk add --update git
RUN git clone https://github.com/CryptocracyExchange/wallets.git
RUN mv ./wallets/* ./
RUN npm install

# Link to volumes
# VOLUME [ "/usr/local/deepstream/conf", "/usr/local/deepstream/var" ]

# Define default command.
CMD [ "node", "./src/index.js"]

# Expose HTTP Port
EXPOSE 3000
# Expose TCP Port
# EXPOSE 6021