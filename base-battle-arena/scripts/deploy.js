require("dotenv").config();
const { ethers } = require("hardhat");

async function deployContract(factory, args, deployer) {
  // Always fetch the latest confirmed nonce and gas price right before sending
  const nonce = await deployer.getNonce("latest");
  const feeData = await ethers.provider.getFeeData();
  const gasPrice = (feeData.gasPrice || 1000000n) * 15n / 10n; // 1.5x bump

  const opts = { nonce, gasPrice };
  const contract = args.length
    ? await factory.deploy(...args, opts)
    : await factory.deploy(opts);
  await contract.waitForDeployment();
  return contract;
}

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying with:", deployer.address);

  const balance = await ethers.provider.getBalance(deployer.address);
  console.log("Wallet balance:", ethers.formatEther(balance), "ETH");

  // Already deployed contracts
  const arenaCoinAddr     = "0xba384FAA696F8b39f43768422D35ff6dB1fdd704";
  const arenaChampionAddr = "0x79287902E0A57f4Ea1b97CeCf56991Ee676A7Afa";
  const arenaBattleAddr   = "0x72b7AbF70d85Da44BBD1231813895f40672D872e";
  console.log("\nArenaCoin (existing):     ", arenaCoinAddr);
  console.log("ArenaChampion (existing): ", arenaChampionAddr);
  console.log("ArenaBattle (existing):   ", arenaBattleAddr);

  console.log("\n[4/5] Deploying ArenaPvP...");
  const ArenaPvP = await ethers.getContractFactory("ArenaPvP");
  const arenaPvP = await deployContract(ArenaPvP, [arenaCoinAddr, arenaChampionAddr], deployer);
  const arenaPvPAddr = await arenaPvP.getAddress();
  console.log("ArenaPvP deployed:", arenaPvPAddr);

  console.log("\n[5/5] Deploying ArenaMarketplace...");
  const ArenaMarketplace = await ethers.getContractFactory("ArenaMarketplace");
  const arenaMarketplace = await deployContract(ArenaMarketplace, [arenaCoinAddr, arenaChampionAddr], deployer);
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
