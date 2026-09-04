import React from 'react';
import { getBallColorInfo } from '../utils/ballColors';

export default function LottoBall({ number, size = 'md', isBonus = false, isSelected = false, className = '' }) {
  const info = getBallColorInfo(number);

  const sizeClasses = {
    sm: 'w-7 h-7 text-xs font-bold',
    md: 'w-10 h-10 text-sm font-extrabold',
    lg: 'w-12 h-12 text-base font-extrabold',
    xl: 'w-14 h-14 text-lg font-black'
  }[size] || 'w-10 h-10 text-sm font-extrabold';

  return (
    <div className="relative inline-flex items-center justify-center group">
      <div
        className={`relative rounded-full flex items-center justify-center transition-all duration-300 transform hover:scale-110 shadow-lg ${sizeClasses} ${className}`}
        style={{
          background: info.gradient,
          color: info.textColor,
          boxShadow: `inset -3px -3px 6px rgba(0, 0, 0, 0.4), inset 2px 2px 4px rgba(255, 255, 255, 0.7), 0 4px 10px ${info.shadowColor}`
        }}
      >
        {/* Glossy top-left highlight */}
        <div className="absolute top-1 left-2.5 w-2.5 h-1.5 rounded-full bg-white opacity-60 blur-[0.5px]"></div>
        
        {/* Number text */}
        <span className="relative z-10 drop-shadow-[0_1px_1px_rgba(255,255,255,0.4)] font-mono">
          {number}
        </span>
      </div>

      {isBonus && (
        <span className="absolute -top-1 -right-1 flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-500"></span>
        </span>
      )}
    </div>
  );
}
