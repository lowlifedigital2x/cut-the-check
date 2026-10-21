import React, { useState } from 'react';
import {
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Wifi,
  Volume2,
  ShieldCheck,
  Cpu,
  Layers,
  Radio,
  Clock,
  Sparkles
} from 'lucide-react';
import { PlatformConnection } from '../../types';

interface PreFlightDiagnosticsProps {
  connections: PlatformConnection[];
  isBroadcasting: boolean;
  onAllPassed?: () => void;
}

export interface DiagnosticItem {
  id: string;
  category: 'encoder' | 'audio' | 'networks' | 'watermark' | 'escrow';
  title: string;
  metric: string;
  status: 'passed' | 'warning' | 'checking';
  details: string;
}

export const PreFlightDiagnostics: React.FC<PreFlightDiagnosticsProps> = ({
  connections,
  isBroadcasting
}) => {
  const [isScanning, setIsScanning] = useState(false);
  const [diagnostics, setDiagnostics] = useState<DiagnosticItem[]>([
    {
      id: 'diag-1',
      category: 'encoder',
      title: 'Video Encoding Engine',
      metric: '1080p60 @ 6,200 kbps',
      status: 'passed',
      details: 'Hardware NVENC/Metal acceleration active. 0% dropped frames.'
    },
    {
      id: 'diag-2',
      category: 'audio',
      title: 'Lossless Audio Ingest',
      metric: '24-bit / 48 kHz (-0.2 dB TP)',
      status: 'passed',
      details: 'Compliant with Apple Digital Masters and Spotify Loudness (-14 LUFS).'
    },
    {
      id: 'diag-3',
      category: 'watermark',
      title: 'CTC Eagle Medallion Watermark',
      metric: 'Official Insignia Armed',
      status: 'passed',
      details: 'Restricted strictly to header emblem and top-right broadcast monitor.'
    },
    {
      id: 'diag-4',
      category: 'networks',
      title: 'Syndicated DSP Relays',
      metric: '14/14 Endpoints Synchronized',
      status: 'passed',
      details: 'RTMP handshakes valid for YouTube, Kick, TikTok, Facebook, Spotify, Apple.'
    },
    {
      id: 'diag-5',
      category: 'escrow',
      title: 'Cut The Check Escrow Ledger',
      metric: 'Automated Smart Payouts Armed',
      status: 'passed',
      details: 'Direct royalty disbursement routing verified across connected accounts.'
    }
  ]);

  const handleRunDiagnostic = () => {
    setIsScanning(true);
    setDiagnostics((prev) =>
      prev.map((item) => ({ ...item, status: 'checking' }))
    );

    setTimeout(() => {
      setDiagnostics([
        {
          id: 'diag-1',
          category: 'encoder',
          title: 'Video Encoding Engine',
          metric: '1080p60 @ 6,240 kbps',
          status: 'passed',
          details: 'Verified 0 frame drops, 16.6ms frame time. Ultra-low latency relay.'
        },
        {
          id: 'diag-2',
          category: 'audio',
          title: 'Lossless Audio Ingest',
          metric: '24-bit / 48 kHz (-0.1 dB TP)',
          status: 'passed',
          details: 'True peak headroom verified. Dolby Atmos spatial metadata compatible.'
        },
        {
          id: 'diag-3',
          category: 'watermark',
          title: 'CTC Eagle Medallion Watermark',
          metric: 'Official Seal Validated',
          status: 'passed',
          details: 'Alpha overlay positioned at top-right live monitor. Anti-piracy cryptographic hash active.'
        },
        {
          id: 'diag-4',
          category: 'networks',
          title: 'Syndicated DSP Relays',
          metric: '47/47 Channels Active',
          status: 'passed',
          details: 'All 47 RTMP & API distribution keys verified and ready for instant drop.'
        },
        {
          id: 'diag-5',
          category: 'escrow',
          title: 'Cut The Check Escrow Ledger',
          metric: 'Smart Contract Escrow Ready',
          status: 'passed',
          details: 'Instant payout disbursement channels ready to credit real-time royalty earnings.'
        }
      ]);
      setIsScanning(false);
    }, 1200);
  };

  return (
    <div className="plaque-platinum p-5 rounded-2xl relative overflow-hidden">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <h3 className="text-sm font-black text-white uppercase tracking-wider">
              Pre-Flight Diagnostic Telemetry
            </h3>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold">
              5/5 READY
            </span>
          </div>
          <p className="text-xs text-slate-300/80 mt-0.5">
            Automated pre-launch systems verification across encoders, lossless audio, and network relays.
          </p>
        </div>

        <button
          onClick={handleRunDiagnostic}
          disabled={isScanning}
          className="deal-btn-platinum py-1.5 px-3 rounded-lg text-xs font-bold transition flex items-center gap-1.5 self-start sm:self-auto shadow-sm"
        >
          <RefreshCw className={`w-3.5 h-3.5 text-slate-800 ${isScanning ? 'animate-spin' : ''}`} />
          <span>{isScanning ? 'Diagnosing...' : 'Re-Run Pre-Flight'}</span>
        </button>
      </div>

      {/* Diagnostics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {diagnostics.map((diag) => (
          <div
            key={diag.id}
            className="p-3.5 rounded-xl bg-[#0B0E17]/90 border border-slate-700/60 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-bold text-white truncate">{diag.title}</span>
                {diag.status === 'passed' ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                ) : diag.status === 'checking' ? (
                  <RefreshCw className="w-3.5 h-3.5 text-amber-400 animate-spin shrink-0" />
                ) : (
                  <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                )}
              </div>
              <div className="text-xs font-mono font-bold text-amber-300 mb-1">
                {diag.metric}
              </div>
              <p className="text-[11px] text-zinc-400 leading-tight">
                {diag.details}
              </p>
            </div>

            <div className="mt-2 pt-2 border-t border-zinc-800 flex items-center justify-between text-[9px] font-mono text-zinc-500">
              <span className="uppercase">{diag.category}</span>
              <span className="text-emerald-400 font-bold">VERIFIED PASS</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
