
require('dotenv').config()

const HDWalletProvider = require('@truffle/hdwallet-provider')

module.exports = {
  networks: {
    development: {
      host: process.env.TRUFFLE_HOST || '127.0.0.1', // Localhost (default: none)
      port: process.env.TRUFFLE_PORT || 7545, // Standard Ethereum port (default: none)
      network_id: process.env.TRUFFLE_NETWORK_ID || '*' // Any network (default: none)
    },
    
    ropsten: {
      provider: () => new HDWalletProvider(
        process.env.MNEMONIC,
        process.env.ETHEREUM_NODE_URL,
        ),
      // websockets: true,
      network_id: 3, // Ropsten's id
      gas: 7000000, // Ropsten has a lower block limit than mainnet
      //confirmations: 1, // # of confs to wait between deployments. (default: 0)
      timeoutBlocks: 50000, // # of blocks before a deployment times out  (minimum/default: 50)
      //skipDryRun: false // Skip dry run before migrations? (default: false for public nets )
    }
  },

  // Set default mocha options here, use special reporters etc.
  mocha: {
    timeout: 100000
  },

  // Configure your compilers
  compilers: {
    solc: {
      version: '0.6.2', // Fetch exact version from solc-bin (default: truffle's version)
      // docker: true,        // Use "0.5.1" you've installed locally with docker (default: false)
      settings: { // See the solidity docs for advice about optimization and evmVersion
        optimizer: {
          enabled: true,
          runs: 200
        }
      //  evmVersion: "byzantium"
      }
    }
  }
}
