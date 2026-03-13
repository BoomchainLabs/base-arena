// SPDX-License-Identifier: MIT
// PvP Battle contract — two players wager ARENA tokens; stronger champion wins
pragma solidity ^0.8.20;

import "./ArenaCoin.sol";
import "./ArenaChampion.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract ArenaPvP is Ownable, ReentrancyGuard {
    ArenaCoin public arenaCoin;
    ArenaChampion public arenaChampion;
    uint256 public wagerAmount = 5 * 10 ** 18;

    struct Challenge {
        address challenger;
        uint256 challengerChampionId;
        bool active;
    }

    mapping(uint256 => Challenge) public challenges;
    uint256 public nextChallengeId = 1;

    event ChallengeCreated(uint256 indexed challengeId, address indexed challenger, uint256 championId);
    event BattleResolved(uint256 indexed challengeId, address indexed winner, address indexed loser, uint256 prize);

    constructor(ArenaCoin _arenaCoin, ArenaChampion _arenaChampion) Ownable(msg.sender) {
        arenaCoin = _arenaCoin;
        arenaChampion = _arenaChampion;
    }

    function createChallenge(uint256 championId) external {
        require(arenaChampion.ownerOf(championId) == msg.sender, "Not your champion");
        require(arenaCoin.balanceOf(msg.sender) >= wagerAmount, "Insufficient ARENA");

        arenaCoin.transferFrom(msg.sender, address(this), wagerAmount);
        uint256 id = nextChallengeId++;
        challenges[id] = Challenge(msg.sender, championId, true);

        emit ChallengeCreated(id, msg.sender, championId);
    }

    function acceptChallenge(uint256 challengeId, uint256 myChampionId) external nonReentrant {
        Challenge storage ch = challenges[challengeId];
        require(ch.active, "Challenge not active");
        require(ch.challenger != msg.sender, "Cannot fight yourself");
        require(arenaChampion.ownerOf(myChampionId) == msg.sender, "Not your champion");
        require(arenaCoin.balanceOf(msg.sender) >= wagerAmount, "Insufficient ARENA");

        arenaCoin.transferFrom(msg.sender, address(this), wagerAmount);
        ch.active = false;

        ArenaChampion.Champion memory c1 = arenaChampion.getChampion(ch.challengerChampionId);
        ArenaChampion.Champion memory c2 = arenaChampion.getChampion(myChampionId);

        uint256 power1 = (c1.attack + c1.defense) * c1.rarity;
        uint256 power2 = (c2.attack + c2.defense) * c2.rarity;

        uint256 prize = wagerAmount * 2;
        address winner;
        address loser;

        if (power1 >= power2) {
            winner = ch.challenger;
            loser = msg.sender;
        } else {
            winner = msg.sender;
            loser = ch.challenger;
        }

        arenaCoin.transfer(winner, prize);
        emit BattleResolved(challengeId, winner, loser, prize);
    }

    function setWagerAmount(uint256 amount) external onlyOwner {
        wagerAmount = amount;
    }

    function withdraw(uint256 amount) external onlyOwner {
        arenaCoin.transfer(msg.sender, amount);
    }
}
