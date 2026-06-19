import { loadNotificationSettings } from '@/lib/notificationSettingsStore';

const KEY = 'ql_inbox';
const KEY_LEGACY = 'wanderai_inbox';

export type InboxChannel = 'trip' | 'recommend' | 'social' | 'system';

export type InboxMessage = {
  id: string;
  channel: InboxChannel;
  title: string;
  body: string;
  createdAt: string;
  read: boolean;
};

type Persist = { messages: InboxMessage[] };

function emitChange() {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new CustomEvent('ql-inbox-change'));
}

function hasBrokenText(value: unknown): boolean {
  return typeof value === 'string' && /锟|�|娑|鐧|璧|缁|绋|鏂|濞|鑿|浜|鎺|琛|閫|杩|鍏|鐭|璇|宸|鏆|鍛|鏁|浣/.test(value);
}

function persistHasBrokenText(messages: InboxMessage[]): boolean {
  return messages.some((message) => hasBrokenText(message.title) || hasBrokenText(message.body));
}

function channelAllowed(channel: InboxChannel): boolean {
  const settings = loadNotificationSettings();
  switch (channel) {
    case 'trip':
      return settings.tripReminder;
    case 'recommend':
      return settings.dailyRecommend;
    case 'social':
      return settings.socialMessage;
    case 'system':
      return settings.systemNotice;
    default:
      return true;
  }
}

function seedMessages(): InboxMessage[] {
  const now = Date.now();
  const iso = (msAgo: number) => new Date(now - msAgo).toISOString();
  return [
    {
      id: 'inbox-seed-rec-1',
      channel: 'recommend',
      title: '今日推荐：慢旅行目的地',
      body: '结合你最近浏览的「洱海西岸」与「慢旅行」标签，为你整理了一条 2 日轻徒步路线，包含咖啡馆停留点与日落机位。',
      createdAt: iso(3 * 60_000),
      read: false,
    },
    {
      id: 'inbox-seed-rec-2',
      channel: 'recommend',
      title: '周末出逃灵感',
      body: '本周热门：高铁 3h 圈内「看海 + 咖啡」组合。点击探索页分类「慢旅行」可以快速筛选相似笔记。',
      createdAt: iso(20 * 60_000),
      read: true,
    },
    {
      id: 'inbox-seed-trip-2',
      channel: 'trip',
      title: '返程交通备忘',
      body: '根据你的偏好，系统会在周五 18:00 前提醒你检查返程高铁余票。可在「行程」页面同步查看。',
      createdAt: iso(26 * 60_000),
      read: true,
    },
    {
      id: 'inbox-seed-trip-1',
      channel: 'trip',
      title: '明日行程提醒',
      body: '你收藏的「大理古城」周边步行路线将于明日 9:00 开始。建议提前查看天气与防晒，古城石板路较多，请穿舒适鞋子。',
      createdAt: iso(55 * 60_000),
      read: false,
    },
    {
      id: 'inbox-seed-soc-1',
      channel: 'social',
      title: '有人点赞了你的评论',
      body: '用户「北岛来信」点赞了你在《大理 2 天 1 晚人均 800 攻略》下的评论：淡季租车真的能省很多。',
      createdAt: iso(90 * 60_000),
      read: false,
    },
    {
      id: 'inbox-seed-soc-2',
      channel: 'social',
      title: '新的关注提醒',
      body: '「胶片日记」关注了你。后续互动消息会集中出现在这里。',
      createdAt: iso(5 * 24 * 60 * 60_000),
      read: true,
    },
    {
      id: 'inbox-seed-sys-1',
      channel: 'system',
      title: 'QL轻旅体验更新',
      body: '探索页已支持长图文、本地评论和消息中心。你可以在「我的」里的通知设置管理推送类型。',
      createdAt: iso(48 * 60 * 60_000),
      read: true,
    },
    {
      id: 'inbox-seed-sys-2',
      channel: 'system',
      title: '数据与隐私提示',
      body: '点赞、收藏、评论和已读状态会保存在本机浏览器。清除缓存或退出登录会按设置清理相关数据。',
      createdAt: iso(9 * 24 * 60 * 60 * 1000),
      read: true,
    },
  ];
}

function resetSeed(): Persist {
  const initial = { messages: seedMessages() };
  try {
    localStorage.setItem(KEY, JSON.stringify(initial));
    localStorage.removeItem(KEY_LEGACY);
  } catch {
    /* ignore */
  }
  return initial;
}

function loadPersist(): Persist {
  if (typeof window === 'undefined') return { messages: seedMessages() };
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
    if (!raw) return resetSeed();

    const persist = JSON.parse(raw) as Persist;
    if (!persist?.messages || !Array.isArray(persist.messages) || persistHasBrokenText(persist.messages)) {
      return resetSeed();
    }
    return persist;
  } catch {
    return resetSeed();
  }
}

function write(messages: InboxMessage[]) {
  try {
    localStorage.setItem(KEY, JSON.stringify({ messages }));
    emitChange();
  } catch {
    /* ignore */
  }
}

export function loadInboxMessages(): InboxMessage[] {
  return loadPersist()
    .messages.slice()
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export function visibleInboxMessages(list?: InboxMessage[]): InboxMessage[] {
  const messages = list ?? loadInboxMessages();
  return messages.filter((message) => channelAllowed(message.channel));
}

export function getInboxUnreadCount(): number {
  return visibleInboxMessages().filter((message) => !message.read).length;
}

export function hiddenInboxCountBySettings(): number {
  const all = loadInboxMessages();
  return all.filter((message) => !channelAllowed(message.channel)).length;
}

export function markInboxMessageRead(id: string) {
  const { messages } = loadPersist();
  const next = messages.map((message) => (message.id === id ? { ...message, read: true } : message));
  write(next);
}

export function markAllInboxRead() {
  const { messages } = loadPersist();
  const next = messages.map((message) => ({ ...message, read: true }));
  write(next);
}
