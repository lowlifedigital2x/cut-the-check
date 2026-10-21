import React, { useMemo, useRef, useState } from 'react';
import {
  Rocket,
  Radio,
  Disc3,
  Send,
  Globe,
  CheckCircle2,
  Zap,
  RefreshCw
} from 'lucide-react';
import { PlatformConnection, PlatformId } from '../../types';
import { PLATFORM_CONFIGS } from '../../data/mockData';

/**
 * SIMULTANEOUS EVERYWHERE — master launch panel.
 * One command that (1) goes live on every live platform at once,
 * (2) releases the drop on every platform at the same moment
 * (simultaneous by default, staggered optional), and (3) blasts the
 * announcement post to every connected social account simultaneously.
 * Self-contained: local state + simulated launch sequence only.
 */

type FireStatus = 'armed' | 'firing' | 'done';
interface FireMark {
  status: FireStatus;
  at?: string;
}
type MarkMap = Partial<Record<PlatformId, FireMark>>;

type LaunchType = 'multicast' | 'multi-live' | 'premiere' | 'drop';
type LaunchStyle = 'simultaneous' | 'countdown' | 'staggered';

const TYPE_LABELS: Record<LaunchType, string> = {
  multicast: 'Multicast',
  'multi-live': 'Multi-Live',
  premiere: 'Premiere',
  drop: 'Drop'
};
const TYPE_DESCRIPTIONS: Record<LaunchType, string> = {
  multicast: 'Multicast — one master feed fanned out to every live platform at once.',
  'multi-live': 'Multi-Live — a native live session launched on each platform simultaneously.',
  premiere: 'Premiere — pre-recorded content presented as a live premiere event.',
  drop: 'Drop — straight release, no live component. Release + post only.'
};
const STYLE_LABELS: Record<LaunchStyle, string> = {
  simultaneous: 'Simultaneous',
  countdown: 'Countdown',
  staggered: 'Staggered'
};
const STYLE_DESCRIPTIONS: Record<LaunchStyle, string> = {
  simultaneous: 'Simultaneous — everything fires at one shared moment.',
  countdown: 'Countdown — a T-minus countdown runs, then everything fires at zero.',
  staggered: 'Staggered — fires across the platforms on a rollout timeline, wave by wave.'
};

const LIVE_ORDER: PlatformId[] = [
  'twitch', 'kick', 'youtube', 'tiktok', 'instagram',
  'facebook', 'twitter', 'rumble', 'linkedin', 'custom_rtmp',
  'trovo', 'dlive', 'nimo', 'soop', 'bilibili', 'vimeo', 'younow', 'dailymotion',
  'discord', 'telegram', 'patreon', 'substack', 'mixcloud'
];
const RELEASE_ORDER: PlatformId[] = [
  'spotify', 'applemusic', 'amazonmusic', 'soundcloud', 'youtube', 'tiktok',
  'instagram', 'facebook', 'twitter', 'twitch', 'kick', 'rumble', 'linkedin', 'custom_rtmp',
  'tidal', 'deezer', 'audiomack', 'bandcamp', 'pandora', 'iheart', 'napster',
  'qobuz', 'boomplay', 'audius', 'beatport', 'mixcloud',
  'trovo', 'dlive', 'nimo', 'soop', 'bilibili', 'vimeo', 'younow', 'dailymotion', 'vevo',
  'threads', 'snapchat', 'pinterest', 'reddit', 'discord', 'telegram',
  'bluesky', 'tumblr', 'mastodon', 'whatsapp', 'patreon', 'substack'
];
const POST_ORDER: PlatformId[] = [
  'instagram', 'tiktok', 'twitter', 'facebook', 'youtube', 'spotify',
  'applemusic', 'amazonmusic', 'soundcloud', 'twitch', 'kick', 'rumble', 'linkedin',
  'tidal', 'deezer', 'audiomack', 'bandcamp', 'pandora', 'iheart', 'napster',
  'qobuz', 'boomplay', 'audius', 'beatport', 'mixcloud',
  'trovo', 'dlive', 'nimo', 'soop', 'bilibili', 'vimeo', 'younow', 'dailymotion', 'vevo',
  'threads', 'snapchat', 'pinterest', 'reddit', 'discord', 'telegram',
  'bluesky', 'tumblr', 'mastodon', 'whatsapp', 'patreon', 'substack'
];

