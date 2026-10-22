import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  Radio,
  Send,
  AlertTriangle,
  CheckCircle2,
  RefreshCw,
  Plus,
  Trash2,
  ExternalLink,
  Sparkles,
  Info,
  ChevronRight,
  Filter,
  Check,
  Video,
  Music,
  Share2
} from 'lucide-react';
import { ScheduledItem, PlatformId, PlatformDeliveryStatus } from '../../types';
import { PLATFORM_CONFIGS } from '../../data/mockData';
import { PlatformBadge } from '../common/PlatformBadge';
import { OwnerTagline } from '../common/OwnerTagline';

interface ContentSchedulerProps {
  scheduledItems: ScheduledItem[];
  onScheduleItem: (item: ScheduledItem) => void;
  onDeleteItem: (id: string) => void;
  onRetryPlatform: (itemId: string, platformId: PlatformId) => void;
  onTriggerPublishNow: (itemId: string) => void;
}

export const ContentScheduler: React.FC<ContentSchedulerProps> = ({
  scheduledItems,
  onScheduleItem,
  onDeleteItem,
  onRetryPlatform,
  onTriggerPublishNow
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'queue' | 'new_schedule'>('queue');
  const [filterType, setFilterType] = useState<'all' | 'post' | 'stream' | 'failed'>('all');

  // Form State
  const [itemType, setItemType] = useState<'post' | 'stream'>('post');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [mediaType, setMediaType] = useState<'video' | 'audio'>('video');
  const [scheduledDate, setScheduledDate] = useState('2026-10-15');
  const [scheduledTime, setScheduledTime] = useState('18:00');
  const [timezone, setTimezone] = useState('EST (UTC-4)');
  const [selectedPlatforms, setSelectedPlatforms] = useState<PlatformId[]>([
    'youtube',
    'tiktok',
    'facebook'
  ]);
  const [streamResolution, setStreamResolution] = useState('1080p60');
  const [notifyFollowers, setNotifyFollowers] = useState(true);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [lastScheduledTitle, setLastScheduledTitle] = useState('');

  const togglePlatform = (p: PlatformId) => {
    if (selectedPlatforms.includes(p)) {
      if (selectedPlatforms.length > 1) {
        setSelectedPlatforms(selectedPlatforms.filter((item) => item !== p));
      }
    } else {
      setSelectedPlatforms([...selectedPlatforms, p]);
    }
  };

  const handleSelectAllChannels = () => {
    const supported = (Object.keys(PLATFORM_CONFIGS) as PlatformId[]).filter((p) =>
      itemType === 'stream' ? PLATFORM_CONFIGS[p]?.supportsLive : true
    );
    setSelectedPlatforms(supported);
  };

  const handleAddAllMusicPlatforms = () => {
    setItemType('post');
    setMediaType('audio');
    setSelectedPlatforms(['spotify', 'applemusic', 'amazonmusic', 'soundcloud', 'youtube', 'tiktok']);
  };

  const handleCreateSchedule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const initialStatuses: Record<string, PlatformDeliveryStatus> = {};
    selectedPlatforms.forEach((p) => {
      initialStatuses[p] = {
        platformId: p,
        status: 'pending'
      };
    });

    const newItem: ScheduledItem = {
      id: `sched-${Date.now()}`,
      type: itemType,
      title: title.trim(),
      description: description.trim(),
      mediaType: itemType === 'stream' ? 'stream_broadcast' : mediaType,
      mediaUrl:
        mediaType === 'audio'
          ? 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=600&auto=format&fit=crop&q=80'
          : 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=600&auto=format&fit=crop&q=80',
      scheduledFor: `${scheduledDate}T${scheduledTime}:00Z`,
      timezone,
      createdAt: new Date().toISOString(),
      platforms: selectedPlatforms,
      overallStatus: 'scheduled',
      platformStatuses: initialStatuses,
      category: itemType === 'stream' ? 'Live Multicast' : 'Digital Content',
      streamSettings:
        itemType === 'stream'
          ? {
              resolution: streamResolution,
              lowLatency: true,
              notifySubscribers: notifyFollowers
            }
          : undefined
    };

    onScheduleItem(newItem);
    setLastScheduledTitle(title.trim());
    setShowSuccessToast(true);
    setTimeout(() => setShowSuccessToast(false), 5000);

    // Reset Form
    setTitle('');
    setDescription('');
    setActiveSubTab('queue');
  };

  const filteredItems = scheduledItems.filter((item) => {
    if (filterType === 'post') return item.type === 'post';
    if (filterType === 'stream') return item.type === 'stream';
    if (filterType === 'failed') return item.overallStatus === 'has_failures';
    return true;
  });

  const failedItems = scheduledItems.filter((i) => i.overallStatus === 'has_failures');

  return (
    <div className="space-y-6">
      {/* Top Header & Overview */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <OwnerTagline label="CREATOR RIGHTS" phrase="Claim the Credit" className="mb-2" />
          <h2 className="text-xl font-extrabold text-white flex items-center gap-2.5">
            <Calendar className="w-6 h-6 text-purple-400" />
            <span>Universal Content & Multi-Stream Scheduler</span>
          </h2>
          <p className="text-xs text-zinc-400 mt-1">
            Schedule automated video drops, music releases, or synchronized live stream reservations across all connected channels.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveSubTab('queue')}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition ${
              activeSubTab === 'queue'
                ? 'bg-zinc-800 text-white border border-zinc-700 shadow-md'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
            }`}
          >
            <span>Scheduled Queue ({scheduledItems.length})</span>
          </button>
          <button
            onClick={() => setActiveSubTab('new_schedule')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition shadow-lg ${
              activeSubTab === 'new_schedule'
                ? 'bg-purple-600 text-white'
                : 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:from-purple-500 hover:to-indigo-500'
            }`}
          >
            <Plus className="w-4 h-4" />
            <span>Schedule New Release</span>
          </button>
        </div>
      </div>

      {/* Success Confirmation Banner */}
      {showSuccessToast && (
        <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-500/20 via-emerald-950/40 to-zinc-900 border border-emerald-500/40 text-emerald-300 flex items-center justify-between shadow-lg animate-in fade-in slide-in-from-top duration-300">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <div>
              <p className="text-xs font-bold text-white">
                Release Successfully Scheduled & Reserved!
              </p>
              <p className="text-xs text-emerald-200/90 mt-0.5">
                "{lastScheduledTitle}" is queued for automated delivery. All target RTMP ingests and API endpoints are primed.
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowSuccessToast(false)}
            className="text-xs text-emerald-400 hover:text-white px-2 py-1 rounded bg-emerald-500/10"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Delivery Failure Alert Banner */}
      {failedItems.length > 0 && (
        <div className="p-4 rounded-xl bg-gradient-to-r from-rose-950/60 via-zinc-900 to-zinc-900 border border-rose-500/50 text-rose-300 flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-xl">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-bold text-white flex items-center gap-2">
                <span>Platform Delivery Notification: Action Required</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-500/30 text-rose-300 font-mono">
                  {failedItems.length} Release Alert
                </span>
              </p>
              <p className="text-xs text-zinc-300 mt-1">
                One or more connected platforms encountered an authentication or metadata error during automated broadcast. Review below to retry delivery immediately.
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              setActiveSubTab('queue');
              setFilterType('failed');
            }}
            className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold whitespace-nowrap shadow-md self-start md:self-center"
          >
            Review Failed Platforms
          </button>
        </div>
      )}

      {/* Main Content: Form or Queue */}
      {activeSubTab === 'new_schedule' ? (
        /* Create New Schedule Form */
        <div className="bg-[#111622] rounded-2xl border border-zinc-800 p-6 shadow-xl max-w-4xl mx-auto">
          <form onSubmit={handleCreateSchedule} className="space-y-6">
            <div>
              <h3 className="text-base font-bold text-white mb-1">
                Schedule Multi-Platform Content or Live Stream
              </h3>
              <p className="text-xs text-zinc-400">
                Choose whether you are scheduling a prerecorded content drop or a live multicasting broadcast.
              </p>
            </div>

            {/* Type Switcher */}
            <div className="grid grid-cols-2 gap-3 p-1.5 bg-zinc-900 rounded-xl border border-zinc-800">
              <button
                type="button"
                onClick={() => setItemType('post')}
                className={`py-2.5 px-4 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition ${
                  itemType === 'post'
                    ? 'bg-zinc-800 text-white shadow-md border border-zinc-700'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                <Video className="w-4 h-4 text-blue-400" />
                <span>Prerecorded Video / Audio Drop</span>
              </button>
              <button
                type="button"
                onClick={() => setItemType('stream')}
                className={`py-2.5 px-4 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition ${
                  itemType === 'stream'
                    ? 'bg-red-500/20 text-red-300 shadow-md border border-red-500/40'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                <Radio className="w-4 h-4 text-red-400" />
                <span>Scheduled Live Stream Event</span>
              </button>
            </div>

            {/* Title & Description */}
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-1.5">
                  Master Release Title *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder={
                    itemType === 'stream'
                      ? 'e.g. 🔴 LIVE: 24h Studio Marathon & Sound Design Jam'
                      : 'e.g. 5 Mistakes That Kill Creator Growth in 2026 (Full Guide)'
                  }
                  className="w-full bg-zinc-900 border border-zinc-800 focus:border-purple-500 rounded-xl px-4 py-2.5 text-sm text-white placeholder-zinc-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-1.5">
                  Description / Show Notes / Tags
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Universal description, chapters, links, and hashtags..."
                  className="w-full bg-zinc-900 border border-zinc-800 focus:border-purple-500 rounded-xl px-4 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Target Platforms Checkbox Grid with 1-Click Presets */}
            <div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                <label className="text-xs font-bold text-amber-200 uppercase tracking-wider">
                  Target Broadcast Destinations ({selectedPlatforms.length} Selected)
                </label>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleAddAllMusicPlatforms}
                    className="deal-btn-gold text-[10px] font-black px-2.5 py-1 rounded-md shadow-sm"
                    title="1-Click: Select Spotify, Apple Music, Amazon Music, SoundCloud, YouTube, TikTok"
                  >
                    🎵 CTC Add All Music Platforms
                  </button>
                  <button
                    type="button"
                    onClick={handleSelectAllChannels}
                    className="deal-btn-platinum text-[10px] font-bold px-2.5 py-1 rounded-md shadow-sm"
                    title="Select all supported channels"
                  >
                    CTC Select All Channels
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2.5">
                {(Object.keys(PLATFORM_CONFIGS) as PlatformId[]).map(
                  (pid) => {
                    const cfg = PLATFORM_CONFIGS[pid];
                    const isSelected = selectedPlatforms.includes(pid);
                    const isSupported = itemType === 'stream' ? cfg.supportsLive : true;

                    return (
                      <button
                        type="button"
                        key={pid}
                        disabled={!isSupported}
                        onClick={() => togglePlatform(pid)}
                        className={`p-3 rounded-xl border text-left transition flex flex-col justify-between h-20 ${
                          !isSupported
                            ? 'opacity-30 cursor-not-allowed bg-zinc-950 border-zinc-900'
                            : isSelected
                            ? 'bg-zinc-800/90 border-purple-500/80 shadow-md ring-1 ring-purple-500/40'
                            : 'bg-zinc-900/60 border-zinc-800 hover:border-zinc-700'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <PlatformBadge platformId={pid} size="sm" showLabel={false} />
                          <div
                            className={`w-4 h-4 rounded-md flex items-center justify-center border ${
                              isSelected
                                ? 'bg-purple-600 border-purple-500 text-white'
                                : 'border-zinc-700 bg-zinc-800'
                            }`}
                          >
                            {isSelected && <Check className="w-3 h-3" />}
                          </div>
                        </div>
                        <div>
                          <span className="text-xs font-bold text-white block">{cfg.name}</span>
                          <span className="text-[10px] text-zinc-400">
                            {itemType === 'stream' && !cfg.supportsLive ? 'No Live RTMP' : 'Ready'}
                          </span>
                        </div>
                      </button>
                    );
                  }
                )}
              </div>
            </div>

            {/* Date, Time & Timezone Pickers */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 rounded-xl bg-zinc-900/80 border border-zinc-800">
              <div>
                <label className="block text-xs font-bold text-zinc-300 mb-1.5 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-purple-400" />
                  <span>Release Date</span>
                </label>
                <input
                  type="date"
                  value={scheduledDate}
                  onChange={(e) => setScheduledDate(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-300 mb-1.5 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-blue-400" />
                  <span>Release Time</span>
                </label>
                <input
                  type="time"
                  value={scheduledTime}
                  onChange={(e) => setScheduledTime(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-300 mb-1.5">Timezone</label>
                <select
                  value={timezone}
                  onChange={(e) => setTimezone(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
                >
                  <option value="EST (UTC-4)">Eastern Time (EST)</option>
                  <option value="PST (UTC-7)">Pacific Time (PST)</option>
                  <option value="GMT (UTC+0)">London (GMT)</option>
                  <option value="CET (UTC+1)">Central European (CET)</option>
                </select>
              </div>
            </div>

            {/* Stream Settings if Stream */}
            {itemType === 'stream' && (
              <div className="p-4 rounded-xl bg-red-950/20 border border-red-500/20 space-y-3">
                <span className="text-xs font-bold text-red-300 uppercase tracking-wider block">
                  Live Multicast Reservation Settings
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-zinc-400 block mb-1">Target Ingest Resolution</label>
                    <select
                      value={streamResolution}
                      onChange={(e) => setStreamResolution(e.target.value)}
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-1.5 text-xs text-white"
                    >
                      <option value="1080p60">1080p60 (Recommended, 6000 kbps)</option>
                      <option value="1440p60">1440p60 (Quad HD, 9000 kbps)</option>
                      <option value="4k60">4K60 (Ultra HD, 18000 kbps)</option>
                    </select>
                  </div>
                  <div className="flex items-center gap-2 pt-5">
                    <input
                      type="checkbox"
                      id="notifySubscribers"
                      checked={notifyFollowers}
                      onChange={(e) => setNotifyFollowers(e.target.checked)}
                      className="rounded bg-zinc-900 border-zinc-700 text-purple-600 focus:ring-0"
                    />
                    <label htmlFor="notifySubscribers" className="text-xs text-zinc-300 cursor-pointer">
                      Trigger push notification & countdown card to all platform followers
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* Submission Actions */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-zinc-800">
              <button
                type="button"
                onClick={() => setActiveSubTab('queue')}
                className="px-4 py-2 text-xs font-semibold text-zinc-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold uppercase tracking-wider transition shadow-lg flex items-center gap-2"
              >
                <Calendar className="w-4 h-4" />
                <span>CTC Book & Schedule ({selectedPlatforms.length} Platforms)</span>
              </button>
            </div>
          </form>
        </div>
      ) : (
        /* Scheduled Queue View */
        <div className="space-y-4">
          {/* Filters Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#111622] p-3 rounded-xl border border-zinc-800">
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
              <button
                onClick={() => setFilterType('all')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                  filterType === 'all'
                    ? 'bg-zinc-800 text-white border border-zinc-700'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                All Scheduled ({scheduledItems.length})
              </button>
              <button
                onClick={() => setFilterType('post')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                  filterType === 'post'
                    ? 'bg-zinc-800 text-blue-400 border border-zinc-700'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                Posts & Drops
              </button>
              <button
                onClick={() => setFilterType('stream')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                  filterType === 'stream'
                    ? 'bg-zinc-800 text-red-400 border border-zinc-700'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                Live Multicasts
              </button>
              <button
                onClick={() => setFilterType('failed')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition flex items-center gap-1.5 ${
                  filterType === 'failed'
                    ? 'bg-rose-950/80 text-rose-300 border border-rose-800'
                    : 'text-zinc-400 hover:text-rose-400'
                }`}
              >
                <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
                <span>Failed Alerts ({failedItems.length})</span>
              </button>
            </div>

            <span className="text-xs text-zinc-500 font-mono">
              Auto-sync engine active (1-minute heartbeat)
            </span>
          </div>

          {/* List of Scheduled Items */}
          <div className="space-y-3">
            {filteredItems.map((item) => {
              const isFailed = item.overallStatus === 'has_failures';
              const dateObj = new Date(item.scheduledFor);
              const formattedDate = dateObj.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
              });
              const formattedTime = dateObj.toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit'
              });

              return (
                <div
                  key={item.id}
                  className={`p-5 rounded-2xl border transition-all ${
                    isFailed
                      ? 'bg-[#151119] border-rose-500/50 shadow-xl'
                      : 'bg-[#111622] border-zinc-800/90 hover:border-zinc-700'
                  }`}
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    {/* Item Info */}
                    <div className="flex items-start gap-4">
                      <div className="relative w-16 h-16 rounded-xl overflow-hidden shrink-0 border border-zinc-700 bg-zinc-800">
                        {item.mediaUrl ? (
                          <img
                            src={item.mediaUrl}
                            alt={item.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-zinc-900 text-zinc-500">
                            {item.type === 'stream' ? <Radio className="w-6 h-6" /> : <Video className="w-6 h-6" />}
                          </div>
                        )}
                        <span
                          className={`absolute bottom-1 right-1 p-1 rounded-md text-[10px] ${
                            item.type === 'stream'
                              ? 'bg-red-600 text-white'
                              : 'bg-blue-600 text-white'
                          }`}
                        >
                          {item.type === 'stream' ? <Radio className="w-3 h-3" /> : <Video className="w-3 h-3" />}
                        </span>
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span
                            className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full ${
                              item.type === 'stream'
                                ? 'bg-red-500/20 text-red-300 border border-red-500/30'
                                : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                            }`}
                          >
                            {item.type === 'stream' ? 'Live Multicast' : 'Cross-Post'}
                          </span>

                          <span className="text-xs text-zinc-400 flex items-center gap-1 font-mono">
                            <Clock className="w-3 h-3 text-purple-400" />
                            <span>
                              {formattedDate} at {formattedTime} {item.timezone}
                            </span>
                          </span>

                          {isFailed ? (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/40 flex items-center gap-1">
                              <AlertTriangle className="w-3 h-3" />
                              Delivery Issue Detected
                            </span>
                          ) : (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3" />
                              Scheduled & Primed
                            </span>
                          )}
                        </div>

                        <h3 className="text-sm font-bold text-white line-clamp-1">{item.title}</h3>
                        <p className="text-xs text-zinc-400 line-clamp-1">{item.description}</p>
                      </div>
                    </div>

                    {/* Quick Trigger / Delete Actions */}
                    <div className="flex items-center gap-2 self-end lg:self-center">
                      <button
                        onClick={() => onTriggerPublishNow(item.id)}
                        className="px-3 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-semibold transition flex items-center gap-1.5 border border-zinc-700"
                        title="Simulate immediate publication or live trigger"
                      >
                        <RefreshCw className="w-3 h-3 text-purple-400" />
                        <span>CTC Publish / Test Now</span>
                      </button>

                      <button
                        onClick={() => onDeleteItem(item.id)}
                        className="p-2 rounded-xl bg-zinc-900 hover:bg-rose-950 text-zinc-500 hover:text-rose-400 border border-zinc-800 transition"
                        title="Cancel Scheduled Item"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Platform Status Breakdown Grid */}
                  <div className="mt-4 pt-4 border-t border-zinc-800/80">
                    <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider block mb-2">
                      Platform Delivery Matrix
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                      {item.platforms.map((pid) => {
                        const statusObj = item.platformStatuses[pid] || {
                          platformId: pid,
                          status: 'pending'
                        };
                        const isPlatformFailed = statusObj.status === 'failed';
                        const isPlatformSuccess = statusObj.status === 'published';

                        return (
                          <div
                            key={pid}
                            className={`p-2.5 rounded-xl border flex flex-col justify-between ${
                              isPlatformFailed
                                ? 'bg-rose-950/40 border-rose-500/40'
                                : isPlatformSuccess
                                ? 'bg-emerald-950/20 border-emerald-500/30'
                                : 'bg-zinc-900/60 border-zinc-800'
                            }`}
                          >
                            <div className="flex items-center justify-between mb-1">
                              <PlatformBadge platformId={pid} size="sm" />
                              <span
                                className={`text-[10px] font-bold uppercase font-mono ${
                                  isPlatformFailed
                                    ? 'text-rose-400'
                                    : isPlatformSuccess
                                    ? 'text-emerald-400'
                                    : 'text-zinc-400'
                                }`}
                              >
                                {statusObj.status}
                              </span>
                            </div>

                            {/* Failure notification message with Retry Button */}
                            {isPlatformFailed && (
                              <div className="mt-1 pt-1 border-t border-rose-500/20">
                                <p className="text-[10px] text-rose-300 leading-tight">
                                  {statusObj.errorMessage || 'API delivery failed.'}
                                </p>
                                <button
                                  onClick={() => onRetryPlatform(item.id, pid)}
                                  className="mt-2 w-full py-1 rounded bg-rose-600 hover:bg-rose-500 text-white text-[11px] font-bold transition flex items-center justify-center gap-1 shadow-sm"
                                >
                                  <RefreshCw className="w-3 h-3" />
                                  <span>CTC Retry Delivery to {PLATFORM_CONFIGS[pid]?.name}</span>
                                </button>
                              </div>
                            )}

                            {isPlatformSuccess && statusObj.externalUrl && (
                              <a
                                href={statusObj.externalUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="mt-1 text-[10px] text-emerald-400 hover:underline flex items-center gap-1"
                              >
                                <span>Live on channel</span>
                                <ExternalLink className="w-2.5 h-2.5" />
                              </a>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
