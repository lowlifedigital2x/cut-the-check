import React, { useState, useEffect } from 'react';
import {
  Rocket,
  Radio,
  Send,
  Sparkles,
  Music,
  Video,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Layers,
  Crown,
  Award,
  Zap,
  Activity,
  ArrowRight,
  TrendingUp,
  Disc3,
  Flame,
  ExternalLink,
  Building2,
  Briefcase,
  FileSignature,
  Feather,
  Sliders,
  Volume2,
  Lock,
  Unlock,
  CheckCheck
} from 'lucide-react';
import { MultiStreamState, PlatformConnection, PlatformId, SubscriptionTierId } from '../../types';
import { PLATFORM_CONFIGS } from '../../data/mockData';
import { PreFlightDiagnostics } from './PreFlightDiagnostics';
import { LaunchCountdownModal } from './LaunchCountdownModal';
import { SimultaneousEverywherePanel } from './SimultaneousEverywherePanel';
import ctcEagleDiamondImg from '../../assets/images/ctc_eagle_diamond.jpg';
import majorLabelOfficeImg from '../../assets/images/major_label_office.jpg';

interface LaunchControlCenterProps {
  streamState: MultiStreamState;
  onToggleStream: () => void;
  connections: PlatformConnection[];
  onNavigateToTab: (tab: string) => void;
  subscriptionTier?: SubscriptionTierId;
}

export type LaunchProfile = 'omni_drop' | 'music_release' | 'simulcast_live';

