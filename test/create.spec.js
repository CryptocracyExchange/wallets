const request = require('request');
const expect = require('chai').expect;
const sinon = require('sinon');

describe('Wallets Service', function() {
  // beforeEach(function(done) {
  //   request
  //     .get('http://localhost:6030/health-check')
  //     .on('response', function() {
  //       client.login(null, function(success) { if (success) { done(); } });
  //     });
  // });

  describe('Create listeners', function() {
    it('Should create listener for "wallet-create" events', function() {

    });

    // it('Should create listener for "wallet-transfer-out" events', function(done) {
    //   listeners.transferListener(client);
    //   setTimeout(function() {
    //     const actual = client.hasListeners('wallet-transfer-out');
    //     expect(actual).to.equal(true);
    //     done();
    //   }, 100);
    // });
  });


  // afterEach(function() {
  //   client.close();
  // });

  // after(function() {
  //   server.stop();
  // });

  // describe('Create Wallet Record', function() {
  //   it('Should create a wallet record', function(done) {
  //     const userID = 'testuser';
  //     const currency = 'BTC';
  //     const data = {
  //       private: 111,
  //       public: 222,
  //       address: 333,
  //       wif: 444,
  //     };
  //     createHelpers.walletRecordCreator(client, userID, currency, data);

  //     setTimeout(function() {
  //       client.record.snapshot(`wallets/${userID}`, function(err, recordData) {
  //         expect(err).to.equal(null);
  //         expect(recordData.BTC.private).to.equal(111);
  //         expect(recordData.BTC.public).to.equal(222);
  //         expect(recordData.BTC.address).to.equal(333);
  //         expect(recordData.BTC.wif).to.equal(444);
  //         expect(recordData.BTC.uniqueID).not.to.equal(client.getUid());
  //         done();
  //       });
  //     }, 100);
  //   });
});
