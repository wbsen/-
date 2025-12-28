import React from 'react';
import { PrizeTier } from '../types';

interface ConfettiProps {
  tier: PrizeTier;
}

// A simple SVG confetti overlay to avoid external heavy libraries
export const ConfettiEffect: React.FC<ConfettiProps> = ({ tier }) => {
  // Config based on tier
  const getConfig = () => {
    switch(tier) {
      case PrizeTier.LEGENDARY:
        return { count: 100, colors: ['#FFD700', '#FFA500', '#FFFFFF', '#FF4500'] }; // Gold/Fire
      case PrizeTier.EPIC:
        return { count: 60, colors: ['#A855F7', '#EC4899', '#FFFFFF', '#6366F1'] }; // Purple/Pink
      case PrizeTier.RARE:
        return { count: 40, colors: ['#3B82F6', '#60A5FA', '#FFFFFF'] }; // Blue
      case PrizeTier.FUN:
        return { count: 30, colors: ['#22C55E', '#86EFAC', '#FCD34D'] }; // Green/Yellow
      case PrizeTier.COMMON:
      default:
        return { count: 0, colors: [] }; // No confetti for common to make others special
    }
  };

  const { count, colors } = getConfig();

  if (count === 0) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {Array.from({ length: count }).map((_, i) => {
        const left = Math.random() * 100;
        const animDuration = 1.5 + Math.random() * 2;
        const delay = Math.random() * 0.5;
        const color = colors[Math.floor(Math.random() * colors.length)];
        
        return (
          <div
            key={i}
            className="absolute top-0 w-3 h-3 rounded-sm opacity-0 animate-fall"
            style={{
              left: `${left}%`,
              backgroundColor: color,
              animation: `fall ${animDuration}s linear ${delay}s forwards`,
              transform: `rotate(${Math.random() * 360}deg)`
            }}
          />
        );
      })}
      <style>{`
        @keyframes fall {
          0% { top: -5%; opacity: 1; transform: rotate(0deg); }
          100% { top: 100%; opacity: 0; transform: rotate(720deg); }
        }
        .animate-fall {
          animation-name: fall;
          animation-timing-function: ease-in;
        }
      `}</style>
    </div>
  );
};