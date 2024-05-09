require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();
/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.24",
  paths: {
    artifacts: "./src",
  },
  networks: {
    zkEVM: {
      url: `https://rpc-amoy.polygon.technology`,
      accounts: [process.env.ACCOUNT_PRIVATE_KEY],
    },
  },
};
