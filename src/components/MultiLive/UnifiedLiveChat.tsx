import React, { useState } from 'react';
import { LiveChatEvent, PlatformId } from '../../types';
import { PlatformBadge } from '../common/PlatformBadge';
import {
  Send,
  Sparkles,
  Gift,
  Shield,
  Smile,
  Volume2,
  Filter
} from 'lucide-react';

interface UnifiedLiveChatProps {
  chatEvents: LiveChatEvent[];
  onSendMessage: (msg: string, targetPlatform: PlatformId | 'all') => void;
  isBroadcasting: boolean;
}

export const UnifiedLiveChat: React.FC<UnifiedLiveChatProps> = ({
  chatEvents,
  onSendMessage,
  isBroadcasting
}) => {
  const [inputMessage, setInputMessage] = useState('');
  const [selectedTarget, setSelectedTarget] = useState<PlatformId | 'all'>('all');
  const [filterPlatform, setFilterPlatform] = useState<PlatformId | 'all'>('all');

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;
    onSendMessage(inputMessage.trim(), selectedTarget);
    setInputMessage('');
  };

  const filteredChat = chatEvents.filter((msg) => {
    if (filterPlatform === 'all') return true;
    return msg.platformId === filterPlatform;
  });

  return (
    <div className="bg-[#111622] rounded-2xl border border-zinc-800 p-4 shadow-xl flex flex-col h-full min-h-[520px]">
      {/* Header & Filter Bar */}
      <div className="flex items-center justify-between pb-3 border-b border-zinc-800/80 gap-2">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
          <h3 className="text-sm font-bold text-white">Unified Multi-Chat</h3>
        </div>

        {/* Filter per platform */}
        <div className="flex items-center gap-1">
          <Filter className="w-3.5 h-3.5 text-zinc-500" />
          <select
            value={filterPlatform}
            onChange={(e) => setFilterPlatform(e.target.value as any)}
            className="bg-zinc-900 border border-zinc-800 text-[11px] font-semibold text-zinc-300 rounded-lg px-2 py-1 focus:outline-none"
          >
            <option value="all">All Channels</option>
            <option value="youtube">YouTube Chat</option>
            <option value="tiktok">TikTok Live</option>
            <option value="kick">Kick Chat</option>
            <option value="facebook">Facebook Live</option>
          </select>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto space-y-2 py-3 pr-1">
        {filteredChat.map((ev) => {
          const isMonetized = ev.isGift || ev.isSuperChat;

          return (
            <div
              key={ev.id}
              className={`p-2.5 rounded-xl border text-xs transition-all ${
                isMonetized
                  ? 'bg-amber-500/10 border-amber-500/40 shadow-sm'
                  : 'bg-zinc-900/50 border-zinc-800/60 hover:border-zinc-700/80'
              }`}
            >
              <div className="flex items-center justify-between gap-1.5 mb-1">
                <div className="flex items-center gap-1.5 truncate">
                  <PlatformBadge platformId={ev.platformId} size="sm" showLabel={false} />
                  <span className="font-bold text-white truncate">{ev.user}</span>
                  {ev.badge && (
                    <span className="text-[10px] px-1 py-0.2 rounded bg-purple-500/20 text-purple-300 font-mono">
                      {ev.badge}
                    </span>
                  )}
                </div>
                <span className="text-[10px] text-zinc-500 font-mono shrink-0">
                  {ev.timestamp}
                </span>
              </div>

              <p className="text-zinc-200 leading-relaxed break-words">{ev.message}</p>

              {/* Gift / SuperChat Highlight Tag */}
              {isMonetized && (
                <div className="mt-1.5 flex items-center gap-1.5">
                  {ev.isSuperChat && (
                    <span className="text-[11px] font-extrabold text-amber-300 bg-amber-500/25 px-2 py-0.5 rounded border border-amber-500/50 font-mono flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-amber-400" />
                      SuperChat {ev.superChatAmount}
                    </span>
                  )}
                  {ev.isGift && (
                    <span className="text-[11px] font-extrabold text-rose-300 bg-rose-500/25 px-2 py-0.5 rounded border border-rose-500/50 font-mono flex items-center gap-1">
                      <Gift className="w-3 h-3 text-rose-400" />
                      {ev.giftType} (+${ev.giftValue?.toFixed(2)})
                    </span>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Quick Stream Deck Actions */}
      <div className="pt-2 border-t border-zinc-800/80 flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none text-[11px]">
        <button
          onClick={() => onSendMessage('🎉 Thank you everyone for the massive support today!', 'all')}
          className="px-2.5 py-1 rounded-lg bg-zinc-800/80 hover:bg-zinc-700 text-zinc-300 font-medium whitespace-nowrap"
        >
          🙏 Shoutout All
        </button>
        <button
          onClick={() => onSendMessage('🔥 Hype in the chat! Let me know in comments what track we break down next!', 'all')}
          className="px-2.5 py-1 rounded-lg bg-zinc-800/80 hover:bg-zinc-700 text-zinc-300 font-medium whitespace-nowrap"
        >
          ⚡ Hype Prompt
        </button>
        <button
          onClick={() => onSendMessage('🔔 Drop a follow/sub on Kick & YouTube to unlock the sound design stems!', 'all')}
          className="px-2.5 py-1 rounded-lg bg-zinc-800/80 hover:bg-zinc-700 text-zinc-300 font-medium whitespace-nowrap"
        >
          🎁 Sub Goal
        </button>
      </div>

      {/* Unified Reply Form */}
      <form onSubmit={handleSend} className="space-y-2">
        <div className="flex items-center gap-2">
          <span className="text-[11px] text-zinc-400 font-medium">Broadcast reply to:</span>
          <select
            value={selectedTarget}
            onChange={(e) => setSelectedTarget(e.target.value as any)}
            className="bg-zinc-900 border border-zinc-800 text-[11px] font-bold text-purple-300 rounded-lg px-2 py-1 focus:outline-none"
          >
            <option value="all">Every Channel (4x Sync)</option>
            <option value="youtube">YouTube Only</option>
            <option value="tiktok">TikTok Only</option>
            <option value="kick">Kick Only</option>
            <option value="facebook">Facebook Only</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Send message across streams..."
            className="flex-1 bg-zinc-900 border border-zinc-800 focus:border-purple-500 rounded-xl px-3.5 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none"
          />
          <button
            type="submit"
            className="px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-md"
          >
            <Send className="w-3.5 h-3.5" />
            <span>CTC Send</span>
          </button>
        </div>
      </form>
    </div>
  );
};
