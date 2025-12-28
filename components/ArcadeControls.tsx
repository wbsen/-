import React from 'react';
import { Zap } from 'lucide-react';

interface CoinSlotProps {
  cost: number;
  t: (key: any) => string;
  className?: string;
}

export const CoinSlot: React.FC<CoinSlotProps> = ({ cost, t, className = '' }) => {
  return (
    <div className={`flex flex-col items-center justify-center gap-1 ${className}`}>
        <div className="text-[9px] text-white/60 font-mono uppercase tracking-widest">{t('price')}</div>
        <div className="flex items-center gap-1 text-yellow-300 font-bold text-lg mb-1 drop-shadow-md">
            {cost} <div className="w-3.5 h-3.5 rounded-full border-2 border-yellow-400 bg-yellow-300 shadow-[0_0_5px_yellow]"></div>
        </div>
        {/* The Standard Vertical Slot */}
        <div className="w-8 h-12 bg-black/40 rounded-lg border-2 border-white/10 flex items-center justify-center shadow-inner relative">
             <div className="w-1.5 h-8 bg-black rounded-full border border-white/20 shadow-[0_0_2px_rgba(255,255,255,0.3)]"></div>
             <div className="absolute -bottom-4 text-[8px] text-white/40 uppercase tracking-widest font-bold">Insert</div>
        </div>
    </div>
  );
};

interface ArcadeButtonProps {
  onClick: () => void;
  disabled: boolean;
  isSpinning: boolean;
  color?: 'yellow' | 'red' | 'green' | 'blue';
  label?: string;
  cost?: number; // Optional, to show cost badge on button
}

const BUTTON_THEMES = {
  yellow: {
    bg: 'bg-yellow-400 hover:bg-yellow-300',
    border: 'border-yellow-600',
    text: 'text-yellow-900',
    shadow: 'shadow-yellow-900/20'
  },
  red: {
    bg: 'bg-red-500 hover:bg-red-400',
    border: 'border-red-700',
    text: 'text-white',
    shadow: 'shadow-red-900/20'
  },
  green: {
    bg: 'bg-green-500 hover:bg-green-400',
    border: 'border-green-700',
    text: 'text-white',
    shadow: 'shadow-green-900/20'
  },
  blue: {
    bg: 'bg-blue-500 hover:bg-blue-400',
    border: 'border-blue-700',
    text: 'text-white',
    shadow: 'shadow-blue-900/20'
  }
};

export const ArcadeButton: React.FC<ArcadeButtonProps> = ({ 
  onClick, disabled, isSpinning, color = 'yellow', label = 'START', cost 
}) => {
  const theme = BUTTON_THEMES[color];

  return (
    <div className="relative">
        <button
            onClick={onClick}
            disabled={disabled}
            className={`
                w-20 h-20 rounded-full border-b-[6px] transition-all duration-75
                flex items-center justify-center relative overflow-hidden shadow-xl
                ${disabled 
                    ? 'bg-slate-400 border-slate-500 text-slate-200 grayscale cursor-not-allowed' 
                    : `${theme.bg} ${theme.border} ${theme.text} active:scale-95 active:border-b-0 active:translate-y-1.5 cursor-pointer`
                }
                ${isSpinning ? 'brightness-110 scale-[0.98]' : 'hover:scale-105'}
            `}
        >
            {/* Glossy Overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent rounded-full pointer-events-none"></div>
            <div className="absolute top-2 left-1/2 -translate-x-1/2 w-10 h-4 bg-white/20 blur-sm rounded-full pointer-events-none"></div>

            {isSpinning ? (
                <Zap className={`w-8 h-8 animate-spin ${disabled ? 'text-slate-300' : 'text-current'}`} />
            ) : (
                <div className="font-black text-sm text-center leading-none uppercase drop-shadow-sm tracking-wide">
                    {label}
                </div>
            )}
        </button>

        {/* Cost Badge (Optional) */}
        {cost !== undefined && !disabled && (
            <div className="absolute -top-2 -right-2 bg-black/80 text-white text-[10px] font-bold px-2 py-0.5 rounded-full border border-white/20 shadow-sm flex items-center gap-1 backdrop-blur-md">
                -{cost} <div className="w-2 h-2 bg-yellow-400 rounded-full shadow-[0_0_5px_yellow]"></div>
            </div>
        )}
    </div>
  );
};
