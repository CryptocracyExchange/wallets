const deepstream = require('deepstream.io-client-js');
const bcypherAPIKey = require('../../../.env');
const BCypher = require('blockcypher');

// [TODO]: Prep this for production deployment
module.exports = {
  connection: deepstream('localhost:6020').login(),
  btcapi: new BCypher('btc', 'main', bcypherAPIKey),
  ltcapi: new BCypher('ltc', 'main', bcypherAPIKey),
  dogeapi: new BCypher('doge', 'main', bcypherAPIKey),
};
