const bcypherAPIKey = require('../../.env');
const deepstream = require('deepstream.io-client-js');
const BCypher = require('blockcypher');

const btcapi = new BCypher('btc', 'main', bcypherAPIKey);
const ltcapi = new BCypher('ltc', 'main', bcypherAPIKey);
const dogeapi = new BCypher('doge', 'main', bcypherAPIKey);

const connection = deepstream('localhost:6020').login();

exports.generateWalletListener = () => {
  const walletRecordCreator = (userID, type, walletData) => {
    const wallet = connection.record.getRecord(`wallets/${userID}/${type}`);
    wallet.set('userID', userID);
    wallet.set('currency', type);
    wallet.set('privateKey', walletData.private);
    wallet.set('publicKey', walletData.public);
    wallet.set('address', walletData.address);
    wallet.set('wif', walletData.wif);
    // create listener for webhook
  };

  connection.event.subscribe('wallets', (data) => {
    // get address from API
    if (data.action === 'generate-wallet-BTC') {
      btcapi.genAddr(null, (err, walletInfo) => {
        if (err) {
          console.log(err);
          // think about how to effectively handle errors... retry or give up and tell the client?
        } else {
          const type = data.action.split('-')[2];
          walletRecordCreator(data.userID, type, walletInfo);
        }
      });
    }
    if (data.action === 'generate-wallet-LTC') {
      ltcapi.genAddr(null, (err, walletInfo) => {
        if (err) {
          console.log(err);
          // think about how to effectively handle errors... retry or give up and tell the client?
        } else {
          // generate record
          const type = data.action.split('-')[2];
          walletRecordCreator(data.userID, type, walletInfo);
        }
      });
    }
    if (data.action === 'generate-wallet-DOGE') {
      dogeapi.genAddr(null, (err, walletInfo) => {
        if (err) {
          console.log(err);
          // think about how to effectively handle errors... retry or give up and tell the client?
        } else {
          // generate record
          const type = data.action.split('-')[2];
          walletRecordCreator(data.userID, type, walletInfo);
        }
      });
    }
  });
};
