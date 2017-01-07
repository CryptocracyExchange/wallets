const config = require('./config/');
const hotWalletAddress = require('./hotWallets');

const createTransfer = (userID, currency, amount, outputAddress, connection) => {
  connection.event.subscribe(`hotWalletAddress-${currency}`, (wallet) => {
    const data = {
      inputs: [{ addresses: [wallet.address] }],
      outputs: [{ addresses: [outputAddress], value: parseFloat(amount) }],
    };

    const cb = (err, response) => {
      if (err) { console.log('Error', err); } else {
        console.log(response);
      }
    };

    if (currency === 'BTC') { config.btcapi.newTX(data, cb); }
    if (currency === 'LTC') { config.ltcapi.newTX(data, cb); }
    if (currency === 'DOGE') { config.dogeapi.newTX(data, cb); }
    connection.event.unsubscribe(`hotWalletAddress-${currency}`);
  });
  hotWalletAddress(currency, connection);
};

module.exports = (connection) => {
  connection.event.subscribe('wallet-transfer-out', (data) => {
    // Check balance
    // connection.event.subscribe('returnBalance', (returnData) => {
    //   if (data.userID === returnData.userID &&
    //       data.currency === returnData.currency &&
    //       returnData.currency > data.amount) {
    //     // Unsubscribe from the balance check if data matches
    //     connection.event.unsubscribe('returnBalance');
    //     if (returnData.amount >= data.amount) {
    createTransfer(data.userID, data.currency, data.amount, data.address, connection);
    //     } else {
    //       // Insufficient balance error to user...
    //     }
    //   }
    // });
    // connection.event.emit('checkBalance',
    // { userID: data.userID, currency: data.currency });
  });
};
