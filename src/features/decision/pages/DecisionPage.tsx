import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useInboxUnread } from '@/hooks/useInboxUnread';
import { toast } from '@/lib/toast';
import { AIBubble } from '@/features/decision/components/AIBubble';
import { BlindBoxCard } from '@/features/decision/components/BlindBoxCard';
import { DecisionRecentStrip } from '@/features/decision/components/DecisionRecentStrip';
import { DecisionShortcutsStrip } from '@/features/decision/components/DecisionShortcutsStrip';
import { DecisionEmptyState } from '@/features/decision/components/DecisionEmptyState';
import { DecisionHeader } from '@/features/decision/components/DecisionHeader';
import { DurationPicker } from '@/features/decision/components/DurationPicker';
import { LoadingScreen } from '@/features/decision/components/LoadingScreen';
import { MultiSelectChips, type ChipOption } from '@/features/decision/components/MultiSelectChips';
import { OptionGrid, type OptionItem } from '@/features/decision/components/OptionGrid';
import { ResultView } from '@/features/decision/components/ResultView';
import { StepDots } from '@/features/decision/components/StepDots';
import { WelcomeBlock } from '@/features/decision/components/WelcomeBlock';
import { PageContainer } from '@/components/layout/PageContainer';
import { QA_QUESTIONS } from '@/data/questions';
import { useDecision } from '@/hooks/useDecision';
import {
  createItineraryDraft,
  createJournalDraft,
  saveDestinationInspiration,
} from '@/features/decision/services/inspirationSaves';
import { appendDecisionHistoryRecord } from '@/lib/decisionHistoryStore';
import { cn } from '@/lib/utils';
import type { Budget, Companion, Mood, PreferredActivity, TravelSeason, Transport } from '@/types/decision';

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

const SEASONS: OptionItem<TravelSeason>[] = [
  { value: 'spring', emoji: '🌿', label: '春天出发' },
  { value: 'summer', emoji: '☀️', label: '夏天假期' },
  { value: 'autumn', emoji: '🍁', label: '秋天最舒服' },
  { value: 'winter', emoji: '❄️', label: '冬天也想走' },
  { value: 'any', emoji: '✨', label: '时间都可以' },
];

const ACTIVITIES: ChipOption<PreferredActivity>[] = [
  { value: 'food', emoji: '🍜', label: '美食探店' },
  { value: 'photo', emoji: '📷', label: '拍照出片' },
  { value: 'nature', emoji: '🏞️', label: '自然风景' },
  { value: 'culture', emoji: '🏛️', label: '城市文化' },
  { value: 'shopping', emoji: '🛍️', label: '逛街买物' },
  { value: 'slow', emoji: '☕', label: '慢慢放空' },
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

function preferenceQuestion(step: number): string {
  const questions = [
    '这趟旅行想要什么感觉？',
    '大概预算放在哪个区间？',
    '准备玩多久？',
    '更想哪个季节出发？',
    '这次和谁一起去？',
    '最想把时间花在哪些体验上？',
    '偏好的交通方式是什么？',
  ];
  return questions[step] ?? '继续完善你的旅行偏好';
}

export default function DecisionPage() {
  const navigate = useNavigate();
  const inboxUnread = useInboxUnread();
  const d = useDecision();
  const historyLoggedKey = useRef<string | null>(null);
  const [savingAction, setSavingAction] = useState<'favorite' | 'itinerary' | 'journal' | null>(null);

  useEffect(() => {
    if (d.phase === 'idle') {
      historyLoggedKey.current = null;
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

  const handleSaveItineraryDraft = async () => {
    if (!d.result) return;
    setSavingAction('itinerary');
    const { trip, sync } = await createItineraryDraft(d.result);
    setSavingAction(null);
    toast.success('行程草稿已生成', {
      description:
        sync.source === 'supabase'
          ? `已同步到云端：${trip.destination}`
          : `已保存到本地演示数据：${trip.destination}`,
    });
  };

  const handleSaveJournalDraft = async () => {
    if (!d.result) return;
    setSavingAction('journal');
    const { note, sync } = await createJournalDraft(d.result, d.profile);
    setSavingAction(null);
    toast.success('手记草稿已写入', {
      description:
        sync.source === 'supabase'
          ? `已同步到云端：${note.title}`
          : `可在「我的」里的草稿箱继续整理：${note.title}`,
    });
  };

  const handleSaveDestination = async () => {
    if (!d.result) return;
    setSavingAction('favorite');
    if (!d.favorited) d.toggleFavorite();
    const sync = await saveDestinationInspiration(d.result);
    setSavingAction(null);
    toast.success('目的地已收藏', {
      description:
        sync.source === 'supabase'
          ? '已同步到 Supabase，也可以在「我的收藏」查看。'
          : '已使用本地演示数据兜底，可以在「我的收藏」查看。',
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
    if (d.phase === 'qa' && d.step === 6 && d.canNext) {
      toast.success('正在生成方案', { description: '约 2 秒后展示目的地与行程速览。' });
    }
    const moved = d.nextStep();
    if (!moved && d.validationMessage) {
      toast.error(d.validationMessage);
    }
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
                  <DecisionRecentStrip refreshKey={d.phase} />
                </motion.div>
              </>
            )}

            {d.phase === 'qa' && (
              <motion.div variants={DEC_FLOW.item} className="relative z-[1]">
                <div className="mt-2">
                  <StepDots step={d.step} total={7} />
                </div>
                <AIBubble question={QA_QUESTIONS[d.step] ?? preferenceQuestion(d.step)} />
                {d.validationMessage ? (
                  <p className="mx-4 mt-2 rounded-xl border border-rose-400/25 bg-rose-500/10 px-3 py-2 text-xs font-medium text-rose-100">
                    {d.validationMessage}
                  </p>
                ) : null}
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
                  <OptionGrid options={SEASONS} selected={d.draft.season} onSelect={d.setSeason} />
                )}
                {d.step === 4 && (
                  <OptionGrid options={COMPANIONS} selected={d.draft.companion} onSelect={d.setCompanion} />
                )}
                {d.step === 5 && (
                  <MultiSelectChips
                    options={ACTIVITIES}
                    selected={d.draft.activities ?? []}
                    onChange={d.setActivities}
                  />
                )}
                {d.step === 6 && (
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
            onToggleFavorite={handleSaveDestination}
            onViewItinerary={openDestinationDetail}
            onSaveItineraryDraft={handleSaveItineraryDraft}
            onSaveJournalDraft={handleSaveJournalDraft}
            savingAction={savingAction}
          />
        )}
      </div>

      <AnimatePresence>{d.phase === 'loading' && <LoadingScreen />}</AnimatePresence>
    </PageContainer>
  );
}
