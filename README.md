# Base Arena

🎮 **Base Arena** is a web3 play‑to‑earn blockchain game built on **Base Mainnet**.  
Players collect unique **ArenaChampion NFTs**, battle enemies and other players, earn **ARENA tokens**, and trade NFTs in a marketplace.

---

## 🏆 Features

### 🧬 NFT Champions
- Unique ERC‑721 tokens with randomized **attack**, **defense**, and **rarity** stats.
- Can be earned via PvE battles or traded in the marketplace.

### ⚔️ PvE Battles
- Fight computer‑controlled battles using `ArenaBattle` contract.
- Spend a small ARENA entry fee.
- Earn ARENA tokens and champion NFTs as rewards.

### 🥊 PvP Battles
- Challenge other players using the `ArenaPvP` contract.
- Wager ARENA tokens and fight using your champion stats.
- Win tokens and leaderboard status on chain.

### 💰 NFT Marketplace
- List and buy champion NFTs with ARENA tokens.
- On‑chain and decentralized.

### 🛠 Easy Frontend
- Connect MetaMask with one click.
- Auto‑switch to Base Mainnet.
- Live event listeners show battle outcomes and results.

---

## 🧰 Tech Stack

| Layer | Technology |
|-------|------------|
| Blockchain | Base Mainnet |
| Smart Contracts | Solidity (Hardhat) |
| Wallet | MetaMask |
| Frontend | TypeScript + Ethers.js + HTML |
| Deployment | Hardhat |
| Verification | Hardhat + BaseScan |

---

## 🚀 Getting Started (Local Dev)

### 1. Clone

```bash
git clone https://github.com/BoomchainLabs/base-arena.git
cd base-arena

Install dependencies
npm install

Create .env

Copy .env.example to .env and fill values:
PRIVATE_KEY=your_wallet_private_key
BASE_RPC=https://mainnet.base.org
BASESCAN_API_KEY=your_basescan_api_key

🛠 Compile & Deploy
Compile
npm run compile

Deploy to Base Mainnet
npm run deploy

Verify on BaseScan

After deployment, verify all contracts with:
npx hardhat run scripts/verify-all.js --network base

Run the Frontend
npm run start-frontend

🕹 Playing the Game

Wallet
	•	Connect Wallet — Connect MetaMask
	•	Check Balance — Fetch your ARENA token balance

PvE
	•	Enter PvE Battle — Fight the arena for rewards & new NFTs

PvP
	•	Create Challenge — Challenge others using your NFT
	•	Accept Challenge — Battle existing challenges

Marketplace
	•	List NFT — Sell your champion for ARENA
	•	Buy NFT — Purchase a champion

⸻

⚖️ License

This project is licensed under the MIT License.

⸻

💬 Contact

BoomchainLabs – https://github.com/BoomchainLabs
