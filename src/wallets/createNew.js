const config = require('./config/');

const deleteAllBTCHooks = () => {
  config.btcapi.listHooks((err, data) => {
    if (err) { console.log(err); }
    data.forEach((hook) => {
      config.btcapi.delHook(hook.id, (err, body) => {
        if (err) { console.log(err); }
      });
    });
  });
};

const deleteAllLTCHooks = () => {
  config.ltcapi.listHooks((err, data) => {
    if (err) { console.log(err); }
    data.forEach((hook) => {
      config.ltcapi.delHook(hook.id, (err, body) => {
        if (err) { console.log(err); }
      });
    });
  });
};

const deleteAllDOGEHooks = () => {
  config.dogeapi.listHooks((err, data) => {
    if (err) { console.log(err); }
    data.forEach((hook) => {
      config.dogeapi.delHook(hook.id, (err, body) => {
        if (err) { console.log(err); }
      });
    });
  });
};


module.exports = () => {
  const walletRecordCreator = (userID, type, walletData) => {
    const userWallet = config.connection.record.getRecord(`wallets/${userID}`);
    userWallet.whenReady((wallet) => {
      // Update wallet information.
      const urlID = config.connection.getUid();
      wallet.set(`${type}.privateKey`, walletData.private);
      wallet.set(`${type}.publicKey`, walletData.public);
      wallet.set(`${type}.address`, walletData.address);
      wallet.set(`${type}.wif`, walletData.wif);
      wallet.set(`${type}.uniqueID`, urlID);
      
      const webhook = {
        event: 'confirmed-tx',
        address: wallet.get(`${type}.address`),
        url: 'http://requestb.in/1a1ci3n1',
        // ProductionURL:
        // url: `http://${url}/apihooks/${urlID}`
      };

      if (type === 'BTC') {
        // Create new hook.
        config.btcapi.createHook(webhook, (err, data) => {
          if (err) { console.log(err); }
          console.log('created new hook');
          // Delete old hook.
          const oldHookID = wallet.get('BTC.hookID');
          config.btcapi.delHook(oldHookID, (err, data) => {
            if (err) { console.log(err); }
            console.log('deleted old hook');
            // Update new hook ID.
            wallet.set('BTC.hookID', data.id);
          });
        });
      }

      if (type === 'LTC') {
        // Create new hook.
        config.ltcapi.createHook(webhook, (err, data) => {
          if (err) { console.log(err); }
          // Delete old hook.
          const oldHookID = wallet.get('LTC.hookID');
          config.ltcapi.delHook(oldHookID, (err, body) => {
            if (err) { console.log(err); }
            // Update new hook ID.
            wallet.set('LTC.hookID', data.id);
          });
        });
      }

      if (type === 'DOGE') {
        // Create new hook.
        config.dogeapi.createHook(webhook, (err, data) => {
          if (err) { console.log(err); }
          // Delete old hook.
          const oldHookID = wallet.get('DOGE.hookID');
          config.dogeapi.delHook(oldHookID, (err, body) => {
            if (err) { console.log(err); }
            // Update new hook ID.
            wallet.set('DOGE.hookID', data.id);
          });
        });
      }
      // Listen for a single confirmed transaction with a unique ID.
      config.connection.once(`confirmed-transfer-${urlID}`, (data) => {
        config.connection.event.emit('updateBalance', { userID, currency: type, update: data });
      });
    });
  };

  config.connection.event.subscribe('wallet-create', (data) => {
    const createWalletCB = (err, walletInfo) => {
      if (err) {
        console.log(err);
      } else {
        walletRecordCreator(data.userID, data.currency, walletInfo);
      }
    };

    if (data.currency === 'BTC') {
      config.btcapi.genAddr(null, createWalletCB);
    }
    if (data.currency === 'LTC') {
      config.ltcapi.genAddr(null, createWalletCB);
    }
    if (data.currency === 'DOGE') {
      config.dogeapi.genAddr(null, createWalletCB);
    }
  });
};
