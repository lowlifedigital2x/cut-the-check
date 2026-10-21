import React, { useState } from 'react';
import {
  Send,
  Upload,
  Sparkles,
  Video,
  Music,
  CheckCircle2,
  Calendar,
  AlertCircle,
  FileText,
  Clock,
  Eye,
  Hash,
  Share2,
  Mic,
  Disc3,
  Award,
  Layers,
  Radio,
  Check
} from 'lucide-react';
import { PlatformId, ContentItem } from '../../types';
import { PLATFORM_CONFIGS } from '../../data/mockData';
import { PlatformBadge } from '../common/PlatformBadge';
import { generateMultiPlatformCopies, OptimizedPlatformContent } from '../../services/geminiService';

interface MultiPostStudioProps {
  onPublishContent: (item: ContentItem) => void;
  onNavigateToSchedule: () => void;
}

const ALL_CHANNELS = Object.keys(PLATFORM_CONFIGS) as PlatformId[];
const MUSIC_PLATFORMS: PlatformId[] = ['spotify', 'applemusic', 'amazonmusic', 'soundcloud', 'youtube', 'tiktok'];
const LIVE_PLATFORMS: PlatformId[] = ['youtube', 'kick', 'tiktok', 'facebook', 'twitch', 'rumble', 'linkedin', 'custom_rtmp'];
const VIDEO_PLATFORMS: PlatformId[] = ['youtube', 'tiktok', 'instagram', 'facebook', 'twitter'];