export const LaunchControlCenter: React.FC<LaunchControlCenterProps> = ({
  streamState,
  onToggleStream,
  connections,
  onNavigateToTab,
  subscriptionTier = 'gold'
}) => {
  const [profile, setProfile] = useState<LaunchProfile>('omni_drop');
  const [missionTitle, setMissionTitle] = useState('Midnight Frequency – Global Deluxe Drop & Live Studio Jam');
  const [signerTitle, setSignerTitle] = useState('Alexander Vance • Executive Chairman & Label CEO');
  const [isArmed, setIsArmed] = useState(false);
  const [isCountdownOpen, setIsCountdownOpen] = useState(false);
  const [officeAtmosphere, setOfficeAtmosphere] = useState<'skyline' | 'acoustic'>('skyline');
  const [ambientAudio, setAmbientAudio] = useState(false);

  const [selectedPlatforms, setSelectedPlatforms] = useState<Record<PlatformId, boolean>>({
    youtube: true,
    spotify: true,
    tiktok: true,
    kick: true,
    applemusic: true,
    amazonmusic: true,
    soundcloud: true,
    facebook: true,
    instagram: true,
    twitter: false,
    twitch: false,
    rumble: false,
    linkedin: false,
    custom_rtmp: false,
    trovo: false,
    dlive: false,
    nimo: false,
    soop: false,
    bilibili: false,
    vimeo: false,
    younow: false,
    dailymotion: false,
    tidal: false,
    deezer: false,
    audiomack: false,
    bandcamp: false,
    pandora: false,
    iheart: false,
    napster: false,
    qobuz: false,
    boomplay: false,
    audius: false,
    beatport: false,
    vevo: false,
    threads: false,
    snapchat: false,
    pinterest: false,
    reddit: false,
    discord: false,
    telegram: false,
    bluesky: false,
    tumblr: false,
    mastodon: false,
    whatsapp: false,
    patreon: false,
    substack: false,
    mixcloud: false
  });

  const [hasLaunchedRecently, setHasLaunchedRecently] = useState(false);

  const selectedCount = Object.values(selectedPlatforms).filter(Boolean).length;

  const playHapticSound = (type: 'switch' | 'chime') => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();

      if (type === 'switch') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(880, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(320, ctx.currentTime + 0.08);
        gain.gain.setValueAtTime(0.18, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.08);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.08);
      } else if (type === 'chime') {
        [523.25, 659.25, 783.99, 1046.50].forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.value = freq;
          gain.gain.setValueAtTime(0.08, ctx.currentTime + idx * 0.06);
          gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.06 + 0.8);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(ctx.currentTime + idx * 0.06);
          osc.stop(ctx.currentTime + idx * 0.06 + 0.8);
        });
      }
    } catch (e) {
      // AudioContext not allowed before user interaction
    }
  };

  const handleSelectAllPlatforms = () => {
    const updated: any = {};
    (Object.keys(PLATFORM_CONFIGS) as PlatformId[]).forEach((p) => {
      updated[p] = true;
    });
    setSelectedPlatforms(updated);
  };

  const handleSelectMusicOnly = () => {
    const musicOnly: PlatformId[] = ['spotify', 'applemusic', 'amazonmusic', 'soundcloud', 'youtube', 'tiktok'];
    const updated: any = {};
    (Object.keys(PLATFORM_CONFIGS) as PlatformId[]).forEach((p) => {
      updated[p] = musicOnly.includes(p);
    });
    setSelectedPlatforms(updated);
  };

  const handleTogglePlatform = (p: PlatformId) => {
    setSelectedPlatforms((prev) => ({
      ...prev,
      [p]: !prev[p]
    }));
  };

  const handleArmToggle = () => {
    const nextArmed = !isArmed;
    setIsArmed(nextArmed);
    playHapticSound(nextArmed ? 'chime' : 'switch');
  };

  const handleTriggerLaunch = () => {
    if (!isArmed) return;
    playHapticSound('chime');
    setIsCountdownOpen(true);
  };

  const handleLaunchCompleted = () => {
    if (!streamState.isBroadcasting) {
      onToggleStream();
    }
    setHasLaunchedRecently(true);
  };

  return (
    <div className="space-y-6">
      {/* ==============================================================
          MAJOR LABEL EXECUTIVE PENTHOUSE CORNER OFFICE HERO
          ============================================================== */}
      <div className="relative rounded-3xl overflow-hidden border-2 border-amber-500/40 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.9)]">
        {/* Background Image of Luxury Major Label Penthouse Corner Office */}
        <div className="absolute inset-0 z-0">
          <img
            src={majorLabelOfficeImg}
            alt="Major Label Executive Corner Office"
            className={`w-full h-full object-cover transition-all duration-700 ${
              officeAtmosphere === 'skyline' ? 'brightness-[0.45] scale-100' : 'brightness-[0.35] scale-105 saturate-150'
            }`}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#06080E] via-[#06080E]/70 to-transparent" />
          <div className="absolute inset-0 bg-radial at-center from-transparent via-[#06080E]/40 to-[#06080E]/80" />
        </div>

        {/* Executive Office Content */}
        <div className="relative z-10 p-6 sm:p-8 lg:p-10 space-y-6">
          {/* Top Bar: Penthouse Suite Tag & Ambiance Toggles */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-amber-500/20 pb-4">
            <div className="flex items-center gap-2.5">
              <span className="p-2 rounded-xl bg-amber-500/20 border border-amber-400/40 text-amber-300">
                <Building2 className="w-5 h-5" />
              </span>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono font-black tracking-widest uppercase text-amber-300 bg-amber-950/80 px-2 py-0.5 rounded border border-amber-600/40">
                    54TH FLOOR PENTHOUSE BOARDROOM
                  </span>
                  <span className="text-[10px] font-mono text-zinc-400">
                    CUT THE CHECK WORLDWIDE HEADQUARTERS
                  </span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-white tracking-wide uppercase mt-0.5">
                  Major Label Executive Launch Suite
                </h2>
              </div>
            </div>

            {/* Atmosphere & Sound Toggles */}
            <div className="flex items-center gap-2 font-mono text-xs">
              <button
                onClick={() => setOfficeAtmosphere(officeAtmosphere === 'skyline' ? 'acoustic' : 'skyline')}
                className="px-3 py-1.5 rounded-xl bg-black/60 hover:bg-black/80 border border-amber-500/30 text-amber-300 flex items-center gap-1.5 transition text-[11px]"
              >
                <Sliders className="w-3.5 h-3.5 text-amber-400" />
                <span>{officeAtmosphere === 'skyline' ? 'Skyline Twilight' : 'Acoustic Walnut'}</span>
              </button>

              <button
                onClick={() => onNavigateToTab('milestone_awards')}
                className="deal-btn-platinum py-1.5 px-3 rounded-xl text-[11px] font-bold transition flex items-center gap-1.5 shadow-md"
              >
                <Award className="w-3.5 h-3.5 text-slate-800" />
                <span>Plaque Wall</span>
              </button>
            </div>
          </div>

          {/* Centerpiece: Executive Greenlight Clearance Banner */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            <div className="lg:col-span-8 space-y-3">
              {/* Executive Seal & User Permission Notice */}
              <div className="inline-flex items-center gap-2.5 p-1.5 pr-4 rounded-full bg-emerald-950/70 border border-emerald-500/50 text-emerald-300 text-xs shadow-lg backdrop-blur-md">
                <span className="w-6 h-6 rounded-full gold-wax-seal flex items-center justify-center text-[10px] font-black text-amber-950">
                  CTC
                </span>
                <span className="font-bold tracking-wide">
                  EXECUTIVE PERMISSION GRANTED: "LAUNCH, YOU GOT MY PERMISSION"
                </span>
                <CheckCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              </div>

              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight drop-shadow-md">
                Worldwide Simultaneous Release & Master Ingest
              </h1>

              <p className="text-xs sm:text-sm text-zinc-300 max-w-2xl leading-relaxed">
                Authorized directly from the CEO desk. Synchronize lossless audio masters across all DSP streaming services (Spotify, Apple Music, Amazon, SoundCloud) and fire high-bitrate live video relays across YouTube, TikTok, Kick, Facebook, and Twitch in one executive command.
              </p>

              {/* CEO Digital Signature Plaque */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-black/60 border border-amber-500/30 font-mono text-xs">
                  <Feather className="w-3.5 h-3.5 text-amber-400" />
                  <span className="text-zinc-400">Authorized by:</span>
                  <span className="text-amber-200 font-bold">{signerTitle}</span>
                </div>

                <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-950/40 border border-emerald-500/30 font-mono text-xs text-emerald-300">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>100% Master Ownership • Zero Recoupment Deductions</span>
                </div>
              </div>
            </div>

            {/* Right Column: Live Status & Certified Clearance Metric */}
            <div className="lg:col-span-4 flex flex-col gap-3">
              <div className="p-4 rounded-2xl bg-black/75 border border-amber-500/40 shadow-2xl backdrop-blur-md space-y-2">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-zinc-400 uppercase">Boardroom Ingest Status</span>
                  <span className="text-emerald-400 font-bold flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                    BROADCAST READY
                  </span>
                </div>
                <div className="text-2xl font-black text-gold-gradient font-mono">
                  47 / 47 NETWORKS
                </div>
                <div className="text-[11px] text-zinc-400 leading-snug">
                  Universal Relay Server: <strong className="text-purple-300 font-mono">rtmp://live.omnicast.io/relay/app</strong>
                </div>
                <div className="w-full bg-zinc-900 h-2 rounded-full overflow-hidden border border-zinc-800 mt-1">
                  <div className="bg-gradient-to-r from-amber-400 to-emerald-400 h-full w-full animate-pulse" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ==============================================================
          SIMULTANEOUS EVERYWHERE — MASTER LAUNCH PANEL
          ============================================================== */}
      <SimultaneousEverywherePanel connections={connections} />

      {/* ==============================================================
          MAJOR LABEL DEPARTMENT CLEARANCES (EXECUTIVE DOSSIER)
          ============================================================== */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3.5">
        <div className="executive-marble-trim p-4 rounded-2xl space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono uppercase text-amber-400 font-black">1. A&R Acoustic Clearance</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-xs font-bold text-white">96kHz / 24-bit Lossless Master</div>
          <p className="text-[11px] text-zinc-400">Full acoustic dynamic range, -14 LUFS Spotify & Apple Digital Masters certified.</p>
        </div>

        <div className="executive-marble-trim p-4 rounded-2xl space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono uppercase text-amber-400 font-black">2. Legal & Master Rights</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-xs font-bold text-white">Direct Creator Escrow Locked</div>
          <p className="text-[11px] text-zinc-400">Zero middleman royalties, smart contract instant split disbursement active.</p>
        </div>

        <div className="executive-marble-trim p-4 rounded-2xl space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono uppercase text-amber-400 font-black">3. Satellite RTMP Uplink</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-xs font-bold text-white">Omnicast Multiplex Ingest</div>
          <p className="text-[11px] text-zinc-400">1080p60 hardware NVENC/Metal acceleration ready with zero dropped frames.</p>
        </div>

        <div className="executive-marble-trim p-4 rounded-2xl space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono uppercase text-amber-400 font-black">4. Chart Priority Wire</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-xs font-bold text-white">Billboard & DSP Syndication</div>
          <p className="text-[11px] text-zinc-400">New Music Friday, Release Radar & syndicated live streams queued for push.</p>
        </div>
      </div>

      {/* Profile Selector (Omni Drop vs Music Release vs Simulcast) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          {
            id: 'omni_drop',
            title: 'Omni-Campaign Executive Drop',
            subtitle: 'Music DSPs + Video Premiere + Studio Live',
            icon: Rocket,
            desc: 'Simultaneous 47-channel audio drop, YouTube video premiere, and live executive broadcast jam.'
          },
          {
            id: 'music_release',
            title: 'Worldwide Music Drop Day',
            subtitle: 'Pure Audio DSP Syndication',
            icon: Music,
            desc: 'Instant lossless delivery to Spotify, Apple Music, Amazon Music, SoundCloud, and YouTube Music.'
          },
          {
            id: 'simulcast_live',
            title: 'Penthouse Live Simulcast',
            subtitle: 'Multi-Destination Live Broadcast',
            icon: Radio,
            desc: 'Pre-flight verified live stream to TikTok, YouTube, Kick, and Facebook in pristine 1080p60.'
          }
        ].map((p) => {
          const Icon = p.icon;
          const isSelected = profile === p.id;
          return (
            <button
              key={p.id}
              onClick={() => {
                setProfile(p.id as LaunchProfile);
                if (p.id === 'music_release') handleSelectMusicOnly();
                else if (p.id === 'omni_drop') handleSelectAllPlatforms();
                playHapticSound('switch');
              }}
              className={`p-4 rounded-2xl text-left transition border ${
                isSelected
                  ? 'plaque-gold border-amber-400 shadow-xl ring-1 ring-amber-300'
                  : 'bg-zinc-900/60 border-zinc-800 hover:border-zinc-700 text-zinc-300'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className={`p-2 rounded-lg ${isSelected ? 'bg-amber-400 text-amber-950 font-bold' : 'bg-zinc-800 text-zinc-400'}`}>
                  <Icon className="w-4 h-4" />
                </div>
                {isSelected && (
                  <span className="text-[10px] font-mono font-bold text-amber-300 uppercase px-2 py-0.5 rounded bg-amber-950/60 border border-amber-600/40">
                    Selected Profile
                  </span>
                )}
              </div>
              <h4 className="text-sm font-black text-white">{p.title}</h4>
              <p className="text-[11px] font-semibold text-amber-300/90">{p.subtitle}</p>
              <p className="text-xs text-zinc-400 mt-2">{p.desc}</p>
            </button>
          );
        })}
      </div>

      {/* Pre-Flight Engineering & A&R Diagnostics */}
      <PreFlightDiagnostics
        connections={connections}
        isBroadcasting={streamState.isBroadcasting}
      />

      {/* ==============================================================
          EXECUTIVE DESK BLOTTER & MASTER LAUNCH IGNITION ROOM
          ============================================================== */}
      <div className="executive-leather-desk p-6 lg:p-8 rounded-3xl relative overflow-hidden border border-amber-500/30">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-amber-500/20">
          
          {/* Campaign Designation & Boardroom Seal */}
          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-black uppercase text-amber-300 flex items-center gap-1.5">
                <Briefcase className="w-3.5 h-3.5 text-amber-400" />
                Executive Project Dossier & Release Designation:
              </span>
            </div>
            <input
              type="text"
              value={missionTitle}
              onChange={(e) => setMissionTitle(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-black/80 border border-amber-500/40 text-white font-mono text-sm focus:outline-none focus:border-amber-400 shadow-inner"
              placeholder="e.g. Midnight Frequency – Deluxe Global Drop 2026"
            />
            <div className="flex items-center gap-2 text-[11px] text-zinc-400 font-mono">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Smart Escrow Ledger: All publishing and streaming revenue routes directly to creator account.</span>
            </div>
          </div>

          {/* Preset Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => {
                handleSelectMusicOnly();
                playHapticSound('switch');
              }}
              className="deal-btn-gold px-4 py-2.5 rounded-xl text-xs font-black shadow-md flex items-center gap-1.5"
            >
              <span>🎵 CTC Select All Music DSPs</span>
            </button>
            <button
              onClick={() => {
                handleSelectAllPlatforms();
                playHapticSound('switch');
              }}
              className="deal-btn-platinum px-4 py-2.5 rounded-xl text-xs font-black shadow-md flex items-center gap-1.5"
            >
              <span>🌐 CTC Select All 47 Channels</span>
            </button>
          </div>
        </div>

        {/* Selected Destinations Grid */}
        <div className="my-6">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-mono font-bold text-zinc-300 uppercase flex items-center gap-1.5">
              <span>Syndicated Broadcast Targets ({selectedCount}/14 Active):</span>
            </span>
            <span className="text-xs text-amber-300 font-mono">100% Ingest Channels Clear</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5">
            {(Object.keys(PLATFORM_CONFIGS) as PlatformId[]).map((pid) => {
              const cfg = PLATFORM_CONFIGS[pid];
              const isSelected = !!selectedPlatforms[pid];
              return (
                <button
                  key={pid}
                  onClick={() => {
                    handleTogglePlatform(pid);
                    playHapticSound('switch');
                  }}
                  className={`p-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition border ${
                    isSelected
                      ? 'bg-zinc-900 text-white border-amber-400/60 shadow-md ring-1 ring-amber-400/30'
                      : 'bg-zinc-950/60 text-zinc-500 border-zinc-800 hover:border-zinc-700'
                  }`}
                >
                  <span
                    className="w-2.5 h-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: isSelected ? cfg?.color : '#4B5563' }}
                  />
                  <span className="truncate">{cfg?.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* The Master Executive Launch Controls */}
        <div className="pt-6 border-t border-amber-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-5 bg-black/40 -mx-6 -mb-6 p-6 rounded-b-3xl">
          {/* Dual-Interlock Arm Switch with Boardroom Clearance Notice */}
          <div className="flex items-center gap-4">
            <button
              onClick={handleArmToggle}
              className={`px-5 py-3 rounded-2xl text-xs font-mono font-black uppercase tracking-wider transition border flex items-center gap-2 shadow-lg cursor-pointer ${
                isArmed
                  ? 'bg-red-500 text-white border-red-400 shadow-[0_0_20px_rgba(239,68,68,0.6)] animate-pulse'
                  : 'bg-zinc-900 text-zinc-300 border-zinc-700 hover:text-white hover:border-amber-400'
              }`}
            >
              {isArmed ? (
                <>
                  <Unlock className="w-4 h-4 text-white" />
                  <span>ARMED • PERMISSION VERIFIED</span>
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4 text-amber-400" />
                  <span>CTC ARM MASTER LAUNCH SWITCH</span>
                </>
              )}
            </button>
            <div className="text-xs">
              <span className="font-bold text-white block">
                {isArmed ? 'Executive interlock disengaged.' : 'Boardroom safety interlock armed.'}
              </span>
              <span className="text-[11px] text-zinc-400">
                {isArmed ? 'Greenlight confirmed. Ready for worldwide simultaneous broadcast drop.' : 'Toggle switch to approve final transmission.'}
              </span>
            </div>
          </div>

          {/* Master Launch Button */}
          <button
            onClick={handleTriggerLaunch}
            disabled={!isArmed}
            className={`py-3.5 px-8 rounded-2xl text-sm font-black uppercase tracking-widest transition flex items-center justify-center gap-2.5 shadow-2xl ${
              isArmed
                ? 'deal-btn-gold scale-105 shadow-[0_0_35px_rgba(245,158,11,0.7)] animate-bounce cursor-pointer'
                : 'bg-zinc-800 text-zinc-600 cursor-not-allowed border border-zinc-700'
            }`}
          >
            <Rocket className="w-5 h-5 text-amber-950" />
            <span>CTC EXECUTE GLOBAL ROLLOUT</span>
          </button>
        </div>
      </div>

      {/* Live Mission Telemetry Readout */}
      {(streamState.isBroadcasting || hasLaunchedRecently) && (
        <div className="plaque-gold p-6 rounded-3xl relative overflow-hidden animate-in fade-in duration-300">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
              <h3 className="text-sm font-black text-white uppercase tracking-wider">
                Live Executive Transmission Telemetry
              </h3>
            </div>
            <span className="engraved-plate-gold text-[9px] font-black px-2.5 py-0.5 rounded shadow-sm">
              SYNDICATED LIVE BROADCAST
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-black/60 border border-amber-500/20">
              <span className="text-[10px] uppercase font-mono text-zinc-400 block">Live Concurrent Viewers</span>
              <span className="text-2xl font-black text-white font-mono">
                {streamState.totalLiveViewers.toLocaleString()} CCV
              </span>
              <span className="text-[10px] text-emerald-400 font-semibold block mt-1">+3,200 / min influx</span>
            </div>

            <div className="p-4 rounded-xl bg-black/60 border border-amber-500/20">
              <span className="text-[10px] uppercase font-mono text-zinc-400 block">Hardware Encoder Rate</span>
              <span className="text-2xl font-black text-amber-300 font-mono">
                {streamState.bitrateKbps} kbps
              </span>
              <span className="text-[10px] text-zinc-400 font-semibold block mt-1">60.0 FPS • Zero dropped frames</span>
            </div>

            <div className="p-4 rounded-xl bg-black/60 border border-amber-500/20">
              <span className="text-[10px] uppercase font-mono text-zinc-400 block">Universal Relay Ingest</span>
              <span className="text-2xl font-black text-purple-300 font-mono truncate">
                {selectedCount} Relays
              </span>
              <span className="text-[10px] text-purple-300/80 font-semibold block mt-1">omnicast.io synced</span>
            </div>

            <div className="p-4 rounded-xl bg-black/60 border border-amber-500/20">
              <span className="text-[10px] uppercase font-mono text-zinc-400 block">Smart Escrow Royalties</span>
              <span className="text-2xl font-black text-emerald-400 font-mono">
                $50,280.00
              </span>
              <span className="text-[10px] text-emerald-400 font-semibold block mt-1">Auto-disbursing directly</span>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-zinc-800 flex items-center justify-between flex-wrap gap-2">
            <span className="text-xs text-zinc-400 font-mono">
              Broadcasting with official CTC Diamond Eagle insignia rendered in 1080p60.
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => onNavigateToTab('cut_the_chat')}
                className="deal-btn-gold py-1.5 px-3.5 rounded-lg text-xs font-black"
              >
                Go to Cut The Chat →
              </button>
              <button
                onClick={() => onNavigateToTab('climb_the_charts')}
                className="deal-btn-platinum py-1.5 px-3.5 rounded-lg text-xs font-black"
              >
                View Live Chart Analytics →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* T-Minus Countdown Modal */}
      <LaunchCountdownModal
        isOpen={isCountdownOpen}
        onClose={() => setIsCountdownOpen(false)}
        onLaunchComplete={handleLaunchCompleted}
        missionName={missionTitle}
        selectedPlatformsCount={selectedCount}
      />
    </div>
  );
};
