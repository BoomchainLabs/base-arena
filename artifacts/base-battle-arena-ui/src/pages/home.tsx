import { Layout } from "@/components/layout";
import { Link } from "wouter";
import { useWallet } from "@/hooks/use-wallet";
import { useArenaBalance, useMyChampions } from "@/hooks/use-arena";
import { Sword, Users, Coins, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";

export default function Home() {
  const { address } = useWallet();
  const { data: balance } = useArenaBalance();
  const { data: champions } = useMyChampions();

  const stats = [
    { label: "ARENA Balance", value: balance !== undefined ? balance.toFixed(2) : "-", icon: Coins, color: "text-accent" },
    { label: "Champions Owned", value: champions ? champions.length : "-", icon: Users, color: "text-primary" },
    { label: "Total Power", value: champions ? champions.reduce((acc, c) => acc + c.attack + c.defense, 0) : "-", icon: TrendingUp, color: "text-secondary" },
  ];

  return (
    <Layout>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-8"
      >
        <div className="glass-panel rounded-3xl p-10 relative overflow-hidden">
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-primary/20 blur-[100px] rounded-full pointer-events-none" />
          
          <h1 className="text-5xl md:text-6xl font-black mb-4">
            WELCOME TO <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary neon-text">
              BASE ARENA
            </span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mb-8">
            Collect neon-forged champions, wage war in the PvE colosseum, dominate real players, and earn $ARENA on the Base network.
          </p>
          
          <div className="flex gap-4">
            <Link href="/pve">
              <button className="px-8 py-4 rounded-xl font-display font-bold text-lg bg-primary text-white hover:bg-primary/80 transition-all neon-glow flex items-center gap-2">
                <Sword className="w-5 h-5" />
                ENTER THE ARENA
              </button>
            </Link>
          </div>
        </div>

        {address ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {stats.map((stat, i) => (
              <motion.div 
                key={stat.label}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1 }}
                className="glass-panel p-6 rounded-2xl flex items-center gap-5 hover:bg-white/5 transition-colors border-l-4 border-l-primary"
              >
                <div className={`p-4 rounded-xl bg-black/50 ${stat.color}`}>
                  <stat.icon className="w-8 h-8" />
                </div>
                <div>
                  <div className="text-sm text-muted-foreground uppercase tracking-widest">{stat.label}</div>
                  <div className="text-3xl font-display font-bold">{stat.value}</div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="glass-panel p-8 rounded-2xl text-center border-dashed border-2 border-white/20">
            <h3 className="text-2xl font-display font-bold mb-2">Connect to Play</h3>
            <p className="text-muted-foreground">Connect your Web3 wallet to Base mainnet to start your journey.</p>
          </div>
        )}
      </motion.div>
    </Layout>
  );
}
