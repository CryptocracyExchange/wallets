const connection = require('./connection');
const api = require('./api');

module.exports = () => {
  const walletRecordCreator = (userID, type, walletData) => {
    const wallet = connection.record.getRecord(`wallets/${userID}/${type}`);
    wallet.set('userID', userID);
    wallet.set('currency', type);
    wallet.set('privateKey', walletData.private);
    wallet.set('publicKey', walletData.public);
    wallet.set('address', walletData.address);
    wallet.set('wif', walletData.wif);
    // if (type === 'BTC') {
    //   api.btcapi.createHook(); // Takes data and callback parameters.
    // }
    // if (type === 'LTC') {
    //   api.ltcapi.createHook(); // Takes data and callback parameters.
    // }
    // if (type === 'DOGE') {
    //   api.dogeapi.createHook(); // Takes data and callback parameters.
    // }
    // connection.event.subscribe('confirmed-transfer', (data) => {
    //   connection.event.emit('updateBalance', { userID: userID, currency: type, amount: data });
    // });
  };

  connection.event.subscribe('wallet-create', (data) => {
    const createWalletCB = (err, walletInfo) => {
      if (err) {
        // [TODO]: Properly handle errors... retry or give up and tell the client?
        console.log(err);
      } else {
        walletRecordCreator(data.userID, data.currency, walletInfo);
      }
    };

    if (data.currency === 'BTC') {
      api.btcapi.genAddr(null, createWalletCB);
    }
    if (data.currency === 'LTC') {
      api.ltcapi.genAddr(null, createWalletCB);
    }
    if (data.currency === 'DOGE') {
      api.dogeapi.genAddr(null, createWalletCB);
    }
  });
};
