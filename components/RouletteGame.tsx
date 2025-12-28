import React, { useState, useEffect } from 'react';
import { Prize, PrizeTier } from '../types';
import { Crown } from 'lucide-react';
import { ArcadeButton, CoinSlot } from './ArcadeControls';

interface RouletteGameProps {
  onSpin: () => Prize | null;
  onReveal: (prize: Prize) => void;
  canSpin: boolean;
  cost: number;
  userCoins: number;
  prizes: Prize[];
  t: (key: any) => string;
}

export const RouletteGame: React.FC<RouletteGameProps> = ({ onSpin, onReveal, canSpin, cost, userCoins, prizes, t }) => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [displayedItems, setDisplayedItems] = useState<Prize[]>([]);

  // Update Grid Logic
  useEffect(() => {
    if (isRunning) return; 

    const updateGrid = () => {
        const available = prizes
            .filter(p => p.stock > 0)
            .sort((a, b) => b.price - a.price)
            .slice(0, 8); 
        
        setDisplayedItems([...available]);
    };

    updateGrid();
  }, [prizes, isRunning]);


  const handleStart = () => {
    if (isRunning || !canSpin || userCoins < cost) return;

    const wonPrize = onSpin();
    if (!wonPrize) return;

    setIsRunning(true);
    setActiveIndex(0);

    // Sync Logic
    let targetVisualIndex = displayedItems.findIndex(p => p.id === wonPrize.id);
    
    if (targetVisualIndex === -1) {
        setDisplayedItems(prev => {
            const newItems = [...prev];
            if (newItems.length < 8) {
                newItems.push(wonPrize);
                targetVisualIndex = newItems.length - 1;
            } else {
                newItems[7] = wonPrize; 
                targetVisualIndex = 7;
            }
            return newItems;
        });
    }

    // Spin Animation
    let currentIdx = 0;
    let speed = 50; 
    let rounds = 0;
    const minRounds = 4; 
    const totalSlots = 8; 

    const runLoop = () => {
      currentIdx = (currentIdx + 1) % totalSlots;
      setActiveIndex(currentIdx);
      if (currentIdx === 0) rounds++;

      if (rounds >= minRounds && currentIdx === targetVisualIndex) {
          setTimeout(() => {
              setIsRunning(false);
              onReveal(wonPrize);
              setActiveIndex(null); 
          }, 800); 
      } else {
          if (rounds < minRounds - 1) {
              speed = 50; 
          } else if (rounds === minRounds - 1) {
              speed += 10;
          } else {
              speed += 40; 
          }
          setTimeout(runLoop, speed);
      }
    };
    runLoop();
  };

  // Helper: Map grid position (0-8) to Logic Loop Index (0-7)
  // 0  1  2
  // 7     3
  // 6  5  4
  const getLogicIndexFromGridPos = (gridPos: number): number | null => {
      const map: {[key: number]: number} = {
          0: 0, 1: 1, 2: 2,
          5: 3,
          8: 4, 7: 5, 6: 6,
          3: 7
      };
      return map[gridPos] ?? null;
  };

  const renderCell = (gridPos: number) => {
    // Center decorative box
    if (gridPos === 4) {
        return (
            <div key="center" className="bg-indigo-900/50 rounded-xl flex flex-col items-center justify-center border-2 border-indigo-800/50 shadow-inner">
                <Crown className="w-8 h-8 text-yellow-400 opacity-80" />
                <span className="text-[10px] text-indigo-300 font-bold mt-1 tracking-widest">LUCKY</span>
            </div>
        );
    }

    const logicIndex = getLogicIndexFromGridPos(gridPos);
    if (logicIndex === null) return null;

    const item = displayedItems[logicIndex];
    const isActive = activeIndex === logicIndex;

    const getBorderColor = (tier: PrizeTier) => {
        switch(tier) {
            case PrizeTier.LEGENDARY: return 'border-yellow-400 bg-yellow-900/30';
            case PrizeTier.EPIC: return 'border-purple-400 bg-purple-900/30';
            case PrizeTier.RARE: return 'border-blue-400 bg-blue-900/30';
            case PrizeTier.FUN: return 'border-green-400 bg-green-900/30';
            default: return 'border-slate-400 bg-slate-800/50';
        }
    };

    const styleClass = item ? getBorderColor(item.tier) : 'border-slate-800 bg-slate-900/50';

    return (
        <div 
            key={gridPos}
            className={`
                relative rounded-xl flex flex-col items-center justify-center border-[3px] transition-all duration-75 overflow-hidden
                ${styleClass}
                ${isActive 
                    ? 'scale-105 z-20 shadow-[0_0_25px_rgba(255,255,255,0.6)] bg-white border-white' 
                    : 'opacity-100'
                }
            `}
        >
            {item && (
                <>
                    <div className={`w-full h-full p-2 flex items-center justify-center transition-transform ${isActive ? 'scale-110' : ''}`}>
                         {item.image.startsWith('data:') || item.image.startsWith('http') ? (
                             <img src={item.image} alt={item.name} className="w-full h-full object-contain" />
                         ) : (
                             <div className="text-3xl filter drop-shadow-md">{item.image}</div>
                         )}
                    </div>
                    {/* Gold Price Tag */}
                    <div className={`absolute bottom-1 px-1.5 rounded-sm text-[10px] font-black leading-none ${isActive ? 'bg-amber-400 text-amber-900' : 'bg-black/40 text-amber-300'}`}>
                        ￥{item.price}
                    </div>
                </>
            )}
            {!item && <div className="w-2 h-2 rounded-full bg-slate-800"></div>}
        </div>
    );
  };

  // --- LIGHTING EFFECT LOGIC ---
  // Create an array of bulb positions around the cabinet
  const renderBulbs = () => {
    // 8 main bulbs corresponding to grid positions
    // We visually place them around the container using absolute positioning
    return [0, 1, 2, 3, 4, 5, 6, 7].map((idx) => {
        const isActive = activeIndex === idx;
        
        // Define colors cycling: Red, Yellow, Green, Blue
        const colors = ['bg-red-500', 'bg-yellow-400', 'bg-green-500', 'bg-blue-500'];
        const colorClass = colors[idx % 4];
        
        // Positioning logic (Absolute %)
        let posStyle: React.CSSProperties = {};
        if (idx === 0) posStyle = { top: '5%', left: '5%' };    // TL
        if (idx === 1) posStyle = { top: '5%', left: '50%', transform: 'translateX(-50%)' }; // T
        if (idx === 2) posStyle = { top: '5%', right: '5%' };   // TR
        if (idx === 3) posStyle = { top: '50%', right: '5%', transform: 'translateY(-50%)' }; // R
        if (idx === 4) posStyle = { bottom: '5%', right: '5%' }; // BR
        if (idx === 5) posStyle = { bottom: '5%', left: '50%', transform: 'translateX(-50%)' }; // B
        if (idx === 6) posStyle = { bottom: '5%', left: '5%' };  // BL
        if (idx === 7) posStyle = { top: '50%', left: '5%', transform: 'translateY(-50%)' };  // L

        return (
            <div 
                key={idx}
                className={`
                    absolute w-4 h-4 rounded-full border-2 border-black/30 shadow-md transition-all duration-75
                    ${colorClass}
                    ${isActive ? 'scale-150 brightness-150 shadow-[0_0_15px_currentColor] z-30' : 'opacity-40 scale-100'}
                `}
                style={posStyle}
            />
        );
    });
  };

  return (
    <div className="flex flex-col items-center w-full max-w-sm mx-auto pt-4 pb-12">
        
        {/* === ARCADE CABINET TOP === */}
        <div className="w-full bg-slate-800 p-6 rounded-t-[2.5rem] rounded-b-xl shadow-[0_10px_0_#1e293b] border-4 border-slate-700 relative z-10">
            
            {/* The Bulb Container */}
            <div className="absolute inset-0 pointer-events-none">
                 {renderBulbs()}
            </div>

            {/* SCREEN */}
            <div className="bg-black rounded-[1.8rem] p-3 border-[6px] border-slate-600 shadow-inner relative z-10 mx-2 my-2">
                <div className="grid grid-cols-3 gap-3 w-full aspect-square">
                    {Array.from({ length: 9 }).map((_, i) => renderCell(i))}
                </div>
            </div>

            {/* Bottom Decor */}
            <div className="mt-2 flex justify-between px-6 text-[10px] font-mono text-slate-500 opacity-60">
                <span>WINNER</span>
                <span>LUCKY</span>
            </div>
        </div>


        {/* === CONTROL PANEL (Below) === */}
        <div className="w-[90%] -mt-2 pt-6 pb-6 bg-red-800 rounded-b-[2.5rem] shadow-2xl border-x-4 border-b-8 border-red-900 flex items-center justify-between px-6 relative z-0">
            
            {/* Gloss Overlay */}
            <div className="absolute top-0 left-0 right-0 h-1/2 bg-white/10 pointer-events-none rounded-t-xl"></div>

            {/* Coin Slot (Reusable) */}
            <div className="flex-1 bg-red-900/50 rounded-lg p-2 border border-red-950/30 shadow-inner z-10">
                <CoinSlot cost={cost} t={t} className="text-red-100" />
            </div>

            {/* Start Button (Reusable - Red Theme) */}
            <div className="flex-1 flex justify-center z-10 pl-4">
                 <ArcadeButton 
                    onClick={handleStart}
                    disabled={!canSpin || isRunning || userCoins < cost}
                    isSpinning={isRunning}
                    color="red"
                    label="SPIN"
                    cost={cost}
                />
            </div>
        </div>

        {/* Status Message */}
        <div className="mt-4 h-6">
            {userCoins < cost && (
                <div className="text-red-500 font-bold text-xs bg-white/90 px-3 py-1 rounded-full animate-bounce shadow-sm border border-red-100">
                    INSERT COIN (Need {cost})
                </div>
            )}
        </div>

    </div>
  );
};