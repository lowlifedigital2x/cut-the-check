import React, { useEffect, useState } from 'react';
import {
  DollarSign,
  Users,
  Radio,
  TrendingUp,
  ArrowUpRight,
  Send,
  Zap,
  Play,
  Share2,
  ExternalLink,
  Award,
  Crown,
  Disc3,
  Rocket,
  Building2,
  Handshake
} from 'lucide-react';
import {
  PlatformConnection,
  MultiStreamState,
  ContentItem,
  LiveChatEvent,
  PlatformId,
  MilestoneAward
} from '../../types';
import { PLATFORM_CONFIGS } from '../../data/mockData';
import { EarningsChart } from './EarningsChart';
import { RecentActivityFeed } from './RecentActivityFeed';
import { PlatformBadge } from '../common/PlatformBadge';
import { OwnerTagline } from '../common/OwnerTagline';
import majorLabelOfficeImg from '../../assets/images/major_label_office.jpg';
import ctcEagleGoldImg from '../../assets/images/ctc_eagle_pendant_gold.jpg';

/** The official CTC lexicon — every phrase expands the initials. */
const CTC_LEXICON = [
  'Cut The Check',
  'Change To Come',
  'Content That Counts',
  'Certify The Content',
  'Climb The Chart',
  'Collect The Cash',
  'Call The Connect',
  'Control The Crowd',
  'Cut The Chat',
  'Come To Collaborate',
  'Come To Collect',
  'Cash The Check'
] as const;

interface OverviewTabProps {
  connections: PlatformConnection[];
  streamState: MultiStreamState;
  onToggleStream: () => void;
  onTogglePlatformStream: (p: PlatformId) => void;
  onNavigateToTab: (tab: string) => void;
  contentItems: ContentItem[];
  chatEvents: LiveChatEvent[];
  currencySymbol: string;
  milestones?: MilestoneAward[];
}

