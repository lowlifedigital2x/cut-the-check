import React, { useState } from 'react';
import {
  Check,
  Zap,
  Sparkles,
  ShieldCheck,
  CreditCard,
  Radio,
  Share2,
  DollarSign,
  ArrowRight,
  Layers,
  X,
  Gem,
  Award,
  Disc3,
  FileCheck2,
  Megaphone,
  Podcast,
  Ticket,
  Plus
} from 'lucide-react';
import { SubscriptionTierId, SubscriptionTier, SubscriptionAddOn } from '../../types';

interface SubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentTier: SubscriptionTierId;
  onSelectTier: (tierId: SubscriptionTierId) => void;
  currencySymbol?: string;
}

export const SUBSCRIPTION_TIERS: SubscriptionTier[] = [
  {
    id: 'free',
    name: 'Free Subscription',
    tagline: 'Independent Artist Plaque',
    badge: 'SILVER CERTIFIED',
    priceMonthly: 0,
    priceAnnually: 0,
    description: 'Essential multi-broadcasting & content publishing tools for emerging creators.',
    features: [
      'Connect up to 3 streaming platforms',
      '720p60 RTMP live relay encoding',
      'Basic multi-post queue (Audio, Video, Post)',
      '7-day audience metrics history',
      'Standard community creator guild access',
      'Standard 5-day payout clearance',
      '10 Gemini AI caption generations / mo',
      'Recording & editing included',
      'Distribution: you keep 100% of distribution revenue (0% CTC cut)'
    ],
    limitations: [
      'No 1080p or 4K live multicasting',
      'Limited to 3 channels simultaneously',
      'Standard payout delays'
    ],
    maxConnectedPlatforms: 3,
    maxStreamingResolution: '720p60',
    payoutSpeed: '5 Business Days',
    aiCreditsPerMonth: 10,
    distributionTakePercent: 0
  },
  {
    id: 'gold',
    name: 'Gold Subscription',
    tagline: '24K Gold Label Partner Deal',
    badge: 'GOLD CERTIFIED',
    priceMonthly: 2.08,
    priceAnnually: 24.99,
    description: 'High-power multi-channel studio with verified scheduling and priority payouts.',
    features: [
      'Connect up to 8 major streaming platforms',
      '1080p60 ultra low-latency RTMP/SRT relay',
      'Unlimited 1-click publishing (Audio, Video, Live, Pod, Post)',
      'Certified Content Scheduler with failure alerts & retry',
      '90-day audience intelligence & demographic heatmaps',
      'Direct messaging & talent hiring on Creator Guild',
      'Priority 2-day payouts & CSV financial export',
      '100 Gemini AI copilot credits / mo',
      'AI cover art included',
      'Unified multi-chat with custom filters',
      'Recording & editing included',
      'Distribution: you keep 100% of distribution revenue (0% CTC cut)'
    ],
    maxConnectedPlatforms: 8,
    maxStreamingResolution: '1080p60',
    payoutSpeed: '48 Hours Priority',
    aiCreditsPerMonth: 100,
    distributionTakePercent: 0,
    isPopular: true
  },
  {
    id: 'platinum',
    name: 'Platinum Subscription',
    tagline: 'Platinum Executive Master Deal',
    badge: 'PLATINUM CERTIFIED',
    priceMonthly: 3.75,
    priceAnnually: 44.99,
    description: 'Complete creator command center with all 47 platforms and zero-delay instant payouts.',
    features: [
      'ALL 47 Major Streaming Platforms Unlocked',
      '4K60 HDR broadcast relay with dual-redundant servers',
      '0-Second Instant Payouts (Direct Stripe & Card Deposit)',
      'Unlimited Gemini AI Creator Copilot & hook generator',
      'AI cover art included',
      'Escrow Contract Protection for hiring cameramen & editors',
      'Full lifetime audience analytics & retention export',
      'Custom RTMP / SRT Whitelabel CDN endpoints',
      'AI Auto-moderation across all live channel chats',
      'VIP 24/7 Dedicated Stream Engineer Support',
      'Recording & editing included',
      'Distribution: you keep 100% of distribution revenue (0% CTC cut)'
    ],
    maxConnectedPlatforms: 'all_47',
    maxStreamingResolution: '4K60 HDR',
    payoutSpeed: '0-Second Instant Payout',
    aiCreditsPerMonth: 'unlimited',
    distributionTakePercent: 0
  },
  {
    id: 'diamond',
    name: 'Diamond Subscription',
    tagline: 'Diamond Mogul Conglomerate Deal',
    badge: 'DIAMOND CERTIFIED',
    priceMonthly: 7.50,
    priceAnnually: 89.99,
    description: 'The full CTC stack at roster scale: every platform, every artist, one conglomerate command center.',
    features: [
      'ALL 47 platforms unlocked for every artist on your roster',
      'Label registration · 5 artist seats, each with the full stack & its own CTC Certify plaque',
      'Launch Everywhere roster-wide: all 23 live platforms at once, per artist',
      'Label-wide Insight rollup with per-platform revenue per artist',
      'Sponsorship inventory access: roster placement in CTC sponsor deals',
      '0-Second Instant Payouts with per-artist Wallet sub-accounts',
      'Escrow Contract Protection across the entire roster',
      'Unlimited Gemini AI Creator Copilot for every seat',
      'AI cover art included',
      'AI billboard campaigns included',
      'Dedicated label partnerships & deals team',
      'Recording & editing included',
      'Distribution: you keep 100% of distribution revenue (0% CTC cut)'
    ],
    maxConnectedPlatforms: 'all_47',
    maxStreamingResolution: '4K60 HDR',
    payoutSpeed: '0-Second Instant Payout',
    aiCreditsPerMonth: 'unlimited',
    distributionTakePercent: 0,
    artistSeats: 5
  }
];

