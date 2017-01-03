class Addresses extends React.Component{ // eslint-disable-line
  constructor(props){
    super(props);
    this.state = {
      userID: props.userID,
      BTCAddress: '',
      LTCAddress: '',
      DOGEAddress: ''
    }

    this.client = deepstream('localhost:6020').login();
    this.btcWallet = this.client.record.getRecord(`wallets/${props.userID}/BTC`);
    this.ltcWallet = this.client.record.getRecord(`wallets/${props.userID}/LTC`);
    this.dogeWallet = this.client.record.getRecord(`wallets/${props.userID}/DOGE`);
  }

  componentWillMount() {
    this.btcWallet.subscribe('address', (address) => {
      this.setState({ BTCAddress: address });
    });
    this.ltcWallet.subscribe('address', (address) => {
      this.setState({ LTCAddress: address });
    });
    this.dogeWallet.subscribe('address', (address) => {
      this.setState({ DOGEAddress: address });
    });
  }

  componentWillUnmount() {
    this.btcWallet.unsubscribe();
    this.ltcWallet.unsubscribe();
    this.dogeWallet.unsubscribe();
  }

  handleGenerateWalletClick(type) {
    this.client.event.emit('wallet-create', { userID: 'userID', currency: type });
  }

  render() {
    return React.createElement('div', null,
      React.createElement('h3', null, 'Generate Wallets'),
      React.createElement('button', { onClick: () => this.handleGenerateWalletClick('BTC') }, 'Generate BTC Address'),
      React.createElement('button', { onClick: () => this.handleGenerateWalletClick('LTC') }, 'Generate LTC Address'),
      React.createElement('button', { onClick: () => this.handleGenerateWalletClick('DOGE') }, 'Generate DOGE Address'),
      React.createElement('div', null, `BTC Address: ${this.state.BTCAddress}`),
      React.createElement('div', null, `LTC Address: ${this.state.LTCAddress}`),
      React.createElement('div', null, `DOGE Address: ${this.state.DOGEAddress}`) // eslint-disable-line
    );
  }
}

class Transfers extends React.Component {
  constructor(props) {
    super(props);
  }
  handleTransferClick(currency, amount) {
    this.client.event.emit('wallet-transfer-out', { type: type, amount: amount});
  }
  render() {
    return React.createElement('div', null,
           React.createElement('h3', null, 'Transfer Out'),
           React.createElement('input', { placeholder: 'Enter your address' }, null), // send it a place-holder
           React.createElement('input', { placeholder: 'Enter your amount' }, null), // send it a place-holder
           React.createElement('button', { onClick: () => this.handleGenerateWalletClick('BTC') }, 'Submit Transfer'));
  }
}

const App = () => (
  React.createElement('div', { userID: 'userID' },
  React.createElement('h1', null, 'Cryptocracy - Wallets'),
  React.createElement(Addresses, { userID: 'userID' }, null),
  React.createElement(Transfers, { userID: 'userID' }, null))
);

ReactDOM.render(
  React.createElement(App, { userID: 'userID' }, null),
  document.getElementById('app') // eslint-disable-line
);
