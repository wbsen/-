import React from 'react';
import { Prize, WonPrize, TIER_COLORS, PrizeTier } from '../types';
import { X, Box, Rotate3d } from 'lucide-react';

interface PrizeDetailModalProps {
  prize: Prize | WonPrize;
  onClose: () => void;
  t: (key: any) => string;
}

export const PrizeDetailModal: React.FC<PrizeDetailModalProps> = ({ prize, onClose, t }) => {
  const isImage = prize.image.startsWith('data:') || prize.image.startsWith('http');
  const hasModel = !!prize.modelUrl;
  const tierColor = TIER_COLORS[prize.tier] || 'bg-slate-100';
  
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
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200" onClick={onClose}>
      <div 
        className={`relative w-full max-w-sm rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col ${tierColor}`}
        onClick={e => e.stopPropagation()}
      >
        <div className="absolute inset-0 pointer-events-none opacity-10 bg-[radial-gradient(circle,currentColor_1px,transparent_1px)] [background-size:16px_16px]"></div>

        <button 
            onClick={onClose}
            className="absolute top-5 right-5 z-40 bg-black/10 hover:bg-black/20 p-2 rounded-full transition-colors backdrop-blur-md border border-white/10"
        >
            <X className="w-5 h-5 opacity-80" />
        </button>

        {/* 3D Indicator Badge for Detail Modal */}
        {hasModel && (
          <div className="absolute top-5 left-5 z-40 flex items-center gap-1.5 bg-blue-500 text-white px-3 py-1.5 rounded-full text-[10px] font-black shadow-lg animate-bounce">
            <Rotate3d className="w-3.5 h-3.5" /> 3D PREVIEW
          </div>
        )}

        {/* Visual Container */}
        <div className="p-4 w-full z-10">
            <div className="w-full aspect-square rounded-[2rem] shadow-lg flex items-center justify-center overflow-hidden relative bg-white">
                <div className="w-full h-full flex items-center justify-center relative">
                    {hasModel ? (
                        /* Google Model Viewer Integration */
                        // @ts-ignore - model-viewer is a custom element
                        <model-viewer
                          src={prize.modelUrl}
                          alt={prize.name}
                          auto-rotate
                          camera-controls
                          shadow-intensity="1"
                          rotation-speed="20"
                          interaction-prompt="auto"
                          touch-action="pan-y"
                        >
                          <div slot="poster" className="flex items-center justify-center w-full h-full bg-slate-50">
                             {isImage ? <img src={prize.image} className="w-1/2 opacity-30 blur-sm" /> : <span className="text-6xl opacity-20">{prize.image}</span>}
                          </div>
                        </model-viewer>
                    ) : isImage ? (
                        <img src={prize.image} alt={prize.name} className="w-full h-full object-contain drop-shadow-xl p-6" />
                    ) : (
                        <span className="text-9xl select-none filter drop-shadow-lg scale-150">{prize.image}</span>
                    )}
                </div>
            </div>
        </div>

        {/* Details Content */}
        <div className="flex flex-col items-center px-6 pb-10 pt-0 z-10 text-center">
            <div className="px-6 py-2 rounded-full text-sm font-black uppercase tracking-wider mb-4 bg-white/30 border border-white/40 shadow-sm backdrop-blur-md">
                {getTierLabel(prize.tier)}
            </div>

            <h2 className="text-3xl font-black leading-tight mb-5 drop-shadow-sm opacity-90">
                {prize.name}
            </h2>

            {hasModel && (
               <p className="text-[10px] text-blue-800 font-bold uppercase mb-4 opacity-70 tracking-tighter">
                  Drag to rotate • Pinch to zoom
               </p>
            )}

            {'price' in prize && (
                 <div className="flex items-center justify-center gap-1 bg-white px-8 py-3 rounded-2xl shadow-xl min-w-[140px]">
                    <span className="text-3xl font-black text-amber-500 font-mono tracking-tight flex items-baseline gap-1">
                        <span className="text-xl opacity-80">￥</span>{(prize as Prize).price}
                    </span>
                 </div>
            )}
            
            {'wonAt' in prize && (
                 <p className="text-xs mt-4 font-bold bg-white/30 px-4 py-1.5 rounded-full opacity-80 uppercase tracking-widest border border-white/20">
                    {t('owned')}
                 </p>
            )}
        </div>
      </div>
    </div>
  );
};