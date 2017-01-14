const BCypher = require('blockcypher');
const DeepstreamClient = require('deepstream.io-client-js');
const EventEmitter = require('events').EventEmitter;
const util = require('util');

let providerContext;
const Provider = function (config) {
  this.isReady = false;
  this._config = config;
  this._logLevel = config.logLevel !== undefined ? config.logLevel : 1;
  this._deepstreamClient = null;
  this._webhookCBURL = config.webhookCallbackURL;
  providerContext = this;
};

util.inherits(Provider, EventEmitter);

Provider.prototype.start = function () {
  this._initialiseDeepstreamClient();
};

Provider.prototype.stop = function () {
  this._deepstreamClient.close();
};

Provider.prototype.log = function (message, level) {
  if (this._logLevel < level) {
    return;
  }
  const date = new Date();
  const time = `${date.toLocaleTimeString()}:${date.getMilliseconds()}`;
  console.log(`${time}::Wallets::${message}`);
};

Provider.prototype._initialiseDeepstreamClient = function () {
  this.log('Initialising Deepstream connection', 1);

  if (this._config.deepstreamClient) {
    this._deepstreamClient = this._config.deepstreamClient;
    this.log('Deepstream connection established', 1);
    this._ready();
  } else {
    if (!this._config.deepstreamUrl) {
      throw new Error('Can\'t connect to deepstream, neither deepstreamClient nor deepstreamUrl were provided', 1);
    }

    if (!this._config.deepstreamCredentials) {
      throw new Error('Missing configuration parameter deepstreamCredentials', 1);
    }

    this._deepstreamClient = new DeepstreamClient(this._config.deepstreamUrl);
    this._deepstreamClient.on('error', (error) => {
      console.log(error);
    });
    this._deepstreamClient.login(
      this._config.deepstreamCredentials,
      this._onDeepstreamLogin.bind(this)
      );
  }
};

Provider.prototype._onDeepstreamLogin = function (success, error, message) {
  if (success) {
    this.log('Connection to Deepstream established', 1);
    this._ready();
  } else {
    this.log(`Can't connect to Deepstream: ${message}`, 1);
  }
};

Provider.prototype._ready = function () {
  this._createListener();
  // this._transferListener();
  this.log('Provider ready', 1);
  this.isReady = true;
  this.emit('ready');
};

Provider.prototype._bcAPI = function (currency) {
  if (!this._config.BlockCypherAPIKey) {
    throw new Error('Can\'t generate BlockCypher API. An API key was not provided', 1);
  }
  return new BCypher(currency.toLowerCase(), 'main', this._config.BlockCypherAPIKey);
};

Provider.prototype._createListener = function () {
  this._deepstreamClient.event.subscribe('wallet-create', function (requestData) {
    providerContext.log('Created wallet-create listener.', 1);
    providerContext._bcAPI(requestData.currency).genAddr(null, function (err, newWalletData) {
      if (err) {
        console.log(err);
      } else {
        providerContext._walletRecordCreator(requestData, newWalletData);
      }
    });
  });
};

Provider.prototype._walletRecordCreator = (requestData, walletData) => {
  // TODO: store historical wallets in another table
  providerContext._deepstreamClient.record.getRecord(`wallets/${requestData.userID}`).whenReady((wallet) => {
    const hookID = providerContext._deepstreamClient.getUid();
    wallet.set(`${requestData.currency}.privateKey`, walletData.private);
    wallet.set(`${requestData.currency}.publicKey`, walletData.public);
    wallet.set(`${requestData.currency}.address`, walletData.address);
    wallet.set(`${requestData.currency}.wif`, walletData.wif);
    wallet.set(`${requestData.currency}.hookID`, hookID);
    // providerContext._generateWebhook(wallet, requestData.currency, hookID);
    wallet.discard();
  });
};

