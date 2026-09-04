import React, { useState } from 'react';
import LottoBall from './LottoBall';
import { Lock, Ban, RotateCcw, Sliders, CheckCircle2, AlertCircle } from 'lucide-react';

export default function NumberSelector({
  inclusion,
  exclusion,
  onInclusionChange,
  onExclusionChange,
  baseWeight,
  onBaseWeightChange
}) {
  const [selectMode, setSelectMode] = useState('inclusion'); // 'inclusion' | 'exclusion'

  const handleNumberClick = (number) => {
    const num = Number(number);

    if (selectMode === 'inclusion') {
      if (inclusion.includes(num)) {
        // Toggle off
        onInclusionChange(inclusion.filter((n) => n !== num));
      } else {
        if (inclusion.length >= 5) {
          alert('고정 번호는 최대 5개까지 선택할 수 있습니다.');
          return;
        }
        // Remove from exclusion if present
        if (exclusion.includes(num)) {
          onExclusionChange(exclusion.filter((n) => n !== num));
        }
        onInclusionChange([...inclusion, num].sort((a, b) => a - b));
      }
    } else {
      // Exclusion mode
      if (exclusion.includes(num)) {
        // Toggle off
        onExclusionChange(exclusion.filter((n) => n !== num));
      } else {
        if (exclusion.length >= 10) {
          alert('제외 번호는 최대 10개까지 선택할 수 있습니다.');
          return;
        }
        // Remove from inclusion if present
        if (inclusion.includes(num)) {
          onInclusionChange(inclusion.filter((n) => n !== num));
        }
        onExclusionChange([...exclusion, num].sort((a, b) => a - b));
      }
    }
  };

  const clearAll = () => {
    onInclusionChange([]);
    onExclusionChange([]);
  };

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 md:p-6 space-y-6 shadow-xl">
      
      {/* Header & Mode Switcher */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
            <Sliders className="w-5 h-5 text-amber-400" /> 고정 / 제외 번호 상세 설정
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            원하는 숫자를 100% 포함시키거나 추첨 대상에서 완전히 제외합니다.
          </p>
        </div>

        {/* Clear Button */}
        {(inclusion.length > 0 || exclusion.length > 0) && (
          <button
            onClick={clearAll}
            className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-rose-400 bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" /> 선택 초기화
          </button>
        )}
      </div>

      {/* Mode Selector Tabs */}
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={() => setSelectMode('inclusion')}
          className={`flex items-center justify-center gap-2 p-3 rounded-xl border text-sm font-bold transition-all ${
            selectMode === 'inclusion'
              ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400 shadow-lg shadow-emerald-950/50 ring-1 ring-emerald-500/50'
              : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200'
          }`}
        >
          <Lock className="w-4 h-4" />
          <span>고정 번호 설정 ({inclusion.length}/5)</span>
        </button>

        <button
          onClick={() => setSelectMode('exclusion')}
          className={`flex items-center justify-center gap-2 p-3 rounded-xl border text-sm font-bold transition-all ${
            selectMode === 'exclusion'
              ? 'bg-rose-500/10 border-rose-500 text-rose-400 shadow-lg shadow-rose-950/50 ring-1 ring-rose-500/50'
              : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200'
          }`}
        >
          <Ban className="w-4 h-4" />
          <span>제외 번호 설정 ({exclusion.length}/10)</span>
        </button>
      </div>

      {/* Selected Summaries */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-950/50 p-4 rounded-xl border border-slate-800">
        
        {/* Included List */}
        <div>
          <div className="flex items-center justify-between text-xs font-semibold text-emerald-400 mb-2">
            <span className="flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> 포함할 고정 번호 ({inclusion.length}/5)
            </span>
            {inclusion.length > 0 && (
              <button
                onClick={() => onInclusionChange([])}
                className="text-[10px] text-slate-500 hover:text-slate-300"
              >
                비우기
              </button>
            )}
          </div>

          <div className="flex flex-wrap gap-1.5 min-h-[36px] items-center">
            {inclusion.length === 0 ? (
              <span className="text-xs text-slate-600 italic">선택된 고정 번호 없음</span>
            ) : (
              inclusion.map((num) => (
                <button
                  key={num}
                  onClick={() => onInclusionChange(inclusion.filter((n) => n !== num))}
                  className="group"
                  title="클릭하여 고정 해제"
                >
                  <LottoBall number={num} size="sm" className="ring-2 ring-emerald-500/70" />
                </button>
              ))
            )}
          </div>
        </div>

        {/* Excluded List */}
        <div>
          <div className="flex items-center justify-between text-xs font-semibold text-rose-400 mb-2">
            <span className="flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5" /> 제외할 번호 ({exclusion.length}/10)
            </span>
            {exclusion.length > 0 && (
              <button
                onClick={() => onExclusionChange([])}
                className="text-[10px] text-slate-500 hover:text-slate-300"
              >
                비우기
              </button>
            )}
          </div>

          <div className="flex flex-wrap gap-1.5 min-h-[36px] items-center">
            {exclusion.length === 0 ? (
              <span className="text-xs text-slate-600 italic">선택된 제외 번호 없음</span>
            ) : (
              exclusion.map((num) => (
                <button
                  key={num}
                  onClick={() => onExclusionChange(exclusion.filter((n) => n !== num))}
                  className="group relative"
                  title="클릭하여 제외 해제"
                >
                  <LottoBall number={num} size="sm" className="opacity-50 grayscale hover:grayscale-0" />
                  <span className="absolute inset-0 flex items-center justify-center text-rose-500 font-extrabold text-xs">
                    ✕
                  </span>
                </button>
              ))
            )}
          </div>
        </div>

      </div>

      {/* 1~45 Number Picker Grid */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span>번호를 클릭하여 [{selectMode === 'inclusion' ? '고정' : '제외'}] 등록/해제하세요</span>
          <span className="font-semibold text-amber-400">
            현재 모드: {selectMode === 'inclusion' ? '🟢 고정 번호 지정' : '🔴 제외 번호 지정'}
          </span>
        </div>

        <div className="grid grid-cols-5 sm:grid-cols-9 md:grid-cols-15 gap-2 bg-slate-950 p-4 rounded-xl border border-slate-800">
          {Array.from({ length: 45 }, (_, i) => i + 1).map((num) => {
            const isInc = inclusion.includes(num);
            const isExc = exclusion.includes(num);

            return (
              <button
                key={num}
                onClick={() => handleNumberClick(num)}
                className={`relative flex items-center justify-center p-1 rounded-xl transition-all duration-200 transform hover:scale-110 ${
                  isInc
                    ? 'ring-2 ring-emerald-400 bg-emerald-500/20 scale-105'
                    : isExc
                    ? 'ring-2 ring-rose-500 bg-rose-500/20 opacity-40 grayscale'
                    : 'hover:bg-slate-800/80'
                }`}
              >
                <LottoBall number={num} size="sm" />
                {isInc && (
                  <span className="absolute -top-1 -right-1 bg-emerald-500 text-slate-950 rounded-full p-0.5 text-[9px] font-bold">
                    <Lock className="w-2.5 h-2.5" />
                  </span>
                )}
                {isExc && (
                  <span className="absolute -top-1 -right-1 bg-rose-500 text-white rounded-full p-0.5 text-[9px] font-bold">
                    <Ban className="w-2.5 h-2.5" />
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Base Weight Slider */}
      <div className="bg-slate-950/40 border border-slate-800 p-4 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="space-y-0.5 text-center sm:text-left">
          <span className="text-xs font-bold text-slate-200">추첨 가중치 편향도 (Base Weight)</span>
          <p className="text-[11px] text-slate-400">
            기본 가중치가 작을수록 과거 자주 나온 번호의 출현 확률 편향이 커집니다.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <input
            type="range"
            min="0.1"
            max="5"
            step="0.1"
            value={baseWeight}
            onChange={(e) => onBaseWeightChange(parseFloat(e.target.value))}
            className="w-32 accent-amber-500 bg-slate-800 h-2 rounded-lg cursor-pointer"
          />
          <span className="text-xs font-mono font-bold text-amber-400 bg-slate-900 border border-slate-700 px-2.5 py-1 rounded-md min-w-[50px] text-center">
            {baseWeight.toFixed(1)}
          </span>
        </div>
      </div>

    </div>
  );
}
