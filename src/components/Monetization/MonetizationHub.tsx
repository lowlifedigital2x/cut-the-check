import React, { useState } from 'react';
import {
  DollarSign,
  CreditCard,
  ArrowUpRight,
  Download,
  CheckCircle,
  Clock,
  Sparkles,
  TrendingUp,
  Building,
  HelpCircle,
  ExternalLink,
  ChevronRight,
  Award,
  ShieldCheck,
  FileCheck,
  Disc3,
  Layers
} from 'lucide-react';
import { PlatformConnection, RevenueStream, ContentItem, PlatformId } from '../../types';
import { PLATFORM_CONFIGS, INITIAL_REVENUE_STREAMS } from '../../data/mockData';
import { PlatformBadge } from '../common/PlatformBadge';
import { OwnerTagline } from '../common/OwnerTagline';

interface MonetizationHubProps {
  connections: PlatformConnection[];
  revenueStreams?: RevenueStream[];
  contentItems: ContentItem[];
  currencySymbol?: string;
  subscriptionTier?: string;
  onOpenSubscriptionModal?: () => void;
}

export const MonetizationHub: React.FC<MonetizationHubProps> = ({
  connections,
  revenueStreams = INITIAL_REVENUE_STREAMS,
  contentItems,
  currencySymbol = '$',
  subscriptionTier = 'gold',
  onOpenSubscriptionModal
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [payoutTriggered, setPayoutTriggered] = useState(false);
  const [payoutSuccessMessage, setPayoutSuccessMessage] = useState<string | null>(null);

  const totalMonthlyEarnings = connections.reduce((acc, c) => acc + c.monthlyRevenue, 0);
  const availableEarnings = revenueStreams
    .filter((r) => r.payoutStatus === 'Available')
    .reduce((acc, r) => acc + r.amount, 0);
  const pendingEarnings = revenueStreams
    .filter((r) => r.payoutStatus === 'Pending')
    .reduce((acc, r) => acc + r.amount, 0);

  const filteredStreams = revenueStreams.filter((r) => {
    if (selectedCategory === 'all') return true;
    return r.platformId === selectedCategory;
  });

  const handleInstantPayout = () => {
    setPayoutTriggered(true);
    setTimeout(() => {
      setPayoutTriggered(false);
      setPayoutSuccessMessage(
        `SUCCESS: Official Escrow Check of ${currencySymbol}${availableEarnings.toLocaleString()} successfully cut and released to your direct deposit account!`
      );
      setTimeout(() => setPayoutSuccessMessage(null), 5000);
    }, 1500);
  };

  const exportEarningsCsv = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      ['Platform,Category,Amount,Status,Date']
        .concat(
          revenueStreams.map(
            (r) => `${r.platformId},${r.category},${r.amount},${r.payoutStatus},${r.date}`
          )
        )
        .join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `CTC_Official_Earnings_Check_Statement_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Payout Summary */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <OwnerTagline label="EARN" phrase="Cut the Check" className="mb-2" />
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-extrabold text-white flex items-center gap-2.5">
              <DollarSign className="w-6 h-6 text-amber-400" />
              <span>Category 7: CUT The Check (Executive Payout Hub)</span>
            </h2>
            <span className="engraved-plate-gold text-[9px] font-black uppercase px-2 py-0.5 rounded shadow-sm">
              MAJOR DEAL ESCROW
            </span>
          </div>
          <p className="text-xs text-zinc-400 mt-1">
            Official multi-platform earnings ledger across YouTube AdSense, Kick 95/5, TikTok Live gifts, Spotify royalties, Apple Music & Facebook Stars.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={exportEarningsCsv}
            className="deal-btn-platinum flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition"
          >
            <Download className="w-3.5 h-3.5" />
            <span>CTC Export Audit Ledger CSV</span>
          </button>

          <button
            onClick={handleInstantPayout}
            disabled={payoutTriggered}
            className="deal-btn-gold flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition shadow-xl"
          >
            <CreditCard className="w-4 h-4 text-amber-950" />
            <span>
              {payoutTriggered ? 'Cutting Check & Wiring...' : 'CASH THE CHECK'}
            </span>
          </button>
        </div>
      </div>

      {/* Success Notification Alert */}
      {payoutSuccessMessage && (
        <div className="p-4 rounded-2xl engraved-plate-gold text-amber-950 text-center font-black text-sm animate-in fade-in shadow-2xl flex items-center justify-center gap-2">
          <FileCheck className="w-5 h-5 text-amber-950 shrink-0" />
          <span>{payoutSuccessMessage}</span>
        </div>
      )}

      {/* THE MASTER CHECK / EXECUTIVE ESCROW PLAQUE */}
      <div className="plaque-gold p-6 lg:p-8 relative overflow-hidden">
        {/* Grooved Vinyl Disc Watermark */}
        <div className="absolute -right-16 -top-16 w-56 h-56 rounded-full grooved-record-disc opacity-20 pointer-events-none" />

        <div className="relative z-10 space-y-6">
          {/* Check Header Strip */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-amber-500/30">
            <div className="flex items-center gap-3">
              <div className="engraved-plate-gold w-12 h-12 rounded-xl flex items-center justify-center font-black text-sm text-amber-950 shadow-md">
                CTC
              </div>
              <div>
                <span className="text-[10px] uppercase font-black tracking-widest text-amber-200/80 block">
                  OFFICIAL CREATOR DISBURSEMENT VOUCHER
                </span>
                <h3 className="text-lg font-black text-white tracking-wide">
                  CUT THE CHECK ESCROW SYSTEM #CTC-DEAL-9942
                </h3>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="text-right">
                <span className="text-[10px] uppercase font-bold text-zinc-400 block">CURRENT DEAL TIER</span>
                <span className="text-xs font-black uppercase font-mono text-gold-gradient">
                  {subscriptionTier === 'diamond' ? 'DIAMOND CONGLOMERATE (0-SEC CLEARANCE)' : subscriptionTier === 'platinum' ? 'PLATINUM EXECUTIVE (0-SEC CLEARANCE)' : subscriptionTier === 'gold' ? 'GOLD LABEL PARTNER (48-HR)' : 'INDIE TIER'}
                </span>
              </div>
              {onOpenSubscriptionModal && (
                <button
                  onClick={onOpenSubscriptionModal}
                  className="deal-btn-platinum text-[10px] font-black px-2.5 py-1.5 rounded-lg"
                >
                  CTC Modify Deal
                </button>
              )}
            </div>
          </div>

          {/* Check Middle: Payee and Tabular Dollar Amount */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
            <div className="lg:col-span-2 space-y-2">
              <div className="flex items-center gap-2 text-xs text-amber-200/80 font-mono">
                <span>PAY TO THE ORDER OF:</span>
                <span className="text-white font-bold underline decoration-amber-500/50">
                  CERTIFIED CREATOR STUDIO (ID: CTC-VERIFIED-ARTIST)
                </span>
              </div>
              <p className="text-xs text-zinc-400 italic">
                Authorized electronic royalty disbursement across 47 connected streaming distribution channels. Guaranteed safe custody escrow.
              </p>
            </div>

            {/* Engraved Plaque Check Value Plate */}
            <div className="engraved-plate-gold p-4 rounded-xl text-center shadow-lg">
              <span className="text-[9px] font-mono uppercase font-black tracking-widest text-amber-950/80 block">
                AVAILABLE ESCROW BALANCE
              </span>
              <div className="text-3xl lg:text-4xl font-black font-mono text-amber-950 tracking-tight">
                {currencySymbol}{availableEarnings.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </div>
              <span className="text-[9px] font-bold text-amber-900 block mt-1">
                STATUS: READY TO DISBURSE
              </span>
            </div>
          </div>

          {/* Check Footer: Countersignatures & Clearance Timestamps */}
          <div className="pt-4 border-t border-amber-500/30 flex flex-col sm:flex-row sm:items-center justify-between text-xs text-amber-200/70 gap-2">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              <span>COUNTERSIGNED: CTC GLOBAL ESCROW TRUSTEE • STRIPE DIRECT CONNECT</span>
            </div>
            <div className="font-mono text-[10px] text-zinc-400">
              SERIAL: 884-290-CTC-X • 256-BIT ENCRYPTED
            </div>
          </div>
        </div>
      </div>

      {/* Financial Health Overview Plaques */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Plaque 1 */}
        <div className="plaque-platinum p-5 relative overflow-hidden">
          <div className="absolute -right-4 -bottom-4 w-16 h-16 rounded-full grooved-record-disc opacity-20 pointer-events-none" />
          <span className="text-[10px] font-black uppercase tracking-wider text-slate-300 block mb-2">
            Gross Aggregated (30 Days)
          </span>
          <div className="text-3xl font-black text-platinum-gradient font-mono">
            {currencySymbol}{totalMonthlyEarnings.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </div>
          <div className="flex items-center gap-1.5 mt-2 text-xs text-slate-300">
            <ArrowUpRight className="w-3.5 h-3.5 text-sky-400" />
            <span className="font-bold">+21.8%</span>
            <span className="text-zinc-400">blended monthly growth</span>
          </div>
        </div>

        {/* Plaque 2 */}
        <div className="plaque-gold p-5 relative overflow-hidden">
          <div className="absolute -right-4 -bottom-4 w-16 h-16 rounded-full grooved-record-disc opacity-20 pointer-events-none" />
          <span className="text-[10px] font-black uppercase tracking-wider text-amber-200/80 block mb-2">
            Available For Payout
          </span>
          <div className="text-3xl font-black text-gold-gradient font-mono">
            {currencySymbol}{availableEarnings.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </div>
          <div className="flex items-center gap-1.5 mt-2 text-xs text-amber-300">
            <CheckCircle className="w-3.5 h-3.5 text-amber-400" />
            <span>Ready for bank transfer / Stripe</span>
          </div>
        </div>

        {/* Plaque 3 */}
        <div className="plaque-diamond p-5 relative overflow-hidden">
          <div className="absolute -right-4 -bottom-4 w-16 h-16 rounded-full grooved-record-disc opacity-20 pointer-events-none" />
          <span className="text-[10px] font-black uppercase tracking-wider text-sky-200 block mb-2">
            Pending Clearance
          </span>
          <div className="text-3xl font-black text-diamond-gradient font-mono">
            {currencySymbol}{pendingEarnings.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </div>
          <div className="flex items-center gap-1.5 mt-2 text-xs text-sky-300 font-mono">
            <Clock className="w-3.5 h-3.5 text-sky-400" />
            <span>Next batch clears in 3 business days</span>
          </div>
        </div>
      </div>

      {/* Platform Revenue Breakdown Cards */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-black uppercase tracking-wider text-amber-200/80 flex items-center gap-2">
            <Award className="w-4 h-4 text-amber-400" />
            <span>Platform Revenue Breakdown Ledger</span>
          </h3>
          <span className="text-xs text-zinc-400">47 Major Connected Channels</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {connections.map((c) => {
            const cfg = PLATFORM_CONFIGS[c.platformId];
            const percentOfTotal = ((c.monthlyRevenue / totalMonthlyEarnings) * 100).toFixed(1);

            return (
              <div
                key={c.platformId}
                className="plaque-platinum p-5 transition space-y-3 relative overflow-hidden"
              >
                <div className="flex items-center justify-between relative z-10">
                  <PlatformBadge platformId={c.platformId} size="md" />
                  <span className="text-xs font-bold text-amber-300 font-mono">
                    {percentOfTotal}% of Gross
                  </span>
                </div>

                <div className="relative z-10">
                  <div className="text-2xl font-black text-white font-mono">
                    {currencySymbol}{c.monthlyRevenue.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </div>
                  <span className="text-[11px] text-zinc-400">Estimated Monthly Earnings</span>
                </div>

                <div className="pt-2 border-t border-zinc-800/80 relative z-10">
                  <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block mb-1">
                    Monetization Streams
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {cfg?.monetizationTypes.map((type, i) => (
                      <span
                        key={i}
                        className="text-[10px] px-2 py-0.5 rounded-md bg-zinc-900/90 text-amber-200 border border-amber-500/20 font-medium"
                      >
                        {type}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
