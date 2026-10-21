import React, { useState } from 'react';
import {
  Award,
  Crown,
  Sparkles,
  Eye,
  Disc3,
  Flame,
  CheckCircle2,
  Lock,
  Filter,
  Plus,
  TrendingUp,
  Share2,
  Download,
  Users,
  Radio,
  DollarSign,
  Maximize2,
  Zap,
  ArrowRight,
  ShieldCheck,
  Check
} from 'lucide-react';
import { MilestoneAward, PlaqueTier, MilestoneCategory, SubscriptionTierId } from '../../types';
import { PlaqueCard } from './PlaqueCard';
import { PlaqueInspectModal } from './PlaqueInspectModal';
import { ProfileTrophyCase } from './ProfileTrophyCase';
import ctcEagleDiamondImg from '../../assets/images/ctc_eagle_diamond.jpg';

interface MilestoneAwardsProps {
  milestones: MilestoneAward[];
  onToggleDisplay: (id: string) => void;
  onUpdateDedication: (id: string, name: string, dedication: string) => void;
  onClaimAward?: (id: string) => void;
  subscriptionTier?: SubscriptionTierId;
}

export const MilestoneAwards: React.FC<MilestoneAwardsProps> = ({
  milestones,
  onToggleDisplay,
  onUpdateDedication,
  onClaimAward,
  subscriptionTier = 'gold'
}) => {
  const [activeView, setActiveView] = useState<'trophy_case' | 'vault'>('trophy_case');
  const [selectedTier, setSelectedTier] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<'all' | 'unlocked' | 'in_progress'>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [inspectingPlaque, setInspectingPlaque] = useState<MilestoneAward | null>(null);
  
  // Celebration modal state
  const [celebrationPlaque, setCelebrationPlaque] = useState<MilestoneAward | null>(null);

  // Statistics
  const totalAwarded = milestones.filter((m) => m.unlocked).length;
  const totalMounted = milestones.filter((m) => m.unlocked && m.isDisplayedOnProfile).length;
  const inProgressCount = milestones.filter((m) => !m.unlocked).length;

  const totalCertifiedStreams = milestones
    .filter((m) => m.category === 'streams' && m.unlocked)
    .reduce((acc, m) => acc + m.currentValue, 0);

  // Filter logic
  const filteredMilestones = milestones.filter((m) => {
    if (selectedTier !== 'all' && m.tier !== selectedTier) return false;
    if (selectedStatus === 'unlocked' && !m.unlocked) return false;
    if (selectedStatus === 'in_progress' && m.unlocked) return false;
    if (selectedCategory !== 'all' && m.category !== selectedCategory) return false;
    return true;
  });

  const handleClaim = (milestone: MilestoneAward) => {
    if (onClaimAward) {
      onClaimAward(milestone.id);
    }
    setCelebrationPlaque(milestone);
  };

  return (
    <div className="space-y-6">
      {/* Top Grand Executive Plaque Suite Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-amber-950/40 via-zinc-900/90 to-sky-950/40 border border-amber-500/30 shadow-xl">
        <div className="flex items-center gap-4">
          <div className="relative w-12 h-12 rounded-full p-0.5 bg-gradient-to-tr from-amber-400 via-amber-200 to-amber-600 shadow-md flex items-center justify-center">
            <img
              src={ctcEagleDiamondImg}
              alt="CTC Eagle Medallion"
              className="w-full h-full object-cover rounded-full"
            />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-black text-white tracking-wider uppercase">
                CTC Milestone Awards & Plaque Suite
              </h2>
              <span className="engraved-plate-gold text-[9px] uppercase font-black px-2 py-0.5 rounded shadow-sm">
                RIAA-Grade Certified
              </span>
            </div>
            <p className="text-xs text-zinc-400 mt-0.5">
              Honor your verified streaming landmarks, subscriber counts, and escrow checks with collectible Gold, Platinum, and Diamond digital plaques.
            </p>
          </div>
        </div>

        {/* View Switcher: Profile Trophy Case vs Plaque Vault */}
        <div className="flex items-center gap-2 bg-zinc-950/80 p-1.5 rounded-xl border border-zinc-800 self-start lg:self-auto">
          <button
            onClick={() => setActiveView('trophy_case')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold transition ${
              activeView === 'trophy_case'
                ? 'engraved-plate-platinum text-slate-900 shadow-md font-black'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Crown className="w-3.5 h-3.5" />
            <span>Profile Trophy Case ({totalMounted})</span>
          </button>

          <button
            onClick={() => setActiveView('vault')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold transition ${
              activeView === 'vault'
                ? 'engraved-plate-gold text-amber-950 shadow-md font-black'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Award className="w-3.5 h-3.5" />
            <span>Certifications Vault ({milestones.length})</span>
          </button>
        </div>
      </div>

      {/* Primary KPI Metrics — Certified Plaque Awards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: Gold Plaque - Total Plaques Awarded */}
        <div className="plaque-gold p-5 relative overflow-hidden">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-mono uppercase tracking-widest text-amber-400 font-bold">
              OFFICIAL PLAQUES EARNED
            </span>
            <Award className="w-4 h-4 text-amber-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-white font-mono">{totalAwarded}</span>
            <span className="text-xs text-amber-300 font-semibold font-mono">Certified</span>
          </div>
          <div className="mt-2 pt-2 border-t border-amber-900/40 text-[10px] text-zinc-400 flex items-center justify-between">
            <span>RIAA / CTC Standards</span>
            <span className="text-amber-400 font-bold">100% Verified</span>
          </div>
        </div>

        {/* KPI 2: Platinum Plaque - Mounted on Profile */}
        <div className="plaque-platinum p-5 relative overflow-hidden">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-mono uppercase tracking-widest text-slate-300 font-bold">
              MOUNTED ON PROFILE
            </span>
            <Eye className="w-4 h-4 text-slate-300" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-white font-mono">{totalMounted}</span>
            <span className="text-xs text-slate-300 font-semibold font-mono">Trophy Case</span>
          </div>
          <div className="mt-2 pt-2 border-t border-slate-700/40 text-[10px] text-zinc-400 flex items-center justify-between">
            <span>Public Creator Wall</span>
            <span className="text-emerald-400 font-bold">Live Spotlight</span>
          </div>
        </div>

        {/* KPI 3: Diamond Plaque - Certified DSP Streams */}
        <div className="plaque-diamond p-5 relative overflow-hidden">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-mono uppercase tracking-widest text-sky-300 font-bold">
              COMMEMORATED STREAMS
            </span>
            <Disc3 className="w-4 h-4 text-sky-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-white font-mono">
              {(totalCertifiedStreams / 1000000).toFixed(2)}M
            </span>
            <span className="text-xs text-sky-300 font-semibold font-mono">Audio Plays</span>
          </div>
          <div className="mt-2 pt-2 border-t border-sky-900/40 text-[10px] text-zinc-400 flex items-center justify-between">
            <span>Spotify, Apple, Amazon</span>
            <span className="text-sky-300 font-bold">Lossless Data</span>
          </div>
        </div>

        {/* KPI 4: In Progress Certifications */}
        <div className="deal-memo-card p-5 relative overflow-hidden">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-mono uppercase tracking-widest text-amber-400 font-bold">
              IN PROGRESS BENCHMARKS
            </span>
            <TrendingUp className="w-4 h-4 text-amber-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-white font-mono">{inProgressCount}</span>
            <span className="text-xs text-zinc-400 font-semibold font-mono">Milestones</span>
          </div>
          <div className="mt-2 pt-2 border-t border-zinc-800 text-[10px] text-zinc-400 flex items-center justify-between">
            <span>Next: 500K Subs & 10M Plays</span>
            <span className="text-amber-400 font-bold">Live Relays</span>
          </div>
        </div>
      </div>

      {/* Main View Render */}
      {activeView === 'trophy_case' ? (
        <ProfileTrophyCase
          milestones={milestones}
          onToggleDisplay={onToggleDisplay}
          onInspect={(m) => setInspectingPlaque(m)}
          onSwitchToVault={() => setActiveView('vault')}
          subscriptionTier={subscriptionTier}
        />
      ) : (
        /* Vault View: Filterable Grid of All Milestones & Certifications */
        <div className="space-y-6">
          {/* Filter Bar */}
          <div className="p-4 rounded-xl bg-zinc-900/90 border border-zinc-800 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-xs font-bold text-zinc-300">
                <Filter className="w-4 h-4 text-amber-400" />
                <span>Filter Certifications & Milestones:</span>
              </div>
              <span className="text-xs text-zinc-400 font-mono">
                Showing {filteredMilestones.length} of {milestones.length} Plaques
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {/* Status Filter */}
              <div className="flex items-center gap-1 bg-black/40 p-1 rounded-lg border border-zinc-800 text-xs">
                {(['all', 'unlocked', 'in_progress'] as const).map((s) => (
                  <button
                    key={s}
                    onClick={() => setSelectedStatus(s)}
                    className={`px-2.5 py-1 rounded text-xs font-semibold transition ${
                      selectedStatus === s
                        ? 'bg-zinc-800 text-white font-bold'
                        : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    {s === 'all'
                      ? 'All Statuses'
                      : s === 'unlocked'
                      ? 'Awarded'
                      : 'In Progress'}
                  </button>
                ))}
              </div>

              {/* Tier Filter */}
              <div className="flex items-center gap-1 bg-black/40 p-1 rounded-lg border border-zinc-800 text-xs">
                {(['all', 'gold', 'platinum', 'diamond'] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => setSelectedTier(t)}
                    className={`px-2.5 py-1 rounded text-xs font-semibold transition uppercase font-mono ${
                      selectedTier === t
                        ? t === 'gold'
                          ? 'bg-amber-500/30 text-amber-300 font-bold'
                          : t === 'platinum'
                          ? 'bg-slate-300/30 text-slate-100 font-bold'
                          : t === 'diamond'
                          ? 'bg-sky-500/30 text-sky-200 font-bold'
                          : 'bg-zinc-800 text-white font-bold'
                        : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    {t === 'all' ? 'All Tiers' : t}
                  </button>
                ))}
              </div>

              {/* Category Filter */}
              <div className="flex items-center gap-1 bg-black/40 p-1 rounded-lg border border-zinc-800 text-xs">
                {[
                  { id: 'all', label: 'All Categories' },
                  { id: 'streams', label: 'Streaming Plays' },
                  { id: 'audience', label: 'Subscribers' },
                  { id: 'revenue', label: 'Escrow Check' },
                  { id: 'broadcast', label: 'Live Multicast' },
                  { id: 'distribution', label: 'Omni Network' }
                ].map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setSelectedCategory(c.id)}
                    className={`px-2.5 py-1 rounded text-xs font-semibold transition ${
                      selectedCategory === c.id
                        ? 'bg-zinc-800 text-white font-bold'
                        : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    {c.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Grid of All Plaque Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMilestones.map((milestone) => (
              <PlaqueCard
                key={milestone.id}
                milestone={milestone}
                onToggleDisplay={onToggleDisplay}
                onInspect={(m) => setInspectingPlaque(m)}
                onClaim={handleClaim}
              />
            ))}
          </div>

          {filteredMilestones.length === 0 && (
            <div className="text-center py-12 bg-zinc-900/60 rounded-2xl border border-zinc-800">
              <Award className="w-12 h-12 text-zinc-600 mx-auto mb-2" />
              <p className="text-sm text-zinc-400 font-semibold">
                No milestone plaques match the selected filters.
              </p>
              <button
                onClick={() => {
                  setSelectedTier('all');
                  setSelectedStatus('all');
                  setSelectedCategory('all');
                }}
                className="mt-3 text-xs text-amber-400 hover:underline font-bold"
              >
                Reset All Filters
              </button>
            </div>
          )}
        </div>
      )}

      {/* Inspect Plaque Modal */}
      <PlaqueInspectModal
        milestone={inspectingPlaque}
        onClose={() => setInspectingPlaque(null)}
        onToggleDisplay={onToggleDisplay}
        onUpdateDedication={onUpdateDedication}
      />

      {/* Celebration Modal when milestone claimed */}
      {celebrationPlaque && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="plaque-gold p-6 sm:p-8 max-w-lg w-full text-center relative overflow-hidden rounded-2xl shadow-2xl border-2 border-amber-400 animate-in fade-in zoom-in duration-300">
            {/* Shimmer background */}
            <div className="absolute inset-0 bg-gradient-to-tr from-amber-500/20 via-transparent to-sky-500/20 pointer-events-none" />

            <div className="w-16 h-16 rounded-full p-1 bg-gradient-to-tr from-amber-400 via-amber-200 to-amber-600 mx-auto mb-4 shadow-xl flex items-center justify-center">
              <img
                src={ctcEagleDiamondImg}
                alt="CTC Eagle Medallion"
                className="w-full h-full object-cover rounded-full"
              />
            </div>

            <span className="engraved-plate-gold text-[10px] uppercase font-black tracking-widest px-3 py-1 rounded shadow-sm inline-block mb-2">
              OFFICIAL CERTIFICATION CONFERRED
            </span>

            <h3 className="text-2xl font-black text-white tracking-wide">
              {celebrationPlaque.title}
            </h3>
            <p className="text-xs text-amber-200 mt-2 font-mono">
              Certified {celebrationPlaque.tier.toUpperCase()} Plaque awarded to {celebrationPlaque.recipientName}
            </p>

            <div className="p-4 rounded-xl bg-black/60 border border-amber-900/50 my-5 text-left text-xs space-y-1">
              <div className="flex justify-between">
                <span className="text-zinc-400">Certification ID:</span>
                <span className="font-mono text-white font-bold">{celebrationPlaque.certificationId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Audit Status:</span>
                <span className="text-emerald-400 font-bold">100% Cryptographically Verified</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Trophy Case:</span>
                <span className="text-amber-300 font-bold">Ready to Mount on Profile Wall</span>
              </div>
            </div>

            <div className="flex items-center gap-3 justify-center">
              <button
                onClick={() => {
                  onToggleDisplay(celebrationPlaque.id);
                  setCelebrationPlaque(null);
                  setActiveView('trophy_case');
                }}
                className="deal-btn-gold px-5 py-2.5 rounded-xl text-xs font-black shadow-lg"
              >
                CTC Mount Plaque on Profile Wall!
              </button>
              <button
                onClick={() => setCelebrationPlaque(null)}
                className="px-4 py-2.5 rounded-xl text-xs font-semibold text-zinc-400 hover:text-white"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
