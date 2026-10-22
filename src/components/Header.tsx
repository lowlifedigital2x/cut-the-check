import React, { useState, useEffect } from 'react';
import {
  Radio,
  Send,
  Sparkles,
  Wifi,
  DollarSign,
  Bell,
  ShieldCheck,
  ChevronDown,
  Crown,
  Gem,
  Award,
  Rocket,
  Download,
  Smartphone,
  Github
} from 'lucide-react';
import { MultiStreamState, PlatformConnection, SubscriptionTierId } from '../types';
import { PLATFORM_CONFIGS } from '../data/mockData';
import ctcEagleDiamondImg from '../assets/images/ctc_eagle_diamond.jpg';

interface HeaderProps {
  streamState: MultiStreamState;
  onToggleStream: () => void;
  onOpenMultiPost: () => void;
  onOpenAICopilot: () => void;
  onOpenSubscriptionModal: () => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  connections: PlatformConnection[];
  currency: string;
  setCurrency: (c: string) => void;
  subscriptionTier: SubscriptionTierId;
  mountedPlaquesCount?: number;
  onOpenGitHubModal?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  streamState,
  onToggleStream,
  onOpenMultiPost,
  onOpenAICopilot,
  onOpenSubscriptionModal,
  activeTab,
  setActiveTab,
  connections,
  currency,
  setCurrency,
  subscriptionTier,
  mountedPlaquesCount,
  onOpenGitHubModal
}) => {
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  useEffect(() => {
    let interval: any;
    if (streamState.isBroadcasting && streamState.startedAt) {
      interval = setInterval(() => {
        setElapsedSeconds(Math.floor((Date.now() - (streamState.startedAt || Date.now())) / 1000));
      }, 1000);
    } else {
      setElapsedSeconds(0);
    }
    return () => clearInterval(interval);
  }, [streamState.isBroadcasting, streamState.startedAt]);

  const formatDuration = (totalSec: number) => {
    const hrs = Math.floor(totalSec / 3600);
    const mins = Math.floor((totalSec % 3600) / 60);
    const secs = totalSec % 60;
    return `${hrs > 0 ? hrs + ':' : ''}${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const activeLiveDestinations = Object.entries(streamState.selectedPlatforms)
    .filter(([_, active]) => active)
    .map(([id]) => id);

  const connectedCount = connections.filter(c => c.connected).length;

  return (
    <header className="sticky top-0 z-40 bg-[#0B0E14]/90 backdrop-blur-md border-b border-zinc-800/80 px-4 lg:px-8 py-3">
      <div className="flex items-center justify-between gap-4">
        {/* Brand & Creator Identity with Official CTC Eagle Medallion */}
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center w-11 h-11 rounded-full p-0.5 bg-gradient-to-tr from-amber-300 via-yellow-100 to-amber-600 shadow-[0_0_15px_rgba(245,158,11,0.5)]">
            <div className="w-full h-full rounded-full overflow-hidden border border-amber-900/60 bg-black flex items-center justify-center">
              <img
                src={ctcEagleDiamondImg}
                alt="CTC Official Eagle Medallion"
                className="w-full h-full object-cover object-center scale-105"
              />
            </div>
            {streamState.isBroadcasting && (
              <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 bg-red-500 rounded-full border-2 border-[#0B0E14] animate-ping" />
            )}
            <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-gradient-to-br from-cyan-300 via-white to-sky-500 border border-black flex items-center justify-center shadow-sm" title="Iced Diamond Seal">
              <Gem className="w-2.5 h-2.5 text-slate-900" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-black text-lg lg:text-xl tracking-wider text-gold-gradient drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                CTC
              </span>
              <span className="engraved-plate-gold text-[10px] uppercase font-black tracking-widest px-2.5 py-0.5 rounded shadow-sm">
                CUT THE CHECK
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-amber-200/70">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shadow-[0_0_8px_#F59E0B]" />
              <span className="font-medium tracking-tight">{connectedCount}/{connections.length} Certified Streaming Networks</span>
            </div>
          </div>
        </div>

        {/* Live Broadcast Telemetry HUD (Shown when streaming or ready) */}
        <div className="hidden md:flex items-center gap-3 px-3 py-1.5 rounded-xl bg-zinc-900/90 border border-zinc-800">
          <div className="flex items-center gap-2">
            <span
              className={`w-2.5 h-2.5 rounded-full ${
                streamState.isBroadcasting
                  ? 'bg-red-500 animate-pulse'
                  : 'bg-zinc-600'
              }`}
            />
            <span className="text-xs font-semibold uppercase tracking-wider text-zinc-300">
              {streamState.isBroadcasting ? 'MULTISTREAMING LIVE' : 'BROADCAST ENGINE STANDBY'}
            </span>
          </div>

          {streamState.isBroadcasting ? (
            <div className="flex items-center gap-3 pl-3 border-l border-zinc-800 text-xs text-zinc-300">
              <div className="flex items-center gap-1 font-mono text-red-400 font-semibold">
                <span>⏱️ {formatDuration(elapsedSeconds)}</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-zinc-500">CCV:</span>
                <span className="font-bold text-white">
                  {streamState.totalLiveViewers.toLocaleString()}
                </span>
              </div>
              <div className="flex items-center gap-1 font-mono text-zinc-400">
                <Wifi className="w-3.5 h-3.5 text-emerald-400" />
                <span>{streamState.bitrateKbps} kbps</span>
              </div>
              <div className="flex items-center -space-x-1 pl-1">
                {activeLiveDestinations.map(pid => {
                  const cfg = PLATFORM_CONFIGS[pid];
                  return (
                    <span
                      key={pid}
                      title={`Streaming to ${cfg?.name || pid}`}
                      className="w-4 h-4 rounded-full border border-black flex items-center justify-center text-[9px] font-bold text-black"
                      style={{ backgroundColor: cfg?.color || '#fff' }}
                    >
                      {cfg?.name?.[0] || 'P'}
                    </span>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2 pl-3 border-l border-zinc-800 text-xs text-zinc-400">
              <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />
              <span>RTMP Relay Ready (1080p60)</span>
            </div>
          )}
        </div>

        {/* Action Controls & Creator Actions */}
        <div className="flex items-center gap-2.5">
          {/* Currency Toggle */}
          <div className="relative hidden sm:block">
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="appearance-none bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-xs font-semibold text-zinc-300 py-1.5 pl-2.5 pr-6 rounded-lg cursor-pointer focus:outline-none focus:ring-1 focus:ring-purple-500"
            >
              <option value="USD">USD ($)</option>
              <option value="EUR">EUR (€)</option>
              <option value="GBP">GBP (£)</option>
              <option value="CAD">CAD ($)</option>
            </select>
            <ChevronDown className="w-3 h-3 text-zinc-500 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Subscription Tier Plaque Badge */}
          <button
            onClick={onOpenSubscriptionModal}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-black rounded-lg border transition shadow-sm ${
              subscriptionTier === 'diamond'
                ? 'engraved-plate-platinum text-slate-900 border-sky-300 shadow-[0_0_12px_rgba(56,189,248,0.4)]'
                : subscriptionTier === 'platinum'
                ? 'engraved-plate-platinum text-slate-900 border-slate-300 shadow-[0_0_12px_rgba(226,232,240,0.35)]'
                : subscriptionTier === 'gold'
                ? 'engraved-plate-gold text-amber-950 border-amber-600 shadow-[0_0_12px_rgba(245,158,11,0.3)]'
                : 'bg-zinc-800 text-zinc-300 border-zinc-700 hover:border-zinc-500'
            }`}
            title="CTC Official Deal Tiers: Free, Gold, Platinum, Diamond"
          >
            <Crown className={`w-3.5 h-3.5 ${subscriptionTier === 'diamond' ? 'text-sky-700' : subscriptionTier === 'platinum' ? 'text-slate-600' : subscriptionTier === 'gold' ? 'text-amber-900' : 'text-zinc-400'}`} />
            <span className="uppercase font-mono text-[11px] font-black hidden sm:inline">
              {subscriptionTier === 'diamond' ? 'DIAMOND CONGLOMERATE DEAL' : subscriptionTier === 'platinum' ? 'PLATINUM EXECUTIVE DEAL' : subscriptionTier === 'gold' ? 'GOLD LABEL DEAL' : 'INDIE TIER'}
            </span>
          </button>

          {/* Milestone Awards Plaque Wall Quick Access */}
          <button
            onClick={() => setActiveTab('milestone_awards')}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-bold rounded-lg border transition shadow-xs ${
              activeTab === 'milestone_awards'
                ? 'engraved-plate-gold text-amber-950 border-amber-600 shadow-[0_0_12px_rgba(245,158,11,0.5)] font-black ring-1 ring-amber-400'
                : 'bg-zinc-900/90 hover:bg-zinc-800 text-amber-300 border-amber-500/30 hover:border-amber-400'
            }`}
            title="View Official Milestone Awards & Profile Trophy Case"
          >
            <Award className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline font-mono">🏆 {mountedPlaquesCount ?? 6} Plaques</span>
          </button>

          {/* Add to Home Screen PWA Action */}
          <button
            onClick={() => window.dispatchEvent(new CustomEvent('open-pwa-install'))}
            className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-bold rounded-lg border border-amber-400/50 bg-gradient-to-r from-amber-500/20 to-yellow-500/10 hover:border-amber-300 text-amber-200 hover:text-white transition shadow-sm cursor-pointer"
            title="Add to Home Screen (Mobile PWA & Native App)"
          >
            <Download className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden lg:inline font-mono">📱 CTC Install</span>
            <span className="lg:hidden font-mono">CTC Install</span>
          </button>

          {/* GitHub Sync & Code Export Action */}
          <button
            onClick={onOpenGitHubModal || (() => window.dispatchEvent(new CustomEvent('open-github-modal')))}
            className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-bold rounded-lg border border-zinc-700 bg-zinc-900 hover:border-amber-400/70 text-zinc-200 hover:text-white transition shadow-sm cursor-pointer"
            title="Sync & Publish to GitHub (lowlifedigital2x/cut-the-check)"
          >
            <Github className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline font-mono">GitHub</span>
          </button>

          {/* AI Content Strategist Deal Copilot */}
          <button
            onClick={onOpenAICopilot}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-zinc-900/90 hover:bg-zinc-800 text-amber-300 border border-amber-500/30 transition shadow-sm"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">Deal Copilot</span>
          </button>

          {/* 1-Click Multi-Post Release */}
          <button
            onClick={onOpenMultiPost}
            className="deal-btn-platinum flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg transition"
          >
            <Send className="w-3.5 h-3.5 text-slate-800" />
            <span>CTC Dispatch</span>
          </button>

          {/* Master Launch Command Center */}
          <button
            onClick={() => setActiveTab('launch')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-black rounded-lg transition border shadow-md ${
              activeTab === 'launch'
                ? 'bg-red-600 text-white border-red-400 shadow-[0_0_15px_rgba(239,68,68,0.6)] animate-pulse'
                : 'bg-gradient-to-r from-red-950/80 to-amber-950/80 text-amber-300 border-red-500/40 hover:border-red-400 hover:text-white'
            }`}
            title="Drop Day Launch Control & Go-Live Command"
          >
            <Rocket className="w-3.5 h-3.5 text-red-400" />
            <span className="hidden sm:inline">Launch</span>
          </button>

          {/* Master One-Click Go Live Broadcast */}
          <button
            onClick={() => {
              if (activeTab !== 'cut_the_chat') {
                setActiveTab('cut_the_chat');
              }
              onToggleStream();
            }}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition shadow-lg ${
              streamState.isBroadcasting
                ? 'bg-red-600 hover:bg-red-700 text-white shadow-red-900/40 animate-pulse'
                : 'deal-btn-gold'
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                streamState.isBroadcasting ? 'bg-white' : 'bg-amber-950'
              }`}
            />
            <span>{streamState.isBroadcasting ? 'CTC End Broadcast' : 'CTC Simulcast Everywhere'}</span>
          </button>
        </div>
      </div>
    </header>
  );
};
