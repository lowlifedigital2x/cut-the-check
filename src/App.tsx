import React, { useState, useEffect } from 'react';
import {
  INITIAL_PLATFORM_CONNECTIONS,
  INITIAL_CONTENT_ITEMS,
  INITIAL_REVENUE_STREAMS,
  INITIAL_SCHEDULED_ITEMS,
  INITIAL_AUDIENCE_METRICS,
  SAMPLE_CHAT_POOL,
  INITIAL_MILESTONES
} from './data/mockData';
import {
  PlatformConnection,
  MultiStreamState,
  ContentItem,
  LiveChatEvent,
  ScheduledItem,
  PlatformId,
  SubscriptionTierId,
  MilestoneAward
} from './types';
import { Header } from './components/Header';
import { Navigation } from './components/Navigation';
import { OverviewTab } from './components/Overview/OverviewTab';
import { MultiLiveStudio } from './components/MultiLive/MultiLiveStudio';
import { MultiPostStudio } from './components/MultiPost/MultiPostStudio';
import { ContentScheduler } from './components/Scheduler/ContentScheduler';
import { MonetizationHub } from './components/Monetization/MonetizationHub';
import { AudienceAnalytics } from './components/Analytics/AudienceAnalytics';
import { CreatorNetworkHub } from './components/NetworkHub/CreatorNetworkHub';
import { PlatformConnections } from './components/Connections/PlatformConnections';
import { AICreatorCopilot } from './components/AICopilot/AICreatorCopilot';
import { SubscriptionModal } from './components/Subscription/SubscriptionModal';
import { PromoteMonitorSuite } from './components/Promote/PromoteMonitorSuite';
import { MilestoneAwards } from './components/MilestoneAwards/MilestoneAwards';
import { LaunchControlCenter } from './components/Launch/LaunchControlCenter';
import { SponsorshipPage } from './components/Sponsorship/SponsorshipPage';
import { PWAInstallBanner } from './components/PWA/PWAInstallBanner';
import { GitHubExportModal } from './components/GitHub/GitHubExportModal';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('content_that_counts');
  const [currency, setCurrency] = useState<string>('USD');
  const [isCopilotOpen, setIsCopilotOpen] = useState<boolean>(false);
  const [isGitHubModalOpen, setIsGitHubModalOpen] = useState<boolean>(false);
  const [subscriptionTier, setSubscriptionTier] = useState<SubscriptionTierId>('platinum');
  const [isSubscriptionModalOpen, setIsSubscriptionModalOpen] = useState<boolean>(false);
  const [milestones, setMilestones] = useState<MilestoneAward[]>(INITIAL_MILESTONES);

  useEffect(() => {
    const handleOpenGitHub = () => setIsGitHubModalOpen(true);
    window.addEventListener('open-github-modal', handleOpenGitHub);
    return () => window.removeEventListener('open-github-modal', handleOpenGitHub);
  }, []);

  // Normalize tab string to support both 7 CTC categories, short aliases, sub-suites, and milestone awards
  const normalizeTab = (tab: string) => {
    if (tab === 'overview') return 'content_that_counts';
    if (tab === 'live') return 'cut_the_chat';
    if (tab === 'multipost') return 'create_the_content';
    if (tab === 'scheduler') return 'certify_the_content';
    if (tab === 'analytics') return 'climb_the_charts';
    if (tab === 'network') return 'contact_the_creators';
    if (tab === 'monetization') return 'cut_the_check';
    if (tab === 'promote' || tab === 'monitor') return 'promote_monitor';
    if (tab === 'milestones' || tab === 'awards' || tab === 'trophy_case') return 'milestone_awards';
    if (tab === 'launch' || tab === 'launch_command') return 'launch';
    return tab;
  };

  const currentTab = normalizeTab(activeTab);

  // Milestone Award Handlers
  const handleToggleMilestoneDisplay = (id: string) => {
    setMilestones((prev) =>
      prev.map((m) =>
        m.id === id ? { ...m, isDisplayedOnProfile: !m.isDisplayedOnProfile } : m
      )
    );
  };

  const handleUpdateMilestoneDedication = (id: string, name: string, dedication: string) => {
    setMilestones((prev) =>
      prev.map((m) =>
        m.id === id ? { ...m, recipientName: name, customDedication: dedication } : m
      )
    );
  };

  const handleClaimMilestone = (id: string) => {
    setMilestones((prev) =>
      prev.map((m) =>
        m.id === id
          ? {
              ...m,
              unlocked: true,
              isDisplayedOnProfile: true,
              unlockedAt: 'October 12, 2026',
              currentValue: Math.max(m.currentValue, m.targetValue)
            }
          : m
      )
    );
  };

  // Platform Connections State
  const [connections, setConnections] = useState<PlatformConnection[]>(INITIAL_PLATFORM_CONNECTIONS);

  // Content Portfolio State
  const [contentItems, setContentItems] = useState<ContentItem[]>(INITIAL_CONTENT_ITEMS);

  // Scheduled Items State
  const [scheduledItems, setScheduledItems] = useState<ScheduledItem[]>(INITIAL_SCHEDULED_ITEMS);

  // Live Chat Events State
  const [chatEvents, setChatEvents] = useState<LiveChatEvent[]>([
    {
      id: 'chat-init-1',
      platformId: 'youtube',
      user: 'AudioTechPro',
      avatar: 'https://i.pravatar.cc/100?img=11',
      message: 'Multistream audio bitrate is super crisp! 🎚️',
      timestamp: '2m ago'
    },
    {
      id: 'chat-init-2',
      platformId: 'tiktok',
      user: 'sarah_creator',
      avatar: 'https://i.pravatar.cc/100?img=5',
      message: 'Sent 10x Roses! 🌹🌹🌹🌹🌹🌹🌹🌹🌹🌹',
      timestamp: '1m ago',
      isGift: true,
      giftType: 'Roses x10',
      giftValue: 10
    },
    {
      id: 'chat-init-3',
      platformId: 'kick',
      user: 'PixelGhost',
      avatar: 'https://i.pravatar.cc/100?img=12',
      message: 'Subscribed with 95/5 hype! Lets go Kick fam! 🟢',
      timestamp: 'Just now',
      badge: 'Tier 1 Sub'
    }
  ]);

  // Multistream Broadcast State
  const [streamState, setStreamState] = useState<MultiStreamState>({
    isBroadcasting: false,
    startedAt: null,
    selectedPlatforms: {
      tiktok: true,
      youtube: true,
      kick: true,
      facebook: true,
      spotify: false,
      applemusic: false
    },
    fps: 60.0,
    bitrateKbps: 6200,
    totalLiveViewers: 18450,
    platformViewers: {
      tiktok: 7420,
      youtube: 6210,
      kick: 3620,
      facebook: 1200,
      spotify: 0,
      applemusic: 0
    },
    streamTitle: '🔴 LIVE MULTICAST: Studio Production Jam & 6-Channel Sync',
    category: 'Music & Digital Production',
    quality: '1080p60'
  });

  // Currency Symbol
  const currencySymbol = {
    USD: '$',
    EUR: '€',
    GBP: '£',
    CAD: 'CA$'
  }[currency] || '$';

  // Real-time Chat Simulator when Broadcasting
  useEffect(() => {
    let chatInterval: any;
    if (streamState.isBroadcasting) {
      chatInterval = setInterval(() => {
        const randomItem = SAMPLE_CHAT_POOL[Math.floor(Math.random() * SAMPLE_CHAT_POOL.length)];
        const newMsg: LiveChatEvent = {
          ...randomItem,
          id: `chat-auto-${Date.now()}`,
          timestamp: 'Just now'
        };
        setChatEvents((prev) => [newMsg, ...prev.slice(0, 49)]);

        // Randomly fluctuate viewers slightly
        setStreamState((prev) => {
          const delta = Math.floor(Math.random() * 41) - 18;
          const newTotal = Math.max(prev.totalLiveViewers + delta, 100);
          return {
            ...prev,
            totalLiveViewers: newTotal,
            bitrateKbps: 6000 + Math.floor(Math.random() * 400)
          };
        });
      }, 3500);
    }
    return () => clearInterval(chatInterval);
  }, [streamState.isBroadcasting]);

  // Handlers
  const handleToggleStream = () => {
    setStreamState((prev) => {
      const willBroadcast = !prev.isBroadcasting;
      return {
        ...prev,
        isBroadcasting: willBroadcast,
        startedAt: willBroadcast ? Date.now() : null,
        totalLiveViewers: willBroadcast ? 18450 : 0
      };
    });
  };

  const handleTogglePlatformStream = (p: PlatformId) => {
    setStreamState((prev) => ({
      ...prev,
      selectedPlatforms: {
        ...prev.selectedPlatforms,
        [p]: !prev.selectedPlatforms[p]
      }
    }));
  };

  const handleToggleConnection = (p: PlatformId) => {
    setConnections((prev) =>
      prev.map((c) => (c.platformId === p ? { ...c, connected: !c.connected } : c))
    );
  };

  const handleUpdateStreamKey = (p: PlatformId, key: string) => {
    setConnections((prev) =>
      prev.map((c) => (c.platformId === p ? { ...c, streamKey: key } : c))
    );
  };

  const handleSendMessage = (msg: string, target: PlatformId | 'all') => {
    const newChat: LiveChatEvent = {
      id: `chat-${Date.now()}`,
      platformId: target === 'all' ? 'youtube' : target,
      user: 'Alex Rivers (You)',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
      message: msg,
      timestamp: 'Just now',
      badge: 'Streamer 👑'
    };
    setChatEvents((prev) => [newChat, ...prev]);
  };

  const handleAddSimulatedChat = (chat: LiveChatEvent) => {
    setChatEvents((prev) => [chat, ...prev]);
  };

  const handleScheduleItem = (item: ScheduledItem) => {
    setScheduledItems((prev) => [item, ...prev]);
  };

  const handleDeleteScheduledItem = (id: string) => {
    setScheduledItems((prev) => prev.filter((i) => i.id !== id));
  };

  const handleRetryPlatform = (itemId: string, platformId: PlatformId) => {
    setScheduledItems((prev) =>
      prev.map((item) => {
        if (item.id === itemId) {
          const updatedStatuses = { ...item.platformStatuses };
          updatedStatuses[platformId] = {
            platformId,
            status: 'published',
            publishedAt: new Date().toLocaleTimeString(),
            externalUrl: `https://${platformId}.com/watch/mock_retry`
          };

          // Check if any other platform failed
          const hasRemainingFailures = Object.values(updatedStatuses).some(
            (s) => s.status === 'failed'
          );

          return {
            ...item,
            overallStatus: hasRemainingFailures ? 'has_failures' : 'completed',
            platformStatuses: updatedStatuses
          };
        }
        return item;
      })
    );
  };

  const handleTriggerPublishNow = (itemId: string) => {
    setScheduledItems((prev) =>
      prev.map((item) => {
        if (item.id === itemId) {
          const updatedStatuses: Record<string, any> = {};
          item.platforms.forEach((p) => {
            updatedStatuses[p] = {
              platformId: p,
              status: 'published',
              publishedAt: new Date().toLocaleTimeString(),
              externalUrl: `https://${p}.com/released/mock`
            };
          });
          return {
            ...item,
            overallStatus: 'completed',
            platformStatuses: updatedStatuses
          };
        }
        return item;
      })
    );
  };

  const handlePublishContent = (item: ContentItem) => {
    setContentItems((prev) => [item, ...prev]);
  };

  const totalEarnings = connections.reduce((acc, c) => acc + c.monthlyRevenue, 0);
  const hasFailures = scheduledItems.some((i) => i.overallStatus === 'has_failures');

  return (
    <div className="min-h-screen bg-[#0B0E14] text-zinc-100 flex flex-col selection:bg-purple-500 selection:text-white">
      {/* Top Header */}
      <Header
        streamState={streamState}
        onToggleStream={handleToggleStream}
        onOpenMultiPost={() => setActiveTab('multipost')}
        onOpenAICopilot={() => setIsCopilotOpen(true)}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        connections={connections}
        currency={currency}
        setCurrency={setCurrency}
        subscriptionTier={subscriptionTier}
        onOpenSubscriptionModal={() => setIsSubscriptionModalOpen(true)}
        mountedPlaquesCount={milestones.filter((m) => m.unlocked && m.isDisplayedOnProfile).length}
        onOpenGitHubModal={() => setIsGitHubModalOpen(true)}
      />

      {/* Navigation Submenu */}
      <Navigation
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isBroadcasting={streamState.isBroadcasting}
        totalEarnings={totalEarnings}
        totalLiveViewers={streamState.totalLiveViewers}
        scheduledCount={scheduledItems.length}
        hasFailures={hasFailures}
        milestonesCount={milestones.filter((m) => m.unlocked).length}
      />

      {/* Main Tab Content Canvas */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 lg:p-8 space-y-6">
        {currentTab === 'content_that_counts' && (
          <OverviewTab
            connections={connections}
            streamState={streamState}
            onToggleStream={handleToggleStream}
            onTogglePlatformStream={handleTogglePlatformStream}
            onNavigateToTab={setActiveTab}
            contentItems={contentItems}
            chatEvents={chatEvents}
            currencySymbol={currencySymbol}
            milestones={milestones}
          />
        )}

        {currentTab === 'create_the_content' && (
          <MultiPostStudio
            onPublishContent={handlePublishContent}
            onNavigateToSchedule={() => setActiveTab('certify_the_content')}
          />
        )}

        {currentTab === 'cut_the_chat' && (
          <MultiLiveStudio
            streamState={streamState}
            onToggleStream={handleToggleStream}
            onTogglePlatformStream={handleTogglePlatformStream}
            chatEvents={chatEvents}
            onSendMessage={handleSendMessage}
            onAddSimulatedChat={handleAddSimulatedChat}
          />
        )}

        {currentTab === 'certify_the_content' && (
          <ContentScheduler
            scheduledItems={scheduledItems}
            onScheduleItem={handleScheduleItem}
            onDeleteItem={handleDeleteScheduledItem}
            onRetryPlatform={handleRetryPlatform}
            onTriggerPublishNow={handleTriggerPublishNow}
          />
        )}

        {currentTab === 'climb_the_charts' && (
          <AudienceAnalytics metrics={INITIAL_AUDIENCE_METRICS} />
        )}

        {currentTab === 'contact_the_creators' && (
          <CreatorNetworkHub currencySymbol={currencySymbol} />
        )}

        {currentTab === 'cut_the_check' && (
          <MonetizationHub
            connections={connections}
            revenueStreams={INITIAL_REVENUE_STREAMS}
            contentItems={contentItems}
            currencySymbol={currencySymbol}
            subscriptionTier={subscriptionTier}
            onOpenSubscriptionModal={() => setIsSubscriptionModalOpen(true)}
          />
        )}

        {currentTab === 'promote_monitor' && (
          <PromoteMonitorSuite
            currencySymbol={currencySymbol}
          />
        )}

        {currentTab === 'milestone_awards' && (
          <MilestoneAwards
            milestones={milestones}
            onToggleDisplay={handleToggleMilestoneDisplay}
            onUpdateDedication={handleUpdateMilestoneDedication}
            onClaimAward={handleClaimMilestone}
            subscriptionTier={subscriptionTier}
          />
        )}

        {currentTab === 'launch' && (
          <LaunchControlCenter
            streamState={streamState}
            onToggleStream={handleToggleStream}
            connections={connections}
            onNavigateToTab={setActiveTab}
            subscriptionTier={subscriptionTier}
          />
        )}

        {currentTab === 'sponsorship' && (
          <SponsorshipPage />
        )}

        {currentTab === 'connections' && (
          <PlatformConnections
            connections={connections}
            onToggleConnection={handleToggleConnection}
            onUpdateStreamKey={handleUpdateStreamKey}
          />
        )}
      </main>

      {/* Gemini AI Content Copilot Modal */}
      <AICreatorCopilot
        isOpen={isCopilotOpen}
        onClose={() => setIsCopilotOpen(false)}
        onApplyTitle={(title) => {
          setStreamState((prev) => ({ ...prev, streamTitle: title }));
          setActiveTab('cut_the_chat');
        }}
      />

      {/* CTC Subscription Tiers Modal (Free, Paid, Premium) */}
      <SubscriptionModal
        isOpen={isSubscriptionModalOpen}
        onClose={() => setIsSubscriptionModalOpen(false)}
        currentTier={subscriptionTier}
        onSelectTier={(tier) => setSubscriptionTier(tier)}
        currencySymbol={currencySymbol}
      />

      {/* PWA Mobile Add to Home Screen Banner */}
      <PWAInstallBanner />

      {/* GitHub Sync & Export Modal */}
      <GitHubExportModal
        isOpen={isGitHubModalOpen}
        onClose={() => setIsGitHubModalOpen(false)}
      />
    </div>
  );
}
