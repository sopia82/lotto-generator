import React, { useState } from 'react';
import LottoBall from './LottoBall';
import { Sparkles, Copy, Check, Dices, Share2, History, ChevronRight } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function GeneratorResults({
  games,
  onGenerate,
  isGenerating,
  inclusion,
  exclusion,
  history,
  onLoadHistory
}) {
  const [copiedGameIdx, setCopiedGameIdx] = useState(null);
  const [copiedAll, setCopiedAll] = useState(false);

  const handleGenerateClick = () => {
    onGenerate();
    
    // Trigger celebratory confetti effect
    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 }
      });
    } catch (e) {
      // fallback if canvas-confetti fails
    }
  };

  // Copy single game to clipboard
  const copySingleGame = (game, idx) => {
    const text = `[로또6/45 게임 ${game.label}] ${game.numbers.map((n) => String(n).padStart(2, '0')).join(', ')}`;
    navigator.clipboard.writeText(text);
    setCopiedGameIdx(idx);
    setTimeout(() => setCopiedGameIdx(null), 2000);
  };

  // Copy all 5 games to clipboard
  const copyAllGames = () => {
    if (!games || games.length === 0) return;
    const lines = games.map(
      (g) => `게임 ${g.label}: ${g.numbers.map((n) => String(n).padStart(2, '0')).join(', ')}`
    );
    const fullText = `=== 로또 6/45 AI 가중치 조합 5게임 ===\n${lines.join('\n')}\n====================================`;
    navigator.clipboard.writeText(fullText);
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2000);
  };

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 md:p-6 space-y-6 shadow-2xl relative overflow-hidden">
      
      {/* Background glow decoration */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>

      {/* Action Header & Generate Button */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <h3 className="text-xl font-extrabold text-white flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-amber-400 animate-spin-slow" />
            AI 가중치 5게임 추첨 번호
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            고정 번호 ({inclusion.length}개) 및 제외 번호 ({exclusion.length}개) 조건이 반영된 중복 없는 로또 5세트
          </p>
        </div>

        {/* Big Generate Button */}
        <button
          onClick={handleGenerateClick}
          disabled={isGenerating}
          className="w-full md:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-amber-500 via-rose-500 to-indigo-600 hover:from-amber-400 hover:via-rose-400 hover:to-indigo-500 text-slate-950 font-black text-base tracking-wide shadow-glow transition-all duration-300 transform active:scale-95 flex items-center justify-center gap-3 group disabled:opacity-50"
        >
          <Dices className={`w-6 h-6 text-slate-950 transition-transform group-hover:rotate-180 ${isGenerating ? 'animate-spin' : ''}`} />
          <span>{isGenerating ? '추첨 계산 중...' : '5게임 번호 생성하기'}</span>
        </button>
      </div>

      {/* Copy All Header Bar */}
      {games && games.length > 0 && (
        <div className="flex items-center justify-between bg-slate-950/70 p-3 rounded-xl border border-slate-800">
          <span className="text-xs text-slate-300 font-medium">
            생성된 조합 총 <strong className="text-amber-400">{games.length}게임</strong>
          </span>
          
          <button
            onClick={copyAllGames}
            className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold px-4 py-2 rounded-lg text-xs transition-all shadow-md active:scale-95"
          >
            {copiedAll ? (
              <>
                <Check className="w-4 h-4" /> 복사 완료!
              </>
            ) : (
              <>
                <Share2 className="w-4 h-4" /> 전체 5게임 복사
              </>
            )}
          </button>
        </div>
      )}

      {/* Games List (A, B, C, D, E) */}
      <div className="space-y-3">
        {(!games || games.length === 0) ? (
          <div className="text-center py-12 border border-dashed border-slate-800 rounded-2xl bg-slate-950/40 space-y-3">
            <Dices className="w-12 h-12 text-slate-600 mx-auto animate-bounce-subtle" />
            <p className="text-slate-400 font-medium">상단의 '5게임 번호 생성하기' 버튼을 클릭하세요!</p>
            <p className="text-xs text-slate-500">최근 당첨 통계와 설정한 조건으로 최고의 조합을 생성해 드립니다.</p>
          </div>
        ) : (
          games.map((game, idx) => (
            <div
              key={game.label || idx}
              className="group bg-slate-950/80 hover:bg-slate-950 border border-slate-800 hover:border-amber-500/40 rounded-xl p-4 transition-all duration-200 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg"
            >
              {/* Game Label */}
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-rose-500 text-slate-950 font-black text-sm flex items-center justify-center shadow-md">
                  {game.label}
                </span>
                <span className="text-xs font-semibold text-slate-400">
                  게임 {game.label}
                </span>
              </div>

              {/* Balls (6 numbers sorted ascending) */}
              <div className="flex items-center justify-center gap-2 sm:gap-3 flex-wrap">
                {game.numbers.map((num, nIdx) => (
                  <LottoBall key={nIdx} number={num} size="md" />
                ))}
              </div>

              {/* Copy Single Game */}
              <button
                onClick={() => copySingleGame(game, idx)}
                className="w-full sm:w-auto flex items-center justify-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white px-3 py-1.5 rounded-lg text-xs border border-slate-800 transition-colors"
                title="이 게임 복사"
              >
                {copiedGameIdx === idx ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400 font-bold">복사됨</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-slate-400" />
                    <span>복사</span>
                  </>
                )}
              </button>
            </div>
          ))
        )}
      </div>

      {/* History Log */}
      {history && history.length > 0 && (
        <div className="pt-4 border-t border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="flex items-center gap-1.5 font-bold text-slate-300">
              <History className="w-3.5 h-3.5 text-amber-400" /> 최근 생성 기록 ({history.length}회)
            </span>
          </div>

          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin">
            {history.map((hist, hIdx) => (
              <button
                key={hIdx}
                onClick={() => onLoadHistory(hist)}
                className="flex-shrink-0 bg-slate-950 hover:bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-left text-xs space-y-1 transition-colors min-w-[200px]"
              >
                <div className="flex items-center justify-between text-[10px] text-slate-500">
                  <span>{hist.time}</span>
                  <ChevronRight className="w-3 h-3 text-slate-600" />
                </div>
                <div className="flex items-center gap-1">
                  {hist.games[0]?.numbers.slice(0, 3).map((n) => (
                    <span key={n} className="w-5 h-5 rounded-full bg-slate-800 text-slate-200 text-[10px] flex items-center justify-center font-mono">
                      {n}
                    </span>
                  ))}
                  <span className="text-slate-500 text-[10px]">외 {hist.games.length * 6 - 3}개</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
