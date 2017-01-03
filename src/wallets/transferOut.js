const connection = require('./connection');
const api = require('./api');

module.exports = () => {
  // const transferWalletCB = (err, response) => {
  //   if (err) {
  //     console.log(err);
  //   } else {
  //     walletRecordCreator(data.userID, data.action.split('-')[2], walletInfo);
  //   }
  // };

  connection.event.subscribe('wallet-transfer-out', (data) => {
    // Setup balance return listener
    connection.event.subscribe('returnBalance', (returnData) => {
      if (data.userID === returnData.userID && // These should be handled with permissions.
          data.currency === returnData.currency &&
          returnData.currency > data.amount) {
        // [Todo]: Initiate transfer
        if (data.currency === 'BTC') {
          if (returnData.amount >= data.amount) {
            api.btcapi.newTX();
          } else {
            // Throw error to user...
          }
        }
        if (data.currency === 'LTC') {
          if (returnData.amount >= data.amount) {
            api.ltcapi.newTX();
          } else {
            // Throw error to user...
          }
        }
        if (data.currency === 'DOGE') {
          if (returnData.amount >= data.amount) {
            api.dogeapi.newTX();
          } else {
            // Throw error to user...
          }
        }
        // Unsubscribe from the balance check
        connection.event.unsubscribe('returnBalance');
      }
    });
    connection.event.emit('checkBalance', { userID: data.userID, currency: data.type });
  });
};
