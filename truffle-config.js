const HDWalletProvider = require("@truffle/hdwallet-provider")
const infuraKey = process.env.INFURA_KEY
const pk = [process.env.PK]

module.exports = {
  networks: {
    development: {
      host: "127.0.0.1", // Localhost (default: none)
      port: 8545, // Standard Ethereum port (default: none)
      network_id: "*", // Any network (default: none)
    },
    develop: {
      port: 8545,
      network_id: 20,
      accounts: 5,
      defaultEtherBalance: 500,
      blockTime: 3,
    },
    rinkeby: {
      provider: () =>
        new HDWalletProvider(pk, `https://rinkeby.infura.io/v3/${infuraKey}`),
      network_id: 4, // Ropsten's id
      // gas: 7000000,        // Ropsten has a lower block limit than mainnet
      // confirmations: 1,    // # of confs to wait between deployments. (default: 0)
      timeoutBlocks: 200, // # of blocks before a deployment times out  (minimum/default: 50)
      skipDryRun: true, // Skip dry run before migrations? (default: false for public nets )
    },
    ropsten: {
      provider: () =>
        new HDWalletProvider(pk, `https://ropsten.infura.io/v3/${infuraKey}`),
      network_id: 3, // Ropsten's id
      // gas: 7000000,        // Ropsten has a lower block limit than mainnet
      // confirmations: 1,    // # of confs to wait between deployments. (default: 0)
      timeoutBlocks: 200, // # of blocks before a deployment times out  (minimum/default: 50)
      skipDryRun: true, // Skip dry run before migrations? (default: false for public nets )
    },
    main: {
      provider: () =>
        new HDWalletProvider(pk, `https://mainnet.infura.io/v3/${infuraKey}`),
      network_id: 1, // Ropsten's id
      gasPrice: 33000000000,
      // gas: 7000000,        // Ropsten has a lower block limit than mainnet
      // confirmations: 1,    // # of confs to wait between deployments. (default: 0)
      timeoutBlocks: 200, // # of blocks before a deployment times out  (minimum/default: 50)
      skipDryRun: true, // Skip dry run before migrations? (default: false for public nets )
    },
  },
  plugins: ["solidity-coverage"],
  
  // Set default mocha options here, use special reporters etc.
  mocha: {slow: 10000},

  // Configure your compilers
  compilers: {
    solc: {
      version: "0.6.12", // Fetch exact version from solc-bin (default: truffle's version)
      // docker: true,        // Use "0.5.1" you've installed locally with docker (default: false)
      settings: {
        // See the solidity docs for advice about optimization and evmVersion
        optimizer: {enabled: true, runs: 200},
        evmVersion: "istanbul",
      },
    },
  },
}
