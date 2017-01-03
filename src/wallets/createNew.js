const connection = require('./connection');
const api = require('./api');

module.exports = () => {
  const walletRecordCreator = (userID, type, walletData) => {
    const wallet = connection.record.getRecord(`wallets/${userID}`);
    // wallet.set({ userID });
    if (type === 'BTC') {
      wallet.set('BTC.privateKey', walletData.private);
      wallet.set('BTC.publicKey', walletData.public);
      wallet.set('BTC.address', walletData.address);
      wallet.set('BTC.wif', walletData.wif);
      // api.btcapi.createHook(); // Takes data and callback parameters.
    }
    if (type === 'LTC') {
      wallet.set('LTC.privateKey', walletData.private);
      wallet.set('LTC.publicKey', walletData.public);
      wallet.set('LTC.address', walletData.address);
      wallet.set('LTC.wif', walletData.wif);
      // api.ltcapi.createHook(); // Takes data and callback parameters.
    }
    if (type === 'DOGE') {
      wallet.set('DOGE.privateKey', walletData.private);
      wallet.set('DOGE.publicKey', walletData.public);
      wallet.set('DOGE.address', walletData.address);
      wallet.set('DOGE.wif', walletData.wif);
      // api.dogeapi.createHook(); // Takes data and callback parameters.
    }
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
