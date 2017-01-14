const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const WalletsProvider = require('./walletsClass');

const app = express();
app.use(morgan('combined'));
app.use(bodyParser.json());

// app.post('/apihooks/*', (req, res) => {
//   // Emit event with the unique code.
//   const uniqueID = req.path.split(path.split)[1];
//   connection.events.emit(`confirmed-transfer-${uniqueID}`, {
//     uniqueID,
//     data: req.body,
//   });
//   res.sendStatus(200);
// });

const port = process.env.NODE_ENV === 'prod' ? 8888 : 3100;

app.listen(port, () => {
  console.log(`API webhook listener listening on port ${port}!`);
});

const wallets = new WalletsProvider({
  /**
   * Only use 1 for production!
   * 0 = logging off
   * 1 = only log connection events & errors
   * 2 = also log subscriptions and discards
   * 3 = log outgoing messages
   */
  logLevel: process.env.NODE_ENV === 'prod' ? 1 : 3,
  deepstreamUrl: `${process.env.NODE_ENV === 'prod' ? 'deepstream' : 'localhost'}:6020`,
  deepstreamCredentials: process.env.NODE_ENV === 'prod' ? {
    role: process.env.DEEPSTREAM_AUTH_ROLE,
    username: process.env.DEEPSTREAM_AUTH_USERNAME,
    password: process.env.DEEPSTREAM_AUTH_PASSWORD
  } : {},
  webhookCallbackURL: process.env.WALLETS_WEBHOOK_CB_URL,
  BlockCypherAPIKey: '474a91ec1ed740feb92bfacdc98e30ae'
});

wallets.start();