export const MultiPostStudio: React.FC<MultiPostStudioProps> = ({
  onPublishContent,
  onNavigateToSchedule
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [mediaType, setMediaType] = useState<'video' | 'audio' | 'live' | 'podcast' | 'post'>('video');
  const [selectedPlatforms, setSelectedPlatforms] = useState<PlatformId[]>([
    'tiktok',
    'youtube',
    'kick',
    'spotify',
    'facebook'
  ]);
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);
  const [aiOptimizedVersions, setAiOptimizedVersions] = useState<OptimizedPlatformContent[] | null>(null);
  const [activePreviewPlatform, setActivePreviewPlatform] = useState<PlatformId>('tiktok');
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishProgress, setPublishProgress] = useState<Record<string, number>>({});
  const [publishSuccess, setPublishSuccess] = useState(false);
  const [actionNotice, setActionNotice] = useState<string | null>(null);

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
    setSelectedPlatforms(ALL_CHANNELS);
    setActionNotice('All 47 major streaming and broadcast channels selected!');
    setTimeout(() => setActionNotice(null), 3000);
  };

  const handleAddAllMusicPlatforms = () => {
    setSelectedPlatforms(MUSIC_PLATFORMS);
    setMediaType('audio');
    setActionNotice('Added all 6 Music & Audio streaming platforms (Spotify, Apple Music, Amazon Music, SoundCloud, YouTube Music, TikTok Sounds)!');
    setTimeout(() => setActionNotice(null), 4000);
  };

  const handleSelectAllLive = () => {
    setSelectedPlatforms(LIVE_PLATFORMS);
    setMediaType('live');
    setActionNotice('Selected all 8 Live Multicast broadcast channels!');
    setTimeout(() => setActionNotice(null), 3000);
  };

  const handleSelectAllVideo = () => {
    setSelectedPlatforms(VIDEO_PLATFORMS);
    setMediaType('video');
    setActionNotice('Selected all 5 Social Video & Reels channels!');
    setTimeout(() => setActionNotice(null), 3000);
  };

  const handleAiOptimize = async () => {
    if (!title.trim()) {
      setActionNotice('Please enter a title or idea first so AI can generate tailored copies.');
      setTimeout(() => setActionNotice(null), 3500);
      return;
    }
    setIsGeneratingAi(true);
    try {
      const results = await generateMultiPlatformCopies(title, selectedPlatforms);
      setAiOptimizedVersions(results);
    } catch (err) {
      console.warn('AI optimization error:', err);
    } finally {
      setIsGeneratingAi(false);
    }
  };

  const executePublishWithPlatforms = (platformsToPublish: PlatformId[]) => {
    const finalTitle = title.trim() || 'Master Release • Multi-Channel Broadcast';
    setIsPublishing(true);
    const progressMap: Record<string, number> = {};
    platformsToPublish.forEach((p) => {
      progressMap[p] = 10;
    });
    setPublishProgress(progressMap);

    const interval = setInterval(() => {
      setPublishProgress((prev) => {
        const next = { ...prev };
        let allDone = true;
        platformsToPublish.forEach((p) => {
          if ((next[p] || 0) < 100) {
            next[p] = Math.min((next[p] || 0) + Math.floor(Math.random() * 30) + 15, 100);
            if (next[p] < 100) allDone = false;
          }
        });
        if (allDone) {
          clearInterval(interval);
          setTimeout(() => {
            setIsPublishing(false);
            setPublishSuccess(true);

            // Create new published content item
            const newItem: ContentItem = {
              id: `cnt-${Date.now()}`,
              title: finalTitle,
              description: description.trim() || 'Synchronized cross-platform release.',
              contentType: mediaType === 'video' ? 'video' : 'audio',
              thumbnailUrl:
                mediaType === 'audio'
                  ? 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=600&auto=format&fit=crop&q=80'
                  : 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=600&auto=format&fit=crop&q=80',
              publishedAt: 'Just now',
              platforms: platformsToPublish,
              totalViews: 1250,
              totalEarnings: 28.4,
              rpm: 5.8,
              breakdown: {}
            };
            onPublishContent(newItem);

            setTimeout(() => {
              setPublishSuccess(false);
              setTitle('');
              setDescription('');
              setAiOptimizedVersions(null);
            }, 3500);
          }, 600);
        }
        return next;
      });
    }, 250);
  };

  const handlePublishNow = () => {
    if (!title.trim()) {
      setActionNotice('Please enter a release title before publishing.');
      setTimeout(() => setActionNotice(null), 3000);
      return;
    }
    executePublishWithPlatforms(selectedPlatforms);
  };

  const handlePublishToAllChannelsOneClick = () => {
    setSelectedPlatforms(ALL_CHANNELS);
    executePublishWithPlatforms(ALL_CHANNELS);
  };

  const activeAiCopy = aiOptimizedVersions?.find((v) => v.platformId === activePreviewPlatform);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-extrabold text-white flex items-center gap-2.5">
              <Share2 className="w-6 h-6 text-amber-400" />
              <span>Universal 1-Click Multi-Post & Distribution Engine</span>
            </h2>
            <span className="engraved-plate-gold text-[9px] font-black uppercase px-2 py-0.5 rounded shadow-sm">
              GLOBAL DEAL DISPATCH
            </span>
          </div>
          <p className="text-xs text-zinc-400 mt-1">
            Simultaneously publish masters, videos, podcasts, and community posts across all 47 connected channels with one single command.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Master 1-Click Publish to All Channels Button */}
          <button
            type="button"
            onClick={handlePublishToAllChannelsOneClick}
            disabled={isPublishing}
            className="deal-btn-gold px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-1.5 shadow-xl transition"
            title="1-Click immediate dispatch to all 47 platforms"
          >
            <Send className="w-3.5 h-3.5 text-amber-950" />
            <span>Publish to All Channels (1-Click)</span>
          </button>

          <button
            onClick={onNavigateToSchedule}
            className="deal-btn-platinum flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition"
          >
            <Calendar className="w-4 h-4 text-slate-800" />
            <span>Switch to Scheduler</span>
          </button>
        </div>
      </div>

      {/* Action Notice Banner */}
      {actionNotice && (
        <div className="p-3.5 rounded-xl engraved-plate-gold text-amber-950 text-xs font-black text-center shadow-lg animate-in fade-in flex items-center justify-center gap-2">
          <Award className="w-4 h-4 text-amber-950" />
          <span>{actionNotice}</span>
        </div>
      )}

      {/* Main Publishing Plaque Canvas */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form & Media Upload Plaque */}
        <div className="lg:col-span-2 space-y-5">
          <div className="plaque-gold p-6 lg:p-7 relative overflow-hidden space-y-5">
            {/* Grooved Disc Watermark */}
            <div className="absolute -right-16 -top-16 w-48 h-48 rounded-full grooved-record-disc opacity-15 pointer-events-none" />

            {/* 1-Click Quick Preset Selector Strip */}
            <div className="relative z-10 pb-4 border-b border-amber-500/25">
              <span className="text-[10px] font-black uppercase tracking-widest text-amber-200/80 block mb-2">
                ⚡ 1-Click Destination Presets (Instant Channel Bundles):
              </span>
              <div className="flex flex-wrap gap-2">
                {/* 1-Click Add All Music Streaming Platforms Button */}
                <button
                  type="button"
                  onClick={handleAddAllMusicPlatforms}
                  className="deal-btn-gold px-3.5 py-1.5 rounded-lg text-xs font-black flex items-center gap-1.5 shadow-md hover:scale-[1.02] transition"
                  title="1-Click: Select Spotify, Apple Music, Amazon Music, SoundCloud, YouTube Music, TikTok"
                >
                  <Music className="w-3.5 h-3.5 text-amber-950" />
                  <span>🎵 Add All Music Streaming Platforms</span>
                </button>

                {/* Select All 47 Channels */}
                <button
                  type="button"
                  onClick={handleSelectAllChannels}
                  className="deal-btn-platinum px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-sm hover:scale-[1.02] transition"
                  title="Select all 47 connected channels"
                >
                  <Layers className="w-3.5 h-3.5 text-slate-800" />
                  <span>All 47 Channels</span>
                </button>

                {/* All Live Channels */}
                <button
                  type="button"
                  onClick={handleSelectAllLive}
                  className="px-3 py-1.5 rounded-lg text-xs font-bold bg-zinc-900 border border-red-500/40 text-red-300 hover:bg-zinc-800 flex items-center gap-1.5 transition"
                >
                  <Radio className="w-3.5 h-3.5 text-red-400" />
                  <span>All Live Channels</span>
                </button>

                {/* All Video Channels */}
                <button
                  type="button"
                  onClick={handleSelectAllVideo}
                  className="px-3 py-1.5 rounded-lg text-xs font-bold bg-zinc-900 border border-sky-500/40 text-sky-300 hover:bg-zinc-800 flex items-center gap-1.5 transition"
                >
                  <Video className="w-3.5 h-3.5 text-sky-400" />
                  <span>All Video Channels</span>
                </button>
              </div>
            </div>

            {/* 5 Modalities Selector: Audio, Video, Live, Podcast, Post */}
            <div className="relative z-10">
              <label className="block text-xs font-bold text-amber-200 uppercase tracking-wider mb-2">
                1. Select Content Modality (5 Formats Supported)
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 mb-4">
                {[
                  { id: 'video', label: '📹 Video', desc: 'Shorts & Longform' },
                  { id: 'audio', label: '🎵 Audio', desc: 'Lossless Stems & Music' },
                  { id: 'live', label: '🔴 Live', desc: 'Simulcast Relay' },
                  { id: 'podcast', label: '🎙️ Podcast', desc: 'Episodes & Notes' },
                  { id: 'post', label: '📝 Post', desc: 'Community & Carousel' }
                ].map((mod) => (
                  <button
                    type="button"
                    key={mod.id}
                    onClick={() => {
                      setMediaType(mod.id as any);
                      if (mod.id === 'audio') {
                        setSelectedPlatforms(MUSIC_PLATFORMS);
                      } else if (mod.id === 'live') {
                        setSelectedPlatforms(LIVE_PLATFORMS);
                      } else if (mod.id === 'podcast') {
                        setSelectedPlatforms(['spotify', 'youtube', 'applemusic', 'amazonmusic']);
                      } else if (mod.id === 'post') {
                        setSelectedPlatforms(['facebook', 'youtube', 'tiktok', 'twitter']);
                      } else {
                        setSelectedPlatforms(VIDEO_PLATFORMS);
                      }
                    }}
                    className={`p-3 rounded-xl border text-left transition flex flex-col justify-between ${
                      mediaType === mod.id
                        ? 'engraved-plate-gold text-amber-950 font-black shadow-lg ring-1 ring-amber-300'
                        : 'bg-zinc-950/70 border-zinc-800 text-zinc-400 hover:text-white hover:border-amber-500/30'
                    }`}
                  >
                    <span className="text-xs font-bold block">{mod.label}</span>
                    <span className="text-[10px] opacity-75 mt-1">{mod.desc}</span>
                  </button>
                ))}
              </div>

              {/* Media Asset Dropzone */}
              {mediaType !== 'post' && mediaType !== 'live' && (
                <div className="p-6 rounded-2xl border-2 border-dashed border-amber-500/30 hover:border-amber-400/80 bg-black/40 text-center transition cursor-pointer group flex flex-col items-center justify-center space-y-2">
                  <div className="p-3 rounded-2xl bg-zinc-900 border border-amber-500/40 text-amber-400 group-hover:scale-110 transition shadow-md">
                    {mediaType === 'video' ? (
                      <Video className="w-6 h-6" />
                    ) : mediaType === 'podcast' ? (
                      <Mic className="w-6 h-6" />
                    ) : (
                      <Music className="w-6 h-6" />
                    )}
                  </div>
                  <div>
                    <span className="text-xs font-bold text-white block">
                      Drag & Drop your Master {mediaType.toUpperCase()} File
                    </span>
                    <span className="text-[11px] text-zinc-400">
                      {mediaType === 'video'
                        ? 'MP4, MOV 4K HDR • Auto-converts to 9:16 Shorts & 16:9 Longform'
                        : mediaType === 'podcast'
                        ? 'Video Podcast MP4 or 320kbps MP3 with RSS Chapters'
                        : 'WAV, FLAC, AIFF 24-bit 48kHz Master Stems • Spotify/Apple Music Certified'}
                    </span>
                  </div>
                </div>
              )}

              {mediaType === 'live' && (
                <div className="p-4 rounded-xl bg-red-950/30 border border-red-500/40 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-red-300 block">
                      Live Multicast Mode Selected
                    </span>
                    <span className="text-[11px] text-zinc-400">
                      Synchronizes RTMP ingest across all selected channels simultaneously with low latency.
                    </span>
                  </div>
                  <span className="text-xs font-bold px-3 py-1 rounded bg-red-600 text-white font-mono">
                    1080p60 RTMP Synced
                  </span>
                </div>
              )}

              {mediaType === 'post' && (
                <div className="p-4 rounded-xl bg-blue-950/30 border border-blue-500/40 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-blue-300 block">
                      Community Update & Photo Carousel Mode
                    </span>
                    <span className="text-[11px] text-zinc-400">
                      Formats announcements and carousels for YouTube Community, Facebook Pages, X, and TikTok.
                    </span>
                  </div>
                  <span className="text-xs font-bold px-3 py-1 rounded bg-blue-600 text-white font-mono">
                    Carousel Ready
                  </span>
                </div>
              )}
            </div>

            {/* Master Title & AI Optimize Trigger */}
            <div className="space-y-4 relative z-10">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-amber-200 uppercase tracking-wider">
                    2. Master Title / Release Name *
                  </label>
                  <button
                    type="button"
                    onClick={handleAiOptimize}
                    disabled={isGeneratingAi}
                    className="flex items-center gap-1.5 text-xs font-bold text-amber-400 hover:text-amber-300 transition"
                  >
                    <Sparkles className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: isGeneratingAi ? '1s' : '0s' }} />
                    <span>{isGeneratingAi ? 'Optimizing Copies...' : 'AI Optimize for All Channels'}</span>
                  </button>
                </div>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Master Release • Platinum Certified Studio Edition"
                  className="w-full bg-zinc-950 border border-zinc-800 focus:border-amber-400 rounded-xl px-4 py-2.5 text-sm text-white placeholder-zinc-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-amber-200 uppercase tracking-wider mb-1.5">
                  Universal Description & Metadata Links
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Universal description, ISRC tags, Spotify Pre-Save links, credits, and social tags..."
                  className="w-full bg-zinc-950 border border-zinc-800 focus:border-amber-400 rounded-xl px-4 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Target Destinations Checkboxes */}
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold text-amber-200 uppercase tracking-wider">
                  3. Connected Channels to Publish Simultaneously ({selectedPlatforms.length} Selected)
                </label>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleAddAllMusicPlatforms}
                    className="text-[11px] font-black text-amber-400 hover:text-amber-300 underline"
                  >
                    + Add All Music Platforms
                  </button>
                  <span className="text-zinc-600">•</span>
                  <button
                    type="button"
                    onClick={handleSelectAllChannels}
                    className="text-[11px] font-black text-sky-400 hover:text-sky-300 underline"
                  >
                    Select All 47
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2">
                {(Object.keys(PLATFORM_CONFIGS) as PlatformId[]).map(
                  (pid) => {
                    const cfg = PLATFORM_CONFIGS[pid];
                    const isSelected = selectedPlatforms.includes(pid);
                    const isMusicChannel = MUSIC_PLATFORMS.includes(pid);
                    return (
                      <button
                        type="button"
                        key={pid}
                        onClick={() => togglePlatform(pid)}
                        className={`p-2.5 rounded-xl border text-left transition flex flex-col justify-between h-16 ${
                          isSelected
                            ? isMusicChannel
                              ? 'bg-zinc-900 border-amber-400/80 shadow-[0_0_10px_rgba(245,158,11,0.25)] ring-1 ring-amber-400/50'
                              : 'bg-zinc-800/90 border-sky-400/80 shadow-md ring-1 ring-sky-400/40'
                            : 'bg-zinc-950/60 border-zinc-800 opacity-60 hover:opacity-100'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <PlatformBadge platformId={pid} size="sm" showLabel={false} />
                          {isMusicChannel && (
                            <span className="text-[8px] font-black px-1 rounded bg-amber-400/20 text-amber-300">
                              MUSIC
                            </span>
                          )}
                        </div>
                        <span className="text-xs font-bold text-white truncate">{cfg.name}</span>
                      </button>
                    );
                  }
                )}
              </div>
            </div>

            {/* Dispatch Bar */}
            <div className="pt-4 border-t border-amber-500/25 flex flex-col sm:flex-row sm:items-center justify-between gap-3 relative z-10">
              <span className="text-xs text-amber-200/70 font-mono">
                Transcoding profile: Master 24-Bit / 4K60 HDR Multi-Codec
              </span>

              <button
                type="button"
                onClick={handlePublishNow}
                disabled={isPublishing || !title.trim()}
                className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition shadow-xl flex items-center justify-center gap-2 ${
                  isPublishing
                    ? 'bg-amber-900 text-amber-200 cursor-wait'
                    : 'deal-btn-gold'
                }`}
              >
                <Send className="w-4 h-4 text-amber-950" />
                <span>
                  {isPublishing
                    ? `Broadcasting to ${selectedPlatforms.length} Channels...`
                    : `Publish to ${selectedPlatforms.length} Channels with 1 Click`}
                </span>
              </button>
            </div>

            {/* Publishing Progress Breakdown */}
            {isPublishing && (
              <div className="p-4 rounded-xl bg-black/80 border border-amber-500/40 space-y-3 relative z-10">
                <span className="text-xs font-bold text-amber-300 block flex items-center gap-2">
                  <Disc3 className="w-4 h-4 animate-spin text-amber-400" />
                  <span>Simultaneous Multi-Platform Ingest & Distribution in Progress...</span>
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {selectedPlatforms.map((pid) => (
                    <div key={pid} className="space-y-1">
                      <div className="flex items-center justify-between text-[11px] font-mono">
                        <PlatformBadge platformId={pid} size="sm" />
                        <span className="text-amber-200 font-bold">{publishProgress[pid] || 0}%</span>
                      </div>
                      <div className="w-full h-1.5 rounded-full bg-zinc-900 overflow-hidden border border-zinc-800">
                        <div
                          className="h-full bg-gradient-to-r from-amber-400 to-yellow-200 transition-all duration-200"
                          style={{ width: `${publishProgress[pid] || 0}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {publishSuccess && (
              <div className="p-4 rounded-xl engraved-plate-gold text-amber-950 text-xs font-black flex items-center gap-2 relative z-10 shadow-xl">
                <CheckCircle2 className="w-5 h-5 text-amber-950 shrink-0" />
                <span>
                  CERTIFIED RELEASE COMPLETE: Successfully published across all selected channels! Discoverability & streaming royalties are now active.
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Right: Platform-Specific Preview & AI Adaptations */}
        <div className="lg:col-span-1 space-y-4">
          <div className="plaque-platinum p-5 shadow-xl flex flex-col h-full relative overflow-hidden">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-200">
                Live Channel Preview
              </span>
              <select
                value={activePreviewPlatform}
                onChange={(e) => setActivePreviewPlatform(e.target.value as any)}
                className="bg-zinc-900 border border-zinc-800 text-[11px] font-bold text-amber-300 rounded-lg px-2 py-1 focus:outline-none"
              >
                {selectedPlatforms.map((p) => (
                  <option key={p} value={p}>
                    {PLATFORM_CONFIGS[p]?.name} Preview
                  </option>
                ))}
              </select>
            </div>

            {/* Mobile / Channel Card Preview Frame */}
            <div className="my-4 p-4 rounded-xl bg-black border border-zinc-800 space-y-3">
              <div className="flex items-center justify-between">
                <PlatformBadge platformId={activePreviewPlatform} size="sm" />
                <span className="text-[10px] text-zinc-500 font-mono">Live Rendering</span>
              </div>

              {/* Title representation */}
              <div>
                <span className="text-[10px] text-zinc-500 uppercase font-mono block">Title</span>
                <p className="text-xs font-bold text-white leading-tight">
                  {activeAiCopy?.title || title || 'Your Title Here'}
                </p>
              </div>

              {/* Caption & Hashtags representation */}
              <div>
                <span className="text-[10px] text-zinc-500 uppercase font-mono block">
                  Tailored Caption
                </span>
                <p className="text-xs text-zinc-300 whitespace-pre-line leading-relaxed">
                  {activeAiCopy?.caption || description || 'Caption preview will render here.'}
                </p>
              </div>

              {activeAiCopy?.hashtags && (
                <div className="flex flex-wrap gap-1 pt-1">
                  {activeAiCopy.hashtags.map((h, i) => (
                    <span
                      key={i}
                      className="text-[10px] font-semibold text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded"
                    >
                      {h}
                    </span>
                  ))}
                </div>
              )}

              {activeAiCopy?.tips && (
                <div className="p-2.5 rounded-lg bg-zinc-900 border border-zinc-800 text-[10px] text-zinc-400">
                  <span className="text-amber-300 font-bold block mb-0.5">Platform Strategy Tip:</span>
                  {activeAiCopy.tips}
                </div>
              )}
            </div>

            <p className="text-[11px] text-zinc-500 mt-auto text-center">
              Each channel receives automated format tweaks (e.g. hashtags for TikTok, lossless tags for Spotify, SEO chapters for YouTube).
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
