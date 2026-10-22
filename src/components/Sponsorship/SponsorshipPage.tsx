import React, { useState } from 'react';
import {
  Handshake,
  Crown,
  Rocket,
  Award,
  Check,
  Radio,
  Globe,
  Zap,
  BarChart3,
  Send,
  CheckCircle2,
  Building2
} from 'lucide-react';
import { PLATFORM_CONFIGS } from '../../data/mockData';
import majorLabelOfficeImg from '../../assets/images/major_label_office.jpg';
import { OwnerTagline } from '../common/OwnerTagline';
import ctcEagleGoldImg from '../../assets/images/ctc_eagle_pendant_gold.jpg';

type SponsorTierId = 'presenting' | 'launch_partner' | 'plaque_wall';

interface SponsorTier {
  id: SponsorTierId;
  nameplate: string;
  title: string;
  icon: React.ElementType;
  tagline: string;
  deliverables: string[];
  term: string;
  cta: string;
  featured?: boolean;
}

const SPONSOR_TIERS: SponsorTier[] = [
  {
    id: 'presenting',
    nameplate: 'Tier I • Presenting Sponsor',
    title: 'Presenting Sponsor',
    icon: Crown,
    tagline: 'Your name on the headquarters itself — the desk every creator works from.',
    deliverables: [
      'Naming on the Corner Office headquarters display and the Launch suite',
      'Category exclusivity — no competing brand in your category, anywhere in CTC',
      'First position in every launch moment: go-lives, releases, and announcements',
      'Brand placement on the CTC eagle display and executive nameplates',
      'Per-platform performance reporting after every campaign flight'
    ],
    term: '12-month partnership',
    cta: 'CTC Pitch',
    featured: true
  },
  {
    id: 'launch_partner',
    nameplate: 'Tier II • Launch Partner',
    title: 'Launch Partner',
    icon: Rocket,
    tagline: 'Ride the drop. Your brand attached to the moment everything fires at once.',
    deliverables: [
      'Brand presence on Launch Everywhere drops across the full platform network',
      'Logo and mention in simultaneous go-live broadcasts',
      'Placement in same-time release announcements on every channel',
      'Cross-platform social posts carrying your brand to every connected account',
      'Per-platform performance reporting for every drop you sponsor',
      'Showcase Concert Series — your brand on CTC\'s sponsored artist showcases'
    ],
    term: 'Per-drop or seasonal partnership',
    cta: 'CTC Request Deck'
  },
  {
    id: 'plaque_wall',
    nameplate: 'Tier III • Plaque Wall Sponsor',
    title: 'Plaque Wall Sponsor',
    icon: Award,
    tagline: 'Your brand on the wall creators earn their way onto — and show off forever.',
    deliverables: [
      'Brand on the certified Milestone Awards and the Plaque Wall',
      'Presenting credit on Gold, Platinum, and Diamond plaque ceremonies',
      'Logo engraved on the trophy case display in creator profiles',
      'Association with verified, certified creator achievement',
      'Per-platform performance reporting on award campaign reach'
    ],
    term: 'Per-season or annual partnership',
    cta: 'CTC Request Deck'
  }
];

const inputClass =
  'w-full bg-zinc-950 border border-zinc-800 focus:border-amber-400 rounded-xl px-4 py-2.5 text-sm text-white placeholder-zinc-500 focus:outline-none';
const labelClass = 'block text-xs font-bold text-amber-200 uppercase tracking-wider mb-1.5';

