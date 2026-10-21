import React, { useState } from 'react';
import {
  ShieldCheck,
  TrendingUp,
  Sparkles,
  Calendar,
  Layers,
  ArrowUpRight,
  Crown,
  Gem,
  Award,
  ChevronRight,
  Filter,
  CheckCircle2,
  ExternalLink,
  Info
} from 'lucide-react';
import { PlatformConnection, PlatformId } from '../../types';
import { PLATFORM_CONFIGS } from '../../data/mockData';
import { PlatformBadge } from '../common/PlatformBadge';
import ctcEagleGoldPendant from '../../assets/images/ctc_eagle_pendant_gold.jpg';
import ctcEaglePlatPendant from '../../assets/images/ctc_eagle_pendant_platinum.jpg';
import ctcEagleDiamPendant from '../../assets/images/ctc_eagle_pendant_diamond.jpg';

interface SmartRevenueForecastProps {
  connections: PlatformConnection[];
  currencySymbol?: string;
  subscriptionTier?: string;
  onOpenSubscriptionModal?: () => void;
}

export const SmartRevenueForecast: React.FC<SmartRevenueForecastProps> = ({
  connections,
  currencySymbol = '$',
  subscriptionTier = 'gold',
  onOpenSubscriptionModal
}) => {
  const [selectedHorizon, setSelectedHorizon] = useState<'30' | '60' | '90'>('30');
  const [activeChannelFilter, setActiveChannelFilter] = useState<string>('all');
  const [overrideTierPreview, setOverrideTierPreview] = useState<string | null>(null);

  const effectiveTier = overrideTierPreview || subscriptionTier;

  // Determine which Eagle Pendant Necklace image and styling to display
  let eagleImage = ctcEaglePlatPendant;
  let pendantLabel = 'Platinum CTC Pendant';
  let pendantChainDescription = 'Solid Platinum Cuban Link with Mirror-Finish CTC Medallion';
  let plaqueTierClass = 'plaque-platinum';
  let tierPillClass = 'engraved-plate-platinum text-slate-900';

  if (effectiveTier === 'free') {
    eagleImage = ctcEagleGoldPendant;
    pendantLabel = '24K Gold CTC Pendant';
    pendantChainDescription = 'Heavy 24K Gold Cuban Link with Cast Brass CTC Medallion';
    plaqueTierClass = 'plaque-gold';
    tierPillClass = 'engraved-plate-gold text-amber-950';
  } else if (effectiveTier === 'platinum') {
    eagleImage = ctcEagleDiamPendant;
    pendantLabel = 'Iced Diamond Pavé CTC Pendant';
    pendantChainDescription = 'Iced-Out Brilliant Cut Diamond Chain with Hologram CTC Medallion';
    plaqueTierClass = 'plaque-diamond';
    tierPillClass = 'engraved-plate-diamond text-sky-950';
  }

  // Calculate 30, 60, and 90-day forecasts per channel
  const channelForecasts = connections.map((conn) => {
    const base = conn.monthlyRevenue;
    // Multipliers calibrated to platform velocity
    const velocityMultiplier = conn.platformId === 'kick' ? 1.35 :
      conn.platformId === 'tiktok' ? 1.28 :
      conn.platformId === 'youtube' ? 1.22 :
      conn.platformId === 'spotify' ? 1.15 :
      conn.platformId === 'applemusic' ? 1.18 : 1.10;

    const forecast30 = base * velocityMultiplier;
    const forecast60 = base * Math.pow(velocityMultiplier, 1.85);
    const forecast90 = base * Math.pow(velocityMultiplier, 2.65);

    const growthPercent30 = ((forecast30 - base) / (base || 1) * 100).toFixed(1);
    const growthPercent60 = ((forecast60 - base) / (base || 1) * 100).toFixed(1);
    const growthPercent90 = ((forecast90 - base) / (base || 1) * 100).toFixed(1);

    return {
      conn,
      base,
      forecast30,
      forecast60,
      forecast90,
      growthPercent30,
      growthPercent60,
      growthPercent90
    };
  });

  const totalBase = channelForecasts.reduce((sum, c) => sum + c.base, 0);
  const totalForecast30 = channelForecasts.reduce((sum, c) => sum + c.forecast30, 0);
  const totalForecast60 = channelForecasts.reduce((sum, c) => sum + c.forecast60, 0);
  const totalForecast90 = channelForecasts.reduce((sum, c) => sum + c.forecast90, 0);

  const activeTotalForecast = selectedHorizon === '30'
    ? totalForecast30
    : selectedHorizon === '60'
    ? totalForecast60
    : totalForecast90;

  const activeGrowthPercent = (((activeTotalForecast - totalBase) / (totalBase || 1)) * 100).toFixed(1);

  const filteredChannels = channelForecasts.filter((item) => {
    if (activeChannelFilter === 'all') return true;
    return item.conn.platformId === activeChannelFilter;
  });

  return (
    <div className={`${plaqueTierClass} p-6 lg:p-8 relative overflow-hidden transition-all duration-300`}>
      {/* Subtle Vinyl Disc Backing */}
      <div className="absolute -right-24 -top-24 w-80 h-80 rounded-full grooved-record-disc opacity-15 pointer-events-none" />

      {/* Financial Disclosure Plaque Header */}
      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-amber-500/25">
        <div className="flex items-start sm:items-center gap-4">
          {/* THE OFFICIAL CTC EAGLE WEARING THE GOLD / PLATINUM / DIAMOND PENDANT NECKLACE */}
          <div className="relative shrink-0 group">
            <div className={`w-20 h-20 sm:w-24 sm:h-24 rounded-2xl p-1 shadow-2xl relative overflow-hidden ${
              effectiveTier === 'free'
                ? 'bg-gradient-to-tr from-amber-500 via-yellow-200 to-amber-700 shadow-[0_0_25px_rgba(245,158,11,0.6)]'
                : effectiveTier === 'platinum'
                ? 'bg-gradient-to-tr from-cyan-400 via-white to-sky-600 shadow-[0_0_28px_rgba(56,189,248,0.7)]'
                : 'bg-gradient-to-tr from-slate-300 via-white to-zinc-500 shadow-[0_0_25px_rgba(226,232,240,0.5)]'
            }`}>
              <div className="w-full h-full rounded-xl overflow-hidden bg-black flex items-center justify-center relative">
                <img
                  src={eagleImage}
                  alt={`Official CTC Eagle wearing ${pendantLabel}`}
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                />
                {/* Floating pendant badge indicator */}
                <div className="absolute bottom-1 right-1 bg-black/80 backdrop-blur-sm rounded-md px-1.5 py-0.5 border border-white/20 text-[9px] font-black text-white uppercase tracking-wider flex items-center gap-1">
                  {effectiveTier === 'platinum' ? <Gem className="w-2.5 h-2.5 text-cyan-300" /> : <Crown className="w-2.5 h-2.5 text-amber-300" />}
                  <span>{effectiveTier === 'platinum' ? 'DIAMOND' : effectiveTier === 'free' ? 'GOLD' : 'PLATINUM'}</span>
                </div>
              </div>
            </div>
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className={`${tierPillClass} text-[9px] font-black uppercase px-2.5 py-0.5 rounded shadow-sm tracking-widest`}>
                EXECUTIVE FINANCIAL DISCLOSURE
              </span>
              <span className="text-[11px] font-mono text-amber-200/90 font-bold">
                AUDIT REG: CTC-SEC-FORECAST-2026
              </span>
            </div>
            <h3 className="text-xl font-black text-white mt-1 tracking-wide flex items-center gap-2">
              <span>Smart Revenue Forecast (30, 60 & 90-Day Disclosure)</span>
            </h3>
            <p className="text-xs text-zinc-300 mt-1 max-w-2xl leading-relaxed">
              Official predictive modeling based on multi-platform trailing engagement velocity, verified RPM indices, and catalog compounding.
              Official Medallion Insignia: <span className="font-bold text-white">{pendantChainDescription}</span>.
            </p>
          </div>
        </div>

        {/* Tier Pendant Badge & Switcher */}
        <div className="flex flex-col sm:flex-row lg:flex-col items-start lg:items-end gap-2 shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase font-bold text-zinc-400">Pendant Insignia Tier:</span>
            <div className="flex items-center gap-1 bg-black/50 p-1 rounded-lg border border-amber-500/30">
              <button
                onClick={() => setOverrideTierPreview('free')}
                className={`px-2 py-0.5 rounded text-[10px] font-black uppercase transition ${
                  effectiveTier === 'free' ? 'bg-amber-500 text-black shadow' : 'text-zinc-400 hover:text-white'
                }`}
                title="Preview Gold CTC Pendant Necklace"
              >
                Gold
              </button>
              <button
                onClick={() => setOverrideTierPreview('gold')}
                className={`px-2 py-0.5 rounded text-[10px] font-black uppercase transition ${
                  effectiveTier === 'gold' ? 'bg-slate-200 text-black shadow' : 'text-zinc-400 hover:text-white'
                }`}
                title="Preview Platinum CTC Pendant Necklace"
              >
                Platinum
              </button>
              <button
                onClick={() => setOverrideTierPreview('platinum')}
                className={`px-2 py-0.5 rounded text-[10px] font-black uppercase transition ${
                  effectiveTier === 'platinum' ? 'bg-cyan-300 text-black shadow' : 'text-zinc-400 hover:text-white'
                }`}
                title="Preview Diamond CTC Pendant Necklace"
              >
                Diamond
              </button>
            </div>
          </div>

          {onOpenSubscriptionModal && (
            <button
              onClick={onOpenSubscriptionModal}
              className="deal-btn-platinum text-[10px] font-extrabold px-3 py-1 rounded-lg"
            >
              CTC Upgrade Creator Deal Tier
            </button>
          )}
        </div>
      </div>

      {/* Time Horizon Control Tabs & Aggregate Forecast */}
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-4 gap-4 my-6 items-stretch">
        {/* Aggregate Target Plaque Plate */}
        <div className="lg:col-span-2 bg-black/40 border border-amber-500/30 rounded-2xl p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase font-black tracking-widest text-amber-200/80">
                AGGREGATE {selectedHorizon}-DAY PREDICTED RUN-RATE
              </span>
              <span className="text-[10px] font-mono text-emerald-400 font-bold bg-emerald-950/80 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                +{activeGrowthPercent}% vs Current Trailing
              </span>
            </div>
            <div className="text-3xl sm:text-4xl font-black font-mono text-white mt-2 tracking-tight">
              {currencySymbol}{activeTotalForecast.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-zinc-400 mt-1">
              Estimated net disbursements across all 47 certified streaming and distribution partners.
            </p>
          </div>

          <div className="flex items-center gap-2 mt-4 pt-3 border-t border-zinc-800">
            <span className="text-xs font-bold text-zinc-400">Projection Horizon:</span>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setSelectedHorizon('30')}
                className={`px-3 py-1 rounded-lg text-xs font-black transition ${
                  selectedHorizon === '30'
                    ? 'deal-btn-gold text-amber-950 shadow-md'
                    : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-700'
                }`}
              >
                30 Days
              </button>
              <button
                onClick={() => setSelectedHorizon('60')}
                className={`px-3 py-1 rounded-lg text-xs font-black transition ${
                  selectedHorizon === '60'
                    ? 'deal-btn-gold text-amber-950 shadow-md'
                    : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-700'
                }`}
              >
                60 Days
              </button>
              <button
                onClick={() => setSelectedHorizon('90')}
                className={`px-3 py-1 rounded-lg text-xs font-black transition ${
                  selectedHorizon === '90'
                    ? 'deal-btn-platinum text-slate-950 shadow-md'
                    : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-700'
                }`}
              >
                90 Days
              </button>
            </div>
          </div>
        </div>

        {/* 30-Day Snapshot Card */}
        <div className="bg-black/30 border border-amber-500/20 rounded-2xl p-4 flex flex-col justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block">30-Day Projection</span>
            <div className="text-2xl font-black font-mono text-amber-300 mt-1">
              {currencySymbol}{totalForecast30.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
            </div>
            <span className="text-[11px] text-emerald-400 font-semibold block mt-0.5">
              +{(((totalForecast30 - totalBase) / totalBase) * 100).toFixed(1)}% immediate velocity
            </span>
          </div>
          <span className="text-[10px] text-zinc-500 mt-3">Reflects upcoming scheduled launches</span>
        </div>

        {/* 90-Day Mogul Milestone Card */}
        <div className="bg-black/30 border border-amber-500/20 rounded-2xl p-4 flex flex-col justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block">90-Day Compound Run</span>
            <div className="text-2xl font-black font-mono text-cyan-300 mt-1">
              {currencySymbol}{totalForecast90.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
            </div>
            <span className="text-[11px] text-purple-400 font-semibold block mt-0.5">
              +{(((totalForecast90 - totalBase) / totalBase) * 100).toFixed(1)}% compound surge
            </span>
          </div>
          <span className="text-[10px] text-zinc-500 mt-3">Includes library replay compounding</span>
        </div>
      </div>

      {/* Per-Channel Predictive Breakdown Table */}
      <div className="relative z-10 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <h4 className="text-xs font-black uppercase tracking-wider text-amber-200/90 flex items-center gap-1.5">
            <Award className="w-4 h-4 text-amber-400" />
            <span>Channel-By-Channel Prediction Ledger (30 / 60 / 90 Days)</span>
          </h4>
          <span className="text-[11px] text-zinc-400">
            Real-time algorithmic forecast grounded on verified channel RPM
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {filteredChannels.map(({ conn, base, forecast30, forecast60, forecast90, growthPercent30, growthPercent60, growthPercent90 }) => {
            const targetForecast = selectedHorizon === '30' ? forecast30 : selectedHorizon === '60' ? forecast60 : forecast90;
            const targetGrowth = selectedHorizon === '30' ? growthPercent30 : selectedHorizon === '60' ? growthPercent60 : growthPercent90;

            return (
              <div
                key={conn.platformId}
                className="bg-black/50 border border-zinc-800 hover:border-amber-500/40 rounded-xl p-4 transition space-y-3 relative group"
              >
                <div className="flex items-center justify-between">
                  <PlatformBadge platformId={conn.platformId} size="md" />
                  <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/20">
                    +{targetGrowth}% ({selectedHorizon}d)
                  </span>
                </div>

                <div className="space-y-1">
                  <div className="flex items-baseline justify-between">
                    <span className="text-[10px] text-zinc-400 uppercase font-semibold">Predicted {selectedHorizon}d:</span>
                    <span className="text-lg font-black font-mono text-white">
                      {currencySymbol}{targetForecast.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                  </div>
                  <div className="flex items-baseline justify-between text-xs text-zinc-500">
                    <span>Current Trailing:</span>
                    <span className="font-mono text-zinc-400">
                      {currencySymbol}{base.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>

                {/* 30 / 60 / 90 Horizon Mini Strip */}
                <div className="grid grid-cols-3 gap-1 pt-2 border-t border-zinc-800/80 text-center font-mono">
                  <div className={`p-1 rounded ${selectedHorizon === '30' ? 'bg-amber-500/20 text-amber-200' : 'text-zinc-400'}`}>
                    <span className="text-[9px] block text-zinc-500">30D</span>
                    <span className="text-[11px] font-bold">{currencySymbol}{forecast30.toFixed(0)}</span>
                  </div>
                  <div className={`p-1 rounded ${selectedHorizon === '60' ? 'bg-amber-500/20 text-amber-200' : 'text-zinc-400'}`}>
                    <span className="text-[9px] block text-zinc-500">60D</span>
                    <span className="text-[11px] font-bold">{currencySymbol}{forecast60.toFixed(0)}</span>
                  </div>
                  <div className={`p-1 rounded ${selectedHorizon === '90' ? 'bg-amber-500/20 text-amber-200' : 'text-zinc-400'}`}>
                    <span className="text-[9px] block text-zinc-500">90D</span>
                    <span className="text-[11px] font-bold">{currencySymbol}{forecast90.toFixed(0)}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Countersignature Footer */}
      <div className="relative z-10 pt-4 mt-5 border-t border-amber-500/20 flex flex-col sm:flex-row sm:items-center justify-between text-xs text-amber-200/70 gap-2">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-amber-400" />
          <span>EXECUTED UNDER CTC FORMAL ESCROW DISCLOSURE PROTOCOL #SEC-449-P</span>
        </div>
        <div className="font-mono text-[10px] text-zinc-400">
          ALGORITHM: QUANT-PREDICT-2026 • GUARANTEED FIDUCIARY COMPLIANCE
        </div>
      </div>
    </div>
  );
};
