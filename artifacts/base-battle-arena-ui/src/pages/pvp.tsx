import { useState } from "react";
import { Layout } from "@/components/layout";
import { ethers } from "ethers";
import { useWallet } from "@/hooks/use-wallet";
import { CONTRACTS, ABIs } from "@/lib/contracts";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader } from "@/components/ui/loader";

export default function PvP() {
  const { signer, address } = useWallet();
  const queryClient = useQueryClient();
  
  // Create Challenge State
  const [createChampId, setCreateChampId] = useState("");
  
  // Accept Challenge State
  const [acceptChallengeId, setAcceptChallengeId] = useState("");
  const [acceptChampId, setAcceptChampId] = useState("");
  
  const [error, setError] = useState("");
  const [txHash, setTxHash] = useState("");

  const createChallenge = useMutation({
    mutationFn: async (championId: string) => {
      if (!signer) throw new Error("Wallet not connected");
      const pvpContract = new ethers.Contract(CONTRACTS.ArenaPvP, ABIs.ArenaPvP, signer);
      const coinContract = new ethers.Contract(CONTRACTS.ArenaCoin, ABIs.ArenaCoin, signer);
      
      const wagerAmount = await pvpContract.wagerAmount();
      const allowance = await coinContract.allowance(address, CONTRACTS.ArenaPvP);
      
      if (allowance < wagerAmount) {
        const approveTx = await coinContract.approve(CONTRACTS.ArenaPvP, ethers.MaxUint256);
        await approveTx.wait();
      }

      const tx = await pvpContract.createChallenge(championId);
      await tx.wait();
      return tx.hash;
    },
    onSuccess: (hash) => {
      setTxHash(hash);
      queryClient.invalidateQueries({ queryKey: ["arenaBalance"] });
    },
    onError: (err: any) => setError(err.reason || err.message)
  });

  const acceptChallenge = useMutation({
    mutationFn: async ({ challengeId, myChampionId }: { challengeId: string, myChampionId: string }) => {
      if (!signer) throw new Error("Wallet not connected");
      const pvpContract = new ethers.Contract(CONTRACTS.ArenaPvP, ABIs.ArenaPvP, signer);
      const coinContract = new ethers.Contract(CONTRACTS.ArenaCoin, ABIs.ArenaCoin, signer);
      
      const wagerAmount = await pvpContract.wagerAmount();
      const allowance = await coinContract.allowance(address, CONTRACTS.ArenaPvP);
      
      if (allowance < wagerAmount) {
        const approveTx = await coinContract.approve(CONTRACTS.ArenaPvP, ethers.MaxUint256);
        await approveTx.wait();
      }

      const tx = await pvpContract.acceptChallenge(challengeId, myChampionId);
      await tx.wait();
      return tx.hash;
    },
    onSuccess: (hash) => {
      setTxHash(hash);
      queryClient.invalidateQueries({ queryKey: ["arenaBalance"] });
    },
    onError: (err: any) => setError(err.reason || err.message)
  });

  return (
    <Layout>
      <div className="max-w-4xl mx-auto space-y-8">
        <div>
          <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-secondary to-primary">
            PvP DEATHMATCH
          </h1>
          <p className="text-muted-foreground mt-2">Stake ARENA and pit your best champion against others.</p>
        </div>

        {error && (
          <div className="p-4 bg-red-900/20 border border-red-500/50 rounded-xl text-red-400">
            {error}
          </div>
        )}

        {txHash && (
          <div className="p-4 bg-green-900/20 border border-green-500/50 rounded-xl text-green-400 break-all">
            Transaction Successful! <a href={`https://basescan.org/tx/${txHash}`} target="_blank" className="underline font-bold">View on Basescan</a>
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-8">
          {/* Create Challenge */}
          <div className="glass-panel p-8 rounded-2xl border-t-4 border-t-primary">
            <h2 className="text-2xl font-display font-bold mb-6">Create Challenge</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-2">Your Champion ID</label>
                <input 
                  type="number"
                  value={createChampId}
                  onChange={(e) => setCreateChampId(e.target.value)}
                  className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                  placeholder="e.g. 1"
                />
              </div>
              <button
                onClick={() => { setError(""); setTxHash(""); createChallenge.mutate(createChampId); }}
                disabled={!createChampId || createChallenge.isPending}
                className="w-full py-4 rounded-xl font-bold bg-primary text-white hover:bg-primary/80 transition-colors flex justify-center items-center gap-2 disabled:opacity-50"
              >
                {createChallenge.isPending && <Loader className="text-white w-5 h-5" />}
                WAGER 5 ARENA & CREATE
              </button>
            </div>
          </div>

          {/* Accept Challenge */}
          <div className="glass-panel p-8 rounded-2xl border-t-4 border-t-secondary">
            <h2 className="text-2xl font-display font-bold mb-6">Accept Challenge</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-2">Challenge ID</label>
                <input 
                  type="number"
                  value={acceptChallengeId}
                  onChange={(e) => setAcceptChallengeId(e.target.value)}
                  className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary transition-all"
                  placeholder="e.g. 1"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-2">Your Champion ID</label>
                <input 
                  type="number"
                  value={acceptChampId}
                  onChange={(e) => setAcceptChampId(e.target.value)}
                  className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary transition-all"
                  placeholder="e.g. 2"
                />
              </div>
              <button
                onClick={() => { setError(""); setTxHash(""); acceptChallenge.mutate({ challengeId: acceptChallengeId, myChampionId: acceptChampId }); }}
                disabled={!acceptChallengeId || !acceptChampId || acceptChallenge.isPending}
                className="w-full py-4 rounded-xl font-bold bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors flex justify-center items-center gap-2 disabled:opacity-50"
              >
                {acceptChallenge.isPending && <Loader className="text-secondary-foreground w-5 h-5" />}
                MATCH WAGER & FIGHT
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
