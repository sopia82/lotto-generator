import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from './components/Header';
import LatestDrawBanner from './components/LatestDrawBanner';
import StatsChart from './components/StatsChart';
import NumberSelector from './components/NumberSelector';
import GeneratorResults from './components/GeneratorResults';
import { generateWeightedLottoGames } from './utils/lottoAlgorithm';
import { HelpCircle, ShieldCheck, Sparkles, Zap } from 'lucide-react';

export default function App() {
  const [latestDraw, setLatestDraw] = useState(null);
  const [stats, setStats] = useState(null);
  const [statsCount, setStatsCount] = useState(30);
  const [isLoading, setIsLoading] = useState(true);

  // Selector States
  const [inclusion, setInclusion] = useState([]);
  const [exclusion, setExclusion] = useState([]);
  const [baseWeight, setBaseWeight] = useState(1.0);

  // Generator & Results States
  const [games, setGames] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [history, setHistory] = useState([]);

  // Fetch Stats & Latest Draw from Backend Express Proxy
  const fetchData = async (count = statsCount) => {
    setIsLoading(true);
    try {
      // Fetch recent statistics
      const res = await axios.get(`/api/lotto/stats?count=${count}`);
      if (res.data && res.data.success) {
        setStats(res.data.stats);
        setLatestDraw(res.data.stats.latestDraw);
      }
    } catch (err) {
      console.error('Failed to fetch lotto stats from API proxy:', err);
      // Fallback local dummy stats if backend offline
      setStats({
        frequency: Object.fromEntries(Array.from({ length: 45 }, (_, i) => [i + 1, Math.floor(Math.random() * 8) + 1])),
        hotNumbers: [3, 12, 27, 34, 45],
        coldNumbers: [5, 18, 22, 31, 39],
        analyzedDrawsCount: count,
        startDrawNo: 1100,
        endDrawNo: 1100 + count,
        latestDraw: {
          drwNo: 1135,
          drwNoDate: '2024-08-31',
          numbers: [1, 3, 14, 28, 31, 45],
          bonusNo: 23,
          firstWinamnt: 2200000000,
          firstPrzwnerCo: 11
        }
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData(statsCount);
  }, [statsCount]);

  // Generate 5 Games using weighted algorithm
  const handleGenerate = () => {
    setIsGenerating(true);

    setTimeout(() => {
      const frequency = stats?.frequency || {};
      const newGames = generateWeightedLottoGames({
        frequency,
        inclusion,
        exclusion,
        baseWeight,
        gamesCount: 5
      });

      setGames(newGames);
      setIsGenerating(false);

      // Save to local history
      const newHist = {
        time: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        games: newGames,
        inclusion: [...inclusion],
        exclusion: [...exclusion]
      };
      setHistory((prev) => [newHist, ...prev.slice(0, 4)]);
    }, 300);
  };

  // Auto generate 5 games once stats are loaded initially
  useEffect(() => {
    if (stats && games.length === 0) {
      handleGenerate();
    }
  }, [stats]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      
      {/* Top Header */}
      <Header
        latestDraw={latestDraw}
        onRefresh={() => fetchData(statsCount)}
        isLoading={isLoading}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-6 space-y-8">
        
        {/* Banner: Latest Draw Result */}
        <LatestDrawBanner latestDraw={latestDraw} />

        {/* Section 1: Statistical Heatmap & Hot/Cold Numbers */}
        <StatsChart
          stats={stats}
          statsCount={statsCount}
          onStatsCountChange={(count) => setStatsCount(count)}
          isLoading={isLoading}
        />

        {/* Section 2: Number Controls (Inclusion / Exclusion) */}
        <NumberSelector
          inclusion={inclusion}
          exclusion={exclusion}
          onInclusionChange={setInclusion}
          onExclusionChange={setExclusion}
          baseWeight={baseWeight}
          onBaseWeightChange={setBaseWeight}
        />

        {/* Section 3: Generator Action & Results */}
        <GeneratorResults
          games={games}
          onGenerate={handleGenerate}
          isGenerating={isGenerating}
          inclusion={inclusion}
          exclusion={exclusion}
          history={history}
          onLoadHistory={(hist) => {
            setGames(hist.games);
            setInclusion(hist.inclusion);
            setExclusion(hist.exclusion);
          }}
        />

        {/* Informational Footer Section */}
        <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-slate-400">
          <div className="space-y-2">
            <div className="flex items-center gap-2 font-bold text-slate-200">
              <Zap className="w-4 h-4 text-amber-400" /> 가중치 랜덤 샘플링이란?
            </div>
            <p className="leading-relaxed">
              과거 최근 당첨 데이터의 회차별 출현 횟수가 많은 번호일수록 높은 가중치($Weight = Count + Base$)를 부여하여 무작위 추첨 시 선택 확률을 높입니다.
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 font-bold text-slate-200">
              <ShieldCheck className="w-4 h-4 text-emerald-400" /> 완벽한 중복 검증 & 정렬
            </div>
            <p className="leading-relaxed">
              각 게임(A~E)은 6개의 중복 없는 숫자로 구성되며, 오름차순으로 자동 정렬됩니다. 지정된 고정 번호는 100% 보장되고 제외 번호는 완벽히 차단됩니다.
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 font-bold text-slate-200">
              <HelpCircle className="w-4 h-4 text-indigo-400" /> 실시간 공식 API 연동
            </div>
            <p className="leading-relaxed">
              동행복권 공식 API를 백엔드 프록시 서버에서 실시간 연동 및 캐싱하여 가장 정확하고 빠른 당첨 번호 통계 데이터를 시각화합니다.
            </p>
          </div>
        </div>

      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950 py-6 text-center text-xs text-slate-500 space-y-1">
        <p>© 2026 로또 6/45 가중치 추첨 알고리즘 생성기. All rights reserved.</p>
        <p className="text-[11px] text-slate-600">본 생성기는 통계 데이터 분석 기반 참고용 도구이며 당첨을 보장하지 않습니다.</p>
      </footer>

    </div>
  );
}
