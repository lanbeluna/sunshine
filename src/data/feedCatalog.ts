import { feedHeroUrl, pickPortrait } from '@/lib/unsplashPools';
import { buildFeedBody } from '@/lib/feedPostContent';
import type { FeedCategoryId, FeedItem, FeedItemType } from '@/types/feed';

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

const AUTHORS = [
  '阿梨游记',
  '路痴小王',
  '周末出逃',
  '胶片岛屿',
  '带娃的Momo',
  '背包客K',
  '飞行日记本',
  '南半球的风',
];

type Row = {
  title: string;
  categoryId: Exclude<FeedCategoryId, 'all'>;
  type: FeedItemType;
  likes: number;
  tags: string[];
};

const ROWS: Row[] = [
  { title: '大理3天2晚人均800攻略', categoryId: 'budget', type: 'guide', likes: 12500, tags: ['避坑', '穷游', '必去'] },
  { title: '丽江古城清晨机位合集', categoryId: 'domestic', type: 'destination', likes: 8920, tags: ['出片', '慢旅行'] },
  { title: '西双版纳亲子实测：植物园这样玩', categoryId: 'family', type: 'guide', likes: 15600, tags: ['亲子', '避坑'] },
  { title: '成都48小时吃货地图（不踩雷版）', categoryId: 'food', type: 'guide', likes: 23400, tags: ['美食', '特种兵'] },
  { title: '重庆洪崖洞夜景参数分享', categoryId: 'domestic', type: 'video', likes: 67800, tags: ['夜景', '必去'] },
  { title: '西安兵马俑讲解预约全流程', categoryId: 'pitfall', type: 'guide', likes: 11200, tags: ['避坑', '预约'] },
  { title: '厦门鼓浪屿船票+路线一次说清', categoryId: 'domestic', type: 'topic', likes: 9800, tags: ['避坑', '必去'] },
  { title: '青岛4天3晚海风啤酒路线', categoryId: 'slow', type: 'guide', likes: 7600, tags: ['慢旅行', '美食'] },
  { title: '杭州西湖手划船价格对比', categoryId: 'pitfall', type: 'topic', likes: 5400, tags: ['避坑', '穷游'] },
  { title: '苏州园林一日：拙政园+平江路', categoryId: 'domestic', type: 'destination', likes: 14300, tags: ['必去', '出片'] },
  { title: '北京故宫抢票复盘（附时段）', categoryId: 'pitfall', type: 'guide', likes: 42100, tags: ['避坑', '亲子'] },
  { title: '上海西岸美术馆大道散步指南', categoryId: 'slow', type: 'guide', likes: 8900, tags: ['慢旅行', '出片'] },
  { title: '张家界天门山ABC线怎么选', categoryId: 'domestic', type: 'topic', likes: 18700, tags: ['避坑', '特种兵'] },
  { title: '桂林阳朔遇龙河竹筏真实体验', categoryId: 'domestic', type: 'video', likes: 25600, tags: ['必去', '穷游'] },
  { title: '拉萨高反：我踩过的3个坑', categoryId: 'pitfall', type: 'guide', likes: 31200, tags: ['避坑', '高原'] },
  { title: '敦煌莫高窟A类票参观动线', categoryId: 'domestic', type: 'guide', likes: 16400, tags: ['必去', '慢旅行'] },
  { title: '哈尔滨冰雪大世界穿衣清单', categoryId: 'family', type: 'guide', likes: 50900, tags: ['亲子', '避坑'] },
  { title: '三亚亚龙湾vs海棠湾怎么选', categoryId: 'domestic', type: 'topic', likes: 22300, tags: ['避坑', '亲子'] },
  { title: '长沙文和友排队替代方案', categoryId: 'food', type: 'guide', likes: 19800, tags: ['美食', '特种兵'] },
  { title: '南京博物院预约+参观路线', categoryId: 'domestic', type: 'guide', likes: 13100, tags: ['必去', '避坑'] },
  { title: '曼谷大皇宫着装要求实测', categoryId: 'international', type: 'guide', likes: 8700, tags: ['避坑', '出境游'] },
  { title: '清迈宁曼路咖啡地图12家', categoryId: 'international', type: 'destination', likes: 10200, tags: ['慢旅行', '美食'] },
  { title: '东京涩谷SKY日落抢票技巧', categoryId: 'international', type: 'guide', likes: 28900, tags: ['出片', '避坑'] },
  { title: '大阪环球影城速通值不值', categoryId: 'international', type: 'topic', likes: 35600, tags: ['亲子', '避坑'] },
  { title: '首尔弘大夜生活安全贴士', categoryId: 'international', type: 'video', likes: 19400, tags: ['出境游', '特种兵'] },
  { title: '新加坡滨海湾花园带娃路线', categoryId: 'family', type: 'guide', likes: 14700, tags: ['亲子', '出境游'] },
  { title: '巴厘岛乌布梯田秋千怎么选', categoryId: 'international', type: 'guide', likes: 21800, tags: ['避坑', '出片'] },
  { title: '普吉岛跳岛：皮皮岛一日复盘', categoryId: 'international', type: 'guide', likes: 17300, tags: ['必去', '穷游'] },
  { title: '吉隆坡双子塔夜景机位合集', categoryId: 'international', type: 'destination', likes: 9600, tags: ['出片', '出境游'] },
  { title: '河内还剑湖36行街吃喝地图', categoryId: 'international', type: 'guide', likes: 7200, tags: ['美食', '穷游'] },
  { title: '昆明中转半日：滇池+斗南花市', categoryId: 'domestic', type: 'guide', likes: 6100, tags: ['特种兵', '穷游'] },
  { title: '深圳湾公园骑行日落实测', categoryId: 'domestic', type: 'video', likes: 18400, tags: ['慢旅行', '出片'] },
  { title: '丽江玉龙雪山索道票预约攻略', categoryId: 'pitfall', type: 'guide', likes: 20500, tags: ['避坑', '必去'] },
  { title: '成都三星堆高铁半日往返', categoryId: 'blitz', type: 'guide', likes: 13900, tags: ['特种兵', '国内游'] },
  { title: '西安回民街哪些值得吃', categoryId: 'food', type: 'topic', likes: 26700, tags: ['美食', '避坑'] },
  { title: '厦门沙坡尾小众咖啡馆5家', categoryId: 'slow', type: 'destination', likes: 4500, tags: ['慢旅行', '美食'] },
  { title: '青岛崂山仰口线亲子友好吗', categoryId: 'family', type: 'topic', likes: 8800, tags: ['亲子', '避坑'] },
  { title: '杭州法喜寺黄墙出片参数', categoryId: 'domestic', type: 'video', likes: 32100, tags: ['出片', '必去'] },
  { title: '苏州周庄一日游交通方案', categoryId: 'domestic', type: 'guide', likes: 9900, tags: ['穷游', '国内游'] },
  { title: '北京长城慕田峪vs八达岭', categoryId: 'domestic', type: 'topic', likes: 41200, tags: ['避坑', '亲子'] },
  { title: '上海迪士尼早享卡复盘', categoryId: 'family', type: 'guide', likes: 58200, tags: ['亲子', '避坑'] },
  { title: '张家界国家森林公园两日动线', categoryId: 'domestic', type: 'guide', likes: 12100, tags: ['必去', '特种兵'] },
  { title: '桂林龙脊梯田最佳拍摄月份', categoryId: 'domestic', type: 'destination', likes: 7600, tags: ['出片', '慢旅行'] },
  { title: '拉萨布达拉宫预约全流程', categoryId: 'pitfall', type: 'guide', likes: 28400, tags: ['避坑', '必去'] },
  { title: '敦煌鸣沙山月牙泉防沙清单', categoryId: 'domestic', type: 'guide', likes: 9300, tags: ['避坑', '实用'] },
  { title: '哈尔滨中央大街俄餐测评', categoryId: 'food', type: 'video', likes: 14500, tags: ['美食', '国内游'] },
  { title: '三亚蜈支洲岛潜水选店指南', categoryId: 'pitfall', type: 'guide', likes: 19800, tags: ['避坑', '必去'] },
  { title: '长沙橘子洲小火车排队攻略', categoryId: 'domestic', type: 'guide', likes: 16700, tags: ['穷游', '避坑'] },
  { title: '南京大屠杀纪念馆参观礼仪', categoryId: 'domestic', type: 'topic', likes: 22300, tags: ['必去', '亲子'] },
  { title: '曼谷湄南河快船怎么坐不迷路', categoryId: 'international', type: 'guide', likes: 11200, tags: ['实用', '出境游'] },
  { title: '清迈周日夜市砍价话术', categoryId: 'budget', type: 'topic', likes: 6800, tags: ['穷游', '出境游'] },
  { title: '东京筑地场外市场寿司早午餐', categoryId: 'food', type: 'video', likes: 40100, tags: ['美食', '必去'] },
  { title: '大阪心斋桥药妆退税对比', categoryId: 'international', type: 'guide', likes: 25900, tags: ['避坑', '出境游'] },
  { title: '首尔明洞免税店提货动线', categoryId: 'international', type: 'guide', likes: 18600, tags: ['特种兵', '出境游'] },
  { title: '云南民宿落地窗洱海选房技巧', categoryId: 'bnb', type: 'guide', likes: 13400, tags: ['民宿', '避坑'] },
  { title: '国庆错峰：小众海岛替代三亚', categoryId: 'domestic', type: 'topic', likes: 49200, tags: ['避坑', '穷游'] },
];

export const FEED_CATALOG: FeedItem[] = ROWS.map((r, i) => ({
  id: `feed-${i}`,
  type: r.type,
  title: r.title,
  author: {
    name: AUTHORS[i % AUTHORS.length],
    avatar: pickPortrait(`feed-author-${i}`, 128),
  },
  image: feedHeroUrl(i, 400, 240 + (i % 8) * 36),
  likes: r.likes,
  isLiked: false,
  isCollected: false,
  tags: r.tags,
  category: CATEGORY_LABEL[r.categoryId],
  categoryId: r.categoryId,
  body: buildFeedBody(r, i),
}));
