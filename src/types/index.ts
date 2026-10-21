export type PlatformId =
  | 'tiktok'
  | 'spotify'
  | 'youtube'
  | 'kick'
  | 'twitch'
  | 'applemusic'
  | 'facebook'
  | 'instagram'
  | 'twitter'
  | 'amazonmusic'
  | 'rumble'
  | 'soundcloud'
  | 'linkedin'
  | 'custom_rtmp'
  | 'trovo'
  | 'dlive'
  | 'nimo'
  | 'soop'
  | 'bilibili'
  | 'vimeo'
  | 'younow'
  | 'dailymotion'
  | 'tidal'
  | 'deezer'
  | 'audiomack'
  | 'bandcamp'
  | 'pandora'
  | 'iheart'
  | 'napster'
  | 'qobuz'
  | 'boomplay'
  | 'audius'
  | 'beatport'
  | 'vevo'
  | 'threads'
  | 'snapchat'
  | 'pinterest'
  | 'reddit'
  | 'discord'
  | 'telegram'
  | 'bluesky'
  | 'tumblr'
  | 'mastodon'
  | 'whatsapp'
  | 'patreon'
  | 'substack'
  | 'mixcloud';

export interface PlatformConfig {
  id: PlatformId;
  name: string;
  category: 'video' | 'audio' | 'stream' | 'social';
  color: string;
  bgLight: string;
  badgeColor: string;
  iconName: string;
  supportsLive: boolean;
  supportsPost: boolean;
  supportsAudio: boolean;
  monetizationTypes: string[];
  ingestRtmpUrl?: string;
  defaultRpm: number; // Estimated Revenue Per Mille/Stream
}

export interface PlatformConnection {
  platformId: PlatformId;
  connected: boolean;
  accountHandle: string;
  displayName: string;
  avatarUrl: string;
  streamKey: string;
  rtmpUrl: string;
  isLiveActive: boolean;
  permissions: {
    live: boolean;
    publish: boolean;
    analytics: boolean;
    monetization: boolean;
  };
  lastSync: string;
  followersCount: number;
  monthlyRevenue: number;
}

export interface RevenueStream {
  id: string;
  platformId: PlatformId;
  category: 'AdSense' | 'Subscriptions' | 'Live Gifts' | 'Royalties' | 'Creator Fund' | 'Stars & Tips' | 'Super Chats & Thanks';
  amount: number;
  currency: string;
  changePercent: number;
  payoutStatus: 'Pending' | 'Processed' | 'Available';
  date: string;
}

export interface ContentItem {
  id: string;
  title: string;
  description: string;
  contentType: 'video' | 'short' | 'audio' | 'stream_vod';
  thumbnailUrl: string;
  publishedAt: string;
  platforms: PlatformId[];
  totalViews: number;
  totalEarnings: number;
  rpm: number;
  breakdown: {
    [key in PlatformId]?: {
      views: number;
      earnings: number;
      likes: number;
      shares: number;
    };
  };
}

export interface LiveChatEvent {
  id: string;
  platformId: PlatformId;
  user: string;
  avatar: string;
  message: string;
  timestamp: string;
  badge?: string;
  isGift?: boolean;
  giftType?: string;
  giftValue?: number;
  isSuperChat?: boolean;
  superChatAmount?: string;
}

export interface MultiStreamState {
  isBroadcasting: boolean;
  startedAt: number | null;
  selectedPlatforms: Partial<Record<PlatformId, boolean>>;
  fps: number;
  bitrateKbps: number;
  totalLiveViewers: number;
  platformViewers: Partial<Record<PlatformId, number>>;
  streamTitle: string;
  category: string;
  quality: '1080p60' | '1440p60' | '4k60';
}

export interface MultiPostPayload {
  title: string;
  description: string;
  mediaFile: File | null;
  mediaUrl: string | null;
  mediaType: 'video' | 'audio';
  platforms: PlatformId[];
  platformOverrides: {
    tiktok?: { tags: string[]; soundId: string; allowDuet: boolean; allowStitch: boolean };
    youtube?: { tags: string[]; category: string; visibility: 'public' | 'unlisted'; isShort: boolean; monetization: boolean };
    kick?: { streamHighlight: boolean; tags: string[] };
    spotify?: { episodeNumber: number; seasonNumber: number; explicit: boolean; releaseType: 'podcast' | 'music_clip' };
    applemusic?: { genre: string; copyright: string; spatialAudio: boolean };
    facebook?: { shareToReels: boolean; allowStars: boolean; postToGroup: boolean };
  };
  scheduleDate?: string;
  isDraft?: boolean;
}

export interface AudienceMetric {
  platformId: PlatformId;
  followers: number;
  followersGrowth: number;
  engagementRate: number;
  avgWatchTimeMinutes: number;
  topAudienceAge: string;
  topCountry: string;
}

export interface PlatformDeliveryStatus {
  platformId: PlatformId;
  status: 'pending' | 'syncing' | 'published' | 'failed';
  publishedAt?: string;
  externalUrl?: string;
  errorMessage?: string;
  canRetry?: boolean;
}

