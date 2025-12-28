import React, { useState } from 'react';
import { WonPrize } from '../types';
import { PrizeCard } from './PrizeCard';
import { PackageOpen, Trophy, Grid, Sparkles, CircleDollarSign } from 'lucide-react';

interface CollectionProps {
  inventory: WonPrize[];
  setActiveTab: (tab: any) => void;
  onItemClick: (item: WonPrize) => void;
  t: (key: any) => string;
}

export const Collection: React.FC<CollectionProps> = ({ inventory, setActiveTab, onItemClick, t }) => {
  const [subTab, setSubTab] = useState<'items' | 'badges'>('items');

  // Calculate total value (handling cases where price might be undefined for old records)
  const totalValue = inventory.reduce((sum, item) => sum + (item.price || 0), 0);

  return (
    <div className="flex flex-col h-full animate-in fade-in slide-in-from-right-8 duration-500 pb-20 pt-2">
      
      {/* Segmented Control */}
      <div className="flex p-1 bg-white/50 backdrop-blur-sm rounded-2xl mx-4 mb-4 shadow-sm border border-white/60">
        <button 
            onClick={() => setSubTab('items')}
            className={`flex-1 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2
                ${subTab === 'items' 
                    ? 'bg-purple-500 text-white shadow-md' 
                    : 'text-gray-500 hover:bg-white/50'
                }
            `}
        >
            <Grid className="w-4 h-4" /> {t('tabItems')}
        </button>
        <button 
            onClick={() => setSubTab('badges')}
            className={`flex-1 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2
                ${subTab === 'badges' 
                    ? 'bg-blue-500 text-white shadow-md' 
                    : 'text-gray-500 hover:bg-white/50'
                }
            `}
        >
            <Trophy className="w-4 h-4" /> {t('tabBadges')}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-4 hide-scrollbar">
          {subTab === 'items' && (
            <div className="animate-in fade-in zoom-in-95 duration-300">
               {/* Stats Summary */}
               <div className="mb-4 bg-white/60 rounded-2xl p-3 border border-purple-100 flex items-center justify-between shadow-sm">
                  <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
                          <PackageOpen className="w-4 h-4 text-purple-600" />
                      </div>
                      <div className="flex flex-col">
                          <span className="text-[10px] uppercase font-bold text-slate-400">Total Items</span>
                          <span className="text-sm font-black text-slate-700">{inventory.length}</span>
                      </div>
                  </div>
                  <div className="h-8 w-px bg-slate-200"></div>
                  <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center">
                          <CircleDollarSign className="w-4 h-4 text-amber-600" />
                      </div>
                      <div className="flex flex-col text-right min-w-[60px]">
                          <span className="text-[10px] uppercase font-bold text-slate-400">Total Value</span>
                          <span className="text-sm font-black text-amber-500">￥{totalValue}</span>
                      </div>
                  </div>
              </div>

              {inventory.length === 0 ? (
                  <div className="text-center py-20 opacity-50 bg-white/30 rounded-3xl border-2 border-dashed border-gray-200">
                      <div className="text-6xl mb-4 grayscale opacity-50">🎁</div>
                      <p className="font-medium text-gray-500">{t('emptyChest')}</p>
                      <button onClick={() => setActiveTab('draw')} className="mt-4 bg-white px-4 py-2 rounded-full text-blue-500 font-bold shadow-sm active:scale-95 transition-transform">{t('goSpin')}</button>
                  </div>
              ) : (
                  <div className="grid grid-cols-2 gap-3 pb-20">
                      {inventory.map((item) => (
                          <PrizeCard key={item.id} item={item} isInventory={true} onClick={onItemClick} t={t} />
                      ))}
                  </div>
              )}
            </div>
          )}

          {subTab === 'badges' && (
             <div className="animate-in fade-in zoom-in-95 duration-300">
                 <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-3xl p-8 shadow-inner border border-blue-100 text-center space-y-6">
                      
                      <div className="relative inline-block">
                        <div className="absolute inset-0 bg-blue-400 blur-2xl opacity-20 rounded-full animate-pulse"></div>
                        <Trophy className="w-24 h-24 text-blue-400 mx-auto relative z-10" strokeWidth={1.5} />
                      </div>

                      <div>
                        <h2 className="text-2xl font-black text-slate-700 mb-2">{t('comingSoon')}</h2>
                        <p className="text-slate-500 leading-relaxed max-w-xs mx-auto">
                            {t('badgesDesc')}
                        </p>
                      </div>

                      <div className="grid grid-cols-3 gap-4 opacity-40 grayscale pointer-events-none select-none">
                          {[1,2,3].map(i => (
                              <div key={i} className="aspect-square bg-white rounded-2xl shadow-sm flex items-center justify-center border border-gray-200">
                                  <div className="w-8 h-8 rounded-full bg-gray-200"></div>
                              </div>
                          ))}
                      </div>
                  </div>
             </div>
          )}
      </div>
    </div>
  );
};