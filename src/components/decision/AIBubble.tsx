import { Sparkles } from 'lucide-react';
import { useTypewriter } from '@/hooks/useTypewriter';

export function AIBubble({ question }: { question: string }) {
  const typed = useTypewriter(question, 26);

  return (
    <div className="flex gap-3 px-4 pb-5">
      <div
        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-wander-brand via-wander-violet to-wander-lilac shadow-wander-glow"
        aria-hidden
      >
        <Sparkles className="h-5 w-5 text-white" />
      </div>
      <div className="relative max-w-[min(100%,20rem)] rounded-2xl rounded-tl-sm border border-white/10 bg-wander-card px-4 py-3 text-sm leading-relaxed text-white shadow-inner">
        <span>{typed}</span>
        <span className="ml-0.5 inline-block h-4 w-0.5 animate-pulse bg-indigo-400 align-middle" aria-hidden />
      </div>
    </div>
  );
}
