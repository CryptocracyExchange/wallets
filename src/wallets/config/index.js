const BCypher = require('blockcypher');

module.exports = {
  btcapi: new BCypher('btc', 'main', process.env.DEEPSTREAM_BCYPHERAPIKEY),
  ltcapi: new BCypher('ltc', 'main', process.env.DEEPSTREAM_BCYPHERAPIKEY),
  dogeapi: new BCypher('doge', 'main', process.env.DEEPSTREAM_BCYPHERAPIKEY),
};
