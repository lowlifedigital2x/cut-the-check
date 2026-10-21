import React, { useState } from 'react';
import {
  Briefcase,
  DollarSign,
  Award,
  Users,
  MessageSquare,
  Share2,
  Bookmark,
  Sparkles,
  Send,
  Plus,
  Filter,
  Search,
  CheckCircle2,
  ExternalLink,
  Flame,
  Radio,
  Clock,
  TrendingUp,
  ShieldCheck,
  Disc3,
  Video,
  Crown,
  Heart,
  ChevronDown,
  Check,
  X,
  FileCheck2,
  Layers,
  ArrowUpRight
} from 'lucide-react';
import { CreatorFeedPost, CreatorFeedPostType, FeedComment, PlatformId } from '../../types';
import { PLATFORM_CONFIGS } from '../../data/mockData';

interface CreatorFeedProps {
  posts: CreatorFeedPost[];
  onAddPost: (post: Omit<CreatorFeedPost, 'id' | 'createdAt' | 'ctcEndorsements' | 'commentsCount' | 'comments' | 'sharesCount'>) => void;
  currencySymbol?: string;
}

export const CreatorFeed: React.FC<CreatorFeedProps> = ({
  posts: initialPosts,
  onAddPost,
  currencySymbol = '$'
}) => {
  const [posts, setPosts] = useState<CreatorFeedPost[]>(initialPosts);
  const [filterType, setFilterType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'recent' | 'endorsed' | 'deal_value'>('recent');
  
  // Composer Modal / Expand
  const [isComposerOpen, setIsComposerOpen] = useState(false);
  const [newPostType, setNewPostType] = useState<CreatorFeedPostType>('deal_closed');
  const [newPostTitle, setNewPostTitle] = useState('');
  const [newPostContent, setNewPostContent] = useState('');
  const [newPostDealValue, setNewPostDealValue] = useState('$50,000 Escrow');
  const [newPostMetricLabel, setNewPostMetricLabel] = useState('Deal Valuation');
  const [newPostMetricValue, setNewPostMetricValue] = useState('$50,000');
  const [newPostMetricGrowth, setNewPostMetricGrowth] = useState('+40% Over Baseline');
  const [selectedPlatforms, setSelectedPlatforms] = useState<PlatformId[]>(['youtube', 'kick']);
  const [newPostTags, setNewPostTags] = useState('BrandDeal, EscrowLocked');

  // Expanded comment threads
  const [expandedComments, setExpandedComments] = useState<Record<string, boolean>>({ 'post-1': true });
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>({});

  // Proposal modal
  const [proposalPost, setProposalPost] = useState<CreatorFeedPost | null>(null);
  const [proposalOffer, setProposalOffer] = useState('1500');
  const [proposalPitch, setProposalPitch] = useState('');
  const [proposalSuccess, setProposalSuccess] = useState(false);

  // In-app toast feedback
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3200);
  };

  // Toggle Endorse ("Cut The Check")
  const handleToggleEndorse = (postId: string) => {
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          const isNowEndorsed = !p.userEndorsed;
          return {
            ...p,
            userEndorsed: isNowEndorsed,
            ctcEndorsements: isNowEndorsed ? p.ctcEndorsements + 1 : p.ctcEndorsements - 1
          };
        }
        return p;
      })
    );
  };

  // Toggle Bookmark
  const handleToggleBookmark = (postId: string) => {
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          const updated = !p.isBookmarked;
          showToast(updated ? 'Saved update to your Deal Intelligence Vault' : 'Removed from saved deals');
          return { ...p, isBookmarked: updated };
        }
        return p;
      })
    );
  };

  // Toggle Connection
  const handleToggleConnection = (postId: string) => {
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          const updated = !p.isConnected;
          showToast(updated ? `Connected with ${p.authorName}` : `Disconnected from ${p.authorName}`);
          return { ...p, isConnected: updated };
        }
        return p;
      })
    );
  };

  // Toggle comment thread
  const toggleComments = (postId: string) => {
    setExpandedComments((prev) => ({
      ...prev,
      [postId]: !prev[postId]
    }));
  };

  // Submit comment
  const handleAddComment = (postId: string) => {
    const text = commentInputs[postId]?.trim();
    if (!text) return;

    const newComment: FeedComment = {
      id: `comm-${Date.now()}`,
      authorName: 'Alex Rivers',
      authorHandle: '@alexrivers',
      authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
      authorBadge: 'Mogul Founder',
      content: text,
      createdAt: 'Just now',
      likesCount: 1
    };

    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          return {
            ...p,
            commentsCount: p.commentsCount + 1,
            comments: [...p.comments, newComment]
          };
        }
        return p;
      })
    );

    setCommentInputs((prev) => ({ ...prev, [postId]: '' }));
    showToast('Executive response posted to discussion thread');
  };

  // Handle Create Post
  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostContent.trim()) return;

    const tagsArray = newPostTags
      .split(',')
      .map((t) => t.trim().replace(/^#/, ''))
      .filter(Boolean);

    const newPost: CreatorFeedPost = {
      id: `post-${Date.now()}`,
      authorName: 'Alex Rivers',
      authorHandle: '@alexrivers',
      authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=160&auto=format&fit=crop&q=80',
      authorTitle: 'Multi-Platform Mogul · Diamond Certified',
      authorTier: 'diamond',
      verified: true,
      isConnected: true,
      type: newPostType,
      title: newPostTitle.trim() || undefined,
      content: newPostContent.trim(),
      dealValue: newPostDealValue.trim() || undefined,
      platforms: selectedPlatforms,
      mediaType: newPostType === 'milestone' ? 'plaque_badge' : 'metric_card',
      metricHighlight: {
        label: newPostMetricLabel.trim() || 'Audited Metric',
        value: newPostMetricValue.trim() || 'Verified',
        growth: newPostMetricGrowth.trim() || undefined
      },
      plaqueTier: newPostType === 'milestone' ? 'diamond' : undefined,
      createdAt: 'Just now',
      ctcEndorsements: 1,
      userEndorsed: true,
      commentsCount: 0,
      comments: [],
      sharesCount: 0,
      isBookmarked: false,
      tags: tagsArray.length > 0 ? tagsArray : ['MajorDeal', 'CutTheCheck']
    };

    setPosts([newPost, ...posts]);
    setIsComposerOpen(false);
    setNewPostTitle('');
    setNewPostContent('');
    showToast('Deal update broadcasted to 1,420 verified creator networkers!');
  };

  // Send proposal submit
  const handleSendProposal = (e: React.FormEvent) => {
    e.preventDefault();
    setProposalSuccess(true);
    setTimeout(() => {
      setProposalSuccess(false);
      setProposalPost(null);
      setProposalOffer('1500');
      setProposalPitch('');
      showToast('Deal proposal & escrow handshake transmitted to networker');
    }, 2000);
  };

  // Copy share link
  const handleShare = (post: CreatorFeedPost) => {
    navigator.clipboard?.writeText?.(window.location.href);
    showToast(`Update link for "${post.authorName}" copied to clipboard!`);
  };

  // Filtering & Sorting
  const filteredPosts = posts.filter((p) => {
    if (filterType === 'deals' && p.type !== 'deal_closed') return false;
    if (filterType === 'milestones' && p.type !== 'milestone') return false;
    if (filterType === 'collabs' && p.type !== 'collab_call') return false;
    if (filterType === 'intel' && p.type !== 'intel') return false;
    if (filterType === 'connected' && !p.isConnected) return false;
    if (filterType === 'bookmarked' && !p.isBookmarked) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchText =
        p.authorName.toLowerCase().includes(q) ||
        p.authorHandle.toLowerCase().includes(q) ||
        p.content.toLowerCase().includes(q) ||
        (p.title && p.title.toLowerCase().includes(q)) ||
        (p.dealValue && p.dealValue.toLowerCase().includes(q)) ||
        (p.tags && p.tags.some((t) => t.toLowerCase().includes(q)));
      if (!matchText) return false;
    }
    return true;
  });

  const sortedPosts = [...filteredPosts].sort((a, b) => {
    if (sortBy === 'endorsed') {
      return b.ctcEndorsements - a.ctcEndorsements;
    }
    if (sortBy === 'deal_value') {
      const getVal = (p: CreatorFeedPost) => {
        const match = p.dealValue?.match(/[\d,]+/);
        return match ? parseInt(match[0].replace(/,/g, ''), 10) : 0;
      };
      return getVal(b) - getVal(a);
    }
    return 0; // Default retains chronological state
  });

  // Top Connected Networkers Strip
  const networkersOnline = [
    {
      name: 'Marcus Vance',
      handle: '@vortex_prime',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80',
      deal: '$180k Apex Deal',
      online: true,
      tier: 'diamond'
    },
    {
      name: 'Elena Rostova',
      handle: '@elena_cinematic',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=120&auto=format&fit=crop&q=80',
      deal: 'Billboard #1 Sync',
      online: true,
      tier: 'platinum'
    },
    {
      name: 'Maya Lin',
      handle: '@mayalin_music',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&auto=format&fit=crop&q=80',
      deal: '$240k Master Sync',
      online: true,
      tier: 'diamond'
    },
    {
      name: 'Darius Knight',
      handle: '@knight_audio',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
      deal: '100k CCV Co-Stream',
      online: false,
      tier: 'gold'
    },
    {
      name: 'Sarah Jenkins',
      handle: '@sarahj_cuts',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80',
      deal: 'Rush Reel Escrow',
      online: true,
      tier: 'gold'
    }
  ];

  const getTierBadge = (tier?: string) => {
    if (tier === 'diamond') {
      return (
        <span className="flex items-center gap-1 text-[10px] font-black uppercase tracking-wider text-cyan-300">
          <Sparkles className="w-3 h-3 text-cyan-300" />
          Diamond Tier
        </span>
      );
    }
    if (tier === 'platinum') {
      return (
        <span className="flex items-center gap-1 text-[10px] font-black uppercase tracking-wider text-zinc-300">
          <Disc3 className="w-3 h-3 text-zinc-300" />
          Platinum Tier
        </span>
      );
    }
    return (
      <span className="flex items-center gap-1 text-[10px] font-black uppercase tracking-wider text-amber-400">
        <Award className="w-3 h-3 text-amber-400" />
        Gold Tier
      </span>
    );
  };

  const getTypeHeader = (type: CreatorFeedPostType) => {
    switch (type) {
      case 'deal_closed':
        return {
          label: 'MAJOR DEAL SIGNED & ESCROW FUNDED',
          icon: DollarSign,
          color: 'text-emerald-400',
          bg: 'bg-emerald-950/60 border-emerald-500/30'
        };
      case 'milestone':
        return {
          label: 'OFFICIAL MILESTONE & PLAQUE LANDMARK',
          icon: Award,
          color: 'text-amber-400',
          bg: 'bg-amber-950/60 border-amber-500/30'
        };
      case 'collab_call':
        return {
          label: 'HIGH-STAKES CO-STREAM & PRODUCTION CALL',
          icon: Radio,
          color: 'text-purple-400',
          bg: 'bg-purple-950/60 border-purple-500/30'
        };
      case 'intel':
        return {
          label: 'CREATOR INTEL & DEAL NEGOTIATION PLAYBOOK',
          icon: TrendingUp,
          color: 'text-blue-400',
          bg: 'bg-blue-950/60 border-blue-500/30'
        };
      case 'showcase':
        return {
          label: 'HIGH-FIDELITY BROADCAST SHOWREEL',
          icon: Video,
          color: 'text-pink-400',
          bg: 'bg-pink-950/60 border-pink-500/30'
        };
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-3 rounded-xl bg-zinc-900 border border-amber-500/40 text-amber-300 text-xs font-bold shadow-2xl flex items-center gap-2 animate-in fade-in slide-in-from-bottom-4 duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Network Deal Wire Live Ticker */}
      <div className="rounded-xl bg-[#0d121c] border border-zinc-800/80 px-4 py-2.5 flex items-center justify-between gap-4 overflow-hidden shadow-inner">
        <div className="flex items-center gap-2 shrink-0">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400">
            DEAL WIRE LIVE
          </span>
          <span className="text-zinc-600 hidden sm:inline">|</span>
        </div>

        <div className="overflow-x-auto scrollbar-none flex items-center gap-6 text-xs text-zinc-300 whitespace-nowrap">
          <span className="flex items-center gap-1.5 font-mono text-[11px]">
            <span className="text-white font-bold">@vortex_prime</span>
            <span className="text-emerald-400 font-bold">$180,000</span>
            <span className="text-zinc-500">Apex Exclusivity Escrow</span>
          </span>
          <span className="text-zinc-700">·</span>
          <span className="flex items-center gap-1.5 font-mono text-[11px]">
            <span className="text-white font-bold">@elena_cinematic</span>
            <span className="text-amber-300 font-bold">Platinum Plaque</span>
            <span className="text-zinc-500">4.2M Sync Streams</span>
          </span>
          <span className="text-zinc-700">·</span>
          <span className="flex items-center gap-1.5 font-mono text-[11px]">
            <span className="text-white font-bold">@mayalin_music</span>
            <span className="text-emerald-400 font-bold">$240,000</span>
            <span className="text-zinc-500">Sony Master Sync Buyout</span>
          </span>
          <span className="text-zinc-700">·</span>
          <span className="flex items-center gap-1.5 font-mono text-[11px]">
            <span className="text-white font-bold">@knight_audio</span>
            <span className="text-purple-400 font-bold">100k CCV</span>
            <span className="text-zinc-500">Charity Sim-Cast Locked</span>
          </span>
        </div>

        <div className="shrink-0 hidden md:flex items-center gap-1 text-[11px] font-mono text-zinc-400">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>100% Escrow Protected</span>
        </div>
      </div>

      {/* Connected Networkers Quick Bar */}
      <div className="bg-[#111622] rounded-2xl border border-zinc-800 p-4 shadow-xl">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-purple-400" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-white">
              Executive Connected Networkers
            </h3>
            <span className="text-[10px] text-zinc-500 font-mono">({networkersOnline.length} In Circle)</span>
          </div>
          <button
            onClick={() => setFilterType('connected')}
            className="text-[11px] font-bold text-purple-400 hover:text-purple-300 transition flex items-center gap-1"
          >
            <span>View Connected Updates</span>
            <ArrowUpRight className="w-3 h-3" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {networkersOnline.map((creator, i) => (
            <div
              key={i}
              onClick={() => {
                setSearchQuery(creator.handle);
                showToast(`Filtered feed to ${creator.name}`);
              }}
              className="p-2.5 rounded-xl bg-zinc-900/70 hover:bg-zinc-800/80 border border-zinc-800/80 hover:border-purple-500/40 transition cursor-pointer flex items-center gap-2.5 group"
            >
              <div className="relative shrink-0">
                <img
                  src={creator.avatar}
                  alt={creator.name}
                  className="w-9 h-9 rounded-lg object-cover border border-zinc-700"
                />
                {creator.online && (
                  <span
                    className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-zinc-900"
                    title="Online"
                  />
                )}
              </div>
              <div className="min-w-0">
                <div className="text-xs font-bold text-white truncate group-hover:text-purple-300 transition">
                  {creator.name}
                </div>
                <div className="text-[10px] font-mono text-emerald-400 truncate">
                  {creator.deal}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Feed Action Bar & Composer Trigger */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 p-4 rounded-2xl bg-gradient-to-r from-zinc-900 via-[#131926] to-zinc-900 border border-amber-500/20 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-yellow-600 flex items-center justify-center text-black font-black text-sm shadow-lg">
            CTC
          </div>
          <div>
            <h3 className="text-sm font-black text-white tracking-tight flex items-center gap-1.5">
              <span>Executive Deal Stream</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                Verified Escrow
              </span>
            </h3>
            <p className="text-xs text-zinc-400">
              Live dispatches, escrow payouts, plaque milestones, and high-value co-broadcasts.
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsComposerOpen(true)}
          className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-zinc-950 text-xs font-extrabold uppercase tracking-wider transition shadow-lg shrink-0"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>CTC Broadcast Deal Update</span>
        </button>
      </div>

      {/* Interactive Filter Tabs & Search Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-2 border-b border-zinc-800">
        {/* Segmented Filter Buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none p-1 bg-[#10141f] rounded-xl border border-zinc-800">
          <button
            onClick={() => setFilterType('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 whitespace-nowrap ${
              filterType === 'all'
                ? 'bg-zinc-800 text-white shadow-sm border border-zinc-700'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <span>All Updates ({posts.length})</span>
          </button>

          <button
            onClick={() => setFilterType('deals')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 whitespace-nowrap ${
              filterType === 'deals'
                ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/40 shadow-sm'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
            <span>Deal Signings</span>
          </button>

          <button
            onClick={() => setFilterType('milestones')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 whitespace-nowrap ${
              filterType === 'milestones'
                ? 'bg-amber-950/80 text-amber-300 border border-amber-500/40 shadow-sm'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Award className="w-3.5 h-3.5 text-amber-400" />
            <span>Plaque Milestones</span>
          </button>

          <button
            onClick={() => setFilterType('collabs')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 whitespace-nowrap ${
              filterType === 'collabs'
                ? 'bg-purple-950/80 text-purple-300 border border-purple-500/40 shadow-sm'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Radio className="w-3.5 h-3.5 text-purple-400" />
            <span>Co-Stream Calls</span>
          </button>

          <button
            onClick={() => setFilterType('intel')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 whitespace-nowrap ${
              filterType === 'intel'
                ? 'bg-blue-950/80 text-blue-300 border border-blue-500/40 shadow-sm'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5 text-blue-400" />
            <span>Deal Intel</span>
          </button>

          <button
            onClick={() => setFilterType('connected')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 whitespace-nowrap ${
              filterType === 'connected'
                ? 'bg-zinc-800 text-purple-300 border border-purple-500/40 shadow-sm'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Users className="w-3.5 h-3.5 text-purple-400" />
            <span>My Network</span>
          </button>

          <button
            onClick={() => setFilterType('bookmarked')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 whitespace-nowrap ${
              filterType === 'bookmarked'
                ? 'bg-zinc-800 text-amber-300 border border-amber-500/40 shadow-sm'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Bookmark className="w-3.5 h-3.5 text-amber-400" />
            <span>Vault</span>
          </button>
        </div>

        {/* Search & Sort */}
        <div className="flex items-center gap-2">
          <div className="relative flex-1 sm:w-64">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search deals, creator, tags..."
              className="w-full bg-[#111622] border border-zinc-800 rounded-xl pl-9 pr-8 py-1.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500/50"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="bg-[#111622] border border-zinc-800 rounded-xl px-3 py-1.5 text-xs text-zinc-300 focus:outline-none focus:border-amber-500/50 font-medium"
          >
            <option value="recent">Latest Dispatches</option>
            <option value="deal_value">Highest Valuation</option>
            <option value="endorsed">Most Endorsed</option>
          </select>
        </div>
      </div>

      {/* Feed Posts List */}
      <div className="space-y-6">
        {sortedPosts.length === 0 ? (
          <div className="p-12 text-center rounded-2xl bg-[#111622] border border-zinc-800 space-y-3">
            <div className="w-12 h-12 rounded-xl bg-zinc-800/80 flex items-center justify-center text-zinc-400 mx-auto">
              <Search className="w-6 h-6" />
            </div>
            <h4 className="text-base font-bold text-white">No deal updates match this filter</h4>
            <p className="text-xs text-zinc-400 max-w-sm mx-auto">
              Try adjusting your search criteria or clear the filters to view all industry updates.
            </p>
            <button
              onClick={() => {
                setFilterType('all');
                setSearchQuery('');
              }}
              className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-bold transition"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          sortedPosts.map((post) => {
            const headerInfo = getTypeHeader(post.type);
            const HeaderIcon = headerInfo.icon;
            const isCommentsOpen = !!expandedComments[post.id];

            return (
              <article
                key={post.id}
                className={`rounded-2xl bg-[#111622] border transition-all duration-200 overflow-hidden shadow-2xl ${
                  post.type === 'deal_closed'
                    ? 'border-emerald-500/30 hover:border-emerald-500/50'
                    : post.type === 'milestone'
                    ? 'border-amber-500/30 hover:border-amber-500/50'
                    : 'border-zinc-800 hover:border-zinc-700'
                }`}
              >
                {/* Executive Category Kicker Bar */}
                <div className={`px-5 py-2 border-b flex items-center justify-between text-[11px] font-bold ${headerInfo.bg}`}>
                  <div className="flex items-center gap-1.5">
                    <HeaderIcon className={`w-3.5 h-3.5 ${headerInfo.color}`} />
                    <span className={`tracking-wider ${headerInfo.color}`}>{headerInfo.label}</span>
                  </div>

                  <div className="flex items-center gap-2 text-zinc-400 font-mono text-[10px]">
                    <Clock className="w-3 h-3 text-zinc-500" />
                    <span>{post.createdAt}</span>
                  </div>
                </div>

                <div className="p-6 space-y-4">
                  {/* Author Header */}
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3.5">
                      <div className="relative">
                        <img
                          src={post.authorAvatar}
                          alt={post.authorName}
                          className={`w-12 h-12 rounded-xl object-cover border-2 ${
                            post.authorTier === 'diamond'
                              ? 'border-cyan-400/80 shadow-lg shadow-cyan-900/40'
                              : post.authorTier === 'platinum'
                              ? 'border-zinc-300/80'
                              : 'border-amber-400/80'
                          }`}
                        />
                        <div className="absolute -bottom-1 -right-1 bg-zinc-950 rounded-full p-0.5">
                          {post.verified && (
                            <CheckCircle2 className="w-4 h-4 text-emerald-400 fill-zinc-950" />
                          )}
                        </div>
                      </div>

                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="text-sm font-extrabold text-white hover:text-amber-300 transition cursor-pointer">
                            {post.authorName}
                          </h4>
                          <span className="text-xs text-zinc-500 font-mono">{post.authorHandle}</span>
                          <span className="text-zinc-600">·</span>
                          {getTierBadge(post.authorTier)}
                        </div>
                        <p className="text-xs text-zinc-400">{post.authorTitle}</p>
                      </div>
                    </div>

                    {/* Quick Connect & Bookmark Action */}
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => handleToggleConnection(post.id)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                          post.isConnected
                            ? 'bg-zinc-800 text-purple-300 border border-zinc-700 hover:bg-zinc-750'
                            : 'bg-purple-600 hover:bg-purple-500 text-white shadow-md'
                        }`}
                      >
                        {post.isConnected ? (
                          <>
                            <Check className="w-3 h-3 text-purple-400" />
                            <span>CTC Connected</span>
                          </>
                        ) : (
                          <>
                            <Plus className="w-3 h-3" />
                            <span>CTC Connect</span>
                          </>
                        )}
                      </button>

                      <button
                        onClick={() => handleToggleBookmark(post.id)}
                        title={post.isBookmarked ? 'Saved to Vault' : 'Save to Vault'}
                        className={`p-1.5 rounded-lg border transition ${
                          post.isBookmarked
                            ? 'bg-amber-950/40 border-amber-500/50 text-amber-400'
                            : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white'
                        }`}
                      >
                        <Bookmark className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Post Title & Deal Valuation Banner */}
                  {post.title && (
                    <h3 className="text-base font-black text-white tracking-tight leading-snug">
                      {post.title}
                    </h3>
                  )}

                  {/* Content Body */}
                  <p className="text-xs text-zinc-300 leading-relaxed whitespace-pre-line font-normal">
                    {post.content}
                  </p>

                  {/* Deal Highlight / Plaque Commemorative Card */}
                  {post.metricHighlight && (
                    <div className="p-4 rounded-xl bg-gradient-to-r from-zinc-900/90 to-[#131a29]/80 border border-zinc-800/90 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-emerald-950/60 border border-emerald-500/40 flex items-center justify-center text-emerald-400 font-bold shrink-0">
                          {post.type === 'milestone' ? (
                            <Award className="w-5 h-5 text-amber-400" />
                          ) : post.type === 'collab_call' ? (
                            <Radio className="w-5 h-5 text-purple-400" />
                          ) : (
                            <DollarSign className="w-5 h-5 text-emerald-400" />
                          )}
                        </div>

                        <div>
                          <span className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider block">
                            {post.metricHighlight.label}
                          </span>
                          <span className="text-lg font-black text-white font-mono tracking-tight">
                            {post.metricHighlight.value}
                          </span>
                        </div>
                      </div>

                      {post.metricHighlight.growth && (
                        <div className="text-xs font-bold text-emerald-400 flex items-center gap-1 font-mono sm:text-right">
                          <TrendingUp className="w-3.5 h-3.5" />
                          <span>{post.metricHighlight.growth}</span>
                        </div>
                      )}

                      {post.dealValue && (
                        <div className="px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-700/80 text-right shrink-0">
                          <span className="text-[9px] uppercase font-bold text-zinc-500 block">
                            Audit Status
                          </span>
                          <span className="text-xs font-extrabold text-amber-300 font-mono">
                            {post.dealValue}
                          </span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Platforms Tagged */}
                  {post.platforms && post.platforms.length > 0 && (
                    <div className="flex items-center gap-2 flex-wrap pt-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">
                        Syndicated DSPs:
                      </span>
                      {post.platforms.map((pid) => {
                        const conf = PLATFORM_CONFIGS[pid];
                        return (
                          <span
                            key={pid}
                            className="text-[11px] font-bold text-zinc-300 bg-zinc-900 border border-zinc-800 px-2.5 py-0.5 rounded-md flex items-center gap-1 font-mono"
                          >
                            <span
                              className="w-1.5 h-1.5 rounded-full"
                              style={{ backgroundColor: conf?.color || '#a855f7' }}
                            />
                            {conf?.name || pid}
                          </span>
                        );
                      })}
                    </div>
                  )}

                  {/* Tags */}
                  {post.tags && post.tags.length > 0 && (
                    <div className="flex items-center gap-2 flex-wrap text-[11px] text-zinc-400 font-mono">
                      {post.tags.map((tag, idx) => (
                        <span
                          key={idx}
                          onClick={() => setSearchQuery(tag)}
                          className="hover:text-amber-400 cursor-pointer transition"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Interactive Action Bar: Endorse, Comment, Proposal, Share */}
                  <div className="pt-3 border-t border-zinc-800/80 flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      {/* CUT THE CHECK Button (Endorsement) */}
                      <button
                        onClick={() => handleToggleEndorse(post.id)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-extrabold transition shadow-md ${
                          post.userEndorsed
                            ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-zinc-950 border border-amber-300 shadow-amber-500/20'
                            : 'bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-700/80'
                        }`}
                      >
                        <Flame className={`w-3.5 h-3.5 ${post.userEndorsed ? 'fill-zinc-950' : 'text-amber-400'}`} />
                        <span>Cut The Check!</span>
                        <span className="font-mono ml-0.5">({post.ctcEndorsements})</span>
                      </button>

                      {/* Discussion Thread Toggle */}
                      <button
                        onClick={() => toggleComments(post.id)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition border ${
                          isCommentsOpen
                            ? 'bg-zinc-800 text-white border-zinc-700'
                            : 'bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white border-zinc-800'
                        }`}
                      >
                        <MessageSquare className="w-3.5 h-3.5 text-zinc-400" />
                        <span>Discuss</span>
                        <span className="font-mono">({post.commentsCount})</span>
                      </button>
                    </div>

                    <div className="flex items-center gap-2">
                      {/* Deal Proposal Action for Collabs / Deals */}
                      {(post.type === 'collab_call' || post.type === 'deal_closed') && (
                        <button
                          onClick={() => setProposalPost(post)}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border border-purple-500/40 transition"
                        >
                          <Send className="w-3.5 h-3.5" />
                          <span>CTC Send Deal Proposal</span>
                        </button>
                      )}

                      {/* Share link */}
                      <button
                        onClick={() => handleShare(post)}
                        title="Share Update"
                        className="p-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white border border-zinc-800 transition"
                      >
                        <Share2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Expandable Comments Discussion Section */}
                  {isCommentsOpen && (
                    <div className="pt-4 border-t border-zinc-800/80 space-y-3 animate-in fade-in duration-200">
                      <div className="space-y-2.5">
                        {post.comments.length === 0 ? (
                          <p className="text-xs text-zinc-500 italic py-1">
                            No responses yet. Be the first creator to comment or congratulate!
                          </p>
                        ) : (
                          post.comments.map((comm) => (
                            <div
                              key={comm.id}
                              className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800/80 flex items-start gap-3"
                            >
                              <img
                                src={comm.authorAvatar}
                                alt={comm.authorName}
                                className="w-7 h-7 rounded-lg object-cover border border-zinc-700 mt-0.5 shrink-0"
                              />
                              <div className="flex-1 min-w-0 space-y-1">
                                <div className="flex items-center justify-between gap-2">
                                  <div className="flex items-center gap-1.5">
                                    <span className="text-xs font-bold text-white">
                                      {comm.authorName}
                                    </span>
                                    <span className="text-[10px] text-zinc-500 font-mono">
                                      {comm.authorHandle}
                                    </span>
                                    {comm.authorBadge && (
                                      <span className="text-[9px] font-bold text-amber-300 px-1.5 py-0.2 rounded bg-amber-950/60 border border-amber-500/30 font-mono">
                                        {comm.authorBadge}
                                      </span>
                                    )}
                                  </div>
                                  <span className="text-[10px] text-zinc-500 font-mono">
                                    {comm.createdAt}
                                  </span>
                                </div>
                                <p className="text-xs text-zinc-300 leading-relaxed font-normal">
                                  {comm.content}
                                </p>
                              </div>
                            </div>
                          ))
                        )}
                      </div>

                      {/* Add comment input */}
                      <div className="flex items-center gap-2 pt-1">
                        <input
                          type="text"
                          value={commentInputs[post.id] || ''}
                          onChange={(e) =>
                            setCommentInputs((prev) => ({
                              ...prev,
                              [post.id]: e.target.value
                            }))
                          }
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              handleAddComment(post.id);
                            }
                          }}
                          placeholder="Drop an executive comment or congratulatory note..."
                          className="flex-1 bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-purple-500"
                        />
                        <button
                          onClick={() => handleAddComment(post.id)}
                          className="px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition flex items-center gap-1 shadow-md"
                        >
                          <Send className="w-3.5 h-3.5" />
                          <span>CTC Reply</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </article>
            );
          })
        )}
      </div>

      {/* Broadcast / New Deal Update Modal */}
      {isComposerOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#111622] rounded-2xl border border-zinc-800 w-full max-w-xl p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-200 my-8">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-amber-500 flex items-center justify-center text-zinc-950 font-black text-xs">
                  CTC
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-white tracking-tight">
                    Broadcast Deal & Industry Update
                  </h3>
                  <p className="text-xs text-zinc-400">
                    Share contract signings, plaque certifications, or co-stream calls.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsComposerOpen(false)}
                className="text-zinc-500 hover:text-white p-1 rounded"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreatePost} className="space-y-4">
              {/* Post Type Selector */}
              <div>
                <label className="block text-xs font-bold text-zinc-300 uppercase mb-1.5">
                  Update Classification
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <button
                    type="button"
                    onClick={() => setNewPostType('deal_closed')}
                    className={`p-2.5 rounded-xl text-xs font-bold flex flex-col items-center gap-1 border transition ${
                      newPostType === 'deal_closed'
                        ? 'bg-emerald-950/70 border-emerald-500/60 text-emerald-300'
                        : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white'
                    }`}
                  >
                    <DollarSign className="w-4 h-4 text-emerald-400" />
                    <span>Deal Signed</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setNewPostType('milestone')}
                    className={`p-2.5 rounded-xl text-xs font-bold flex flex-col items-center gap-1 border transition ${
                      newPostType === 'milestone'
                        ? 'bg-amber-950/70 border-amber-500/60 text-amber-300'
                        : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white'
                    }`}
                  >
                    <Award className="w-4 h-4 text-amber-400" />
                    <span>Plaque Award</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setNewPostType('collab_call')}
                    className={`p-2.5 rounded-xl text-xs font-bold flex flex-col items-center gap-1 border transition ${
                      newPostType === 'collab_call'
                        ? 'bg-purple-950/70 border-purple-500/60 text-purple-300'
                        : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white'
                    }`}
                  >
                    <Radio className="w-4 h-4 text-purple-400" />
                    <span>Co-Broadcast</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setNewPostType('intel')}
                    className={`p-2.5 rounded-xl text-xs font-bold flex flex-col items-center gap-1 border transition ${
                      newPostType === 'intel'
                        ? 'bg-blue-950/70 border-blue-500/60 text-blue-300'
                        : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white'
                    }`}
                  >
                    <TrendingUp className="w-4 h-4 text-blue-400" />
                    <span>Deal Intel</span>
                  </button>
                </div>
              </div>

              {/* Title */}
              <div>
                <label className="block text-xs font-bold text-zinc-300 uppercase mb-1">
                  Headline / Subject
                </label>
                <input
                  type="text"
                  value={newPostTitle}
                  onChange={(e) => setNewPostTitle(e.target.value)}
                  placeholder="e.g. $75,000 Energy Drink Multi-Stream Deal Executed"
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              {/* Content Body */}
              <div>
                <label className="block text-xs font-bold text-zinc-300 uppercase mb-1">
                  Dispatch Details & Terms *
                </label>
                <textarea
                  required
                  rows={4}
                  value={newPostContent}
                  onChange={(e) => setNewPostContent(e.target.value)}
                  placeholder="Share verified details, escrow milestones, production specifications, or strategy takeaways..."
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              {/* Deal Metric / Highlight */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-zinc-300 uppercase mb-1">
                    Audited Valuation
                  </label>
                  <input
                    type="text"
                    value={newPostDealValue}
                    onChange={(e) => setNewPostDealValue(e.target.value)}
                    placeholder="e.g. $50,000 Escrow"
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-300 uppercase mb-1">
                    Metric Highlight
                  </label>
                  <input
                    type="text"
                    value={newPostMetricValue}
                    onChange={(e) => setNewPostMetricValue(e.target.value)}
                    placeholder="e.g. 5.4M Streams"
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-300 uppercase mb-1">
                    Growth / Terms
                  </label>
                  <input
                    type="text"
                    value={newPostMetricGrowth}
                    onChange={(e) => setNewPostMetricGrowth(e.target.value)}
                    placeholder="e.g. +35% YoY"
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              {/* Tags */}
              <div>
                <label className="block text-xs font-bold text-zinc-300 uppercase mb-1">
                  Tags (comma separated)
                </label>
                <input
                  type="text"
                  value={newPostTags}
                  onChange={(e) => setNewPostTags(e.target.value)}
                  placeholder="BrandDeal, EscrowLocked, Billboard"
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setIsComposerOpen(false)}
                  className="px-4 py-2 text-xs text-zinc-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 text-zinc-950 text-xs font-extrabold uppercase tracking-wider shadow-lg hover:from-amber-400 hover:to-yellow-400 transition"
                >
                  CTC Broadcast to Network
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Send Proposal Handshake Modal */}
      {proposalPost && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#111622] rounded-2xl border border-zinc-800 w-full max-w-lg p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <div className="flex items-center gap-3">
                <img
                  src={proposalPost.authorAvatar}
                  alt={proposalPost.authorName}
                  className="w-10 h-10 rounded-xl object-cover border border-zinc-700"
                />
                <div>
                  <h3 className="font-bold text-sm text-white">
                    Submit Proposal to {proposalPost.authorName}
                  </h3>
                  <span className="text-xs text-purple-400 font-mono">
                    Ref: {proposalPost.title || 'Collab Call'}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setProposalPost(null)}
                className="text-zinc-500 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {proposalSuccess ? (
              <div className="p-6 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-center space-y-2">
                <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
                <h4 className="text-base font-bold text-white">Deal Handshake Dispatched!</h4>
                <p className="text-xs text-emerald-200">
                  {proposalPost.authorName} has received your audited media kit and proposed escrow rate.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSendProposal} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-zinc-300 uppercase mb-1">
                    Proposed Escrow Compensation ({currencySymbol})
                  </label>
                  <input
                    type="number"
                    required
                    value={proposalOffer}
                    onChange={(e) => setProposalOffer(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-300 uppercase mb-1">
                    Collaboration Pitch & Available Broadcast Windows
                  </label>
                  <textarea
                    required
                    rows={3}
                    value={proposalPitch}
                    onChange={(e) => setProposalPitch(e.target.value)}
                    placeholder="Briefly state your channel reach, production equipment, and suggested schedule..."
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setProposalPost(null)}
                    className="px-4 py-2 text-xs text-zinc-400 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold uppercase tracking-wider shadow-lg"
                  >
                    CTC Transmit Escrow Handshake
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
