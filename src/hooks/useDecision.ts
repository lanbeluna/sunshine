import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { matchDestination, randomDestination } from '@/lib/decisionEngine';
import { isDestinationFavorited, toggleDestinationFavorite } from '@/lib/wanderStorage';
import { validatePreferenceStep } from '@/features/decision/services/preferenceValidation';
import type {
  Budget,
  Companion,
  DecisionPhase,
  Destination,
  Duration,
  Mood,
  PreferredActivity,
  TravelSeason,
  Transport,
  UserDecisionProfile,
} from '@/types/decision';

const LOADING_MS = 2200;

const BLIND_PROCEED_MS = 2800;

export function useDecision() {
  const blindProceedTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const loadingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearBlindProceedTimer = useCallback(() => {
    if (blindProceedTimerRef.current != null) {
      window.clearTimeout(blindProceedTimerRef.current);
      blindProceedTimerRef.current = null;
    }
  }, []);

  const clearDecisionTimeouts = useCallback(() => {
    clearBlindProceedTimer();
    if (loadingTimeoutRef.current != null) {
      window.clearTimeout(loadingTimeoutRef.current);
      loadingTimeoutRef.current = null;
    }
  }, [clearBlindProceedTimer]);

  const [phase, setPhase] = useState<DecisionPhase>('idle');
  const [step, setStep] = useState(0);
  const [draft, setDraft] = useState<Partial<UserDecisionProfile>>({});
  const [result, setResult] = useState<Destination | null>(null);
  const [matchPercent, setMatchPercent] = useState(96);
  const [favorited, setFavorited] = useState(false);
  const [blindFlipped, setBlindFlipped] = useState(false);
  const [blindPreview, setBlindPreview] = useState<Destination | null>(null);
  const [validationMessage, setValidationMessage] = useState<string | null>(null);

  const profile = useMemo((): UserDecisionProfile | null => {
    const { mood, budget, duration, companion, transport } = draft;
    if (!mood || !budget || !duration || !companion || !transport) return null;
    return {
      mood,
      budget,
      duration,
      companion,
      transport,
      season: draft.season,
      activities: draft.activities,
    };
  }, [draft]);

  const startQA = useCallback(() => {
    clearDecisionTimeouts();
    setDraft({});
    setStep(0);
    setPhase('qa');
    setBlindFlipped(false);
    setBlindPreview(null);
  }, [clearDecisionTimeouts]);

  const goIdle = useCallback(() => {
    clearDecisionTimeouts();
    setPhase('idle');
    setStep(0);
    setDraft({});
    setResult(null);
    setFavorited(false);
    setBlindFlipped(false);
    setBlindPreview(null);
  }, [clearDecisionTimeouts]);

  const setMood = useCallback((v: Mood) => {
    setValidationMessage(null);
    setDraft((d) => ({ ...d, mood: v }));
  }, []);
  const setBudget = useCallback((v: Budget) => {
    setValidationMessage(null);
    setDraft((d) => ({ ...d, budget: v }));
  }, []);
  const setDuration = useCallback((v: Duration) => {
    setValidationMessage(null);
    setDraft((d) => ({ ...d, duration: v }));
  }, []);
  const setSeason = useCallback((v: TravelSeason) => {
    setValidationMessage(null);
    setDraft((d) => ({ ...d, season: v }));
  }, []);
  const setCompanion = useCallback((v: Companion) => {
    setValidationMessage(null);
    setDraft((d) => ({ ...d, companion: v }));
  }, []);
  const setActivities = useCallback((v: PreferredActivity[]) => {
    setValidationMessage(null);
    setDraft((d) => ({ ...d, activities: v }));
  }, []);
  const setTransport = useCallback((v: Transport) => {
    setValidationMessage(null);
    setDraft((d) => ({ ...d, transport: v }));
  }, []);

  const canNext = useMemo(() => {
    if (phase !== 'qa') return false;
    return validatePreferenceStep(step, draft).valid;
  }, [phase, step, draft]);

  const runLoadingThenResult = useCallback((dest: Destination, pct: number) => {
    if (loadingTimeoutRef.current != null) {
      window.clearTimeout(loadingTimeoutRef.current);
      loadingTimeoutRef.current = null;
    }
    setPhase('loading');
    loadingTimeoutRef.current = window.setTimeout(() => {
      loadingTimeoutRef.current = null;
      setResult(dest);
      setFavorited(isDestinationFavorited(dest.id));
      setMatchPercent(pct);
      setPhase('result');
    }, LOADING_MS);
  }, []);

  const scheduleBlindProceed = useCallback(
    (dest: Destination) => {
      clearBlindProceedTimer();
      blindProceedTimerRef.current = window.setTimeout(() => {
        blindProceedTimerRef.current = null;
        const pct = 87 + Math.floor(Math.random() * 12);
        runLoadingThenResult(dest, pct);
        setBlindFlipped(false);
        setBlindPreview(null);
      }, BLIND_PROCEED_MS);
    },
    [clearBlindProceedTimer, runLoadingThenResult]
  );

  const finishQA = useCallback(() => {
    if (!profile) return;
    const { destination, matchPercent: pct } = matchDestination(profile);
    runLoadingThenResult(destination, pct);
  }, [profile, runLoadingThenResult]);

  const nextStep = useCallback(() => {
    const validation = validatePreferenceStep(step, draft);
    if (!validation.valid) {
      setValidationMessage(validation.message);
      return false;
    }
    setValidationMessage(null);
    if (step < 6) {
      setStep((s) => s + 1);
      return true;
    }
    finishQA();
    return true;
  }, [draft, step, finishQA]);

  const beginBlindFlip = useCallback(() => {
    if (phase === 'loading' || phase === 'result') return;
    if (!blindFlipped) {
      const dest = randomDestination();
      setBlindPreview(dest);
      setBlindFlipped(true);
      scheduleBlindProceed(dest);
      return;
    }
    const dest = randomDestination();
    setBlindPreview(dest);
    scheduleBlindProceed(dest);
  }, [phase, blindFlipped, scheduleBlindProceed]);

  /** 跳过问答：用预设画像直接匹配并进入加载 → 结果 */
  const runQuickDecision = useCallback(
    (preset: UserDecisionProfile) => {
      if (phase === 'loading' || phase === 'result') return;
      clearDecisionTimeouts();
      setStep(0);
      setDraft({});
      setBlindFlipped(false);
      setBlindPreview(null);
      const { destination, matchPercent: pct } = matchDestination(preset);
      runLoadingThenResult(destination, pct);
    },
    [phase, clearDecisionTimeouts, runLoadingThenResult]
  );

  const toggleFavorite = useCallback(() => {
    if (!result) return;
    setFavorited(toggleDestinationFavorite(result.id));
  }, [result]);

  useEffect(() => () => clearDecisionTimeouts(), [clearDecisionTimeouts]);

  return {
    phase,
    step,
    draft,
    result,
    matchPercent,
    favorited,
    blindFlipped,
    blindPreview,
    canNext,
    validationMessage,
    profile,
    startQA,
    goIdle,
    setMood,
    setBudget,
    setDuration,
    setSeason,
    setCompanion,
    setActivities,
    setTransport,
    nextStep,
    beginBlindFlip,
    runQuickDecision,
    toggleFavorite,
  };
}
