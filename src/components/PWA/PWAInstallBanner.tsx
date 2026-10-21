import React, { useState, useEffect } from 'react';
import {
  Download,
  Share,
  PlusSquare,
  X,
  Sparkles,
  Smartphone,
  CheckCircle2,
  Copy,
  Laptop,
  Check,
  ShieldCheck,
  Crown,
  ExternalLink
} from 'lucide-react';
import { usePWAInstall } from '../../hooks/usePWAInstall';
import ctcEagleDiamondImg from '../../assets/images/ctc_eagle_diamond.jpg';

type DeviceTab = 'ios' | 'android' | 'desktop';

export const PWAInstallBanner: React.FC = () => {
  const { isInstallable, isInstalled, isIOS, isMobile, install } = usePWAInstall();
  const [isDismissed, setIsDismissed] = useState(() => {
    return sessionStorage.getItem('ctc_pwa_banner_dismissed') === 'true';
  });
  const [showModal, setShowModal] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [activeTab, setActiveTab] = useState<DeviceTab>(() => {
    if (isIOS) return 'ios';
    if (isMobile) return 'android';
    return 'android';
  });

  // Listen for global custom event to trigger modal or banner on demand
  useEffect(() => {
    const handleOpenRequest = () => {
      setShowModal(true);
    };
    window.addEventListener('open-pwa-install', handleOpenRequest);
    return () => {
      window.removeEventListener('open-pwa-install', handleOpenRequest);
    };
  }, []);

  const handleDismiss = () => {
    setIsDismissed(true);
    sessionStorage.setItem('ctc_pwa_banner_dismissed', 'true');
  };

  const handleInstallClick = async () => {
    if (isInstallable) {
      const success = await install();
      if (!success) {
        setShowModal(true);
      }
    } else {
      setShowModal(true);
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.origin);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  return (
    <>
      {/* Floating Bottom PWA Install Banner (shown if not installed and not dismissed) */}
      {!isInstalled && !isDismissed && (
        <aside
          aria-label="App installation banner"
          className="fixed bottom-4 left-4 right-4 md:left-auto md:right-6 md:max-w-md z-40 plaque-gold p-4 rounded-2xl shadow-2xl border-2 border-amber-400/90 backdrop-blur-xl animate-in slide-in-from-bottom-5 duration-300"
        >
          {/* Glass reflection sheen */}
          <div className="absolute inset-0 bg-gradient-to-tr from-white/[0.04] via-transparent to-white/[0.08] pointer-events-none rounded-2xl" />

          <div className="relative z-10 flex items-start justify-between gap-3">
            {/* App Icon with Gold Medallion */}
            <div className="relative shrink-0">
              <div className="w-12 h-12 rounded-xl overflow-hidden p-0.5 bg-gradient-to-tr from-amber-400 via-amber-200 to-amber-600 shadow-md flex items-center justify-center">
                <img
                  src={ctcEagleDiamondImg}
                  alt="CTC Eagle Medallion"
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>
              <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border border-black flex items-center justify-center shadow-xs">
                <Sparkles className="w-2.5 h-2.5 text-black" />
              </span>
            </div>

            {/* Banner Copy */}
            <div className="flex-1 min-w-0 pr-1">
              <div className="flex items-center gap-1.5 flex-wrap">
                <h4 className="text-xs sm:text-sm font-black text-white tracking-wide uppercase truncate">
                  Cut The Check
                </h4>
                <span className="engraved-plate-gold text-[8px] font-black uppercase px-1.5 py-0.2 rounded shadow-xs">
                  OFFICIAL APP
                </span>
              </div>
              <p className="text-[11px] text-amber-200/90 mt-0.5 leading-snug">
                Add to Home Screen for native 60fps multistreaming, zero URL bar, and instant escrow access.
              </p>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 mt-2.5">
                <button
                  onClick={handleInstallClick}
                  className="deal-btn-gold py-1.5 px-3.5 rounded-lg text-xs font-black shadow-md flex items-center gap-1.5 transition active:scale-95 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5 text-amber-950" />
                  <span>CTC Install</span>
                </button>

                <button
                  onClick={handleDismiss}
                  className="text-[11px] font-semibold text-zinc-400 hover:text-white px-2 py-1 rounded transition cursor-pointer"
                >
                  Later
                </button>
              </div>
            </div>

            {/* Close X Button */}
            <button
              onClick={handleDismiss}
              className="p-1 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800/80 transition shrink-0 cursor-pointer"
              title="Dismiss banner"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </aside>
      )}

      {/* Guided Modal for Add to Home Screen Instructions */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
          <div className="plaque-gold w-full max-w-md p-6 rounded-3xl border-2 border-amber-400 shadow-2xl relative">
            {/* Close Button */}
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 p-1.5 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800 transition cursor-pointer"
              title="Close guide"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Medallion Avatar */}
            <div className="text-center">
              <div className="w-16 h-16 rounded-2xl mx-auto mb-3 p-1 bg-gradient-to-tr from-amber-400 via-amber-200 to-amber-600 shadow-xl flex items-center justify-center">
                <img
                  src={ctcEagleDiamondImg}
                  alt="CTC Eagle"
                  className="w-full h-full object-cover rounded-xl"
                />
              </div>

              <div className="inline-block engraved-plate-gold text-[9px] uppercase font-black tracking-widest px-2.5 py-0.5 rounded shadow-sm mb-2">
                NATIVE MOBILE APP INSTALLATION
              </div>

              <h3 className="text-lg font-black text-white">
                Add Cut The Check to Home Screen
              </h3>
              <p className="text-xs text-amber-200/80 mt-1 max-w-sm mx-auto">
                Launch directly from your phone’s home screen with zero browser bars, instant push alerts, and 60fps livestream performance.
              </p>
            </div>

            {/* Device Tabs */}
            <div className="flex items-center justify-center gap-1.5 my-4 bg-black/40 p-1 rounded-xl border border-amber-500/20">
              <button
                onClick={() => setActiveTab('ios')}
                className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                  activeTab === 'ios'
                    ? 'bg-amber-400 text-amber-950 shadow-sm font-black'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>iPhone / iPad</span>
              </button>
              <button
                onClick={() => setActiveTab('android')}
                className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                  activeTab === 'android'
                    ? 'bg-amber-400 text-amber-950 shadow-sm font-black'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>Android</span>
              </button>
              <button
                onClick={() => setActiveTab('desktop')}
                className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                  activeTab === 'desktop'
                    ? 'bg-amber-400 text-amber-950 shadow-sm font-black'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                <Laptop className="w-3.5 h-3.5" />
                <span>Mac / PC</span>
              </button>
            </div>

            {/* Step-by-Step Instructions by Platform */}
            <div className="space-y-3 text-left text-xs bg-black/60 p-4 rounded-xl border border-amber-500/30 font-medium text-zinc-200 mb-4">
              {activeTab === 'ios' && (
                <>
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-amber-400/20 text-amber-300 font-mono font-bold flex items-center justify-center shrink-0 border border-amber-400/30">
                      1
                    </span>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span>Open in <strong>Safari</strong> and tap the</span>
                      <span className="px-1.5 py-0.5 rounded bg-zinc-800 text-sky-400 font-bold inline-flex items-center gap-1 border border-zinc-700">
                        <Share className="w-3.5 h-3.5" /> Share
                      </span>
                      <span>button at the bottom.</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-amber-400/20 text-amber-300 font-mono font-bold flex items-center justify-center shrink-0 border border-amber-400/30">
                      2
                    </span>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span>Scroll down and select</span>
                      <span className="px-1.5 py-0.5 rounded bg-zinc-800 text-white font-bold inline-flex items-center gap-1 border border-zinc-700">
                        <PlusSquare className="w-3.5 h-3.5 text-amber-400" /> Add to Home Screen
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-amber-400/20 text-amber-300 font-mono font-bold flex items-center justify-center shrink-0 border border-amber-400/30">
                      3
                    </span>
                    <span>Tap <strong>Add</strong> in the top-right corner to place the app on your home screen.</span>
                  </div>
                </>
              )}

              {activeTab === 'android' && (
                <>
                  {isInstallable && (
                    <div className="mb-3 p-2.5 rounded-lg bg-amber-500/10 border border-amber-400/40 text-center">
                      <p className="text-[11px] text-amber-200 mb-2">Direct installation is available for this browser:</p>
                      <button
                        onClick={async () => {
                          const res = await install();
                          if (res) setShowModal(false);
                        }}
                        className="deal-btn-gold py-2 px-4 rounded-lg text-xs font-black w-full flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <Download className="w-4 h-4 text-amber-950" />
                        <span>CTC Install Now</span>
                      </button>
                    </div>
                  )}

                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-amber-400/20 text-amber-300 font-mono font-bold flex items-center justify-center shrink-0 border border-amber-400/30">
                      1
                    </span>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span>In <strong>Chrome</strong>, tap the</span>
                      <span className="px-1.5 py-0.5 rounded bg-zinc-800 text-white font-bold inline-flex items-center border border-zinc-700">
                        ⋮ Menu
                      </span>
                      <span>in top-right corner.</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-amber-400/20 text-amber-300 font-mono font-bold flex items-center justify-center shrink-0 border border-amber-400/30">
                      2
                    </span>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span>Tap</span>
                      <span className="px-1.5 py-0.5 rounded bg-zinc-800 text-amber-300 font-bold inline-flex items-center gap-1 border border-zinc-700">
                        <Download className="w-3.5 h-3.5" /> Install app / Add to Home screen
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-amber-400/20 text-amber-300 font-mono font-bold flex items-center justify-center shrink-0 border border-amber-400/30">
                      3
                    </span>
                    <span>Confirm installation to launch CTC as a native Android app!</span>
                  </div>
                </>
              )}

              {activeTab === 'desktop' && (
                <>
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-amber-400/20 text-amber-300 font-mono font-bold flex items-center justify-center shrink-0 border border-amber-400/30">
                      1
                    </span>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span>In Chrome or Edge, look at the right side of the address bar for the</span>
                      <span className="px-1.5 py-0.5 rounded bg-zinc-800 text-amber-300 font-bold inline-flex items-center gap-1 border border-zinc-700">
                        <Download className="w-3.5 h-3.5" /> Install
                      </span>
                      <span>icon.</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-amber-400/20 text-amber-300 font-mono font-bold flex items-center justify-center shrink-0 border border-amber-400/30">
                      2
                    </span>
                    <span>Click <strong>Install</strong> to run Cut The Check in a dedicated standalone window with desktop dock access.</span>
                  </div>
                </>
              )}
            </div>

            {/* Quick Share Link for Mobile Browsers */}
            <div className="flex items-center gap-2 mb-4">
              <button
                onClick={handleCopyLink}
                className="flex-1 py-2 px-3 rounded-xl bg-zinc-900 border border-zinc-700 hover:border-amber-400/50 text-xs font-semibold text-zinc-300 flex items-center justify-center gap-1.5 transition cursor-pointer"
              >
                {copiedLink ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400">Link Copied to Clipboard!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-amber-400" />
                    <span>CTC Copy App Link for Phone</span>
                  </>
                )}
              </button>
            </div>

            <button
              onClick={() => setShowModal(false)}
              className="deal-btn-gold w-full py-2.5 rounded-xl text-xs font-black shadow-lg cursor-pointer"
            >
              Got it, let's go!
            </button>
          </div>
        </div>
      )}
    </>
  );
};
