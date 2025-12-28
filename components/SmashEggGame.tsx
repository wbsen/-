import React, { useState, useMemo } from 'react';
import { Prize } from '../types';
import { Hammer, RefreshCw } from 'lucide-react';

interface SmashEggGameProps {
  onSpin: () => Prize | null;
  onReveal: (prize: Prize) => void;
  canSpin: boolean;
  cost: number;
  userCoins: number;
  t: (key: any) => string;
}

// Egg Styles definition
type EggStyle = 'gold' | 'dino' | 'rainbow';
interface EggConfig {
    id: number;
    style: EggStyle;
    rotation: number;
}

export const SmashEggGame: React.FC<SmashEggGameProps> = ({ onSpin, onReveal, canSpin, cost, userCoins, t }) => {
  // Game State
  // Map egg ID to the Prize won at that location. This keeps the prize visible.
  const [revealedPrizes, setRevealedPrizes] = useState<Record<number, Prize>>({});
  
  const [crackingEgg, setCrackingEgg] = useState<number | null>(null); // Stage 1: Shake & Crack appears
  const [revealingEgg, setRevealingEgg] = useState<number | null>(null); // Stage 2: Shell opens, prize visible
  const [currentAnimPrize, setCurrentAnimPrize] = useState<Prize | null>(null); // Temp store for animation
  
  // Generate random egg styles once
  const eggs = useMemo<EggConfig[]>(() => {
      return Array.from({ length: 9 }).map((_, i) => ({
          id: i,
          style: i % 3 === 0 ? 'gold' : i % 3 === 1 ? 'dino' : 'rainbow',
          rotation: Math.random() * 10 - 5 // Random slight tilt
      }));
  }, []);

  const handleEggClick = (index: number) => {
    // Prevent interaction if busy, already opened, or insufficient coins
    if (crackingEgg !== null || revealingEgg !== null || revealedPrizes[index]) return;
    
    if (userCoins < cost) {
        return;
    }

    // 1. Determine Prize immediately
    const wonPrize = onSpin();
    if (!wonPrize) return;

    setCurrentAnimPrize(wonPrize);
    setCrackingEgg(index);

    // --- ANIMATION SEQUENCE ---

    // Phase 1: Crack Appears & Shake (0.6s)
    setTimeout(() => {
        setCrackingEgg(null);
        setRevealingEgg(index);

        // Phase 2: Shell Shatters & Prize Pops Up (0.6s)
        setTimeout(() => {
             // Mark as permanently revealed on board
             setRevealedPrizes(prev => ({ ...prev, [index]: wonPrize }));
             setRevealingEgg(null);
             setCurrentAnimPrize(null);
             
             // Phase 3: Global Modal Reveal (Small delay to let user see board update)
             setTimeout(() => {
                 onReveal(wonPrize);
             }, 200);
        }, 600);
    }, 600);
  };

  const handleRefresh = () => {
      if (crackingEgg !== null || revealingEgg !== null) return;
      setRevealedPrizes({});
  };

  const clearedCount = Object.keys(revealedPrizes).length;
  const allCleared = clearedCount === 9;

  return (
    <div className="flex flex-col items-center w-full max-w-sm mx-auto pt-4 pb-20 relative min-h-[500px]">
        
        {/* === HEADER / STATUS BAR === */}
        <div className="w-full px-6 mb-4 flex justify-between items-center z-20">
             {/* Simple Instruction/Status */}
             <div className="bg-white/80 backdrop-blur-md px-4 py-2 rounded-full shadow-sm border border-yellow-200">
                <span className="text-yellow-800 font-bold text-xs uppercase tracking-wider">
                    {allCleared ? t('eggsCleared') : t('gameSmashEggDesc')}
                </span>
             </div>

             {/* Refresh Button */}
             <button 
                onClick={handleRefresh}
                className="bg-white/80 p-2 rounded-full shadow-sm border border-slate-200 active:scale-90 active:bg-slate-100 transition-all"
             >
                 <RefreshCw className={`w-5 h-5 text-slate-600 ${allCleared ? 'animate-spin-slow text-green-600' : ''}`} />
             </button>
        </div>

        {/* === EGG GRID === */}
        <div className="grid grid-cols-3 gap-x-4 gap-y-8 px-6 w-full place-items-center relative z-10">
            {eggs.map((egg) => {
                const prize = revealedPrizes[egg.id];
                const isCracking = crackingEgg === egg.id;
                const isRevealing = revealingEgg === egg.id;
                const isInteractable = !prize && !isCracking && !isRevealing && userCoins >= cost;
                
                // Determine what prize to show (Animation temp prize OR Persistent prize)
                const displayPrize = prize || (isRevealing ? currentAnimPrize : null);

                return (
                    <div key={egg.id} className="relative w-20 h-24 flex justify-center items-end group select-none">
                        
                        {/* 1. THE PRIZE (Visible during Reveal OR After won) */}
                        {displayPrize && (
                            <div className={`absolute bottom-2 z-0 transition-all duration-500
                                ${isRevealing ? 'animate-prize-bounce' : 'scale-100 opacity-100'}
                            `}>
                                <div className="text-4xl filter drop-shadow-md">
                                    {displayPrize.image}
                                </div>
                                {!isRevealing && (
                                    <div className="absolute -bottom-4 w-full text-center">
                                        <span className="text-[9px] bg-white/80 px-1 rounded text-slate-600 font-bold whitespace-nowrap">
                                            {displayPrize.name.slice(0,4)}
                                        </span>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* 2. THE EGG SHELL (Visible only if NOT revealed yet) */}
                        {!prize && (
                            <div
                                onClick={() => isInteractable && handleEggClick(egg.id)}
                                className={`
                                    relative w-full h-full flex justify-center items-end
                                    ${isInteractable ? 'cursor-pointer hover:scale-105 active:scale-95 transition-transform' : ''}
                                    ${isCracking ? 'animate-shake-hard' : ''}
                                    ${isRevealing ? 'animate-shatter-fade pointer-events-none' : ''}
                                `}
                                style={{ 
                                    transformOrigin: 'bottom center',
                                    transform: (!isCracking && !isRevealing) ? `rotate(${egg.rotation}deg)` : undefined
                                }}
                            >
                                <EggSVG styleType={egg.style} />
                                
                                {/* 2.1 CRACK OVERLAY (Visible during Cracking phase) */}
                                <div className={`absolute inset-0 z-20 pointer-events-none transition-opacity duration-200 ${isCracking ? 'opacity-90' : 'opacity-0'}`}>
                                     <CrackSVG />
                                </div>

                                {/* Cost Badge (Hover) */}
                                {isInteractable && (
                                    <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-black/70 text-white text-[9px] px-2 py-0.5 rounded-full whitespace-nowrap z-20 pointer-events-none">
                                        -{cost} 💰
                                    </div>
                                )}
                            </div>
                        )}
                        
                        {/* 3. HAMMER (Visual Only on Click) */}
                        {isCracking && (
                            <div className="absolute -top-8 -right-8 z-30 animate-hammer-hit origin-bottom-left pointer-events-none">
                                <Hammer className="w-14 h-14 text-slate-800 fill-slate-300 drop-shadow-xl" />
                            </div>
                        )}

                        {/* 4. SHADOW (Bottom) */}
                        <div className="absolute -bottom-1 w-12 h-3 bg-black/10 rounded-[100%] blur-sm -z-10"></div>
                    </div>
                );
            })}
        </div>
        
        {/* === BOTTOM ACTION AREA === */}
        {userCoins < cost && (
            <div className="fixed bottom-24 bg-red-500 text-white px-4 py-2 rounded-full shadow-lg animate-bounce z-30 font-bold text-sm">
                {t('needCoins')}
            </div>
        )}

        <div className="mt-8 text-center opacity-40">
            <p className="text-[10px] font-bold uppercase tracking-widest text-yellow-900">
                {allCleared ? t('refreshBoard') : `${t('smashCost')} = ${cost} 💰`}
            </p>
        </div>

        <style>{`
            /* Phase 1: Shake + Crack appears */
            @keyframes shake-hard {
                0% { transform: rotate(0deg); }
                25% { transform: rotate(5deg) translate(2px, 0); }
                50% { transform: rotate(-5deg) translate(-2px, 0); }
                75% { transform: rotate(5deg) translate(2px, 0); }
                100% { transform: rotate(0deg); }
            }
            .animate-shake-hard {
                animation: shake-hard 0.15s infinite;
            }

            /* Phase 2: Shatter (Scale up + Fade out) */
            @keyframes shatter-fade {
                0% { transform: scale(1); opacity: 1; }
                50% { transform: scale(1.1); opacity: 0.8; }
                100% { transform: scale(1.5); opacity: 0; }
            }
            .animate-shatter-fade {
                animation: shatter-fade 0.5s ease-out forwards;
            }

            /* Prize Bounce In */
            @keyframes prize-bounce {
                0% { transform: scale(0) translateY(20px); opacity: 0; }
                50% { transform: scale(1.2) translateY(-10px); opacity: 1; }
                70% { transform: scale(0.9) translateY(0); }
                100% { transform: scale(1) translateY(0); }
            }
            .animate-prize-bounce {
                animation: prize-bounce 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
            }

            @keyframes hammer-hit {
                0% { transform: rotate(45deg) scale(0.8); opacity: 0; }
                20% { opacity: 1; }
                50% { transform: rotate(-45deg) scale(1.2); } /* The Hit */
                100% { transform: rotate(-20deg) scale(1); opacity: 0; }
            }
            .animate-hammer-hit {
                animation: hammer-hit 0.5s ease-in-out forwards;
            }
        `}</style>
    </div>
  );
};

// --- SUB COMPONENT: SVG EGG ---
const EggSVG = ({ styleType }: { styleType: EggStyle }) => {
    let defs = null;
    let fill = "#fff";

    if (styleType === 'gold') {
        fill = "url(#gradGold)";
        defs = (
            <radialGradient id="gradGold" cx="30%" cy="30%" r="70%">
                <stop offset="0%" stopColor="#fef08a" />
                <stop offset="50%" stopColor="#eab308" />
                <stop offset="100%" stopColor="#a16207" />
            </radialGradient>
        );
    } else if (styleType === 'dino') {
        fill = "#86efac"; 
    } else if (styleType === 'rainbow') {
        fill = "url(#gradRainbow)";
        defs = (
            <linearGradient id="gradRainbow" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#fca5a5" />
                <stop offset="50%" stopColor="#c4b5fd" />
                <stop offset="100%" stopColor="#67e8f9" />
            </linearGradient>
        );
    }

    return (
        <svg viewBox="0 0 80 100" className="w-full h-full drop-shadow-md">
            <defs>{defs}</defs>
            {/* Main Egg Shape */}
            <path 
                d="M40 2 C10 2 0 35 0 65 C0 88 15 98 40 98 C65 98 80 88 80 65 C80 35 70 2 40 2 Z" 
                fill={fill}
                stroke="rgba(0,0,0,0.1)"
                strokeWidth="1"
            />
            {/* Gloss Highlight */}
            <ellipse cx="25" cy="25" rx="12" ry="18" fill="white" fillOpacity="0.3" transform="rotate(-20 25 25)" />
            
            {/* Dino Spots */}
            {styleType === 'dino' && (
                <g fill="#15803d" fillOpacity="0.4">
                    <circle cx="20" cy="50" r="5" />
                    <circle cx="60" cy="70" r="8" />
                    <circle cx="50" cy="30" r="4" />
                    <circle cx="30" cy="80" r="3" />
                </g>
            )}
            
            {/* Pattern for Rainbow */}
            {styleType === 'rainbow' && (
                <path d="M0 60 Q 40 40 80 60" stroke="white" strokeWidth="2" strokeOpacity="0.5" fill="none" />
            )}
        </svg>
    );
};

// --- SUB COMPONENT: CRACK OVERLAY ---
const CrackSVG = () => (
    <svg viewBox="0 0 80 100" className="w-full h-full">
        <path 
            d="M40 10 L 35 30 L 45 40 L 30 60 L 50 70 L 40 90"
            fill="none"
            stroke="#475569" 
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="drop-shadow-sm opacity-80"
        />
        <path 
             d="M35 30 L 25 35 M 45 40 L 60 35 M 30 60 L 15 65"
             fill="none"
             stroke="#475569" 
             strokeWidth="2"
             strokeLinecap="round"
             className="drop-shadow-sm opacity-60"
        />
    </svg>
);