export const SUBSCRIPTION_ADD_ONS: SubscriptionAddOn[] = [
  {
    id: 'ai_pack',
    name: 'AI Pack',
    description: 'Extra AI credits and creator AI tools',
    priceLabel: 'from $4.99'
  },
  {
    id: 'mastering',
    name: 'Mastering',
    description: 'Professional mastering for every release',
    priceLabel: '$9.99/track'
  },
  {
    id: 'campaign',
    name: 'Campaign',
    description: 'Full release campaign across the network',
    priceLabel: 'from $49/campaign'
  },
  {
    id: 'radio_publicity',
    name: 'Radio Publicity',
    description: 'Radio promotion and publicity run',
    priceLabel: 'from $99/campaign'
  },
  {
    id: 'podcast',
    name: 'Podcast',
    description: 'Podcast content distribution — audio and video podcasts to all platforms',
    priceLabel: '$14.99/yr'
  },
  {
    id: 'showcase_concert',
    name: 'Showcase Concert',
    description: 'CTC-sponsored live showcases — perform your release in front of brands and fans',
    priceLabel: 'Application',
    priceNote: 'Diamond agreements get priority placement'
  }
];

const ADD_ON_ICONS: Record<string, React.ElementType> = {
  ai_pack: Sparkles,
  mastering: Disc3,
  campaign: Megaphone,
  radio_publicity: Radio,
  podcast: Podcast,
  showcase_concert: Ticket
};

