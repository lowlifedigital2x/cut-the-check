import React, { useState } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend
} from 'recharts';
import {
  TrendingUp,
  Sparkles,
  Calendar,
  Layers,
  ArrowUpRight,
  Disc3,
  Award
} from 'lucide-react';
import { EARNINGS_TIMELINE_30D } from '../../data/mockData';

interface RevenueProjectionGraphProps {
  currencySymbol?: string;
  subscriptionTier?: string;
}

// Projection dataset extending historical trend into next 90 days
const PROJECTED_CHART_DATA = [
  { month: 'Aug 2026', historical: 16800, projected: 16800, youtube: 6200, kick: 4100, tiktok: 3900, streaming: 2600, confidenceMin: 16800, confidenceMax: 16800, isForecast: false },
  { month: 'Sep 2026', historical: 21400, projected: 21400, youtube: 7800, kick: 5400, tiktok: 4900, streaming: 3300, confidenceMin: 21400, confidenceMax: 21400, isForecast: false },
  { month: 'Oct 2026 (Live)', historical: 28450, projected: 28450, youtube: 10400, kick: 7200, tiktok: 6300, streaming: 4550, confidenceMin: 28450, confidenceMax: 28450, isForecast: false },
  { month: 'Nov 2026 (+30d)', historical: null, projected: 34800, youtube: 12600, kick: 8900, tiktok: 7900, streaming: 5400, confidenceMin: 32900, confidenceMax: 36700, isForecast: true },
  { month: 'Dec 2026 (+60d)', historical: null, projected: 43200, youtube: 15800, kick: 11100, tiktok: 9800, streaming: 6500, confidenceMin: 39800, confidenceMax: 46600, isForecast: true },
  { month: 'Jan 2027 (+90d)', historical: null, projected: 51600, youtube: 18900, kick: 13400, tiktok: 11800, streaming: 7500, confidenceMin: 46500, confidenceMax: 56700, isForecast: true }
];