export interface ScheduledItem {
  id: string;
  type: 'post' | 'stream';
  title: string;
  description: string;
  mediaType?: 'video' | 'audio' | 'stream_broadcast';
  mediaUrl?: string;
  scheduledFor: string; // ISO date string
  timezone: string;
  createdAt: string;
  platforms: PlatformId[];
  overallStatus: 'scheduled' | 'publishing' | 'completed' | 'has_failures';
  platformStatuses: Record<string, PlatformDeliveryStatus>;
  category?: string;
  tags?: string[];
  streamSettings?: {
    resolution: string;
    lowLatency: boolean;
    notifySubscribers: boolean;
  };
}

export interface CreatorTalent {
  id: string;
  name: string;
  handle: string;
  avatar: string;
  headline: string;
  category: 'cameraman' | 'editing' | 'sound' | 'design' | 'stream_engineer';
  categoryLabel: string;
  hourlyRate: number;
  fixedRateStarting: number;
  currency: string;
  rating: number;
  reviewsCount: number;
  completedGigs: number;
  location: string;
  bio: string;
  skills: string[];
  portfolio: {
    title: string;
    type: 'video' | 'audio' | 'image';
    thumbnail: string;
    url?: string;
  }[];
  verified: boolean;
  online: boolean;
  featuredClients: string[];
}

export interface NetworkGig {
  id: string;
  title: string;
  creatorName: string;
  creatorAvatar: string;
  category: 'cameraman' | 'editing' | 'sound' | 'design' | 'stream_engineer';
  budget: string;
  deadline: string;
  description: string;
  proposalsCount: number;
  postedAt: string;
}

export type SubscriptionTierId = 'free' | 'paid' | 'premium';

export interface SubscriptionTier {
  id: SubscriptionTierId;
  name: string;
  tagline: string;
  badge: string;
  priceMonthly: number;
  priceAnnually: number;
  description: string;
  features: string[];
  limitations?: string[];
  maxConnectedPlatforms: number | 'all_14';
  maxStreamingResolution: '720p60' | '1080p60' | '4K60 HDR';
  payoutSpeed: string;
  aiCreditsPerMonth: number | 'unlimited';
  isPopular?: boolean;
}

export type PlaqueTier = 'gold' | 'platinum' | 'diamond';

export type MilestoneCategory = 'streams' | 'audience' | 'revenue' | 'broadcast' | 'distribution';

export interface MilestoneAward {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  tier: PlaqueTier;
  category: MilestoneCategory;
  metricLabel: string;
  targetValue: number;
  currentValue: number;
  unit: string;
  unlocked: boolean;
  unlockedAt?: string;
  isDisplayedOnProfile: boolean;
  certificationId: string;
  discType: 'vinyl' | 'cd_optical' | 'multi_disc' | 'cassette_gold';
  recipientName: string;
  customDedication?: string;
  sharesCount: number;
  featuredTrackOrSeries?: string;
  platformsIncluded: PlatformId[];
}

export type CreatorFeedPostType = 'deal_closed' | 'milestone' | 'collab_call' | 'intel' | 'showcase';

export interface FeedComment {
  id: string;
  authorName: string;
  authorHandle: string;
  authorAvatar: string;
  authorBadge?: string;
  content: string;
  createdAt: string;
  likesCount: number;
}

export interface CreatorFeedPost {
  id: string;
  authorName: string;
  authorHandle: string;
  authorAvatar: string;
  authorTitle: string;
  authorTier?: PlaqueTier;
  verified: boolean;
  isConnected: boolean;
  type: CreatorFeedPostType;
  title?: string;
  content: string;
  dealValue?: string;
  platforms?: PlatformId[];
  mediaUrl?: string;
  mediaType?: 'image' | 'metric_card' | 'plaque_badge';
  metricHighlight?: {
    label: string;
    value: string;
    growth?: string;
  };
  plaqueTier?: PlaqueTier;
  createdAt: string;
  ctcEndorsements: number;
  userEndorsed?: boolean;
  commentsCount: number;
  comments: FeedComment[];
  sharesCount: number;
  isBookmarked?: boolean;
  tags?: string[];
}

export type EngagementGrowthTier =
  | 'all'
  | 'viral_breakout'      // +100% to +300% monthly growth
  | 'high_velocity'       // +40% to +100% monthly growth
  | 'steady_climber'      // +15% to +40% monthly growth
  | 'underground_gem'     // High Engagement Rate (>= 10%), emerging audience (<100k)
  | 'established_titan';  // 500k+ reach, steady high volume

export interface ScoutContact {
  id: string;
  name: string;
  handle: string;
  avatar: string;
  primaryRole: string;
  primaryPlatform: PlatformId;
  verified: boolean;
  tier: PlaqueTier;
  growthTier: 'viral_breakout' | 'high_velocity' | 'steady_climber' | 'underground_gem' | 'established_titan';
  growthTierLabel: string;
  followersCount: number;
  monthlyGrowthPercent: number;
  engagementRatePercent: number;
  streamVelocityViewsPerDay: number;
  retentionRatePercent: number;
  estimatedRpm: number;
  arScoutScore: number;
  scoutingStatus: 'priority_sign' | 'watchlist' | 'collab_ready' | 'in_negotiation';
  soundOrContentNiche: string;
  topAudienceDemographic: string;
  recentBreakoutDrop: string;
  isWatchlisted?: boolean;
}

