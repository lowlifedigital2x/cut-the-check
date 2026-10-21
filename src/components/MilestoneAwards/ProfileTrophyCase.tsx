import React, { useState } from 'react';
import {
  Award,
  Crown,
  Sparkles,
  Share2,
  ExternalLink,
  ShieldCheck,
  Check,
  Eye,
  Disc3,
  Flame,
  TrendingUp,
  Radio,
  DollarSign,
  Users
} from 'lucide-react';
import { MilestoneAward, PlatformConnection, SubscriptionTierId } from '../../types';
import { PlaqueCard } from './PlaqueCard';
import ctcEagleDiamondImg from '../../assets/images/ctc_eagle_diamond.jpg';

interface ProfileTrophyCaseProps {
  milestones: MilestoneAward[];
  onToggleDisplay: (id: string) => void;
  onInspect: (milestone: MilestoneAward) => void;
  onSwitchToVault: () => void;
  subscriptionTier?: SubscriptionTierId;
}

export const ProfileTrophyCase: React.FC<ProfileTrophyCaseProps> = ({
  milestones,
  onToggleDisplay,
  onInspect,
  onSwitchToVault,
  subscriptionTier = 'gold'
}) => {
  const [copiedProfileLink, setCopiedProfileLink] = useState(false);

  const displayedPlaques = milestones.filter((m) => m.unlocked && m.isDisplayedOnProfile);
  const goldCount = displayedPlaques.filter((m) => m.tier === 'gold').length;
  const platinumCount = displayedPlaques.filter((m) => m.tier === 'platinum').length;
  const diamondCount = displayedPlaques.filter((m) => m.tier === 'diamond').length;

  const handleShareProfile = () => {
    navigator.clipboard?.writeText?.('https://cutthecheck.app/creator/alex-rivers#trophy-case');
    setCopiedProfileLink(true);
    setTimeout(() => setCopiedProfileLink(false), 2500);
  };

  return (
    <div className="space-y-8">
      {/* Creator Profile Executive Header Card */}
      <div className="plaque-gold p-6 lg:p-8 relative overflow-hidden">
        {/* Ambient Plaque Background Disc Graphic */}
        <div className="absolute -right-16 -top-16 w-64 h-64 rounded-full grooved-record-disc opacity-15 pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          {/* Creator Identity with CTC Eagle Diamond Medallion */}
          <div className="flex items-center gap-5">
            <div className="relative">
              <div className="w-20 h-20 rounded-2xl overflow-hidden border-2 border-amber-400 shadow-xl bg-zinc-900">
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=240&auto=format&fit=crop&q=80"
                  alt="Alex Rivers Profile"
                  className="w-full h-full object-cover"
                />
              </div>
              {/* CTC Verified Eagle Bezel Badge */}
              <div
                className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full p-0.5 bg-gradient-to-tr from-amber-400 via-amber-200 to-amber-600 shadow-lg border border-black flex items-center justify-center"
                title="CTC Official Verified Creator Seal"
              >
                <img
                  src={ctcEagleDiamondImg}
                  alt="Official Eagle Medallion"
                  className="w-full h-full object-cover rounded-full"
                />
              </div>
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl font-black text-white tracking-wide">
                  Alex Rivers
                </h1>
                <span className="engraved-plate-gold text-[10px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded shadow-sm">
                  VERIFIED RECORDING CREATOR
                </span>
                <span className="text-xs font-mono text-zinc-400">@alexrivers</span>
              </div>

              <p className="text-xs text-zinc-300 mt-1 max-w-xl">
                Electronic Producer, Synthesist & Live Multicast Broadcaster. Syndicating across 47 networks with automated escrow settlements.
              </p>

              {/* Badges strip */}
              <div className="flex flex-wrap items-center gap-2 mt-3">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold bg-amber-500/10 text-amber-300 border border-amber-500/30">
                  <Crown className="w-3.5 h-3.5 text-amber-400" />
                  <span>{subscriptionTier === 'diamond' ? 'Diamond Mogul Conglomerate Deal' : subscriptionTier === 'platinum' ? 'Platinum Executive Master Deal' : 'Gold Label Partner Deal'}</span>
                </span>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold bg-sky-500/10 text-sky-300 border border-sky-500/30">
                  <ShieldCheck className="w-3.5 h-3.5 text-sky-400" />
                  <span>RIAA-Grade Certified Trophy Wall</span>
                </span>
              </div>
            </div>
          </div>

          {/* Quick Profile Trophy Stats & Share Action */}
          <div className="flex flex-col sm:flex-row md:flex-col items-start md:items-end justify-between gap-3 border-t md:border-t-0 md:border-l border-zinc-800/80 pt-4 md:pt-0 md:pl-6">
            <div className="flex items-center gap-4 text-center">
              <div>
                <span className="text-[10px] uppercase font-mono text-zinc-400 block">Total Plaques</span>
                <span className="text-xl font-black text-white font-mono">{displayedPlaques.length}</span>
              </div>
              <div className="border-l border-zinc-800 pl-4">
                <span className="text-[10px] uppercase font-mono text-amber-400 block">Gold</span>
                <span className="text-xl font-black text-amber-300 font-mono">{goldCount}</span>
              </div>
              <div className="border-l border-zinc-800 pl-4">
                <span className="text-[10px] uppercase font-mono text-slate-300 block">Platinum</span>
                <span className="text-xl font-black text-slate-200 font-mono">{platinumCount}</span>
              </div>
              <div className="border-l border-zinc-800 pl-4">
                <span className="text-[10px] uppercase font-mono text-sky-300 block">Diamond</span>
                <span className="text-xl font-black text-sky-300 font-mono">{diamondCount}</span>
              </div>
            </div>

            <div className="flex items-center gap-2 w-full md:w-auto">
              <button
                onClick={handleShareProfile}
                className="deal-btn-platinum py-2 px-3.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 flex-1 md:flex-initial justify-center shadow-md"
              >
                {copiedProfileLink ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Copied Profile Link!</span>
                  </>
                ) : (
                  <>
                    <Share2 className="w-3.5 h-3.5 text-slate-800" />
                    <span>CTC Share Trophy Wall</span>
                  </>
                )}
              </button>

              <button
                onClick={onSwitchToVault}
                className="deal-btn-gold py-2 px-3.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 flex-1 md:flex-initial justify-center shadow-md"
              >
                <Award className="w-3.5 h-3.5 text-amber-950" />
                <span>Plaque Vault ({milestones.length})</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* The Gallery Wall: Spotlight Illumination & Smoked Velvet Presentation */}
      <div className="relative rounded-3xl p-6 sm:p-10 bg-radial from-[#121626] via-[#090C15] to-[#04060A] border-2 border-zinc-800/80 shadow-2xl overflow-hidden">
        
        {/* Overhead Gallery Spotlights simulation */}
        <div className="absolute top-0 left-1/4 -translate-x-1/2 w-72 h-44 bg-gradient-to-b from-amber-300/15 via-amber-400/5 to-transparent blur-2xl pointer-events-none" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-80 h-44 bg-gradient-to-b from-sky-300/15 via-sky-400/5 to-transparent blur-2xl pointer-events-none" />
        <div className="absolute top-0 left-3/4 -translate-x-1/2 w-72 h-44 bg-gradient-to-b from-amber-300/15 via-amber-400/5 to-transparent blur-2xl pointer-events-none" />

        {/* Gallery Lighting Rail bar */}
        <div className="w-full h-1 bg-gradient-to-r from-transparent via-zinc-600 to-transparent mb-8 flex justify-around relative">
          <span className="w-3 h-3 rounded-full bg-amber-200 shadow-[0_0_12px_#FDE68A] -top-1 relative" />
          <span className="w-3 h-3 rounded-full bg-sky-200 shadow-[0_0_12px_#BAE6FD] -top-1 relative" />
          <span className="w-3 h-3 rounded-full bg-amber-200 shadow-[0_0_12px_#FDE68A] -top-1 relative" />
        </div>

        {/* Wall Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-wider uppercase drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                Official Creator Trophy Wall
              </h2>
            </div>
            <p className="text-xs text-zinc-400 mt-1">
              Commemorative physical-grade digital award plaques mounted for global industry inspection.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-zinc-400">
              {displayedPlaques.length} of {milestones.filter((m) => m.unlocked).length} Awarded Plaques Displayed
            </span>
            <button
              onClick={onSwitchToVault}
              className="text-xs text-amber-400 hover:text-amber-300 font-bold underline underline-offset-4 ml-2"
            >
              Manage Mounted Plaques →
            </button>
          </div>
        </div>

        {/* Plaque Grid on the Gallery Wall */}
        {displayedPlaques.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
            {displayedPlaques.map((plaque) => (
              <PlaqueCard
                key={plaque.id}
                milestone={plaque}
                onToggleDisplay={onToggleDisplay}
                onInspect={onInspect}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 px-4 relative z-10 border-2 border-dashed border-zinc-800 rounded-2xl bg-black/40">
            <Award className="w-16 h-16 text-amber-400/50 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-white">No Plaques Currently Mounted on Your Wall</h3>
            <p className="text-xs text-zinc-400 max-w-md mx-auto mt-1 mb-5">
              You have unlocked award plaques in your private vault! Choose which Gold, Platinum, and Diamond plaques to mount proudly on your profile.
            </p>
            <button
              onClick={onSwitchToVault}
              className="deal-btn-gold px-5 py-2.5 rounded-xl text-xs font-black inline-flex items-center gap-2 shadow-lg"
            >
              <Sparkles className="w-4 h-4 text-amber-950" />
              <span>Mount Plaques from Vault</span>
            </button>
          </div>
        )}

        {/* Wall Bottom Brass Bar Footer */}
        <div className="mt-10 pt-4 border-t border-zinc-800/80 flex flex-col sm:flex-row sm:items-center justify-between text-xs text-zinc-500 font-mono gap-2">
          <span>CTC GUILD CERTIFICATION LEDGER • AUDITED METRICS</span>
          <span>DISCLAIMER: DIGITALLY SEALED IN RECOGNITION OF VERIFIED STREAMING DATA</span>
        </div>
      </div>
    </div>
  );
};
