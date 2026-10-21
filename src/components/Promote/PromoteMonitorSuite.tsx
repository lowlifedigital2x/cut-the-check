import React, { useState } from 'react';
import {
  Rocket,
  Activity,
  Megaphone,
  Radio,
  Music,
  Video,
  FileText,
  Mic,
  Share2,
  CheckCircle2,
  TrendingUp,
  DollarSign,
  ShieldCheck,
  Zap,
  Globe,
  ExternalLink,
  Copy,
  Check,
  Eye,
  BarChart2,
  Clock,
  Sparkles,
  Volume2
} from 'lucide-react';
import { PlatformId } from '../../types';
import { PLATFORM_CONFIGS } from '../../data/mockData';
import { PlatformBadge } from '../common/PlatformBadge';

interface PromoteMonitorSuiteProps {
  currencySymbol?: string;
}

export const PromoteMonitorSuite: React.FC<PromoteMonitorSuiteProps> = ({
  currencySymbol = '$'
}) => {
  const [suiteMode, setSuiteMode] = useState<'promote' | 'monitor'>('promote');
  const [selectedMediaType, setSelectedMediaType] = useState<'music' | 'video' | 'live' | 'all'>('music');
  const [copiedLink, setCopiedLink] = useState(false);

  // Promotion Campaign State
  const [campaignTitle, setCampaignTitle] = useState('Neon Skyline (Spatial Audio Master Release)');
  const [campaignBudget, setCampaignBudget] = useState('150');
  const [smartLinkCopied, setSmartLinkCopied] = useState(false);
  const [campaignLaunched, setCampaignLaunched] = useState(false);

  // Monitor Live Telemetry simulation
  const [selectedMonitorMetric, setSelectedMonitorMetric] = useState<'live_stream' | 'music_audio' | 'video_vod'>('music_audio');

  const copySmartLink = () => {
    navigator.clipboard?.writeText('https://ctc.link/alexrivers-neonskyline');
    setSmartLinkCopied(true);
    setTimeout(() => setSmartLinkCopied(false), 2000);
  };

  const handleLaunchCampaign = (e: React.FormEvent) => {
    e.preventDefault();
    setCampaignLaunched(true);
    setTimeout(() => setCampaignLaunched(false), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-purple-950/50 via-zinc-900 to-emerald-950/40 border border-purple-500/30 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-2xl">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 font-mono">
              PUBLISH • PROMOTE • MONITOR
            </span>
            <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Real-Time Telemetry Active
            </span>
          </div>

          <h2 className="text-2xl font-black text-white tracking-tight">
            Universal Content Lifecycle Control: Music, Videos & Live Streams
          </h2>
          <p className="text-xs text-zinc-300 max-w-2xl leading-relaxed">
            Amplify your reach with multi-platform Pre-Save campaigns, smart landing pages, and boost ads, while monitoring live bitrate telemetry, streaming discovery velocity, and Content ID health.
          </p>
        </div>

        {/* Master Mode Switcher: PROMOTE vs MONITOR */}
        <div className="flex items-center gap-2 bg-zinc-900/90 p-1.5 rounded-2xl border border-zinc-800 shrink-0">
          <button
            onClick={() => setSuiteMode('promote')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
              suiteMode === 'promote'
                ? 'bg-purple-600 text-white shadow-md'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Megaphone className="w-4 h-4" />
            <span>Promote & Amplify</span>
          </button>

          <button
            onClick={() => setSuiteMode('monitor')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
              suiteMode === 'monitor'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Activity className="w-4 h-4" />
            <span>Live Monitor & Telemetry</span>
          </button>
        </div>
      </div>

      {/* Media Type Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {[
          { id: 'all', label: 'All Content Types', icon: Share2 },
          { id: 'music', label: '🎵 Music & Audio Releases', icon: Music },
          { id: 'video', label: '📹 Videos & Shorts', icon: Video },
          { id: 'live', label: '🔴 Live Multistreams', icon: Radio }
        ].map((type) => {
          const Icon = type.icon;
          const isSelected = selectedMediaType === type.id;
          return (
            <button
              key={type.id}
              onClick={() => setSelectedMediaType(type.id as any)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition border ${
                isSelected
                  ? 'bg-zinc-800 text-white border-zinc-600 shadow-md'
                  : 'bg-[#111622] text-zinc-400 border-zinc-800 hover:text-white'
              }`}
            >
              <Icon className="w-3.5 h-3.5 text-purple-400" />
              <span>{type.label}</span>
            </button>
          );
        })}
      </div>

      {/* ===================== PROMOTE ENGINE ===================== */}
      {suiteMode === 'promote' && (
        <div className="space-y-6">
          {/* Smart Link / Pre-Save Campaign Generator */}
          <div className="bg-[#111622] rounded-2xl border border-zinc-800 p-6 shadow-xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-purple-400 font-mono block">
                  CAMPAIGN TOOLKIT 1: MULTI-PLATFORM SMART LINK
                </span>
                <h3 className="text-base font-bold text-white mt-0.5">
                  Universal Pre-Save & Smart Release Landing Page
                </h3>
                <p className="text-xs text-zinc-400">
                  Direct fans to a single high-conversion link that opens Spotify, Apple Music, YouTube, Amazon Music, or SoundCloud with 1 tap.
                </p>
              </div>

              {/* Generated Share Link Box */}
              <div className="flex items-center gap-2 bg-zinc-950 p-2.5 rounded-xl border border-zinc-800 font-mono text-xs text-purple-300">
                <Globe className="w-4 h-4 text-purple-400 shrink-0" />
                <span className="truncate max-w-[220px]">ctc.link/alexrivers-neonskyline</span>
                <button
                  onClick={copySmartLink}
                  className="px-2.5 py-1 rounded bg-purple-600 hover:bg-purple-500 text-white text-[11px] font-bold flex items-center gap-1 transition"
                >
                  {smartLinkCopied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                  <span>{smartLinkCopied ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
            </div>

            {/* Smart Landing Page Preview Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
              {/* Cover & Audio Visualizer Mock */}
              <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 space-y-3">
                <div className="aspect-square rounded-xl overflow-hidden border border-zinc-800 relative group">
                  <img
                    src="https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=500&auto=format&fit=crop&q=80"
                    alt="Album Cover"
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-3">
                    <div>
                      <span className="text-xs font-black text-white block">Neon Skyline (Spatial Mix)</span>
                      <span className="text-[10px] text-zinc-300">Alex Rivers • Studio Master</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-zinc-400 font-mono">
                  <span>Pre-Saves: 3,420 fans</span>
                  <span className="text-emerald-400 font-bold">+18.2% conversion</span>
                </div>
              </div>

              {/* Connected Streaming Destinations Routing */}
              <div className="md:col-span-2 space-y-2.5">
                <span className="text-xs font-bold text-zinc-300 uppercase tracking-wider block">
                  Active Direct-to-App Routes ({PLATFORM_CONFIGS.spotify?.name}, {PLATFORM_CONFIGS.applemusic?.name}, etc.)
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {[
                    { pid: 'spotify' as PlatformId, action: 'Listen on Spotify', streams: '210k streams' },
                    { pid: 'applemusic' as PlatformId, action: 'Play in Spatial Audio', streams: '112k plays' },
                    { pid: 'youtube' as PlatformId, action: 'Watch 4K Music Video', streams: '185k views' },
                    { pid: 'amazonmusic' as PlatformId, action: 'Stream in HD Ultra', streams: '38k streams' },
                    { pid: 'soundcloud' as PlatformId, action: 'Listen Unmastered Stems', streams: '41k plays' },
                    { pid: 'tiktok' as PlatformId, action: 'Use Audio in TikTok Video', streams: '42k videos made' }
                  ].map((dest) => (
                    <div
                      key={dest.pid}
                      className="p-3 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2.5">
                        <PlatformBadge platformId={dest.pid} size="sm" showLabel={false} />
                        <div>
                          <span className="text-xs font-bold text-white block">{dest.action}</span>
                          <span className="text-[10px] text-zinc-500 font-mono">{dest.streams}</span>
                        </div>
                      </div>
                      <ExternalLink className="w-3.5 h-3.5 text-zinc-500" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Paid & Organic Promotion Boost Launcher */}
          <div className="bg-[#111622] rounded-2xl border border-zinc-800 p-6 shadow-xl space-y-5">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 font-mono block">
                CAMPAIGN TOOLKIT 2: MULTI-CHANNEL AD & REACH BOOSTER
              </span>
              <h3 className="text-base font-bold text-white mt-0.5">
                One-Click Promote: TikTok Boost, YouTube Video Ads, Meta Reels & Spotify Marquee
              </h3>
              <p className="text-xs text-zinc-400">
                Deploy promotional budget across all target ad networks with synchronized UTM tags and estimated listener conversion.
              </p>
            </div>

            {campaignLaunched && (
              <div className="p-4 rounded-xl bg-emerald-950/60 border border-emerald-500/50 text-emerald-300 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                <span>
                  Promotion campaign deployed! Live ads are running across TikTok Promote, YouTube In-Feed, and Spotify Marquee.
                </span>
              </div>
            )}

            <form onSubmit={handleLaunchCampaign} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-bold text-zinc-300 block mb-1">Campaign Target Content</label>
                  <input
                    type="text"
                    value={campaignTitle}
                    onChange={(e) => setCampaignTitle(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-zinc-300 block mb-1">
                    Promotion Budget ({currencySymbol})
                  </label>
                  <input
                    type="number"
                    value={campaignBudget}
                    onChange={(e) => setCampaignBudget(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-zinc-300 block mb-1">Objective Goal</label>
                  <select className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white">
                    <option>Max Spotify & Apple Streams</option>
                    <option>Viral TikTok & Shorts Video Views</option>
                    <option>Live Stream Viewer Hype (CCV Boost)</option>
                    <option>Newsletter & Fan Club Pre-Saves</option>
                  </select>
                </div>
              </div>

              {/* Estimated Conversion Forecast */}
              <div className="p-4 rounded-xl bg-zinc-900/80 border border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4 text-xs font-mono">
                  <div>
                    <span className="text-zinc-500 block text-[10px] uppercase">Estimated Reach</span>
                    <span className="text-white font-bold">~45,000 Impressions</span>
                  </div>
                  <div>
                    <span className="text-zinc-500 block text-[10px] uppercase">Est. Streams/Views</span>
                    <span className="text-emerald-400 font-bold">~14,200 New Plays</span>
                  </div>
                  <div>
                    <span className="text-zinc-500 block text-[10px] uppercase">Expected RPM Return</span>
                    <span className="text-purple-400 font-bold">~{currencySymbol}190 - {currencySymbol}240</span>
                  </div>
                </div>

                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold uppercase tracking-wider transition shadow-lg flex items-center gap-1.5"
                >
                  <Rocket className="w-4 h-4" />
                  <span>Deploy Promotion Campaign</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ===================== MONITOR ENGINE ===================== */}
      {suiteMode === 'monitor' && (
        <div className="space-y-6">
          {/* Monitor Category Filter Buttons */}
          <div className="flex items-center gap-2">
            {[
              { id: 'music_audio', label: '🎵 Music & Stream Discovery Monitor', icon: Music },
              { id: 'live_stream', label: '🔴 Live Broadcast Telemetry (Bitrate/FPS)', icon: Radio },
              { id: 'video_vod', label: '📹 Video Retention & Hourly Velocity', icon: Video }
            ].map((m) => {
              const Icon = m.icon;
              return (
                <button
                  key={m.id}
                  onClick={() => setSelectedMonitorMetric(m.id as any)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition border ${
                    selectedMonitorMetric === m.id
                      ? 'bg-emerald-600/20 text-emerald-300 border-emerald-500/50 shadow-md'
                      : 'bg-[#111622] text-zinc-400 border-zinc-800 hover:text-white'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{m.label}</span>
                </button>
              );
            })}
          </div>

          {/* Music Monitor View */}
          {selectedMonitorMetric === 'music_audio' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 bg-[#111622] rounded-2xl border border-zinc-800 p-5 shadow-xl space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-bold text-white flex items-center gap-2">
                      <Music className="w-4 h-4 text-emerald-400" />
                      <span>Real-Time Stream Velocity & Playlist Ingestion</span>
                    </h3>
                    <p className="text-xs text-zinc-400">
                      Live play counters across Spotify, Apple Music, Amazon Music, and SoundCloud
                    </p>
                  </div>
                  <span className="text-xs font-mono text-emerald-400 font-bold bg-emerald-500/10 px-2 py-1 rounded border border-emerald-500/30">
                    Active Streams: 384 plays / min
                  </span>
                </div>

                {/* Playlist additions feed */}
                <div className="space-y-2.5">
                  {[
                    { playlist: 'Spotify: Release Radar (Algorithmic)', adds: '+18,400 listeners', impact: 'High Velocity', platform: 'spotify' as PlatformId },
                    { playlist: 'Apple Music: Spatial Audio Chill', adds: '+9,200 plays', impact: 'Editorial Pick', platform: 'applemusic' as PlatformId },
                    { playlist: 'Spotify: Fresh Electronic Beats', adds: '+6,800 listeners', impact: 'Editorial Pick', platform: 'spotify' as PlatformId },
                    { playlist: 'Amazon Music: Future Soundscape', adds: '+4,100 streams', impact: 'Algorithmic', platform: 'amazonmusic' as PlatformId }
                  ].map((pl, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800 flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center gap-3">
                        <PlatformBadge platformId={pl.platform} size="sm" showLabel={false} />
                        <div>
                          <span className="font-bold text-white block">{pl.playlist}</span>
                          <span className="text-[10px] text-zinc-400">{pl.impact}</span>
                        </div>
                      </div>
                      <span className="font-mono font-bold text-emerald-400">{pl.adds}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Content ID & Clearance Monitor */}
              <div className="bg-[#111622] rounded-2xl border border-zinc-800 p-5 shadow-xl space-y-4 flex flex-col justify-between">
                <div>
                  <h4 className="text-sm font-bold text-white flex items-center gap-2 mb-1">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span>Content ID & Royalties Clearance</span>
                  </h4>
                  <p className="text-xs text-zinc-400 mb-3">
                    Automated licensing verification across all connected streaming networks.
                  </p>

                  <div className="space-y-2">
                    {[
                      { item: 'Master Audio Stems', status: '100% Cleared', color: 'text-emerald-400' },
                      { item: 'YouTube Content ID Whitelist', status: 'Active (Green Icon)', color: 'text-emerald-400' },
                      { item: 'TikTok Sound Library Registry', status: 'Verified & Claimed', color: 'text-emerald-400' },
                      { item: 'Twitch Soundtrack Clearance', status: 'Zero Muted VODs', color: 'text-emerald-400' }
                    ].map((c, i) => (
                      <div key={i} className="p-2.5 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-between text-xs">
                        <span className="text-zinc-300">{c.item}</span>
                        <span className={`font-bold font-mono text-[11px] ${c.color}`}>{c.status}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-emerald-950/20 border border-emerald-500/30 text-[11px] text-emerald-300 text-center">
                  All 47 platforms are registering 100% royalty monetization with zero copyright strikes.
                </div>
              </div>
            </div>
          )}

          {/* Live Stream Telemetry View */}
          {selectedMonitorMetric === 'live_stream' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-5 rounded-2xl bg-[#111622] border border-zinc-800 shadow-xl space-y-1">
                <span className="text-[10px] font-bold text-zinc-500 uppercase font-mono">Ingest Bitrate</span>
                <div className="text-2xl font-black text-white font-mono flex items-center gap-2">
                  <Activity className="w-5 h-5 text-emerald-400" />
                  <span>6,240 kbps</span>
                </div>
                <span className="text-xs text-emerald-400 font-semibold">CBR • Perfectly Stable</span>
              </div>

              <div className="p-5 rounded-2xl bg-[#111622] border border-zinc-800 shadow-xl space-y-1">
                <span className="text-[10px] font-bold text-zinc-500 uppercase font-mono">Dropped Frames</span>
                <div className="text-2xl font-black text-emerald-400 font-mono">
                  0 (0.00%)
                </div>
                <span className="text-xs text-zinc-400">Zero packet loss to cloud relay</span>
              </div>

              <div className="p-5 rounded-2xl bg-[#111622] border border-zinc-800 shadow-xl space-y-1">
                <span className="text-[10px] font-bold text-zinc-500 uppercase font-mono">Audio Peak Levels</span>
                <div className="text-2xl font-black text-white font-mono flex items-center gap-1.5">
                  <Volume2 className="w-5 h-5 text-purple-400" />
                  <span>-14.2 LUFS</span>
                </div>
                <span className="text-xs text-purple-400 font-semibold">Broadcast Standard Optimal</span>
              </div>

              <div className="p-5 rounded-2xl bg-[#111622] border border-zinc-800 shadow-xl space-y-1">
                <span className="text-[10px] font-bold text-zinc-500 uppercase font-mono">Relay Cloud Ping</span>
                <div className="text-2xl font-black text-white font-mono">
                  12 ms
                </div>
                <span className="text-xs text-emerald-400">US-East Ingest Relay Cluster</span>
              </div>
            </div>
          )}

          {/* Video VOD Retention & Hourly Velocity View */}
          {selectedMonitorMetric === 'video_vod' && (
            <div className="bg-[#111622] rounded-2xl border border-zinc-800 p-5 shadow-xl space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <Video className="w-4 h-4 text-blue-400" />
                    <span>Video Retention & Velocity Radar</span>
                  </h3>
                  <p className="text-xs text-zinc-400">Hourly views spike and retention curve breakdown</p>
                </div>
                <span className="text-xs font-mono text-blue-400 font-bold bg-blue-500/10 px-2.5 py-1 rounded border border-blue-500/30">
                  CTR: 11.4% (Above Average)
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono">
                <div className="p-3.5 rounded-xl bg-zinc-900 border border-zinc-800">
                  <span className="text-zinc-500 block text-[10px] uppercase">Peak Hour Velocity</span>
                  <span className="text-lg font-bold text-white">+14,200 views / hr</span>
                </div>
                <div className="p-3.5 rounded-xl bg-zinc-900 border border-zinc-800">
                  <span className="text-zinc-500 block text-[10px] uppercase">30s Intro Retention</span>
                  <span className="text-lg font-bold text-emerald-400">82.4% Audience Kept</span>
                </div>
                <div className="p-3.5 rounded-xl bg-zinc-900 border border-zinc-800">
                  <span className="text-zinc-500 block text-[10px] uppercase">Audience Sentiment</span>
                  <span className="text-lg font-bold text-purple-400">97.8% Positive Likes</span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
