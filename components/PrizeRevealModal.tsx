import React from 'react';
import { Prize, PrizeTier } from '../types';
import { ConfettiEffect } from './Confetti';

interface PrizeRevealModalProps {
  prize: Prize;
  onClose: () => void;
  t: (key: any) => string;
}

// Visual configuration for each tier
const TIER_STYLES = {
  [PrizeTier.LEGENDARY]: {
    // Gold gradient border + shimmer effect
    containerClass: 'border-transparent bg-gradient-to-br from-yellow-100 to-white ring-8 ring-yellow-400/30',
    button: 'bg-[linear-gradient(110deg,#eab308,45%,#fde047,55%,#eab308)] animate-shimmer bg-[length:200%_100%] text-yellow-950 shadow-[0_4px_0_#a16207]',
    animation: 'animate-legendary-pop',
    titleClass: 'bg-clip-text text-transparent bg-gradient-to-b from-yellow-500 via-yellow-600 to-yellow-800 drop-shadow-sm',
    iconAnim: 'animate-pulse-gold',
    badge: 'bg-gradient-to-r from-yellow-500 to-amber-600 text-white shadow-lg border border-yellow-300',
    isLegendary: true,
    bgEffect: null
  },
  [PrizeTier.EPIC]: {
    containerClass: 'border-purple-400 ring-4 ring-purple-200/50 bg-white',
    button: 'bg-gradient-to-b from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white shadow-[0_4px_0_#7e22ce]',
    animation: 'animate-elastic',
    bgEffect: 'from-purple-300 via-fuchsia-400 to-pink-500',
    titleClass: 'text-purple-700',
    iconAnim: 'animate-bounce',
    badge: 'bg-purple-600 text-white',
    isLegendary: false
  },
  [PrizeTier.RARE]: {
    containerClass: 'border-blue-400 ring-4 ring-blue-200/50 bg-white',
    button: 'bg-gradient-to-b from-blue-400 to-blue-500 hover:from-blue-500 hover:to-blue-600 text-white shadow-[0_4px_0_#1d4ed8]',
    animation: 'animate-elastic',
    bgEffect: 'from-blue-300 via-cyan-400 to-teal-400',
    titleClass: 'text-blue-700',
    iconAnim: 'animate-pulse',
    badge: 'bg-blue-500 text-white',
    isLegendary: false
  },
  [PrizeTier.FUN]: {
    containerClass: 'border-green-400 ring-4 ring-green-200/50 bg-white',
    button: 'bg-gradient-to-b from-green-400 to-green-500 hover:from-green-500 hover:to-green-600 text-white shadow-[0_4px_0_#15803d]',
    animation: 'animate-simple-pop',
    bgEffect: 'from-green-200 to-emerald-300',
    titleClass: 'text-green-700',
    iconAnim: 'animate-bounce',
    badge: 'bg-green-500 text-white',
    isLegendary: false
  },
  [PrizeTier.COMMON]: {
    containerClass: 'border-slate-300 bg-white',
    button: 'bg-slate-200 hover:bg-slate-300 text-slate-700 shadow-[0_4px_0_#94a3b8]',
    animation: 'animate-simple-pop',
    bgEffect: null,
    titleClass: 'text-slate-700',
    iconAnim: '',
    badge: 'bg-slate-400 text-white',
    isLegendary: false
  }
};

