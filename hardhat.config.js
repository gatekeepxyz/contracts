require('dotenv').config({path:__dirname+'/.env'});

require('hardhat/config').HardhatUserConfig;
require("@nomiclabs/hardhat-waffle");

module.exports = {
  defaultNetwork: "goerli",
  networks: {
    hardhat: {
    },
    goerli: {
      url: process.env.ALCHEMY_URL,
      accounts: [`0x${process.env.GUARDPK}`, `0x${process.env.RANDOMUSERPK}`]
    }
  },
  solidity: {
    version: "0.8.4",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts"
  },
  mocha: {
    timeout: 40000
  }
}