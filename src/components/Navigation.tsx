import React from 'react';
import {
  Share2,
  Radio,
  CalendarCheck,
  LayoutDashboard,
  TrendingUp,
  Users,
  DollarSign,
  Link2,
  Sparkles,
  Award,
  Rocket,
  Download,
  Handshake
} from 'lucide-react';

interface NavigationProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isBroadcasting: boolean;
  totalEarnings: number;
  totalLiveViewers: number;
  scheduledCount: number;
  hasFailures: boolean;
  milestonesCount?: number;
}

export const Navigation: React.FC<NavigationProps> = ({
  activeTab,
  setActiveTab,
  isBroadcasting,
  totalEarnings,
  totalLiveViewers,
  scheduledCount,
  hasFailures,
  milestonesCount
}) => {
  // The 7 official CTC (CUT THE CHECK) categories
  const categories = [
    {
      id: 'create_the_content',
      number: '1',
      label: 'Create the content',
      subtext: 'Audio, Video, Pod, Post',
      icon: Share2,
      badge: '5 Modalities'
    },
    {
      id: 'cut_the_chat',
      number: '2',
      label: 'Cut the chat',
      subtext: 'Live Multicast & Chat',
      icon: Radio,
      badge: isBroadcasting ? `${totalLiveViewers.toLocaleString()} Live` : 'Simultaneous'
    },
    {
      id: 'certify_the_content',
      number: '3',
      label: 'Certify the content',
      subtext: 'Schedule & Verify',
      icon: CalendarCheck,
      badge: hasFailures ? 'Alert' : `${scheduledCount} Queued`
    },
    {
      id: 'content_that_counts',
      number: '4',
      label: 'Content that counts',
      subtext: 'High-Impact Portfolio',
      icon: LayoutDashboard,
      badge: null
    },
    {
      id: 'climb_the_charts',
      number: '5',
      label: 'Climb the charts',
      subtext: 'Audience Analytics',
      icon: TrendingUp,
      badge: '+18.4%'
    },
    {
      id: 'contact_the_creators',
      number: '6',
      label: 'Contact the creators',
      subtext: 'Feed, Guild & Collabs',
      icon: Users,
      badge: 'Feed Live'
    },
    {
      id: 'cut_the_check',
      number: '7',
      label: 'CUT the check',
      subtext: 'Earnings & Payouts',
      icon: DollarSign,
      badge: `$${Math.round(totalEarnings).toLocaleString()}`
    }
  ];

  return (
    <nav className="bg-[#0B0E14] border-b border-zinc-800/80 px-4 lg:px-8 overflow-x-auto scrollbar-none sticky top-[65px] z-30 backdrop-blur-md">
      <div className="flex items-center justify-between min-w-max gap-3 py-2">
        {/* 7 CTC Categories */}
        <div className="flex items-center gap-1.5">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isActive = activeTab === cat.id;
            const isCutTheCheck = cat.id === 'cut_the_check';
            const isFailureAlert = cat.id === 'certify_the_content' && hasFailures;

            return (
              <button
                key={cat.id}
                onClick={() => setActiveTab(cat.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all relative group ${
                  isActive
                    ? isCutTheCheck
                      ? 'engraved-plate-gold text-amber-950 shadow-[0_0_15px_rgba(245,158,11,0.5)] font-black ring-1 ring-amber-300'
                      : 'engraved-plate-platinum text-slate-900 shadow-[0_0_15px_rgba(203,213,225,0.4)] font-black ring-1 ring-white'
                    : 'text-zinc-400 hover:text-amber-200 hover:bg-zinc-900/80 border border-transparent hover:border-zinc-800'
                }`}
              >
                {/* Category Number Badge */}
                <span
                  className={`w-4 h-4 rounded flex items-center justify-center text-[10px] font-mono font-black ${
                    isActive
                      ? isCutTheCheck
                        ? 'bg-amber-950 text-amber-300'
                        : 'bg-slate-900 text-sky-200'
                      : 'bg-zinc-800 text-zinc-400 group-hover:bg-zinc-700'
                  }`}
                >
                  {cat.number}
                </span>

                <Icon
                  className={`w-4 h-4 transition ${
                    isActive
                      ? isCutTheCheck
                        ? 'text-amber-950'
                        : 'text-slate-950'
                      : isFailureAlert
                      ? 'text-rose-400 animate-bounce'
                      : 'text-zinc-400'
                  }`}
                />

                <span className={isCutTheCheck ? 'font-black tracking-wide uppercase' : ''}>
                  {cat.label}
                </span>

                {cat.badge && (
                  <span
                    className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                      cat.id === 'cut_the_chat' && isBroadcasting
                        ? 'bg-red-500/20 text-red-400 border border-red-500/30 animate-pulse'
                        : isFailureAlert
                        ? 'bg-rose-500/30 text-rose-300 border border-rose-500/40'
                        : isCutTheCheck
                        ? 'bg-amber-950/20 text-amber-950 border border-amber-950/30 font-black'
                        : isActive
                        ? 'bg-slate-900/20 text-slate-900 font-black'
                        : 'bg-zinc-800 text-zinc-400'
                    }`}
                  >
                    {cat.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Action Shortcuts: Launch Control, Milestone Awards, Promote & Monitor Suite + Connected Platforms Vault */}
        <div className="flex items-center gap-2 ml-2">
          <button
            onClick={() => setActiveTab('launch')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black transition border shadow-md cursor-pointer ${
              activeTab === 'launch'
                ? 'bg-amber-500 text-slate-950 border-amber-300 shadow-[0_0_20px_rgba(245,158,11,0.6)] animate-pulse'
                : 'bg-zinc-900/90 text-amber-400 border-amber-500/40 hover:bg-amber-950/60 hover:text-white'
            }`}
            title="Open Major Label Executive Penthouse Launch Suite"
          >
            <Rocket className="w-3.5 h-3.5" />
            <span>Executive Launch</span>
          </button>

          <button
            onClick={() => setActiveTab('sponsorship')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition border ${
              activeTab === 'sponsorship'
                ? 'engraved-plate-gold text-amber-950 border-amber-600 shadow-[0_0_12px_rgba(245,158,11,0.5)] ring-1 ring-amber-400 font-black'
                : 'bg-zinc-900/60 text-amber-300 border-amber-500/30 hover:text-white hover:border-amber-400'
            }`}
            title="Partner with CTC — Sponsorship tiers & brand partnerships"
          >
            <Handshake className="w-3.5 h-3.5 text-amber-400" />
            <span>Sponsorship</span>
          </button>

          <button
            onClick={() => setActiveTab('milestone_awards')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition border ${
              activeTab === 'milestone_awards'
                ? 'engraved-plate-gold text-amber-950 border-amber-600 shadow-[0_0_12px_rgba(245,158,11,0.5)] ring-1 ring-amber-400 font-black'
                : 'bg-zinc-900/60 text-amber-300 border-amber-500/30 hover:text-white hover:border-amber-400'
            }`}
            title="Milestone Awards & Profile Trophy Wall (Gold, Platinum & Diamond Plaques)"
          >
            <Award className="w-3.5 h-3.5 text-amber-400" />
            <span>Milestone Awards</span>
            {milestonesCount !== undefined && (
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30 font-bold">
                {milestonesCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('promote_monitor')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition border ${
              activeTab === 'promote_monitor'
                ? 'bg-purple-600/20 text-purple-300 border-purple-500/50 shadow-md ring-1 ring-purple-500/30'
                : 'bg-zinc-900/60 text-zinc-400 border-zinc-800 hover:text-white hover:border-zinc-700'
            }`}
            title="Promote campaigns & Monitor real-time streaming telemetry"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Promote & Monitor</span>
          </button>

          <button
            onClick={() => setActiveTab('connections')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition border ${
              activeTab === 'connections'
                ? 'bg-zinc-800 text-white border-zinc-700'
                : 'bg-zinc-900/60 text-zinc-400 border-zinc-800 hover:text-white hover:border-zinc-700'
            }`}
            title="Manage connected accounts & RTMP keys"
          >
            <Link2 className="w-3.5 h-3.5 text-blue-400" />
            <span>Platforms (47)</span>
          </button>

          <button
            onClick={() => window.dispatchEvent(new CustomEvent('open-pwa-install'))}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition border border-amber-500/40 bg-gradient-to-r from-amber-500/10 to-yellow-500/10 text-amber-300 hover:border-amber-400 hover:text-white cursor-pointer shadow-xs"
            title="Add to Home Screen - Native Mobile PWA"
          >
            <Download className="w-3.5 h-3.5 text-amber-400" />
            <span>Add to Home Screen</span>
          </button>
        </div>
      </div>
    </nav>
  );
};
