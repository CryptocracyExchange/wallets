const bcypherAPIKey = require('../../.env');
const BCypher = require('blockcypher');

exports.btcapi = new BCypher('btc', 'main', bcypherAPIKey);
exports.ltcapi = new BCypher('ltc', 'main', bcypherAPIKey);
exports.dogeapi = new BCypher('doge', 'main', bcypherAPIKey);
