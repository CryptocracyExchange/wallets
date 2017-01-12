const config = require('./config/');

// const deleteAllBTCHooks = () => {
//   config.btcapi.listHooks((err, data) => {
//     if (err) { console.log(err); }
//     data.forEach((hook) => {
//       config.btcapi.delHook(hook.id, (hookErr) => {
//         if (err) { console.log(hookErr); }
//       });
//     });
//   });
// };

// const deleteAllLTCHooks = () => {
//   config.ltcapi.listHooks((err, data) => {
//     if (err) { console.log(err); }
//     data.forEach((hook) => {
//       config.ltcapi.delHook(hook.id, (hookErr) => {
//         if (err) { console.log(hookErr); }
//       });
//     });
//   });
// };

// const deleteAllDOGEHooks = () => {
//   config.dogeapi.listHooks((err, data) => {
//     if (err) { console.log(err); }
//     data.forEach((hook) => {
//       config.dogeapi.delHook(hook.id, (hookErr) => {
//         if (err) { console.log(hookErr); }
//       });
//     });
//   });
// };

module.exports = (connection) => {
  const walletRecordCreator = (userID, type, walletData) => {
    const userWallet = connection.record.getRecord(`wallets/${userID}`);
    userWallet.whenReady((wallet) => {
      // Update wallet information.
      const urlID = connection.getUid();
      wallet.set(`${type}.privateKey`, walletData.private);
      wallet.set(`${type}.publicKey`, walletData.public);
      wallet.set(`${type}.address`, walletData.address);
      wallet.set(`${type}.wif`, walletData.wif);
      wallet.set(`${type}.uniqueID`, urlID);
      console.log(`Set ${type} address (${walletData.address}) for ${userID}.`);

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
          // Delete old hook.
          const oldHookID = wallet.get('BTC.hookID');
          config.btcapi.delHook(oldHookID, (hookErr) => {
            if (err) { console.log(hookErr); }
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
          config.ltcapi.delHook(oldHookID, (hookErr) => {
            if (err) { console.log(hookErr); }
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
          config.dogeapi.delHook(oldHookID, (hookErr) => {
            if (err) { console.log(hookErr); }
            // Update new hook ID.
            wallet.set('DOGE.hookID', data.id);
          });
        });
      }
      // Listen for a single confirmed transaction with a unique ID.
      connection.once(`confirmed-transfer-${urlID}`, (data) => {
        connection.event.emit('updateBalance', { userID, currency: type, update: data });
        // [TODO]: Save transaction to new record set
        // [TODO]: Transfer to hot wallet
      });
    });
  };

  connection.event.subscribe('wallet-create', (data) => {
    const createWalletCB = (err, walletInfo) => {
      if (err) {
        console.log(err);
      } else {
        walletRecordCreator(data.userID, data.currency, walletInfo);
      }
    };

    console.log(`Generating ${data.currency} address for ${data.userID}.`);
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