export const OverviewTab: React.FC<OverviewTabProps> = ({
  connections,
  streamState,
  onToggleStream,
  onTogglePlatformStream,
  onNavigateToTab,
  contentItems,
  chatEvents,
  currencySymbol,
  milestones
}) => {
  const totalEarnings = connections.reduce((acc, curr) => acc + curr.monthlyRevenue, 0);
  const totalFollowers = connections.reduce((acc, curr) => acc + curr.followersCount, 0);

  const topPlatform = [...connections].sort((a, b) => b.monthlyRevenue - a.monthlyRevenue)[0];
  const topPlatformCfg = topPlatform ? PLATFORM_CONFIGS[topPlatform.platformId] : undefined;

  // CTC Lexicon Band rotation — one phrase at a time, ~2.5s per phrase
  const [lexiconIndex, setLexiconIndex] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => {
      setLexiconIndex((prev) => (prev + 1) % CTC_LEXICON.length);
    }, 2500);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="space-y-6">
      {/* ==============================================================
          THE CORNER OFFICE — MAJOR LABEL EXECUTIVE DISPLAY HERO
          ============================================================== */}
      <div className="relative rounded-3xl overflow-hidden border-2 border-amber-500/40 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.9)]">
        {/* Background Image of Luxury Major Label Penthouse Corner Office */}
        <div className="absolute inset-0 z-0">
          <img
            src={majorLabelOfficeImg}
            alt="Major Label Executive Corner Office"
            className="w-full h-full object-cover brightness-[0.45]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#06080E] via-[#06080E]/70 to-transparent" />
          <div className="absolute inset-0 bg-radial at-center from-transparent via-[#06080E]/40 to-[#06080E]/80" />
        </div>

        {/* Executive Office Content */}
        <div className="relative z-10 p-6 sm:p-8 lg:p-10 space-y-6">
          {/* Top Bar: Headquarters Nameplate */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-amber-500/20 pb-4">
            <div className="flex items-center gap-2.5">
              <span className="p-2 rounded-xl bg-amber-500/20 border border-amber-400/40 text-amber-300">
                <Building2 className="w-5 h-5" />
              </span>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[10px] font-mono font-black tracking-widest uppercase text-amber-300 bg-amber-950/80 px-2 py-0.5 rounded border border-amber-600/40">
                    CUT THE CHECK WORLDWIDE HEADQUARTERS
                  </span>
                  <span className="text-[10px] font-mono text-zinc-400">
                    54TH FLOOR • EXECUTIVE WING
                  </span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-white tracking-wide uppercase mt-0.5">
                  Welcome to Your Office
                </h2>
              </div>
            </div>

            <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-emerald-300 bg-emerald-950/70 border border-emerald-500/50 px-2.5 py-1.5 rounded-full flex items-center gap-1.5 self-start sm:self-auto shadow-lg backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              {streamState.isBroadcasting ? 'Live From The Desk' : 'Office Open • Ready'}
            </span>
          </div>

          {/* Centerpiece: Headline, Readouts & The Gold Eagle Display */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            <div className="lg:col-span-8 space-y-4">
              {/* Brand Line — Owner's Copy */}
              <div className="text-xs sm:text-sm font-black tracking-[0.25em] uppercase text-amber-300">
                🦅 C.T.C. | CUT THE CHECK
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight drop-shadow-md">
                The Corner <span className="text-gold-gradient">Office</span>
              </h1>

              {/* Headline — Owner's Copy */}
              <p className="text-lg sm:text-xl lg:text-2xl font-black uppercase tracking-tight text-white">
                ONE STREAM. MULTIPLE PLATFORMS. <span className="text-gold-gradient">MORE OPPORTUNITIES.</span>
              </p>

              <p className="text-xs sm:text-sm text-zinc-300 max-w-2xl leading-relaxed">
                Why limit your audience to one platform when you can reach more people at once? C.T.C. is building a creator ecosystem designed to help artists, streamers, influencers, podcasters, and digital entrepreneurs expand their reach through multi-live streaming. Go live across multiple supported platforms from one place, connect with your audience, discover new opportunities, and build your brand without having to manage everything separately.
              </p>

              {/* Live Executive Readouts */}
              <div className="flex flex-wrap items-center gap-2.5 pt-1">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-black/60 border border-amber-500/30 font-mono text-xs backdrop-blur-md">
                  <DollarSign className="w-3.5 h-3.5 text-amber-400" />
                  <span className="text-zinc-400">Earnings</span>
                  <span className="text-amber-200 font-bold">
                    {currencySymbol}{totalEarnings.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>

                <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-black/60 border border-amber-500/30 font-mono text-xs backdrop-blur-md">
                  <Users className="w-3.5 h-3.5 text-amber-400" />
                  <span className="text-zinc-400">Audience</span>
                  <span className="text-amber-200 font-bold">
                    {(totalFollowers / 1000000).toFixed(2)}M
                  </span>
                </div>

                <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-black/60 border border-amber-500/30 font-mono text-xs backdrop-blur-md">
                  <Crown className="w-3.5 h-3.5 text-amber-400" />
                  <span className="text-zinc-400">Top Channel</span>
                  <span className="text-amber-200 font-bold">
                    {topPlatformCfg?.name || '—'}
                  </span>
                </div>
              </div>

              {/* Office Doors */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  onClick={() => onNavigateToTab('launch')}
                  className="deal-btn-gold px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition shadow-md flex items-center gap-1.5"
                >
                  <Rocket className="w-3.5 h-3.5 text-amber-950" />
                  <span>Enter Launch Suite</span>
                </button>

                <button
                  onClick={() => onNavigateToTab('milestone_awards')}
                  className="deal-btn-platinum px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-md"
                >
                  <Award className="w-3.5 h-3.5 text-slate-800" />
                  <span>Plaque Wall</span>
                </button>

                <button
                  onClick={() => onNavigateToTab('sponsorship')}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition flex items-center gap-1.5 shadow-md bg-black/60 border border-amber-500/40 text-amber-200 backdrop-blur-md hover:border-amber-400 hover:text-white"
                >
                  <Handshake className="w-3.5 h-3.5 text-amber-400" />
                  <span>Sponsorship</span>
                </button>
              </div>
            </div>

            {/* Right Column: The Gold Eagle, On Display */}
            <div className="lg:col-span-4">
              <div className="p-2 rounded-2xl bg-black/60 border-2 border-amber-400/60 shadow-2xl backdrop-blur-md max-w-xs mx-auto lg:ml-auto">
                <div className="rounded-xl overflow-hidden border border-amber-500/30">
                  <img
                    src={ctcEagleGoldImg}
                    alt="CTC Eagle with Gold Pendant — On Display"
                    className="w-full h-48 sm:h-56 object-cover"
                  />
                </div>
                <div className="flex items-center justify-between px-1.5 pt-2 pb-1">
                  <span className="engraved-plate-gold text-[9px] uppercase font-black px-2 py-0.5 rounded shadow-sm">
                    On Display
                  </span>
                  <span className="text-[10px] font-mono font-bold tracking-widest uppercase text-amber-200">
                    The CTC Eagle • Gold
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* CTC Lexicon Band — The Official Canon */}
          <div className="border-t border-amber-500/20 pt-4 space-y-2">
            <div className="flex items-baseline justify-center gap-2.5 text-center px-2">
              <span className="text-lg sm:text-xl font-black tracking-widest uppercase text-gold-gradient">
                CTC
              </span>
              <span className="text-amber-500/60 font-mono text-sm">•</span>
              <span
                key={lexiconIndex}
                className="lexicon-phrase-in text-lg sm:text-xl font-black tracking-wide uppercase text-white"
              >
                {CTC_LEXICON[lexiconIndex]}
              </span>
            </div>
            <p className="text-center text-[9px] sm:text-[10px] font-mono uppercase tracking-widest text-zinc-500 leading-relaxed px-2">
              {CTC_LEXICON.join(' • ')}
            </p>
          </div>
        </div>
      </div>

      {/* WHY JOIN C.T.C.? — Owner's Copy */}
      <div className="p-6 rounded-2xl bg-[#111622] border border-zinc-800/90 shadow-xl space-y-5">
        <h3 className="text-lg sm:text-xl font-black text-white uppercase tracking-wider">
          WHY JOIN C.T.C.?
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-1.5">
            <div className="text-sm font-black text-white uppercase tracking-wide">
              📡 MULTI-LIVE STREAMING
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Expand your reach by broadcasting to multiple supported platforms simultaneously.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-1.5">
            <div className="text-sm font-black text-white uppercase tracking-wide">
              💬 CLICK TO CONNECT
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Bring your community closer and build connections with your audience.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-1.5">
            <div className="text-sm font-black text-white uppercase tracking-wide">
              📈 CLIMBING THE CHARTS
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Track your progress, build your presence, and showcase your growth.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-1.5">
            <div className="text-sm font-black text-white uppercase tracking-wide">
              🎬 CONTENT THAT COUNTS
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Bring your videos, music, podcasts, and other creative projects into one ecosystem.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-1.5">
            <div className="text-sm font-black text-white uppercase tracking-wide">
              💰 CUT THE CHECK
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Explore opportunities to monetize your talent, promote your content, and grow your creative business.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-1.5">
            <div className="text-sm font-black text-white uppercase tracking-wide">
              🤝 CREATORS THAT COUNT
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Join a community built around independent talent, collaboration, and opportunity.
            </p>
          </div>
        </div>
      </div>

      {/* Top Multi-Live Master Strip */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-950/40 via-zinc-900/80 to-blue-950/40 border border-purple-500/30 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-3">
          <div className={`p-2.5 rounded-xl ${streamState.isBroadcasting ? 'bg-red-500/20 text-red-400 border border-red-500/40 animate-pulse' : 'bg-purple-500/20 text-purple-400 border border-purple-500/30'}`}>
            <Radio className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-white uppercase tracking-wider">
                Simultaneous Broadcast Engine
              </h2>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${streamState.isBroadcasting ? 'bg-red-500 text-white animate-pulse' : 'bg-zinc-800 text-zinc-400'}`}>
                {streamState.isBroadcasting ? 'ONLINE & RELAYING' : 'READY TO BROADCAST'}
              </span>
            </div>
            <p className="text-xs text-zinc-400 mt-0.5">
              Transmit one single feed to TikTok, YouTube, Kick, and Facebook in pristine 1080p60.
            </p>
          </div>
        </div>

        {/* Platform Switches */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          {(['youtube', 'kick', 'tiktok', 'facebook'] as PlatformId[]).map((pid) => {
            const isSelected = !!streamState.selectedPlatforms[pid];
            const cfg = PLATFORM_CONFIGS[pid];
            return (
              <button
                key={pid}
                onClick={() => onTogglePlatformStream(pid)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition border ${
                  isSelected
                    ? 'bg-zinc-800/90 text-white border-zinc-600 shadow-md'
                    : 'bg-zinc-900/40 text-zinc-500 border-zinc-800/80 hover:border-zinc-700'
                }`}
              >
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: isSelected ? cfg?.color : '#4B5563' }}
                />
                <span>{cfg?.name}</span>
                <span className="text-[10px] font-mono text-zinc-400">
                  {streamState.isBroadcasting && isSelected
                    ? `${((streamState.platformViewers[pid] || 0) / 1000).toFixed(1)}k`
                    : 'Ready'}
                </span>
              </button>
            );
          })}

          <button
            onClick={() => onNavigateToTab('launch')}
            className="deal-btn-gold px-3.5 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition whitespace-nowrap shadow-md flex items-center gap-1.5"
            title="Open Master Drop Day Launch Control Center"
          >
            <Rocket className="w-3.5 h-3.5 text-amber-950" />
            <span>Launch Command</span>
          </button>

          <button
            onClick={() => {
              onNavigateToTab('live');
              onToggleStream();
            }}
            className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition whitespace-nowrap shadow-lg ${
              streamState.isBroadcasting
                ? 'bg-red-600 hover:bg-red-700 text-white shadow-red-900/50'
                : 'bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white shadow-rose-900/40'
            }`}
          >
            {streamState.isBroadcasting ? 'CTC End All Feeds' : 'CTC Go Live'}
          </button>
        </div>
      </div>

      {/* Primary KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Total Earnings */}
        <div
          onClick={() => onNavigateToTab('monetization')}
          className="p-5 rounded-2xl bg-[#111622] border border-zinc-800/90 hover:border-purple-500/40 transition cursor-pointer group shadow-lg"
        >
          <div className="flex items-center justify-between text-zinc-400 mb-3">
            <span className="text-xs font-bold uppercase tracking-wider">Aggregated Earnings</span>
            <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400 group-hover:scale-110 transition">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl lg:text-3xl font-extrabold text-white font-mono">
              {currencySymbol}{totalEarnings.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>
          <div className="flex items-center gap-1.5 mt-2 text-xs text-emerald-400">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span className="font-semibold">+22.4%</span>
            <span className="text-zinc-500">vs last 30 days</span>
          </div>
        </div>

        {/* Metric 2: Total Reach */}
        <div
          onClick={() => onNavigateToTab('analytics')}
          className="p-5 rounded-2xl bg-[#111622] border border-zinc-800/90 hover:border-blue-500/40 transition cursor-pointer group shadow-lg"
        >
          <div className="flex items-center justify-between text-zinc-400 mb-3">
            <span className="text-xs font-bold uppercase tracking-wider">Total Audience Reach</span>
            <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400 group-hover:scale-110 transition">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl lg:text-3xl font-extrabold text-white font-mono">
              {(totalFollowers / 1000000).toFixed(2)}M
            </span>
            <span className="text-xs text-zinc-400">across 6 channels</span>
          </div>
          <div className="flex items-center gap-1.5 mt-2 text-xs text-emerald-400">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span className="font-semibold">+38,400</span>
            <span className="text-zinc-500">new subscribers</span>
          </div>
        </div>

        {/* Metric 3: Live Multistream CCV */}
        <div
          onClick={() => onNavigateToTab('live')}
          className="p-5 rounded-2xl bg-[#111622] border border-zinc-800/90 hover:border-red-500/40 transition cursor-pointer group shadow-lg"
        >
          <div className="flex items-center justify-between text-zinc-400 mb-3">
            <span className="text-xs font-bold uppercase tracking-wider">Live CCV Capacity</span>
            <div className={`p-2 rounded-xl ${streamState.isBroadcasting ? 'bg-red-500/20 text-red-400 animate-pulse' : 'bg-red-500/10 text-red-400'} group-hover:scale-110 transition`}>
              <Radio className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl lg:text-3xl font-extrabold text-white font-mono">
              {streamState.isBroadcasting ? streamState.totalLiveViewers.toLocaleString() : '18,450'}
            </span>
            <span className="text-xs text-zinc-400">concurrent</span>
          </div>
          <div className="flex items-center gap-1.5 mt-2 text-xs text-zinc-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>4 RTMP targets synchronized</span>
          </div>
        </div>

        {/* Metric 4: Blended RPM & Top Channel */}
        <div
          onClick={() => onNavigateToTab('monetization')}
          className="p-5 rounded-2xl bg-[#111622] border border-zinc-800/90 hover:border-lime-500/40 transition cursor-pointer group shadow-lg"
        >
          <div className="flex items-center justify-between text-zinc-400 mb-3">
            <span className="text-xs font-bold uppercase tracking-wider">Top Revenue Driver</span>
            <div className="p-2 rounded-xl bg-lime-500/10 text-lime-400 group-hover:scale-110 transition">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <PlatformBadge platformId={topPlatform?.platformId || 'youtube'} size="md" />
            <span className="text-lg font-bold text-white font-mono">
              {currencySymbol}{topPlatform?.monthlyRevenue.toLocaleString()}
            </span>
          </div>
          <div className="flex items-center gap-1.5 mt-2 text-xs text-zinc-400">
            <span className="text-purple-400 font-bold">$6.45 Blended RPM</span>
            <span className="text-zinc-500">across formats</span>
          </div>
        </div>
      </div>

      {/* Platform Earnings Breakdown Tiles */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {connections.map((c) => {
          const cfg = PLATFORM_CONFIGS[c.platformId];
          return (
            <div
              key={c.platformId}
              onClick={() => onNavigateToTab('monetization')}
              className="p-3.5 rounded-xl bg-[#111622]/90 border border-zinc-800/80 hover:border-zinc-700 transition cursor-pointer group flex flex-col justify-between"
            >
              <div className="flex items-center justify-between mb-2">
                <PlatformBadge platformId={c.platformId} size="sm" showLabel={false} />
                <span className="text-[10px] text-zinc-500 font-medium">{cfg?.category}</span>
              </div>
              <div className="font-bold text-sm text-white font-mono">
                {currencySymbol}{c.monthlyRevenue.toLocaleString()}
              </div>
              <div className="text-[11px] text-zinc-400 mt-1 flex items-center justify-between">
                <span>{(c.followersCount / 1000).toFixed(0)}k reach</span>
                <span className="text-emerald-400 font-semibold">+14%</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts & Live Feed Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <EarningsChart currencySymbol={currencySymbol} />
        </div>
        <div className="lg:col-span-1">
          <RecentActivityFeed events={chatEvents} />
        </div>
      </div>

      {/* Official Milestone Awards Plaque Showcase */}
      <div className="plaque-platinum p-6 relative overflow-hidden">
        <div className="absolute -right-16 -top-16 w-56 h-56 rounded-full grooved-record-disc opacity-20 pointer-events-none" />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5 relative z-10">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/40">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-black text-white uppercase tracking-wider">
                  Certified Milestone Awards & Profile Trophy Showcase
                </h3>
                <span className="engraved-plate-gold text-[9px] uppercase font-black px-2 py-0.5 rounded shadow-sm">
                  RIAA / BILLBOARD SPEC
                </span>
              </div>
              <p className="text-xs text-slate-300/80 mt-0.5">
                Official Gold, Platinum, and Diamond plaques awarded for verified streaming plays, subscribers, and escrow checks.
              </p>
            </div>
          </div>

          <button
            onClick={() => onNavigateToTab('milestone_awards')}
            className="deal-btn-gold px-4 py-2 rounded-xl text-xs font-black flex items-center gap-1.5 shadow-md self-start sm:self-auto"
          >
            <span>Enter Plaque Vault & Profile Wall →</span>
          </button>
        </div>

        {/* Mini Preview of Mounted Plaques */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 relative z-10">
          {(milestones?.filter(m => m.unlocked && m.isDisplayedOnProfile) || []).slice(0, 4).map((plaque) => (
            <div
              key={plaque.id}
              onClick={() => onNavigateToTab('milestone_awards')}
              className={`${
                plaque.tier === 'diamond'
                  ? 'plaque-diamond'
                  : plaque.tier === 'platinum'
                  ? 'plaque-platinum'
                  : 'plaque-gold'
              } p-4 rounded-xl cursor-pointer hover:-translate-y-1 transition duration-200 flex flex-col justify-between`}
            >
              <div className="flex items-center justify-between text-[9px] font-mono font-bold uppercase mb-2">
                <span className={plaque.tier === 'diamond' ? 'text-sky-300' : plaque.tier === 'platinum' ? 'text-slate-200' : 'text-amber-300'}>
                  {plaque.tier} CERTIFIED
                </span>
                <span className="text-emerald-400">● On Profile</span>
              </div>

              <div className="text-center my-2">
                <div className="w-16 h-16 rounded-full grooved-record-disc mx-auto flex items-center justify-center border-2 border-amber-400/60 shadow-md">
                  <Disc3 className="w-8 h-8 text-amber-300 animate-spin-slow" />
                </div>
              </div>

              <div className="mt-2 text-center">
                <h5 className="text-xs font-black text-white truncate">{plaque.title}</h5>
                <p className="text-[10px] text-zinc-400 font-mono mt-0.5">{plaque.certificationId}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Top Cross-Distributed Content Leaderboard Plaque */}
      <div className="plaque-gold p-6 relative overflow-hidden">
        <div className="absolute -right-12 -top-12 w-44 h-44 rounded-full grooved-record-disc opacity-20 pointer-events-none" />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 relative z-10">
          <div>
            <OwnerTagline label="MEDIA" phrase="Content That Counts" className="mb-2" />
            <div className="flex items-center gap-2">
              <h3 className="text-base font-black text-white">
                Synchronized Catalog & Master Recording Ledger
              </h3>
              <span className="engraved-plate-gold text-[9px] font-black px-2 py-0.5 rounded shadow-sm">
                47 PLATFORMS CERTIFIED
              </span>
            </div>
            <p className="text-xs text-amber-200/70 mt-0.5">
              Multi-channel streaming royalties and telemetry from Spotify, Apple Music, YouTube, Kick, TikTok, and Facebook.
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* 1-Click Add All Music Streaming Platforms Shortcut */}
            <button
              onClick={() => onNavigateToTab('create_the_content')}
              className="deal-btn-gold flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-black shadow-md transition"
              title="1-Click: Open publisher with Spotify, Apple Music, Amazon Music, SoundCloud, YouTube, TikTok"
            >
              <span>🎵 1-Click Music Release</span>
            </button>

            {/* 1-Click Publish to All Channels Shortcut */}
            <button
              onClick={() => onNavigateToTab('create_the_content')}
              className="deal-btn-platinum flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold shadow-md transition"
              title="1-Click: Distribute to all 47 platforms"
            >
              <Send className="w-3.5 h-3.5 text-slate-800" />
              <span>Publish All Channels</span>
            </button>
          </div>
        </div>

        <div className="divide-y divide-zinc-800/80">
          {contentItems.map((item) => (
            <div key={item.id} className="py-4 flex flex-col md:flex-row md:items-center justify-between gap-4 group">
              <div className="flex items-start gap-3.5">
                <div className="relative w-20 h-14 rounded-lg overflow-hidden shrink-0 border border-zinc-700 bg-zinc-800">
                  <img
                    src={item.thumbnailUrl}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition"
                  />
                  <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                    <Play className="w-4 h-4 text-white fill-white/80" />
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white group-hover:text-purple-300 transition line-clamp-1">
                    {item.title}
                  </h4>
                  <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                    <span className="text-xs text-zinc-400 font-mono">
                      {item.publishedAt}
                    </span>
                    <span className="text-zinc-600">•</span>
                    <div className="flex items-center gap-1">
                      {item.platforms.map((p) => (
                        <PlatformBadge key={p} platformId={p} size="sm" showLabel={false} />
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-6 justify-between md:justify-end shrink-0 pl-4 md:pl-0 border-t md:border-t-0 border-zinc-800 pt-2 md:pt-0">
                <div className="text-right">
                  <span className="text-[10px] uppercase font-bold text-zinc-500 block">Total Views/Streams</span>
                  <span className="text-sm font-bold text-white font-mono">
                    {item.totalViews.toLocaleString()}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] uppercase font-bold text-zinc-500 block">Blended RPM</span>
                  <span className="text-sm font-bold text-purple-400 font-mono">
                    ${item.rpm.toFixed(2)}
                  </span>
                </div>
                <div className="text-right min-w-[90px]">
                  <span className="text-[10px] uppercase font-bold text-zinc-500 block">Gross Revenue</span>
                  <span className="text-sm font-extrabold text-emerald-400 font-mono">
                    {currencySymbol}{item.totalEarnings.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Closing Block — Owner's Copy */}
      <div className="p-8 rounded-3xl border-2 border-amber-500/40 bg-gradient-to-b from-[#111622] to-[#06080E] shadow-xl text-center space-y-3">
        <h3 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight">
          YOUR CONTENT. YOUR AUDIENCE. <span className="text-gold-gradient">YOUR NEXT MOVE.</span>
        </h3>
        <p className="text-xs sm:text-sm text-zinc-300">
          Stop thinking about just one platform. Start thinking about your entire audience.
        </p>
        <p className="text-xs sm:text-sm font-black tracking-[0.25em] uppercase text-amber-300 pt-1">
          C.T.C. | CUT THE CHECK
        </p>
        <p className="text-xs sm:text-sm font-bold uppercase tracking-widest text-zinc-200">
          Create. Connect. Distribute. Grow. Earn.
        </p>
        <p className="text-base sm:text-lg font-black uppercase tracking-widest text-gold-gradient pt-1">
          JOIN THE MOVEMENT.
        </p>
        <p className="text-xs text-zinc-400">
          One platform. Multiple opportunities. More ways to grow.
        </p>
      </div>
    </div>
  );
};
