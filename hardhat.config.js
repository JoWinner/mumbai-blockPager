require("@nomiclabs/hardhat-waffle");
// require("@nomiclabs/hardhat-toolbox");
require("dotenv").config();
require('hardhat-contract-sizer');
const MAINNET_URL = process.env.VITE_MAINNET_URL;
const MUMBAI_URL = process.env.VITE_MUMBAI_URL;
const DEPLOYER_KEY = process.env.VITE_DEPLOYER_KEY;
const ALCHEMY_MUMBAI_URL = process.env.VITE_ALCHEMY_MUMBAI_URL;

const chainIds = {
  hardhat: 1337,
  mumbai: 80001,
  mainnet: 137,
};


module.exports = {
  defaultNetwork: "mumbai",
  networks: {
    hardhat: {
      chainId: chainIds.mumbai,
    },

    matic: {
      url: MAINNET_URL,
      accounts: [DEPLOYER_KEY],
    },

    mumbai: {
      url: ALCHEMY_MUMBAI_URL,
      // url: MUMBAI_URL,
      accounts: [DEPLOYER_KEY],
    },
  },
  solidity: {
    version: "0.8.17",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  contractSizer: {
    alphaSort: true,
    disambiguatePaths: false,
    runOnCompile: true,
    strict: true,
    only: ["BlockPager"],
  },
};
