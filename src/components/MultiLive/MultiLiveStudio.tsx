import React, { useState, useEffect, useRef } from 'react';
import {
  Radio,
  Video,
  Mic,
  MicOff,
  VideoOff,
  Monitor,
  Settings,
  Sparkles,
  Wifi,
  Copy,
  Check,
  Shield,
  Layers,
  Volume2,
  AlertCircle,
  ExternalLink,
  Eye,
  EyeOff,
  RefreshCw,
  Edit2,
  Save
} from 'lucide-react';
import { MultiStreamState, PlatformId, LiveChatEvent } from '../../types';
import { PLATFORM_CONFIGS } from '../../data/mockData';
import { PlatformBadge } from '../common/PlatformBadge';
import { UnifiedLiveChat } from './UnifiedLiveChat';
import ctcEagleDiamondImg from '../../assets/images/ctc_eagle_diamond.jpg';

interface MultiLiveStudioProps {
  streamState: MultiStreamState;
  onToggleStream: () => void;
  onTogglePlatformStream: (p: PlatformId) => void;
  chatEvents: LiveChatEvent[];
  onSendMessage: (msg: string, target: PlatformId | 'all') => void;
  onAddSimulatedChat: (chat: LiveChatEvent) => void;
}

export const MultiLiveStudio: React.FC<MultiLiveStudioProps> = ({
  streamState,
  onToggleStream,
  onTogglePlatformStream,
  chatEvents,
  onSendMessage,
  onAddSimulatedChat
}) => {
  const [cameraActive, setCameraActive] = useState(false);
  const [micActive, setMicActive] = useState(true);
  const [screenSharing, setScreenSharing] = useState(false);
  const [showRtmpModal, setShowRtmpModal] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // RTMP Relay Server & Stream Key configuration
  const [relayServerUrl, setRelayServerUrl] = useState(() => {
    return localStorage.getItem('ctc_rtmp_relay_url') || 'rtmp://live.omnicast.io/relay/app';
  });
  const [streamKey, setStreamKey] = useState(() => {
    return localStorage.getItem('ctc_rtmp_stream_key') || 'live_omni_88192039_x99_sec';
  });
  const [showStreamKey, setShowStreamKey] = useState(false);
  const [isEditingRtmp, setIsEditingRtmp] = useState(false);
  const [tempRtmpUrl, setTempRtmpUrl] = useState(relayServerUrl);

  const handleSaveRtmpUrl = () => {
    const trimmed = tempRtmpUrl.trim();
    if (trimmed) {
      setRelayServerUrl(trimmed);
      localStorage.setItem('ctc_rtmp_relay_url', trimmed);
    }
    setIsEditingRtmp(false);
  };

  const handleResetRtmpUrl = () => {
    const defaultUrl = 'rtmp://live.omnicast.io/relay/app';
    setTempRtmpUrl(defaultUrl);
    setRelayServerUrl(defaultUrl);
    localStorage.setItem('ctc_rtmp_relay_url', defaultUrl);
    setIsEditingRtmp(false);
  };

  const handleRegenerateKey = () => {
    const randomHex = Array.from({ length: 8 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
    const newKey = `live_omni_${Date.now().toString().slice(-6)}_${randomHex}_sec`;
    setStreamKey(newKey);
    localStorage.setItem('ctc_rtmp_stream_key', newKey);
  };

  // Audio VU meter simulation
  const [vuLevels, setVuLevels] = useState<number[]>([40, 55, 70, 85, 60, 45, 90, 75]);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    let animInterval: any;
    if (micActive) {
      animInterval = setInterval(() => {
        setVuLevels((prev) =>
          prev.map(() => Math.floor(Math.random() * 65) + (streamState.isBroadcasting ? 30 : 15))
        );
      }, 150);
    }
    return () => clearInterval(animInterval);
  }, [micActive, streamState.isBroadcasting]);

  // Request actual camera if user activates it
  const handleToggleCamera = async () => {
    if (!cameraActive) {
      try {
        if (navigator?.mediaDevices?.getUserMedia) {
          const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
            videoRef.current.play();
          }
          setCameraActive(true);
        } else {
          setCameraActive(true);
        }
      } catch (err) {
        console.warn('Camera permission not available or denied, using simulated studio view:', err);
        setCameraActive(true);
      }
    } else {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach((track) => track.stop());
        videoRef.current.srcObject = null;
      }
      setCameraActive(false);
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard?.writeText(text);
    setCopiedKey(id);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const selectedCount = Object.values(streamState.selectedPlatforms).filter(Boolean).length;

  return (
    <div className="space-y-6">
      {/* Studio Header & Broadcast Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
              <Radio className="w-6 h-6 text-red-500" />
              <span>Multi-Live Broadcast Control Room</span>
            </h2>
            <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                streamState.isBroadcasting
                  ? 'bg-red-500 text-white animate-pulse'
                  : 'bg-zinc-800 text-zinc-400'
              }`}
            >
              {streamState.isBroadcasting ? 'Live Multicasting' : 'Offline'}
            </span>
          </div>
          <p className="text-xs text-zinc-400 mt-1">
            Encode and distribute your live stream to TikTok, YouTube, Kick, and Facebook in synchronized 1080p60.
          </p>
        </div>

        {/* Master One-Click Go Live Button */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowRtmpModal(true)}
            className="px-3.5 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs font-semibold text-zinc-300 border border-zinc-700 transition flex items-center gap-1.5"
          >
            <Settings className="w-3.5 h-3.5" />
            <span>RTMP Relay Keys</span>
          </button>

          <button
            onClick={onToggleStream}
            className={`px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition shadow-xl flex items-center gap-2 ${
              streamState.isBroadcasting
                ? 'bg-red-600 hover:bg-red-700 text-white shadow-red-900/50 animate-pulse'
                : 'bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white shadow-rose-900/40'
            }`}
          >
            <span
              className={`w-2.5 h-2.5 rounded-full ${
                streamState.isBroadcasting ? 'bg-white' : 'bg-red-200'
              }`}
            />
            <span>
              {streamState.isBroadcasting
                ? 'CTC End Multistream Broadcast'
                : `CTC Go Live Everywhere (${selectedCount} Channels)`}
            </span>
          </button>
        </div>
      </div>

      {/* Main Studio Viewport & Chat Split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Video Viewport & Hardware Controls */}
        <div className="lg:col-span-2 space-y-4">
          {/* Virtual Studio Canvas Card */}
          <div className="relative aspect-video w-full rounded-2xl overflow-hidden border border-zinc-800 bg-[#090C12] shadow-2xl flex items-center justify-center group">
            {/* Live Camera Feed if enabled */}
            <video
              ref={videoRef}
              playsInline
              muted
              className={`absolute inset-0 w-full h-full object-cover transition-opacity ${
                cameraActive ? 'opacity-100 z-10' : 'opacity-0 pointer-events-none'
              }`}
            />

            {/* Test Pattern / Virtual Studio Card when camera is off */}
            {!cameraActive && (
              <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center space-y-4 bg-gradient-to-br from-[#0D111A] via-[#101420] to-[#0A0D15]">
                <div className="relative">
                  <div className="w-20 h-20 rounded-2xl bg-zinc-900 border border-zinc-700 flex items-center justify-center text-purple-400 shadow-2xl">
                    <Radio className="w-10 h-10" />
                  </div>
                  {streamState.isBroadcasting && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-black animate-ping" />
                  )}
                </div>

                <div>
                  <h3 className="text-base font-bold text-white">
                    {streamState.isBroadcasting
                      ? 'Live Multicast Stream Relaying Active'
                      : 'OmniCast Virtual Studio Preview'}
                  </h3>
                  <p className="text-xs text-zinc-400 mt-1 max-w-md">
                    Connect your webcam, screen share, or feed directly from OBS / vMix using the unified RTMP ingest endpoint below.
                  </p>
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <button
                    onClick={handleToggleCamera}
                    className="px-3.5 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-semibold flex items-center gap-1.5 border border-zinc-700"
                  >
                    <Video className="w-3.5 h-3.5 text-blue-400" />
                    <span>CTC Enable Studio Webcam</span>
                  </button>
                </div>
              </div>
            )}

            {/* Top Overlay HUD Bar */}
            <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-20 pointer-events-none">
              <div className="flex items-center gap-2 pointer-events-auto">
                <span
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 backdrop-blur-md ${
                    streamState.isBroadcasting
                      ? 'bg-red-600/90 text-white shadow-lg shadow-red-900/50'
                      : 'bg-zinc-900/80 text-zinc-400 border border-zinc-700/60'
                  }`}
                >
                  <span
                    className={`w-2 h-2 rounded-full ${
                      streamState.isBroadcasting ? 'bg-white animate-pulse' : 'bg-zinc-500'
                    }`}
                  />
                  <span>{streamState.isBroadcasting ? 'ON AIR' : 'PREVIEW'}</span>
                </span>

                {streamState.isBroadcasting && (
                  <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-black/70 text-white border border-zinc-700 backdrop-blur-md font-mono">
                    👥 {streamState.totalLiveViewers.toLocaleString()} CCV
                  </span>
                )}
              </div>

              {/* Official CTC Eagle Medallion Watermark & Streaming Destinations */}
              <div className="flex items-center gap-2 pointer-events-auto">
                {/* Official Broadcast Watermark */}
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/85 border border-amber-500/50 backdrop-blur-md shadow-[0_0_15px_rgba(245,158,11,0.3)]">
                  <div className="w-5 h-5 rounded-full overflow-hidden border border-amber-400">
                    <img src={ctcEagleDiamondImg} alt="CTC Eagle Medallion Watermark" className="w-full h-full object-cover scale-105" />
                  </div>
                  <span className="text-[10px] font-black tracking-widest text-gold-gradient uppercase">
                    CTC WATERMARK
                  </span>
                </div>

                <div className="hidden sm:flex items-center gap-1">
                  {(['youtube', 'kick', 'tiktok', 'facebook'] as PlatformId[]).map((pid) => {
                    const isBroadcastingHere =
                      streamState.isBroadcasting && streamState.selectedPlatforms[pid];
                    const cfg = PLATFORM_CONFIGS[pid];
                    return (
                      <span
                        key={pid}
                        className={`px-2 py-0.5 rounded text-[10px] font-bold border backdrop-blur-md flex items-center gap-1 transition ${
                          isBroadcastingHere
                            ? 'bg-black/80 text-white border-emerald-500/80 shadow-sm'
                            : 'bg-black/50 text-zinc-500 border-zinc-800'
                        }`}
                      >
                        <span
                          className="w-1.5 h-1.5 rounded-full"
                          style={{ backgroundColor: isBroadcastingHere ? cfg?.color : '#4B5563' }}
                        />
                        <span>{cfg?.name}</span>
                      </span>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Bottom Stream Telemetry Bar */}
            <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between z-20 pointer-events-none">
              <div className="flex items-center gap-3 bg-black/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-zinc-800 text-[11px] font-mono text-zinc-300 pointer-events-auto">
                <div className="flex items-center gap-1">
                  <Wifi className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{streamState.bitrateKbps} kbps</span>
                </div>
                <div className="text-zinc-600">|</div>
                <div>{streamState.fps.toFixed(1)} FPS</div>
                <div className="text-zinc-600">|</div>
                <div>{streamState.quality}</div>
                <div className="text-zinc-600">|</div>
                <div className="text-emerald-400 font-semibold">Drop: 0.0%</div>
              </div>

              {/* Mic VU Meter Bar */}
              <div className="flex items-end gap-0.5 bg-black/80 backdrop-blur-md px-2.5 py-1.5 rounded-xl border border-zinc-800 h-8 pointer-events-auto">
                <Volume2 className="w-3.5 h-3.5 text-zinc-400 self-center mr-1" />
                {vuLevels.map((lvl, idx) => (
                  <div
                    key={idx}
                    className="w-1 rounded-sm transition-all duration-100"
                    style={{
                      height: `${lvl}%`,
                      backgroundColor: lvl > 80 ? '#EF4444' : lvl > 60 ? '#F59E0B' : '#10B981'
                    }}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Quick Hardware & Device Controls */}
          <div className="p-4 rounded-2xl bg-[#111622] border border-zinc-800 flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-2">
              <button
                onClick={handleToggleCamera}
                className={`p-2.5 rounded-xl border transition ${
                  cameraActive
                    ? 'bg-blue-600/20 text-blue-300 border-blue-500/40 shadow-sm'
                    : 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:text-white'
                }`}
                title="Toggle Studio Camera"
              >
                {cameraActive ? <Video className="w-4 h-4" /> : <VideoOff className="w-4 h-4" />}
              </button>

              <button
                onClick={() => setMicActive(!micActive)}
                className={`p-2.5 rounded-xl border transition ${
                  micActive
                    ? 'bg-emerald-600/20 text-emerald-300 border-emerald-500/40 shadow-sm'
                    : 'bg-rose-950/40 text-rose-400 border-rose-800'
                }`}
                title="Toggle Microphone"
              >
                {micActive ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
              </button>

              <button
                onClick={() => setScreenSharing(!screenSharing)}
                className={`p-2.5 rounded-xl border transition ${
                  screenSharing
                    ? 'bg-purple-600/20 text-purple-300 border-purple-500/40 shadow-sm'
                    : 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:text-white'
                }`}
                title="Share Screen"
              >
                <Monitor className="w-4 h-4" />
              </button>
            </div>

            {/* Test Trigger: Send sample TikTok Rose or Kick Sub */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  onAddSimulatedChat({
                    id: `chat-${Date.now()}`,
                    platformId: 'tiktok',
                    user: 'neon_rider',
                    avatar: 'https://i.pravatar.cc/100?img=53',
                    message: 'Sent 10x Roses to the stream! 🌹🌹🌹🌹🌹🌹🌹🌹🌹🌹',
                    timestamp: 'Just now',
                    isGift: true,
                    giftType: 'Roses x10',
                    giftValue: 10
                  });
                }}
                className="px-2.5 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-300 text-xs font-semibold border border-zinc-800 transition"
              >
                🌹 Test TikTok Gift
              </button>

              <button
                onClick={() => {
                  onAddSimulatedChat({
                    id: `chat-${Date.now()}`,
                    platformId: 'kick',
                    user: 'SubSniper99',
                    avatar: 'https://i.pravatar.cc/100?img=17',
                    message: 'Subscribed for 3 Months! (95/5 Creator Split) 🟢',
                    timestamp: 'Just now',
                    badge: 'Tier 1 Sub'
                  });
                }}
                className="px-2.5 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-300 text-xs font-semibold border border-zinc-800 transition"
              >
                🟢 Test Kick Sub
              </button>
            </div>
          </div>

          {/* Multistream Channels Ingest Grid */}
          <div className="p-5 rounded-2xl bg-[#111622] border border-zinc-800 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-white">
                Simultaneous Ingest Destinations
              </h3>
              <span className="text-[11px] text-zinc-400 font-mono">
                Active Relay: US-East Relay Server (12ms ping)
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {(['youtube', 'kick', 'tiktok', 'facebook'] as PlatformId[]).map((pid) => {
                const isSelected = !!streamState.selectedPlatforms[pid];
                const cfg = PLATFORM_CONFIGS[pid];
                const viewers = streamState.platformViewers[pid] || 0;

                return (
                  <div
                    key={pid}
                    className={`p-3.5 rounded-xl border transition flex items-center justify-between ${
                      isSelected
                        ? 'bg-zinc-900/90 border-zinc-700 shadow-md'
                        : 'bg-zinc-950/40 border-zinc-800/80 opacity-60'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <PlatformBadge platformId={pid} size="md" />
                      <div>
                        <span className="text-xs font-bold text-white block">{cfg.name}</span>
                        <span className="text-[10px] text-zinc-400 font-mono">
                          {streamState.isBroadcasting && isSelected
                            ? `Streaming • ${viewers.toLocaleString()} Viewers`
                            : isSelected
                            ? 'Armed & Ready'
                            : 'Disabled'}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => onTogglePlatformStream(pid)}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
                        isSelected
                          ? 'bg-purple-600/20 text-purple-300 border border-purple-500/40'
                          : 'bg-zinc-800 text-zinc-500'
                      }`}
                    >
                      {isSelected ? 'Enabled' : 'Bypass'}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right: Unified Live Chat & Alert Box */}
        <div className="lg:col-span-1">
          <UnifiedLiveChat
            chatEvents={chatEvents}
            onSendMessage={onSendMessage}
            isBroadcasting={streamState.isBroadcasting}
          />
        </div>
      </div>

      {/* RTMP Ingest Keys Modal */}
      {showRtmpModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#111622] rounded-2xl border border-zinc-800 w-full max-w-xl p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-base text-white flex items-center gap-2">
                <Shield className="w-5 h-5 text-purple-400" />
                <span>Multistream RTMP & Ingest Credentials</span>
              </h3>
              <button
                onClick={() => setShowRtmpModal(false)}
                className="text-zinc-500 hover:text-white text-sm"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-zinc-400">
              Broadcast your high-definition stream to this universal ingest endpoint in OBS Studio, Streamlabs, Prism Live, or vMix to automatically relay in real-time to all your connected channels.
            </p>

            <div className="space-y-4 pt-1">
              {/* Universal Relay Server */}
              <div className="p-3.5 rounded-xl bg-zinc-900 border border-zinc-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-purple-400 flex items-center gap-1.5">
                    <Radio className="w-3 h-3 text-purple-400 animate-pulse" />
                    Universal Relay Server (RTMP)
                  </span>
                  <div className="flex items-center gap-1.5">
                    {isEditingRtmp ? (
                      <>
                        <button
                          onClick={handleSaveRtmpUrl}
                          className="px-2 py-0.5 rounded bg-purple-600 hover:bg-purple-500 text-[10px] font-bold text-white flex items-center gap-1"
                        >
                          <Save className="w-2.5 h-2.5" /> CTC Save
                        </button>
                        <button
                          onClick={handleResetRtmpUrl}
                          className="px-2 py-0.5 rounded bg-zinc-800 hover:bg-zinc-700 text-[10px] text-zinc-300"
                        >
                          Default
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => {
                          setTempRtmpUrl(relayServerUrl);
                          setIsEditingRtmp(true);
                        }}
                        className="text-[10px] text-zinc-400 hover:text-white flex items-center gap-1 px-1.5 py-0.5 rounded bg-zinc-800/80 hover:bg-zinc-700"
                      >
                        <Edit2 className="w-2.5 h-2.5" /> Edit
                      </button>
                    )}
                  </div>
                </div>

                {isEditingRtmp ? (
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={tempRtmpUrl}
                      onChange={(e) => setTempRtmpUrl(e.target.value)}
                      placeholder="rtmp://live.omnicast.io/relay/app"
                      className="w-full bg-zinc-950 px-3 py-2 rounded-lg border border-purple-500/50 text-xs font-mono text-purple-300 focus:outline-none focus:ring-1 focus:ring-purple-400"
                    />
                  </div>
                ) : (
                  <div className="flex items-center justify-between gap-2 font-mono text-xs bg-zinc-950 p-2.5 rounded-lg text-zinc-200 border border-zinc-800">
                    <span className="truncate select-all text-purple-300 font-semibold">{relayServerUrl}</span>
                    <button
                      onClick={() => copyToClipboard(relayServerUrl, 'relay_url')}
                      className="p-1 text-purple-400 hover:text-white shrink-0"
                      title="Copy RTMP URL"
                    >
                      {copiedKey === 'relay_url' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                )}
              </div>

              {/* Master Stream Key */}
              <div className="p-3.5 rounded-xl bg-zinc-900 border border-zinc-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
                    <Shield className="w-3 h-3 text-zinc-400" />
                    Master Relay Stream Key
                  </span>
                  <button
                    onClick={handleRegenerateKey}
                    className="text-[10px] text-zinc-400 hover:text-amber-400 flex items-center gap-1 px-1.5 py-0.5 rounded bg-zinc-800/80 hover:bg-zinc-700"
                    title="Regenerate Stream Key"
                  >
                    <RefreshCw className="w-2.5 h-2.5" /> CTC Regenerate
                  </button>
                </div>
                <div className="flex items-center justify-between gap-2 font-mono text-xs bg-zinc-950 p-2.5 rounded-lg text-zinc-200 border border-zinc-800">
                  <span className="truncate select-all">
                    {showStreamKey ? streamKey : '••••••••••••••••••••••••••••••••'}
                  </span>
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => setShowStreamKey(!showStreamKey)}
                      className="p-1 text-zinc-400 hover:text-white"
                      title={showStreamKey ? 'Hide Key' : 'Reveal Key'}
                    >
                      {showStreamKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                    <button
                      onClick={() => copyToClipboard(streamKey, 'master_key')}
                      className="p-1 text-purple-400 hover:text-white"
                      title="Copy Stream Key"
                    >
                      {copiedKey === 'master_key' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>

              {/* OBS Quick Copy & Destination Relays Status */}
              <div className="bg-gradient-to-br from-purple-950/40 via-zinc-950 to-zinc-900 p-3.5 rounded-xl border border-purple-500/20 space-y-2.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-white flex items-center gap-1.5">
                    <Wifi className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                    OBS Studio Quick Setup
                  </span>
                  <button
                    onClick={() => {
                      const obsConfig = `Service: Custom...\nServer: ${relayServerUrl}\nStream Key: ${streamKey}`;
                      copyToClipboard(obsConfig, 'obs_full');
                    }}
                    className="text-[11px] font-bold text-purple-300 hover:text-purple-200 underline flex items-center gap-1"
                  >
                    {copiedKey === 'obs_full' ? 'Copied Full OBS Setup!' : 'CTC Copy Full OBS Config'}
                  </button>
                </div>

                <div className="text-[11px] text-zinc-400 space-y-1 font-sans">
                  <p>1. In OBS, go to <strong className="text-zinc-200">Settings → Stream</strong>.</p>
                  <p>2. Set Service to <strong className="text-purple-300">Custom...</strong> and paste Server: <span className="font-mono text-zinc-300 bg-zinc-900 px-1 rounded">{relayServerUrl}</span></p>
                  <p>3. Paste your Stream Key, tap <strong className="text-emerald-400">Start Streaming</strong> — Cut The Check will relay instantly to all active channels!</p>
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center pt-2">
              <span className="text-[11px] text-zinc-500 flex items-center gap-1">
                <Shield className="w-3 h-3 text-emerald-400" /> End-to-end TLS RTMP ingest
              </span>
              <button
                onClick={() => setShowRtmpModal(false)}
                className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
