import React, { useState } from 'react';
import {
  Users,
  Briefcase,
  Camera,
  Scissors,
  Music,
  Palette,
  Cpu,
  Star,
  CheckCircle,
  MessageSquare,
  DollarSign,
  Plus,
  Send,
  Sparkles,
  MapPin,
  Clock,
  ShieldCheck,
  Eye,
  Check,
  Flame,
  CheckCircle2,
  Activity,
  Compass,
  Radar,
  Target
} from 'lucide-react';
import { CreatorTalent, NetworkGig, CreatorFeedPost, ScoutContact } from '../../types';
import { MOCK_CREATOR_TALENTS, MOCK_CREATOR_GIGS, INITIAL_CREATOR_FEED_POSTS, MOCK_SCOUT_CONTACTS } from '../../data/mockData';
import { CreatorFeed } from './CreatorFeed';
import { ARScoutTalentView } from './ARScoutTalentView';
import { OnTheRadarView } from './OnTheRadarView';
import { OwnerTagline } from '../common/OwnerTagline';

interface CreatorNetworkHubProps {
  currencySymbol?: string;
}

export const CreatorNetworkHub: React.FC<CreatorNetworkHubProps> = ({ currencySymbol = '$' }) => {
  const [activeTab, setActiveTab] = useState<'creator_feed' | 'ar_scout' | 'on_the_radar' | 'hire_talent' | 'gigs_board' | 'collab_lounge'>('creator_feed');
  const [feedPosts, setFeedPosts] = useState<CreatorFeedPost[]>(INITIAL_CREATOR_FEED_POSTS);
  const [scoutContacts, setScoutContacts] = useState<ScoutContact[]>(MOCK_SCOUT_CONTACTS);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [talents, setTalents] = useState<CreatorTalent[]>(MOCK_CREATOR_TALENTS);
  const [gigs, setGigs] = useState<NetworkGig[]>(MOCK_CREATOR_GIGS);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3200);
  };

  // Hiring Modal State
  const [hiringTalent, setHiringTalent] = useState<CreatorTalent | null>(null);
  const [hireJobTitle, setHireJobTitle] = useState('');
  const [hireBudget, setHireBudget] = useState('250');
  const [hireDeliverables, setHireDeliverables] = useState('');
  const [hireSuccessNotice, setHireSuccessNotice] = useState(false);

  // New Gig Post Modal State
  const [showPostGigModal, setShowPostGigModal] = useState(false);
  const [newGigTitle, setNewGigTitle] = useState('');
  const [newGigCategory, setNewGigCategory] = useState<'cameraman' | 'editing' | 'sound' | 'design' | 'stream_engineer'>('editing');
  const [newGigBudget, setNewGigBudget] = useState('$200 - $350');
  const [newGigDeadline, setNewGigDeadline] = useState('48 Hours');
  const [newGigDesc, setNewGigDesc] = useState('');

  const categories = [
    { id: 'all', label: 'All Talent', icon: Users },
    { id: 'cameraman', label: 'Cameramen & DP', icon: Camera },
    { id: 'editing', label: 'Video Editors', icon: Scissors },
    { id: 'sound', label: 'Sound FX & Audio', icon: Music },
    { id: 'design', label: 'Thumbnail & Visuals', icon: Palette },
    { id: 'stream_engineer', label: 'Stream Engineers', icon: Cpu }
  ];

  const filteredTalents = talents.filter((t) => {
    if (selectedCategory === 'all') return true;
    return t.category === selectedCategory;
  });

  const handleHireSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setHireSuccessNotice(true);
    setTimeout(() => {
      setHireSuccessNotice(false);
      setHiringTalent(null);
      setHireJobTitle('');
      setHireDeliverables('');
    }, 2800);
  };

  const handlePostGig = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGigTitle.trim()) return;

    const newGig: NetworkGig = {
      id: `gig-${Date.now()}`,
      title: newGigTitle.trim(),
      creatorName: 'Alex Rivers',
      creatorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
      category: newGigCategory,
      budget: newGigBudget,
      deadline: newGigDeadline,
      description: newGigDesc.trim() || 'Need expert creator assistance for ongoing production.',
      proposalsCount: 0,
      postedAt: 'Just now'
    };

    setGigs([newGig, ...gigs]);
    setShowPostGigModal(false);
    setNewGigTitle('');
    setNewGigDesc('');
  };

  return (
    <div className="space-y-6">
      {/* Hero & Network Lounge Header */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-purple-950/60 via-zinc-900 to-indigo-950/50 border border-purple-500/30 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-2xl">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase font-extrabold tracking-widest px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
              CREATOR GUILD & NETWORK
            </span>
            <span className="text-xs text-emerald-400 flex items-center gap-1 font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              1,420 Verified Creators Online
            </span>
          </div>
          <OwnerTagline label="COMMUNITY" phrase="Came to Chat" />
          <h2 className="text-2xl font-black text-white tracking-tight">
            Collaborate, Network & Hire Specialized Creator Talent
          </h2>
          <p className="text-xs text-zinc-300 max-w-2xl leading-relaxed">
            Connect with fellow streamers for co-broadcasts, guest appearances, and hire vetted cameramen, short-form editors, custom sound designers, and thumbnail artists with escrow protection.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => setShowPostGigModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white text-xs font-bold uppercase tracking-wider transition shadow-lg"
          >
            <Plus className="w-4 h-4" />
            <span>CTC Post a Hiring Call / Gig</span>
          </button>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center justify-between border-b border-zinc-800 pb-3 gap-4">
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-none">
          <button
            onClick={() => setActiveTab('creator_feed')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              activeTab === 'creator_feed'
                ? 'bg-gradient-to-r from-amber-500/20 via-yellow-500/10 to-amber-500/20 text-amber-300 border border-amber-500/40 shadow-md'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Flame className="w-3.5 h-3.5 text-amber-400" />
            <span>Creator Feed ({feedPosts.length})</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse ml-0.5" />
          </button>

          <button
            onClick={() => setActiveTab('ar_scout')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'ar_scout'
                ? 'bg-gradient-to-r from-amber-500/20 via-yellow-500/10 to-amber-500/20 text-amber-300 border border-amber-500/50 shadow-md ring-1 ring-amber-400/40'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-850'
            }`}
          >
            <Compass className="w-3.5 h-3.5 text-amber-400" />
            <span>A&R Scout ({scoutContacts.length})</span>
            <span className="text-[9px] font-mono font-black px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
              GROWTH TIERS
            </span>
          </button>

          <button
            onClick={() => setActiveTab('on_the_radar')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'on_the_radar'
                ? 'bg-gradient-to-r from-amber-500/20 via-yellow-500/10 to-amber-500/20 text-amber-300 border border-amber-500/50 shadow-md ring-1 ring-amber-400/40'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-850'
            }`}
          >
            <Radar className="w-3.5 h-3.5 text-amber-400" />
            <span>On The Radar ({scoutContacts.length})</span>
            <span className="text-[9px] font-mono font-black px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
              TOP MOVERS
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse ml-0.5" />
          </button>

          <button
            onClick={() => setActiveTab('hire_talent')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              activeTab === 'hire_talent'
                ? 'bg-zinc-800 text-white border border-zinc-700 shadow-md'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Briefcase className="w-3.5 h-3.5 text-purple-400" />
            <span>Hire Specialized Talent ({filteredTalents.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('gigs_board')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              activeTab === 'gigs_board'
                ? 'bg-zinc-800 text-white border border-zinc-700 shadow-md'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-pink-400" />
            <span>Creator Gigs Board ({gigs.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('collab_lounge')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              activeTab === 'collab_lounge'
                ? 'bg-zinc-800 text-white border border-zinc-700 shadow-md'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Users className="w-3.5 h-3.5 text-blue-400" />
            <span>Co-Stream & Collab Lounge</span>
          </button>
        </div>

        <span className="text-xs text-zinc-500 font-mono hidden md:inline">
          Escrow Contracts Protected (0% Creator Fee)
        </span>
      </div>

      {/* Network Hub Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-3 rounded-xl bg-zinc-900 border border-emerald-500/40 text-emerald-300 text-xs font-bold shadow-2xl flex items-center gap-2 animate-in fade-in slide-in-from-bottom-4 duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Executive Creator Feed Tab */}
      {activeTab === 'creator_feed' && (
        <CreatorFeed
          posts={feedPosts}
          onAddPost={(newP) => {
            const p: CreatorFeedPost = {
              ...newP,
              id: `post-${Date.now()}`,
              createdAt: 'Just now',
              ctcEndorsements: 1,
              userEndorsed: true,
              commentsCount: 0,
              comments: [],
              sharesCount: 0
            };
            setFeedPosts([p, ...feedPosts]);
            triggerToast('Deal update broadcasted to network!');
          }}
          currencySymbol={currencySymbol}
        />
      )}

      {/* A&R Talent Scout Tab with Verified Engagement Growth Tiers */}
      {activeTab === 'ar_scout' && (
        <ARScoutTalentView
          contacts={scoutContacts}
          onTriggerToast={triggerToast}
          currencySymbol={currencySymbol}
        />
      )}

      {/* On The Radar — Discovery Momentum Board */}
      {activeTab === 'on_the_radar' && (
        <OnTheRadarView
          contacts={scoutContacts}
          onTriggerToast={triggerToast}
        />
      )}

      {/* Talent Directory Tab */}
      {activeTab === 'hire_talent' && (
        <div className="space-y-6">
          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {categories.map((cat) => {
              const Icon = cat.icon;
              const isSelected = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition whitespace-nowrap border ${
                    isSelected
                      ? 'bg-purple-600/20 text-purple-300 border-purple-500/60 shadow-md'
                      : 'bg-[#111622] text-zinc-400 border-zinc-800 hover:border-zinc-700 hover:text-white'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>

          {/* Talents Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredTalents.map((talent) => (
              <div
                key={talent.id}
                className="p-5 rounded-2xl bg-[#111622] border border-zinc-800 hover:border-purple-500/50 transition-all flex flex-col justify-between shadow-xl group"
              >
                <div>
                  {/* Header: Avatar, Name, Category */}
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <img
                          src={talent.avatar}
                          alt={talent.name}
                          className="w-12 h-12 rounded-xl object-cover border border-zinc-700"
                        />
                        {talent.online && (
                          <span
                            className="absolute -bottom-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full border-2 border-[#111622]"
                            title="Online Now"
                          />
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <h3 className="font-bold text-sm text-white group-hover:text-purple-300 transition">
                            {talent.name}
                          </h3>
                          {talent.verified && (
                            <CheckCircle className="w-3.5 h-3.5 text-blue-400" />
                          )}
                        </div>
                        <span className="text-xs text-zinc-500 font-mono">{talent.handle}</span>
                      </div>
                    </div>

                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-zinc-800 text-purple-300 border border-zinc-700">
                      {talent.categoryLabel}
                    </span>
                  </div>

                  <p className="text-xs font-semibold text-zinc-200 line-clamp-1 mb-1">
                    {talent.headline}
                  </p>
                  <p className="text-xs text-zinc-400 line-clamp-2 mb-3 leading-relaxed">
                    {talent.bio}
                  </p>

                  {/* Rating & Rate Badges */}
                  <div className="flex items-center justify-between text-xs py-2 px-3 rounded-xl bg-zinc-900/80 border border-zinc-800/80 mb-3 font-mono">
                    <div className="flex items-center gap-1 text-amber-400 font-bold">
                      <Star className="w-3.5 h-3.5 fill-amber-400" />
                      <span>{talent.rating}</span>
                      <span className="text-zinc-500 font-normal">({talent.reviewsCount} reviews)</span>
                    </div>
                    <div className="text-white font-bold">
                      {currencySymbol}{talent.hourlyRate}
                      <span className="text-zinc-500 font-normal">/hr</span>
                    </div>
                  </div>

                  {/* Skills tags */}
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {talent.skills.slice(0, 3).map((skill, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] px-2 py-0.5 rounded-md bg-zinc-900 text-zinc-300 border border-zinc-800 font-medium"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>

                  {/* Portfolio Previews */}
                  <div className="mb-4">
                    <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block mb-1.5">
                      Sample Work & Credits
                    </span>
                    <div className="grid grid-cols-2 gap-2">
                      {talent.portfolio.map((p, idx) => (
                        <div
                          key={idx}
                          className="relative h-16 rounded-lg overflow-hidden border border-zinc-800 group/item bg-zinc-900"
                        >
                          <img
                            src={p.thumbnail}
                            alt={p.title}
                            className="w-full h-full object-cover group-hover/item:scale-110 transition duration-300"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-1.5">
                            <span className="text-[9px] font-bold text-white truncate">
                              {p.title}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 pt-3 border-t border-zinc-800/80">
                  <button
                    onClick={() => setHiringTalent(talent)}
                    className="flex-1 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-md"
                  >
                    <Briefcase className="w-3.5 h-3.5" />
                    <span>CTC Hire {talent.name.split(' ')[0]}</span>
                  </button>
                  <button
                    onClick={() => alert(`Direct creator chat opened with ${talent.handle}`)}
                    className="p-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border border-zinc-700 transition"
                    title="Send Direct Message"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Creator Gigs Board */}
      {activeTab === 'gigs_board' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Active Creator Projects Seeking Talent
            </h3>
            <span className="text-xs text-zinc-500">Fast 24h Payout Turnaround</span>
          </div>

          <div className="space-y-3">
            {gigs.map((gig) => (
              <div
                key={gig.id}
                className="p-5 rounded-2xl bg-[#111622] border border-zinc-800 hover:border-zinc-700 transition flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-lg"
              >
                <div className="flex items-start gap-3.5">
                  <img
                    src={gig.creatorAvatar}
                    alt={gig.creatorName}
                    className="w-10 h-10 rounded-xl object-cover border border-zinc-700 shrink-0"
                  />
                  <div>
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className="text-xs font-bold text-white">{gig.creatorName}</span>
                      <span className="text-zinc-600">•</span>
                      <span className="text-xs text-zinc-400 font-mono">{gig.postedAt}</span>
                      <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 font-mono">
                        {gig.category}
                      </span>
                    </div>
                    <h4 className="text-sm font-bold text-white mb-1">{gig.title}</h4>
                    <p className="text-xs text-zinc-400 max-w-2xl">{gig.description}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 self-end md:self-center shrink-0">
                  <div className="text-right">
                    <span className="text-[10px] uppercase font-bold text-zinc-500 block">Budget</span>
                    <span className="text-sm font-extrabold text-emerald-400 font-mono">
                      {gig.budget}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] uppercase font-bold text-zinc-500 block">Deadline</span>
                    <span className="text-xs font-bold text-zinc-300 font-mono">{gig.deadline}</span>
                  </div>
                  <button
                    onClick={() => triggerToast(`Proposal submitted for "${gig.title}". Creator will review your reel.`)}
                    className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition shadow-md whitespace-nowrap"
                  >
                    CTC Submit Proposal ({gig.proposalsCount})
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Collab Lounge */}
      {activeTab === 'collab_lounge' && (
        <div className="bg-[#111622] rounded-2xl border border-zinc-800 p-6 shadow-xl space-y-6">
          <div>
            <h3 className="text-base font-bold text-white mb-1">
              Live Co-Stream & Cross-Audience Collaboration Lounge
            </h3>
            <p className="text-xs text-zinc-400">
              Host joint live streams to merge audience viewers from YouTube, Kick, and TikTok simultaneously.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-purple-300 uppercase tracking-wider">
                  Open Co-Stream Host Request
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono">
                  Live Today 8:00 PM
                </span>
              </div>
              <h4 className="text-sm font-bold text-white">
                Looking for 1 Music Producer / Beatmaker for Kick + YouTube Multicast
              </h4>
              <p className="text-xs text-zinc-400">
                "We do a 2-hour speed challenge producing a hit track using only kitchen sounds. Combined CCV estimate: 12,000+ viewers."
              </p>
              <div className="flex items-center justify-between pt-2 border-t border-zinc-800">
                <span className="text-xs text-zinc-500">Posted by @SynthNinja (180k followers)</span>
                <button
                  onClick={() => triggerToast('Collab invite dispatched to @SynthNinja!')}
                  className="px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold"
                >
                  CTC Join Stream
                </button>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-blue-300 uppercase tracking-wider">
                  Podcast Guest Exchange
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 font-mono">
                  Spotify & Apple Video Pod
                </span>
              </div>
              <h4 className="text-sm font-bold text-white">
                Seeking Digital Monetization & Agency Founder for Episode 55
              </h4>
              <p className="text-xs text-zinc-400">
                "Break down how you scaled your merchandise and membership tiers. We cross-publish the interview across Spotify Video, Apple Music, and YouTube."
              </p>
              <div className="flex items-center justify-between pt-2 border-t border-zinc-800">
                <span className="text-xs text-zinc-500">Posted by @EchoSessions (85k monthly listeners)</span>
                <button
                  onClick={() => triggerToast('Guest application submitted to @EchoSessions!')}
                  className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold"
                >
                  CTC Apply as Guest
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Hire Talent Modal */}
      {hiringTalent && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#111622] rounded-2xl border border-zinc-800 w-full max-w-xl p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img
                  src={hiringTalent.avatar}
                  alt={hiringTalent.name}
                  className="w-10 h-10 rounded-xl object-cover border border-zinc-700"
                />
                <div>
                  <h3 className="font-bold text-base text-white">Hire {hiringTalent.name}</h3>
                  <span className="text-xs text-purple-400">{hiringTalent.categoryLabel}</span>
                </div>
              </div>
              <button
                onClick={() => setHiringTalent(null)}
                className="text-zinc-500 hover:text-white text-sm p-1 rounded"
              >
                ✕
              </button>
            </div>

            {hireSuccessNotice ? (
              <div className="p-6 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-center space-y-2">
                <CheckCircle className="w-10 h-10 text-emerald-400 mx-auto" />
                <h4 className="text-base font-bold text-white">Escrow Contract Initialized!</h4>
                <p className="text-xs text-emerald-200">
                  {hiringTalent.name} has been notified and invited to your workspace. Funds remain safely held until you approve deliverables.
                </p>
              </div>
            ) : (
              <form onSubmit={handleHireSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-zinc-300 uppercase mb-1">
                    Job / Project Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={hireJobTitle}
                    onChange={(e) => setHireJobTitle(e.target.value)}
                    placeholder={`e.g. Cut 5 viral shorts from 3h stream or sound alert pack`}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-zinc-300 uppercase mb-1">
                      Escrow Budget ({currencySymbol})
                    </label>
                    <input
                      type="number"
                      required
                      value={hireBudget}
                      onChange={(e) => setHireBudget(e.target.value)}
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-zinc-300 uppercase mb-1">
                      Expected Turnaround
                    </label>
                    <select className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none">
                      <option>24 Hours (Rush)</option>
                      <option>2 - 3 Days</option>
                      <option>1 Week</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-300 uppercase mb-1">
                    Deliverable Scope & Asset Links
                  </label>
                  <textarea
                    rows={3}
                    value={hireDeliverables}
                    onChange={(e) => setHireDeliverables(e.target.value)}
                    placeholder="Provide link to raw VOD, audio stems, preferred style references..."
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div className="p-3 rounded-xl bg-zinc-900/80 border border-zinc-800 text-[11px] text-zinc-400 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>
                    Protected by Cut The Check Creator Escrow. Talent is paid only after you preview and approve the final work.
                  </span>
                </div>

                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setHiringTalent(null)}
                    className="px-4 py-2 text-xs text-zinc-400 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold uppercase tracking-wider shadow-lg"
                  >
                    CTC Send Offer & Lock Escrow
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Post a Gig Modal */}
      {showPostGigModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#111622] rounded-2xl border border-zinc-800 w-full max-w-lg p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-base text-white flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-purple-400" />
                <span>Post a Creator Hiring Call</span>
              </h3>
              <button
                onClick={() => setShowPostGigModal(false)}
                className="text-zinc-500 hover:text-white text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handlePostGig} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-zinc-300 uppercase mb-1">
                  Gig Title *
                </label>
                <input
                  type="text"
                  required
                  value={newGigTitle}
                  onChange={(e) => setNewGigTitle(e.target.value)}
                  placeholder="e.g. Need YouTube editor for gaming compilation"
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-zinc-300 uppercase mb-1">
                    Specialty Category
                  </label>
                  <select
                    value={newGigCategory}
                    onChange={(e) => setNewGigCategory(e.target.value as any)}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none"
                  >
                    <option value="editing">Video Editing</option>
                    <option value="cameraman">Cameraman & DP</option>
                    <option value="sound">Sound FX & Audio</option>
                    <option value="design">Thumbnail & Design</option>
                    <option value="stream_engineer">Stream Engineer</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-zinc-300 uppercase mb-1">
                    Budget Range
                  </label>
                  <input
                    type="text"
                    value={newGigBudget}
                    onChange={(e) => setNewGigBudget(e.target.value)}
                    placeholder="e.g. $150 - $300"
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-300 uppercase mb-1">
                  Project Description & Specifications
                </label>
                <textarea
                  rows={3}
                  value={newGigDesc}
                  onChange={(e) => setNewGigDesc(e.target.value)}
                  placeholder="Describe your creative vision, pacing, format, and references..."
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowPostGigModal(false)}
                  className="px-4 py-2 text-xs text-zinc-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold uppercase tracking-wider shadow-lg"
                >
                  CTC Publish Gig to Community
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
