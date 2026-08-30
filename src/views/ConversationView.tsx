import { useState, useRef, useEffect, useCallback } from 'react';
import {
  Send,
  Paperclip,
  Mic,
  Plus,
  Search,
  Copy,
  RotateCcw,
  ThumbsUp,
  ThumbsDown,
  Square,
  Gem,
  Pin,
  Trash2,
  Check,
  Sparkles,
} from 'lucide-react';
import { cn, formatTime, formatRelativeTime, uid } from '@/lib/utils';
import { conversations, sampleMessages, aiService, sapphireStatus } from '@/lib/data';
import type { Conversation, Message, MessageStatus } from '@/types';
import { DevStateBadge } from '@/components/layout/PageShell';
import { Tooltip } from '@/components/ui';

export function ConversationView() {
  const [convList, setConvList] = useState<Conversation[]>(conversations);
  const [activeConvId, setActiveConvId] = useState<string | null>(conversations[0]?.id ?? null);
  const [messages, setMessages] = useState<Message[]>(sampleMessages);
  const [input, setInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const activeConv = convList.find((c) => c.id === activeConvId) ?? null;

  const filteredConvs = convList.filter(
    (c) =>
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.summary ?? '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  const scrollToBottom = useCallback(() => {
    requestAnimationFrame(() => {
      if (scrollRef.current) {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
      }
    });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  const handleSend = async () => {
    if (!input.trim() || isProcessing) return;

    const userMsg: Message = {
      id: uid('msg'),
      conversationId: activeConvId ?? 'new',
      role: 'user',
      content: input.trim(),
      status: 'complete',
      createdAt: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsProcessing(true);

    // Create a placeholder for Sapphire's response
    const sapphireMsgId = uid('msg');
    const sapphireMsg: Message = {
      id: sapphireMsgId,
      conversationId: activeConvId ?? 'new',
      role: 'sapphire',
      content: '',
      status: 'thinking',
      createdAt: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, sapphireMsg]);

    const controller = new AbortController();
    abortRef.current = controller;

    await aiService.sendMessage(
      activeConvId ?? 'new',
      userMsg.content,
      {
        onThinking: () => {
          setMessages((prev) =>
            prev.map((m) => (m.id === sapphireMsgId ? { ...m, status: 'streaming' as MessageStatus } : m))
          );
        },
        onChunk: (accumulated) => {
          setMessages((prev) =>
            prev.map((m) => (m.id === sapphireMsgId ? { ...m, content: accumulated, status: 'streaming' as MessageStatus } : m))
          );
        },
        onComplete: (full) => {
          setMessages((prev) =>
            prev.map((m) => (m.id === sapphireMsgId ? { ...m, content: full, status: 'complete' as MessageStatus } : m))
          );
          setIsProcessing(false);
        },
        onError: (err) => {
          setMessages((prev) =>
            prev.map((m) =>
              m.id === sapphireMsgId ? { ...m, status: 'error' as MessageStatus, content: err } : m
            )
          );
          setIsProcessing(false);
        },
      },
      controller.signal
    );

    if (!controller.signal.aborted) {
      setIsProcessing(false);
    }
  };

  const handleStop = () => {
    abortRef.current?.abort();
    setIsProcessing(false);
    setMessages((prev) =>
      prev.map((m) => (m.status === 'streaming' ? { ...m, status: 'stopped' as MessageStatus } : m))
    );
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleNewConversation = () => {
    const newConv: Conversation = {
      id: uid('conv'),
      title: 'New conversation',
      status: 'active',
      messageCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setConvList((prev) => [newConv, ...prev]);
    setActiveConvId(newConv.id);
    setMessages([]);
  };

  const handleCopy = (content: string, id: string) => {
    navigator.clipboard.writeText(content);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleRegenerate = () => {
    const lastUser = [...messages].reverse().find((m) => m.role === 'user');
    if (!lastUser) return;
    // Remove last sapphire message
    setMessages((prev) => {
      const lastSapphireIdx = [...prev].reverse().findIndex((m) => m.role === 'sapphire');
      if (lastSapphireIdx === -1) return prev;
      return prev.slice(0, prev.length - lastSapphireIdx - 1);
    });
    // Re-send
    setInput(lastUser.content);
    setTimeout(() => {
      inputRef.current?.focus();
    }, 50);
  };

  return (
    <div className="flex h-full overflow-hidden">
      {/* Conversation list sidebar */}
      <ConversationList
        conversations={filteredConvs}
        activeId={activeConvId}
        onSelect={setActiveConvId}
        onNew={handleNewConversation}
        searchQuery={searchQuery}
        onSearch={setSearchQuery}
      />

      {/* Chat area */}
      <div className="flex flex-1 flex-col min-w-0">
        {/* Chat header */}
        <div className="flex items-center justify-between gap-4 border-b border-white/5 px-4 md:px-6 py-3.5 shrink-0">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-semibold text-white truncate">
                {activeConv?.title ?? 'Select a conversation'}
              </h2>
              {activeConv?.pinned && <Pin size={12} className="text-sapphire-400 shrink-0" />}
            </div>
            {activeConv?.summary && (
              <p className="text-xs text-slate-500 truncate mt-0.5">{activeConv.summary}</p>
            )}
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {!sapphireStatus.aiConnected && <DevStateBadge />}
          </div>
        </div>

        {/* Messages */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 md:px-6 py-6">
          {messages.length === 0 ? (
            <EmptyConversation />
          ) : (
            <div className="mx-auto max-w-3xl space-y-6">
              {messages.map((msg) => (
                <MessageBubble
                  key={msg.id}
                  message={msg}
                  onCopy={() => handleCopy(msg.content, msg.id)}
                  onRegenerate={handleRegenerate}
                  copied={copiedId === msg.id}
                  isLast={msg.id === messages[messages.length - 1]?.id}
                />
              ))}
            </div>
          )}
        </div>

        {/* Input area */}
        <ChatInput
          value={input}
          onChange={setInput}
          onSend={handleSend}
          onStop={handleStop}
          onKeyDown={handleKeyDown}
          isProcessing={isProcessing}
          inputRef={inputRef}
        />
      </div>
    </div>
  );
}

// ── Conversation List ─────────────────────────────────────────────────────────

function ConversationList({
  conversations,
  activeId,
  onSelect,
  onNew,
  searchQuery,
  onSearch,
}: {
  conversations: Conversation[];
  activeId: string | null;
  onSelect: (id: string) => void;
  onNew: () => void;
  searchQuery: string;
  onSearch: (q: string) => void;
}) {
  return (
    <div className="hidden lg:flex w-64 shrink-0 flex-col border-r border-white/5 bg-ink-100/30">
      <div className="p-3 border-b border-white/5">
        <button
          onClick={onNew}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-sapphire-600/90 text-white py-2.5 text-sm font-medium transition-all hover:bg-sapphire-500 hover:shadow-glow-sm border border-sapphire-400/30"
        >
          <Plus size={16} /> New conversation
        </button>
      </div>
      <div className="p-3 border-b border-white/5">
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            value={searchQuery}
            onChange={(e) => onSearch(e.target.value)}
            placeholder="Search conversations..."
            className="h-9 w-full rounded-lg bg-ink-300/50 border border-white/5 pl-9 pr-3 text-xs text-white placeholder:text-slate-500 focus:border-sapphire-500/30 outline-none transition-colors"
          />
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-2 space-y-0.5">
        {conversations.length === 0 ? (
          <p className="text-xs text-slate-600 text-center py-8">No conversations found</p>
        ) : (
          conversations.map((conv) => (
            <button
              key={conv.id}
              onClick={() => onSelect(conv.id)}
              className={cn(
                'group flex w-full flex-col gap-1 rounded-xl px-3 py-2.5 text-left transition-all duration-200',
                activeId === conv.id
                  ? 'bg-sapphire-500/10 border border-sapphire-500/20'
                  : 'hover:bg-white/5 border border-transparent'
              )}
            >
              <div className="flex items-center justify-between gap-2">
                <span className={cn(
                  'text-sm font-medium truncate',
                  activeId === conv.id ? 'text-white' : 'text-slate-300'
                )}>
                  {conv.title}
                </span>
                {conv.pinned && <Pin size={11} className="text-sapphire-400 shrink-0" />}
              </div>
              {conv.summary && (
                <p className="text-2xs text-slate-500 truncate">{conv.summary}</p>
              )}
              <div className="flex items-center justify-between mt-0.5">
                <span className="text-2xs text-slate-600">{formatRelativeTime(conv.updatedAt)}</span>
                <span className="text-2xs text-slate-600">{conv.messageCount} msgs</span>
              </div>
            </button>
          ))
        )}
      </div>
    </div>
  );
}

// ── Message Bubble ────────────────────────────────────────────────────────────

function MessageBubble({
  message,
  onCopy,
  onRegenerate,
  copied,
  isLast,
}: {
  message: Message;
  onCopy: () => void;
  onRegenerate: () => void;
  copied: boolean;
  isLast: boolean;
}) {
  const isUser = message.role === 'user';
  const isThinking = message.status === 'thinking';
  const isStreaming = message.status === 'streaming';
  const isError = message.status === 'error';

  if (isThinking) {
    return (
      <div className="flex gap-3.5 animate-fade-in">
        <SapphireAvatar />
        <div className="flex items-center gap-2.5 py-2">
          <ThinkingIndicator />
        </div>
      </div>
    );
  }

  return (
    <div className={cn('group flex gap-3.5 animate-fade-in', isUser && 'flex-row-reverse')}>
      {isUser ? <UserAvatar /> : <SapphireAvatar />}

      <div className={cn('flex flex-col gap-2 min-w-0', isUser ? 'items-end' : 'items-start')}>
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-slate-400">
            {isUser ? 'You' : 'Sapphire'}
          </span>
          <span className="text-2xs text-slate-600">{formatTime(message.createdAt)}</span>
          {isStreaming && (
            <span className="text-2xs text-sapphire-300 flex items-center gap-1">
              <span className="h-1 w-1 rounded-full bg-sapphire-400 animate-pulse" />
              streaming
            </span>
          )}
        </div>

        <div
          className={cn(
            'rounded-2xl px-4 py-3 max-w-full',
            isUser
              ? 'bg-sapphire-600/15 border border-sapphire-500/20 text-slate-100 rounded-tr-md'
              : 'glass text-slate-200 rounded-tl-md',
            isError && 'border-red-500/20 bg-red-500/5'
          )}
        >
          {isError ? (
            <div className="flex flex-col gap-2">
              <p className="text-sm text-red-300">{message.content}</p>
              <button
                onClick={onRegenerate}
                className="flex items-center gap-1.5 text-xs text-sapphire-300 hover:text-sapphire-200 transition-colors"
              >
                <RotateCcw size={12} /> Retry
              </button>
            </div>
          ) : (
            <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">
              {message.content}
              {isStreaming && <span className="inline-block w-1.5 h-4 ml-0.5 bg-sapphire-400 animate-pulse-soft align-text-bottom" />}
            </p>
          )}
        </div>

        {/* Actions */}
        {!isUser && message.status === 'complete' && (
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <MsgAction icon={copied ? Check : Copy} label={copied ? 'Copied' : 'Copy'} onClick={onCopy} />
            <MsgAction icon={RotateCcw} label="Regenerate" onClick={onRegenerate} />
            <MsgAction icon={ThumbsUp} label="Good" />
            <MsgAction icon={ThumbsDown} label="Bad" />
          </div>
        )}
      </div>
    </div>
  );
}

function MsgAction({ icon: Icon, label, onClick }: { icon: typeof Copy; label: string; onClick?: () => void }) {
  return (
    <Tooltip content={label}>
      <button
        onClick={onClick}
        className="flex h-7 w-7 items-center justify-center rounded-lg text-slate-500 hover:text-white hover:bg-white/5 transition-colors"
      >
        <Icon size={14} />
      </button>
    </Tooltip>
  );
}

// ── Avatars ───────────────────────────────────────────────────────────────────

function SapphireAvatar() {
  return (
    <div className="relative flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-sapphire-500/25 to-aqua-500/15 border border-sapphire-400/20">
      <Gem size={15} className="text-sapphire-300" />
    </div>
  );
}

function UserAvatar() {
  return (
    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-white/5 border border-white/10 text-xs font-semibold text-slate-300">
      S
    </div>
  );
}

// ── Thinking Indicator ────────────────────────────────────────────────────────

function ThinkingIndicator() {
  const [phase, setPhase] = useState(0);
  const phases = ['Thinking', 'Processing', 'Preparing'];

  useEffect(() => {
    const interval = setInterval(() => {
      setPhase((p) => (p + 1) % phases.length);
    }, 2000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex items-center gap-2.5">
      <div className="flex gap-1">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="h-1.5 w-1.5 rounded-full bg-sapphire-400 animate-pulse-soft"
            style={{ animationDelay: `${i * 200}ms` }}
          />
        ))}
      </div>
      <span className="text-xs text-sapphire-300 font-medium animate-fade-in" key={phase}>
        {phases[phase]}…
      </span>
    </div>
  );
}

// ── Empty Conversation ────────────────────────────────────────────────────────

function EmptyConversation() {
  return (
    <div className="flex h-full flex-col items-center justify-center text-center px-4 animate-fade-in">
      <div className="mb-6 relative">
        <div className="absolute inset-0 rounded-3xl bg-sapphire-500/10 blur-2xl" />
        <div className="relative flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-sapphire-500/20 to-aqua-500/10 border border-sapphire-400/20">
          <Gem size={32} className="text-sapphire-300" />
        </div>
      </div>
      <h2 className="text-xl font-semibold text-white mb-2">What would you like to work on?</h2>
      <p className="text-sm text-slate-400 max-w-md leading-relaxed">
        Start a conversation with Sapphire. Ask a question, share an idea, or describe what you need help with.
      </p>
      {!sapphireStatus.aiConnected && (
        <div className="mt-6">
          <DevStateBadge />
        </div>
      )}
      <div className="mt-8 flex flex-wrap items-center justify-center gap-2 max-w-lg">
        {[
          'Plan a new project',
          'Research a topic',
          'Brainstorm ideas',
          'Review my goals',
        ].map((suggestion) => (
          <span
            key={suggestion}
            className="rounded-full border border-white/8 bg-ink-300/40 px-3.5 py-1.5 text-xs text-slate-400"
          >
            {suggestion}
          </span>
        ))}
      </div>
    </div>
  );
}

// ── Chat Input ────────────────────────────────────────────────────────────────

function ChatInput({
  value,
  onChange,
  onSend,
  onStop,
  onKeyDown,
  isProcessing,
  inputRef,
}: {
  value: string;
  onChange: (v: string) => void;
  onSend: () => void;
  onStop: () => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
  isProcessing: boolean;
  inputRef: React.RefObject<HTMLTextAreaElement>;
}) {
  // Auto-resize textarea
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.height = 'auto';
      inputRef.current.style.height = Math.min(inputRef.current.scrollHeight, 160) + 'px';
    }
  }, [value, inputRef]);

  return (
    <div className="shrink-0 border-t border-white/5 bg-ink-100/30 backdrop-blur-xl p-3 md:p-4">
      <div className="mx-auto max-w-3xl">
        <div className="relative rounded-2xl border border-white/8 bg-ink-300/50 focus-within:border-sapphire-500/30 focus-within:ring-2 focus-within:ring-sapphire-500/15 transition-all">
          <textarea
            ref={inputRef}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder="Ask Sapphire anything..."
            rows={1}
            className="w-full resize-none bg-transparent px-4 pt-3.5 pb-12 text-sm text-white placeholder:text-slate-500 outline-none scrollbar-none"
            style={{ maxHeight: '160px' }}
          />
          <div className="absolute bottom-2.5 left-2.5 flex items-center gap-1">
            <Tooltip content="Attach file">
              <button className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 hover:text-white hover:bg-white/5 transition-colors">
                <Paperclip size={16} />
              </button>
            </Tooltip>
            <Tooltip content="Voice input — Coming soon">
              <button className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-600 hover:text-slate-400 transition-colors" disabled>
                <Mic size={16} />
              </button>
            </Tooltip>
          </div>
          <div className="absolute bottom-2.5 right-2.5">
            {isProcessing ? (
              <button
                onClick={onStop}
                className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-500/90 text-white hover:bg-red-500 transition-colors border border-red-400/30"
                aria-label="Stop"
              >
                <Square size={15} className="fill-current" />
              </button>
            ) : (
              <button
                onClick={onSend}
                disabled={!value.trim()}
                className="flex h-9 w-9 items-center justify-center rounded-xl bg-sapphire-600 text-white hover:bg-sapphire-500 transition-all disabled:opacity-30 disabled:cursor-not-allowed border border-sapphire-400/30 hover:shadow-glow-sm active:scale-95"
                aria-label="Send"
              >
                <Send size={15} />
              </button>
            )}
          </div>
        </div>
        <div className="mt-2 flex items-center justify-between px-1">
          <p className="text-2xs text-slate-600">
            <kbd className="rounded bg-white/5 px-1 py-0.5 border border-white/5">Enter</kbd> to send ·{' '}
            <kbd className="rounded bg-white/5 px-1 py-0.5 border border-white/5">Shift+Enter</kbd> for new line
          </p>
          <span className="hidden sm:flex items-center gap-1 text-2xs text-slate-600">
            <Sparkles size={10} className="text-sapphire-400" /> Sapphire Founder Edition v0.1
          </span>
        </div>
      </div>
    </div>
  );
}
