import React, { useState, useMemo } from 'react';
import {
  Compass,
  TrendingUp,
  Sparkles,
  Zap,
  Award,
  ShieldCheck,
  Star,
  Users,
  Search,
  Filter,
  CheckCircle2,
  ExternalLink,
  Flame,
  Music,
  Video,
  Radio,
  FileSignature,
  DollarSign,
  ArrowUpRight,
  Bookmark,
  Share2,
  SlidersHorizontal,
  X,
  Building2,
  Eye,
  Activity
} from 'lucide-react';
import { ScoutContact, EngagementGrowthTier, PlatformId } from '../../types';
import { PLATFORM_CONFIGS } from '../../data/mockData';
import { PlatformBadge } from '../common/PlatformBadge';
import ctcEagleDiamondImg from '../../assets/images/ctc_eagle_diamond.jpg';

interface ARScoutTalentViewProps {
  contacts: ScoutContact[];
  onTriggerToast: (msg: string) => void;
  currencySymbol?: string;
}

export const ARScoutTalentView: React.FC<ARScoutTalentViewProps> = ({
  contacts,
  onTriggerToast,
  currencySymbol = '$'
}) => {
  const [selectedGrowthTier, setSelectedGrowthTier] = useState<EngagementGrowthTier>('all');
  const [selectedPlatform, setSelectedPlatform] = useState<PlatformId | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'growth' | 'engagement' | 'score' | 'followers' | 'velocity'>('growth');
  const [showWatchlistOnly, setShowWatchlistOnly] = useState(false);
  
  // Watchlist state
  const [watchlistedIds, setWatchlistedIds] = useState<Record<string, boolean>>(() => {
    try {
      const saved = localStorage.getItem('ctc_scout_watchlist');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    // Defaults from contacts
    const initial: Record<string, boolean> = {};
    contacts.forEach((c) => {
      if (c.isWatchlisted) initial[c.id] = true;
    });
    return initial;
  });

  // Modal inspection & proposal states
  const [inspectedContact, setInspectedContact] = useState<ScoutContact | null>(null);
  const [proposalContact, setProposalContact] = useState<ScoutContact | null>(null);
  const [proposalType, setProposalType] = useState<'joint_master' | 'collab_stream' | 'sync_placement' | 'exclusive_rep'>('joint_master');
  const [proposalAdvance, setProposalAdvance] = useState('15000');
  const [proposalSplit, setProposalSplit] = useState('70/30');
  const [proposalDeliverable, setProposalDeliverable] = useState('1 Co-Produced Single + 3 Multi-Live Studio Jam Streams');
  const [proposalSubmitted, setProposalSubmitted] = useState(false);

  const toggleWatchlist = (id: string, name: string) => {
    setWatchlistedIds((prev) => {
      const updated = { ...prev, [id]: !prev[id] };
      try {
        localStorage.setItem('ctc_scout_watchlist', JSON.stringify(updated));
      } catch (e) {}
      onTriggerToast(!prev[id] ? `★ Pinned ${name} to A&R Watchlist` : `Removed ${name} from A&R Watchlist`);
      return updated;
    });
  };

  const growthTierDefinitions = [
    {
      id: 'all' as EngagementGrowthTier,
      label: 'All Tiers',
      subtext: 'Complete Roster',
      badge: '10 Scouted',
      color: 'border-zinc-700 text-zinc-300'
    },
    {
      id: 'viral_breakout' as EngagementGrowthTier,
      label: '🚀 Viral Breakout (+100%+)',
      subtext: 'Surging Momentum',
      badge: '+165% to +245%',
      color: 'border-amber-500/50 text-amber-300 bg-amber-950/30'
    },
    {
      id: 'high_velocity' as EngagementGrowthTier,
      label: '⚡ High Velocity (+40-100%)',
      subtext: 'Consistent Rapid Growth',
      badge: '+68% to +82%',
      color: 'border-purple-500/50 text-purple-300 bg-purple-950/30'
    },
    {
      id: 'underground_gem' as EngagementGrowthTier,
      label: '🔍 Underground Gems (10%+ ER)',
      subtext: 'Hyper-Engaged Loyal Audience',
      badge: 'Up to 18.5% ER',
      color: 'border-emerald-500/50 text-emerald-300 bg-emerald-950/30'
    },
    {
      id: 'steady_climber' as EngagementGrowthTier,
      label: '📈 Steady Climbers (+15-40%)',
      subtext: 'Reliable Production Trajectory',
      badge: '+28% Lift',
      color: 'border-blue-500/50 text-blue-300 bg-blue-950/30'
    },
    {
      id: 'established_titan' as EngagementGrowthTier,
      label: '💎 Established Titans (500K+)',
      subtext: 'Proven Stadium-Scale Reach',
      badge: 'Up to 1.48M Reach',
      color: 'border-sky-500/50 text-sky-300 bg-sky-950/30'
    }
  ];

  // Filtering and sorting contacts
  const filteredContacts = useMemo(() => {
    return contacts
      .filter((c) => {
        // Growth tier
        if (selectedGrowthTier !== 'all' && c.growthTier !== selectedGrowthTier) {
          return false;
        }
        // Platform
        if (selectedPlatform !== 'all' && c.primaryPlatform !== selectedPlatform) {
          return false;
        }
        // Watchlist only
        if (showWatchlistOnly && !watchlistedIds[c.id]) {
          return false;
        }
        // Search
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchName = c.name.toLowerCase().includes(q);
          const matchHandle = c.handle.toLowerCase().includes(q);
          const matchRole = c.primaryRole.toLowerCase().includes(q);
          const matchNiche = c.soundOrContentNiche.toLowerCase().includes(q);
          if (!matchName && !matchHandle && !matchRole && !matchNiche) return false;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'growth') return b.monthlyGrowthPercent - a.monthlyGrowthPercent;
        if (sortBy === 'engagement') return b.engagementRatePercent - a.engagementRatePercent;
        if (sortBy === 'score') return b.arScoutScore - a.arScoutScore;
        if (sortBy === 'followers') return b.followersCount - a.followersCount;
        if (sortBy === 'velocity') return b.streamVelocityViewsPerDay - a.streamVelocityViewsPerDay;
        return 0;
      });
  }, [contacts, selectedGrowthTier, selectedPlatform, searchQuery, sortBy, showWatchlistOnly, watchlistedIds]);

  const handleSendProposal = (e: React.FormEvent) => {
    e.preventDefault();
    setProposalSubmitted(true);
    setTimeout(() => {
      onTriggerToast(`⚡ Executive Offer sent to ${proposalContact?.name} via CTC Smart Escrow!`);
      setProposalSubmitted(false);
      setProposalContact(null);
    }, 2200);
  };

  return (
    <div className="space-y-6">
      {/* ==============================================================
          A&R SCOUT RADAR & EXECUTIVE BANNER
          ============================================================== */}
      <div className="plaque-gold p-6 lg:p-8 rounded-3xl relative overflow-hidden">
        <div className="absolute -right-20 -bottom-20 w-80 h-80 rounded-full grooved-record-disc opacity-20 pointer-events-none" />

        <div className="relative z-10 space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-amber-500/20 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-400 via-amber-200 to-amber-600 shadow-xl flex items-center justify-center p-0.5">
                <img
                  src={ctcEagleDiamondImg}
                  alt="CTC Medallion"
                  className="w-full h-full object-cover rounded-2xl"
                />
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <span className="engraved-plate-gold text-[9px] uppercase font-black px-2 py-0.5 rounded shadow-sm">
                    A&R TALENT SCOUTING DIVISION
                  </span>
                  <span className="text-[11px] font-mono text-emerald-400 flex items-center gap-1 font-bold">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                    LIVE AUDIENCE METRICS AUDIT ACTIVE
                  </span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-white tracking-wide uppercase mt-0.5">
                  Verified Engagement & Growth Scouting Radar
                </h2>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowWatchlistOnly(!showWatchlistOnly)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold font-mono transition flex items-center gap-2 border ${
                  showWatchlistOnly
                    ? 'deal-btn-gold text-amber-950 shadow-md ring-1 ring-amber-400'
                    : 'bg-black/60 text-zinc-300 border-amber-500/30 hover:border-amber-400 hover:text-white'
                }`}
              >
                <Star className={`w-3.5 h-3.5 ${showWatchlistOnly ? 'text-amber-950 fill-amber-950' : 'text-amber-400'}`} />
                <span>Watchlist Only ({Object.values(watchlistedIds).filter(Boolean).length})</span>
              </button>
            </div>
          </div>

          <p className="text-xs text-amber-200/80 max-w-3xl leading-relaxed">
            Major Label A&R Intelligence Engine: Evaluates network creators across 47 synchronized DSP and live platforms. Filter rising talent by verified monthly growth velocity, engagement-to-follower ratios, retention benchmarks, and estimated monetization yield.
          </p>

          {/* Quick Stats Ticker */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
            <div className="p-3 rounded-xl bg-black/60 border border-amber-500/20">
              <span className="text-[10px] font-mono uppercase text-zinc-400 block">Total Monitored Reach</span>
              <span className="text-lg font-black text-white font-mono">4,192,000</span>
              <span className="text-[10px] text-emerald-400 font-semibold block mt-0.5">+48.2% avg 30d velocity</span>
            </div>

            <div className="p-3 rounded-xl bg-black/60 border border-amber-500/20">
              <span className="text-[10px] font-mono uppercase text-zinc-400 block">Top Breakout Growth</span>
              <span className="text-lg font-black text-amber-300 font-mono">+245.0%</span>
              <span className="text-[10px] text-amber-200/70 font-semibold block mt-0.5">@cyberecho_music (Spotify)</span>
            </div>

            <div className="p-3 rounded-xl bg-black/60 border border-amber-500/20">
              <span className="text-[10px] font-mono uppercase text-zinc-400 block">Peak Engagement Rate</span>
              <span className="text-lg font-black text-emerald-400 font-mono">19.8% ER</span>
              <span className="text-[10px] text-zinc-400 font-semibold block mt-0.5">4.7x Industry Baseline</span>
            </div>

            <div className="p-3 rounded-xl bg-black/60 border border-amber-500/20">
              <span className="text-[10px] font-mono uppercase text-zinc-400 block">Escrow Collab Ready</span>
              <span className="text-lg font-black text-sky-400 font-mono">$744,000</span>
              <span className="text-[10px] text-sky-300/80 font-semibold block mt-0.5">Instant split verification</span>
            </div>
          </div>
        </div>
      </div>

      {/* ==============================================================
          ENGAGEMENT GROWTH TIER SELECTOR PILLS
          ============================================================== */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono font-bold uppercase text-zinc-300 flex items-center gap-1.5">
            <SlidersHorizontal className="w-3.5 h-3.5 text-amber-400" />
            <span>Select Verified Engagement Growth Tier:</span>
          </span>
          <span className="text-[11px] font-mono text-zinc-400">
            Showing <strong className="text-white">{filteredContacts.length}</strong> of {contacts.length} verified creators
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
          {growthTierDefinitions.map((tier) => {
            const isSelected = selectedGrowthTier === tier.id;
            return (
              <button
                key={tier.id}
                onClick={() => setSelectedGrowthTier(tier.id)}
                className={`p-3 rounded-2xl text-left transition border cursor-pointer ${
                  isSelected
                    ? 'plaque-gold border-amber-400 shadow-xl ring-1 ring-amber-300'
                    : 'bg-zinc-900/60 border-zinc-800 hover:border-zinc-700 text-zinc-400 hover:text-white'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${
                    isSelected ? 'bg-amber-400 text-amber-950 font-black' : 'bg-zinc-800 text-zinc-400'
                  }`}>
                    {tier.badge}
                  </span>
                </div>
                <div className="text-xs font-black text-white truncate">{tier.label}</div>
                <div className="text-[10px] text-zinc-400 truncate mt-0.5">{tier.subtext}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* ==============================================================
          SECONDARY CONTROLS: SEARCH, PLATFORM, SORT
          ============================================================== */}
      <div className="p-4 rounded-2xl bg-zinc-900/70 border border-zinc-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by creator name, @handle, musical niche, or role..."
            className="w-full pl-10 pr-4 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-400"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white text-xs"
            >
              ✕
            </button>
          )}
        </div>

        {/* Platform Selector & Sort Dropdown */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Platform Filter */}
          <div className="flex items-center gap-1.5 bg-zinc-950 p-1 rounded-xl border border-zinc-800">
            {(['all', 'spotify', 'tiktok', 'youtube', 'kick', 'applemusic'] as const).map((plat) => (
              <button
                key={plat}
                onClick={() => setSelectedPlatform(plat)}
                className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold capitalize transition ${
                  selectedPlatform === plat
                    ? 'bg-amber-400 text-amber-950 shadow-sm'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                {plat === 'all' ? 'All DSPs' : plat}
              </button>
            ))}
          </div>

          {/* Sort By Dropdown */}
          <div className="flex items-center gap-1.5 text-xs font-mono">
            <span className="text-zinc-500">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-zinc-950 border border-zinc-800 text-amber-300 text-xs px-3 py-1.5 rounded-xl font-bold focus:outline-none focus:border-amber-400 cursor-pointer"
            >
              <option value="growth">🔥 Monthly Growth %</option>
              <option value="engagement">⚡ Engagement Rate (ER %)</option>
              <option value="score">🏆 A&R Scout Score</option>
              <option value="followers">👥 Total Reach</option>
              <option value="velocity">📈 Daily Stream Velocity</option>
            </select>
          </div>
        </div>
      </div>

      {/* ==============================================================
          A&R SCOUT CONTACT CARDS ROSTER
          ============================================================== */}
      {filteredContacts.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-zinc-900/40 border border-dashed border-zinc-800 space-y-3">
          <Compass className="w-10 h-10 text-amber-400 mx-auto animate-pulse" />
          <h3 className="text-base font-bold text-white">No Creators Matching Current A&R Scout Filter</h3>
          <p className="text-xs text-zinc-400 max-w-md mx-auto">
            Try selecting "All Tiers", resetting the search query, or unchecking "Watchlist Only" to inspect all verified network talent.
          </p>
          <button
            onClick={() => {
              setSelectedGrowthTier('all');
              setSelectedPlatform('all');
              setSearchQuery('');
              setShowWatchlistOnly(false);
            }}
            className="deal-btn-gold px-4 py-2 rounded-xl text-xs font-bold inline-flex items-center gap-2"
          >
            <span>Reset All A&R Filters</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredContacts.map((c) => {
            const isStarred = !!watchlistedIds[c.id];
            const platConfig = PLATFORM_CONFIGS[c.primaryPlatform];

            return (
              <div
                key={c.id}
                className="executive-marble-trim p-5 rounded-3xl relative overflow-hidden transition-all duration-300 hover:border-amber-500/50 hover:shadow-2xl space-y-4"
              >
                {/* Card Top: Avatar, Role, Verification & A&R Score */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3.5">
                    <div className="relative">
                      <img
                        src={c.avatar}
                        alt={c.name}
                        className="w-14 h-14 rounded-2xl object-cover border-2 border-amber-500/30 shadow-md"
                      />
                      <span className="absolute -bottom-1 -right-1 p-1 rounded-full bg-zinc-950 border border-zinc-800 shadow">
                        <span
                          className="w-2.5 h-2.5 rounded-full block"
                          style={{ backgroundColor: platConfig?.color || '#A855F7' }}
                        />
                      </span>
                    </div>

                    <div className="space-y-0.5">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <h3 className="text-base font-black text-white hover:text-amber-300 transition cursor-pointer" onClick={() => setInspectedContact(c)}>
                          {c.name}
                        </h3>
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span className="text-[10px] font-mono text-zinc-400">{c.handle}</span>
                      </div>

                      <p className="text-xs text-amber-200/90 font-semibold">{c.primaryRole}</p>

                      <div className="flex items-center gap-2 pt-0.5">
                        <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-md uppercase tracking-wider ${
                          c.growthTier === 'viral_breakout'
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                            : c.growthTier === 'high_velocity'
                            ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40'
                            : c.growthTier === 'underground_gem'
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                            : 'bg-zinc-800 text-zinc-300 border border-zinc-700'
                        }`}>
                          {c.growthTierLabel}
                        </span>

                        <span className="text-[10px] font-mono text-zinc-400 capitalize">
                          {platConfig?.name} Native
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* A&R Score & Watchlist Star */}
                  <div className="flex flex-col items-end gap-2 shrink-0">
                    <button
                      onClick={() => toggleWatchlist(c.id, c.name)}
                      className={`p-1.5 rounded-xl border transition cursor-pointer ${
                        isStarred
                          ? 'bg-amber-400/20 border-amber-400 text-amber-300 shadow-md'
                          : 'bg-zinc-900 border-zinc-800 text-zinc-500 hover:text-white hover:border-zinc-600'
                      }`}
                      title={isStarred ? 'Remove from Watchlist' : 'Add to A&R Watchlist'}
                    >
                      <Star className={`w-4 h-4 ${isStarred ? 'fill-amber-400 text-amber-400' : ''}`} />
                    </button>

                    <div className="text-right">
                      <div className="text-xs font-mono font-black text-gold-gradient px-2 py-0.5 rounded-lg bg-black/60 border border-amber-500/30">
                        {c.arScoutScore} / 100
                      </div>
                      <span className="text-[9px] font-mono text-zinc-400 block mt-0.5 uppercase">
                        A&R INDEX
                      </span>
                    </div>
                  </div>
                </div>

                {/* Audiences & Engagement Growth Telemetry Grid */}
                <div className="grid grid-cols-3 gap-2 p-3 rounded-2xl bg-black/60 border border-zinc-800/80 font-mono text-center">
                  <div className="p-1">
                    <span className="text-[9px] uppercase text-zinc-400 block">30d Velocity</span>
                    <span className="text-sm font-black text-amber-300 flex items-center justify-center gap-0.5">
                      <ArrowUpRight className="w-3.5 h-3.5 text-emerald-400" />
                      +{c.monthlyGrowthPercent}%
                    </span>
                    <span className="text-[9px] text-zinc-400 block">vs +8.4% avg</span>
                  </div>

                  <div className="p-1 border-x border-zinc-800">
                    <span className="text-[9px] uppercase text-zinc-400 block">Verified ER</span>
                    <span className="text-sm font-black text-emerald-400">
                      {c.engagementRatePercent}%
                    </span>
                    <span className="text-[9px] text-zinc-400 block">True Engagement</span>
                  </div>

                  <div className="p-1">
                    <span className="text-[9px] uppercase text-zinc-400 block">Total Reach</span>
                    <span className="text-sm font-black text-white">
                      {c.followersCount > 1000000
                        ? `${(c.followersCount / 1000000).toFixed(2)}M`
                        : `${(c.followersCount / 1000).toFixed(0)}K`}
                    </span>
                    <span className="text-[9px] text-zinc-400 block">Audited Fans</span>
                  </div>
                </div>

                {/* Growth Velocity Bar Indicator */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] font-mono">
                    <span className="text-zinc-400 flex items-center gap-1">
                      <Activity className="w-3 h-3 text-emerald-400" />
                      Momentum Benchmark vs Industry
                    </span>
                    <span className="text-emerald-400 font-bold">
                      {c.monthlyGrowthPercent > 100 ? 'S-Tier Viral Velocity' : 'A-Tier Rapid Traction'}
                    </span>
                  </div>
                  <div className="w-full bg-zinc-900 h-2 rounded-full overflow-hidden border border-zinc-800">
                    <div
                      className="h-full bg-gradient-to-r from-amber-500 via-yellow-400 to-emerald-400 rounded-full"
                      style={{ width: `${Math.min(c.monthlyGrowthPercent / 2.5, 100)}%` }}
                    />
                  </div>
                </div>

                {/* Breakout Intel & Demographics */}
                <div className="p-2.5 rounded-xl bg-zinc-950/80 border border-zinc-800/80 text-[11px] space-y-1 font-mono">
                  <div className="flex items-start gap-1 text-zinc-300">
                    <Flame className="w-3 h-3 text-amber-400 shrink-0 mt-0.5" />
                    <span className="truncate">
                      <strong className="text-white">Breakout:</strong> {c.recentBreakoutDrop}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-zinc-400 text-[10px]">
                    <Users className="w-3 h-3 text-sky-400 shrink-0" />
                    <span>Top Audience: <strong className="text-zinc-200">{c.topAudienceDemographic}</strong></span>
                  </div>
                </div>

                {/* Card Action Footer */}
                <div className="pt-2 border-t border-zinc-800/80 flex items-center justify-between gap-3">
                  <button
                    onClick={() => setInspectedContact(c)}
                    className="text-xs font-mono font-bold text-zinc-400 hover:text-white flex items-center gap-1 transition"
                  >
                    <Eye className="w-3.5 h-3.5 text-zinc-400" />
                    <span>CTC View A&R Dossier</span>
                  </button>

                  <button
                    onClick={() => setProposalContact(c)}
                    className="deal-btn-gold px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider shadow-md flex items-center gap-1.5 cursor-pointer"
                  >
                    <FileSignature className="w-3.5 h-3.5" />
                    <span>CTC Send Deal Proposal</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ==============================================================
          INSPECT FULL A&R DOSSIER MODAL
          ============================================================== */}
      {inspectedContact && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xl flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="relative w-full max-w-2xl executive-leather-desk rounded-3xl border-2 border-amber-500/60 p-6 sm:p-8 space-y-5 shadow-2xl max-h-[85vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-start justify-between gap-4 border-b border-amber-500/20 pb-4">
              <div className="flex items-center gap-3.5">
                <img
                  src={inspectedContact.avatar}
                  alt={inspectedContact.name}
                  className="w-16 h-16 rounded-2xl object-cover border-2 border-amber-400"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="engraved-plate-gold text-[9px] font-black uppercase px-2 py-0.5 rounded">
                      A&R TALENT DOSSIER
                    </span>
                    <span className="text-xs font-mono text-emerald-400 font-bold">
                      VERIFIED AUDIENCE AUDIT
                    </span>
                  </div>
                  <h3 className="text-xl font-black text-white mt-1">
                    {inspectedContact.name}
                  </h3>
                  <p className="text-xs text-amber-300 font-mono">
                    {inspectedContact.handle} • {inspectedContact.primaryRole}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setInspectedContact(null)}
                className="p-2 text-zinc-400 hover:text-white rounded-xl hover:bg-zinc-800 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* A&R Score & Key Metrics Banner */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center font-mono">
              <div className="p-3 rounded-2xl bg-black/60 border border-amber-500/30">
                <span className="text-[10px] uppercase text-zinc-400 block">A&R Scout Score</span>
                <span className="text-2xl font-black text-gold-gradient">{inspectedContact.arScoutScore} / 100</span>
                <span className="text-[10px] text-amber-300 font-bold block mt-0.5">
                  {inspectedContact.arScoutScore >= 95 ? 'Top 1% Signing Target' : 'High Priority Partner'}
                </span>
              </div>

              <div className="p-3 rounded-2xl bg-black/60 border border-amber-500/30">
                <span className="text-[10px] uppercase text-zinc-400 block">30d Growth Velocity</span>
                <span className="text-2xl font-black text-emerald-400">+{inspectedContact.monthlyGrowthPercent}%</span>
                <span className="text-[10px] text-zinc-400 block mt-0.5">Audited Streaming Data</span>
              </div>

              <div className="p-3 rounded-2xl bg-black/60 border border-amber-500/30">
                <span className="text-[10px] uppercase text-zinc-400 block">True Engagement</span>
                <span className="text-2xl font-black text-amber-300">{inspectedContact.engagementRatePercent}%</span>
                <span className="text-[10px] text-zinc-400 block mt-0.5">Follower Conversion</span>
              </div>

              <div className="p-3 rounded-2xl bg-black/60 border border-amber-500/30">
                <span className="text-[10px] uppercase text-zinc-400 block">Daily Stream Rate</span>
                <span className="text-2xl font-black text-sky-400">
                  {(inspectedContact.streamVelocityViewsPerDay / 1000).toFixed(0)}k/day
                </span>
                <span className="text-[10px] text-zinc-400 block mt-0.5">Active Ingest Velocity</span>
              </div>
            </div>

            {/* A&R Intelligence Notes */}
            <div className="p-4 rounded-2xl bg-black/70 border border-zinc-800 space-y-2.5 font-mono text-xs">
              <div className="flex items-center gap-2 text-amber-300 font-bold text-xs uppercase border-b border-zinc-800 pb-1.5">
                <Building2 className="w-4 h-4 text-amber-400" />
                <span>Executive Talent Assessment & Valuation:</span>
              </div>

              <div className="space-y-1.5 text-zinc-300">
                <p>
                  <strong className="text-white">Musical / Creative Niche:</strong> {inspectedContact.soundOrContentNiche}
                </p>
                <p>
                  <strong className="text-white">Breakout Catalog Placement:</strong> {inspectedContact.recentBreakoutDrop}
                </p>
                <p>
                  <strong className="text-white">Core Demographics:</strong> {inspectedContact.topAudienceDemographic}
                </p>
                <p>
                  <strong className="text-white">Audience Retention:</strong> {inspectedContact.retentionRatePercent}% avg listener duration (Apple Digital Masters & Spotify benchmarks).
                </p>
                <p>
                  <strong className="text-white">Estimated RPM Yield:</strong> {currencySymbol}{inspectedContact.estimatedRpm.toFixed(2)} per 1,000 monetized plays/streams.
                </p>
              </div>
            </div>

            {/* Contract Recommendation */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/15 via-yellow-500/10 to-transparent border border-amber-500/40 flex items-center justify-between gap-4">
              <div>
                <span className="text-[10px] font-mono font-black uppercase text-amber-400 block">
                  A&R Deal Recommendation
                </span>
                <p className="text-xs text-white font-bold mt-0.5">
                  Execute Joint Master Split Sheet via CTC Smart Escrow (70/30 or 50/50).
                </p>
                <p className="text-[11px] text-zinc-300 mt-0.5">
                  High algorithmic synergy for simultaneous live studio jams and Spotify release day syndication.
                </p>
              </div>

              <button
                onClick={() => {
                  const target = inspectedContact;
                  setInspectedContact(null);
                  setProposalContact(target);
                }}
                className="deal-btn-gold px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider shrink-0 cursor-pointer shadow-lg"
              >
                CTC Draft Deal Now →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==============================================================
          DRAFT A&R PROPOSAL & CONTRACT MODAL
          ============================================================== */}
      {proposalContact && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xl flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="relative w-full max-w-xl executive-leather-desk rounded-3xl border-2 border-amber-500/80 p-6 sm:p-8 space-y-5 shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between border-b border-amber-500/20 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-amber-500/20 border border-amber-400 text-amber-300">
                  <FileSignature className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-white">
                    Send Executive Deal Proposal
                  </h3>
                  <p className="text-xs text-amber-300 font-mono">
                    Recipient: {proposalContact.name} ({proposalContact.handle})
                  </p>
                </div>
              </div>

              <button
                onClick={() => setProposalContact(null)}
                className="text-zinc-500 hover:text-white text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSendProposal} className="space-y-4">
              {/* Proposal Type */}
              <div className="space-y-1.5 font-mono text-xs">
                <label className="text-zinc-400 uppercase block font-bold">Deal Structure:</label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'joint_master', label: 'Joint Master Release', sub: 'Shared DSP & Video Royalties' },
                    { id: 'collab_stream', label: 'Co-Stream Multi-Live', sub: 'Simultaneous 1080p60 Relay' },
                    { id: 'sync_placement', label: 'Catalog Sync Placement', sub: 'Licensing & Production' },
                    { id: 'exclusive_rep', label: 'Production Agreement', sub: 'Custom Track Engineering' }
                  ].map((d) => (
                    <button
                      key={d.id}
                      type="button"
                      onClick={() => setProposalType(d.id as any)}
                      className={`p-2.5 rounded-xl text-left border transition ${
                        proposalType === d.id
                          ? 'plaque-gold border-amber-400 text-amber-200'
                          : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-white'
                      }`}
                    >
                      <span className="font-bold block text-xs">{d.label}</span>
                      <span className="text-[10px] text-zinc-500 block">{d.sub}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Advance & Split */}
              <div className="grid grid-cols-2 gap-3 font-mono text-xs">
                <div>
                  <label className="text-zinc-400 uppercase block font-bold mb-1">
                    Escrow Advance Deposit ({currencySymbol}):
                  </label>
                  <input
                    type="number"
                    value={proposalAdvance}
                    onChange={(e) => setProposalAdvance(e.target.value)}
                    className="w-full bg-zinc-950 px-3.5 py-2.5 rounded-xl border border-zinc-800 text-white font-mono focus:border-amber-400 focus:outline-none"
                    placeholder="15000"
                  />
                </div>

                <div>
                  <label className="text-zinc-400 uppercase block font-bold mb-1">
                    Revenue Split Rate:
                  </label>
                  <select
                    value={proposalSplit}
                    onChange={(e) => setProposalSplit(e.target.value)}
                    className="w-full bg-zinc-950 px-3.5 py-2.5 rounded-xl border border-zinc-800 text-white font-mono focus:border-amber-400 focus:outline-none cursor-pointer"
                  >
                    <option value="50/50">50 / 50 Equal Split</option>
                    <option value="70/30">70 / 30 Creator Majority</option>
                    <option value="80/20">80 / 20 Producer Master Split</option>
                    <option value="100/0">100% Work-for-Hire Buyout</option>
                  </select>
                </div>
              </div>

              {/* Deliverables */}
              <div className="space-y-1 font-mono text-xs">
                <label className="text-zinc-400 uppercase block font-bold">Scope & Deliverables:</label>
                <input
                  type="text"
                  value={proposalDeliverable}
                  onChange={(e) => setProposalDeliverable(e.target.value)}
                  className="w-full bg-zinc-950 px-3.5 py-2.5 rounded-xl border border-zinc-800 text-white font-mono focus:border-amber-400 focus:outline-none"
                  placeholder="e.g. 1 Co-Produced Master + 3 Multi-Live Co-Broadcasts"
                />
              </div>

              {/* Escrow Guarantee Note */}
              <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-[11px] font-mono text-emerald-300 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Protected by CTC Escrow: Funds remain securely locked until both creators sign release sheets.</span>
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setProposalContact(null)}
                  className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs font-bold text-zinc-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={proposalSubmitted}
                  className="deal-btn-gold px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider shadow-xl flex items-center gap-2 cursor-pointer"
                >
                  {proposalSubmitted ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 animate-spin" />
                      <span>Transmitting Contract...</span>
                    </>
                  ) : (
                    <>
                      <FileSignature className="w-4 h-4" />
                      <span>CTC Lock & Dispatch Proposal</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
