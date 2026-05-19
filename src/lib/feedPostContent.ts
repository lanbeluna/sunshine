import { pickPortrait } from '@/lib/unsplashPools';
import type { FeedCategoryId, FeedComment, FeedItemType } from '@/types/feed';

const CATEGORY_LABEL: Record<Exclude<FeedCategoryId, 'all'>, string> = {
  domestic: '国内游',
  international: '出境游',
  blitz: '特种兵',
  slow: '慢旅行',
  food: '美食',
  bnb: '民宿',
  pitfall: '避坑',
  budget: '穷游',
  family: '亲子',
};

const NAMES = ['北岛来信', '周末背包客', '胶片日记', '带娃旅行中', '咖啡与地图', '海岛潜水员'];

/** 与 feed 目录 id（feed-0 …）或任意 id 对齐的变体下标，用于稳定挑选模板 */
function feedContentVariant(feedId: string): number {
  const m = /^feed-(\d+)$/.exec(feedId);
  if (m) return Number(m[1]);
  let h = 0;
  for (let i = 0; i < feedId.length; i++) h = (h * 31 + feedId.charCodeAt(i)) >>> 0;
  return h % 997;
}

export function buildFeedBody(
  row: {
    title: string;
    categoryId: Exclude<FeedCategoryId, 'all'>;
    tags: string[];
    type: FeedItemType;
  },
  index: number
): string {
  const cat = CATEGORY_LABEL[row.categoryId];
  const tagLine = row.tags.length ? row.tags.join('、') : '实用信息';
  const pace = index % 3 === 0 ? '偏轻松' : index % 3 === 1 ? '适中' : '略紧凑';
  const typeHint =
    row.type === 'video'
      ? '文中时间点与机位以视频里标注为准，建议先收藏再按章节跳转。'
      : row.type === 'topic'
        ? '这是一则话题向整理，更侧重经验对比与取舍，可按需截取片段使用。'
        : row.type === 'destination'
          ? '目的地类内容会侧重动线、停留节奏与拍照点，交通细节出发前请再核对一次。'
          : '攻略向内容尽量把「预约 / 排队 / 预算」写清楚，方便你直接抄作业。';

  const p1 = `这篇围绕「${row.title}」记录了我的真实体验，分类在「${cat}」，适合关注「${tagLine}」的旅行者参考。整体节奏${pace}，可按自身体力与假期天数微调。`;
  const p2 = `${typeHint} 旺季与淡季差异会很大：门票放票规则、接驳车频次、店铺营业时间都可能调整，请以景区或平台最新公告为准。`;
  const p3 = `预算方面建议预留 10%–15% 机动金应对临时改票、天气备选方案或「路过就想吃」的本地小店。若你按文中所写走完仍有疑问，欢迎在评论区补充你的出发地和大致日期，方便大家互助对照。`;

  return [p1, p2, p3].join('\n\n');
}

export function buildSeedComments(
  feedId: string,
  meta: { title: string; tags: string[]; categoryLabel: string }
): FeedComment[] {
  const v = feedContentVariant(feedId);
  const tag0 = meta.tags[0] ?? '行程';
  const tag1 = meta.tags[1] ?? '预算';
  const snippets: [string, string][] = [
    [`${meta.title.slice(0, 12)}这段写得太细了，已收藏。`, '上周刚回，实测和文里基本一致。'],
    [`正好在排${tag0}，想问下文中提到的时段现在还好约吗？`, '亲子党表示「节奏」那段很有用，少走冤枉路。'],
    [`${tag1}部分和我上次去略有出入，但整体思路靠谱。`, '照片机位Mark了，感谢分享参数。'],
    ['准备下个月出发，这篇当 checklist 用了。', '想问下当地打车软件用哪个更稳？'],
    ['避坑那几条全中，早点看到就好了😂', '已转发给同行朋友，期待更新第二季。'],
  ];
  const pair = snippets[v % snippets.length];
  const count = 3 + (v % 2);
  const out: FeedComment[] = [];
  for (let i = 0; i < count; i++) {
    const text = i % 2 === 0 ? pair[0] : pair[1];
    const name = NAMES[(v + i) % NAMES.length];
    const days = 1 + ((v + i * 3) % 9);
    const at = new Date(Date.now() - days * 86400000 - (v % 12) * 3600000).toISOString();
    out.push({
      id: `seed-cmt-${feedId}-${i}`,
      author: { name, avatar: pickPortrait(`seed-cmt-${feedId}-${i}`, 96) },
      text,
      createdAt: at,
    });
  }
  return out;
}
