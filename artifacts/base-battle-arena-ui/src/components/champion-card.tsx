import { motion } from "framer-motion";
import { Shield, Sword, Star } from "lucide-react";

interface ChampionCardProps {
  id: string;
  attack: number;
  defense: number;
  rarity: number;
  onClick?: () => void;
  selected?: boolean;
}

const rarityColors = {
  1: "text-zinc-400 border-zinc-700 bg-zinc-900/50",
  2: "text-green-400 border-green-500/50 bg-green-900/20",
  3: "text-blue-400 border-blue-500/50 bg-blue-900/20",
  4: "text-accent border-accent/50 bg-accent/10 shadow-[0_0_15px_rgba(255,183,0,0.3)]",
};

const rarityNames = {
  1: "Common",
  2: "Uncommon",
  3: "Rare",
  4: "Legendary",
};

export function ChampionCard({ id, attack, defense, rarity, onClick, selected }: ChampionCardProps) {
  const colorClass = rarityColors[rarity as keyof typeof rarityColors] || rarityColors[1];
  
  return (
    <motion.div
      whileHover={{ y: -5, scale: 1.02 }}
      onClick={onClick}
      className={`relative overflow-hidden rounded-xl border-2 p-1 cursor-pointer transition-all duration-300 ${colorClass} ${selected ? 'ring-2 ring-primary ring-offset-2 ring-offset-background' : ''}`}
    >
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent z-10" />
      
      {/* Dynamic Placeholder Image */}
      <div className="relative aspect-square bg-black/50 rounded-lg overflow-hidden flex items-center justify-center">
         <img 
            src={`${import.meta.env.BASE_URL}images/champion-placeholder.png`} 
            alt={`Champion ${id}`}
            className="w-full h-full object-cover opacity-80 mix-blend-screen"
         />
         <div className="absolute top-2 right-2 z-20 flex gap-0.5">
           {[...Array(rarity)].map((_, i) => (
             <Star key={i} className="w-4 h-4 fill-current" />
           ))}
         </div>
      </div>

      <div className="relative z-20 p-3">
        <div className="flex justify-between items-end mb-3">
          <div>
            <p className="text-xs uppercase tracking-wider opacity-70">ID #{id}</p>
            <p className="font-display font-bold text-lg leading-none">{rarityNames[rarity as keyof typeof rarityNames]}</p>
          </div>
        </div>
        
        <div className="flex justify-between gap-2">
          <div className="flex-1 bg-black/40 rounded p-2 flex flex-col items-center justify-center border border-white/5">
            <Sword className="w-4 h-4 mb-1 text-red-400" />
            <span className="font-display font-bold text-white">{attack}</span>
          </div>
          <div className="flex-1 bg-black/40 rounded p-2 flex flex-col items-center justify-center border border-white/5">
            <Shield className="w-4 h-4 mb-1 text-blue-400" />
            <span className="font-display font-bold text-white">{defense}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
