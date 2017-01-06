const deepstream = require('deepstream.io-client-js');
const BCypher = require('blockcypher');

const deepstreamServer = process.env.NODE_ENV === 'prod' ? 'deepstream' : 'localhost';

module.exports = {
  connection: deepstream(`${deepstreamServer}:6020`).login({ role: process.env.DEEPSTREAM_AUTH_ROLE, username: process.env.DEEPSTREAM_AUTH_USERNAME, password: process.env.DEEPSTREAM_AUTH_PASSWORD }),
  btcapi: new BCypher('btc', 'main', process.env.DEEPSTREAM_BCYPHERAPIKEY),
  ltcapi: new BCypher('ltc', 'main', process.env.DEEPSTREAM_BCYPHERAPIKEY),
  dogeapi: new BCypher('doge', 'main', process.env.DEEPSTREAM_BCYPHERAPIKEY),
};
