import React, { useState } from 'react';
import LottoBall from './LottoBall';
import { Flame, Snowflake, BarChart3, Grid, Info } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { getBallColorInfo } from '../utils/ballColors';

export default function StatsChart({ stats, statsCount, onStatsCountChange, isLoading }) {
  const [viewMode, setViewMode] = useState('heatmap'); // 'heatmap' | 'chart'

  if (isLoading || !stats) {
    return (
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 text-center animate-pulse">
        <div className="h-6 bg-slate-800 rounded w-1/3 mx-auto mb-4"></div>
        <div className="h-32 bg-slate-800/40 rounded-xl"></div>
      </div>
    );
  }

  const { frequency, hotNumbers, coldNumbers, analyzedDrawsCount, startDrawNo, endDrawNo } = stats;

  // Prepare chart data
  const chartData = Object.entries(frequency).map(([num, count]) => ({
    number: Number(num),
    count: Number(count),
    color: getBallColorInfo(num).bg
  }));

  // Max frequency for heatmap intensity
  const maxFreq = Math.max(...Object.values(frequency), 1);

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 md:p-6 space-y-6 shadow-xl">
      
      {/* Header & Filter Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-amber-400" />
            <h3 className="text-lg font-bold text-slate-100">
              번호별 출현 빈도 통계 분석 (Hot/Cold)
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            최근 <strong className="text-amber-400">{analyzedDrawsCount}회차</strong> ({startDrawNo}회 ~ {endDrawNo}회) 동안의 번호별 추출 횟수 분석
          </p>
        </div>

        {/* Filter Controls */}
        <div className="flex items-center gap-3 self-end sm:self-auto">
          {/* Draw Range Filter */}
          <div className="flex bg-slate-950 p-1 rounded-lg border border-slate-800">
            {[20, 30, 50].map((count) => (
              <button
                key={count}
                onClick={() => onStatsCountChange(count)}
                className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${
                  statsCount === count
                    ? 'bg-amber-500 text-slate-950 shadow'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                최근 {count}회
              </button>
            ))}
          </div>

          {/* View Mode Toggle */}
          <div className="flex bg-slate-950 p-1 rounded-lg border border-slate-800">
            <button
              onClick={() => setViewMode('heatmap')}
              className={`p-1.5 rounded-md transition-all ${
                viewMode === 'heatmap' ? 'bg-slate-800 text-amber-400' : 'text-slate-400 hover:text-slate-200'
              }`}
              title="히트맵 모드"
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('chart')}
              className={`p-1.5 rounded-md transition-all ${
                viewMode === 'chart' ? 'bg-slate-800 text-amber-400' : 'text-slate-400 hover:text-slate-200'
              }`}
              title="막대 차트 모드"
            >
              <BarChart3 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Hot & Cold Summary Badges */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Hot Numbers Top 5 */}
        <div className="bg-slate-950/60 border border-rose-500/20 rounded-xl p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <span className="flex items-center gap-1.5 text-xs font-bold text-rose-400 uppercase tracking-wider">
              <Flame className="w-4 h-4 text-rose-500 animate-pulse" /> HOT 번호 TOP 5 (최다 출현)
            </span>
            <span className="text-[10px] text-slate-500">가중치 최고 부여</span>
          </div>
          <div className="flex items-center justify-around gap-2">
            {hotNumbers.map((num) => (
              <div key={num} className="flex flex-col items-center">
                <LottoBall number={num} size="md" />
                <span className="text-[11px] font-mono text-rose-300 font-bold mt-1">
                  {frequency[num]}회
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Cold Numbers Top 5 */}
        <div className="bg-slate-950/60 border border-cyan-500/20 rounded-xl p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <span className="flex items-center gap-1.5 text-xs font-bold text-cyan-400 uppercase tracking-wider">
              <Snowflake className="w-4 h-4 text-cyan-400" /> COLD 번호 TOP 5 (최저 출현)
            </span>
            <span className="text-[10px] text-slate-500">출현 임계 대기</span>
          </div>
          <div className="flex items-center justify-around gap-2">
            {coldNumbers.map((num) => (
              <div key={num} className="flex flex-col items-center">
                <LottoBall number={num} size="md" />
                <span className="text-[11px] font-mono text-cyan-300 font-bold mt-1">
                  {frequency[num]}회
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main View: Heatmap or Bar Chart */}
      {viewMode === 'heatmap' ? (
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>1~45 번호별 출현 빈도 히트맵</span>
            <span className="flex items-center gap-1 text-[11px]">
              <Info className="w-3.5 h-3.5 text-slate-500" /> 배지가 높을수록 최근 자주 나온 번호입니다
            </span>
          </div>

          <div className="grid grid-cols-5 sm:grid-cols-9 md:grid-cols-15 gap-2 bg-slate-950/70 p-4 rounded-xl border border-slate-800">
            {Array.from({ length: 45 }, (_, i) => i + 1).map((num) => {
              const count = frequency[num] || 0;
              const intensity = count / maxFreq;
              const isHot = hotNumbers.includes(num);

              return (
                <div
                  key={num}
                  className={`relative flex flex-col items-center p-1.5 rounded-lg border transition-all hover:scale-105 ${
                    isHot
                      ? 'border-rose-500/50 bg-rose-950/30'
                      : 'border-slate-800/80 bg-slate-900/60'
                  }`}
                  style={{
                    backgroundColor: `rgba(30, 41, 59, ${0.4 + intensity * 0.5})`
                  }}
                >
                  <LottoBall number={num} size="sm" />
                  <span className={`text-[10px] font-mono font-bold mt-1 ${isHot ? 'text-rose-400' : 'text-slate-300'}`}>
                    {count}회
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="space-y-2">
          <p className="text-xs text-slate-400">1~45 번호별 출현 횟수 그래프</p>
          <div className="h-64 bg-slate-950/70 p-4 rounded-xl border border-slate-800">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="number" tick={{ fill: '#94a3b8', fontSize: 10 }} interval={1} />
                <YAxis tick={{ fill: '#94a3b8', fontSize: 10 }} allowDecimals={false} />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-slate-900 border border-slate-700 p-2 rounded-lg text-xs shadow-lg">
                          <p className="font-bold text-amber-400">번호 {data.number}번</p>
                          <p className="text-slate-200">출현 횟수: <strong>{data.count}회</strong></p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

    </div>
  );
}
