import { useState } from "react";
import { Layout } from "@/components/layout";
import { useEnterPvEBattle } from "@/hooks/use-arena";
import { ChampionCard } from "@/components/champion-card";
import { Loader } from "@/components/ui/loader";
import { motion, AnimatePresence } from "framer-motion";

export default function PvE() {
  const { mutate: enterBattle, isPending } = useEnterPvEBattle();
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState("");

  const handleBattle = () => {
    setError("");
    setResult(null);
    enterBattle(undefined, {
      onSuccess: (data) => {
        if (data.result) {
          setResult(data.result);
        } else {
          setError("Battle completed, but could not parse the champion details.");
        }
      },
      onError: (err: any) => {
        setError(err.reason || err.message || "Transaction failed");
      }
    });
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto space-y-8">
        <div>
          <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-primary">
            PvE COLOSSEUM
          </h1>
          <p className="text-muted-foreground mt-2">Spend 10 ARENA to battle. Survive to earn a new Champion and ARENA rewards!</p>
        </div>

        <div className="glass-panel p-10 rounded-3xl flex flex-col items-center justify-center min-h-[400px] relative overflow-hidden">
          {/* Animated Background Pulse */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(168,85,247,0.1)_0%,transparent_60%)] animate-pulse" />

          <AnimatePresence mode="wait">
            {!result ? (
              <motion.div 
                key="action"
                exit={{ opacity: 0, scale: 0.8 }}
                className="text-center z-10"
              >
                <div className="mb-8">
                  <div className="text-6xl font-display font-black text-white drop-shadow-[0_0_20px_rgba(255,255,255,0.5)]">
                    10 ARENA
                  </div>
                  <div className="text-sm tracking-[0.2em] text-primary mt-2">ENTRY FEE</div>
                </div>

                <button
                  onClick={handleBattle}
                  disabled={isPending}
                  className="relative group px-12 py-5 rounded-2xl bg-red-600/20 text-red-500 border-2 border-red-500/50 hover:bg-red-600 hover:text-white transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden"
                >
                  <div className="absolute inset-0 bg-red-500/20 group-hover:animate-ping opacity-0 group-hover:opacity-100 transition-opacity" />
                  <span className="relative z-10 font-display font-black text-xl tracking-widest flex items-center gap-3">
                    {isPending ? (
                       <><Loader className="text-current" /> FORGING BATTLE...</>
                    ) : (
                       "ENTER THE FRAY"
                    )}
                  </span>
                </button>
                
                {error && (
                  <div className="mt-6 text-red-400 bg-red-900/20 p-4 rounded-xl border border-red-900/50 max-w-md mx-auto">
                    {error}
                  </div>
                )}
              </motion.div>
            ) : (
              <motion.div 
                key="result"
                initial={{ opacity: 0, scale: 0.5, y: 50 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ type: "spring", bounce: 0.5 }}
                className="z-10 flex flex-col items-center"
              >
                <div className="text-accent text-xl font-bold mb-6 tracking-widest text-center">
                  VICTORY!<br/>
                  <span className="text-sm text-muted-foreground">+ {result.reward} ARENA EARNED</span>
                </div>
                
                <div className="w-64">
                  <ChampionCard 
                    id={result.nftId}
                    attack={result.attack}
                    defense={result.defense}
                    rarity={result.rarity}
                  />
                </div>

                <button
                  onClick={() => setResult(null)}
                  className="mt-8 px-8 py-3 rounded-lg border border-white/20 hover:bg-white/10 transition-colors font-bold"
                >
                  BATTLE AGAIN
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </Layout>
  );
}
