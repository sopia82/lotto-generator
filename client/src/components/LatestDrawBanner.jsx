import React from 'react';
import LottoBall from './LottoBall';
import { Trophy, Calendar, Plus, Coins } from 'lucide-react';

export default function LatestDrawBanner({ latestDraw }) {
  if (!latestDraw) {
    return (
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 text-center animate-pulse">
        <p className="text-slate-400 text-sm">최신 당첨 번호 데이터를 불러오는 중...</p>
      </div>
    );
  }

  const formatMoney = (amount) => {
    if (!amount) return '집계 중';
    const num = Number(amount);
    const uk = Math.floor(num / 100000000);
    const man = Math.floor((num % 100000000) / 10000);
    return `${uk.toLocaleString()}억 ${man > 0 ? man.toLocaleString() + '만' : ''}원`;
  };

  return (
    <div className="bg-gradient-to-r from-slate-900 via-slate-900/90 to-amber-950/30 border border-amber-500/20 rounded-2xl p-5 md:p-6 shadow-2xl relative overflow-hidden">
      {/* Background glow decoration */}
      <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
        
        {/* Draw Meta Header */}
        <div className="space-y-1.5 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 font-bold text-xs border border-amber-500/30">
              <Trophy className="w-3.5 h-3.5" /> 동행복권 공식 당첨번호
            </span>
            <span className="inline-flex items-center gap-1 text-xs text-slate-400 font-mono">
              <Calendar className="w-3.5 h-3.5 text-slate-500" /> {latestDraw.drwNoDate}
            </span>
          </div>

          <h2 className="text-2xl md:text-3xl font-extrabold text-white">
            제 <span className="text-amber-400 font-mono">{latestDraw.drwNo}회</span> 당첨 결과
          </h2>

          {latestDraw.firstWinamnt > 0 && (
            <p className="text-xs text-slate-400 flex items-center justify-center md:justify-start gap-1">
              <Coins className="w-3.5 h-3.5 text-amber-400" /> 1등 당첨금 (1게임당):{' '}
              <strong className="text-amber-300 font-medium">{formatMoney(latestDraw.firstWinamnt)}</strong>{' '}
              <span className="text-slate-500">({latestDraw.firstPrzwnerCo || 0}명)</span>
            </p>
          )}
        </div>

        {/* Lotto Balls Display */}
        <div className="flex items-center gap-2 md:gap-3 flex-wrap justify-center bg-slate-950/60 p-3.5 rounded-xl border border-slate-800">
          {latestDraw.numbers.map((num, idx) => (
            <LottoBall key={idx} number={num} size="lg" />
          ))}

          <div className="flex items-center justify-center px-1 text-amber-400 font-bold">
            <Plus className="w-5 h-5" />
          </div>

          <div className="flex flex-col items-center">
            <LottoBall number={latestDraw.bonusNo} size="lg" isBonus={true} />
            <span className="text-[10px] text-amber-400 font-bold mt-1">보너스</span>
          </div>
        </div>

      </div>
    </div>
  );
}
