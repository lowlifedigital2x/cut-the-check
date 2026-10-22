import React, { useMemo, useState } from 'react';
import {
  Radar,
  TrendingUp,
  ShieldCheck,
  Eye,
  Flame,
  Activity,
  BadgeCheck,
  Crosshair,
  Zap,
  Users
} from 'lucide-react';
import { ScoutContact } from '../../types';
import { PLATFORM_CONFIGS } from '../../data/mockData';
import { PlatformBadge } from '../common/PlatformBadge';
import { OwnerTagline } from '../common/OwnerTagline';

interface OnTheRadarViewProps {
  contacts: ScoutContact[];
  onTriggerToast: (msg: string) => void;
}

/**
 * Radar Score (0-100) — deterministic momentum index computed from audited
 * CTC Insight telemetry already carried on each scout contact:
 *   55% 30-day growth velocity (monthlyGrowthPercent, capped at 250%)
 *   30% verified engagement rate (engagementRatePercent, capped at 20%)
 *   15% stream velocity (streamVelocityViewsPerDay, capped at 650K/day)
 */
export const computeRadarScore = (c: ScoutContact): number => {
  const growthNorm = Math.min(c.monthlyGrowthPercent, 250) / 250;
  const engagementNorm = Math.min(c.engagementRatePercent, 20) / 20;
  const velocityNorm = Math.min(c.streamVelocityViewsPerDay, 650000) / 650000;
  return Math.round(growthNorm * 55 + engagementNorm * 30 + velocityNorm * 15);
};

const formatCount = (n: number): string =>
  n >= 1000000 ? `${(n / 1000000).toFixed(2)}M` : `${(n / 1000).toFixed(0)}K`;

const tierBadgeStyles: Record<string, string> = {
  diamond: 'bg-cyan-500/15 text-cyan-300 border-cyan-400/40',
  platinum: 'bg-zinc-400/15 text-zinc-200 border-zinc-300/40',
  gold: 'bg-amber-500/15 text-amber-300 border-amber-500/40'
};

const scoreStyles = (score: number): string =>
  score >= 75
    ? 'text-amber-300 border-amber-500/40'
    : score >= 55
    ? 'text-emerald-300 border-emerald-500/40'
    : score >= 35
    ? 'text-sky-300 border-sky-500/40'
    : 'text-zinc-300 border-zinc-700';

