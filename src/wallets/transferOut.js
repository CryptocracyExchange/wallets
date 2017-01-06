const config = require('./config/');
const hotWalletAddress = require('./hotWallets');

const createTransfer = (userID, currency, amount, outputAddress) => {
  config.connection.event.subscribe(`hotWalletAddress-${currency}`, (wallet) => {
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
    config.connection.event.unsubscribe(`hotWalletAddress-${currency}`);
  });
  hotWalletAddress(currency);
};

module.exports = () => {
  config.connection.event.subscribe('wallet-transfer-out', (data) => {
    // Check balance
    // config.connection.event.subscribe('returnBalance', (returnData) => {
    //   if (data.userID === returnData.userID &&
    //       data.currency === returnData.currency &&
    //       returnData.currency > data.amount) {
    //     // Unsubscribe from the balance check if data matches
    //     config.connection.event.unsubscribe('returnBalance');
    //     if (returnData.amount >= data.amount) {
    createTransfer(data.userID, data.currency, data.amount, data.address);
    //     } else {
    //       // Insufficient balance error to user...
    //     }
    //   }
    // });
    // config.connection.event.emit('checkBalance',
    // { userID: data.userID, currency: data.currency });
  });
};
