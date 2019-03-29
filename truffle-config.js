const TestRPC = require('ganache-cli');
const HDWalletProvider = require('truffle-hdwallet-provider');

require('babel-polyfill');
require('babel-register')({
  ignore: /node_modules\/(?!zeppelin-solidity)/,
});

const mnemonic = process.env.MNEMONIC;

module.exports = {
  networks: {
    development: {
      provider: TestRPC.provider(),
      network_id: '*', // Match any network id
    },
    local: {
      host: 'localhost',
      port: 8545,
      network_id: '*', // Match any network id
    },
    coverage: {
      host: 'localhost',
      port: 8555,
      gas: 0xfffffffffff,
      gasPrice: 0x01,
      network_id: '*', // Match any network id
    },
    sokol: {
      provider() {
        return new HDWalletProvider(mnemonic, 'https://sokol.poa.network/');
      },
      network_id: 77,
    },
    core: {
      provider() {
        return new HDWalletProvider(mnemonic, 'https://core.poa.network/');
      },
      network_id: 99,
    },
  },
  compilers: {
    solc: {
      version: '0.5.7',
    },
  },
};
