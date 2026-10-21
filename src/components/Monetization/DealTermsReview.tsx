import React, { useState } from 'react';
import {
  FileText,
  ShieldCheck,
  Award,
  Download,
  CheckCircle2,
  ExternalLink,
  Search,
  Scale,
  DollarSign,
  Clock,
  Lock,
  ChevronRight,
  FileCheck2,
  Copy,
  Check
} from 'lucide-react';
import { PlatformId } from '../../types';
import { PLATFORM_CONFIGS } from '../../data/mockData';
import { PlatformBadge } from '../common/PlatformBadge';

interface DealTerm {
  platformId: PlatformId;
  contractTitle: string;
  splitSummary: string;
  payoutCycle: string;
  minimumThreshold: string;
  rightsRetention: string;
  auditRight: string;
  keyClauses: string[];
  formalClauseExcerpt: string;
}

const ACTIVE_DEAL_TERMS: DealTerm[] = [
  {
    platformId: 'kick',
    contractTitle: 'Kick Live Creator Standard Operating Master Agreement #KC-95-5',
    splitSummary: '95% Creator / 5% Platform (Sub-split)',
    payoutCycle: 'Instant Daily Direct Deposit via Stripe Connect',
    minimumThreshold: '$10.00 USD',
    rightsRetention: '100% Non-exclusive master and broadcast rights retained by Creator',
    auditRight: 'Real-time telemetry and API webhook audit verification',
    keyClauses: [
      'Sub Revenue: $4.75 net per $5.00 subscription tier directly deposited.',
      'No exclusivity restriction: Permitted to multi-broadcast simultaneously across YouTube, TikTok, and Twitch.',
      'Chargeback Shield: Platform absorbs fraudulent fan transaction penalties.'
    ],
    formalClauseExcerpt: 'SECTION 4.1: ROYALTY SCHEDULE. Creator shall receive ninety-five percent (95.0%) of all gross subscriber receipts, gift sub distributions, and verified tip donations. Payouts shall disburse within 24 hours of settlement.'
  },
  {
    platformId: 'youtube',
    contractTitle: 'YouTube Partner Program (YPP) Global Content Distribution Contract',
    splitSummary: '55% AdSense / 70% SuperChat & Channel Memberships',
    payoutCycle: 'Monthly Net-21 (Disbursed between 21st-26th each calendar month)',
    minimumThreshold: '$100.00 USD AdSense Threshold',
    rightsRetention: 'Non-exclusive license; 100% copyright retained by Creator',
    auditRight: 'Monthly downloadable certified revenue tax statements (Form 1099-MISC)',
    keyClauses: [
      'Standard In-Stream Ads: 55% share of net recognized programmatic advertisement revenues.',
      'Shorts Creator Fund Pool: Performance allocation based on cross-market regional share of total Shorts views.',
      'Fan Funding: 70% share of gross Super Chat, Super Stickers, and Channel Memberships.'
    ],
    formalClauseExcerpt: 'SECTION 6.2: REVENUE SHARE ALLOCATION. Google LLC shall disburse fifty-five percent (55%) of Recognized In-Stream Ad Revenues and seventy percent (70%) of Fan Funding transactions directly to Creator via connected AdSense Account.'
  },
  {
    platformId: 'tiktok',
    contractTitle: 'TikTok Live Creator Guild & Rewards Performance Agreement',
    splitSummary: '50% Live Virtual Gifts / 100% Creator Marketplace Branded Content',
    payoutCycle: 'Weekly on Wednesdays via PayPal or Bank Transfer',
    minimumThreshold: '$10.00 USD',
    rightsRetention: 'Worldwide non-exclusive broadcast feed license for algorithmic syndication',
    auditRight: 'In-app Wallet Transaction ledger certified via ByteDance Global',
    keyClauses: [
      'Live Gifts Diamond conversion: 1 Diamond = $0.005 USD payout rate (50% net share of purchased coin value).',
      'Series & Subscriptions: 70% of gross viewer subscription payments after mobile store deductions (Apple 30% / Google 30%).',
      'Creator Rewards Program: Dynamic RPM payout based on qualified 1-minute+ original video engagements.'
    ],
    formalClauseExcerpt: 'SECTION 3.4: DIAMOND DISBURSEMENT. Diamonds accumulated during authorized Live transmissions are redeemable at the baseline rate of $0.05 per 10 Diamonds, disbursed automatically to Creator linked fiduciary gateway.'
  },
  {
    platformId: 'spotify',
    contractTitle: 'Spotify for Artists Master Rights & Mechanical Royalty Standard',
    splitSummary: 'Stream Royalty Index: ~$0.0035 to $0.0045 per Stream Master Payout',
    payoutCycle: 'Monthly Net-60 through Certified Distributor / Escrow',
    minimumThreshold: '$0.00 (Aggregated into Monthly CTC Escrow Check)',
    rightsRetention: '100% Mechanical, Sync, and Master Recording Copyrights retained by Creator',
    auditRight: 'Certified SoundExchange and Merlin global stream telemetry verification',
    keyClauses: [
      'Stream Share Model: Pro-rata allocation of the 70% gross payout pool across Premium and Free tiers.',
      'Discovery Mode: Optional 30% discount on algorithmic radio streams in exchange for audience expansion.',
      '1,000 Stream Annual Threshold: Tracks exceeding 1,000 streams qualify for commercial pool distribution.'
    ],
    formalClauseExcerpt: 'SECTION 8.1: RECORDING ROYALTIES. Master owners and featured recording artists shall receive payment computed by multiplying total qualified streams by the territory-specific per-stream royalty factor (currently $0.0038 USD weighted).'
  },
  {
    platformId: 'applemusic',
    contractTitle: 'Apple Music Master Licensing & Spatial Audio Royalty Protocol',
    splitSummary: 'Standard ~$0.0100 per Stream (100% Pure Subscription Backed)',
    payoutCycle: 'Monthly Net-45 directly to Master Rights Holder',
    minimumThreshold: '$10.00 USD',
    rightsRetention: '100% Non-exclusive master ownership with Spatial Audio priority',
    auditRight: 'Apple Music for Artists direct dashboard analytics reconciliation',
    keyClauses: [
      'Premium Headline Rate: 52% of gross subscription revenues distributed directly to rights holders (~1 penny per stream).',
      'Spatial Audio Royalty Bonus: Up to 10% supplemental royalty boost for Dolby Atmos spatial master recordings.',
      'Zero Ad Tier: 100% of plays backed by paying subscribers ensuring uniform RPM consistency.'
    ],
    formalClauseExcerpt: 'SECTION 5.2: STREAMING REMUNERATION. Apple Inc. confirms an average royalty distribution of 1.00 US Cent ($0.010) per monetized audio stream, calculated across unified global territories without ad-supported tier devaluation.'
  },
  {
    platformId: 'facebook',
    contractTitle: 'Meta Content Monetization & Reels Performance Agreement',
    splitSummary: '55% In-Stream Video Ads / 100% Net Stars & Badges',
    payoutCycle: 'Monthly Net-21 via Meta Payouts Account',
    minimumThreshold: '$100.00 USD',
    rightsRetention: 'Full non-exclusive digital rights retained by Creator',
    auditRight: 'Meta Business Suite Financial Disclosure and Tax Settlement Reports',
    keyClauses: [
      'Stars Monetization: $0.01 USD paid out per Star sent by audience members during live broadcasts or VODs.',
      'In-Stream Ads on Videos: 55% share of qualified ad impressions served before, during, or after video playback.',
      'Performance Bonus Program: Monthly variable bonus rewards based on cross-post engagement volume.'
    ],
    formalClauseExcerpt: 'SECTION 7.3: STARS & IN-STREAM PAYOUTS. Meta Platforms, Inc. shall credit Creator one cent ($0.01 USD) per Star received, alongside fifty-five percent (55%) of gross recognized video ad revenue.'
  }
];

