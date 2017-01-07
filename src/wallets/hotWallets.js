const config = require('./config/');

const generateHotWallets = (currency, connection) => {
  const createWalletCB = (err, walletData) => {
    if (err) { console.log(err); } else {
      const hotWallet = connection.record.getRecord(`hotwallets/${currency}`);
      hotWallet.whenReady((wallet) => {
        wallet.set('privateKey', walletData.private);
        wallet.set('publicKey', walletData.public);
        wallet.set('address', walletData.address);
        wallet.set('wif', walletData.wif);
        connection.event.emit(`hotWalletAddress-${currency}`, { address: walletData.address });
      });
    }
  };

  if (currency === 'BTC') {
    config.btcapi.genAddr(null, createWalletCB);
  }
  if (currency === 'LTC') {
    config.ltcapi.genAddr(null, createWalletCB);
  }
  if (currency === 'DOGE') {
    config.dogeapi.genAddr(null, createWalletCB);
  }
};

module.exports = (currency, connection) => {
  connection.record.snapshot(`hotwallets/${currency}`, (err, wallet) => {
    if (err === 'RECORD_NOT_FOUND') {
      generateHotWallets(currency, connection);
    } else if (!err) {
      connection.event.emit(`hotWalletAddress-${currency}`, { address: wallet.address });
    } else {
      console.log(err);
    }
  });
};