const LIVE_IDS = LIVE_ORDER.filter((id) => PLATFORM_CONFIGS[id]?.supportsLive);
const POST_IDS = POST_ORDER.filter((id) => PLATFORM_CONFIGS[id]?.supportsPost);
const RELEASE_IDS = RELEASE_ORDER.filter((id) => !!PLATFORM_CONFIGS[id]);

const delay = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));
const stamp = () => new Date().toLocaleTimeString('en-US', { hour12: false });

const armedMap = (ids: PlatformId[]): MarkMap => {
  const m: MarkMap = {};
  ids.forEach((id) => { m[id] = { status: 'armed' }; });
  return m;
};

interface SimultaneousEverywherePanelProps {
  connections: PlatformConnection[];
}

export const SimultaneousEverywherePanel: React.FC<SimultaneousEverywherePanelProps> = ({ connections }) => {
  const [liveArmed, setLiveArmed] = useState(true);
  const [releaseArmed, setReleaseArmed] = useState(true);
  const [releaseMode, setReleaseMode] = useState<'simultaneous' | 'staggered'>('simultaneous');
  const [launchType, setLaunchType] = useState<LaunchType>('multicast');
  const [launchStyle, setLaunchStyle] = useState<LaunchStyle>('simultaneous');
  const [countdown, setCountdown] = useState<number | null>(null);
  const [sequenceNote, setSequenceNote] = useState<string | null>(null);
  const [postArmed, setPostArmed] = useState(true);
  const [postText, setPostText] = useState(
    'OUT NOW EVERYWHERE. The new drop just went live on all platforms at the same time — stream it, watch the live premiere, run it up. #CutTheCheck'
  );

  const [liveMarks, setLiveMarks] = useState<MarkMap>(() => armedMap(LIVE_IDS));
  const [releaseMarks, setReleaseMarks] = useState<MarkMap>(() => armedMap(RELEASE_IDS));
  const [postMarks, setPostMarks] = useState<MarkMap>(() => armedMap(POST_IDS));

  const [phase, setPhase] = useState<'idle' | 'launching' | 'complete'>('idle');
  const [completedAt, setCompletedAt] = useState<string | null>(null);
  const runningRef = useRef(false);

  const handleFor = (id: PlatformId) =>
    connections.find((c) => c.platformId === id && c.connected)?.accountHandle;

  // A Drop has no live component — the live mode is parked for that type.
  const isDrop = launchType === 'drop';
  const isPremiere = launchType === 'premiere';
  const liveActive = liveArmed && !isDrop;

  const armedNetworks = useMemo(() => {
    const s = new Set<PlatformId>();
    if (liveActive) LIVE_IDS.forEach((id) => s.add(id));
    if (releaseArmed) RELEASE_IDS.forEach((id) => s.add(id));
    if (postArmed) POST_IDS.forEach((id) => s.add(id));
    return s.size;
  }, [liveActive, releaseArmed, postArmed]);

  const totalActions =
    (liveActive ? LIVE_IDS.length : 0) +
    (releaseArmed ? RELEASE_IDS.length : 0) +
    (postArmed ? POST_IDS.length : 0);

  const doneCount = useMemo(() => {
    const count = (m: MarkMap) => Object.values(m).filter((x) => x?.status === 'done').length;
    return count(liveMarks) + count(releaseMarks) + count(postMarks);
  }, [liveMarks, releaseMarks, postMarks]);

  const anyArmed = liveActive || releaseArmed || postArmed;

  const playTone = (type: 'chime' | 'switch') => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      if (type === 'chime') {
        [523.25, 659.25, 783.99, 1046.5].forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.value = freq;
          gain.gain.setValueAtTime(0.08, ctx.currentTime + idx * 0.06);
          gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.06 + 0.8);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(ctx.currentTime + idx * 0.06);
          osc.stop(ctx.currentTime + idx * 0.06 + 0.8);
        });
      } else {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(880, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(320, ctx.currentTime + 0.08);
        gain.gain.setValueAtTime(0.15, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.08);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.08);
      }
    } catch (e) {
      // AudioContext blocked before user interaction — visual feedback only.
    }
  };

  // STYLE is the single source of truth for launch timing — the Release
  // card's Simultaneous/Staggered toggle reads and writes the same state.
  // Countdown fires everything at zero, so the release itself behaves
  // simultaneously; Staggered drives the release's cascade mode.
  const applyStyle = (style: LaunchStyle) => {
    setLaunchStyle(style);
    setReleaseMode(style === 'staggered' ? 'staggered' : 'simultaneous');
    playTone('switch');
  };

  const setAll = (
    setter: React.Dispatch<React.SetStateAction<MarkMap>>,
    ids: PlatformId[],
    status: FireStatus,
    at?: string
  ) => {
    setter((prev) => {
      const next: MarkMap = { ...prev };
      ids.forEach((id) => { next[id] = { status, at }; });
      return next;
    });
  };

  const setOne = (
    setter: React.Dispatch<React.SetStateAction<MarkMap>>,
    id: PlatformId,
    status: FireStatus,
    at?: string
  ) => {
    setter((prev) => ({ ...prev, [id]: { status, at } }));
  };

  const handleReset = () => {
    if (runningRef.current) return;
    setLiveMarks(armedMap(LIVE_IDS));
    setReleaseMarks(armedMap(RELEASE_IDS));
    setPostMarks(armedMap(POST_IDS));
    setPhase('idle');
    setCompletedAt(null);
    setCountdown(null);
    setSequenceNote(null);
    playTone('switch');
  };

  const handleLaunchEverywhere = async () => {
    if (runningRef.current || !anyArmed || phase !== 'idle') return;
    runningRef.current = true;
    setPhase('launching');
    playTone('chime');

    // Countdown style — a T-minus run first; everything fires at zero.
    if (launchStyle === 'countdown') {
      for (let n = 3; n >= 1; n--) {
        setCountdown(n);
        setSequenceNote(`Countdown — T-${n} … ${TYPE_LABELS[launchType]} fires everywhere at zero`);
        await delay(700);
      }
      setCountdown(0);
      setSequenceNote('ZERO — firing everywhere');
      await delay(350);
      setCountdown(null);
    }

    // Phase 1 — LIVE: multicast fan-out, native multi-live sessions, or
    // premieres on every live platform at once. A Drop skips this phase.
    if (liveActive) {
      setAll(setLiveMarks, LIVE_IDS, 'firing');
      setSequenceNote(
        isPremiere
          ? 'Premieres starting — the release plays as a live event on every platform'
          : launchType === 'multi-live'
            ? 'Native live sessions launching — one per platform, all at once'
            : 'Multicast feed fanning out — one feed, every live platform'
      );
      await delay(650);
      const liveVerb = isPremiere
        ? 'Premiere started'
        : launchType === 'multi-live'
          ? 'Native live session up'
          : 'Multicast feed live';
      for (const id of LIVE_IDS) {
        setOne(setLiveMarks, id, 'done', stamp());
        setSequenceNote(`${liveVerb} — ${PLATFORM_CONFIGS[id]?.name}`);
        await delay(70);
      }
    }

    // Phase 2 — RELEASE SAME TIME: one shared timestamp in simultaneous
    // mode; a visible platform-by-platform cascade in staggered mode.
    if (releaseArmed) {
      if (releaseMode === 'simultaneous') {
        setAll(setReleaseMarks, RELEASE_IDS, 'firing');
        setSequenceNote(`Release firing — one shared moment across ${RELEASE_IDS.length} platforms`);
        await delay(700);
        setAll(setReleaseMarks, RELEASE_IDS, 'done', stamp());
        setSequenceNote(`Release delivered — ${RELEASE_IDS.length} platforms, one shared timestamp`);
      } else {
        const waveSize = Math.max(1, Math.ceil(RELEASE_IDS.length / 4));
        for (let i = 0; i < RELEASE_IDS.length; i++) {
          if (i % waveSize === 0) {
            setSequenceNote(`Staggered rollout: wave ${Math.floor(i / waveSize) + 1} of 4`);
          }
          setOne(setReleaseMarks, RELEASE_IDS[i], 'firing');
          await delay(160);
          setOne(setReleaseMarks, RELEASE_IDS[i], 'done', stamp());
          await delay(60);
        }
      }
    }

    // Phase 3 — POST EVERYWHERE AT ONCE: the announcement blast.
    if (postArmed) {
      setAll(setPostMarks, POST_IDS, 'firing');
      setSequenceNote('Announcement post blasting — every account at once');
      await delay(500);
      for (const id of POST_IDS) {
        setOne(setPostMarks, id, 'done', stamp());
        await delay(55);
      }
    }

    setCompletedAt(stamp());
    setSequenceNote(
      `Delivered — ${TYPE_LABELS[launchType]} • ${STYLE_LABELS[launchStyle]} • ${totalActions} actions, one click`
    );
    setPhase('complete');
    playTone('chime');
    runningRef.current = false;
  };

  const statusPill = (mark: FireMark | undefined, doneLabel: string, off: boolean) => {
    if (off) {
      return (
        <span className="text-[9px] font-mono font-bold px-2 py-0.5 rounded border bg-zinc-950 text-zinc-600 border-zinc-800">
          STANDBY
        </span>
      );
    }
    if (!mark || mark.status === 'armed') {
      return (
        <span className="text-[9px] font-mono font-bold px-2 py-0.5 rounded border bg-amber-950/60 text-amber-300 border-amber-600/40">
          ARMED
        </span>
      );
    }
    if (mark.status === 'firing') {
      return (
        <span className="text-[9px] font-mono font-bold px-2 py-0.5 rounded border bg-purple-950/60 text-purple-300 border-purple-500/40 animate-pulse flex items-center gap-1">
          <Zap className="w-3 h-3" /> FIRING
        </span>
      );
    }
    return (
      <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded border flex items-center gap-1 ${
        doneLabel === 'LIVE' || doneLabel === 'PREMIERE'
          ? 'bg-red-950/70 text-red-300 border-red-500/50'
          : 'bg-emerald-950/70 text-emerald-300 border-emerald-500/40'
      }`}>
        <span className={`w-1.5 h-1.5 rounded-full ${doneLabel === 'LIVE' || doneLabel === 'PREMIERE' ? 'bg-red-400 animate-ping' : 'bg-emerald-400'}`} />
        {doneLabel} {mark.at}
      </span>
    );
  };

  const renderRow = (
    id: PlatformId,
    marks: MarkMap,
    doneLabel: string,
    off: boolean,
    subOverride?: string
  ) => {
    const cfg = PLATFORM_CONFIGS[id];
    const handle = handleFor(id);
    return (
      <div
        key={id}
        className={`flex items-center justify-between gap-2 px-2.5 py-1.5 rounded-lg border transition ${
          off ? 'bg-zinc-950/40 border-zinc-900 opacity-50' : 'bg-black/50 border-zinc-800/80'
        }`}
      >
        <div className="flex items-center gap-2 min-w-0">
          <span
            className="w-2.5 h-2.5 rounded-full shrink-0"
            style={{ backgroundColor: off ? '#4B5563' : cfg?.color }}
          />
          <div className="min-w-0 leading-tight">
            <div className="text-xs font-bold text-white truncate">
              {cfg?.name}
              {doneLabel === 'LIVE' && <span className="text-zinc-500 font-semibold"> Live</span>}
              {doneLabel === 'PREMIERE' && <span className="text-zinc-500 font-semibold"> Premiere</span>}
            </div>
            <div className="text-[10px] text-zinc-500 font-mono truncate">
              {subOverride ?? handle ?? cfg?.category}
            </div>
          </div>
        </div>
        {statusPill(marks[id], doneLabel, off)}
      </div>
    );
  };

  const armToggle = (armed: boolean, onClick: () => void) => (
    <button
      onClick={onClick}
      disabled={phase !== 'idle'}
      className={`text-[10px] font-mono font-black px-2.5 py-1 rounded-lg border transition ${
        armed
          ? 'bg-emerald-950/60 text-emerald-300 border-emerald-500/50'
          : 'bg-zinc-950 text-zinc-500 border-zinc-800 hover:border-zinc-600'
      } ${phase !== 'idle' ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}`}
    >
      {armed ? '● ARMED' : '○ OFF'}
    </button>
  );

  const progressPct = totalActions > 0 ? Math.round((doneCount / totalActions) * 100) : 0;

  return (
    <section className="relative rounded-3xl overflow-hidden border-2 border-amber-500/40 bg-[#06080E] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.9)]">
      <div className="absolute inset-0 bg-gradient-to-b from-amber-500/[0.07] via-transparent to-transparent pointer-events-none" />

      <div className="relative p-6 lg:p-8 space-y-6">
        {/* Panel Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-amber-500/20 pb-5">
          <div className="space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[10px] font-mono font-black tracking-widest uppercase text-amber-300 bg-amber-950/80 px-2 py-0.5 rounded border border-amber-600/40 flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5" />
                Simultaneous Everywhere
              </span>
              <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider">
                Master Launch Panel • One Command, Every Network
              </span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              Go Live, Release & Post — <span className="text-gold-gradient">All At Once</span>
            </h3>
            <p className="text-xs sm:text-sm text-zinc-400 max-w-2xl leading-relaxed">
              Live broadcast fires on every major live platform, the drop releases on every
              platform at the same moment, and the announcement post blasts to every connected
              social account — simultaneously, from one button.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-black/75 border border-amber-500/40 backdrop-blur-md shrink-0 min-w-[190px]">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-zinc-400 uppercase">Networks Armed</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            </div>
            <div className="text-2xl font-black text-gold-gradient font-mono mt-1">
              {armedNetworks} NETWORKS
            </div>
            <div className="text-[11px] text-zinc-400 font-mono mt-0.5">
              {LIVE_IDS.length} live • {RELEASE_IDS.length} release • {POST_IDS.length} social
            </div>
          </div>
        </div>

        {/* Launch Type & Style Selectors */}
        <div className="space-y-4 rounded-2xl border border-zinc-800 bg-zinc-950/40 p-4">
          {/* LAUNCH TYPE */}
          <div className="flex flex-col md:flex-row md:items-center gap-3">
            <div className="md:w-32 shrink-0 leading-tight">
              <div className="text-[10px] font-mono font-black uppercase tracking-widest text-zinc-200">Launch Type</div>
              <div className="text-[10px] font-mono text-zinc-500">How it goes out</div>
            </div>
            <div className="flex-1 space-y-1.5">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-1 p-1 rounded-xl bg-black/70 border border-zinc-800">
                {(Object.keys(TYPE_LABELS) as LaunchType[]).map((t) => (
                  <button
                    key={t}
                    onClick={() => { setLaunchType(t); playTone('switch'); }}
                    disabled={phase !== 'idle'}
                    className={`py-1.5 rounded-lg text-[10px] font-mono font-black uppercase transition ${
                      launchType === t
                        ? 'bg-amber-400 text-amber-950'
                        : 'text-zinc-400 hover:text-white'
                    } disabled:opacity-50`}
                  >
                    {TYPE_LABELS[t]}
                  </button>
                ))}
              </div>
              <p className="text-[10px] text-zinc-500 font-mono leading-snug px-0.5">
                {TYPE_DESCRIPTIONS[launchType]}
              </p>
            </div>
          </div>

          {/* STYLE */}
          <div className="flex flex-col md:flex-row md:items-center gap-3">
            <div className="md:w-32 shrink-0 leading-tight">
              <div className="text-[10px] font-mono font-black uppercase tracking-widest text-zinc-200">Style</div>
              <div className="text-[10px] font-mono text-zinc-500">When it fires</div>
            </div>
            <div className="flex-1 space-y-1.5">
              <div className="grid grid-cols-3 gap-1 p-1 rounded-xl bg-black/70 border border-zinc-800">
                {(Object.keys(STYLE_LABELS) as LaunchStyle[]).map((s) => (
                  <button
                    key={s}
                    onClick={() => applyStyle(s)}
                    disabled={phase !== 'idle'}
                    className={`py-1.5 rounded-lg text-[10px] font-mono font-black uppercase transition ${
                      launchStyle === s
                        ? 'bg-amber-400 text-amber-950'
                        : 'text-zinc-400 hover:text-white'
                    } disabled:opacity-50`}
                  >
                    {STYLE_LABELS[s]}
                  </button>
                ))}
              </div>
              <p className="text-[10px] text-zinc-500 font-mono leading-snug px-0.5">
                {STYLE_DESCRIPTIONS[launchStyle]}
              </p>
            </div>
          </div>
        </div>

        {/* Three Coupled Modes */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
          {/* MODE 1 — GO LIVE EVERYWHERE */}
          <div className={`rounded-2xl border p-4 space-y-3 transition ${liveActive ? 'border-red-500/30 bg-zinc-950/60' : 'border-zinc-800 bg-zinc-950/40'} ${isDrop ? 'opacity-75' : ''}`}>
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-lg bg-red-500/15 border border-red-500/30 text-red-400">
                  <Radio className="w-4 h-4" />
                </span>
                <div className="leading-tight">
                  <div className="text-xs font-black text-white uppercase tracking-wide">
                    {isPremiere ? 'Premiere Everywhere' : 'Go Live Everywhere'}
                  </div>
                  <div className="text-[10px] font-mono text-zinc-500">
                    {isDrop
                      ? 'Parked for this launch type'
                      : isPremiere
                        ? `${LIVE_IDS.length} live premieres, one start moment`
                        : `${LIVE_IDS.length} live platforms, one start`}
                  </div>
                </div>
              </div>
              {armToggle(liveArmed && !isDrop, () => { if (!isDrop) { setLiveArmed(!liveArmed); playTone('switch'); } })}
            </div>
            {isDrop && (
              <p className="text-[10px] text-zinc-500 font-mono leading-snug px-0.5">
                No live in a Drop — this launch type fires release + post only. Switch the launch type to bring live back.
              </p>
            )}
            <div className="space-y-1.5">
              {LIVE_IDS.map((id) => renderRow(id, liveMarks, isPremiere ? 'PREMIERE' : 'LIVE', !liveActive))}
            </div>
          </div>

          {/* MODE 2 — RELEASE SAME TIME */}
          <div className={`rounded-2xl border p-4 space-y-3 transition ${releaseArmed ? 'border-amber-500/30 bg-zinc-950/60' : 'border-zinc-800 bg-zinc-950/40'}`}>
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-lg bg-amber-500/15 border border-amber-500/30 text-amber-400">
                  <Disc3 className="w-4 h-4" />
                </span>
                <div className="leading-tight">
                  <div className="text-xs font-black text-white uppercase tracking-wide">Release Same Time</div>
                  <div className="text-[10px] font-mono text-zinc-500">{RELEASE_IDS.length} platforms, one drop moment</div>
                </div>
              </div>
              {armToggle(releaseArmed, () => { setReleaseArmed(!releaseArmed); playTone('switch'); })}
            </div>

            {/* Simultaneous vs Staggered */}
            <div className="space-y-1.5">
              <div className="grid grid-cols-2 gap-1 p-1 rounded-xl bg-black/70 border border-zinc-800">
                <button
                  onClick={() => applyStyle('simultaneous')}
                  disabled={!releaseArmed || phase !== 'idle'}
                  className={`py-1.5 rounded-lg text-[10px] font-mono font-black uppercase transition ${
                    releaseMode === 'simultaneous'
                      ? 'bg-amber-400 text-amber-950'
                      : 'text-zinc-400 hover:text-white'
                  } disabled:opacity-50`}
                >
                  Simultaneous
                </button>
                <button
                  onClick={() => applyStyle('staggered')}
                  disabled={!releaseArmed || phase !== 'idle'}
                  className={`py-1.5 rounded-lg text-[10px] font-mono font-black uppercase transition ${
                    releaseMode === 'staggered'
                      ? 'bg-amber-400 text-amber-950'
                      : 'text-zinc-400 hover:text-white'
                  } disabled:opacity-50`}
                >
                  Staggered
                </button>
              </div>
              <p className="text-[10px] text-zinc-500 font-mono leading-snug px-0.5">
                {releaseMode === 'staggered'
                  ? 'Staggered rollout — platforms release one by one in sequence.'
                  : launchStyle === 'countdown'
                    ? 'Countdown release — the drop fires on every platform the moment the countdown hits zero.'
                    : 'Simultaneous release — all platforms, same time, one shared timestamp.'}
              </p>
            </div>

            <div className="space-y-1.5">
              {RELEASE_IDS.map((id) =>
                renderRow(id, releaseMarks, 'RELEASED', !releaseArmed,
                  `${PLATFORM_CONFIGS[id]?.category.toUpperCase()} SYNDICATION`)
              )}
            </div>
          </div>

          {/* MODE 3 — POST EVERYWHERE AT ONCE */}
          <div className={`rounded-2xl border p-4 space-y-3 transition ${postArmed ? 'border-sky-500/30 bg-zinc-950/60' : 'border-zinc-800 bg-zinc-950/40'}`}>
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-lg bg-sky-500/15 border border-sky-500/30 text-sky-400">
                  <Send className="w-4 h-4" />
                </span>
                <div className="leading-tight">
                  <div className="text-xs font-black text-white uppercase tracking-wide">Post Everywhere At Once</div>
                  <div className="text-[10px] font-mono text-zinc-500">{POST_IDS.length} accounts, one blast</div>
                </div>
              </div>
              {armToggle(postArmed, () => { setPostArmed(!postArmed); playTone('switch'); })}
            </div>

            <textarea
              value={postText}
              onChange={(e) => setPostText(e.target.value)}
              disabled={!postArmed || phase !== 'idle'}
              rows={3}
              className="w-full px-3 py-2 rounded-xl bg-black/80 border border-zinc-800 text-xs text-zinc-200 focus:outline-none focus:border-sky-400/60 disabled:opacity-50 resize-none"
              placeholder="Announcement post for the drop…"
            />

            <div className="space-y-1.5">
              {POST_IDS.map((id) => renderRow(id, postMarks, 'POSTED', !postArmed))}
            </div>
          </div>
        </div>

        {/* Master Launch Bar */}
        <div className="pt-5 border-t border-amber-500/20 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex-1 space-y-2 min-w-[220px]">
            <div className="flex items-center justify-between text-[11px] font-mono">
              <span className="text-zinc-400 uppercase">
                {phase === 'idle' && 'Ready — all armed modes fire together'}
                {phase === 'launching' && 'Launch sequence firing…'}
                {phase === 'complete' && (
                  <span className="text-emerald-300 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Everywhere launch complete at {completedAt}
                  </span>
                )}
              </span>
              <span className="text-amber-300 font-bold">{doneCount}/{totalActions} actions</span>
            </div>
            <div className="text-[10px] font-mono text-zinc-500 truncate">
              {sequenceNote ?? `Standby — ${TYPE_LABELS[launchType]} • ${STYLE_LABELS[launchStyle]} selected`}
            </div>
            <div className="w-full bg-zinc-900 h-2 rounded-full overflow-hidden border border-zinc-800">
              <div
                className="bg-gradient-to-r from-amber-400 to-emerald-400 h-full transition-all duration-300"
                style={{ width: `${progressPct}%` }}
              />
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            {phase === 'complete' && (
              <button
                onClick={handleReset}
                className="py-3.5 px-5 rounded-2xl text-xs font-mono font-black uppercase tracking-wider bg-zinc-900 text-zinc-200 border border-zinc-700 hover:border-amber-400 hover:text-white transition flex items-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                CTC Re-Arm
              </button>
            )}
            <button
              onClick={handleLaunchEverywhere}
              disabled={!anyArmed || phase !== 'idle'}
              className={`py-3.5 px-8 rounded-2xl text-sm font-black uppercase tracking-widest transition flex items-center justify-center gap-2.5 shadow-2xl ${
                anyArmed && phase === 'idle'
                  ? 'deal-btn-gold scale-105 shadow-[0_0_35px_rgba(245,158,11,0.7)] cursor-pointer'
                  : phase === 'complete'
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 cursor-default'
                    : 'bg-zinc-800 text-zinc-600 cursor-not-allowed border border-zinc-700'
              }`}
            >
              <Rocket className="w-5 h-5 shrink-0" />
              <span className="flex flex-col items-start leading-tight text-left">
                <span>
                  {phase === 'launching' ? 'CTC Delivering…' : phase === 'complete' ? 'CTC Delivered' : 'CTC Deliver'}
                </span>
                <span className="text-[9px] font-mono font-bold normal-case tracking-normal opacity-80">
                  One Click • {TYPE_LABELS[launchType]} • {STYLE_LABELS[launchStyle]} • {liveActive ? LIVE_IDS.length : 0} live / {releaseArmed ? RELEASE_IDS.length : 0} release / {postArmed ? POST_IDS.length : 0} post
                </span>
              </span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
