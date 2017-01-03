const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const connection = require('./wallets/connection');
const generateWalletListener = require('./wallets/createNew');
const transferWalletListener = require('./wallets/transferOut');

const app = express();
app.use(morgan('combined'));
app.use(bodyParser.json());
app.use('/', express.static(path.join(__dirname, '../public')));
// [TODO]: Add a random string (uniquely associated with a wallet address)
// to the end of this url for better security.
app.post('/apihooks', (req, res) => {
  // Test to find out what req.body has included with it...
  // connection.events.emit('confirmed-transfer', {});
  res.send(200);
});

app.listen(3000, () => {
  console.log('Example app listening on port 3000!');
});

generateWalletListener();
transferWalletListener();
