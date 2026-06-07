import type { UserDecisionProfile } from '@/types/decision';

export type PreferenceField =
  | 'mood'
  | 'budget'
  | 'duration'
  | 'season'
  | 'companion'
  | 'activities'
  | 'transport';

export type PreferenceDraft = Partial<UserDecisionProfile>;

export type PreferenceValidation = {
  valid: boolean;
  field: PreferenceField;
  message: string;
};

const STEP_FIELDS: PreferenceField[] = [
  'mood',
  'budget',
  'duration',
  'season',
  'companion',
  'activities',
  'transport',
];

const MESSAGES: Record<PreferenceField, string> = {
  mood: '请选择这次旅行想要的感觉。',
  budget: '请选择一个预算范围。',
  duration: '请选择大概旅行时长。',
  season: '请选择偏好的出发季节。',
  companion: '请选择同行人类型。',
  activities: '至少选择 1 个想体验的旅行活动。',
  transport: '请选择偏好的交通方式。',
};

export function validatePreferenceStep(step: number, draft: PreferenceDraft): PreferenceValidation {
  const field = STEP_FIELDS[step] ?? 'transport';
  const value = draft[field];
  const valid = field === 'activities' ? Array.isArray(value) && value.length > 0 : Boolean(value);

  return {
    valid,
    field,
    message: valid ? '' : MESSAGES[field],
  };
}

export function validatePreferenceProfile(draft: PreferenceDraft): PreferenceValidation {
  for (let index = 0; index < STEP_FIELDS.length; index += 1) {
    const result = validatePreferenceStep(index, draft);
    if (!result.valid) return result;
  }
  return { valid: true, field: 'transport', message: '' };
}
