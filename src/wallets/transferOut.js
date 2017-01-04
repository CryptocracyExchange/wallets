const config = require('./config/');

module.exports = () => {
  // const transferWalletCB = (err, response) => {
  //   if (err) {
  //     console.log(err);
  //   } else {
  //     walletRecordCreator(data.userID, data.action.split('-')[2], walletInfo);
  //   }
  // };

  config.connection.event.subscribe('wallet-transfer-out', (data) => {
    // Setup balance return listener
    config.connection.event.subscribe('returnBalance', (returnData) => {
      if (data.userID === returnData.userID && // These should be handled with permissions.
          data.currency === returnData.currency &&
          returnData.currency > data.amount) {
        // [Todo]: Initiate transfer
        if (data.currency === 'BTC') {
          if (returnData.amount >= data.amount) {
            config.btcapi.newTX();
          } else {
            // Throw error to user...
          }
        }
        if (data.currency === 'LTC') {
          if (returnData.amount >= data.amount) {
            config.ltcapi.newTX();
          } else {
            // Throw error to user...
          }
        }
        if (data.currency === 'DOGE') {
          if (returnData.amount >= data.amount) {
            config.dogeapi.newTX();
          } else {
            // Throw error to user...
          }
        }
        // Unsubscribe from the balance check
        config.connection.event.unsubscribe('returnBalance');
      }
    });
    config.connection.event.emit('checkBalance', { userID: data.userID, currency: data.type });
  });
};
