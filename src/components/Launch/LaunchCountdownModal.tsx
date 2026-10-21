import React, { useState, useEffect } from 'react';
import {
  Rocket,
  CheckCircle2,
  Radio,
  Sparkles,
  ShieldCheck,
  Disc3,
  Award,
  Crown,
  Volume2,
  X,
  Building2,
  Briefcase,
  Feather,
  Flame,
  CheckCheck,
  Music
} from 'lucide-react';
import ctcEagleDiamondImg from '../../assets/images/ctc_eagle_diamond.jpg';
import majorLabelOfficeImg from '../../assets/images/major_label_office.jpg';

interface LaunchCountdownModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLaunchComplete: () => void;
  missionName: string;
  selectedPlatformsCount: number;
}

export const LaunchCountdownModal: React.FC<LaunchCountdownModalProps> = ({
  isOpen,
  onClose,
  onLaunchComplete,
  missionName,
  selectedPlatformsCount
}) => {
  const [countdown, setCountdown] = useState(10);
  const [stage, setStage] = useState('Verifying Executive Permission & A&R Master...');
  const [isLaunched, setIsLaunched] = useState(false);

  // Play audio chimes during countdown
  const playCountdownTone = (freq: number) => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(0.06, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.3);
    } catch (e) {}
  };

  useEffect(() => {
    if (!isOpen) {
      setCountdown(10);
      setIsLaunched(false);
      setStage('Verifying Executive Permission & A&R Master...');
      return;
    }

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setIsLaunched(true);
          onLaunchComplete();
          // Major chord celebratory chime
          [523.25, 659.25, 783.99, 1046.50, 1318.51].forEach((f, i) => {
            setTimeout(() => playCountdownTone(f), i * 90);
          });
          return 0;
        }

        const nextVal = prev - 1;
        playCountdownTone(440 + (10 - nextVal) * 35);

        if (nextVal > 7) setStage('A&R Clearance Verified: 96kHz Lossless Masters Ingesting...');
        else if (nextVal > 5) setStage(`Firing ${selectedPlatformsCount} Syndicated DSP & Live Satellite Relays...`);
        else if (nextVal > 3) setStage('Locking Escrow Smart Contracts • 100% Master Ownership Sealed...');
        else if (nextVal > 1) setStage('Billboard & DSP Editorial Wire Primed • Immediate Rollout...');
        else setStage('EXECUTIVE LAUNCH IMMINENT • BROADCAST IGNITING WORLDWIDE...');

        return nextVal;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen, selectedPlatformsCount]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/95 backdrop-blur-2xl animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl executive-leather-desk rounded-3xl border-2 border-amber-400/80 shadow-[0_25px_80px_rgba(245,158,11,0.25)] text-center overflow-hidden">
        
        {/* Major Label Executive Penthouse Corner Office Background Texture */}
        <div className="absolute inset-0 z-0 pointer-events-none opacity-20">
          <img
            src={majorLabelOfficeImg}
            alt="Boardroom"
            className="w-full h-full object-cover filter blur-[2px]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#06080E] via-[#06080E]/80 to-[#06080E]/60" />
        </div>

        {/* Ambient Grooved Gold Disc in Background */}
        <div className="absolute -right-24 -bottom-24 w-80 h-80 rounded-full grooved-record-disc opacity-25 pointer-events-none" />
        <div className="absolute -left-24 -top-24 w-80 h-80 rounded-full grooved-record-disc opacity-25 pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-zinc-400 hover:text-white rounded-xl hover:bg-zinc-800/80 transition z-20 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="relative z-10 p-6 sm:p-10">
          {/* Executive Medallion Header */}
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="relative w-16 h-16 rounded-full p-1 bg-gradient-to-tr from-amber-400 via-amber-200 to-amber-600 shadow-2xl flex items-center justify-center">
              <img
                src={ctcEagleDiamondImg}
                alt="CTC Eagle Medallion"
                className="w-full h-full object-cover rounded-full"
              />
              {countdown > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 animate-ping" />
              )}
            </div>

            <div className="text-left">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/20 border border-amber-400/40 text-[10px] font-mono font-black text-amber-300 uppercase">
                <Building2 className="w-3 h-3" />
                <span>MAJOR LABEL C-SUITE BOARDROOM</span>
              </div>
              <h2 className="text-sm font-bold text-white tracking-wide uppercase">
                Cut The Check Executive Release Chamber
              </h2>
            </div>
          </div>

          {!isLaunched ? (
            <div>
              {/* Executive Order Clearance Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-950/80 border border-emerald-500/60 text-emerald-300 text-xs font-mono font-bold shadow-md mb-4">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>EXECUTIVE CLEARANCE SEALED: "PERMISSION GRANTED BY LABEL HEAD"</span>
              </div>

              <h3 className="text-xl sm:text-2xl font-black text-white tracking-wide uppercase font-mono">
                {missionName}
              </h3>

              {/* Giant Gold Countdown Display */}
              <div className="my-6 p-6 rounded-2xl bg-black/60 border border-amber-500/30 shadow-inner">
                <div className="text-6xl sm:text-7xl font-black font-mono text-gold-gradient tracking-tight drop-shadow-[0_4px_16px_rgba(245,158,11,0.7)]">
                  T-{countdown}s
                </div>
                <p className="text-xs sm:text-sm font-mono font-bold text-amber-300 mt-3 uppercase tracking-wider animate-pulse">
                  {stage}
                </p>
              </div>

              {/* Major Label Release Department Progression Pills */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 my-5 text-left font-mono">
                {[
                  { label: 'A&R Master Delivery', pass: countdown <= 8 },
                  { label: 'DSP Satellite Uplink', pass: countdown <= 6 },
                  { label: 'Smart Escrow Lock', pass: countdown <= 4 },
                  { label: 'Billboard Wire Active', pass: countdown <= 2 }
                ].map((s, idx) => (
                  <div
                    key={idx}
                    className={`p-2.5 rounded-xl border text-center transition ${
                      s.pass
                        ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.2)]'
                        : 'bg-zinc-950/80 border-zinc-800 text-zinc-500'
                    }`}
                  >
                    <span className="text-[10px] font-black uppercase block">{s.label}</span>
                    <span className="text-[9px] font-bold">{s.pass ? '✓ CLEARED' : 'PENDING'}</span>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between text-[11px] text-zinc-400 font-mono px-2">
                <span>Ingest: <strong className="text-purple-300">rtmp://live.omnicast.io/relay/app</strong></span>
                <span>Destinations: <strong className="text-amber-300">{selectedPlatformsCount} Syndicated Networks</strong></span>
              </div>
            </div>
          ) : (
            /* Major Label Launch Celebration */
            <div className="space-y-5 animate-in zoom-in-95 duration-300">
              <div className="inline-block gold-wax-seal text-[11px] uppercase font-black tracking-widest px-4 py-1.5 rounded-full shadow-xl text-amber-950">
                🥂 WORLDWIDE LAUNCH COMMENCED • CHAMPAGNE UNCORKED
              </div>

              <h3 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-wide uppercase text-diamond-gradient">
                ALL 47 NETWORKS LIVE & MONETIZING
              </h3>

              <p className="text-xs sm:text-sm text-amber-200 font-mono max-w-lg mx-auto">
                Official transmission initialized from the 54th Floor Executive Boardroom. Your lossless release and 1080p60 multi-live relay are now live globally.
              </p>

              {/* Major Label Dossier Output Summary */}
              <div className="p-5 rounded-2xl bg-black/75 border border-amber-500/40 text-left text-xs font-mono space-y-2.5 my-4 shadow-2xl">
                <div className="flex justify-between items-center border-b border-zinc-800 pb-2">
                  <span className="text-zinc-400">Release Designation:</span>
                  <span className="font-bold text-white truncate max-w-xs">{missionName}</span>
                </div>
                <div className="flex justify-between items-center border-b border-zinc-800 pb-2">
                  <span className="text-zinc-400">Executive Authorization:</span>
                  <span className="font-bold text-emerald-400">Signed: "Permission Granted by Label Head"</span>
                </div>
                <div className="flex justify-between items-center border-b border-zinc-800 pb-2">
                  <span className="text-zinc-400">DSP Audio Ingest:</span>
                  <span className="font-bold text-amber-300">Spotify • Apple Music • Amazon • SoundCloud</span>
                </div>
                <div className="flex justify-between items-center border-b border-zinc-800 pb-2">
                  <span className="text-zinc-400">Simulcast Video Ingest:</span>
                  <span className="font-bold text-purple-300">rtmp://live.omnicast.io/relay/app (1080p60)</span>
                </div>
                <div className="flex justify-between items-center pt-1">
                  <span className="text-zinc-400">Direct Royalty Escrow:</span>
                  <span className="font-black text-emerald-400 text-sm">$50,280.00 • 100% Retained</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                <button
                  onClick={onClose}
                  className="w-full sm:w-auto deal-btn-gold px-8 py-3 rounded-2xl text-xs font-black uppercase tracking-wider shadow-2xl cursor-pointer"
                >
                  Enter Executive Mission Control →
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
