require("@nomicfoundation/hardhat-ethers");
require("dotenv").config();

module.exports = {
  solidity: {
    version: "0.8.25",
    settings: {
      optimizer: { enabled: true, runs: 200 },
      evmVersion: "cancun"
    }
  },
  networks: {
    base: {
      url: process.env.BASE_RPC,
      accounts: [process.env.PRIVATE_KEY],
      chainId: 8453
    }
  }
};
