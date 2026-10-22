import React, { useState } from 'react';
import {
  Link2,
  CheckCircle,
  AlertCircle,
  Copy,
  Check,
  Eye,
  EyeOff,
  RefreshCw,
  Shield,
  Radio,
  ExternalLink,
  Wifi
} from 'lucide-react';
import { PlatformConnection, PlatformId } from '../../types';
import { PLATFORM_CONFIGS } from '../../data/mockData';
import { PlatformBadge } from '../common/PlatformBadge';

interface PlatformConnectionsProps {
  connections: PlatformConnection[];
  onToggleConnection: (p: PlatformId) => void;
  onUpdateStreamKey: (p: PlatformId, key: string) => void;
}

export const PlatformConnections: React.FC<PlatformConnectionsProps> = ({
  connections,
  onToggleConnection,
  onUpdateStreamKey
}) => {
  const [showKeys, setShowKeys] = useState<Record<string, boolean>>({});
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const toggleShowKey = (pid: string) => {
    setShowKeys((prev) => ({ ...prev, [pid]: !prev[pid] }));
  };

  const copyText = (text: string, id: string) => {
    navigator.clipboard?.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-white flex items-center gap-2.5">
            <Link2 className="w-6 h-6 text-purple-400" />
            <span>Connected Streaming & Distribution Services</span>
          </h2>
          <p className="text-xs text-zinc-400 mt-1">
            Authorize OAuth scopes and manage RTMP stream credentials for simultaneous broadcasting and one-click posting.
          </p>
        </div>

        {/* Global Relay Status Pill */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-zinc-900 border border-zinc-800 text-xs font-mono">
          <Wifi className="w-3.5 h-3.5 text-emerald-400" />
          <span className="text-zinc-400">Cloud Relay:</span>
          <span className="text-emerald-400 font-bold">1080p60 Active (12ms)</span>
        </div>
      </div>

      {/* Grid of Connections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {connections.map((c) => {
          const cfg = PLATFORM_CONFIGS[c.platformId];
          const isKeyVisible = showKeys[c.platformId];

          return (
            <div
              key={c.platformId}
              className={`p-6 rounded-2xl border transition-all flex flex-col justify-between shadow-xl ${
                c.connected
                  ? 'bg-[#111622] border-zinc-800 hover:border-zinc-700'
                  : 'bg-zinc-950/60 border-zinc-900 opacity-60'
              }`}
            >
              <div className="space-y-4">
                {/* Header: Platform Badge, Connected Status & Account Handle */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={c.avatarUrl}
                      alt={c.displayName}
                      className="w-12 h-12 rounded-xl object-cover border border-zinc-700"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <PlatformBadge platformId={c.platformId} size="md" />
                      </div>
                      <h3 className="font-bold text-sm text-white mt-1">{c.displayName}</h3>
                      <span className="text-xs text-zinc-500 font-mono">{c.accountHandle}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => onToggleConnection(c.platformId)}
                    className={`px-3 py-1 rounded-xl text-xs font-bold transition border ${
                      c.connected
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20'
                        : 'bg-zinc-800 text-zinc-400 border-zinc-700 hover:text-white'
                    }`}
                  >
                    {c.connected ? 'CTC Connected' : 'CTC Connect'}
                  </button>
                </div>

                {/* Permissions checklist */}
                <div className="p-3 rounded-xl bg-zinc-900/80 border border-zinc-800 space-y-1.5">
                  <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">
                    Granted Permissions
                  </span>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="flex items-center gap-1.5 text-zinc-300">
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                      <span>{cfg.supportsLive ? 'Live Stream Ingest' : 'Audio Ingest'}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-zinc-300">
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                      <span>1-Click Publishing</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-zinc-300">
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Audience Analytics</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-zinc-300">
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Monetization Read</span>
                    </div>
                  </div>
                </div>

                {/* RTMP Ingest & Stream Key Vault */}
                <div className="space-y-2">
                  <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">
                    Ingest Endpoint & Stream Key
                  </span>

                  {/* RTMP URL */}
                  <div className="flex items-center justify-between gap-2 bg-zinc-950 p-2.5 rounded-xl border border-zinc-800/80 text-xs font-mono text-zinc-300">
                    <span className="truncate">{c.rtmpUrl || 'Not configured'}</span>
                    <button
                      onClick={() => copyText(c.rtmpUrl, `${c.platformId}_rtmp`)}
                      className="p-1 text-purple-400 hover:text-white"
                      title="Copy Ingest URL"
                    >
                      {copiedId === `${c.platformId}_rtmp` ? (
                        <Check className="w-3.5 h-3.5" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>

                  {/* Stream Key */}
                  <div className="flex items-center justify-between gap-2 bg-zinc-950 p-2.5 rounded-xl border border-zinc-800/80 text-xs font-mono text-zinc-300">
                    <span className="truncate">
                      {isKeyVisible ? c.streamKey || 'Not configured' : c.streamKey ? '••••••••••••••••••••••••••••••••' : 'Not configured'}
                    </span>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => toggleShowKey(c.platformId)}
                        className="p-1 text-zinc-400 hover:text-white"
                        title={isKeyVisible ? 'Hide Key' : 'Show Key'}
                      >
                        {isKeyVisible ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                      <button
                        onClick={() => copyText(c.streamKey, `${c.platformId}_key`)}
                        className="p-1 text-purple-400 hover:text-white"
                        title="Copy Stream Key"
                      >
                        {copiedId === `${c.platformId}_key` ? (
                          <Check className="w-3.5 h-3.5" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Sync Info */}
              <div className="mt-4 pt-3 border-t border-zinc-800/80 flex items-center justify-between text-[11px] text-zinc-500 font-mono">
                <span>Last Token Handshake: {c.lastSync}</span>
                <span className="text-emerald-400">OAuth Valid</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
