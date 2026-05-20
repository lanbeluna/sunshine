import { Fragment, useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Bot,
  ClipboardList,
  Image as ImageIcon,
  MapPin,
  Mic,
  Plus,
  Send,
  Trash2,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { WanderImage } from '@/components/media/WanderImage';
import { toast } from '@/lib/toast';
import {
  matchAssistantReply,
  type AssistantPlaceCard,
  type AssistantTable,
} from '@/lib/aiAssistantQa';
import { pickCover } from '@/lib/unsplashPools';
import { cn } from '@/lib/utils';

const WELCOME = `👋 你好！我是 QL轻旅 的智能助手。
我可以帮你：
· 解答旅行准备问题
· 推荐当地美食/住宿
· 规划每日路线
· 翻译/签证/交通咨询
有什么想问的吗？`;

const QUICK_PROMPTS = [
  '去泰国要准备什么',
  '大理住哪里方便',
  '帮我规划3天行程',
  '曼谷美食推荐',
  '日本入境要填什么',
  '带娃出行注意什么',
  '廉航行李怎么省',
  '欧洲防盗有什么习惯',
];

const TYPE_MS = 20;
const FIVE_MIN = 5 * 60 * 1000;

type ChatMessage = {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  createdAt: number;
  places?: AssistantPlaceCard[];
  table?: AssistantTable;
};

function formatClock(ts: number): string {
  const d = new Date(ts);
  const p = (n: number) => String(n).padStart(2, '0');
  return `${p(d.getHours())}:${p(d.getMinutes())}`;
}

function RichBlock({ text }: { text: string }) {
  const blocks = text.split(/\n\n+/);
  return (
    <div className="space-y-2 text-sm leading-relaxed text-white/95">
      {blocks.map((block, bi) => (
        <p key={bi} className="whitespace-pre-wrap">
          {block.split(/(\*\*[^*]+\*\*)/g).map((part, i) => {
            if (part.startsWith('**') && part.endsWith('**')) {
              return (
                <strong key={i} className="font-semibold text-white">
                  {part.slice(2, -2)}
                </strong>
              );
            }
            return <span key={i}>{part}</span>;
          })}
        </p>
      ))}
    </div>
  );
}

function PlaceCards({ items }: { items: AssistantPlaceCard[] }) {
  return (
    <div className="mt-2 flex gap-2 overflow-x-auto pb-1 scrollbar-none">
      {items.map((p) => (
        <div
          key={p.name}
          className="flex w-[min(11rem,calc(100vw-6rem))] shrink-0 overflow-hidden rounded-xl border border-white/10 bg-black/30"
        >
          <div className="relative h-16 w-16 shrink-0">
            <WanderImage
              src={pickCover(p.imageSeed, 128, 128)}
              alt=""
              fallbackLabel={p.name}
              className="h-full w-full"
              width={128}
              height={128}
            />
          </div>
          <div className="flex min-w-0 flex-1 flex-col justify-center px-2 py-1">
            <p className="truncate text-xs font-semibold text-white">{p.name}</p>
            <p className="text-[11px] text-amber-300/95">★ {p.rating}</p>
            {p.distance ? <p className="truncate text-[10px] text-white/55">{p.distance}</p> : null}
          </div>
        </div>
      ))}
    </div>
  );
}

function BudgetTable({ table }: { table: AssistantTable }) {
  return (
    <div className="mt-2 overflow-hidden rounded-xl border border-white/10 bg-black/25">
      <table className="w-full text-left text-xs">
        <thead>
          <tr className="border-b border-white/10 bg-white/[0.06]">
            {table.headers.map((h) => (
              <th key={h} className="px-2 py-2 font-semibold text-white/90">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {table.rows.map((row, ri) => (
            <tr key={ri} className="border-b border-white/[0.06] last:border-0">
              {row.map((cell, ci) => (
                <td key={ci} className="px-2 py-2 text-white/80">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function TypingDots() {
  return (
    <div className="flex items-center gap-1 px-1 py-0.5" aria-hidden>
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="h-1.5 w-1.5 rounded-full bg-white/50"
          style={{
            animation: 'wander-typing-bounce 1s ease-in-out infinite',
            animationDelay: `${i * 0.18}s`,
          }}
        />
      ))}
    </div>
  );
}

export default function AiAssistantPage() {
  const navigate = useNavigate();
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>(() => [
    {
      id: 'welcome',
      role: 'assistant',
      text: WELCOME,
      createdAt: Date.now(),
    },
  ]);
  const [typing, setTyping] = useState(false);
  const [streaming, setStreaming] = useState<{
    id: string;
    full: string;
    shown: number;
    places?: AssistantPlaceCard[];
    table?: AssistantTable;
  } | null>(null);
  const [attachOpen, setAttachOpen] = useState(false);
  const [sendBurst, setSendBurst] = useState(false);
  const [quickKeys, setQuickKeys] = useState(() => QUICK_PROMPTS.map((t, i) => ({ id: `q-${i}`, text: t })));
  const [inputFocus, setInputFocus] = useState(false);

  const scrollBottom = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' });
  }, []);

  useLayoutEffect(() => {
    scrollBottom();
  }, [messages, typing, streaming, scrollBottom]);

  /** 打字机 */
  useEffect(() => {
    if (!streaming || streaming.shown >= streaming.full.length) return;
    const t = window.setTimeout(() => {
      setStreaming((s) => (s ? { ...s, shown: s.shown + 1 } : null));
    }, TYPE_MS);
    return () => window.clearTimeout(t);
  }, [streaming]);

  /** 流式结束 → 写入消息列表 */
  useEffect(() => {
    if (!streaming) return;
    if (streaming.shown < streaming.full.length) return;
    const { id, full, places, table } = streaming;
    setMessages((prev) => {
      if (prev.some((m) => m.id === id)) return prev;
      return [...prev, { id, role: 'assistant', text: full, createdAt: Date.now(), places, table }];
    });
    setStreaming(null);
  }, [streaming]);

  const finalizeUserSend = useCallback((raw: string) => {
    const text = raw.trim();
    if (!text) return;
    const userId = `u-${Date.now()}`;
    setMessages((prev) => [...prev, { id: userId, role: 'user', text, createdAt: Date.now() }]);
    setTyping(true);

    window.setTimeout(() => {
      const { response, places, table } = matchAssistantReply(text);
      setTyping(false);
      const aid = `a-${Date.now()}`;
      setStreaming({
        id: aid,
        full: response,
        shown: 0,
        places,
        table,
      });
    }, 520 + Math.random() * 380);
  }, []);

  const busy = typing || !!streaming;

  const handleSend = () => {
    const t = input.trim();
    if (!t || busy) return;
    setInput('');
    setAttachOpen(false);
    setSendBurst(true);
    window.setTimeout(() => setSendBurst(false), 480);
    finalizeUserSend(t);
  };

  const handleClear = () => {
    setMessages([
      {
        id: `welcome-${Date.now()}`,
        role: 'assistant',
        text: WELCOME,
        createdAt: Date.now(),
      },
    ]);
    setStreaming(null);
    setTyping(false);
    setQuickKeys(QUICK_PROMPTS.map((text, i) => ({ id: `q-${Date.now()}-${i}`, text })));
    toast.message('对话已清空');
  };

  const handleBack = () => {
    if (window.history.length > 1) navigate(-1);
    else navigate('/explore', { replace: true });
  };

  const onQuickPick = (text: string, id: string) => {
    if (busy) return;
    finalizeUserSend(text);
    setQuickKeys((prev) => prev.filter((q) => q.id !== id));
  };

  const simAttach = (label: string, desc: string) => {
    setAttachOpen(false);
    toast.info(label, { description: desc });
  };

  return (
    <motion.div
      initial={{ y: '100%' }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', damping: 30, stiffness: 320 }}
      className="fixed inset-y-0 left-1/2 z-[200] flex w-full max-w-[430px] -translate-x-1/2 flex-col wander-assistant-chat-bg text-white"
    >
      {/* 顶栏 */}
      <header className="flex shrink-0 items-center gap-2 border-b border-white/[0.08] px-2 pb-3 pt-safe">
        <button
          type="button"
          onClick={handleBack}
          className="flex h-10 w-10 items-center justify-center rounded-full text-white/90 transition active:scale-95 hover:bg-white/10"
          aria-label="返回"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div className="relative flex min-w-0 flex-1 items-center gap-2">
          <div className="relative flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-indigo-500 via-violet-500 to-purple-600 shadow-lg shadow-indigo-500/30">
            <span className="pointer-events-none absolute inset-0 z-[1] w-[40%] bg-gradient-to-r from-transparent via-white/35 to-transparent animate-wander-ai-avatar-shimmer" />
            <Bot className="relative z-[2] h-5 w-5 text-white" strokeWidth={2.2} />
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-bold tracking-tight">QL轻旅 助手</p>
            <div className="mt-0.5 flex items-center gap-1.5">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-40" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
              </span>
              <span className="text-[11px] font-medium text-emerald-400/95">在线</span>
            </div>
          </div>
        </div>
        <button
          type="button"
          onClick={handleClear}
          className="flex h-10 w-10 items-center justify-center rounded-full text-white/80 transition active:scale-95 hover:bg-white/10"
          aria-label="清空对话"
        >
          <Trash2 className="h-5 w-5" />
        </button>
      </header>

      {/* 消息 */}
      <div ref={scrollRef} className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-3 py-2">
        <div className="mx-auto flex w-full flex-col gap-2 pb-4">
          {messages.map((m, idx) => {
            const prev = messages[idx - 1];
            const showTime = !prev || m.createdAt - prev.createdAt >= FIVE_MIN;
            return (
              <Fragment key={m.id}>
                {showTime ? (
                  <div className="py-1 text-center text-[11px] text-zinc-500">{formatClock(m.createdAt)}</div>
                ) : null}
                {m.role === 'user' ? (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                    className="flex justify-end"
                  >
                    <div
                      className={cn(
                        'max-w-[70%] rounded-2xl rounded-bl-md px-3.5 py-2.5',
                        'bg-gradient-to-br from-[#6366F1] to-[#8B5CF6] text-white shadow-md shadow-indigo-900/25'
                      )}
                    >
                      <p className="whitespace-pre-wrap text-sm leading-relaxed">{m.text}</p>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                    className="flex justify-start gap-2"
                  >
                    <div className="mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500/90 to-violet-600/90 shadow-md shadow-black/30">
                      <Bot className="h-3.5 w-3.5 text-white" />
                    </div>
                    <div className="max-w-[80%] min-w-0">
                      <div
                        className={cn(
                          'rounded-2xl rounded-br-md border border-white/[0.08]',
                          'bg-white/[0.06] px-3.5 py-2.5 shadow-inner shadow-black/20'
                        )}
                      >
                        <RichBlock text={m.text} />
                        {m.places?.length ? <PlaceCards items={m.places} /> : null}
                        {m.table ? <BudgetTable table={m.table} /> : null}
                      </div>
                    </div>
                  </motion.div>
                )}
              </Fragment>
            );
          })}

          {typing ? (
            <div className="flex justify-start gap-2">
              <div className="mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white/10">
                <Bot className="h-3.5 w-3.5 text-white/70" />
              </div>
              <div className="rounded-2xl rounded-br-md border border-white/[0.08] bg-white/[0.06] px-4 py-3">
                <div className="flex items-center gap-2 text-xs text-white/55">
                  <span>正在输入</span>
                  <TypingDots />
                </div>
              </div>
            </div>
          ) : null}

          {streaming ? (
            <div className="flex justify-start gap-2">
              <div className="mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500/90 to-violet-600/90">
                <Bot className="h-3.5 w-3.5 text-white" />
              </div>
              <div className="max-w-[80%] min-w-0">
                <div
                  className={cn(
                    'rounded-2xl rounded-br-md border border-white/[0.08]',
                    'bg-white/[0.06] px-3.5 py-2.5 shadow-inner shadow-black/20'
                  )}
                >
                  <div className="relative">
                    <RichBlock text={streaming.full.slice(0, streaming.shown)} />
                    {streaming.shown < streaming.full.length ? (
                      <span className="ml-0.5 inline-block h-3 w-0.5 animate-pulse bg-indigo-300 align-middle" />
                    ) : null}
                  </div>
                  {streaming.shown >= streaming.full.length && streaming.places?.length ? (
                    <PlaceCards items={streaming.places} />
                  ) : null}
                  {streaming.shown >= streaming.full.length && streaming.table ? (
                    <BudgetTable table={streaming.table} />
                  ) : null}
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </div>

      {/* 快捷问题 */}
      <div className="shrink-0 border-t border-white/[0.06] bg-black/20 px-2 py-2">
        <div className="mx-auto flex w-full gap-2 overflow-x-auto pb-1 scrollbar-none">
          {quickKeys.map((q) => (
            <motion.button
              key={q.id}
              type="button"
              layout
              onClick={() => onQuickPick(q.text, q.id)}
              whileTap={{ scale: 0.94 }}
              className={cn(
                'shrink-0 rounded-full border border-indigo-500/50 px-3 py-1.5 text-xs font-medium',
                'text-indigo-100 transition hover:border-indigo-400 hover:bg-indigo-500/20 active:bg-indigo-500/30'
              )}
            >
              {q.text}
            </motion.button>
          ))}
        </div>
      </div>

      {/* 展开功能 */}
      {attachOpen ? (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          className="shrink-0 overflow-hidden border-t border-white/[0.06] bg-black/25 px-3 py-2"
        >
          <div className="mx-auto grid w-full grid-cols-2 gap-2 text-xs">
            <button
              type="button"
              className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2.5 text-left transition hover:bg-white/[0.08]"
              onClick={() => simAttach('发送图片', '演示：将分析照片中的景点与光线时段。')}
            >
              <ImageIcon className="h-4 w-4 shrink-0 text-indigo-300" />
              发送图片
            </button>
            <button
              type="button"
              className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2.5 text-left transition hover:bg-white/[0.08]"
              onClick={() => simAttach('语音输入', '演示：将把你的语音转成文字并发送。')}
            >
              <Mic className="h-4 w-4 shrink-0 text-violet-300" />
              语音输入
            </button>
            <button
              type="button"
              className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2.5 text-left transition hover:bg-white/[0.08]"
              onClick={() => simAttach('发送位置', '演示：将基于当前位置推荐附近步行可达景点。')}
            >
              <MapPin className="h-4 w-4 shrink-0 text-emerald-300" />
              发送位置
            </button>
            <button
              type="button"
              className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2.5 text-left transition hover:bg-white/[0.08]"
              onClick={() => {
                setAttachOpen(false);
                setInput((prev) =>
                  prev
                    ? `${prev}\n\n（从行程导入）帮我看看下面这段行程有没有不合理的地方：\n- Day1 古城\n- Day2 洱海东线`
                    : '（从行程导入）帮我看看下面这段行程有没有不合理的地方：\n- Day1 古城\n- Day2 洱海东线'
                );
                toast.info('已从行程导入', { description: '演示：已将示例行程要点填入输入框。' });
                inputRef.current?.focus();
              }}
            >
              <ClipboardList className="h-4 w-4 shrink-0 text-amber-200" />
              从行程导入
            </button>
          </div>
        </motion.div>
      ) : null}

      {/* 输入区 */}
      <div className="shrink-0 border-t border-white/[0.08] bg-black/40 px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-2">
        <div className="mx-auto flex w-full items-end gap-2">
          <button
            type="button"
            onClick={() => setAttachOpen((o) => !o)}
            className={cn(
              'mb-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border transition',
              attachOpen
                ? 'border-indigo-500/60 bg-indigo-500/20 text-white'
                : 'border-white/10 bg-[#1A1A1A] text-white/80 hover:bg-white/10'
            )}
            aria-label="更多"
          >
            <Plus className="h-5 w-5" />
          </button>
          <div className="relative min-w-0 flex-1">
            <textarea
              ref={inputRef}
              rows={1}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  if (!busy) handleSend();
                }
              }}
              onFocus={() => setInputFocus(true)}
              onBlur={() => setInputFocus(false)}
              placeholder="问 anything..."
              className={cn(
                'max-h-28 min-h-[44px] w-full resize-none rounded-[24px] border px-4 py-2.5 text-sm text-white',
                'bg-[#1A1A1A] placeholder:text-zinc-500 focus:outline-none',
                inputFocus ? 'border-[#6366F1] ring-1 ring-indigo-500/35' : 'border-white/10'
              )}
            />
          </div>
          <motion.button
            type="button"
            onClick={handleSend}
            disabled={busy}
            whileTap={busy ? undefined : { scale: 0.9 }}
            className={cn(
              'relative mb-1 flex h-11 w-11 shrink-0 items-center justify-center overflow-visible rounded-full bg-gradient-to-br from-[#6366F1] to-[#8B5CF6] text-white shadow-lg shadow-indigo-600/30',
              busy && 'opacity-45'
            )}
            aria-label="发送"
          >
            <Send className={cn('relative z-[1] h-4 w-4', sendBurst && 'animate-wander-send-plane')} />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
