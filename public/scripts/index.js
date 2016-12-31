const client = deepstream('localhost:6020').login();

const record = client.record.getRecord('some-name');

const input = document.querySelector('input');

input.onkeyup = (() => {
  record.set('firstname', input.value);
});

record.subscribe('firstname', (value) => {
  input.value = value;
  // client.event.emit('wallets', { "user": "browser", "action": "generate-wallet-BTC" });
});

function generateWalletBTC() {
  client.event.emit('wallets', { "user": "UserID", "action": "generate-wallet-BTC" });
};

function generateWalletLTC() {
  client.event.emit('wallets', { "user": "UserID", "action": "generate-wallet-LTC" });
};

function generateWalletETH() {
  client.event.emit('wallets', { "user": "UserID", "action": "generate-wallet-ETH" });
};