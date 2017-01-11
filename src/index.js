const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const deepstream = require('deepstream.io-client-js');
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

const port = process.env.NODE_ENV === 'prod' ? 8888 : 3100;

app.listen(port, () => {
  console.log(`API webhook listener listening on port ${port}!`);
});

const deepstreamServer = process.env.NODE_ENV === 'prod' ? 'deepstream' : 'localhost';
const auth = process.env.NODE_ENV === 'prod' ? {
  role: process.env.DEEPSTREAM_AUTH_ROLE,
  username: process.env.DEEPSTREAM_AUTH_USERNAME,
  password: process.env.DEEPSTREAM_AUTH_PASSWORD } : {};
const connection = deepstream(`${deepstreamServer}:6020`).login(auth);

generateWalletListener(connection);
transferWalletListener(connection);