Provider.prototype._generateWebhook = function (wallet, currency, hookID) {
  const webhook = {
    event: 'confirmed-tx',
    address: wallet.get(`${currency}.address`),
    url: `http://${providerContext._webhookCBURL}/apihooks/${hookID}`
  };

  providerContext._bcAPI(currency).createHook(webhook, (err, data) => {
    if (err) { console.log(err); }
    providerContext.log('Webhook created', 3);
    // [TODO]: Delete old hooks.
    // const oldHookID = wallet.get(`${currency}.hookID`);
    // providerContext._bcAPI(currency).delHook(oldHookID, (hookErr) => {
    //   if (err) { console.log(hookErr); }
    // });
  });

  // Listen for a single confirmed transaction with a unique ID.
  providerContext._deepstreamClient.once(`confirmed-transfer-${urlID}`, (data) => {
    providerContext._deepstreamClient.event.emit('updateBalance', { userID, currency, update: data });
    // [TODO]: Save transaction to new record set
    // [TODO]: Transfer to hot wallet
  });
};

Provider.prototype._transferListener = function () {
  providerContext._deepstreamClient.event.subscribe('wallet-transfer-out', function (data) {
    // Check balance
    providerContext._deepstreamClient.event.subscribe('returnBalance', function (returnData) {
      if (data.userID === returnData.userID &&
          data.currency === returnData.currency &&
          returnData.currency > data.amount) {
        // Unsubscribe from the balance check if data matches
        providerContext._deepstreamClient.event.unsubscribe('returnBalance');
        if (returnData.amount >= data.amount) {
          providerContext._createTransfer(providerContext._deepstreamClient, data);
        } else {
          // Insufficient balance error to user...
        }
      }
    });
    providerContext._deepstreamClient.event.emit(
      'checkBalance',
      { userID: data.userID, currency: data.currency }
    );
  });
};

Provider.prototype._createTransfer = function (data, connection) {
  providerContext._deepstreamClient.event.subscribe(`hotWalletAddress-${data.currency}`, function (wallet) {
    const obj = {
      inputs: [{ addresses: [wallet.address] }],
      outputs: [{ addresses: [data.address], value: parseFloat(data.amount) }],
    };

    const cb = function (err, response) {
      if (err) { console.log('Error', err); } else {
        console.log(response);
      }
    };

    providerContext._bcAPI(data.currency).newTX(obj, cb);
    providerContext._deepstreamClient.event.discard(`hotWalletAddress-${data.currency}`);
  });
  providerContext._hotWalletAddress(data.currency, connection);
};

Provider.prototype._deleteAllHooks = function (currency) {
  providerContext._bcAPI(currency).listHooks(function (err, data) {
    if (err) { console.log(err); }
    data.forEach(function (hook) {
      providerContext._bcAPI(currency).delHook(hook.id, function (hookErr) {
        if (err) { console.log(hookErr); }
      });
    });
  });
};

Provider.prototype._generateHotWallets = function (currency) {
  const createWalletCB = function (err, walletData) {
    if (err) { console.log(err); } else {
      providerContext._deepstreamClient.record
        .getRecord(`hotwallets/${currency}`)
        .whenReady(function (wallet) {
          wallet.set('privateKey', walletData.private);
          wallet.set('publicKey', walletData.public);
          wallet.set('address', walletData.address);
          wallet.set('wif', walletData.wif);
          providerContext._deepstreamClient.event.emit(`hotWalletAddress-${currency}`, { address: walletData.address });
        });
    }
  };
  providerContext._bcAPI(currency).genAddr(null, createWalletCB);
};

Provider.prototype._checkForExistingHotWallets = function (currency) {
  providerContext._deepstreamClient.record.snapshot(`hotwallets/${currency}`, (err, wallet) => {
    if (err === 'RECORD_NOT_FOUND') {
      providerContext._generateHotWallets(currency);
    } else if (!err) {
      providerContext._deepstreamClient.event.emit(`hotWalletAddress-${currency}`, { address: wallet.address });
    } else {
      console.log(err);
    }
  });
};

module.exports = Provider;
