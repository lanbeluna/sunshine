const KEY = 'ql_notification_settings';
const KEY_LEGACY = 'wanderai_notification_settings';

export type NotificationSettings = {
  tripReminder: boolean;
  dailyRecommend: boolean;
  socialMessage: boolean;
  systemNotice: boolean;
};

const DEFAULTS: NotificationSettings = {
  tripReminder: true,
  dailyRecommend: true,
  socialMessage: true,
  systemNotice: true,
};

export function loadNotificationSettings(): NotificationSettings {
  if (typeof window === 'undefined') return DEFAULTS;
  try {
    let raw = localStorage.getItem(KEY);
    if (!raw) raw = localStorage.getItem(KEY_LEGACY);
    if (raw && !localStorage.getItem(KEY) && localStorage.getItem(KEY_LEGACY)) {
      try {
        localStorage.setItem(KEY, raw);
      } catch {
        /* ignore */
      }
    }
    if (!raw) return { ...DEFAULTS };
    return { ...DEFAULTS, ...JSON.parse(raw) };
  } catch {
    return { ...DEFAULTS };
  }
}

export function saveNotificationSettings(s: NotificationSettings) {
  try {
    localStorage.setItem(KEY, JSON.stringify(s));
  } catch {
    /* ignore */
  }
}

export function patchNotificationSettings(partial: Partial<NotificationSettings>) {
  const next = { ...loadNotificationSettings(), ...partial };
  saveNotificationSettings(next);
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('ql-inbox-change'));
  }
  return next;
}
