import React, { useState } from 'react';
import {
  Check,
  Zap,
  Sparkles,
  ShieldCheck,
  CreditCard,
  Crown,
  Radio,
  Share2,
  DollarSign,
  ArrowRight,
  Layers,
  X,
  Gem,
  Award,
  Disc3,
  FileCheck2
} from 'lucide-react';
import { SubscriptionTierId, SubscriptionTier } from '../../types';

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
      '10 Gemini AI caption generations / mo'
    ],
    limitations: [
      'No 1080p or 4K live multicasting',
      'Limited to 3 channels simultaneously',
      'Standard payout delays'
    ],
    maxConnectedPlatforms: 3,
    maxStreamingResolution: '720p60',
    payoutSpeed: '5 Business Days',
    aiCreditsPerMonth: 10
  },
  {
    id: 'paid',
    name: 'Paid Subscription',
    tagline: '24K Gold Label Partner Deal',
    badge: 'GOLD CERTIFIED',
    priceMonthly: 29,
    priceAnnually: 24,
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
      'Unified multi-chat with custom filters'
    ],
    maxConnectedPlatforms: 8,
    maxStreamingResolution: '1080p60',
    payoutSpeed: '48 Hours Priority',
    aiCreditsPerMonth: 100,
    isPopular: true
  },
  {
    id: 'premium',
    name: 'Premium Subscription',
    tagline: 'Diamond Mogul Master Deal',
    badge: 'DIAMOND CERTIFIED',
    priceMonthly: 99,
    priceAnnually: 79,
    description: 'Complete creator command center with all 47 platforms and zero-delay instant payouts.',
    features: [
      'ALL 47 Major Streaming Platforms Unlocked',
      '4K60 HDR broadcast relay with dual-redundant servers',
      '0-Second Instant Payouts (Direct Stripe & Card Deposit)',
      'Unlimited Gemini AI Creator Copilot & hook generator',
      'Escrow Contract Protection for hiring cameramen & editors',
      'Full lifetime audience analytics & retention export',
      'Custom RTMP / SRT Whitelabel CDN endpoints',
      'AI Auto-moderation across all live channel chats',
      'VIP 24/7 Dedicated Stream Engineer Support'
    ],
    maxConnectedPlatforms: 'all_14',
    maxStreamingResolution: '4K60 HDR',
    payoutSpeed: '0-Second Instant Payout',
    aiCreditsPerMonth: 'unlimited'
  }
];

export const SubscriptionModal: React.FC<SubscriptionModalProps> = ({
  isOpen,
  onClose,
  currentTier,
  onSelectTier,
  currencySymbol = '$'
}) => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annually'>('annually');
  const [selectedNotice, setSelectedNotice] = useState<string | null>(null);

  if (!isOpen) return null;

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
      <div className="bg-[#090D15] rounded-3xl border border-amber-500/40 w-full max-w-5xl p-6 lg:p-8 shadow-[0_0_50px_rgba(0,0,0,0.9)] relative my-8 animate-in fade-in zoom-in-95 duration-200">
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

          {/* Billing Cycle Toggle */}
          <div className="pt-2 flex items-center justify-center gap-3 text-xs">
            <span className={billingCycle === 'monthly' ? 'text-amber-200 font-bold' : 'text-zinc-500'}>
              Monthly Terms
            </span>
            <button
              onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'annually' : 'monthly')}
              className="w-12 h-6 rounded-full bg-zinc-900 border border-amber-500/40 p-0.5 transition-colors relative"
            >
              <div
                className={`w-5 h-5 rounded-full bg-gold-metallic transition-transform ${
                  billingCycle === 'annually' ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
            <div className="flex items-center gap-1.5">
              <span className={billingCycle === 'annually' ? 'text-amber-200 font-bold' : 'text-zinc-500'}>
                Annual Deal Term
              </span>
              <span className="engraved-plate-gold text-[9px] font-black px-2 py-0.5 rounded shadow-sm">
                SAVE 20%
              </span>
            </div>
          </div>
        </div>

        {/* Success Confirmation Alert */}
        {selectedNotice && (
          <div className="mb-6 p-4 rounded-2xl engraved-plate-gold text-amber-950 text-center font-black text-sm animate-in fade-in shadow-xl">
            🏆 Deal Term Executed: <span className="uppercase underline">{selectedNotice} PLAQUE</span>! Escrow and platform clearance are now active.
          </div>
        )}

        {/* 3 Pricing Plaque Cards: Silver, 24K Gold, Multi-Diamond */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {SUBSCRIPTION_TIERS.map((tier) => {
            const isCurrent = currentTier === tier.id;
            const price = billingCycle === 'annually' ? tier.priceAnnually : tier.priceMonthly;

            const plaqueClass =
              tier.id === 'premium'
                ? 'plaque-diamond'
                : tier.id === 'paid'
                ? 'plaque-gold'
                : 'plaque-platinum';

            const nameplateClass =
              tier.id === 'premium'
                ? 'engraved-plate-platinum text-slate-900'
                : tier.id === 'paid'
                ? 'engraved-plate-gold text-amber-950'
                : 'engraved-plate-dark text-slate-200';

            const dealBtnClass =
              tier.id === 'premium'
                ? 'deal-btn-diamond'
                : tier.id === 'paid'
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
                        tier.id === 'premium'
                          ? 'bg-sky-400 text-slate-950 border border-white'
                          : tier.id === 'paid'
                          ? 'engraved-plate-gold text-amber-950 border border-amber-300'
                          : 'bg-zinc-800 text-zinc-300 border border-zinc-700'
                      }`}
                    >
                      {tier.id === 'premium' ? <Gem className="w-3 h-3 text-slate-950" /> : <Award className="w-3 h-3" />}
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
                  <div className={`p-4 rounded-xl mb-6 ${nameplateClass}`}>
                    <div className="flex items-baseline justify-between">
                      <div className="flex items-baseline gap-1">
                        <span className="text-3xl lg:text-4xl font-black font-mono">
                          {currencySymbol}{price}
                        </span>
                        <span className="text-xs font-bold opacity-80">/ month</span>
                      </div>
                      <span className="text-[9px] font-mono uppercase font-black tracking-widest opacity-70">
                        {tier.id === 'premium' ? 'MOGUL RATE' : tier.id === 'paid' ? 'LABEL SPLIT' : 'INDIE RATE'}
                      </span>
                    </div>
                    {tier.priceMonthly > 0 && billingCycle === 'annually' && (
                      <span className="text-[10px] font-extrabold block mt-1 opacity-90">
                        Annual deal contract ({currencySymbol}{price * 12}/yr)
                      </span>
                    )}
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
                        <span>Current Deal Active</span>
                      </span>
                    ) : (
                      <>
                        <span>Execute {tier.name.split(' ')[0]} Deal</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
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
