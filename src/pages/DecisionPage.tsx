import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useInboxUnread } from '@/hooks/useInboxUnread';
import { toast } from '@/lib/toast';
import { AIBubble } from '@/components/decision/AIBubble';
import { BlindBoxCard } from '@/components/decision/BlindBoxCard';
import { DecisionRecentStrip } from '@/components/decision/DecisionRecentStrip';
import { DecisionShortcutsStrip } from '@/components/decision/DecisionShortcutsStrip';
import { DecisionEmptyState } from '@/components/decision/DecisionEmptyState';
import { DecisionHeader } from '@/components/decision/DecisionHeader';
import { DurationPicker } from '@/components/decision/DurationPicker';
import { LoadingScreen } from '@/components/decision/LoadingScreen';
import { OptionGrid, type OptionItem } from '@/components/decision/OptionGrid';
import { ResultView } from '@/components/decision/ResultView';
import { StepDots } from '@/components/decision/StepDots';
import { WelcomeBlock } from '@/components/decision/WelcomeBlock';
import { PageContainer } from '@/components/layout/PageContainer';
import { QA_QUESTIONS } from '@/data/questions';
import { useDecision } from '@/hooks/useDecision';
import { appendDecisionHistoryRecord } from '@/lib/decisionHistoryStore';
import { cn } from '@/lib/utils';
import type { Budget, Companion, Mood, Transport } from '@/types/decision';

const MOODS: OptionItem<Mood>[] = [
  { value: 'relax', emoji: '🌿', label: '放松治愈' },
  { value: 'adventure', emoji: '🔥', label: '热血冒险' },
  { value: 'photo', emoji: '📸', label: '打卡出片' },
  { value: 'food', emoji: '🍜', label: '美食探店' },
];

const BUDGETS: OptionItem<Budget>[] = [
  { value: 'low', emoji: '💰', label: '穷游党' },
  { value: 'medium', emoji: '💰💰', label: '性价比' },
  { value: 'high', emoji: '💰💰💰', label: '品质游' },
  { value: 'luxury', emoji: '💰💰💰💰', label: '不差钱' },
];

const COMPANIONS: OptionItem<Companion>[] = [
  { value: 'solo', emoji: '🧍', label: '独自' },
  { value: 'couple', emoji: '👫', label: '情侣' },
  { value: 'family', emoji: '👨‍👩‍👧‍👦', label: '家庭' },
  { value: 'friends', emoji: '🧑‍🤝‍🧑', label: '朋友' },
];

const TRANSPORTS: OptionItem<Transport>[] = [
  { value: 'train', emoji: '🚄', label: '高铁' },
  { value: 'plane', emoji: '✈️', label: '飞机' },
  { value: 'drive', emoji: '🚗', label: '自驾' },
  { value: 'bus', emoji: '🚌', label: '大巴随便' },
];

const DEC_FLOW = {
  container: {
    hidden: {},
    show: {
      transition: { staggerChildren: 0.1, delayChildren: 0.06 },
    },
  },
  item: {
    hidden: { opacity: 0, y: 20 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] as const },
    },
  },
} as const;