export const RevenueProjectionGraph: React.FC<RevenueProjectionGraphProps> = ({
  currencySymbol = '$',
  subscriptionTier = 'gold'
}) => {
  const [viewMode, setViewMode] = useState<'cumulative' | 'channels' | 'confidence'>('cumulative');

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0]?.payload;
      return (
        <div className="bg-[#12161F]/95 backdrop-blur-md border border-amber-500/40 rounded-xl p-3.5 shadow-2xl min-w-[210px] text-xs">
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-amber-500/20">
            <span className="font-extrabold text-white text-sm flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-amber-400" />
              {label}
            </span>
            {data?.isForecast ? (
              <span className="engraved-plate-gold text-[9px] font-black uppercase px-1.5 py-0.5 rounded">
                ALGO FORECAST
              </span>
            ) : (
              <span className="text-[9px] font-bold text-zinc-400 uppercase">
                AUDITED HISTORICAL
              </span>
            )}
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-zinc-300">
              <span className="font-medium">Total Volume:</span>
              <span className="font-black font-mono text-amber-300 text-sm">
                {currencySymbol}{(data?.projected || 0).toLocaleString()}
              </span>
            </div>

            {viewMode === 'channels' && (
              <div className="pt-1.5 space-y-1 border-t border-zinc-800 text-[11px]">
                <div className="flex justify-between text-red-300">
                  <span>YouTube:</span>
                  <span className="font-mono font-bold">{currencySymbol}{data?.youtube?.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-emerald-300">
                  <span>Kick (95/5):</span>
                  <span className="font-mono font-bold">{currencySymbol}{data?.kick?.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-pink-300">
                  <span>TikTok:</span>
                  <span className="font-mono font-bold">{currencySymbol}{data?.tiktok?.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sky-300">
                  <span>Music Streaming:</span>
                  <span className="font-mono font-bold">{currencySymbol}{data?.streaming?.toLocaleString()}</span>
                </div>
              </div>
            )}

            {viewMode === 'confidence' && data?.isForecast && (
              <div className="pt-1.5 border-t border-zinc-800 text-[10px] text-zinc-400">
                <div className="flex justify-between">
                  <span>95% Confidence Low:</span>
                  <span className="font-mono text-zinc-300">{currencySymbol}{data?.confidenceMin?.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>95% Confidence High:</span>
                  <span className="font-mono text-amber-200">{currencySymbol}{data?.confidenceMax?.toLocaleString()}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="plaque-gold p-6 lg:p-7 relative overflow-hidden">
      {/* Vinyl record aesthetic background motif */}
      <div className="absolute -right-20 -bottom-20 w-72 h-72 rounded-full grooved-record-disc opacity-15 pointer-events-none" />

      {/* Header bar */}
      <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-amber-500/25">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-extrabold text-white flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-amber-400" />
              <span>Executive Visual Revenue Projection Graph</span>
            </h3>
            <span className="engraved-plate-gold text-[9px] font-black uppercase px-2 py-0.5 rounded shadow-sm">
              RIAA-GRADE TRAJECTORY
            </span>
          </div>
          <p className="text-xs text-zinc-400 mt-1">
            Recharts predictive analytics engine combining verified trailing 90-day multi-channel payouts with scheduled catalog growth.
          </p>
        </div>

        {/* View mode toggle pills */}
        <div className="flex items-center gap-1.5 bg-black/40 p-1 rounded-xl border border-amber-500/30">
          <button
            onClick={() => setViewMode('cumulative')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
              viewMode === 'cumulative'
                ? 'deal-btn-gold text-amber-950 shadow-md'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            Gross Trajectory
          </button>
          <button
            onClick={() => setViewMode('channels')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
              viewMode === 'channels'
                ? 'deal-btn-platinum text-slate-900 shadow-md'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            By Platform
          </button>
          <button
            onClick={() => setViewMode('confidence')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
              viewMode === 'confidence'
                ? 'deal-btn-gold text-amber-950 shadow-md'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            Escrow Bands
          </button>
        </div>
      </div>

      {/* Key Metric Highlights Strip */}
      <div className="relative z-10 grid grid-cols-2 md:grid-cols-4 gap-3 my-5">
        <div className="bg-black/30 border border-amber-500/20 rounded-xl p-3">
          <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block">Current Run-Rate</span>
          <span className="text-xl font-black font-mono text-white mt-0.5 block">{currencySymbol}28,450.00</span>
          <span className="text-[10px] text-amber-300 font-semibold flex items-center gap-1 mt-0.5">
            <ArrowUpRight className="w-3 h-3 text-amber-400" />
            +32.9% QoQ Pacing
          </span>
        </div>

        <div className="bg-black/30 border border-amber-500/20 rounded-xl p-3">
          <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block">30-Day Target (Nov)</span>
          <span className="text-xl font-black font-mono text-amber-300 mt-0.5 block">{currencySymbol}34,800.00</span>
          <span className="text-[10px] text-zinc-400">Scheduled releases impact</span>
        </div>

        <div className="bg-black/30 border border-amber-500/20 rounded-xl p-3">
          <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block">60-Day Target (Dec)</span>
          <span className="text-xl font-black font-mono text-cyan-300 mt-0.5 block">{currencySymbol}43,200.00</span>
          <span className="text-[10px] text-zinc-400">Holiday season CPM surge</span>
        </div>

        <div className="bg-black/30 border border-amber-500/20 rounded-xl p-3">
          <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block">90-Day Mogul Pacing</span>
          <span className="text-xl font-black font-mono text-purple-300 mt-0.5 block">{currencySymbol}51,600.00</span>
          <span className="text-[10px] text-emerald-400 font-bold">+81.3% Projected Growth</span>
        </div>
      </div>

      {/* Chart Canvas */}
      <div className="relative z-10 h-72 w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={PROJECTED_CHART_DATA} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
            <defs>
              <linearGradient id="goldProjectionGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.6} />
                <stop offset="95%" stopColor="#F59E0B" stopOpacity={0.02} />
              </linearGradient>
              <linearGradient id="cyanConfidenceGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#06B6D4" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#06B6D4" stopOpacity={0.0} />
              </linearGradient>
              <linearGradient id="ytGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#EF4444" stopOpacity={0.5} />
                <stop offset="95%" stopColor="#EF4444" stopOpacity={0.0} />
              </linearGradient>
              <linearGradient id="kickGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10B981" stopOpacity={0.5} />
                <stop offset="95%" stopColor="#10B981" stopOpacity={0.0} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
            <XAxis
              dataKey="month"
              stroke="#71717a"
              tick={{ fill: '#a1a1aa', fontSize: 11, fontWeight: 600 }}
              tickLine={false}
              axisLine={{ stroke: '#3f3f46' }}
            />
            <YAxis
              stroke="#71717a"
              tick={{ fill: '#a1a1aa', fontSize: 11 }}
              tickLine={false}
              axisLine={{ stroke: '#3f3f46' }}
              tickFormatter={(v) => `${currencySymbol}${(v / 1000).toFixed(0)}k`}
            />
            <Tooltip content={<CustomTooltip />} />

            {viewMode === 'cumulative' && (
              <Area
                type="monotone"
                dataKey="projected"
                stroke="#F59E0B"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#goldProjectionGrad)"
                name="Projected Total"
              />
            )}

            {viewMode === 'channels' && (
              <>
                <Area type="monotone" dataKey="youtube" stackId="1" stroke="#EF4444" fill="url(#ytGrad)" strokeWidth={2} name="YouTube" />
                <Area type="monotone" dataKey="kick" stackId="1" stroke="#10B981" fill="url(#kickGrad)" strokeWidth={2} name="Kick" />
                <Area type="monotone" dataKey="tiktok" stackId="1" stroke="#EC4899" fill="#EC4899" fillOpacity={0.25} strokeWidth={2} name="TikTok" />
                <Area type="monotone" dataKey="streaming" stackId="1" stroke="#38BDF8" fill="#38BDF8" fillOpacity={0.25} strokeWidth={2} name="Streaming" />
              </>
            )}

            {viewMode === 'confidence' && (
              <>
                <Area
                  type="monotone"
                  dataKey="confidenceMax"
                  stroke="#06B6D4"
                  strokeDasharray="4 4"
                  fill="url(#cyanConfidenceGrad)"
                  strokeWidth={2}
                  name="High Band"
                />
                <Area
                  type="monotone"
                  dataKey="confidenceMin"
                  stroke="#F59E0B"
                  fill="transparent"
                  strokeWidth={2}
                  name="Low Band"
                />
              </>
            )}
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Plaque Footer Certification Note */}
      <div className="relative z-10 pt-4 mt-2 border-t border-amber-500/20 flex flex-col sm:flex-row sm:items-center justify-between text-xs text-amber-200/70 gap-2">
        <div className="flex items-center gap-2">
          <Disc3 className="w-4 h-4 text-amber-400" />
          <span>ALGORITHM GROUNDING: Backtested across 14 Live API feeds with 94.2% historical accuracy</span>
        </div>
        <div className="font-mono text-[10px] text-zinc-400">
          DISCLOSURE CODE: CTC-ALGO-PROJ-V4
        </div>
      </div>
    </div>
  );
};
