/** 退出登录时清除的用户数据 localStorage 键（保留主题 ql_theme） */
export const USER_DATA_STORAGE_KEYS = [
  'ql_explore_prefs_v1',
  'wander-ai-v1',
  'ql_collections',
  'wanderai_collections',
  'ql_decision_history',
  'wanderai_decision_history',
  'ql_notes',
  'wanderai_notes',
  'ql_drafts',
  'wanderai_drafts',
  'ql_notification_settings',
  'wanderai_notification_settings',
  'ql_language',
  'wanderai_language',
  'ql_custom_trips_v1',
  'wander-custom-trips-v1',
  'ql_feed_comments',
  'wanderai_feed_comments',
  'ql_inbox',
  'wanderai_inbox',
] as const;

export function clearUserLocalData() {
  USER_DATA_STORAGE_KEYS.forEach((k) => {
    try {
      localStorage.removeItem(k);
    } catch {
      /* ignore */
    }
  });
}