export const SponsorshipPage: React.FC = () => {
  const platformCount = Object.keys(PLATFORM_CONFIGS).length;
  const liveCount = Object.values(PLATFORM_CONFIGS).filter((p) => p.supportsLive).length;

  const [interest, setInterest] = useState<SponsorTierId>('presenting');
  const [form, setForm] = useState({ name: '', company: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleTierCta = (tierId: SponsorTierId) => {
    setInterest(tierId);
    setSubmitted(false);
    document.getElementById('sponsor-inquiry')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const reachStats = [
    {
      icon: Globe,
      value: `${platformCount}`,
      label: 'Platforms Connected',
      sub: 'One network — video, live, audio & social'
    },
    {
      icon: Radio,
      value: `${liveCount}`,
      label: 'Live Simultaneously',
      sub: 'Broadcast channels firing in the same moment'
    },
    {
      icon: Zap,
      value: '1',
      label: 'Launch Fires Everywhere',
      sub: 'Go-live + release + post in a single action'
    },
    {
      icon: BarChart3,
      value: 'Per-Platform',
      label: 'Performance Reporting',
      sub: 'Every channel scored on its own numbers'
    }
  ];

  return (
    <div className="space-y-6">
      {/* ==============================================================
          PARTNER WITH CTC — SPONSORSHIP HERO
          ============================================================== */}
      <div className="relative rounded-3xl overflow-hidden border-2 border-amber-500/40 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.9)]">
        <div className="absolute inset-0 z-0">
          <img
            src={majorLabelOfficeImg}
            alt="CTC Worldwide Headquarters — Corner Office"
            className="w-full h-full object-cover brightness-[0.45]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#06080E] via-[#06080E]/70 to-transparent" />
          <div className="absolute inset-0 bg-radial at-center from-transparent via-[#06080E]/40 to-[#06080E]/80" />
        </div>

        <div className="relative z-10 p-6 sm:p-8 lg:p-10 space-y-6">
          {/* Nameplate Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-amber-500/20 pb-4">
            <div className="flex items-center gap-2.5">
              <span className="p-2 rounded-xl bg-amber-500/20 border border-amber-400/40 text-amber-300">
                <Handshake className="w-5 h-5" />
              </span>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[10px] font-mono font-black tracking-widest uppercase text-amber-300 bg-amber-950/80 px-2 py-0.5 rounded border border-amber-600/40">
                    Partner With CTC
                  </span>
                  <span className="text-[10px] font-mono text-zinc-400">
                    SPONSORSHIPS • BRAND PARTNERSHIPS
                  </span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-white tracking-wide uppercase mt-0.5">
                  The Sponsorship Desk
                </h2>
                <OwnerTagline label="SPONSORSHIPS" phrase="Convert Talent to Capital" className="mt-1.5" />
              </div>
            </div>

            <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-emerald-300 bg-emerald-950/70 border border-emerald-500/50 px-2.5 py-1.5 rounded-full flex items-center gap-1.5 self-start sm:self-auto shadow-lg backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Partnerships Open
            </span>
          </div>

          {/* Headline & The Gold Eagle Display */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            <div className="lg:col-span-8 space-y-4">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight drop-shadow-md">
                Your Brand. <span className="text-gold-gradient">Everywhere They Create.</span>
              </h1>

              <p className="text-xs sm:text-sm text-zinc-300 max-w-2xl leading-relaxed">
                CTC is the infrastructure layer connecting Creators • Content • Consumers • Commerce
                across {platformCount} platforms. One partnership puts your brand inside every
                creation, launch, and payout moment — not beside it.
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  onClick={() => handleTierCta('presenting')}
                  className="deal-btn-gold px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition shadow-md flex items-center gap-1.5"
                >
                  <Handshake className="w-3.5 h-3.5 text-amber-950" />
                  <span>CTC Pitch</span>
                </button>

                <button
                  onClick={() => handleTierCta('launch_partner')}
                  className="deal-btn-platinum px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-md"
                >
                  <Rocket className="w-3.5 h-3.5 text-slate-800" />
                  <span>CTC Request Deck</span>
                </button>
              </div>
            </div>

            {/* Right Column: The Gold Eagle, On Display */}
            <div className="lg:col-span-4">
              <div className="p-2 rounded-2xl bg-black/60 border-2 border-amber-400/60 shadow-2xl backdrop-blur-md max-w-xs mx-auto lg:ml-auto">
                <div className="rounded-xl overflow-hidden border border-amber-500/30">
                  <img
                    src={ctcEagleGoldImg}
                    alt="CTC Eagle with Gold Pendant — On Display"
                    className="w-full h-48 sm:h-56 object-cover"
                  />
                </div>
                <div className="flex items-center justify-between px-1.5 pt-2 pb-1">
                  <span className="engraved-plate-gold text-[9px] uppercase font-black px-2 py-0.5 rounded shadow-sm">
                    Presenting Position
                  </span>
                  <span className="text-[9px] font-mono text-zinc-400 uppercase tracking-widest">
                    1 of 1 • Category Exclusive
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ==============================================================
          REACH STRIP — REAL NUMBERS FROM THE PLATFORM CATALOG
          ============================================================== */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {reachStats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800 hover:border-amber-500/40 transition"
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="p-1.5 rounded-lg bg-amber-500/15 border border-amber-500/30 text-amber-300">
                  <Icon className="w-3.5 h-3.5" />
                </span>
                <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-zinc-500">
                  Network Reach
                </span>
              </div>
              <div className="text-2xl sm:text-3xl font-black text-white">
                {stat.value}
              </div>
              <div className="text-xs font-bold text-amber-200 uppercase tracking-wider mt-0.5">
                {stat.label}
              </div>
              <p className="text-[11px] text-zinc-400 leading-snug mt-1">{stat.sub}</p>
            </div>
          );
        })}
      </div>

      {/* ==============================================================
          SPONSOR TIERS
          ============================================================== */}
      <div className="space-y-4">
        <div className="flex items-center gap-2.5">
          <span className="p-2 rounded-xl bg-amber-500/20 border border-amber-400/40 text-amber-300">
            <Building2 className="w-4 h-4" />
          </span>
          <div>
            <h3 className="text-lg font-black text-white uppercase tracking-wide">
              Partnership <span className="text-gold-gradient">Tiers</span>
            </h3>
            <p className="text-[11px] font-mono text-zinc-500 uppercase tracking-widest">
              Three ways in — one front door
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {SPONSOR_TIERS.map((tier) => {
            const Icon = tier.icon;
            return (
              <div
                key={tier.id}
                className={`relative rounded-3xl p-6 flex flex-col gap-4 bg-zinc-900/60 ${
                  tier.featured
                    ? 'border-2 border-amber-500/60 shadow-[0_0_35px_rgba(245,158,11,0.15)]'
                    : 'border border-zinc-800'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span
                    className={`text-[10px] font-mono font-black tracking-widest uppercase px-2 py-0.5 rounded border ${
                      tier.featured
                        ? 'text-amber-300 bg-amber-950/80 border-amber-600/40'
                        : 'text-zinc-400 bg-zinc-900 border-zinc-700'
                    }`}
                  >
                    {tier.nameplate}
                  </span>
                  {tier.featured && (
                    <span className="engraved-plate-gold text-[9px] uppercase font-black px-2 py-0.5 rounded shadow-sm">
                      First Position
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  <span
                    className={`p-2.5 rounded-xl border ${
                      tier.featured
                        ? 'bg-amber-500/20 border-amber-400/40 text-amber-300'
                        : 'bg-zinc-800/80 border-zinc-700 text-amber-200'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                  </span>
                  <h4 className="text-xl font-black text-white tracking-tight">{tier.title}</h4>
                </div>

                <p className="text-xs text-zinc-400 leading-relaxed">{tier.tagline}</p>

                <ul className="space-y-2.5 flex-1">
                  {tier.deliverables.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-xs text-zinc-300 leading-relaxed">
                      <Check className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>

                <div className="border-t border-zinc-800 pt-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-500">
                      Term
                    </span>
                    <span className="text-[11px] font-mono font-bold text-amber-200">
                      {tier.term}
                    </span>
                  </div>
                  <button
                    onClick={() => handleTierCta(tier.id)}
                    className={`w-full px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition shadow-md flex items-center justify-center gap-1.5 ${
                      tier.featured ? 'deal-btn-gold' : 'deal-btn-platinum'
                    }`}
                  >
                    <Handshake className={`w-3.5 h-3.5 ${tier.featured ? 'text-amber-950' : 'text-slate-800'}`} />
                    <span>{tier.cta}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ==============================================================
          WHY NOW — THE MARKET MOVED TO LONG-TERM PARTNERSHIPS
          ============================================================== */}
      <div className="relative rounded-3xl overflow-hidden border border-amber-500/30 bg-gradient-to-r from-amber-950/40 via-zinc-900/90 to-zinc-900/60 p-6 sm:p-8 shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center gap-6">
          <div className="flex-1 space-y-3">
            <span className="text-[10px] font-mono font-black tracking-widest uppercase text-amber-300 bg-amber-950/80 px-2 py-0.5 rounded border border-amber-600/40 inline-block">
              Why Now
            </span>
            <h3 className="text-2xl font-black text-white tracking-tight">
              Brands Stopped Renting Posts. <span className="text-gold-gradient">They Sign Partnerships.</span>
            </h3>
            <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed max-w-3xl">
              The market has moved to long-term, single-brand creator partnerships — 12+ month
              engagements where every placement is scored against an attribution model. One-off
              sponsored posts are out; owned positions inside a creator network are in. CTC was
              built for exactly this: your brand holds a position across the whole network, and
              every placement is measured, not guessed.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 gap-2.5 lg:w-72 shrink-0">
            {[
              '12+ month single-brand engagements',
              'Every placement scored on attribution',
              'Performance reported separately per platform'
            ].map((point) => (
              <div
                key={point}
                className="flex items-center gap-2 px-3 py-2 rounded-xl bg-black/50 border border-amber-500/30 font-mono text-[11px] text-amber-100 backdrop-blur-md"
              >
                <Check className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>{point}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ==============================================================
          PARTNERSHIP INQUIRY
          ============================================================== */}
      <div
        id="sponsor-inquiry"
        className="rounded-3xl border border-zinc-800 bg-zinc-900/60 p-6 sm:p-8 scroll-mt-32"
      >
        <div className="flex items-center gap-2.5 mb-6">
          <span className="p-2 rounded-xl bg-amber-500/20 border border-amber-400/40 text-amber-300">
            <Send className="w-4 h-4" />
          </span>
          <div>
            <h3 className="text-lg font-black text-white uppercase tracking-wide">
              Partnership <span className="text-gold-gradient">Inquiry</span>
            </h3>
            <p className="text-[11px] font-mono text-zinc-500 uppercase tracking-widest">
              Direct to the CTC partnerships desk
            </p>
          </div>
        </div>

        {submitted ? (
          <div className="rounded-2xl border border-emerald-500/40 bg-emerald-950/30 p-6 text-center space-y-3">
            <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
            <h4 className="text-base font-black text-white">Request Received</h4>
            <p className="text-xs text-zinc-300 max-w-md mx-auto leading-relaxed">
              Request received — the CTC partnerships team will follow up with the sponsor deck and
              available positions.
            </p>
            <button
              onClick={() => setSubmitted(false)}
              className="text-[11px] font-black text-amber-400 hover:text-amber-300 underline uppercase tracking-wider"
            >
              CTC Pitch Again
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={labelClass} htmlFor="sponsor-name">Your Name *</label>
              <input
                id="sponsor-name"
                type="text"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="e.g. Jordan Ellis"
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass} htmlFor="sponsor-company">Company / Brand *</label>
              <input
                id="sponsor-company"
                type="text"
                required
                value={form.company}
                onChange={(e) => setForm({ ...form, company: e.target.value })}
                placeholder="e.g. Ellis Beverage Co."
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass} htmlFor="sponsor-email">Work Email *</label>
              <input
                id="sponsor-email"
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="you@brand.com"
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass} htmlFor="sponsor-interest">Partnership Interest *</label>
              <select
                id="sponsor-interest"
                value={interest}
                onChange={(e) => setInterest(e.target.value as SponsorTierId)}
                className={inputClass}
              >
                <option value="presenting">Presenting Sponsor — 12-month partnership</option>
                <option value="launch_partner">Launch Partner — Launch Everywhere drops</option>
                <option value="plaque_wall">Plaque Wall Sponsor — Milestone Awards</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className={labelClass} htmlFor="sponsor-message">Message</label>
              <textarea
                id="sponsor-message"
                rows={4}
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                placeholder="Your category, goals, timing, and anything the partnerships desk should know..."
                className={`${inputClass} text-xs`}
              />
            </div>

            <div className="md:col-span-2 flex flex-wrap items-center justify-between gap-3">
              <p className="text-[11px] font-mono text-zinc-500 uppercase tracking-widest">
                Category exclusivity is granted per tier — first signed, first held
              </p>
              <button
                type="submit"
                className="deal-btn-gold px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition shadow-md flex items-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5 text-amber-950" />
                <span>CTC Pitch</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
