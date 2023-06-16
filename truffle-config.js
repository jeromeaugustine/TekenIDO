// Allows us to use ES6 in our migrations and tests.
require('babel-register');
const HDWalletProvider = require("@truffle/hdwallet-provider");
require('dotenv').config();
const privateKey = process.env.WALLET_PRIVATE_KEY;

module.exports = {
  networks: {
    live: {
      provider: function () {
        return new HDWalletProvider([privateKey], 'https://rpc.chiado.gnosis.gateway.fm')
      },
      network_id: 10200,
      /*host: "178.25.19.88", // Random IP for example purposes (do not use)
      port: 80,
      network_id: 1,        // Ethereum public network,
      */
    },
    development: {
      host: '127.0.0.1',
      port: 8545,
      network_id: '*'
    }
  },
  compilers: {
    solc: {
      version: "^0.8.9"
    }
  }
}