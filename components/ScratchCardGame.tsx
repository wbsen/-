import React, { useState, useRef, useEffect } from 'react';
import { Prize, PrizeTier, TIER_COLORS } from '../types';
import { ArcadeButton, CoinSlot } from './ArcadeControls';
import { Eraser, Ticket } from 'lucide-react';

interface ScratchCardGameProps {
  onSpin: () => Prize | null;
  onReveal: (prize: Prize) => void;
  canSpin: boolean;
  cost: number;
  userCoins: number;
  t: (key: any) => string;
}

export const ScratchCardGame: React.FC<ScratchCardGameProps> = ({ onSpin, onReveal, canSpin, cost, userCoins, t }) => {
  const [gameState, setGameState] = useState<'idle' | 'dispensing' | 'playing' | 'revealed'>('idle');
  const [currentPrize, setCurrentPrize] = useState<Prize | null>(null);
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleBuyTicket = () => {
    if (gameState !== 'idle' || userCoins < cost) return;
    
    const wonPrize = onSpin();
    if (!wonPrize) return;

    setCurrentPrize(wonPrize);
    setGameState('dispensing');
    
    // Dispense Animation -> Ready to Play
    setTimeout(() => {
        setGameState('playing');
        initCanvas();
    }, 1000);
  };

  const initCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size matches visual size
    canvas.width = 240;
    canvas.height = 160;

    // Draw scratch layer (Silver foil)
    ctx.fillStyle = '#94a3b8'; // Slate-400
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Pattern on top
    ctx.fillStyle = '#cbd5e1'; // Slate-300
    ctx.font = '20px Fredoka';
    for(let i=0; i<10; i++) {
        for(let j=0; j<10; j++) {
            ctx.fillText('?', i*30 + 10, j*30 + 20);
        }
    }
    
    ctx.globalCompositeOperation = 'destination-out';
  };

  // Scratch Logic
  const scratch = (clientX: number, clientY: number) => {
    if (gameState !== 'playing') return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const x = clientX - rect.left;
    const y = clientY - rect.top;

    ctx.beginPath();
    ctx.arc(x, y, 20, 0, Math.PI * 2); // Brush size
    ctx.fill();

    checkProgress();
  };

  const checkProgress = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Sample pixels to check cleared area (simple optimization: check every 10th pixel)
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const pixels = imageData.data;
    let transparentPixels = 0;
    const totalPixels = pixels.length / 4;

    for (let i = 0; i < pixels.length; i += 4 * 10) { // stride 10
        if (pixels[i + 3] < 128) {
            transparentPixels++;
        }
    }

    // If > 40% cleared (approx), auto reveal
    if (transparentPixels > (totalPixels / 10) * 0.4) {
        setGameState('revealed');
        if (currentPrize) onReveal(currentPrize);
        
        // Reset after a delay
        setTimeout(() => {
            setGameState('idle');
            setCurrentPrize(null);
        }, 2000);
    }
  };

  // Event Listeners for Touch/Mouse
  const handleMouseMove = (e: React.MouseEvent) => {
    if (e.buttons !== 1) return; // Only if mouse down
    scratch(e.clientX, e.clientY);
  };
  const handleTouchMove = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    scratch(touch.clientX, touch.clientY);
  };


  return (
    <div className="flex flex-col items-center w-full max-w-sm mx-auto pt-4 pb-12">
        
        {/* === TICKET MACHINE === */}
        <div className="w-full bg-teal-700 p-6 rounded-t-[2.5rem] rounded-b-xl shadow-[0_10px_0_#115e59] border-4 border-teal-900 relative z-10 min-h-[340px] flex flex-col items-center justify-center overflow-hidden">
            
            {/* Machine Slot Exit */}
            <div className="absolute top-12 w-3/4 h-2 bg-black/40 rounded-full blur-[1px]"></div>
            <div className="absolute top-10 w-4/5 h-4 bg-teal-900 rounded-lg shadow-inner border-b border-teal-600"></div>

            {/* === THE TICKET AREA === */}
            <div className="relative w-[240px] h-[300px] flex flex-col items-center justify-center">
                
                {gameState === 'idle' && (
                    <div className="text-teal-200/50 flex flex-col items-center animate-pulse">
                         <Ticket className="w-20 h-20 mb-2" />
                         <span className="font-bold uppercase tracking-widest">{t('buyTicket')}</span>
                    </div>
                )}

                {(gameState === 'dispensing' || gameState === 'playing' || gameState === 'revealed') && currentPrize && (
                    <div className={`
                        relative w-[240px] h-[300px] bg-white rounded-xl shadow-2xl overflow-hidden border-4 border-slate-200
                        ${gameState === 'dispensing' ? 'animate-ticket-slide-down' : ''}
                    `}>
                        {/* Header */}
                        <div className="bg-slate-100 p-3 border-b-2 border-slate-200 border-dashed flex justify-between items-center">
                             <span className="font-black text-slate-400 text-xs tracking-wider">LUCKY SCRATCH</span>
                             <div className="flex gap-1">
                                <div className="w-2 h-2 rounded-full bg-slate-300"></div>
                                <div className="w-2 h-2 rounded-full bg-slate-300"></div>
                             </div>
                        </div>

                        {/* Prize Area (Underneath) */}
                        <div className={`absolute inset-0 top-[45px] flex flex-col items-center justify-center p-4 bg-gradient-to-br from-slate-50 to-slate-100`}>
                             <div className={`text-6xl mb-2 filter drop-shadow-md transform transition-all duration-500 ${gameState === 'revealed' ? 'scale-110' : 'scale-90'}`}>
                                 {currentPrize.image}
                             </div>
                             <div className="text-center">
                                 <div className={`text-xs font-bold px-2 py-0.5 rounded mb-1 inline-block ${TIER_COLORS[currentPrize.tier].split(' ')[0]} text-white`}>
                                     {currentPrize.tier}
                                 </div>
                                 <h3 className="font-bold text-slate-800 text-lg leading-tight">{currentPrize.name}</h3>
                             </div>
                        </div>

                        {/* Scratch Overlay (Canvas) */}
                        <canvas
                            ref={canvasRef}
                            className={`absolute top-[45px] left-0 cursor-crosshair touch-none ${gameState === 'revealed' ? 'opacity-0 pointer-events-none transition-opacity duration-500' : ''}`}
                            onMouseMove={handleMouseMove}
                            onTouchMove={handleTouchMove}
                            width={240}
                            height={255} // Fill rest of card
                        />
                        
                        {gameState === 'playing' && (
                             <div className="absolute bottom-2 w-full text-center pointer-events-none animate-pulse">
                                 <span className="bg-black/50 text-white text-[10px] px-2 py-1 rounded-full font-bold">
                                     {t('scratchHint')}
                                 </span>
                             </div>
                        )}
                    </div>
                )}
            </div>

        </div>

        {/* === CONTROL PANEL === */}
        <div className="w-[90%] -mt-2 pt-6 pb-6 bg-teal-800 rounded-b-[2.5rem] shadow-2xl border-x-4 border-b-8 border-teal-950 flex items-center justify-between px-6 relative z-0">
             
             <div className="absolute top-0 left-0 right-0 h-1/2 bg-white/10 pointer-events-none rounded-t-xl"></div>

             <div className="flex-1 bg-teal-900/50 rounded-lg p-2 border border-teal-950/30 shadow-inner z-10">
                <CoinSlot cost={cost} t={t} className="text-teal-100" />
            </div>

            <div className="flex-1 flex justify-center z-10 pl-4">
                 <ArcadeButton 
                    onClick={handleBuyTicket}
                    disabled={gameState !== 'idle' || userCoins < cost}
                    isSpinning={gameState === 'dispensing'}
                    color="green"
                    label="BUY"
                    cost={cost}
                />
            </div>
        </div>

        <style>{`
            @keyframes ticket-slide-down {
                0% { transform: translateY(-120%); }
                100% { transform: translateY(0); }
            }
            .animate-ticket-slide-down {
                animation: ticket-slide-down 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
            }
        `}</style>

    </div>
  );
};
