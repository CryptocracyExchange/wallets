const deepstream = require('deepstream.io-client-js');
// [TODO]: Prep this for production deployment
module.exports = deepstream('localhost:6020').login();
