import React from 'react';
import {
  Award,
  Sparkles,
  Eye,
  EyeOff,
  CheckCircle2,
  Lock,
  Share2,
  Maximize2,
  Disc3,
  Flame,
  ShieldCheck,
  TrendingUp,
  Radio,
  ExternalLink
} from 'lucide-react';
import { MilestoneAward, PlatformId } from '../../types';
import { PLATFORM_CONFIGS } from '../../data/mockData';
import ctcEagleDiamondImg from '../../assets/images/ctc_eagle_diamond.jpg';

interface PlaqueCardProps {
  milestone: MilestoneAward;
  onToggleDisplay: (id: string) => void;
  onInspect: (milestone: MilestoneAward) => void;
  onClaim?: (milestone: MilestoneAward) => void;
  compact?: boolean;
}

export const PlaqueCard: React.FC<PlaqueCardProps> = ({
  milestone,
  onToggleDisplay,
  onInspect,
  onClaim,
  compact = false
}) => {
  const isGold = milestone.tier === 'gold';
  const isPlatinum = milestone.tier === 'platinum';
  const isDiamond = milestone.tier === 'diamond';

  const progressPercent = Math.min(
    100,
    Math.round((milestone.currentValue / milestone.targetValue) * 100)
  );

  const canClaim = !milestone.unlocked && progressPercent >= 100;

  // Frame CSS classes
  const plaqueClass = isDiamond
    ? 'plaque-diamond'
    : isPlatinum
    ? 'plaque-platinum'
    : 'plaque-gold';

  const plateClass = isDiamond
    ? 'engraved-plate-platinum'
    : isPlatinum
    ? 'engraved-plate-platinum'
    : 'engraved-plate-gold';

  const textGradient = isDiamond
    ? 'text-diamond-gradient'
    : isPlatinum
    ? 'text-platinum-gradient'
    : 'text-gold-gradient';

  const discShineClass = isDiamond
    ? 'from-cyan-200 via-sky-400 to-indigo-300'
    : isPlatinum
    ? 'from-slate-100 via-slate-300 to-zinc-400'
    : 'from-amber-200 via-yellow-400 to-amber-600';

  return (
    <div
      className={`${plaqueClass} relative rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1 group flex flex-col justify-between ${
        compact ? 'p-3' : 'p-4 sm:p-5'
      }`}
    >
      {/* 4 Corner Brass/Steel Industrial Mounting Studs */}
      <span className="absolute top-2 left-2 w-2 h-2 rounded-full bg-gradient-to-br from-amber-200 to-amber-800 shadow-inner border border-amber-950/60 pointer-events-none z-20" />
      <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-gradient-to-br from-amber-200 to-amber-800 shadow-inner border border-amber-950/60 pointer-events-none z-20" />
      <span className="absolute bottom-2 left-2 w-2 h-2 rounded-full bg-gradient-to-br from-amber-200 to-amber-800 shadow-inner border border-amber-950/60 pointer-events-none z-20" />
      <span className="absolute bottom-2 right-2 w-2 h-2 rounded-full bg-gradient-to-br from-amber-200 to-amber-800 shadow-inner border border-amber-950/60 pointer-events-none z-20" />

      {/* Glass Glare Sheen Overlay */}
      <div className="absolute inset-0 bg-gradient-to-tr from-white/[0.03] via-transparent to-white/[0.08] pointer-events-none z-10" />

      {/* Inner Smoked Velvet Mount Box */}
      <div className="plaque-velvet rounded-xl p-3 sm:p-4 border border-zinc-800/80 flex flex-col items-center relative overflow-hidden flex-1">
        
        {/* Plaque Header / Official Seal & Badge */}
        <div className="w-full flex items-center justify-between gap-2 mb-3 relative z-10">
          <div className="flex items-center gap-1.5">
            <span
              className={`text-[9px] uppercase font-mono font-black tracking-widest px-2 py-0.5 rounded shadow-sm ${
                isDiamond
                  ? 'bg-sky-500/20 text-sky-200 border border-sky-400/40'
                  : isPlatinum
                  ? 'bg-slate-400/20 text-slate-200 border border-slate-300/40'
                  : 'bg-amber-500/20 text-amber-300 border border-amber-400/40'
              }`}
            >
              {isDiamond ? '💎 RIAA DIAMOND' : isPlatinum ? '💿 PLATINUM' : '🏆 GOLD'} CERTIFIED
            </span>
            {milestone.unlocked && (
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_#34D399]" />
            )}
          </div>

          {/* Profile Display Status Pin */}
          {milestone.unlocked ? (
            <button
              onClick={() => onToggleDisplay(milestone.id)}
              className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold transition border ${
                milestone.isDisplayedOnProfile
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                  : 'bg-zinc-800/80 text-zinc-400 border-zinc-700 hover:text-white'
              }`}
              title={
                milestone.isDisplayedOnProfile
                  ? 'Currently mounted on your public creator profile trophy case'
                  : 'Vaulted in private collection (click to mount on profile)'
              }
            >
              {milestone.isDisplayedOnProfile ? (
                <>
                  <Eye className="w-2.5 h-2.5 text-emerald-400" />
                  <span className="hidden sm:inline">On Profile</span>
                </>
              ) : (
                <>
                  <EyeOff className="w-2.5 h-2.5 text-zinc-400" />
                  <span className="hidden sm:inline">CTC Mount Plaque</span>
                </>
              )}
            </button>
          ) : (
            <span className="flex items-center gap-1 text-[10px] font-mono font-bold text-amber-400/90 bg-amber-950/40 px-2 py-0.5 rounded-full border border-amber-800/40">
              <Lock className="w-2.5 h-2.5" />
              <span>{progressPercent}%</span>
            </span>
          )}
        </div>

        {/* Realistic Vinyl / Optical Record Plaque Centerpiece */}
        <div className="relative my-2 sm:my-3 flex items-center justify-center">
          {/* Subtle Outer Glow */}
          <div
            className={`absolute w-36 h-36 sm:w-44 sm:h-44 rounded-full blur-xl opacity-30 ${
              isDiamond
                ? 'bg-sky-400'
                : isPlatinum
                ? 'bg-slate-300'
                : 'bg-amber-400'
            }`}
          />

          {/* Record Disc Container */}
          <div
            className={`relative w-32 h-32 sm:w-40 sm:h-40 rounded-full grooved-record-disc border-4 ${
              isDiamond
                ? 'border-sky-300 shadow-[0_0_25px_rgba(56,189,248,0.4)]'
                : isPlatinum
                ? 'border-slate-300 shadow-[0_0_20px_rgba(203,213,225,0.35)]'
                : 'border-amber-400 shadow-[0_0_25px_rgba(245,158,11,0.4)]'
            } flex items-center justify-center transition-transform duration-700 group-hover:rotate-12`}
          >
            {/* Holographic Luster Beams */}
            <div
              className={`absolute inset-0 rounded-full bg-gradient-to-tr ${discShineClass} opacity-20 pointer-events-none mix-blend-overlay`}
            />

            {/* Inner Vinyl Grooves Ring */}
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full border border-zinc-700/60 flex items-center justify-center">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border border-zinc-700/40 flex items-center justify-center">
                
                {/* Center Record Label with Official CTC Eagle Medallion */}
                <div
                  className={`w-12 h-12 sm:w-14 sm:h-14 rounded-full p-0.5 shadow-lg border-2 ${
                    isDiamond
                      ? 'border-sky-200 bg-gradient-to-tr from-sky-400 to-indigo-600'
                      : isPlatinum
                      ? 'border-white bg-gradient-to-tr from-slate-300 to-slate-700'
                      : 'border-amber-200 bg-gradient-to-tr from-amber-400 to-amber-700'
                  } flex items-center justify-center relative overflow-hidden`}
                >
                  <img
                    src={ctcEagleDiamondImg}
                    alt="CTC Eagle Medallion"
                    className="w-full h-full object-cover rounded-full filter contrast-125"
                  />
                  {/* Spindle hole */}
                  <div className="absolute w-2 h-2 bg-[#0A0D15] rounded-full border border-zinc-500 shadow-inner z-10" />
                </div>

              </div>
            </div>

            {/* Locked Padlock Watermark if In Progress */}
            {!milestone.unlocked && (
              <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] rounded-full flex flex-col items-center justify-center text-center p-2 z-10">
                <Lock className="w-6 h-6 text-amber-400 mb-1" />
                <span className="text-[10px] font-mono font-bold text-white uppercase tracking-wider">
                  In Progress
                </span>
                <span className="text-[9px] text-zinc-300 font-mono">
                  {milestone.currentValue.toLocaleString()} / {milestone.targetValue.toLocaleString()}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Official Commemorative Inscribed Plate */}
        <div
          className={`${plateClass} w-full rounded-lg p-2.5 sm:p-3 text-center my-2 relative shadow-md`}
        >
          {/* Plate Corner Mini Screws */}
          <span className="absolute top-1 left-1 w-1 h-1 rounded-full bg-black/40" />
          <span className="absolute top-1 right-1 w-1 h-1 rounded-full bg-black/40" />
          <span className="absolute bottom-1 left-1 w-1 h-1 rounded-full bg-black/40" />
          <span className="absolute bottom-1 right-1 w-1 h-1 rounded-full bg-black/40" />

          <p className="text-[9px] uppercase tracking-widest font-black opacity-80 mb-0.5">
            PRESENTED TO
          </p>
          <h4 className="text-xs sm:text-sm font-black tracking-wide uppercase truncate px-1">
            {milestone.recipientName}
          </h4>
          <p className="text-[10px] font-bold mt-1 line-clamp-1 opacity-90 italic">
            "{milestone.customDedication || milestone.description}"
          </p>
          <div className="mt-1.5 pt-1 border-t border-black/20 flex items-center justify-between text-[8px] font-mono uppercase tracking-wider font-semibold opacity-75">
            <span>{milestone.certificationId}</span>
            <span>{milestone.unlocked ? milestone.unlockedAt : 'EST. 2026'}</span>
          </div>
        </div>

        {/* Supported Platforms / DSPs Icons Strip */}
        <div className="w-full flex items-center justify-between gap-1 pt-1 text-[10px] text-zinc-400">
          <span className="text-[10px] font-medium text-zinc-400 truncate">
            {milestone.title}
          </span>
          <div className="flex items-center -space-x-1 flex-shrink-0">
            {milestone.platformsIncluded.slice(0, 4).map((pid) => {
              const cfg = PLATFORM_CONFIGS[pid];
              return (
                <span
                  key={pid}
                  className="w-4 h-4 rounded-full border border-black flex items-center justify-center text-[8px] font-bold text-white shadow-xs"
                  style={{ backgroundColor: cfg?.color || '#333' }}
                  title={cfg?.name || pid}
                >
                  {cfg?.name?.charAt(0) || '•'}
                </span>
              );
            })}
            {milestone.platformsIncluded.length > 4 && (
              <span className="w-4 h-4 rounded-full bg-zinc-800 border border-black flex items-center justify-center text-[7px] text-zinc-300 font-bold">
                +{milestone.platformsIncluded.length - 4}
              </span>
            )}
          </div>
        </div>

        {/* Progress Bar for Locked Plaques */}
        {!milestone.unlocked && (
          <div className="w-full mt-2.5">
            <div className="flex items-center justify-between text-[10px] font-mono text-zinc-400 mb-1">
              <span>Progress toward certification</span>
              <span className="text-amber-300 font-bold">{progressPercent}%</span>
            </div>
            <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden border border-zinc-700/60">
              <div
                className="h-full bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-300 rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        )}

      </div>

      {/* Interactive Plaque Actions Bar */}
      <div className="mt-3 flex items-center gap-2 pt-2 border-t border-zinc-800/60 relative z-20">
        <button
          onClick={() => onInspect(milestone)}
          className="flex-1 py-1.5 px-2.5 rounded-lg text-xs font-bold bg-zinc-900/90 hover:bg-zinc-800 text-zinc-200 border border-zinc-700/80 hover:border-zinc-500 transition flex items-center justify-center gap-1.5 shadow-sm"
        >
          <Maximize2 className="w-3.5 h-3.5 text-amber-400" />
          <span>CTC Inspect Plaque</span>
        </button>

        {milestone.unlocked ? (
          <button
            onClick={() => onToggleDisplay(milestone.id)}
            className={`py-1.5 px-2.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 shadow-sm ${
              milestone.isDisplayedOnProfile
                ? 'deal-btn-platinum'
                : 'deal-btn-gold'
            }`}
            title="Toggle displaying this digital plaque on your public profile trophy case"
          >
            {milestone.isDisplayedOnProfile ? (
              <>
                <Eye className="w-3.5 h-3.5 text-slate-900" />
                <span className="hidden sm:inline">CTC Mounted</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5 text-amber-950" />
                <span>CTC Mount</span>
              </>
            )}
          </button>
        ) : canClaim && onClaim ? (
          <button
            onClick={() => onClaim(milestone)}
            className="deal-btn-gold py-1.5 px-3 rounded-lg text-xs font-black animate-pulse flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-950" />
            <span>CTC Claim Award!</span>
          </button>
        ) : null}
      </div>
    </div>
  );
};
