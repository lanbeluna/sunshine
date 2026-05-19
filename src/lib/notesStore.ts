import { pickPortrait } from '@/lib/unsplashPools';

const NOTES_KEY = 'ql_notes';
const NOTES_LEGACY = 'wanderai_notes';
const DRAFTS_KEY = 'ql_drafts';
const DRAFTS_LEGACY = 'wanderai_drafts';

export type UserNoteCard = {
  id: string;
  title: string;
  image: string;
  likes: number;
  tags: string[];
  authorName: string;
  authorAvatar: string;
  savedAt: string;
  /** 与探索贴一致的正文，多段用空行分隔 */
  body?: string;
};

function seedPublished(): UserNoteCard[] {
  return [
    {
      id: 'note-seed-1',
      title: '大理洱海西岸骑行笔记：风与自由都刚好',
      image: 'https://images.unsplash.com/photo-1547981609-4b6bfe67ca0b?w=800&q=80',
      likes: 328,
      tags: ['云南', '骑行'],
      authorName: '旅行家小A',
      authorAvatar: pickPortrait('note-author-1', 128),
      savedAt: new Date().toISOString(),
      body:
        '洱海西岸的骑行道整体平缓，适合「想动一动又不想太累」的一天。我是上午从才村附近出发，风从湖面吹过来很干净，记得戴好防风外套。\n\n' +
        '沿途补给点不算密，建议自备水和一点干粮；中午可以在廊道边的村子随便找家白族小馆，酸辣鱼配米饭很落胃。\n\n' +
        '拍照尽量靠边停车，注意安全；傍晚光线柔和，适合拍湖面与远山的层叠感。',
    },
    {
      id: 'note-seed-2',
      title: '重庆三日：火锅密度与夜景机位复盘',
      image: 'https://images.unsplash.com/photo-1535025639604-9a804c092faa?w=800&q=80',
      likes: 512,
      tags: ['美食', '夜景'],
      authorName: '旅行家小A',
      authorAvatar: pickPortrait('note-author-2', 128),
      savedAt: new Date().toISOString(),
      body:
        '重庆的节奏是「上坡下坎 + 随时想吃火锅」。我把三天拆成：一天老城步行，一天江景夜景，一天轻松逛吃，胃和腿都能缓过来。\n\n' +
        '夜景别只挤一个机位：南滨路、东水门大桥附近、以及经典洪崖洞对岸，各有层次；记得带广角或手机超广角。\n\n' +
        '火锅微辣对多数外地人也偏辣，香油蒜泥碟是正经解辣方案；排队夸张的店可以换同片区备选，味道差距往往没想象中大。',
    },
    {
      id: 'note-seed-3',
      title: '威海环海路：适合发呆的海岸线分段',
      image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80',
      likes: 189,
      tags: ['慢旅行', '海景'],
      authorName: '旅行家小A',
      authorAvatar: pickPortrait('note-author-3', 128),
      savedAt: new Date().toISOString(),
      body:
        '威海很适合「慢旅行」：海风干净，城市体量不大，环海路一段一段拆开走最舒服。\n\n' +
        '我更喜欢人少的小湾停一停，带本书或耳机就能耗一下午；日落前一小时光线最温柔。\n\n' +
        '旺季停车位会紧张，尽量早点到；防晒和薄外套都带上，海边温差比想象中明显。',
    },
  ];
}

export function loadPublishedNotes(): UserNoteCard[] {
  if (typeof window === 'undefined') return [];
  try {
    let raw = localStorage.getItem(NOTES_KEY);
    if (!raw) raw = localStorage.getItem(NOTES_LEGACY);
    if (raw && !localStorage.getItem(NOTES_KEY) && localStorage.getItem(NOTES_LEGACY)) {
      try {
        localStorage.setItem(NOTES_KEY, raw);
      } catch {
        /* ignore */
      }
    }
    if (!raw) {
      const seeded = seedPublished();
      localStorage.setItem(NOTES_KEY, JSON.stringify(seeded));
      return seeded;
    }
    return JSON.parse(raw) as UserNoteCard[];
  } catch {
    return [];
  }
}

export function loadDraftNotes(): UserNoteCard[] {
  if (typeof window === 'undefined') return [];
  try {
    let raw = localStorage.getItem(DRAFTS_KEY);
    if (!raw) raw = localStorage.getItem(DRAFTS_LEGACY);
    if (raw && !localStorage.getItem(DRAFTS_KEY) && localStorage.getItem(DRAFTS_LEGACY)) {
      try {
        localStorage.setItem(DRAFTS_KEY, raw);
      } catch {
        /* ignore */
      }
    }
    if (!raw) return [];
    return JSON.parse(raw) as UserNoteCard[];
  } catch {
    return [];
  }
}
