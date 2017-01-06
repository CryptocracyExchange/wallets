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

app.post('/apihooks/*', (req, res) => {
  // Emit event with the unique code.
  const uniqueID = req.path.split(path.split)[1];
  config.connection.events.emit(`confirmed-transfer-${uniqueID}`, {
    uniqueID,
    data: req.body,
  });
  res.sendStatus(200);
});

const port = process.env.NODE_ENV === 'prod' ? 8888 : 3000;

app.listen(port, () => {
  console.log(`API webhook listener listening on port ${port}!`);
});

generateWalletListener();
transferWalletListener();
