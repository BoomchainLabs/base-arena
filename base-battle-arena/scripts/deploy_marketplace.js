require("dotenv").config();
const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();
  const balance = await ethers.provider.getBalance(deployer.address);
  console.log("Deployer:", deployer.address);
  console.log("Balance:", ethers.formatEther(balance), "ETH");

  const nonce = await deployer.getNonce("latest");
  const feeData = await ethers.provider.getFeeData();
  // Use 1.1x base fee — just enough to be accepted, stay within budget
  const gasPrice = (feeData.gasPrice || 1000000n) * 11n / 10n;
  console.log("Nonce:", nonce, "| gasPrice:", gasPrice.toString(), "wei");

  const arenaCoinAddr     = "0xba384FAA696F8b39f43768422D35ff6dB1fdd704";
  const arenaChampionAddr = "0x79287902E0A57f4Ea1b97CeCf56991Ee676A7Afa";

  console.log("Deploying ArenaMarketplace...");
  const ArenaMarketplace = await ethers.getContractFactory("ArenaMarketplace");
  const arenaMarketplace = await ArenaMarketplace.deploy(arenaCoinAddr, arenaChampionAddr, { nonce, gasPrice, gasLimit: 500000 });
  await arenaMarketplace.waitForDeployment();
  const addr = await arenaMarketplace.getAddress();

  console.log("\n========================================");
  console.log("ArenaMarketplace:", addr);
  console.log("========================================");
  console.log("\nFull address table:");
  console.log("ArenaCoin:       ", arenaCoinAddr);
  console.log("ArenaChampion:   ", arenaChampionAddr);
  console.log("ArenaBattle:     ", "0x72b7AbF70d85Da44BBD1231813895f40672D872e");
  console.log("ArenaPvP:        ", "0x75fc7a962de35aAD29084C1E2BB6571CD5F4a4FC");
  console.log("ArenaMarketplace:", addr);
  console.log("========================================");
}

main().catch(e => { console.error(e); process.exit(1); });
