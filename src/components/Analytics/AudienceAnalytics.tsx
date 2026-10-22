import React, { useState } from 'react';
import {
  TrendingUp,
  Users,
  Eye,
  Clock,
  Globe,
  Smartphone,
  Calendar,
  Sparkles,
  ArrowUpRight,
  Filter,
  BarChart3,
  Layers,
  Music,
  Video,
  Radio,
  Mic,
  FileText,
  Percent,
  Download,
  Share2
} from 'lucide-react';
import { AudienceMetric, PlatformId } from '../../types';
import { PLATFORM_CONFIGS, INITIAL_AUDIENCE_METRICS } from '../../data/mockData';
import { PlatformBadge } from '../common/PlatformBadge';
import { OwnerTagline } from '../common/OwnerTagline';

interface AudienceAnalyticsProps {
  metrics?: AudienceMetric[];
}

export const AudienceAnalytics: React.FC<AudienceAnalyticsProps> = ({
  metrics = INITIAL_AUDIENCE_METRICS
}) => {
  const [timeRange, setTimeRange] = useState<'daily' | 'weekly' | 'monthly' | 'all'>('monthly');
  const [selectedPlatformFilter, setSelectedPlatformFilter] = useState<PlatformId | 'all'>('all');
  const [selectedFormatFilter, setSelectedFormatFilter] = useState<'all' | 'audio' | 'video' | 'live' | 'podcast' | 'post'>('all');

  // Scaling factor based on selected time window
  const multiplier = {
    daily: 0.035,
    weekly: 0.22,
    monthly: 1.0,
    all: 4.8
  }[timeRange];

  const timeRangeLabels = {
    daily: 'Daily (Last 24 Hours)',
    weekly: 'Weekly (Last 7 Days)',
    monthly: 'Monthly (Last 30 Days)',
    all: 'All-Time (Lifetime)'
  };

  const totalFollowers = metrics.reduce((acc, m) => acc + m.followers, 0);
  const netFollowersGained = Math.round(44200 * multiplier);
  const totalViewsStreams = Math.round(4120000 * multiplier);
  const blendedEngagement = (
    metrics.reduce((acc, m) => acc + m.engagementRate, 0) / metrics.length
  ).toFixed(1);
  const avgWatchMinutes = (
    metrics.reduce((acc, m) => acc + m.avgWatchTimeMinutes, 0) / metrics.length
  ).toFixed(1);

  const filteredMetrics = metrics.filter((m) => {
    if (selectedPlatformFilter === 'all') return true;
    return m.platformId === selectedPlatformFilter;
  });

  // Content Performance Summaries across 5 Formats (Audio, Video, Live, Podcast, Post)
  const formatPerformances = [
    {
      format: 'video',
      label: 'Video (Shorts & Longform)',
      icon: Video,
      color: '#3B82F6',
      platforms: ['youtube', 'tiktok', 'facebook'] as PlatformId[],
      impressions: Math.round(2450000 * multiplier),
      avgWatch: '4.8 min',
      retention: '68%',
      rpm: '$4.20',
      engagement: '7.8%',
      topPerformer: 'Building a 7-Figure Digital Studio (489k views)'
    },
    {
      format: 'live',
      label: 'Live Broadcasts (Multistream)',
      icon: Radio,
      color: '#EF4444',
      platforms: ['kick', 'youtube', 'tiktok', 'facebook'] as PlatformId[],
      impressions: Math.round(680000 * multiplier),
      avgWatch: '34.2 min',
      retention: '84%',
      rpm: '$14.20',
      engagement: '14.2%',
      topPerformer: 'Late Night Production Jam #48 (18.4k Peak CCV)'
    },
    {
      format: 'audio',
      label: 'Audio & Music Releases',
      icon: Music,
      color: '#10B981',
      platforms: ['spotify', 'applemusic', 'tiktok'] as PlatformId[],
      impressions: Math.round(520000 * multiplier),
      avgWatch: '3.4 min',
      retention: '92%',
      rpm: '$6.80',
      engagement: '10.5%',
      topPerformer: 'Neon Skyline (Studio Spatial Master) - 384k streams'
    },
    {
      format: 'podcast',
      label: 'Video & Audio Podcasts',
      icon: Mic,
      color: '#8B5CF6',
      platforms: ['spotify', 'youtube', 'applemusic'] as PlatformId[],
      impressions: Math.round(310000 * multiplier),
      avgWatch: '28.6 min',
      retention: '76%',
      rpm: '$8.50',
      engagement: '11.8%',
      topPerformer: 'Episode 52: Monetizing Music & Creator Funnels'
    },
    {
      format: 'post',
      label: 'Community & Carousel Posts',
      icon: FileText,
      color: '#F59E0B',
      platforms: ['facebook', 'youtube', 'tiktok'] as PlatformId[],
      impressions: Math.round(160000 * multiplier),
      avgWatch: '0.4 min',
      retention: '54%',
      rpm: '$1.80',
      engagement: '5.2%',
      topPerformer: 'Gear Checklist & Preset Pack Announcement'
    }
  ];

  const filteredFormats = formatPerformances.filter((f) => {
    if (selectedFormatFilter === 'all') return true;
    return f.format === selectedFormatFilter;
  });

  return (
    <div className="space-y-6">
      {/* Top Header & Range Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <OwnerTagline label="CHARTS" phrase="Climbing the Charts" className="mb-2" />
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
              <TrendingUp className="w-6 h-6 text-emerald-400" />
              <span>Unified Cross-Platform Audience Analytics</span>
            </h2>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono">
              6 PLATFORMS SYNCHRONIZED
            </span>
          </div>
          <p className="text-xs text-zinc-400 mt-1">
            Real-time subscriber velocity, engagement depth, and content performance telemetry from TikTok, Spotify, YouTube, Kick, Apple Music, and Facebook.
          </p>
        </div>

        {/* Time Period Selector */}
        <div className="flex items-center gap-1.5 bg-[#111622] p-1.5 rounded-xl border border-zinc-800 self-start sm:self-auto shadow-md">
          {(['daily', 'weekly', 'monthly', 'all'] as const).map((period) => (
            <button
              key={period}
              onClick={() => setTimeRange(period)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition capitalize ${
                timeRange === period
                  ? 'bg-zinc-800 text-white shadow-md border border-zinc-700'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              {period === 'daily'
                ? 'Daily'
                : period === 'weekly'
                ? 'Weekly'
                : period === 'monthly'
                ? 'Monthly'
                : 'All-Time'}
            </button>
          ))}
        </div>
      </div>

      {/* Primary KPI Metrics — Certified Plaque Awards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Gold Plaque - Total Audience */}
        <div className="plaque-gold p-5 relative overflow-hidden">
          <div className="absolute -right-6 -bottom-6 w-20 h-20 rounded-full grooved-record-disc opacity-25 pointer-events-none" />
          <div className="flex items-center justify-between text-amber-200/80 mb-2 relative z-10">
            <span className="text-[10px] font-black uppercase tracking-wider">Gold Certified Audience</span>
            <span className="engraved-plate-gold text-[9px] font-black px-1.5 py-0.5 rounded uppercase">RIAA GOLD</span>
          </div>
          <div className="text-3xl font-black text-gold-gradient font-mono relative z-10">
            {(totalFollowers / 1000000).toFixed(2)}M
          </div>
          <div className="flex items-center gap-1.5 mt-2 text-xs text-amber-300 relative z-10">
            <ArrowUpRight className="w-3.5 h-3.5 text-amber-400" />
            <span className="font-bold">+{netFollowersGained.toLocaleString()}</span>
            <span className="text-zinc-400">{timeRangeLabels[timeRange]}</span>
          </div>
        </div>

        {/* Metric 2: Platinum Plaque - Combined Views & Streams */}
        <div className="plaque-platinum p-5 relative overflow-hidden">
          <div className="absolute -right-6 -bottom-6 w-20 h-20 rounded-full grooved-record-disc opacity-25 pointer-events-none" />
          <div className="flex items-center justify-between text-slate-300 mb-2 relative z-10">
            <span className="text-[10px] font-black uppercase tracking-wider">Platinum Stream Volume</span>
            <span className="engraved-plate-platinum text-[9px] font-black px-1.5 py-0.5 rounded uppercase">PLATINUM</span>
          </div>
          <div className="text-3xl font-black text-platinum-gradient font-mono relative z-10">
            {(totalViewsStreams / 1000000).toFixed(2)}M
          </div>
          <div className="flex items-center gap-1.5 mt-2 text-xs text-slate-300 relative z-10">
            <ArrowUpRight className="w-3.5 h-3.5 text-sky-400" />
            <span className="font-bold">+19.4%</span>
            <span className="text-zinc-400">cross-channel velocity</span>
          </div>
        </div>

        {/* Metric 3: Diamond Plaque - Blended Engagement */}
        <div className="plaque-diamond p-5 relative overflow-hidden">
          <div className="absolute -right-6 -bottom-6 w-20 h-20 rounded-full grooved-record-disc opacity-25 pointer-events-none" />
          <div className="flex items-center justify-between text-sky-200 mb-2 relative z-10">
            <span className="text-[10px] font-black uppercase tracking-wider">Multi-Diamond Engagement</span>
            <span className="bg-sky-400 text-slate-950 text-[9px] font-black px-1.5 py-0.5 rounded uppercase border border-white">DIAMOND</span>
          </div>
          <div className="text-3xl font-black text-diamond-gradient font-mono relative z-10">
            {blendedEngagement}%
          </div>
          <div className="flex items-center gap-1.5 mt-2 text-xs text-sky-200 relative z-10">
            <span className="text-cyan-300 font-bold font-mono">Kick: 14.8%</span>
            <span className="text-zinc-400">• Spotify: 11.2%</span>
          </div>
        </div>

        {/* Metric 4: Studio Master Plaque - Avg Session Retention */}
        <div className="plaque-gold p-5 relative overflow-hidden">
          <div className="absolute -right-6 -bottom-6 w-20 h-20 rounded-full grooved-record-disc opacity-25 pointer-events-none" />
          <div className="flex items-center justify-between text-amber-200/80 mb-2 relative z-10">
            <span className="text-[10px] font-black uppercase tracking-wider">Studio Master Retention</span>
            <span className="engraved-plate-gold text-[9px] font-black px-1.5 py-0.5 rounded uppercase">MASTER</span>
          </div>
          <div className="text-3xl font-black text-amber-300 font-mono relative z-10">
            {avgWatchMinutes} min
          </div>
          <div className="flex items-center gap-1.5 mt-2 text-xs text-zinc-300 relative z-10">
            <span className="text-amber-400 font-bold">Kick Live: 44.2m</span>
            <span className="text-zinc-500">• Spotify: 26.5m</span>
          </div>
        </div>
      </div>

      {/* Connected Platforms Breakdown Table */}
      <div className="bg-[#111622] rounded-2xl border border-zinc-800 p-5 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <span>Platform Intelligence Matrix</span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-300">
                {timeRangeLabels[timeRange]}
              </span>
            </h3>
            <p className="text-xs text-zinc-400 mt-0.5">
              Audience size, net velocity, engagement score, and primary demographic per platform
            </p>
          </div>

          {/* Platform Filter */}
          <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            <button
              onClick={() => setSelectedPlatformFilter('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                selectedPlatformFilter === 'all'
                  ? 'bg-zinc-800 text-white border border-zinc-700'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              All Platforms ({Object.keys(PLATFORM_CONFIGS).length})
            </button>
            {(Object.keys(PLATFORM_CONFIGS) as PlatformId[]).map(
              (p) => (
                <button
                  key={p}
                  onClick={() => setSelectedPlatformFilter(p)}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold transition flex items-center gap-1 ${
                    selectedPlatformFilter === p
                      ? 'bg-zinc-800 text-white border border-zinc-700'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  <PlatformBadge platformId={p} size="sm" showLabel={false} />
                  <span>{PLATFORM_CONFIGS[p]?.name}</span>
                </button>
              )
            )}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-zinc-800/80 text-[10px] uppercase font-bold text-zinc-400 tracking-wider">
                <th className="py-3 px-3">Platform</th>
                <th className="py-3 px-3">Subscribers / Listeners</th>
                <th className="py-3 px-3">Net Growth ({timeRange})</th>
                <th className="py-3 px-3">Engagement Rate</th>
                <th className="py-3 px-3">Avg Session Time</th>
                <th className="py-3 px-3">Core Demographic</th>
                <th className="py-3 px-3">Top Region</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60">
              {filteredMetrics.map((m) => {
                const cfg = PLATFORM_CONFIGS[m.platformId];
                const dynamicGrowth = Math.round(m.followers * 0.05 * multiplier);

                return (
                  <tr key={m.platformId} className="hover:bg-zinc-900/50 transition">
                    <td className="py-3.5 px-3">
                      <PlatformBadge platformId={m.platformId} size="md" />
                    </td>
                    <td className="py-3.5 px-3 font-mono font-bold text-white">
                      {m.followers.toLocaleString()}
                    </td>
                    <td className="py-3.5 px-3">
                      <span className="text-emerald-400 font-bold font-mono">
                        +{dynamicGrowth.toLocaleString()} (+{m.followersGrowth}%)
                      </span>
                    </td>
                    <td className="py-3.5 px-3">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-1.5 rounded-full bg-zinc-800 overflow-hidden">
                          <div
                            className="h-full rounded-full"
                            style={{
                              width: `${Math.min(m.engagementRate * 5, 100)}%`,
                              backgroundColor: cfg?.color || '#A855F7'
                            }}
                          />
                        </div>
                        <span className="font-mono text-white font-semibold">
                          {m.engagementRate}%
                        </span>
                      </div>
                    </td>
                    <td className="py-3.5 px-3 font-mono text-zinc-300">
                      {m.avgWatchTimeMinutes} min
                    </td>
                    <td className="py-3.5 px-3 text-zinc-300 font-medium">{m.topAudienceAge}</td>
                    <td className="py-3.5 px-3 text-zinc-300 font-medium">{m.topCountry}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Content Performance Summaries Across 5 Modalities: Audio, Video, Live, Podcast, Post */}
      <div className="bg-[#111622] rounded-2xl border border-zinc-800 p-5 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-purple-400" />
              <span>Content Performance Summaries (5 Formats)</span>
            </h3>
            <p className="text-xs text-zinc-400 mt-0.5">
              Breakdown across Audio, Video, Live Multistreams, Podcasts, and Community Posts
            </p>
          </div>

          {/* Format Filter */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            {[
              { id: 'all', label: 'All 5 Formats' },
              { id: 'video', label: '📹 Video' },
              { id: 'live', label: '🔴 Live' },
              { id: 'audio', label: '🎵 Audio' },
              { id: 'podcast', label: '🎙️ Podcast' },
              { id: 'post', label: '📝 Post' }
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setSelectedFormatFilter(f.id as any)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                  selectedFormatFilter === f.id
                    ? 'bg-zinc-800 text-white border border-zinc-700 shadow-sm'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredFormats.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.format}
                className="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800/90 hover:border-zinc-700 transition space-y-3 shadow-lg flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div
                        className="p-2 rounded-xl"
                        style={{ backgroundColor: `${item.color}20`, color: item.color }}
                      >
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className="text-sm font-bold text-white">{item.label}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 mb-3">
                    <span className="text-[10px] text-zinc-500">Channels:</span>
                    {item.platforms.map((p) => (
                      <PlatformBadge key={p} platformId={p} size="sm" showLabel={false} />
                    ))}
                  </div>

                  {/* Core Metrics Grid */}
                  <div className="grid grid-cols-2 gap-2 text-xs font-mono bg-zinc-950/80 p-3 rounded-xl border border-zinc-800">
                    <div>
                      <span className="text-[10px] uppercase text-zinc-500 block">Impressions</span>
                      <span className="font-bold text-white">{item.impressions.toLocaleString()}</span>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase text-zinc-500 block">Avg Retention</span>
                      <span className="font-bold text-emerald-400">{item.retention}</span>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase text-zinc-500 block">Avg Session</span>
                      <span className="font-bold text-zinc-300">{item.avgWatch}</span>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase text-zinc-500 block">Avg RPM</span>
                      <span className="font-bold text-purple-400">{item.rpm}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-zinc-800 text-[11px]">
                  <span className="text-zinc-500 block mb-0.5">Top Performing Release:</span>
                  <span className="font-semibold text-zinc-200 line-clamp-1">{item.topPerformer}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Demographics & Geographic Deep Dive */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Age Demographics */}
        <div className="bg-[#111622] rounded-2xl border border-zinc-800 p-5 shadow-xl">
          <h4 className="text-sm font-bold text-white mb-1 flex items-center gap-2">
            <Users className="w-4 h-4 text-purple-400" />
            <span>Age Distribution (Blended 6 Channels)</span>
          </h4>
          <p className="text-xs text-zinc-400 mb-4">Core demographic: 18 - 34 years old (78%)</p>

          <div className="space-y-3">
            {[
              { label: '18 - 24', percent: 46, color: '#A855F7' },
              { label: '25 - 34', percent: 32, color: '#3B82F6' },
              { label: '35 - 44', percent: 14, color: '#10B981' },
              { label: '45+', percent: 8, color: '#F59E0B' }
            ].map((age) => (
              <div key={age.label}>
                <div className="flex items-center justify-between text-xs mb-1 font-semibold">
                  <span className="text-zinc-300">{age.label}</span>
                  <span className="text-white font-mono">{age.percent}%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-zinc-900 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${age.percent}%`, backgroundColor: age.color }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Geographic Top Regions */}
        <div className="bg-[#111622] rounded-2xl border border-zinc-800 p-5 shadow-xl">
          <h4 className="text-sm font-bold text-white mb-1 flex items-center gap-2">
            <Globe className="w-4 h-4 text-blue-400" />
            <span>Top Geographic Territories</span>
          </h4>
          <p className="text-xs text-zinc-400 mb-4">High purchasing power / Tier-1 RPM regions</p>

          <div className="space-y-2.5">
            {[
              { country: 'United States', share: '44%', flag: '🇺🇸', rpm: '$8.20' },
              { country: 'United Kingdom', share: '18%', flag: '🇬🇧', rpm: '$6.90' },
              { country: 'Canada', share: '12%', flag: '🇨🇦', rpm: '$7.40' },
              { country: 'Germany', share: '9%', flag: '🇩🇪', rpm: '$6.10' },
              { country: 'Global / Other', share: '17%', flag: '🌎', rpm: '$2.80' }
            ].map((c) => (
              <div
                key={c.country}
                className="flex items-center justify-between p-2 rounded-xl bg-zinc-900/60 border border-zinc-800/80 text-xs"
              >
                <div className="flex items-center gap-2">
                  <span className="text-base">{c.flag}</span>
                  <span className="font-semibold text-white">{c.country}</span>
                </div>
                <div className="flex items-center gap-3 font-mono">
                  <span className="text-zinc-400">{c.share}</span>
                  <span className="text-emerald-400 font-bold">{c.rpm} RPM</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Device & Ingest Breakdown */}
        <div className="bg-[#111622] rounded-2xl border border-zinc-800 p-5 shadow-xl">
          <h4 className="text-sm font-bold text-white mb-1 flex items-center gap-2">
            <Smartphone className="w-4 h-4 text-emerald-400" />
            <span>Device Ingest Breakdown</span>
          </h4>
          <p className="text-xs text-zinc-400 mb-4">Viewing behavior across screen form factors</p>

          <div className="space-y-3">
            <div className="p-3 rounded-xl bg-zinc-900/80 border border-zinc-800 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-white block">Mobile (TikTok / Reels)</span>
                <span className="text-[10px] text-zinc-400">Vertical short-form & mobile live</span>
              </div>
              <span className="text-sm font-black text-cyan-400 font-mono">68%</span>
            </div>

            <div className="p-3 rounded-xl bg-zinc-900/80 border border-zinc-800 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-white block">Desktop (Kick / YouTube)</span>
                <span className="text-[10px] text-zinc-400">High CCV & live chat participation</span>
              </div>
              <span className="text-sm font-black text-lime-400 font-mono">24%</span>
            </div>

            <div className="p-3 rounded-xl bg-zinc-900/80 border border-zinc-800 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-white block">Headphones & Car Audio</span>
                <span className="text-[10px] text-zinc-400">Spotify & Apple Music streams</span>
              </div>
              <span className="text-sm font-black text-purple-400 font-mono">8%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
