import React, { useState } from 'react';
import {
  X,
  Award,
  Sparkles,
  Eye,
  EyeOff,
  Share2,
  Download,
  Copy,
  Check,
  Edit3,
  ShieldCheck,
  Disc3,
  Flame,
  ExternalLink,
  Crown,
  FileCheck2,
  Code
} from 'lucide-react';
import { MilestoneAward } from '../../types';
import { PLATFORM_CONFIGS } from '../../data/mockData';
import ctcEagleDiamondImg from '../../assets/images/ctc_eagle_diamond.jpg';

interface PlaqueInspectModalProps {
  milestone: MilestoneAward | null;
  onClose: () => void;
  onToggleDisplay: (id: string) => void;
  onUpdateDedication: (id: string, name: string, dedication: string) => void;
}

export const PlaqueInspectModal: React.FC<PlaqueInspectModalProps> = ({
  milestone,
  onClose,
  onToggleDisplay,
  onUpdateDedication
}) => {
  if (!milestone) return null;

  const [isEditing, setIsEditing] = useState(false);
  const [recipientName, setRecipientName] = useState(milestone.recipientName);
  const [dedication, setDedication] = useState(milestone.customDedication || milestone.description);
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedEmbed, setCopiedEmbed] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const isGold = milestone.tier === 'gold';
  const isPlatinum = milestone.tier === 'platinum';
  const isDiamond = milestone.tier === 'diamond';

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

  const handleSaveDedication = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateDedication(milestone.id, recipientName, dedication);
    setIsEditing(false);
  };

  const handleCopyLink = () => {
    navigator.clipboard?.writeText?.(
      `https://cutthecheck.co/certifications/${milestone.certificationId}`
    );
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleCopyEmbed = () => {
    const embedCode = `<iframe src="https://cutthecheck.co/embed/plaque/${milestone.certificationId}" width="420" height="520" frameborder="0" title="${milestone.title}"></iframe>`;
    navigator.clipboard?.writeText?.(embedCode);
    setCopiedEmbed(true);
    setTimeout(() => setCopiedEmbed(false), 2500);
  };

  const handleDownloadCertificate = () => {
    const certificateText = `=====================================================
OFFICIAL DIGITAL RECORD PLAQUE CERTIFICATION
CTC CUT THE CHECK RECORDING & BROADCASTING GUILD
=====================================================
CERTIFICATE ID: ${milestone.certificationId}
ISSUED TO: ${recipientName}
MILESTONE: ${milestone.title} (${milestone.subtitle})
CERTIFICATION TIER: ${milestone.tier.toUpperCase()} CERTIFIED
DATE ISSUED: ${milestone.unlocked ? milestone.unlockedAt : 'In Progress'}
OFFICIAL DEDICATION:
"${dedication}"

VERIFIED SYNDICATED NETWORKS:
${milestone.platformsIncluded.map((p) => `- ${p.toUpperCase()}`).join('\n')}

INSIGNIA: CTC EAGLE MEDALLION CERTIFIED SEAL
VERIFICATION URL: https://cutthecheck.co/certifications/${milestone.certificationId}
=====================================================`;

    const blob = new Blob([certificateText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `CTC_Plaque_Certificate_${milestone.certificationId}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-[#090C14] border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden my-8">
        
        {/* Top Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800 bg-zinc-950/80">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full p-0.5 bg-gradient-to-tr from-amber-400 via-amber-200 to-amber-600 shadow-sm flex items-center justify-center">
              <img
                src={ctcEagleDiamondImg}
                alt="CTC Eagle Medallion"
                className="w-full h-full object-cover rounded-full"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-black text-amber-400 tracking-wider">
                  OFFICIAL CTC RECORDING PLAQUE INSPECTION
                </span>
                <span className="text-[10px] font-mono text-zinc-500">
                  {milestone.certificationId}
                </span>
              </div>
              <h3 className="text-base font-black text-white">{milestone.title}</h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Main Content: Left side Plaque render, Right side Controls & Certifications */}
        <div className="p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left: The Authentic Digital Award Plaque (Large Format) */}
          <div className="lg:col-span-6 flex flex-col items-center">
            <div
              className={`${plaqueClass} w-full max-w-sm rounded-2xl p-5 relative shadow-2xl transition-all hover:scale-[1.01]`}
            >
              {/* Corner Screws */}
              <span className="absolute top-3 left-3 w-2.5 h-2.5 rounded-full bg-gradient-to-br from-amber-200 to-amber-800 shadow-inner border border-amber-950/70" />
              <span className="absolute top-3 right-3 w-2.5 h-2.5 rounded-full bg-gradient-to-br from-amber-200 to-amber-800 shadow-inner border border-amber-950/70" />
              <span className="absolute bottom-3 left-3 w-2.5 h-2.5 rounded-full bg-gradient-to-br from-amber-200 to-amber-800 shadow-inner border border-amber-950/70" />
              <span className="absolute bottom-3 right-3 w-2.5 h-2.5 rounded-full bg-gradient-to-br from-amber-200 to-amber-800 shadow-inner border border-amber-950/70" />

              {/* Glass Glare */}
              <div className="absolute inset-0 bg-gradient-to-tr from-white/[0.04] via-transparent to-white/[0.08] pointer-events-none rounded-2xl" />

              {/* Velvet Backing */}
              <div className="plaque-velvet rounded-xl p-5 border border-zinc-800/80 flex flex-col items-center">
                
                {/* Plaque Header Badge */}
                <div className="w-full flex items-center justify-between mb-4">
                  <span
                    className={`text-[10px] font-mono font-black tracking-widest px-2.5 py-0.5 rounded shadow-sm ${
                      isDiamond
                        ? 'bg-sky-500/20 text-sky-200 border border-sky-400/40'
                        : isPlatinum
                        ? 'bg-slate-400/20 text-slate-200 border border-slate-300/40'
                        : 'bg-amber-500/20 text-amber-300 border border-amber-400/40'
                    }`}
                  >
                    {milestone.tier.toUpperCase()} CERTIFICATION
                  </span>
                  <div className="flex items-center gap-1 text-[10px] text-zinc-400 font-mono">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    <span>VERIFIED RECORD</span>
                  </div>
                </div>

                {/* Disc Centerpiece with Shimmer Grooves */}
                <div className="relative my-4 flex items-center justify-center">
                  <div
                    className={`absolute w-52 h-52 rounded-full blur-xl opacity-35 ${
                      isDiamond
                        ? 'bg-sky-400'
                        : isPlatinum
                        ? 'bg-slate-300'
                        : 'bg-amber-400'
                    }`}
                  />

                  <div
                    className={`relative w-44 h-44 rounded-full grooved-record-disc border-4 ${
                      isDiamond
                        ? 'border-sky-300 shadow-[0_0_30px_rgba(56,189,248,0.5)]'
                        : isPlatinum
                        ? 'border-slate-300 shadow-[0_0_25px_rgba(203,213,225,0.4)]'
                        : 'border-amber-400 shadow-[0_0_30px_rgba(245,158,11,0.5)]'
                    } flex items-center justify-center`}
                  >
                    {/* Disc Sheen */}
                    <div
                      className={`absolute inset-0 rounded-full bg-gradient-to-tr ${discShineClass} opacity-25 pointer-events-none mix-blend-overlay`}
                    />

                    {/* Grooved Inset */}
                    <div className="w-32 h-32 rounded-full border border-zinc-700/60 flex items-center justify-center">
                      <div className="w-22 h-22 rounded-full border border-zinc-700/40 flex items-center justify-center">
                        <div
                          className={`w-16 h-16 rounded-full p-0.5 shadow-lg border-2 ${
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
                          <div className="absolute w-2.5 h-2.5 bg-[#0A0D15] rounded-full border border-zinc-500 shadow-inner z-10" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Commemorative Inscribed Nameplate */}
                <div
                  className={`${plateClass} w-full rounded-lg p-3 text-center my-3 relative shadow-md`}
                >
                  <span className="absolute top-1 left-1 w-1 h-1 rounded-full bg-black/40" />
                  <span className="absolute top-1 right-1 w-1 h-1 rounded-full bg-black/40" />
                  <span className="absolute bottom-1 left-1 w-1 h-1 rounded-full bg-black/40" />
                  <span className="absolute bottom-1 right-1 w-1 h-1 rounded-full bg-black/40" />

                  <p className="text-[10px] uppercase tracking-widest font-black opacity-80">
                    PRESENTED TO
                  </p>
                  <h4 className="text-sm font-black tracking-wide uppercase truncate">
                    {recipientName}
                  </h4>
                  <p className="text-xs font-bold mt-1 opacity-90 italic">
                    "{dedication}"
                  </p>
                  <div className="mt-2 pt-1.5 border-t border-black/20 flex items-center justify-between text-[9px] font-mono uppercase tracking-wider font-semibold opacity-75">
                    <span>{milestone.certificationId}</span>
                    <span>{milestone.unlocked ? milestone.unlockedAt : 'EST. 2026'}</span>
                  </div>
                </div>

                {/* Platforms Icons Footer */}
                <div className="w-full flex items-center justify-between text-[11px] text-zinc-400 pt-1">
                  <span className="font-mono">{milestone.metricLabel}: {milestone.currentValue.toLocaleString()} {milestone.unit}</span>
                  <div className="flex items-center -space-x-1">
                    {milestone.platformsIncluded.map((pid) => {
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
                  </div>
                </div>

              </div>
            </div>

            {/* Quick Status Pill */}
            <div className="mt-4 flex items-center gap-2">
              <span
                className={`text-xs font-bold px-3 py-1 rounded-full border ${
                  milestone.isDisplayedOnProfile
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                    : 'bg-zinc-800 text-zinc-400 border-zinc-700'
                }`}
              >
                {milestone.isDisplayedOnProfile
                  ? '🌟 Displayed on Creator Profile Trophy Case'
                  : '📦 Vaulted in Creator Archives'}
              </span>
            </div>
          </div>

          {/* Right: Management Controls, Inscription Customizer & Sharing */}
          <div className="lg:col-span-6 space-y-5">
            
            {/* Action 1: Mount on Profile Toggle */}
            <div className="p-4 rounded-xl bg-zinc-900/90 border border-zinc-800">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-white flex items-center gap-2">
                    <Eye className="w-4 h-4 text-emerald-400" />
                    <span>Display on Profile Trophy Case</span>
                  </h4>
                  <p className="text-xs text-zinc-400 mt-0.5">
                    Mount this plaque prominently on your public creator profile and media kit.
                  </p>
                </div>
                <button
                  onClick={() => onToggleDisplay(milestone.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-sm ${
                    milestone.isDisplayedOnProfile
                      ? 'deal-btn-platinum'
                      : 'deal-btn-gold'
                  }`}
                >
                  {milestone.isDisplayedOnProfile ? (
                    <>
                      <EyeOff className="w-3.5 h-3.5 text-slate-900" />
                      <span>CTC Unmount Plaque</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3.5 h-3.5 text-amber-950" />
                      <span>CTC Mount to Profile</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Action 2: Personalize Commemorative Inscription */}
            <div className="p-4 rounded-xl bg-zinc-900/90 border border-zinc-800">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Edit3 className="w-4 h-4 text-amber-400" />
                  <h4 className="text-sm font-bold text-white">
                    Personalize Inscribed Metal Nameplate
                  </h4>
                </div>
                {!isEditing && (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="text-xs text-amber-400 hover:text-amber-300 font-semibold"
                  >
                    CTC Edit Inscription
                  </button>
                )}
              </div>

              {isEditing ? (
                <form onSubmit={handleSaveDedication} className="space-y-3">
                  <div>
                    <label className="text-xs text-zinc-400 font-semibold block mb-1">
                      Recipient / Artist Moniker:
                    </label>
                    <input
                      type="text"
                      value={recipientName}
                      onChange={(e) => setRecipientName(e.target.value)}
                      className="w-full px-3 py-1.5 text-xs rounded-lg bg-zinc-800 border border-zinc-700 text-white focus:outline-none focus:border-amber-400 font-mono"
                      placeholder="e.g. Alex Rivers / CTC Records"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-zinc-400 font-semibold block mb-1">
                      Commemorative Dedication Text:
                    </label>
                    <input
                      type="text"
                      value={dedication}
                      onChange={(e) => setDedication(e.target.value)}
                      className="w-full px-3 py-1.5 text-xs rounded-lg bg-zinc-800 border border-zinc-700 text-white focus:outline-none focus:border-amber-400"
                      placeholder="e.g. In recognition of 1M streams..."
                    />
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => {
                        setRecipientName(milestone.recipientName);
                        setDedication(milestone.customDedication || milestone.description);
                        setIsEditing(false);
                      }}
                      className="px-3 py-1.5 text-xs rounded-lg text-zinc-400 hover:text-white"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="deal-btn-gold px-4 py-1.5 text-xs rounded-lg font-bold"
                    >
                      CTC Apply Inscription
                    </button>
                  </div>
                </form>
              ) : (
                <div className="text-xs text-zinc-300 space-y-1 bg-black/40 p-3 rounded-lg border border-zinc-800 font-mono">
                  <p><span className="text-zinc-500">Recipient:</span> {recipientName}</p>
                  <p><span className="text-zinc-500">Dedication:</span> "{dedication}"</p>
                </div>
              )}
            </div>

            {/* Action 3: Verification & Distribution Specs */}
            <div className="p-4 rounded-xl bg-zinc-900/90 border border-zinc-800 space-y-3">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <FileCheck2 className="w-4 h-4 text-sky-400" />
                <span>RIAA/CTC Digital Record Ledger</span>
              </h4>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 rounded-lg bg-black/40 border border-zinc-800">
                  <span className="text-[10px] text-zinc-500 uppercase font-mono block">Serial ID</span>
                  <span className="font-mono text-zinc-200 font-bold">{milestone.certificationId}</span>
                </div>
                <div className="p-2.5 rounded-lg bg-black/40 border border-zinc-800">
                  <span className="text-[10px] text-zinc-500 uppercase font-mono block">Certification Date</span>
                  <span className="font-mono text-zinc-200 font-bold">{milestone.unlocked ? milestone.unlockedAt : 'Pending Goal'}</span>
                </div>
                <div className="p-2.5 rounded-lg bg-black/40 border border-zinc-800">
                  <span className="text-[10px] text-zinc-500 uppercase font-mono block">Audited Metric</span>
                  <span className="font-mono text-amber-300 font-bold">{milestone.currentValue.toLocaleString()} {milestone.unit}</span>
                </div>
                <div className="p-2.5 rounded-lg bg-black/40 border border-zinc-800">
                  <span className="text-[10px] text-zinc-500 uppercase font-mono block">Authenticity</span>
                  <span className="font-mono text-emerald-400 font-bold">100% Cryptographic Seal</span>
                </div>
              </div>

              {/* Share & Export Buttons */}
              <div className="flex flex-wrap items-center gap-2 pt-2">
                <button
                  onClick={handleCopyLink}
                  className="flex-1 py-2 px-3 rounded-lg text-xs font-semibold bg-zinc-800 hover:bg-zinc-700 text-white transition flex items-center justify-center gap-1.5"
                >
                  {copiedLink ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Copied Verification Link!</span>
                    </>
                  ) : (
                    <>
                      <Share2 className="w-3.5 h-3.5 text-zinc-300" />
                      <span>CTC Share Certified Link</span>
                    </>
                  )}
                </button>

                <button
                  onClick={handleCopyEmbed}
                  className="flex-1 py-2 px-3 rounded-lg text-xs font-semibold bg-zinc-800 hover:bg-zinc-700 text-white transition flex items-center justify-center gap-1.5"
                >
                  {copiedEmbed ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Copied Plaque Embed!</span>
                    </>
                  ) : (
                    <>
                      <Code className="w-3.5 h-3.5 text-sky-400" />
                      <span>CTC Embed on Website</span>
                    </>
                  )}
                </button>

                <button
                  onClick={handleDownloadCertificate}
                  className="w-full py-2 px-3 rounded-lg text-xs font-bold bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 transition flex items-center justify-center gap-1.5"
                >
                  {downloadSuccess ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Certificate Downloaded!</span>
                    </>
                  ) : (
                    <>
                      <Download className="w-3.5 h-3.5 text-amber-400" />
                      <span>CTC Download Commemorative Certificate (.txt)</span>
                    </>
                  )}
                </button>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};
