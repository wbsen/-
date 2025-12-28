import React, { useState, useMemo } from 'react';
import { Prize, PrizeTier, TIER_COLORS } from '../types';
import { ArcadeButton, CoinSlot } from './ArcadeControls';

interface GachaponProps {
  onSpin: () => Prize | null;
  onReveal: (prize: Prize) => void;
  onPrizeClick: (prize: Prize) => void;
  canSpin: boolean;
  cost: number;
  userCoins: number;
  prizes: Prize[];
  t: (key: any) => string;
}

// Color mapping matching PrizeTier gradients exactly
const BALL_COLORS = {
  [PrizeTier.LEGENDARY]: 'from-yellow-300 to-yellow-600', // Gold
  [PrizeTier.EPIC]: 'from-purple-400 to-purple-700',      // Purple
  [PrizeTier.RARE]: 'from-blue-400 to-blue-700',          // Blue
  [PrizeTier.FUN]: 'from-green-400 to-green-700',         // Green
  [PrizeTier.COMMON]: 'from-slate-100 to-slate-300'       // White/Silver
};

export const Gachapon: React.FC<GachaponProps> = ({ onSpin, onReveal, onPrizeClick, canSpin, cost, userCoins, prizes, t }) => {
  const [isSpinning, setIsSpinning] = useState(false);
  const [showPrizeDrop, setShowPrizeDrop] = useState(false);
  const [droppingColor, setDroppingColor] = useState<string>(BALL_COLORS[PrizeTier.COMMON]);

  // --- VISUAL CONSISTENCY LOGIC ---
  const displayCapsules = useMemo(() => {
    // 1. Check which tiers are currently available (stock > 0)
    const availableTiers = new Set(prizes.filter(p => p.stock > 0).map(p => p.tier));
    
    // If pool is totally empty, show commons as placeholders
    if (availableTiers.size === 0) availableTiers.add(PrizeTier.COMMON);

    // Helper to degrade tier if not available (Visual fallback)
    const getVisualTier = (targetTier: PrizeTier): PrizeTier => {
        if (availableTiers.has(targetTier)) return targetTier;
        if (targetTier === PrizeTier.LEGENDARY) return getVisualTier(PrizeTier.EPIC);
        if (targetTier === PrizeTier.EPIC) return getVisualTier(PrizeTier.RARE);
        if (targetTier === PrizeTier.RARE) return getVisualTier(PrizeTier.FUN);
        if (targetTier === PrizeTier.FUN) return getVisualTier(PrizeTier.COMMON);
        return PrizeTier.COMMON;
    };

    // 2. Generate a fixed number of capsules (18) for the visual pile
    return Array.from({ length: 18 }).map((_, i) => {
      // Create a preferred pattern based on index
      let preferredTier = PrizeTier.COMMON;
      if (i % 10 === 0) preferredTier = PrizeTier.LEGENDARY;
      else if (i % 5 === 0) preferredTier = PrizeTier.EPIC;
      else if (i % 3 === 0) preferredTier = PrizeTier.RARE;
      else if (i % 2 === 0) preferredTier = PrizeTier.FUN;
      
      // Downgrade if the preferred tier is out of stock
      const finalTier = getVisualTier(preferredTier);

      return { id: i, tier: finalTier, colorClass: BALL_COLORS[finalTier] };
    });
  }, [prizes]); 

  const handleStart = () => {
    if (!canSpin || isSpinning || userCoins < cost) return;

    // 1. Determine the winner IMMEDIATELY (Logic Layer)
    const wonPrize = onSpin();
    if (!wonPrize) return;

    setIsSpinning(true);
    setShowPrizeDrop(false);
    setDroppingColor(BALL_COLORS[wonPrize.tier]);

    // 2. Animation Phase
    setTimeout(() => {
        // 3. Drop Phase
        setIsSpinning(false);
        setShowPrizeDrop(true);
        
        // 4. Reveal Phase
        setTimeout(() => {
            onReveal(wonPrize);
            setTimeout(() => setShowPrizeDrop(false), 1000); 
        }, 800); 
    }, 1500); 
  };

  // Sort by PRICE (descending) and take top 10 available for the showcase list
  const activePrizes = prizes
    .filter(p => p.stock > 0)
    .sort((a, b) => b.price - a.price)
    .slice(0, 10);

  return (
    <div className="relative w-full max-w-[320px] mx-auto flex flex-col items-center select-none pt-4">
      
      {/* ================= TOP: THE DOME ================= */}
      <div className="relative z-10 w-60 h-60 rounded-full shadow-2xl overflow-hidden border-[6px] border-yellow-400 bg-white/30 backdrop-blur-[2px]">
        {/* Dome Reflection */}
        <div className="absolute inset-0 bg-gradient-to-tr from-white/40 to-transparent z-20 rounded-full pointer-events-none shadow-[inset_0_0_40px_rgba(255,255,255,0.6)]"></div>
        <div className="absolute top-6 right-8 w-16 h-8 bg-white/60 blur-md rounded-full rotate-[-45deg] z-30"></div>

        {/* The Capsule Pool */}
        <div className="absolute inset-0 z-10 p-4 flex flex-wrap content-end justify-center items-end gap-[-5px]">
          {displayCapsules.map((cap, i) => (
            <div 
              key={cap.id}
              className={`
                relative w-12 h-12 rounded-full shadow-[inset_-2px_-2px_6px_rgba(0,0,0,0.3),2px_2px_4px_rgba(0,0,0,0.2)]
                flex items-center justify-center border border-white/20 -mr-2 -mb-2
                ${isSpinning ? 'animate-roll' : ''}
              `}
              style={{
                 transform: !isSpinning ? `rotate(${i * 45}deg)` : undefined
              }}
            >
                {/* Colored Half */}
                <div className={`absolute inset-0 rounded-full bg-gradient-to-br ${cap.colorClass}`} 
                     style={{ clipPath: 'polygon(0 50%, 100% 50%, 100% 100%, 0% 100%)' }}></div>
                {/* Clear/White Half */}
                <div className="absolute inset-0 rounded-full bg-white/60 backdrop-blur-sm"
                     style={{ clipPath: 'polygon(0 0, 100% 0, 100% 50%, 0% 50%)' }}></div>
                {/* Seam */}
                <div className="absolute w-full h-[1px] bg-black/10 top-1/2"></div>
            </div>
          ))}
        </div>
      </div>


      {/* ================= MIDDLE: CONTROL PANEL ================= */}
      <div className="relative z-20 w-[280px] -mt-10">
        
        {/* Panel Frame */}
        <div className="bg-indigo-500 rounded-xl p-3 border-b-8 border-indigo-800 shadow-xl flex items-center justify-between gap-3 relative overflow-hidden">
            
            {/* Gloss Overlay */}
            <div className="absolute top-0 left-0 right-0 h-1/2 bg-white/10 pointer-events-none"></div>

            {/* Left: Coin Slot (Reusable) */}
            <div className="flex-1 bg-indigo-700 rounded-lg p-2 border border-indigo-600 shadow-inner z-10">
                <CoinSlot cost={cost} t={t} />
            </div>

            {/* Right: Start Button (Reusable) */}
            <div className="flex-1 flex justify-center z-10">
                <ArcadeButton 
                    onClick={handleStart}
                    disabled={!canSpin || isSpinning || userCoins < cost}
                    isSpinning={isSpinning}
                    color="yellow"
                    label="START"
                />
            </div>
        </div>

        {/* Connector */}
        <div className="h-3 bg-indigo-800 mx-6 border-x-4 border-indigo-900/50"></div>
      </div>


      {/* ================= LOW-MID: GRAND PRIZE SHOWCASE ================= */}
      <div className="relative z-10 w-[300px] bg-white rounded-t-2xl border-x-4 border-t-4 border-yellow-400 p-2 shadow-lg">
         <div className="bg-orange-50 rounded-xl p-2 shadow-inner border border-orange-100">
            <div className="text-center text-[9px] font-bold text-orange-400 uppercase tracking-widest mb-1 border-b border-orange-200 pb-1">Top Prizes</div>
            
            {/* INCREASED HEIGHT FOR LIST: h-16 -> h-24 */}
            <div className="flex gap-2 overflow-x-auto hide-scrollbar snap-x h-24 items-center pl-1">
                {activePrizes.length > 0 ? activePrizes.map(prize => (
                    <button 
                        key={prize.id} 
                        onClick={() => onPrizeClick(prize)}
                        // INCREASED ITEM SIZE: w-12 h-14 -> w-20 h-22
                        className={`snap-center shrink-0 w-20 h-22 rounded-xl border shadow-sm flex flex-col items-center justify-center p-1 active:scale-95 transition-transform overflow-hidden bg-white ${TIER_COLORS[prize.tier]}`}
                    >
                         {/* IMAGE SUPPORT */}
                        <div className="w-full h-16 flex items-center justify-center overflow-hidden rounded-lg bg-black/5">
                            {prize.image.startsWith('data:') || prize.image.startsWith('http') ? (
                                <img src={prize.image} alt={prize.name} className="w-full h-full object-cover" />
                            ) : (
                                <div className="text-4xl filter drop-shadow-sm leading-none">{prize.image}</div>
                            )}
                        </div>
                        <div className="w-full text-[10px] truncate text-center mt-1 font-bold px-1">{prize.name}</div>
                        {/* PRICE IN GOLD */}
                        <div className="text-[10px] font-black text-amber-500 bg-amber-100/50 rounded px-1 -mt-1 scale-90">￥{prize.price}</div>
                    </button>
                )) : (
                    <div className="w-full text-center text-[10px] text-slate-400 italic py-2">All won!</div>
                )}
            </div>
         </div>
      </div>


      {/* ================= BOTTOM: EXIT CHUTE ================= */}
      <div className="relative z-20 w-[320px] h-32 bg-rose-500 rounded-b-[2.5rem] shadow-[0_10px_30px_rgba(0,0,0,0.2)] border-t-8 border-rose-700 flex justify-center items-end pb-6 overflow-hidden">
         <div className="absolute inset-0 opacity-10 bg-[repeating-linear-gradient(45deg,transparent,transparent_10px,#000_10px,#000_11px)] pointer-events-none"></div>

         <div className="relative w-40 h-24 bg-rose-900/30 rounded-t-2xl border-4 border-rose-400/50 shadow-inner flex justify-center items-end pb-4 overflow-hidden">
            <div className="text-[9px] text-rose-100 absolute top-1 uppercase tracking-widest opacity-70 font-bold">Prize Exit</div>
            
             {/* The Dropped Prize Capsule */}
             {showPrizeDrop && (
                 <div className="relative z-30 w-14 h-14 rounded-full animate-drop shadow-xl mb-2">
                     <div className={`absolute inset-0 rounded-full bg-gradient-to-br ${droppingColor}`} 
                          style={{ clipPath: 'polygon(0 50%, 100% 50%, 100% 100%, 0% 100%)' }}></div>
                     <div className="absolute inset-0 rounded-full bg-white/90"
                          style={{ clipPath: 'polygon(0 0, 100% 0, 100% 50%, 0% 50%)' }}></div>
                     <div className="absolute w-full h-[1px] bg-black/10 top-1/2"></div>
                     <div className="absolute inset-0 rounded-full shadow-[inset_-2px_-2px_4px_rgba(0,0,0,0.3)]"></div>
                 </div>
            )}
         </div>
      </div>

      {/* --- STATUS MESSAGES --- */}
      <div className="mt-2 text-center h-6">
        {userCoins < cost && (
           <p className="text-red-500 font-bold bg-white/90 px-2 py-0.5 rounded-full shadow-md border border-red-100 animate-pulse text-[10px]">
             {t('needCoins')}
           </p>
        )}
      </div>

    </div>
  );
};