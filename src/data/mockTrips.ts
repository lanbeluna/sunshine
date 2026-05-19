import { tripListCoverUrl } from '@/data/destinationImages';
import { loadCustomTrips } from '@/lib/tripsStorage';
import { pickPortrait } from '@/lib/unsplashPools';
import type { Trip } from '@/types/trip';

/** 示例行程：封面为固定可访问直链，头像仍用 Unsplash 人像池 */
export const MOCK_TRIPS: Trip[] = [
  {
    id: 't1',
    destination: '大理 · 苍山洱海',
    imageUrl: tripListCoverUrl('t1'),
    startDate: '2026-06-15',
    endDate: '2026-06-18',
    status: 'planned',
    companionAvatars: [
      pickPortrait('trip-t1-c1', 128),
      pickPortrait('trip-t1-c2', 128),
      pickPortrait('trip-t1-c3', 128),
      pickPortrait('trip-t1-c4', 128),
    ],
    itinerary: [
      {
        day: 1,
        title: '抵达大理 · 古城慢行',
        summary: '适应海拔，傍晚逛人民路与洋人街。',
        items: ['机场/高铁至古城打车约40分钟', '入住古城边民宿，放下行李', '人民路咖啡与书店', '晚餐：石板烧或野生菌火锅'],
      },
      {
        day: 2,
        title: '洱海西岸',
        summary: '生态廊道骑行，喜洲古镇半日。',
        items: ['租电动车或包车环海西路', '磻溪S弯、廊桥拍照', '喜洲粑粑、破酥粑粑', '海舌公园（开放时段）'],
      },
      {
        day: 3,
        title: '双廊与海东',
        summary: '海东日落，双廊临海咖啡。',
        items: ['上午古城补货伴手礼', '中午前往双廊', '玉几岛、南诏风情岛（可选）', '双廊观景台等日落'],
      },
      {
        day: 4,
        title: '返程',
        summary: '轻松收尾，预留交通时间。',
        items: ['苍山索道（可选，看天气）', '午餐后前往机场/车站', '建议提前2小时到达'],
      },
    ],
  },
  {
    id: 't2',
    destination: '重庆',
    imageUrl: tripListCoverUrl('t2'),
    startDate: '2026-04-10',
    endDate: '2026-04-12',
    status: 'ongoing',
    companionAvatars: [pickPortrait('trip-t2-c1', 128), pickPortrait('trip-t2-c2', 128)],
    itinerary: [
      {
        day: 1,
        title: '渝中经典线',
        summary: '解放碑—洪崖洞夜景主轴。',
        items: ['解放碑步行街午餐', '长江索道（南站排队较短）', '龙门浩老街咖啡', '洪崖洞蓝调时刻与千厮门大桥机位'],
      },
      {
        day: 2,
        title: '轻轨与江湖菜',
        summary: '李子坝、磁器口与火锅夜。',
        items: ['李子坝观景平台', '鹅岭二厂文创园', '磁器口古镇麻花与茶馆', '九宫格老火锅'],
      },
      {
        day: 3,
        title: '南岸与返程',
        summary: '一棵树或壹华里二选一。',
        items: ['南山一棵树/壹华里夜景', '采购火锅底料伴手礼', '前往机场/北站'],
      },
    ],
  },
  {
    id: 't3',
    destination: '威海环海路',
    imageUrl: tripListCoverUrl('t3'),
    startDate: '2026-08-01',
    endDate: '2026-08-05',
    status: 'planned',
    companionAvatars: [pickPortrait('trip-t3-c1', 128)],
    itinerary: [
      {
        day: 1,
        title: '抵达威海',
        summary: '国际海水浴场踩沙。',
        items: ['入住火炬八街附近', '国际海水浴场日落', '欧乐坊零点夜市'],
      },
      {
        day: 2,
        title: '环海路东段',
        summary: '猫头山二号观景台、海源公园。',
        items: ['半月湾日出（可选）', '猫头山沿海步道', '海源公园木栈道', '韩乐坊晚餐'],
      },
      {
        day: 3,
        title: '刘公岛一日',
        summary: '甲午历史与海鸥季。',
        items: ['早班船上岛', '甲午战争博物院', '东泓炮台瞰海', '返程后海滨公园散步'],
      },
      {
        day: 4,
        title: '那香海 / 鸡鸣岛',
        summary: '钻石沙滩与海岛慢节奏。',
        items: ['包车或旅游专线', '那香海钻石沙滩', '鸡鸣岛（船班以当日为准）', '海鲜大排档'],
      },
      {
        day: 5,
        title: '返程',
        summary: '轻松整理行李。',
        items: ['悦海公园灯塔打卡', '机场/高铁预留缓冲'],
      },
    ],
  },
  {
    id: 't4',
    destination: '泉州古城',
    imageUrl: tripListCoverUrl('t4'),
    startDate: '2025-12-20',
    endDate: '2025-12-23',
    status: 'done',
    companionAvatars: [
      pickPortrait('trip-t4-c1', 128),
      pickPortrait('trip-t4-c2', 128),
      pickPortrait('trip-t4-c3', 128),
    ],
    itinerary: [
      {
        day: 1,
        title: '古城寺庙线',
        summary: '开元寺、西街与钟楼。',
        items: ['开元寺双塔与古船陈列', '西街小吃：面线糊、土笋冻', '钟楼合影', '中山路骑楼夜游'],
      },
      {
        day: 2,
        title: '蟳埔与非遗',
        summary: '簪花围与渔村民俗。',
        items: ['蟳埔村簪花体验', '妈祖庙', '海鲜排档午餐', '提线木偶或南音（提前预约）'],
      },
      {
        day: 3,
        title: '洛阳桥 / 五店市',
        summary: '跨海梁式石桥与红砖厝。',
        items: ['洛阳桥徒步', '五店市传统街区', '姜母鸭晚餐'],
      },
      {
        day: 4,
        title: '返程',
        summary: '伴手礼：芋头饼、蒜蓉枝。',
        items: ['关帝庙上香（可选）', '采购伴手礼', '晋江机场/泉州站'],
      },
    ],
  },
  {
    id: 't5',
    destination: '哈尔滨冰雪季',
    imageUrl: tripListCoverUrl('t5'),
    startDate: '2025-01-05',
    endDate: '2025-01-09',
    status: 'done',
    companionAvatars: [],
    itinerary: [
      {
        day: 1,
        title: '中央大街',
        summary: '索菲亚教堂与马迭尔冰棍。',
        items: ['圣索菲亚大教堂内景票', '中央大街俄餐', '松花江铁路桥日落'],
      },
      {
        day: 2,
        title: '冰雪大世界',
        summary: '下午入园等亮灯，大滑梯预约。',
        items: ['暖屋休息与姜茶', '冰雕夜景拍摄', '大滑梯/雪花摩天轮时段票'],
      },
      {
        day: 3,
        title: '雪乡或亚布力（二选一）',
        summary: '冰雪运动日。',
        items: ['亚布力滑雪初/中级道', '或雪乡木屋夜景团', '注意保暖分层穿衣'],
      },
      {
        day: 4,
        title: '伏尔加庄园',
        summary: '俄式建筑与雪圈体验。',
        items: ['庄园城堡拍照', '雪圈滑道', '俄式西餐'],
      },
      {
        day: 5,
        title: '返程',
        summary: '红肠秋林里道斯伴手礼。',
        items: ['秋林公司采购', '太平机场提前2小时'],
      },
    ],
  },
];

/** 用户自建行程在前，便于同 id 覆盖演示数据（一般不会出现） */
export function getAllTrips(): Trip[] {
  return [...loadCustomTrips(), ...MOCK_TRIPS];
}

export function getTripById(id: string): Trip | undefined {
  return getAllTrips().find((t) => t.id === id);
}
