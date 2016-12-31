const deepstream = require('deepstream.io-client-js');
const BTC = require('bitcoinjs-lib');

const connection = deepstream('localhost:6020').login();

exports.generateWalletListener = () => {
  connection.event.subscribe('wallets', (data) => {
    // create new record out of generated wallets
    const newBTCAddress = BTC.ECPair.makeRandom();
    const userWalletsRecord = connection.record.getRecord(`wallets/${data.UserID}/BTC/${connection.getUid()}`);
    userWalletsRecord.set('BTCWalletAddress', newBTCAddress.getAddress());
    userWalletsRecord.set('BTCWalletKey', newBTCAddress.toWIF());
    console.log(userWalletsRecord.get('BTCWalletAddress'));
  });
};
