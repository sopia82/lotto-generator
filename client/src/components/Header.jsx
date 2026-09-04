import React from 'react';
import { Sparkles, RefreshCw, Cpu, Award } from 'lucide-react';

export default function Header({ latestDraw, onRefresh, isLoading }) {
  return (
    <header className="sticky top-0 z-50 bg-slate-950/80 backdrop-blur-md border-b border-slate-800/80 px-4 py-3">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Logo & Title */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 via-rose-500 to-indigo-500 p-0.5 shadow-glow">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Cpu className="w-5 h-5 text-amber-400 animate-pulse" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-slate-100 tracking-tight flex items-center gap-1.5">
                로또 <span className="text-amber-400 font-extrabold">6/45</span> AI 가중치 생성기
              </h1>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 font-mono font-semibold">
                PRO v2.0
              </span>
            </div>
            <p className="text-xs text-slate-400">
              최근 당첨 데이터 출현 빈도수 가중치 랜덤 추첨 (Weighted Sampling Algorithm)
            </p>
          </div>
        </div>

        {/* Right Status Actions */}
        <div className="flex items-center gap-3">
          {latestDraw && (
            <div className="hidden sm:flex items-center gap-2 bg-slate-900/80 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-300">
              <Award className="w-4 h-4 text-emerald-400" />
              <span>최신 <strong className="text-amber-400">{latestDraw.drwNo}회</strong> ({latestDraw.drwNoDate})</span>
            </div>
          )}

          <button
            onClick={onRefresh}
            disabled={isLoading}
            className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white px-3 py-1.5 rounded-lg text-xs font-medium border border-slate-700 transition-all duration-200 disabled:opacity-50"
            title="최신 통계 데이터 새로고침"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-amber-400 ${isLoading ? 'animate-spin' : ''}`} />
            <span>데이터 갱신</span>
          </button>
        </div>

      </div>
    </header>
  );
}
