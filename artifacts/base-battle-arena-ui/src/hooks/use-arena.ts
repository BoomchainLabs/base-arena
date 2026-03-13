import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ethers } from "ethers";
import { CONTRACTS, ABIs } from "@/lib/contracts";
import { useWallet } from "./use-wallet";

export interface Champion {
  id: string;
  attack: number;
  defense: number;
  rarity: number;
}

// Fetch ARENA Balance
export function useArenaBalance() {
  const { address, provider } = useWallet();
  return useQuery({
    queryKey: ["arenaBalance", address],
    enabled: !!address && !!provider,
    queryFn: async () => {
      const contract = new ethers.Contract(CONTRACTS.ArenaCoin, ABIs.ArenaCoin, provider);
      const balance = await contract.balanceOf(address);
      return Number(ethers.formatUnits(balance, 18));
    },
  });
}

// Fetch all Champions owned by current wallet
export function useMyChampions() {
  const { address, provider } = useWallet();
  return useQuery({
    queryKey: ["myChampions", address],
    enabled: !!address && !!provider,
    queryFn: async () => {
      const contract = new ethers.Contract(CONTRACTS.ArenaChampion, ABIs.ArenaChampion, provider);
      const balance = Number(await contract.balanceOf(address));
      const champions: Champion[] = [];
      
      // Fetch each champion individually
      for (let i = 0; i < balance; i++) {
        const tokenId = await contract.tokenOfOwnerByIndex(address, i);
        const champData = await contract.getChampion(tokenId);
        champions.push({
          id: tokenId.toString(),
          attack: Number(champData.attack),
          defense: Number(champData.defense),
          rarity: Number(champData.rarity),
        });
      }
      return champions;
    },
  });
}

// PvE Battle Mutation
export function useEnterPvEBattle() {
  const { signer, address } = useWallet();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      if (!signer || !address) throw new Error("Not connected");
      
      const coinContract = new ethers.Contract(CONTRACTS.ArenaCoin, ABIs.ArenaCoin, signer);
      const battleContract = new ethers.Contract(CONTRACTS.ArenaBattle, ABIs.ArenaBattle, signer);
      
      const entryFee = await battleContract.entryFee();
      const allowance = await coinContract.allowance(address, CONTRACTS.ArenaBattle);
      
      if (allowance < entryFee) {
        const approveTx = await coinContract.approve(CONTRACTS.ArenaBattle, ethers.MaxUint256);
        await approveTx.wait();
      }

      const tx = await battleContract.enterBattle();
      const receipt = await tx.wait();
      
      // Parse event to get the newly minted champion details
      const iface = new ethers.Interface(ABIs.ArenaBattle);
      let result = null;
      for (const log of receipt.logs) {
        try {
          const parsed = iface.parseLog(log as any);
          if (parsed && parsed.name === 'BattleResult') {
             result = {
               reward: Number(ethers.formatUnits(parsed.args.reward, 18)),
               nftId: parsed.args.nftId.toString(),
               attack: Number(parsed.args.attack),
               defense: Number(parsed.args.defense),
               rarity: Number(parsed.args.rarity)
             };
          }
        } catch(e) { /* ignore non-matching logs */ }
      }
      return { txHash: tx.hash as string, result };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["arenaBalance"] });
      queryClient.invalidateQueries({ queryKey: ["myChampions"] });
    },
  });
}

// Check Listing Status
export function useListingDetails(tokenId: string) {
  const { provider } = useWallet();
  return useQuery({
    queryKey: ["listing", tokenId],
    enabled: !!provider && !!tokenId && tokenId !== "",
    queryFn: async () => {
      const contract = new ethers.Contract(CONTRACTS.ArenaMarketplace, ABIs.ArenaMarketplace, provider);
      const listing = await contract.listings(tokenId);
      return {
        seller: listing.seller,
        tokenId: listing.tokenId.toString(),
        price: Number(ethers.formatUnits(listing.price, 18)),
        active: listing.active
      };
    },
  });
}

// List NFT for Sale
export function useListNFT() {
  const { signer, address } = useWallet();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ tokenId, price }: { tokenId: string, price: string }) => {
      if (!signer || !address) throw new Error("Not connected");
      
      const champContract = new ethers.Contract(CONTRACTS.ArenaChampion, ABIs.ArenaChampion, signer);
      const marketContract = new ethers.Contract(CONTRACTS.ArenaMarketplace, ABIs.ArenaMarketplace, signer);
      
      const approved = await champContract.getApproved(tokenId);
      if (approved !== CONTRACTS.ArenaMarketplace) {
        const approveTx = await champContract.approve(CONTRACTS.ArenaMarketplace, tokenId);
        await approveTx.wait();
      }

      const priceWei = ethers.parseUnits(price, 18);
      const tx = await marketContract.listNFT(tokenId, priceWei);
      await tx.wait();
      return { txHash: tx.hash };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myChampions"] });
    },
  });
}

// Buy NFT
export function useBuyNFT() {
  const { signer, address } = useWallet();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ tokenId, price }: { tokenId: string, price: number }) => {
      if (!signer || !address) throw new Error("Not connected");
      
      const coinContract = new ethers.Contract(CONTRACTS.ArenaCoin, ABIs.ArenaCoin, signer);
      const marketContract = new ethers.Contract(CONTRACTS.ArenaMarketplace, ABIs.ArenaMarketplace, signer);
      
      const priceWei = ethers.parseUnits(price.toString(), 18);
      const allowance = await coinContract.allowance(address, CONTRACTS.ArenaMarketplace);
      
      if (allowance < priceWei) {
        const approveTx = await coinContract.approve(CONTRACTS.ArenaMarketplace, ethers.MaxUint256);
        await approveTx.wait();
      }

      const tx = await marketContract.buyNFT(tokenId);
      await tx.wait();
      return { txHash: tx.hash };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["arenaBalance"] });
      queryClient.invalidateQueries({ queryKey: ["myChampions"] });
    },
  });
}