export const OnTheRadarView: React.FC<OnTheRadarViewProps> = ({ contacts, onTriggerToast }) => {
  const [trackedIds, setTrackedIds] = useState<Record<string, boolean>>({});

  // Ranked board: top movers first, ranked by Radar Score (momentum)
  const ranked = useMemo(() => {
    return contacts
      .map((c) => ({ contact: c, radarScore: computeRadarScore(c) }))
      .sort((a, b) => b.radarScore - a.radarScore);
  }, [contacts]);

  const certifiedCount = contacts.filter((c) => c.verified).length;
  const totalReach = contacts.reduce((sum, c) => sum + c.followersCount, 0);
  const topMover = ranked[0];

  const toggleTracked = (c: ScoutContact) => {
    setTrackedIds((prev) => {
      const next = { ...prev, [c.id]: !prev[c.id] };
      onTriggerToast(
        !prev[c.id]
          ? `◎ ${c.name} locked onto your Radar — momentum alerts armed`
          : `${c.name} removed from your Radar`
      );
      return next;
    });
  };

  return (
    <div className="space-y-6">
      {/* ==============================================================
          ON THE RADAR — DISCOVERY BANNER
          ============================================================== */}
      <div className="plaque-gold p-6 lg:p-8 rounded-3xl relative overflow-hidden">
        <div className="absolute -right-20 -bottom-20 w-80 h-80 rounded-full grooved-record-disc opacity-20 pointer-events-none" />

        <div className="relative z-10 space-y-4">
          <OwnerTagline label="DISCOVER" phrase="Creators That Count" />
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-amber-500/20 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-400 via-amber-200 to-amber-600 shadow-xl flex items-center justify-center">
                <Radar className="w-6 h-6 text-amber-950" />
              </div>

              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="engraved-plate-gold text-[9px] uppercase font-black px-2 py-0.5 rounded shadow-sm">
                    CTC DISCOVERY — ON THE RADAR
                  </span>
                  <span className="text-[11px] font-mono text-emerald-400 flex items-center gap-1 font-bold">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                    RADAR SWEEP ACTIVE
                  </span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-white tracking-wide uppercase mt-0.5">
                  Rising Creators Heating Up Across All 47 Platforms
                </h2>
              </div>
            </div>
          </div>

          <p className="text-xs text-amber-200/80 max-w-3xl leading-relaxed">
            The momentum board labels, brands, and sponsors watch. Every creator climbing this chart is
            tracked in real time by CTC Insight across all 47 platforms — ranked by Radar Score, a momentum
            index blending 30-day growth velocity, verified engagement, and daily stream velocity.
          </p>

          {/* Quick Stats Ticker */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
            <div className="p-3 rounded-xl bg-black/60 border border-amber-500/20">
              <span className="text-[10px] font-mono uppercase text-zinc-400 block">Creators On Radar</span>
              <span className="text-lg font-black text-white font-mono">{contacts.length}</span>
              <span className="text-[10px] text-emerald-400 font-semibold block mt-0.5">Swept across 47 platforms</span>
            </div>

            <div className="p-3 rounded-xl bg-black/60 border border-amber-500/20">
              <span className="text-[10px] font-mono uppercase text-zinc-400 block">CTC Certified On Board</span>
              <span className="text-lg font-black text-amber-300 font-mono">
                {certifiedCount} / {contacts.length}
              </span>
              <span className="text-[10px] text-amber-200/70 font-semibold block mt-0.5">Plaque-verified creators</span>
            </div>

            <div className="p-3 rounded-xl bg-black/60 border border-amber-500/20">
              <span className="text-[10px] font-mono uppercase text-zinc-400 block">Combined Audited Reach</span>
              <span className="text-lg font-black text-white font-mono">{formatCount(totalReach)}</span>
              <span className="text-[10px] text-zinc-400 font-semibold block mt-0.5">Followers under surveillance</span>
            </div>

            <div className="p-3 rounded-xl bg-black/60 border border-amber-500/20">
              <span className="text-[10px] font-mono uppercase text-zinc-400 block">Hottest Blip Right Now</span>
              <span className="text-lg font-black text-emerald-400 font-mono">
                +{topMover ? topMover.contact.monthlyGrowthPercent : 0}%
              </span>
              <span className="text-[10px] text-zinc-400 font-semibold block mt-0.5">
                {topMover ? `${topMover.contact.handle} — 30d growth` : 'Awaiting sweep'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ==============================================================
          RANKED MOMENTUM BOARD
          ============================================================== */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono font-bold uppercase text-zinc-300 flex items-center gap-1.5">
            <Flame className="w-3.5 h-3.5 text-amber-400" />
            <span>Top Movers — Ranked By Radar Score</span>
          </span>
          <span className="text-[11px] font-mono text-zinc-500 hidden sm:inline">
            Score = 55% growth · 30% engagement · 15% stream velocity
          </span>
        </div>

        <div className="space-y-2.5">
          {ranked.map(({ contact: c, radarScore }, idx) => {
            const rank = idx + 1;
            const isTracked = !!trackedIds[c.id];
            const platConfig = PLATFORM_CONFIGS[c.primaryPlatform];

            return (
              <div
                key={c.id}
                className={`p-4 rounded-2xl bg-[#111622] border transition-all flex flex-col lg:flex-row lg:items-center gap-4 shadow-lg ${
                  rank === 1
                    ? 'border-amber-500/50 ring-1 ring-amber-400/30'
                    : 'border-zinc-800 hover:border-amber-500/40'
                }`}
              >
                {/* Rank + Identity */}
                <div className="flex items-center gap-3.5 flex-1 min-w-0">
                  <div
                    className={`w-10 shrink-0 text-center font-black font-mono ${
                      rank === 1 ? 'text-2xl text-gold-gradient' : rank <= 3 ? 'text-xl text-amber-300' : 'text-lg text-zinc-500'
                    }`}
                  >
                    #{rank}
                  </div>

                  <div className="relative shrink-0">
                    <img
                      src={c.avatar}
                      alt={c.name}
                      className="w-12 h-12 rounded-xl object-cover border border-zinc-700"
                    />
                    <span className="absolute -bottom-1 -right-1 p-0.5 rounded-full bg-zinc-950 border border-zinc-800 shadow">
                      <span
                        className="w-2.5 h-2.5 rounded-full block"
                        style={{ backgroundColor: platConfig?.color || '#A855F7' }}
                      />
                    </span>
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <h3 className="font-bold text-sm text-white truncate">{c.name}</h3>
                      <span className="text-[11px] text-zinc-500 font-mono">{c.handle}</span>
                    </div>
                    <p className="text-[11px] text-zinc-400 truncate">{c.soundOrContentNiche}</p>
                    <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                      {c.verified ? (
                        <span
                          className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded border uppercase tracking-wider flex items-center gap-1 ${
                            tierBadgeStyles[c.tier] || tierBadgeStyles.gold
                          }`}
                        >
                          <BadgeCheck className="w-3 h-3" />
                          CTC Certified · {c.tier}
                        </span>
                      ) : (
                        <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded border uppercase tracking-wider bg-zinc-800/60 text-zinc-400 border-zinc-700">
                          Certification Pending
                        </span>
                      )}
                      <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-amber-500/15 text-amber-300 border border-amber-500/30 uppercase tracking-wider">
                        {c.growthTierLabel}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Hottest Platform + Momentum Stats */}
                <div className="flex items-center gap-4 shrink-0">
                  <div className="hidden md:block">
                    <span className="text-[9px] font-mono uppercase text-zinc-500 block mb-1">Hottest Platform</span>
                    <PlatformBadge platformId={c.primaryPlatform} size="sm" />
                  </div>

                  <div className="grid grid-cols-3 gap-3 font-mono text-center">
                    <div>
                      <span className="text-[9px] uppercase text-zinc-500 block">30d Growth</span>
                      <span className="text-sm font-black text-emerald-400 flex items-center justify-center gap-0.5">
                        <TrendingUp className="w-3 h-3" />
                        +{c.monthlyGrowthPercent}%
                      </span>
                    </div>
                    <div>
                      <span className="text-[9px] uppercase text-zinc-500 block">Engagement</span>
                      <span className="text-sm font-black text-white">{c.engagementRatePercent}%</span>
                    </div>
                    <div>
                      <span className="text-[9px] uppercase text-zinc-500 block">Stream Velocity</span>
                      <span className="text-sm font-black text-white">
                        {formatCount(c.streamVelocityViewsPerDay)}
                        <span className="text-zinc-500 font-normal">/day</span>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Radar Score + Track */}
                <div className="flex lg:flex-col items-center lg:items-end justify-between gap-2 shrink-0 lg:w-32">
                  <div className="flex items-center gap-2.5">
                    <div className="text-right">
                      <div
                        className={`text-base font-mono font-black px-2 py-0.5 rounded-lg bg-black/60 border ${scoreStyles(radarScore)}`}
                      >
                        {radarScore}
                        <span className="text-[10px] text-zinc-500 font-bold"> / 100</span>
                      </div>
                      <span className="text-[9px] font-mono text-zinc-500 block mt-0.5 uppercase">Radar Score</span>
                    </div>
                  </div>

                  <div className="w-28 lg:w-full bg-zinc-900 h-1.5 rounded-full overflow-hidden border border-zinc-800">
                    <div
                      className="h-full bg-gradient-to-r from-amber-500 via-yellow-400 to-emerald-400 rounded-full"
                      style={{ width: `${radarScore}%` }}
                    />
                  </div>

                  <button
                    onClick={() => toggleTracked(c)}
                    className={`px-3 py-1.5 rounded-lg text-[11px] font-bold font-mono transition flex items-center gap-1.5 border cursor-pointer ${
                      isTracked
                        ? 'deal-btn-gold text-amber-950 shadow-md'
                        : 'bg-zinc-900 text-zinc-300 border-zinc-700 hover:border-amber-500/50 hover:text-white'
                    }`}
                  >
                    <Crosshair className="w-3 h-3" />
                    <span>{isTracked ? 'CTC TRACKING' : 'CTC TRACK'}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ==============================================================
          HOW ARTISTS GET ON THE RADAR
          ============================================================== */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-[#111622] border border-zinc-800 space-y-2.5">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center">
              <Activity className="w-4 h-4 text-amber-400" />
            </span>
            <span className="text-[10px] font-mono font-black text-zinc-500">STEP 01</span>
          </div>
          <h4 className="text-sm font-black text-white uppercase tracking-wide">Build Momentum</h4>
          <p className="text-xs text-zinc-400 leading-relaxed">
            CTC Insight tracks your growth, engagement, and stream velocity across all 47 platforms in
            real time. Sustained heat is what moves your blip up the board — no pay-to-play, ever.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-[#111622] border border-zinc-800 space-y-2.5">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4 text-amber-400" />
            </span>
            <span className="text-[10px] font-mono font-black text-zinc-500">STEP 02</span>
          </div>
          <h4 className="text-sm font-black text-white uppercase tracking-wide">Get Certified</h4>
          <p className="text-xs text-zinc-400 leading-relaxed">
            Verify your identity and catalog through CTC Certify and carry the plaque badge on the board.
            Certified creators are the ones labels and brands can sign with confidence.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-[#111622] border border-zinc-800 space-y-2.5">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center">
              <Eye className="w-4 h-4 text-amber-400" />
            </span>
            <span className="text-[10px] font-mono font-black text-zinc-500">STEP 03</span>
          </div>
          <h4 className="text-sm font-black text-white uppercase tracking-wide">Get Seen</h4>
          <p className="text-xs text-zinc-400 leading-relaxed">
            Labels, brands, and sponsors watch this board daily. Radar climbers get first looks, campaign
            briefs, sync pitches, and Showcase Concert invites.
          </p>
        </div>
      </div>

      {/* Footer strip */}
      <div className="flex items-center justify-center gap-2 text-[11px] font-mono text-zinc-500">
        <Zap className="w-3.5 h-3.5 text-amber-400" />
        <span>ON THE RADAR refreshes with every CTC Insight sweep</span>
        <Users className="w-3.5 h-3.5 text-amber-400" />
      </div>
    </div>
  );
};
