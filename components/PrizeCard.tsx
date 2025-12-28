import React from 'react';
import { Prize, WonPrize, TIER_COLORS, PrizeTier } from '../types';
import { Box } from 'lucide-react';

interface PrizeCardProps {
  item: Prize | WonPrize;
  isInventory?: boolean;
  t: (key: any) => string;
  onClick?: (item: Prize | WonPrize) => void;
}

export const PrizeCard: React.FC<PrizeCardProps> = ({ item, isInventory = false, t, onClick }) => {
  const stock = (item as Prize).stock;
  const isOutOfStock = stock !== undefined && stock === 0;
  const hasModel = !!item.modelUrl;
  
  const isCommon = item.tier === PrizeTier.COMMON;
  const textColorClass = isCommon ? 'text-slate-700' : 'text-white';
  const badgeColorClass = isCommon ? 'bg-slate-200 text-slate-600' : 'bg-black/20 text-white backdrop-blur-sm';

  const isImage = item.image.startsWith('data:') || item.image.startsWith('http');

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
    <button 
      onClick={() => onClick && onClick(item)}
      className={`relative flex flex-col items-center p-4 rounded-3xl border-b-8 transition-transform transform hover:scale-105 active:scale-95 w-full text-left
        ${TIER_COLORS[item.tier]} ${isOutOfStock ? 'opacity-60 grayscale' : 'shadow-lg'}
      `}
    >
      
      {/* 3D Indicator */}
      {hasModel && !isOutOfStock && (
        <div className="absolute top-2 left-2 flex items-center gap-1 bg-blue-500 text-white text-[8px] font-black px-1.5 py-0.5 rounded-full shadow-lg animate-badge-glow z-10">
          <Box className="w-2.5 h-2.5" /> 3D
        </div>
      )}

      {/* Rarity Badge */}
      <div className={`absolute top-2 right-2 text-[10px] font-bold px-2 py-1 rounded-full ${badgeColorClass} z-10`}>
        {getTierLabel(item.tier)}
      </div>

      {/* Image Container */}
      <div className="w-full aspect-square mb-2 flex items-center justify-center overflow-hidden rounded-2xl bg-black/5">
        {isImage ? (
           <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
        ) : (
           <div className="text-6xl drop-shadow-md filter transition-all duration-300">
             {item.image}
           </div>
        )}
      </div>

      {/* Name */}
      <h3 className={`font-bold text-center leading-tight mb-1 text-lg w-full truncate ${textColorClass}`}>
        {item.name}
      </h3>

      {/* Footer Info */}
      <div className="mt-auto w-full flex justify-center">
        {isInventory ? (
          <span className={`text-xs opacity-80 font-medium ${textColorClass}`}>
             {t('owned')}
          </span>
        ) : (
          <div className="flex items-center gap-1">
             {stock === 0 ? (
               <span className="text-xs font-bold bg-red-500 text-white px-2 py-1 rounded-full">{t('soldOut')}</span>
             ) : (
               <span className={`text-xs font-bold px-2 py-1 rounded-full ${isCommon ? 'bg-slate-200 text-slate-700' : 'bg-white/30 text-white'}`}>
                 {stock} {t('left')}
               </span>
             )}
          </div>
        )}
      </div>
    </button>
  );
};