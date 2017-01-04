const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const config = require('./wallets/config/');
const generateWalletListener = require('./wallets/createNew');
const transferWalletListener = require('./wallets/transferOut');

const app = express();
app.use(morgan('combined'));
app.use(bodyParser.json());
app.use('/', express.static(path.join(__dirname, '../public')));

app.post('/apihooks/*', (req, res) => {
  // Emit event with the unique code.
  config.connection.events.emit(`confirmed-transfer-${req.path.split(path.split)[1]}`, {
    uniqueID: req.path.split(path.split)[1],
    data: req.body,
  });
  res.send(200);
});

app.listen(3000, () => {
  console.log('Example app listening on port 3000!');
});

generateWalletListener();
transferWalletListener();