export const DealTermsReview: React.FC = () => {
  const [selectedPlatform, setSelectedPlatform] = useState<PlatformId>('kick');
  const [copiedContractId, setCopiedContractId] = useState(false);

  const activeDeal = ACTIVE_DEAL_TERMS.find((d) => d.platformId === selectedPlatform) || ACTIVE_DEAL_TERMS[0];
  const cfg = PLATFORM_CONFIGS[activeDeal.platformId];

  const handleCopyClause = () => {
    navigator.clipboard.writeText(activeDeal.formalClauseExcerpt);
    setCopiedContractId(true);
    setTimeout(() => setCopiedContractId(false), 2000);
  };

  const downloadDealMemo = () => {
    const text = `=====================================================
OFFICIAL CTC DEAL TERMS MEMORANDUM & ESCROW DISCLOSURE
Platform: ${cfg?.name || activeDeal.platformId}
Contract: ${activeDeal.contractTitle}
Split: ${activeDeal.splitSummary}
Cycle: ${activeDeal.payoutCycle}
Minimum Threshold: ${activeDeal.minimumThreshold}
Rights Retention: ${activeDeal.rightsRetention}
Audit Right: ${activeDeal.auditRight}
-----------------------------------------------------
Formal Legal Clause Excerpt:
${activeDeal.formalClauseExcerpt}
-----------------------------------------------------
Key Terms:
${activeDeal.keyClauses.map((c, i) => `${i + 1}. ${c}`).join('\n')}
-----------------------------------------------------
Certified by CTC Global Escrow Trustee. 256-Bit Encrypted.
=====================================================`;

    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `CTC_Deal_Terms_${activeDeal.platformId.toUpperCase()}_2026.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="plaque-gold p-6 lg:p-8 relative overflow-hidden space-y-6">
      {/* Vinyl record watermark */}
      <div className="absolute -left-20 -bottom-20 w-72 h-72 rounded-full grooved-record-disc opacity-15 pointer-events-none" />

      {/* Header with formal plaque seal */}
      <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-amber-500/25">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-black text-white flex items-center gap-2">
              <Scale className="w-5 h-5 text-amber-400" />
              <span>Platform Deal Terms Review & Legal Master Reader</span>
            </h3>
            <span className="engraved-plate-gold text-[9px] font-black uppercase px-2 py-0.5 rounded shadow-sm">
              FORMAL DOCUMENT READER
            </span>
          </div>
          <p className="text-xs text-zinc-400 mt-1">
            Official summary of active distribution and royalty contracts across certified major network partners.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={downloadDealMemo}
            className="deal-btn-platinum flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold"
          >
            <Download className="w-3.5 h-3.5" />
            <span>CTC Export Contract Memo</span>
          </button>
        </div>
      </div>

      {/* Document Reader Layout */}
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Navigation: Platform Deal Selector (4 cols) */}
        <div className="lg:col-span-4 space-y-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 block px-1">
            Active Distribution Contracts ({ACTIVE_DEAL_TERMS.length})
          </span>

          <div className="space-y-1.5">
            {ACTIVE_DEAL_TERMS.map((deal) => {
              const isSelected = deal.platformId === selectedPlatform;
              return (
                <button
                  key={deal.platformId}
                  onClick={() => setSelectedPlatform(deal.platformId)}
                  className={`w-full p-3 rounded-xl border text-left transition flex items-center justify-between gap-3 ${
                    isSelected
                      ? 'border-amber-400 bg-amber-500/15 text-white shadow-lg'
                      : 'border-zinc-800 bg-black/40 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <PlatformBadge platformId={deal.platformId} size="sm" showLabel={false} />
                    <div className="min-w-0">
                      <span className="text-xs font-extrabold block truncate text-white">
                        {PLATFORM_CONFIGS[deal.platformId]?.name}
                      </span>
                      <span className="text-[10px] font-mono text-amber-300 truncate block">
                        {deal.splitSummary}
                      </span>
                    </div>
                  </div>
                  <ChevronRight className={`w-4 h-4 shrink-0 transition ${isSelected ? 'text-amber-400' : 'text-zinc-600'}`} />
                </button>
              );
            })}
          </div>

          {/* Quick Legal Assurance Badge */}
          <div className="p-3.5 rounded-xl bg-black/40 border border-zinc-800 text-[11px] text-zinc-400 space-y-1.5 mt-3">
            <div className="flex items-center gap-1.5 text-amber-300 font-bold">
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              <span>100% Non-Exclusive Guarantee</span>
            </div>
            <p className="text-[10px] text-zinc-400 leading-relaxed">
              All CTC integrations operate strictly on non-exclusive terms. You retain 100% of your copyright, master recordings, and brand ownership.
            </p>
          </div>
        </div>

        {/* Right Content: Formal Document Reader (8 cols) */}
        <div className="lg:col-span-8 bg-[#0E121A] border-2 border-amber-500/30 rounded-2xl p-6 lg:p-7 shadow-2xl relative space-y-5">
          {/* Document Header Stamp */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-amber-500/20">
            <div>
              <div className="flex items-center gap-2">
                <span className="engraved-plate-gold text-[9px] font-black uppercase px-2 py-0.5 rounded shadow-sm">
                  CERTIFIED CONTRACT
                </span>
                <span className="text-xs font-mono text-zinc-400">
                  STATUS: FULLY EXECUTED & ACTIVE
                </span>
              </div>
              <h4 className="text-base font-extrabold text-white mt-1">
                {activeDeal.contractTitle}
              </h4>
            </div>

            <button
              onClick={handleCopyClause}
              className="deal-btn-platinum self-start sm:self-auto flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold"
            >
              {copiedContractId ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedContractId ? 'Copied' : 'CTC Copy Excerpt'}</span>
            </button>
          </div>

          {/* Formal Legal Clause Box */}
          <div className="p-4 rounded-xl bg-black/60 border border-amber-500/30 relative">
            <span className="text-[9px] font-mono uppercase font-black text-amber-400/90 block mb-1.5">
              LEGAL CLAUSE EXCERPT (AUTHENTIC TERMS)
            </span>
            <p className="text-xs font-mono text-amber-100/90 leading-relaxed italic">
              &quot;{activeDeal.formalClauseExcerpt}&quot;
            </p>
          </div>

          {/* Contract Metadata Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3.5 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-1">
              <span className="text-[10px] font-bold uppercase text-zinc-400 block">Revenue Split Ratio</span>
              <span className="text-sm font-black font-mono text-amber-300">{activeDeal.splitSummary}</span>
            </div>

            <div className="p-3.5 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-1">
              <span className="text-[10px] font-bold uppercase text-zinc-400 block">Disbursement Schedule</span>
              <span className="text-sm font-bold text-white">{activeDeal.payoutCycle}</span>
            </div>

            <div className="p-3.5 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-1">
              <span className="text-[10px] font-bold uppercase text-zinc-400 block">Minimum Payout Threshold</span>
              <span className="text-sm font-black font-mono text-white">{activeDeal.minimumThreshold}</span>
            </div>

            <div className="p-3.5 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-1">
              <span className="text-[10px] font-bold uppercase text-zinc-400 block">Copyright & Master Rights</span>
              <span className="text-sm font-bold text-emerald-400">{activeDeal.rightsRetention}</span>
            </div>
          </div>

          {/* Key Executive Terms */}
          <div className="space-y-2 pt-2">
            <span className="text-xs font-black uppercase tracking-wider text-amber-200/90 block">
              Core Contractual Provisions
            </span>
            <div className="space-y-2">
              {activeDeal.keyClauses.map((clause, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-2.5 p-3 rounded-xl bg-black/40 border border-zinc-800/80 text-xs text-zinc-300"
                >
                  <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{clause}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Formal Countersignature Seal */}
          <div className="pt-4 border-t border-amber-500/20 flex flex-col sm:flex-row sm:items-center justify-between text-xs text-amber-200/70 gap-2 font-mono text-[10px]">
            <div className="flex items-center gap-2">
              <FileCheck2 className="w-4 h-4 text-amber-400" />
              <span>COUNTERSIGNED CTC GLOBAL ESCROW TRUSTEE • MUTUAL SATISFACTION SEAL</span>
            </div>
            <div className="text-zinc-500">
              AUDIT HASH: 0x9f4a...CTC-2026
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
