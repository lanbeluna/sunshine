import { useCallback, useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Bot, ClipboardList, Image as ImageIcon, MapPin, Mic, Plus, Send, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { WanderImage } from '@/components/media/WanderImage';
import { toast } from '@/lib/toast';
import { matchAssistantReply, type AssistantPlaceCard, type AssistantTable } from '@/lib/aiAssistantQa';
import { pickCover } from '@/lib/unsplashPools';
import { cn } from '@/lib/utils';

const WELCOME = `你好，我是 QL轻旅助手。\n\n可以问我行前准备、住宿区域、美食清单或路线安排，我会按你的预算给出清晰建议。`;

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

const QUICK_PROMPT_ICONS = ['🧳', '🏡', '🗺️', '🍜', '🛂', '👨‍👩‍👧', '🎒', '🔒'];
const TYPE_MS = 14;

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
    <div className="space-y-2 text-sm leading-relaxed text-slate-700">
      {blocks.map((block, bi) => (
        <p key={bi} className="whitespace-pre-wrap">
          {block.split(/(\*\*[^*]+\*\*)/g).map((part, i) => {
            if (part.startsWith('**') && part.endsWith('**')) {
              return (
                <strong key={i} className="font-black text-slate-950">
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
        <div key={p.name} className="flex w-[min(11rem,calc(100vw-6rem))] shrink-0 overflow-hidden rounded-xl border border-white/80 bg-white/76 shadow-sm">
          <div className="relative h-16 w-16 shrink-0">
            <WanderImage src={pickCover(p.imageSeed, 128, 128)} alt="" fallbackLabel={p.name} className="h-full w-full" width={128} height={128} />
          </div>
          <div className="flex min-w-0 flex-1 flex-col justify-center px-2 py-1">
            <p className="truncate text-xs font-black text-slate-900">{p.name}</p>
            <p className="text-[11px] font-bold text-amber-500">★ {p.rating}</p>
            {p.distance ? <p className="truncate text-[10px] font-semibold text-slate-400">{p.distance}</p> : null}
          </div>
        </div>
      ))}
    </div>
  );
}

function BudgetTable({ table }: { table: AssistantTable }) {
  return (
    <div className="mt-2 overflow-hidden rounded-xl border border-white/80 bg-white/65 shadow-sm">
      <table className="w-full text-left text-xs">
        <thead>
          <tr className="border-b border-rose-100 bg-rose-50/80">
            {table.headers.map((h) => (
              <th key={h} className="px-2 py-2 font-black text-slate-800">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {table.rows.map((row, ri) => (
            <tr key={ri} className="border-b border-slate-100 last:border-0">
              {row.map((cell, ci) => (
                <td key={ci} className="px-2 py-2 font-medium text-slate-600">
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
        <span key={i} className="h-1.5 w-1.5 rounded-full bg-wander-coral/70" style={{ animation: 'wander-typing-bounce 1s ease-in-out infinite', animationDelay: `${i * 0.18}s` }} />
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
    { id: 'welcome', role: 'assistant', text: WELCOME, createdAt: Date.now() },
  ]);
  const [typing, setTyping] = useState(false);
  const [streaming, setStreaming] = useState<{ id: string; full: string; shown: number; places?: AssistantPlaceCard[]; table?: AssistantTable } | null>(null);
  const [attachOpen, setAttachOpen] = useState(false);
  const [quickKeys, setQuickKeys] = useState(() => QUICK_PROMPTS.map((text, i) => ({ id: `q-${i}`, text })));
  const isFreshChat = messages.length === 1 && messages[0]?.role === 'assistant' && !typing && !streaming;
  const busy = typing || !!streaming;

  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' });
  }, [messages, typing, streaming]);

  useEffect(() => {
    if (!streaming || streaming.shown >= streaming.full.length) return;
    const t = window.setTimeout(() => setStreaming((s) => (s ? { ...s, shown: s.shown + 1 } : null)), TYPE_MS);
    return () => window.clearTimeout(t);
  }, [streaming]);

  useEffect(() => {
    if (!streaming || streaming.shown < streaming.full.length) return;
    const { id, full, places, table } = streaming;
    const t = window.setTimeout(() => {
      setMessages((prev) => (prev.some((m) => m.id === id) ? prev : [...prev, { id, role: 'assistant', text: full, createdAt: Date.now(), places, table }]));
      setStreaming(null);
    }, 0);
    return () => window.clearTimeout(t);
  }, [streaming]);

  const finalizeUserSend = useCallback((raw: string) => {
    const text = raw.trim();
    if (!text) return;
    setMessages((prev) => [...prev, { id: `u-${Date.now()}`, role: 'user', text, createdAt: Date.now() }]);
    setTyping(true);
    window.setTimeout(() => {
      const { response, places, table } = matchAssistantReply(text);
      setTyping(false);
      setStreaming({ id: `a-${Date.now()}`, full: response, shown: 0, places, table });
    }, 420 + Math.random() * 260);
  }, []);

  const handleSend = () => {
    if (!input.trim() || busy) return;
    const text = input;
    setInput('');
    setAttachOpen(false);
    finalizeUserSend(text);
  };

  const handleClear = () => {
    setMessages([{ id: `welcome-${Date.now()}`, role: 'assistant', text: WELCOME, createdAt: Date.now() }]);
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
    <div className="fixed inset-y-0 left-1/2 z-[200] w-dvw max-w-[430px] -translate-x-1/2 overflow-hidden">
      <motion.div initial={{ y: '100%' }} animate={{ y: 0 }} transition={{ type: 'spring', damping: 30, stiffness: 320 }} className="ql-soft-surface flex h-full w-full flex-col text-slate-900">
        <header className="flex shrink-0 items-center gap-2 border-b border-white/70 bg-white/78 px-2 pb-3 pt-safe shadow-sm shadow-rose-100/40 backdrop-blur-xl">
          <button type="button" onClick={handleBack} className="ql-focus flex h-10 w-10 items-center justify-center rounded-full text-slate-600 transition-colors active:scale-95 hover:bg-white/60" aria-label="返回">
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div className="relative flex min-w-0 flex-1 items-center gap-2">
            <div className="relative flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-sky-300 via-violet-400 to-rose-300 shadow-lg shadow-violet-200/40">
              <Bot className="relative z-[2] h-5 w-5 text-white" strokeWidth={2.2} />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-black tracking-tight text-slate-950">QL轻旅助手</p>
              <div className="mt-0.5 flex items-center gap-1.5">
                <span className="relative flex h-2 w-2"><span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-40" /><span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" /></span>
                <span className="text-[11px] font-bold text-emerald-500">在线</span>
              </div>
            </div>
          </div>
          <button type="button" onClick={handleClear} className="ql-focus flex h-10 w-10 items-center justify-center rounded-full text-slate-500 transition-colors active:scale-95 hover:bg-white/60" aria-label="清空对话">
            <Trash2 className="h-5 w-5" />
          </button>
        </header>

        <div ref={scrollRef} className="ql-soft-surface min-h-0 flex-1 overflow-y-auto overscroll-contain px-3 py-3">
          <div className="mx-auto flex w-full flex-col gap-2 pb-4">
            {isFreshChat ? (
              <section className="px-1 pt-2">
                <div className="overflow-hidden rounded-[1.75rem] border border-white/80 bg-white/72 p-4 shadow-2xl shadow-rose-100/40 backdrop-blur-xl">
                  <div className="flex items-start gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-300 via-violet-400 to-rose-300 shadow-lg shadow-violet-200/35">
                      <Bot className="h-5 w-5 text-white" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-base font-black text-slate-950">我是你的轻旅行助手</p>
                      <p className="mt-1 text-sm leading-relaxed text-slate-500">问我行前准备、住宿区域、美食清单或路线安排，我会按你的预算给你一个可执行建议。</p>
                    </div>
                  </div>
                  <div className="mt-4 grid grid-cols-2 gap-2">
                    {quickKeys.slice(0, 4).map((q, i) => (
                      <motion.button key={q.id} type="button" layout onClick={() => onQuickPick(q.text, q.id)} whileTap={{ scale: 0.96 }} className="ql-focus min-h-[58px] rounded-2xl border border-white/80 bg-white/65 px-3 py-2 text-left text-xs font-bold leading-snug text-slate-700 shadow-sm transition-colors active:bg-rose-50">
                        <span className="mb-1 block text-base leading-none" aria-hidden>{QUICK_PROMPT_ICONS[i]}</span>
                        {q.text}
                      </motion.button>
                    ))}
                  </div>
                </div>
              </section>
            ) : null}

            {!isFreshChat && messages.map((m, idx) => (
              <div key={m.id} className={cn('flex', m.role === 'user' ? 'justify-end' : 'justify-start gap-2')}>
                {m.role === 'assistant' ? <div className="mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-sky-300 to-violet-400"><Bot className="h-3.5 w-3.5 text-white" /></div> : null}
                <div className={cn('max-w-[80%]', m.role === 'user' && 'max-w-[70%]')}>
                  {idx === 0 ? <div className="mb-1 text-center text-[11px] text-slate-400">{formatClock(m.createdAt)}</div> : null}
                  <div className={cn('rounded-2xl px-3.5 py-2.5 shadow-sm', m.role === 'user' ? 'rounded-bl-md bg-gradient-to-br from-wander-coral to-orange-400 text-white shadow-rose-200/60' : 'rounded-br-md border border-white/80 bg-white/72')}>
                    {m.role === 'user' ? <p className="whitespace-pre-wrap text-sm leading-relaxed">{m.text}</p> : <RichBlock text={m.text} />}
                    {m.places?.length ? <PlaceCards items={m.places} /> : null}
                    {m.table ? <BudgetTable table={m.table} /> : null}
                  </div>
                </div>
              </div>
            ))}

            {typing ? <div className="flex justify-start gap-2"><div className="mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white/70"><Bot className="h-3.5 w-3.5 text-slate-500" /></div><div className="rounded-2xl rounded-br-md border border-white/80 bg-white/72 px-4 py-3"><div className="flex items-center gap-2 text-xs font-semibold text-slate-500"><span>正在输入</span><TypingDots /></div></div></div> : null}

            {streaming ? (
              <div className="flex justify-start gap-2">
                <div className="mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-sky-300 to-violet-400"><Bot className="h-3.5 w-3.5 text-white" /></div>
                <div className="max-w-[80%] min-w-0 rounded-2xl rounded-br-md border border-white/80 bg-white/72 px-3.5 py-2.5 shadow-sm">
                  <RichBlock text={streaming.full.slice(0, streaming.shown)} />
                  {streaming.shown < streaming.full.length ? <span className="ml-0.5 inline-block h-3 w-0.5 animate-pulse bg-wander-coral align-middle" /> : null}
                  {streaming.shown >= streaming.full.length && streaming.places?.length ? <PlaceCards items={streaming.places} /> : null}
                  {streaming.shown >= streaming.full.length && streaming.table ? <BudgetTable table={streaming.table} /> : null}
                </div>
              </div>
            ) : null}
          </div>
        </div>

        <div className={cn('shrink-0 border-t border-white/70 bg-white/60 px-2 py-2 backdrop-blur-xl', isFreshChat && 'hidden')}>
          <div className="mx-auto flex w-full gap-2 overflow-x-auto pb-1 scrollbar-none">
            {quickKeys.map((q) => (
              <motion.button key={q.id} type="button" layout onClick={() => onQuickPick(q.text, q.id)} whileTap={{ scale: 0.94 }} className="shrink-0 rounded-full border border-white/80 bg-white/65 px-3 py-1.5 text-xs font-bold text-slate-600 shadow-sm transition active:bg-rose-50">
                {q.text}
              </motion.button>
            ))}
          </div>
        </div>

        {attachOpen ? (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} className="shrink-0 overflow-hidden border-t border-white/70 bg-white/65 px-3 py-2 backdrop-blur-xl">
            <div className="mx-auto grid w-full grid-cols-2 gap-2 text-xs">
              <button type="button" className="ql-focus flex items-center gap-2 rounded-xl border border-white/80 bg-white/70 px-3 py-2.5 text-left font-bold text-slate-600 shadow-sm" onClick={() => simAttach('发送图片', '演示：后续可分析照片中的景点与光线时段。')}><ImageIcon className="h-4 w-4 shrink-0 text-sky-500" />发送图片</button>
              <button type="button" className="ql-focus flex items-center gap-2 rounded-xl border border-white/80 bg-white/70 px-3 py-2.5 text-left font-bold text-slate-600 shadow-sm" onClick={() => simAttach('语音输入', '演示：后续可将语音转成文字并发送。')}><Mic className="h-4 w-4 shrink-0 text-violet-500" />语音输入</button>
              <button type="button" className="ql-focus flex items-center gap-2 rounded-xl border border-white/80 bg-white/70 px-3 py-2.5 text-left font-bold text-slate-600 shadow-sm" onClick={() => simAttach('发送位置', '演示：后续可基于当前位置推荐附近步行可达的灵感点。')}><MapPin className="h-4 w-4 shrink-0 text-emerald-500" />发送位置</button>
              <button type="button" className="ql-focus flex items-center gap-2 rounded-xl border border-white/80 bg-white/70 px-3 py-2.5 text-left font-bold text-slate-600 shadow-sm" onClick={() => { setAttachOpen(false); setInput('帮我看看这段行程有没有不合理的地方：\n- Day1 古城散步\n- Day2 海边慢游'); inputRef.current?.focus(); }}><ClipboardList className="h-4 w-4 shrink-0 text-amber-500" />导入行程</button>
            </div>
          </motion.div>
        ) : null}

        <div className="shrink-0 border-t border-white/70 bg-white/78 px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-2 shadow-[0_-12px_30px_rgba(244,114,182,0.08)] backdrop-blur-xl">
          <div className="mx-auto flex w-full items-end gap-2">
            <button type="button" onClick={() => setAttachOpen((o) => !o)} className={cn('ql-focus mb-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border transition-colors', attachOpen ? 'border-sky-300 bg-sky-100 text-sky-600' : 'border-white/80 bg-white/70 text-slate-500 shadow-sm')} aria-label="更多">
              <Plus className="h-5 w-5" />
            </button>
            <textarea ref={inputRef} rows={1} value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); if (!busy) handleSend(); } }} placeholder="问 anything..." className="ql-focus max-h-24 min-h-[42px] min-w-0 flex-1 resize-none rounded-[24px] border border-white/80 bg-white/75 px-4 py-2.5 text-sm font-semibold text-slate-800 shadow-sm placeholder:text-slate-400 focus:border-wander-coral/40" />
            <motion.button type="button" onClick={handleSend} disabled={busy} whileTap={busy ? undefined : { scale: 0.9 }} className={cn('ql-focus mb-1 flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-wander-coral to-orange-400 text-white shadow-lg shadow-rose-300/40', busy && 'opacity-45')} aria-label="发送">
              <Send className="h-4 w-4" />
            </motion.button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