export const SubscriptionModal: React.FC<SubscriptionModalProps> = ({
  isOpen,
  onClose,
  currentTier,
  onSelectTier,
  currencySymbol = '$'
}) => {
  const [selectedNotice, setSelectedNotice] = useState<string | null>(null);
  const [addedAddOns, setAddedAddOns] = useState<Set<string>>(new Set());

  if (!isOpen) return null;

  const handleToggleAddOn = (addOnId: string) => {
    setAddedAddOns((prev) => {
      const next = new Set(prev);
      if (next.has(addOnId)) {
        next.delete(addOnId);
      } else {
        next.add(addOnId);
      }
      return next;
    });
  };

  const handleSelect = (tierId: SubscriptionTierId) => {
    onSelectTier(tierId);
    setSelectedNotice(tierId);
    setTimeout(() => {
      setSelectedNotice(null);
      onClose();
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[#090D15] rounded-3xl border border-amber-500/40 w-full max-w-7xl p-6 lg:p-8 shadow-[0_0_50px_rgba(0,0,0,0.9)] relative my-8 animate-in fade-in zoom-in-95 duration-200">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center max-w-2xl mx-auto space-y-2.5 mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full engraved-plate-gold text-[10px] font-black uppercase tracking-widest">
            <Award className="w-3.5 h-3.5 text-amber-950" />
            <span>OFFICIAL RECORDING & CONTENT DEAL AGREEMENTS</span>
          </div>

          <h2 className="text-2xl lg:text-3xl font-black text-white tracking-tight">
            Execute Your <span className="text-gold-gradient">CUT THE CHECK</span> Deal Plaque
          </h2>
          <p className="text-xs lg:text-sm text-zinc-400">
            Certified licensing tiers engineered as executive award plaques. Choose your scale, unlock all 47 networks, and accelerate instant payouts.
          </p>

          {/* Agreement Term Banner */}
          <div className="pt-2 flex items-center justify-center gap-2 text-xs">
            <span className="engraved-plate-gold text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full shadow-sm flex items-center gap-1.5">
              <FileCheck2 className="w-3.5 h-3.5 text-amber-950" />
              <span>12-Month Agreement — All Deals Billed Annually</span>
            </span>
          </div>

          {/* Professional Services Line */}
          <div className="pt-2">
            <p className="engraved-plate-dark text-slate-200 text-[11px] lg:text-xs font-bold px-4 py-2.5 rounded-xl leading-relaxed">
              Every agreement runs on all 47 platforms —{' '}
              <span className="text-amber-300 font-black">Publishing • Marketing • Management • Licensing • Certifying • Recording • Editing</span>{' '}
              included in every agreement.
            </p>
          </div>
        </div>

        {/* Success Confirmation Alert */}
        {selectedNotice && (
          <div className="mb-6 p-4 rounded-2xl engraved-plate-gold text-amber-950 text-center font-black text-sm animate-in fade-in shadow-xl">
            🏆 12-Month Agreement Executed: <span className="uppercase underline">{selectedNotice} PLAQUE</span>! Escrow and platform clearance are now active for your 12-month term.
          </div>
        )}

        {/* 4 Pricing Plaque Cards: Silver, 24K Gold, Platinum, Diamond */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {SUBSCRIPTION_TIERS.map((tier) => {
            const isCurrent = currentTier === tier.id;

            const plaqueClass =
              tier.id === 'diamond'
                ? 'plaque-diamond'
                : tier.id === 'platinum'
                ? 'plaque-platinum'
                : tier.id === 'gold'
                ? 'plaque-gold'
                : 'plaque-silver';

            const nameplateClass =
              tier.id === 'diamond'
                ? 'engraved-plate-platinum text-slate-900'
                : tier.id === 'platinum'
                ? 'engraved-plate-platinum text-slate-900'
                : tier.id === 'gold'
                ? 'engraved-plate-gold text-amber-950'
                : 'engraved-plate-dark text-slate-200';

            const dealBtnClass =
              tier.id === 'diamond'
                ? 'deal-btn-diamond'
                : tier.id === 'platinum'
                ? 'deal-btn-platinum'
                : tier.id === 'gold'
                ? 'deal-btn-gold'
                : 'deal-btn-platinum';

            return (
              <div
                key={tier.id}
                className={`${plaqueClass} p-6 flex flex-col justify-between transition-all relative overflow-hidden`}
              >
                {/* Plaque Header Badge */}
                {tier.badge && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-20">
                    <span
                      className={`text-[9px] font-black uppercase tracking-widest px-3 py-0.5 rounded-full shadow-md flex items-center gap-1 ${
                        tier.id === 'diamond'
                          ? 'bg-sky-400 text-slate-950 border border-white'
                          : tier.id === 'platinum'
                          ? 'bg-slate-200 text-slate-950 border border-white'
                          : tier.id === 'gold'
                          ? 'engraved-plate-gold text-amber-950 border border-amber-300'
                          : 'bg-zinc-800 text-zinc-300 border border-zinc-700'
                      }`}
                    >
                      {tier.id === 'diamond' ? <Gem className="w-3 h-3 text-slate-950" /> : <Award className="w-3 h-3" />}
                      <span>{tier.badge}</span>
                    </span>
                  </div>
                )}

                {/* Grooved Disc Watermark Motif in Plaque Background */}
                <div className="absolute -right-10 -top-10 w-36 h-36 rounded-full grooved-record-disc opacity-25 pointer-events-none" />

                <div className="relative z-10">
                  <div className="mb-4">
                    <h3 className="text-lg font-black text-white">{tier.name}</h3>
                    <span className="text-xs text-amber-300/80 font-semibold">{tier.tagline}</span>
                    <p className="text-xs text-zinc-400 mt-2 min-h-[32px]">{tier.description}</p>
                  </div>

                  {/* Engraved Plaque Nameplate (Price Block) */}
                  <div className={`p-4 rounded-xl mb-4 ${nameplateClass}`}>
                    <div className="flex items-baseline justify-between">
                      <div className="flex items-baseline gap-1">
                        <span className="text-3xl lg:text-4xl font-black font-mono">
                          {currencySymbol}{tier.priceAnnually > 0 ? tier.priceAnnually.toFixed(2) : '0'}
                        </span>
                        <span className="text-xs font-bold opacity-80">/ yr</span>
                      </div>
                      <span className="text-[9px] font-mono uppercase font-black tracking-widest opacity-70">
                        {tier.id === 'diamond' ? 'ROSTER RATE' : tier.id === 'platinum' ? 'EXECUTIVE RATE' : tier.id === 'gold' ? 'LABEL SPLIT' : 'INDIE RATE'}
                      </span>
                    </div>
                    {tier.priceAnnually > 0 ? (
                      <span className="text-[10px] font-extrabold block mt-1 opacity-90">
                        {currencySymbol}{tier.priceMonthly.toFixed(2)}/mo, billed annually
                      </span>
                    ) : (
                      <span className="text-[10px] font-extrabold block mt-1 opacity-90">
                        Free forever — no card required
                      </span>
                    )}
                    <span className="text-[9px] font-mono uppercase font-black tracking-widest block mt-1.5 opacity-70">
                      12-Month Agreement
                    </span>
                  </div>

                  {/* Distribution Take Line */}
                  <div className="flex items-center gap-1.5 mb-6 text-[11px] font-bold text-emerald-300/90">
                    <Share2 className="w-3.5 h-3.5 shrink-0" />
                    <span>
                      {tier.distributionTakePercent === 0
                        ? 'Distribution: You keep 100% (0% cut)'
                        : `Distribution: CTC keeps ${tier.distributionTakePercent}%`}
                    </span>
                  </div>

                  {/* Feature Highlights */}
                  <div className="space-y-3 mb-6">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-amber-200/70 block">
                      Deal Rights & Capabilities:
                    </span>
                    <ul className="space-y-2 text-xs text-zinc-300">
                      {tier.features.map((feat, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <Check className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Major Content Deal Action Button */}
                <div className="pt-4 border-t border-zinc-800/80 relative z-10">
                  <button
                    onClick={() => handleSelect(tier.id)}
                    disabled={isCurrent}
                    className={`w-full py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition shadow-lg flex items-center justify-center gap-1.5 ${
                      isCurrent
                        ? 'bg-zinc-800 text-zinc-500 cursor-default border border-zinc-700'
                        : dealBtnClass
                    }`}
                  >
                    {isCurrent ? (
                      <span className="flex items-center gap-1">
                        <FileCheck2 className="w-4 h-4" />
                        <span>Current Agreement Active</span>
                      </span>
                    ) : (
                      <>
                        <span>CTC Sign — {tier.name.split(' ')[0]} Agreement</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Enhance Your Agreement — Add-Ons */}
        <div className="mt-10">
          <div className="text-center mb-6 space-y-2.5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full engraved-plate-dark text-slate-200 border border-zinc-700 text-[10px] font-black uppercase tracking-widest">
              <Layers className="w-3.5 h-3.5 text-amber-300" />
              <span>Enhance Your Agreement — Add-Ons</span>
            </div>
            <p className="text-xs text-zinc-400">
              Professional services stacked onto any 12-month agreement.
              {addedAddOns.size > 0 && (
                <span className="text-emerald-300 font-bold">
                  {' '}
                  {addedAddOns.size} add-on{addedAddOns.size > 1 ? 's' : ''} added to your agreement.
                </span>
              )}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {SUBSCRIPTION_ADD_ONS.map((addOn) => {
              const Icon = ADD_ON_ICONS[addOn.id] ?? Sparkles;
              const isAdded = addedAddOns.has(addOn.id);
              return (
                <div
                  key={addOn.id}
                  className={`rounded-2xl border p-5 flex flex-col justify-between transition-all ${
                    isAdded
                      ? 'border-amber-400/70 bg-amber-400/5 shadow-[0_0_25px_rgba(245,197,66,0.08)]'
                      : 'border-zinc-800 bg-zinc-950/60 hover:border-zinc-600'
                  }`}
                >
                  <div>
                    <div className="flex items-center gap-2.5 mb-2">
                      <span
                        className={`p-2 rounded-lg border ${
                          isAdded
                            ? 'bg-amber-400/15 border-amber-400/40 text-amber-300'
                            : 'bg-zinc-900 border-zinc-800 text-amber-300/80'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                      </span>
                      <h4 className="text-sm font-black text-white">{addOn.name}</h4>
                    </div>
                    <p className="text-xs text-zinc-400 leading-relaxed min-h-[32px]">{addOn.description}</p>
                    {addOn.priceNote && (
                      <p className="text-[10px] font-bold text-sky-300/90 mt-1.5 flex items-center gap-1">
                        <Gem className="w-3 h-3 shrink-0" />
                        <span>{addOn.priceNote}</span>
                      </p>
                    )}
                  </div>

                  <div className="mt-4 pt-4 border-t border-zinc-800/80 flex items-center justify-between gap-3">
                    <span className="font-mono text-sm font-black text-amber-300">{addOn.priceLabel}</span>
                    <button
                      onClick={() => handleToggleAddOn(addOn.id)}
                      className={`px-3 py-2 rounded-lg text-[11px] font-black uppercase tracking-wider transition flex items-center gap-1.5 ${
                        isAdded
                          ? 'engraved-plate-gold text-amber-950 shadow-md'
                          : 'bg-zinc-900 border border-amber-500/40 text-amber-200 hover:border-amber-400 hover:text-amber-100'
                      }`}
                    >
                      {isAdded ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>CTC Added ✓</span>
                        </>
                      ) : (
                        <>
                          <Plus className="w-3.5 h-3.5" />
                          <span>CTC Add</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Guarantee Banner */}
        <div className="mt-8 pt-6 border-t border-zinc-800/80 flex flex-col sm:flex-row sm:items-center justify-between text-xs text-zinc-500 gap-2">
          <div className="flex items-center gap-2 text-amber-200/70">
            <ShieldCheck className="w-4 h-4 text-amber-400" />
            <span>Official digital creator deal memo. Escrow security backed by 256-bit encryption.</span>
          </div>
          <span className="font-mono text-zinc-400">RIAA • CTC GLOBAL AUDITING CERTIFIED</span>
        </div>
      </div>
    </div>
  );
};
