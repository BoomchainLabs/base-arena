require("dotenv").config();
const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying with:", deployer.address);

  const balance = await ethers.provider.getBalance(deployer.address);
  console.log("Wallet balance:", ethers.formatEther(balance), "ETH");

  // ArenaCoin already deployed in a previous run — reuse its address
  const arenaCoinAddr = "0xba384FAA696F8b39f43768422D35ff6dB1fdd704";
  console.log("ArenaCoin (existing):", arenaCoinAddr);

  console.log("\n[2/5] Deploying ArenaChampion...");
  const ArenaChampion = await ethers.getContractFactory("ArenaChampion");
  const arenaChampion = await ArenaChampion.deploy();
  await arenaChampion.waitForDeployment();
  const arenaChampionAddr = await arenaChampion.getAddress();
  console.log("ArenaChampion deployed:", arenaChampionAddr);

  console.log("\n[3/5] Deploying ArenaBattle...");
  const ArenaBattle = await ethers.getContractFactory("ArenaBattle");
  const arenaBattle = await ArenaBattle.deploy(arenaCoinAddr, arenaChampionAddr);
  await arenaBattle.waitForDeployment();
  const arenaBattleAddr = await arenaBattle.getAddress();
  console.log("ArenaBattle deployed:", arenaBattleAddr);

  console.log("\n[4/5] Deploying ArenaPvP...");
  const ArenaPvP = await ethers.getContractFactory("ArenaPvP");
  const arenaPvP = await ArenaPvP.deploy(arenaCoinAddr, arenaChampionAddr);
  await arenaPvP.waitForDeployment();
  const arenaPvPAddr = await arenaPvP.getAddress();
  console.log("ArenaPvP deployed:", arenaPvPAddr);

  console.log("\n[5/5] Deploying ArenaMarketplace...");
  const ArenaMarketplace = await ethers.getContractFactory("ArenaMarketplace");
  const arenaMarketplace = await ArenaMarketplace.deploy(arenaCoinAddr, arenaChampionAddr);
  await arenaMarketplace.waitForDeployment();
  const arenaMarketplaceAddr = await arenaMarketplace.getAddress();
  console.log("ArenaMarketplace deployed:", arenaMarketplaceAddr);

  console.log("\n========================================");
  console.log("       DEPLOYED CONTRACT ADDRESSES      ");
  console.log("========================================");
  console.log("ArenaCoin:       ", arenaCoinAddr);
  console.log("ArenaChampion:   ", arenaChampionAddr);
  console.log("ArenaBattle:     ", arenaBattleAddr);
  console.log("ArenaPvP:        ", arenaPvPAddr);
  console.log("ArenaMarketplace:", arenaMarketplaceAddr);
  console.log("========================================");
}

main().catch(e => { console.error(e); process.exit(1); });
