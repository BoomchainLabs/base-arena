import { Link, useLocation } from "wouter";
import { useWallet } from "@/hooks/use-wallet";
import { useArenaBalance } from "@/hooks/use-arena";
import { Wallet, Sword, Swords, Shield, Store, Trophy } from "lucide-react";
import { ReactNode } from "react";

const NAV_ITEMS = [
  { href: "/", label: "Dashboard", icon: Wallet },
  { href: "/pve", label: "PvE Battle", icon: Sword },
  { href: "/pvp", label: "PvP Arena", icon: Swords },
  { href: "/champions", label: "My Champions", icon: Shield },
  { href: "/marketplace", label: "Marketplace", icon: Store },
  { href: "/leaderboard", label: "Leaderboard", icon: Trophy },
];

export function Layout({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  const { address, connect, disconnect, isConnecting, correctNetwork } = useWallet();
  const { data: balance } = useArenaBalance();

  const truncateAddress = (addr: string) => `${addr.slice(0, 6)}...${addr.slice(-4)}`;

  return (
    <div className="min-h-screen bg-background text-foreground flex overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 border-r border-sidebar-border bg-sidebar/80 backdrop-blur-xl flex flex-col z-20">
        <div className="p-6">
          <Link href="/">
            <div className="font-display text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary cursor-pointer hover:opacity-80 transition-opacity">
              BASE ARENA
            </div>
          </Link>
        </div>

        <nav className="flex-1 px-4 space-y-2">
          {NAV_ITEMS.map((item) => {
            const isActive = location === item.href;
            return (
              <Link key={item.href} href={item.href}>
                <div
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium cursor-pointer transition-all duration-200 ${
                    isActive
                      ? "bg-primary/20 text-primary border border-primary/30 neon-glow"
                      : "text-muted-foreground hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  {item.label}
                </div>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-sidebar-border">
          {!address ? (
            <button
              onClick={connect}
              disabled={isConnecting}
              className="w-full py-3 rounded-lg font-bold bg-primary text-primary-foreground hover:bg-primary/80 transition-colors shadow-[0_0_15px_rgba(168,85,247,0.4)] disabled:opacity-50"
            >
              {isConnecting ? "Connecting..." : "Connect Wallet"}
            </button>
          ) : (
            <div className="space-y-3">
              {!correctNetwork && (
                <div className="text-xs text-destructive text-center font-bold animate-pulse">
                  Wrong Network! Please switch to Base.
                </div>
              )}
              <div className="bg-black/50 rounded-lg p-3 border border-white/10">
                <div className="text-xs text-muted-foreground mb-1">ARENA Balance</div>
                <div className="font-display text-xl font-bold text-accent">
                  {balance !== undefined ? balance.toFixed(2) : "..."}
                </div>
              </div>
              <button
                onClick={disconnect}
                className="w-full py-2 rounded-lg text-sm font-semibold bg-white/5 hover:bg-white/10 transition-colors"
              >
                {truncateAddress(address)} • Disconnect
              </button>
            </div>
          )}
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 relative overflow-y-auto">
        <div className="absolute inset-0 z-0">
          <img 
            src={`${import.meta.env.BASE_URL}images/arena-bg.png`} 
            alt="Arena Background" 
            className="w-full h-full object-cover opacity-20 mix-blend-luminosity"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/50 to-background/95" />
        </div>
        <div className="relative z-10 p-8 max-w-6xl mx-auto min-h-full">
          {children}
        </div>
      </main>
    </div>
  );
}