export default function DecisionPage() {
  const navigate = useNavigate();
  const inboxUnread = useInboxUnread();
  const d = useDecision();
  const historyLoggedKey = useRef<string | null>(null);
  const [idleHistoryTick, setIdleHistoryTick] = useState(0);

  useEffect(() => {
    if (d.phase === 'idle') {
      historyLoggedKey.current = null;
      setIdleHistoryTick((t) => t + 1);
    }
  }, [d.phase]);

  useEffect(() => {
    if (d.phase !== 'result' || !d.result) return;
    const key = `${d.result.id}-${d.matchPercent}`;
    if (historyLoggedKey.current === key) return;
    historyLoggedKey.current = key;
    appendDecisionHistoryRecord({
      destinationId: d.result.id,
      matchPercent: d.matchPercent,
      at: new Date().toISOString(),
    });
  }, [d.phase, d.result, d.matchPercent]);

  const blindDisabled = d.phase === 'loading' || d.phase === 'result';

  const openDestinationDetail = () => {
    if (!d.result) return;
    navigate(`/destination/${d.result.id}`, { state: { matchPercent: d.matchPercent } });
  };

  const handleReset = () => {
    d.goIdle();
    toast.message('已重新决策', { description: '返回首页，可再次问答或使用盲盒。' });
  };

  const handleFavorite = () => {
    const willFavorite = !d.favorited;
    d.toggleFavorite();
    toast.success(willFavorite ? '已收藏目的地' : '已取消收藏', {
      description: willFavorite ? '已写入本浏览器 localStorage，刷新后仍保留。' : '可随时再次点亮心形收藏。',
    });
  };

  const startWithHint = () => {
    toast.success('开始问答决策', { description: '共 5 步，完成后将展示匹配目的地与行程速览。' });
    d.startQA();
  };

  const blindWithHint = () => {
    d.beginBlindFlip();
  };

  const handleNext = () => {
    if (d.phase === 'qa' && d.step === 4 && d.canNext) {
      toast.success('正在生成方案', { description: '约 2 秒后展示目的地与行程速览。' });
    }
    d.nextStep();
  };

  return (
    <PageContainer className="relative wander-decision-scene">
      <div className="relative z-[1]">
        <DecisionHeader
          hasUnread={inboxUnread > 0}
          onNotifyClick={() => navigate('/messages')}
        />

        {(d.phase === 'idle' || d.phase === 'qa') && (
          <motion.div
            key={d.phase}
            variants={DEC_FLOW.container}
            initial="hidden"
            animate="show"
            className="relative z-[1]"
          >
            <motion.div variants={DEC_FLOW.item}>
              <WelcomeBlock />
            </motion.div>

            {d.phase === 'idle' && (
              <>
                <motion.div variants={DEC_FLOW.item}>
                  <DecisionEmptyState onStart={startWithHint} />
                </motion.div>
                <motion.div variants={DEC_FLOW.item}>
                  <BlindBoxCard
                    flipped={d.blindFlipped}
                    disabled={blindDisabled}
                    preview={d.blindPreview}
                    onActivate={blindWithHint}
                  />
                </motion.div>
                <motion.div variants={DEC_FLOW.item}>
                  <DecisionShortcutsStrip disabled={blindDisabled} onPick={d.runQuickDecision} />
                </motion.div>
                <motion.div variants={DEC_FLOW.item}>
                  <DecisionRecentStrip refreshKey={idleHistoryTick} />
                </motion.div>
              </>
            )}

            {d.phase === 'qa' && (
              <motion.div variants={DEC_FLOW.item} className="relative z-[1]">
                <div className="mt-2">
                  <StepDots step={d.step} />
                </div>
                <AIBubble question={QA_QUESTIONS[d.step] ?? ''} />
                {d.step === 0 && (
                  <OptionGrid options={MOODS} selected={d.draft.mood} onSelect={d.setMood} />
                )}
                {d.step === 1 && (
                  <OptionGrid options={BUDGETS} selected={d.draft.budget} onSelect={d.setBudget} />
                )}
                {d.step === 2 && (
                  <DurationPicker value={d.draft.duration} onChange={d.setDuration} />
                )}
                {d.step === 3 && (
                  <OptionGrid options={COMPANIONS} selected={d.draft.companion} onSelect={d.setCompanion} />
                )}
                {d.step === 4 && (
                  <OptionGrid options={TRANSPORTS} selected={d.draft.transport} onSelect={d.setTransport} />
                )}
                <div className="mt-6 px-4 pb-4 pt-2">
                  <motion.button
                    type="button"
                    whileTap={{ scale: d.canNext ? 0.98 : 1 }}
                    disabled={!d.canNext}
                    onClick={handleNext}
                    className={cn(
                      'h-12 w-full rounded-xl font-semibold text-white transition',
                      d.canNext
                        ? 'bg-gradient-to-r from-indigo-500 to-purple-500 shadow-lg shadow-indigo-500/25'
                        : 'cursor-not-allowed bg-wander-surface text-wander-muted opacity-60'
                    )}
                  >
                    下一步
                  </motion.button>
                </div>
                <BlindBoxCard
                  flipped={d.blindFlipped}
                  disabled={blindDisabled}
                  preview={d.blindPreview}
                  onActivate={blindWithHint}
                />
              </motion.div>
            )}
          </motion.div>
        )}

        {d.phase === 'result' && d.result && (
          <ResultView
            destination={d.result}
            matchPercent={d.matchPercent}
            favorited={d.favorited}
            onReset={handleReset}
            onToggleFavorite={handleFavorite}
            onViewItinerary={openDestinationDetail}
          />
        )}
      </div>

      <AnimatePresence>{d.phase === 'loading' && <LoadingScreen />}</AnimatePresence>
    </PageContainer>
  );
}
