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

function channelAllowed(channel: InboxChannel): boolean {
  const s = loadNotificationSettings();
  switch (channel) {
    case 'trip':
      return s.tripReminder;
    case 'recommend':
      return s.dailyRecommend;
    case 'social':
      return s.socialMessage;
    case 'system':
      return s.systemNotice;
    default:
      return true;
  }
}

function seedMessages(): InboxMessage[] {
  const t = Date.now();
  const iso = (msAgo: number) => new Date(t - msAgo).toISOString();
  return [
    {
      id: 'inbox-seed-trip-1',
      channel: 'trip',
      title: '明日行程提醒',
      body: '你收藏的「大理古城」周边步行路线将于明日 9:00 开始。建议提前查看天气与防晒，古城石板路较多请穿舒适鞋子。',
      createdAt: iso(55 * 60_000),
      read: false,
    },
    {
      id: 'inbox-seed-trip-2',
      channel: 'trip',
      title: '返程交通备忘',
      body: '根据你的偏好，系统在周五 18:00 前推送返程高铁余票波动提醒。可在「行程」页同步查看。',
      createdAt: iso(26 * 60_000),
      read: true,
    },
    {
      id: 'inbox-seed-rec-1',
      channel: 'recommend',
      title: '今日推荐：慢旅行目的地',
      body: '结合你最近浏览的「洱海西岸」与「慢旅行」标签，为你整理了一条 2 日轻徒步路线，含咖啡馆停留点与日落机位。',
      createdAt: iso(3 * 60_000),
      read: false,
    },
    {
      id: 'inbox-seed-rec-2',
      channel: 'recommend',
      title: '周末出逃灵感',
      body: '本周热门：高铁 3h 圈内「看海 + 咖啡」组合。点击探索页分类「慢旅行」可快速筛选相似笔记。',
      createdAt: iso(20 * 60_000),
      read: true,
    },
    {
      id: 'inbox-seed-soc-1',
      channel: 'social',
      title: '有人点赞了你的评论',
      body: '用户「北岛来信」点赞了你在《大理3天2晚人均800攻略》下的评论：「淡季租车真的省很多」。',
      createdAt: iso(90 * 60_000),
      read: false,
    },
    {
      id: 'inbox-seed-soc-2',
      channel: 'social',
      title: '新粉丝关注',
      body: '「胶片日记」关注了你。若你持续发布笔记，互动消息会集中出现在此列表。',
      createdAt: iso(5 * 24 * 60 * 60_000),
      read: true,
    },
    {
      id: 'inbox-seed-sys-1',
      channel: 'system',
      title: 'QL轻旅 体验版更新',
      body: '探索页已支持长正文与本地评论演示；消息中心聚合行程提醒、推荐与互动。可在「我的 → 通知设置」管理推送类型。',
      createdAt: iso(48 * 60 * 60_000),
      read: true,
    },
    {
      id: 'inbox-seed-sys-2',
      channel: 'system',
      title: '数据与隐私提示',
      body: '当前为课程演示环境：点赞、收藏、评论与消息已读状态保存在本机浏览器。清除缓存或退出登录将按设置清理相关数据。',
      createdAt: iso(9 * 24 * 60 * 60 * 1000),
      read: true,
    },
  ];
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
    if (!raw) {
      const initial = { messages: seedMessages() };
      localStorage.setItem(KEY, JSON.stringify(initial));
      return initial;
    }
    const p = JSON.parse(raw) as Persist;
    if (!p?.messages || !Array.isArray(p.messages)) {
      const initial = { messages: seedMessages() };
      localStorage.setItem(KEY, JSON.stringify(initial));
      return initial;
    }
    return p;
  } catch {
    return { messages: seedMessages() };
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
  const m = list ?? loadInboxMessages();
  return m.filter((x) => channelAllowed(x.channel));
}

export function getInboxUnreadCount(): number {
  return visibleInboxMessages().filter((x) => !x.read).length;
}

export function hiddenInboxCountBySettings(): number {
  const all = loadInboxMessages();
  return all.filter((x) => !channelAllowed(x.channel)).length;
}

export function markInboxMessageRead(id: string) {
  const { messages } = loadPersist();
  const next = messages.map((m) => (m.id === id ? { ...m, read: true } : m));
  write(next);
}

export function markAllInboxRead() {
  const { messages } = loadPersist();
  const next = messages.map((m) => ({ ...m, read: true }));
  write(next);
}