export const PrizeRevealModal: React.FC<PrizeRevealModalProps> = ({ prize, onClose, t }) => {
  const styles = TIER_STYLES[prize.tier];
  
  // Custom logic for backgrounds
  const isLegendary = styles.isLegendary;
  const hasBgEffect = !!styles.bgEffect || isLegendary;

  // Helper to get translated tier name
  const getTierLabel = (tier: PrizeTier) => {
      switch(tier) {
          case PrizeTier.LEGENDARY: return t('tierLegendary');
          case PrizeTier.EPIC: return t('tierEpic');
          case PrizeTier.RARE: return t('tierRare');
          case PrizeTier.FUN: return t('tierFun');
          case PrizeTier.COMMON: return t('tierCommon');
          default: return tier;
      }
  };

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 animate-in fade-in duration-300 backdrop-blur-sm">
      <ConfettiEffect tier={prize.tier} />
      
      {/* Container with dynamic animation and border */}
      <div className={`
          relative w-full max-w-sm rounded-[2rem] shadow-2xl p-8 
          flex flex-col items-center 
          ${styles.animation} 
          border-[6px] ${styles.containerClass}
          overflow-hidden
      `}>
        
        {/* === BACKGROUND EFFECTS === */}
        {hasBgEffect && (
            <div className="absolute inset-0 z-0 pointer-events-none opacity-30">
                {isLegendary ? (
                    // LEGENDARY: Rotating Sunburst / God Rays
                    <>
                        {/* The rotating rays */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200%] h-[200%] animate-rays"
                            style={{ 
                                background: 'conic-gradient(from 0deg, transparent 0deg, #fbbf24 10deg, transparent 20deg, #f59e0b 30deg, transparent 40deg, #fbbf24 50deg, transparent 60deg, #f59e0b 70deg, transparent 80deg, #fbbf24 90deg, transparent 100deg, #f59e0b 110deg, transparent 120deg, #fbbf24 130deg, transparent 140deg, #f59e0b 150deg, transparent 160deg, #fbbf24 170deg, transparent 180deg, #f59e0b 190deg, transparent 200deg, #fbbf24 210deg, transparent 220deg, #f59e0b 230deg, transparent 240deg, #fbbf24 250deg, transparent 260deg, #f59e0b 270deg, transparent 280deg, #fbbf24 290deg, transparent 300deg, #f59e0b 310deg, transparent 320deg, #fbbf24 330deg, transparent 340deg, #f59e0b 350deg, transparent 360deg)'
                            }}>
                        </div>
                        {/* A radial glow in the center to blend the source */}
                        <div className="absolute inset-0 bg-radial-gradient from-yellow-100 via-transparent to-transparent opacity-80"></div>
                    </>
                ) : (
                    // OTHERS: Standard Beam
                    <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200%] h-[200%] bg-gradient-to-r ${styles.bgEffect || ''} animate-rays`}
                        style={{ clipPath: 'polygon(50% 50%, 0 0, 20% 0, 50% 50%, 40% 0, 60% 0, 50% 50%, 80% 0, 100% 0, 50% 50%, 100% 20%, 100% 40%, 50% 50%, 100% 60%, 100% 80%, 50% 50%, 100% 100%, 80% 100%, 50% 50%, 60% 100%, 40% 100%, 50% 50%, 20% 100%, 0 100%, 50% 50%, 0 80%, 0 60%, 50% 50%, 0 40%, 0 20%)' }}>
                    </div>
                )}
            </div>
        )}

        <div className="z-10 flex flex-col items-center w-full">
            {/* Tier Badge */}
            <div className={`px-4 py-1.5 rounded-full font-bold text-xs uppercase tracking-wider mb-8 transform -rotate-2 ${styles.badge}`}>
                {getTierLabel(prize.tier)}
            </div>

            {/* Prize Icon */}
            <div className={`text-9xl mb-8 filter ${styles.iconAnim}`}>
                {prize.image}
            </div>

            {/* Prize Name */}
            <h2 className={`text-3xl font-black text-center mb-2 leading-tight ${styles.titleClass}`}>
                {prize.name}
            </h2>
            
            <p className="text-gray-500 text-center text-sm mb-8 px-4 font-medium">
                {t('yayAdded')}
            </p>

            {/* Action Button */}
            <button 
                onClick={onClose}
                className={`w-full font-extrabold text-xl py-4 rounded-2xl active:shadow-none active:translate-y-[4px] transition-all relative overflow-hidden group ${styles.button}`}
            >
                <span className="relative z-10">{t('awesome')}</span>
                {/* Glossy overlay for button */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent pointer-events-none"></div>
            </button>
        </div>
      </div>
    </div>
  );
};