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

  connection.event.subscribe('wallet-create', (data) => {
    const createWalletCB = (err, walletInfo) => {
      if (err) {
        // think about how to effectively handle errors... retry or give up and tell the client?
        console.log(err);
      } else {
        walletRecordCreator(data.userID, data.action.split('-')[2], walletInfo);
      }
    };

    if (data.action === 'generate-wallet-BTC') {
      btcapi.genAddr(null, createWalletCB);
    }
    if (data.action === 'generate-wallet-LTC') {
      ltcapi.genAddr(null, createWalletCB);
    }
    if (data.action === 'generate-wallet-DOGE') {
      dogeapi.genAddr(null, createWalletCB);
    }
  });
};

exports.transferWalletListener = () => {
  // const transferWalletCB = (err, response) => {
  //   if (err) {
  //     console.log(err);
  //   } else {
  //     walletRecordCreator(data.userID, data.action.split('-')[2], walletInfo);
  //   }
  // };

  connection.event.subscribe('wallet-transfer', (data) => {
    // Setup balance return listener
    connection.event.subscribe('returnBalance', (returnData) => {
      if (data.userID === returnData.userID && // These should be handled with permissions.
          data.currency === returnData.currency &&
          returnData.currency > data.amount) {
        // [Todo]: Initiate transfer
        if (data.currency === 'BTC') {
          if(returnData.amount >= data.amount) {
            btcapi.newTX();
          } else {
            // Throw error to user...
          }
          
        }
        if (data.currency === 'LTC') {

        }
        if (data.currency === 'DOGE') {
          
        }
        // Unsubscribe from the balance check
        connection.event.unsubscribe('returnBalance');
      }
    });
    connection.event.emit('checkBalance', { userID: data.userID, currency: data.type });
    // 
    // btcapi.genAddr(null, transferWalletCB);

  });
}