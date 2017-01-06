const expect = require('chai').expect;
// const deepstream = require('deepstream.io-client-js');
// const createNewWallet = require('../src/wallets/createNew');

describe('Create new wallets', () => {
  // const connection = deepstream('localhost:6020').login();

  beforeEach(() => {
    // createNewWallet();
  });

  it('Should listen for "wallet-create" events', () => {
    const expected = true;
    const actual = true;
    expect(actual).to.equal(expected);
  });

  it('Should make a BTC API call when the data.currency is BTC', () => {

  });

  it('Should make a LTC API call when the data.currency is LTC', () => {

  });

  it('Should make a DOGE API call when the data.currency is DOGE', () => {

  });

  afterEach(() => {
    // connection.off();
  });

  after(() => {
    // connection.close();
  });
});
