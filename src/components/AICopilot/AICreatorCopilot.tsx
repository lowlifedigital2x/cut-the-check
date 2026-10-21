import React, { useState, useEffect, useRef } from 'react';
import {
  Sparkles,
  Send,
  Radio,
  Share2,
  DollarSign,
  Copy,
  Check,
  RefreshCw,
  Lightbulb,
  Zap,
  ChevronRight,
  Mic,
  MicOff,
  AlertCircle,
  X
} from 'lucide-react';
import {
  generateMultiPlatformCopies,
  generateStreamInsights,
  OptimizedPlatformContent,
  StreamIdeasResponse
} from '../../services/geminiService';
import { PlatformBadge } from '../common/PlatformBadge';

interface AICreatorCopilotProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyTitle?: (title: string) => void;
}

export const AICreatorCopilot: React.FC<AICreatorCopilotProps> = ({
  isOpen,
  onClose,
  onApplyTitle
}) => {
  const [activeMode, setActiveMode] = useState<'stream_hooks' | 'cross_captions' | 'rpm_calculator'>('stream_hooks');
  const [topic, setTopic] = useState('Building a 24-hour music studio from scratch');
  const [loading, setLoading] = useState(false);
  const [streamIdeas, setStreamIdeas] = useState<StreamIdeasResponse | null>(null);
  const [crossCopies, setCrossCopies] = useState<OptimizedPlatformContent[] | null>(null);
  const [copiedText, setCopiedText] = useState<string | null>(null);

  // Voice Dictation (Microphone Toggle) State
  const [isListening, setIsListening] = useState(false);
  const [interimTranscript, setInterimTranscript] = useState('');
  const [speechError, setSpeechError] = useState<string | null>(null);
  const recognitionRef = useRef<any>(null);

  const isSpeechSupported = typeof window !== 'undefined' &&
    (('SpeechRecognition' in window) || ('webkitSpeechRecognition' in window));

  const startListening = () => {
    setSpeechError(null);
    if (!isSpeechSupported) {
      setSpeechError('Speech recognition is not supported in this browser. Please use Chrome, Edge, or Safari.');
      return;
    }

    try {
      const SpeechRecognitionClass = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognitionClass();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsListening(true);
        setSpeechError(null);
      };

      recognition.onresult = (event: any) => {
        let finalChunk = '';
        let interimChunk = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          const transcriptSegment = event.results[i][0]?.transcript || '';
          if (event.results[i].isFinal) {
            finalChunk += transcriptSegment;
          } else {
            interimChunk += transcriptSegment;
          }
        }

        setInterimTranscript(interimChunk);

        if (finalChunk.trim()) {
          setTopic((prev) => {
            const cleanChunk = finalChunk.trim();
            const cleanPrev = prev.trim();
            if (!cleanPrev) return cleanChunk;
            return `${cleanPrev} ${cleanChunk}`;
          });
        }
      };

      recognition.onerror = (event: any) => {
        console.warn('SpeechRecognition error:', event.error);
        if (event.error === 'not-allowed') {
          setSpeechError('Microphone access denied. Please allow microphone permissions in your browser.');
        } else if (event.error === 'network') {
          setSpeechError('Network speech error. Please check your connection.');
        } else if (event.error !== 'no-speech') {
          setSpeechError(`Voice error: ${event.error}`);
        }
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
        setInterimTranscript('');
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err: any) {
      console.error('Failed to start speech recognition:', err);
      setSpeechError(err?.message || 'Could not access microphone.');
      setIsListening(false);
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (err) {
        // ignore
      }
    }
    setIsListening(false);
    setInterimTranscript('');
  };

  const toggleListening = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  const handleStopAndGenerate = () => {
    stopListening();
    if (activeMode === 'stream_hooks') {
      handleGenerateStreamHooks();
    } else if (activeMode === 'cross_captions') {
      handleGenerateCrossCaptions();
    }
  };

  // Turn off mic cleanly if modal closes or unmounts
  useEffect(() => {
    if (!isOpen && isListening) {
      stopListening();
    }
    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch (e) {}
      }
    };
  }, [isOpen, isListening]);

  // RPM Calculator State
  const [monthlyViews, setMonthlyViews] = useState(500000);
  const [streamHours, setStreamHours] = useState(40);
  const [avgCcv, setAvgCcv] = useState(2500);

  const handleGenerateStreamHooks = async () => {
    if (!topic.trim()) return;
    setLoading(true);
    try {
      const res = await generateStreamInsights(topic);
      setStreamIdeas(res);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateCrossCaptions = async () => {
    if (!topic.trim()) return;
    setLoading(true);
    try {
      const res = await generateMultiPlatformCopies(topic, [
        'tiktok',
        'youtube',
        'kick',
        'spotify',
        'applemusic',
        'facebook'
      ]);
      setCrossCopies(res);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard?.writeText(text);
    setCopiedText(id);
    setTimeout(() => setCopiedText(null), 2000);
  };

  if (!isOpen) return null;

  // Calculated estimates
  const estYoutubeAds = (monthlyViews * 0.45 * 4.6) / 1000;
  const estTiktokCreator = (monthlyViews * 0.35 * 1.15) / 1000;
  const estKickHourly = streamHours * 16.0; // KCIP hourly
  const estKickSubs = (avgCcv * 0.08 * 4.75); // 95/5 split subs
  const estSpotifyRoyalties = (monthlyViews * 0.15 * 3.8) / 1000;
  const estTotalGross = estYoutubeAds + estTiktokCreator + estKickHourly + estKickSubs + estSpotifyRoyalties;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#111622] rounded-2xl border border-zinc-800 w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-5 border-b border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-purple-500/20 text-purple-400 border border-purple-500/30">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white">Gemini AI Creator Strategist</h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 font-mono">
                  MULTISTREAM & POST OPTIMIZER
                </span>
              </div>
              <p className="text-xs text-zinc-400">
                Generate high-retention hooks, platform-tailored metadata, and revenue forecasts.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-zinc-500 hover:text-white text-base p-1.5 rounded-lg"
          >
            ✕
          </button>
        </div>

        {/* Mode Selector Tabs */}
        <div className="px-5 pt-3 border-b border-zinc-800/80 flex items-center gap-2">
          <button
            onClick={() => setActiveMode('stream_hooks')}
            className={`px-3 py-2 text-xs font-bold transition border-b-2 flex items-center gap-1.5 ${
              activeMode === 'stream_hooks'
                ? 'border-purple-500 text-purple-400'
                : 'border-transparent text-zinc-400 hover:text-white'
            }`}
          >
            <Radio className="w-3.5 h-3.5" />
            <span>Live Stream Titles & CCV Hooks</span>
          </button>

          <button
            onClick={() => setActiveMode('cross_captions')}
            className={`px-3 py-2 text-xs font-bold transition border-b-2 flex items-center gap-1.5 ${
              activeMode === 'cross_captions'
                ? 'border-purple-500 text-purple-400'
                : 'border-transparent text-zinc-400 hover:text-white'
            }`}
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>6-Channel Caption Synthesizer</span>
          </button>

          <button
            onClick={() => setActiveMode('rpm_calculator')}
            className={`px-3 py-2 text-xs font-bold transition border-b-2 flex items-center gap-1.5 ${
              activeMode === 'rpm_calculator'
                ? 'border-purple-500 text-purple-400'
                : 'border-transparent text-zinc-400 hover:text-white'
            }`}
          >
            <DollarSign className="w-3.5 h-3.5" />
            <span>Cross-Platform RPM Simulator</span>
          </button>
        </div>

        {/* Body Content */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1">
          {activeMode !== 'rpm_calculator' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase tracking-wider text-zinc-300 block">
                  Enter Content Idea, Video Concept or Stream Topic
                </label>
                <div className="flex items-center gap-1.5">
                  <span className={`text-[10px] font-medium flex items-center gap-1 ${isListening ? 'text-rose-400 font-bold animate-pulse' : 'text-zinc-400'}`}>
                    <Mic className="w-3 h-3" />
                    <span>{isListening ? 'Voice Dictation Active' : (isSpeechSupported ? 'Microphone Dictation Ready' : 'Voice Not Supported')}</span>
                  </span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                <div className="relative flex-1 flex items-center">
                  <input
                    type="text"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder={
                      isListening
                        ? 'Listening... Speak your content idea or stream topic now...'
                        : 'e.g. Breaking down our first $100k month as an independent streamer'
                    }
                    className={`w-full bg-zinc-900 border rounded-xl pl-4 pr-24 py-2.5 text-xs text-white focus:outline-none transition ${
                      isListening
                        ? 'border-red-500/80 ring-2 ring-red-500/30 bg-red-950/20'
                        : 'border-zinc-800 focus:border-purple-500'
                    }`}
                  />

                  {/* Actions inside input: Clear & Microphone Dictation Toggle */}
                  <div className="absolute right-2 flex items-center gap-1.5">
                    {topic && !isListening && (
                      <button
                        type="button"
                        onClick={() => setTopic('')}
                        title="Clear text"
                        className="p-1 rounded-md text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800 transition"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}

                    {/* Microphone Toggle Button */}
                    <button
                      type="button"
                      onClick={toggleListening}
                      title={
                        isListening
                          ? 'Stop dictating (Microphone is listening)'
                          : 'Dictate request with microphone instead of typing'
                      }
                      className={`relative flex items-center justify-center p-1.5 rounded-lg text-xs font-bold transition ${
                        isListening
                          ? 'bg-red-600 hover:bg-red-500 text-white shadow-lg shadow-red-600/40 ring-2 ring-red-400'
                          : 'bg-zinc-800 hover:bg-purple-600/30 hover:border-purple-500/50 text-zinc-300 hover:text-purple-300 border border-zinc-700'
                      }`}
                    >
                      {isListening ? (
                        <>
                          <span className="absolute -top-1 -right-1 flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                          </span>
                          <Mic className="w-4 h-4 text-white animate-pulse" />
                        </>
                      ) : (
                        <Mic className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                <button
                  onClick={
                    activeMode === 'stream_hooks'
                      ? handleGenerateStreamHooks
                      : handleGenerateCrossCaptions
                  }
                  disabled={loading || !topic.trim()}
                  className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs font-bold uppercase transition flex items-center justify-center gap-1.5 shrink-0 shadow-lg shadow-purple-600/20"
                >
                  <RefreshCw
                    className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`}
                  />
                  <span>{loading ? 'Synthesizing...' : 'CTC Generate with Gemini'}</span>
                </button>
              </div>

              {/* Live Dictation Active Indicator & Transcript Preview */}
              {isListening && (
                <div className="p-3 rounded-xl bg-gradient-to-r from-red-950/40 via-zinc-900 to-rose-950/30 border border-red-500/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-in fade-in slide-in-from-top-1">
                  <div className="flex items-center gap-3">
                    {/* Visualizer Wave Bars */}
                    <div className="flex items-end gap-1 h-5 px-1 bg-black/40 rounded-md py-1 border border-red-500/20">
                      <span className="w-1 h-2.5 bg-red-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                      <span className="w-1 h-4 bg-rose-500 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                      <span className="w-1 h-1.5 bg-red-400 rounded-full animate-bounce [animation-delay:-0.4s]"></span>
                      <span className="w-1 h-3.5 bg-rose-400 rounded-full animate-bounce"></span>
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[9px] font-black tracking-wider uppercase bg-red-500/20 text-red-300 px-1.5 py-0.5 rounded border border-red-500/40 font-mono">
                          RECORDING
                        </span>
                        <span className="text-xs text-zinc-300">
                          {interimTranscript ? (
                            <span className="italic text-white font-medium">"{interimTranscript}"</span>
                          ) : (
                            'Speak clearly into your microphone — your words will appear above...'
                          )}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={stopListening}
                      className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white border border-zinc-700 transition"
                    >
                      Done Dictating
                    </button>
                    <button
                      type="button"
                      onClick={handleStopAndGenerate}
                      className="px-2.5 py-1 text-xs font-bold rounded-lg bg-red-600 hover:bg-red-500 text-white shadow-md shadow-red-600/30 transition flex items-center gap-1"
                    >
                      <Sparkles className="w-3 h-3" />
                      <span>CTC Stop & Generate</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Dictation Error Feedback Banner */}
              {speechError && (
                <div className="p-3 rounded-xl bg-amber-950/40 border border-amber-500/40 flex items-center justify-between gap-2 text-xs text-amber-200 animate-in fade-in">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>{speechError}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSpeechError(null)}
                    className="text-amber-400 hover:text-white p-1 rounded transition"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              {/* Quick Dictation Suggestions */}
              {!isListening && (
                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">
                    Quick Ideas:
                  </span>
                  {[
                    '24-Hour Charity Subathon with Beat Production',
                    'Behind the Scenes Album Mix & Studio Tour',
                    'Growing from 0 to $50k/mo on Multi-Streaming'
                  ].map((preset, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setTopic(preset)}
                      className="text-[10px] px-2 py-0.5 rounded-md bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-purple-300 border border-zinc-800 hover:border-purple-500/30 transition truncate max-w-[210px]"
                    >
                      "{preset}"
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Mode 1: Stream Hooks */}
          {activeMode === 'stream_hooks' && (
            <div className="space-y-4">
              {streamIdeas ? (
                <>
                  <div className="space-y-2">
                    <span className="text-xs font-bold text-white uppercase tracking-wider block">
                      Click-Worthy Multicast Titles:
                    </span>
                    <div className="space-y-2">
                      {streamIdeas.streamTitles.map((st, i) => (
                        <div
                          key={i}
                          className="p-3 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-between gap-3 text-xs"
                        >
                          <span className="font-semibold text-white">{st}</span>
                          <div className="flex items-center gap-2 shrink-0">
                            {onApplyTitle && (
                              <button
                                onClick={() => {
                                  onApplyTitle(st);
                                  onClose();
                                }}
                                className="px-2 py-1 rounded bg-purple-600 hover:bg-purple-500 text-white text-[10px] font-bold"
                              >
                                CTC Apply Title
                              </button>
                            )}
                            <button
                              onClick={() => copyToClipboard(st, `st_${i}`)}
                              className="p-1 text-zinc-400 hover:text-white"
                            >
                              {copiedText === `st_${i}` ? (
                                <Check className="w-3.5 h-3.5 text-emerald-400" />
                              ) : (
                                <Copy className="w-3.5 h-3.5" />
                              )}
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-4 rounded-xl bg-blue-950/20 border border-blue-500/20 space-y-2">
                      <span className="text-xs font-bold text-blue-300 uppercase tracking-wider block">
                        Retention Hooks (Keep CCV High):
                      </span>
                      <ul className="text-xs text-zinc-300 space-y-1.5 list-disc pl-4">
                        {streamIdeas.engagementHooks.map((h, i) => (
                          <li key={i}>{h}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-500/20 space-y-2">
                      <span className="text-xs font-bold text-amber-300 uppercase tracking-wider block">
                        Monetization Triggers (Gifts & Subs):
                      </span>
                      <ul className="text-xs text-zinc-300 space-y-1.5 list-disc pl-4">
                        {streamIdeas.monetizationTriggers.map((m, i) => (
                          <li key={i}>{m}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </>
              ) : (
                <div className="p-8 text-center text-zinc-500 text-xs">
                  Click Generate to receive AI optimized stream titles and live engagement triggers.
                </div>
              )}
            </div>
          )}

          {/* Mode 2: Cross Captions */}
          {activeMode === 'cross_captions' && (
            <div className="space-y-3">
              {crossCopies ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {crossCopies.map((c) => (
                    <div
                      key={c.platformId}
                      className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <PlatformBadge platformId={c.platformId} size="sm" />
                        <button
                          onClick={() => copyToClipboard(c.caption, c.platformId)}
                          className="p-1 text-zinc-400 hover:text-white"
                        >
                          {copiedText === c.platformId ? (
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                      <p className="text-xs font-bold text-white line-clamp-1">{c.title}</p>
                      <p className="text-xs text-zinc-300 whitespace-pre-line line-clamp-3">
                        {c.caption}
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {c.hashtags.map((h, i) => (
                          <span
                            key={i}
                            className="text-[10px] text-purple-400 bg-purple-500/10 px-1.5 py-0.5 rounded"
                          >
                            {h}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center text-zinc-500 text-xs">
                  Click Generate to generate 6 platform-tailored copies in one click.
                </div>
              )}
            </div>
          )}

          {/* Mode 3: RPM Simulator */}
          {activeMode === 'rpm_calculator' && (
            <div className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-bold text-zinc-300 block mb-1">
                    Monthly Multi-Platform Views / Streams
                  </label>
                  <input
                    type="number"
                    value={monthlyViews}
                    onChange={(e) => setMonthlyViews(Number(e.target.value))}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-zinc-300 block mb-1">
                    Monthly Live Stream Hours
                  </label>
                  <input
                    type="number"
                    value={streamHours}
                    onChange={(e) => setStreamHours(Number(e.target.value))}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-zinc-300 block mb-1">
                    Average Concurrent Viewers (CCV)
                  </label>
                  <input
                    type="number"
                    value={avgCcv}
                    onChange={(e) => setAvgCcv(Number(e.target.value))}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2 text-xs text-white"
                  />
                </div>
              </div>

              {/* Calculated Earnings Card */}
              <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-950/60 via-zinc-900 to-teal-950/40 border border-emerald-500/30 space-y-3">
                <span className="text-xs font-bold text-emerald-300 uppercase tracking-wider block">
                  Simulated Monthly Earnings Across All Channels
                </span>
                <div className="text-3xl font-black text-white font-mono">
                  ${Math.round(estTotalGross).toLocaleString()} / month
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs pt-2 border-t border-zinc-800">
                  <div>
                    <span className="text-zinc-500 block">YouTube AdSense:</span>
                    <span className="text-red-400 font-bold font-mono">
                      ${Math.round(estYoutubeAds).toLocaleString()}
                    </span>
                  </div>
                  <div>
                    <span className="text-zinc-500 block">Kick (Subs & KCIP):</span>
                    <span className="text-lime-400 font-bold font-mono">
                      ${Math.round(estKickHourly + estKickSubs).toLocaleString()}
                    </span>
                  </div>
                  <div>
                    <span className="text-zinc-500 block">TikTok Rewards:</span>
                    <span className="text-cyan-400 font-bold font-mono">
                      ${Math.round(estTiktokCreator).toLocaleString()}
                    </span>
                  </div>
                  <div>
                    <span className="text-zinc-500 block">Spotify Royalties:</span>
                    <span className="text-emerald-400 font-bold font-mono">
                      ${Math.round(estSpotifyRoyalties).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
