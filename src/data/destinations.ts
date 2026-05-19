import { getDestinationImages } from '@/data/destinationImages';
import type {
  Destination,
  DestinationBudget,
  DestinationItineraryDay,
  DestinationTags,
} from '@/types/decision';

type Seed = {
  id: string;
  name: string;
  country: string;
  tags: DestinationTags;
  budget: DestinationBudget;
  bestSeason: string;
  description: string;
  highlights: string[];
  days: Omit<DestinationItineraryDay, 'day'>[];
};

function build(s: Seed): Destination {
  return {
    id: s.id,
    name: s.name,
    country: s.country,
    tags: s.tags,
    images: getDestinationImages(s.id),
    budget: s.budget,
    bestSeason: s.bestSeason,
    description: s.description,
    highlights: s.highlights,
    itinerary: s.days.map((d, i) => ({ day: i + 1, title: d.title, activities: d.activities })),
  };
}

const SEEDS: Seed[] = [
  {
    id: 'dali',
    name: '大理',
    country: '中国·云南',
    tags: {
      mood: ['relax', 'photo'],
      budget: 'medium',
      duration: 'weekend',
      companion: ['couple', 'friends'],
      transport: ['train', 'bus'],
    },
    budget: { min: 1500, max: 3200, currency: 'CNY' },
    bestSeason: '3-5月, 9-11月',
    description:
      '苍山洱海与慢节奏古城，适合放空、骑行环湖与咖啡小店巡礼；白族民居与扎染手作让旅程更有温度，摄影与治愈感兼顾。',
    highlights: ['洱海生态廊道骑行', '双廊日落', '喜洲粑粑与扎染', '苍山索道'],
    days: [
      {
        title: '古城与人民路',
        activities: ['大理古城漫步', '人民路咖啡与书店', '夜间洋人街轻食'],
      },
      {
        title: '洱海东线',
        activities: ['双廊观景台', '小普陀海鸥季（冬季）', '海边公路拍照'],
      },
      {
        title: '喜洲与返程',
        activities: ['喜洲古镇麦田/稻田', '体验扎染工坊', '采购玫瑰乳扇伴手礼'],
      },
    ],
  },
  {
    id: 'lijiang',
    name: '丽江',
    country: '中国·云南',
    tags: {
      mood: ['relax', 'photo'],
      budget: 'medium',
      duration: 'week',
      companion: ['couple', 'solo'],
      transport: ['plane', 'train'],
    },
    budget: { min: 2200, max: 4800, currency: 'CNY' },
    bestSeason: '4-6月, 9-10月',
    description:
      '玉龙雪山与纳西古城交织，清晨石板路安静出片；泸沽湖可拼进长线，适合情侣慢旅行与独自疗愈，注意海拔与防晒。',
    highlights: ['玉龙雪山冰川公园', '大研古城夜景', '蓝月谷', '束河古镇'],
    days: [
      { title: '抵达丽江', activities: ['古城适应海拔', '木府周边散步', '纳西火塘晚餐'] },
      { title: '玉龙雪山', activities: ['冰川大索道预约时段', '蓝月谷徒步拍照', '印象丽江（可选）'] },
      { title: '束河白沙', activities: ['束河骑马体验', '白沙壁画', '手冲咖啡半日'] },
      { title: '古城深度', activities: ['狮子山观景', '忠义市场小吃', '伴手礼普洱茶'] },
    ],
  },
  {
    id: 'xishuangbanna',
    name: '西双版纳',
    country: '中国·云南',
    tags: {
      mood: ['food', 'photo', 'relax'],
      budget: 'medium',
      duration: 'weekend',
      companion: ['family', 'friends'],
      transport: ['plane', 'bus'],
    },
    budget: { min: 1800, max: 4000, currency: 'CNY' },
    bestSeason: '11月-次年4月',
    description:
      '热带雨林与傣味烧烤、夜市香茅草烤鱼；中科院植物园亲子科普强，曼听公园夜演有氛围，适合家庭与好友度假。',
    highlights: ['中科院热带植物园', '星光夜市', '野象谷（季节）', '傣味包烧'],
    days: [
      { title: '景洪市区', activities: ['曼听公园总佛寺', '澜沧江滨江步道', '江边夜市'] },
      { title: '植物园一日', activities: ['西区电瓶车+王莲池', '东区绿石林轻徒步', '返程傣族园泼水（节庆）'] },
      { title: '雨林与返程', activities: ['野象谷栈道', '水果市场榴莲/山竹', '机场或高铁'] },
    ],
  },
  {
    id: 'chengdu',
    name: '成都',
    country: '中国·四川',
    tags: {
      mood: ['food', 'relax'],
      budget: 'low',
      duration: 'weekend',
      companion: ['friends', 'solo'],
      transport: ['train', 'plane'],
    },
    budget: { min: 1200, max: 2800, currency: 'CNY' },
    bestSeason: '3-5月, 9-11月',
    description:
      '熊猫基地与火锅串串并列为城市名片；人民公园喝茶掏耳朵是本地松弛感，奎星楼、建设巷适合吃货特种兵打卡。',
    highlights: ['大熊猫繁育研究基地', '宽窄巷子', '人民公园鹤鸣茶社', '玉林夜宵'],
    days: [
      { title: '经典城区', activities: ['宽窄巷子+奎星楼街', '武侯祠锦里夜游', '火锅第一顿'] },
      { title: '熊猫与公园', activities: ['早上入园看熊猫活跃', '人民公园盖碗茶', '春熙路太古里'] },
      {
        title: '三星堆或都江堰',
        activities: ['三星堆博物馆讲解团（高铁）', '或都江堰离堆公园+南桥夜景', '晚上放松按摩'],
      },
    ],
  },
  {
    id: 'chongqing',
    name: '重庆',
    country: '中国·重庆',
    tags: {
      mood: ['food', 'photo'],
      budget: 'low',
      duration: 'weekend',
      companion: ['friends', 'couple'],
      transport: ['train', 'bus'],
    },
    budget: { min: 1000, max: 2400, currency: 'CNY' },
    bestSeason: '3-5月, 10-11月',
    description:
      '立体交通与江岸夜景、火锅小面双重暴击；洪崖洞与李子坝轻轨穿楼是出片标配，注意爬坡穿舒适鞋，夏季防暑。',
    highlights: ['洪崖洞夜景', '长江索道', '李子坝轻轨站', '南山一棵树'],
    days: [
      { title: '渝中半岛', activities: ['解放碑步行街', '八一路好吃街', '洪崖洞蓝调时刻'] },
      { title: '轻轨与老街', activities: ['李子坝观景平台', '磁器口古镇', '九宫格老火锅'] },
      { title: '南岸视野', activities: ['南山一棵树或壹华里夜景', '长江索道返程', '采购火锅底料'] },
    ],
  },
  {
    id: 'xian',
    name: '西安',
    country: '中国·陕西',
    tags: {
      mood: ['food', 'photo'],
      budget: 'low',
      duration: 'weekend',
      companion: ['friends', 'family'],
      transport: ['train', 'plane'],
    },
    budget: { min: 1100, max: 2600, currency: 'CNY' },
    bestSeason: '3-5月, 9-10月',
    description:
      '十三朝古都的城墙骑行与大雁塔音乐喷泉；回民街碳水天堂搭配陕历博，兵马俑建议预约讲解，夜游大唐不夜城氛围拉满。',
    highlights: ['兵马俑+丽山园', '城墙骑行', '陕西历史博物馆', '大唐不夜城'],
    days: [
      { title: '城东线', activities: ['兵马俑与铜车马展厅', '华清宫（可选长恨歌）', '返程市区泡馍'] },
      { title: '古城文博', activities: ['陕历博或考古博物馆', '大雁塔北广场喷泉', '大唐不夜城汉服拍照'] },
      { title: '城墙与美食', activities: ['永宁门上城墙骑行一段', '回民街柿子糊塌与灌汤包', '高家大院皮影（可选）'] },
    ],
  },
  {
    id: 'xiamen',
    name: '厦门',
    country: '中国·福建',
    tags: {
      mood: ['relax', 'photo'],
      budget: 'medium',
      duration: 'weekend',
      companion: ['couple', 'solo'],
      transport: ['plane', 'train'],
    },
    budget: { min: 1600, max: 3400, currency: 'CNY' },
    bestSeason: '10月-次年5月',
    description:
      '鼓浪屿万国建筑与环岛路海风日落；沙坡尾艺术西区适合咖啡与胶片感，曾厝垵可浅逛，注意船票与岛上步行量。',
    highlights: ['鼓浪屿日光岩', '环岛路骑行', '沙坡尾', '集美学村十里长堤'],
    days: [
      { title: '鼓浪屿', activities: ['早班船上岛', '最美转角与风琴博物馆', '龙头路小吃'] },
      { title: '本岛滨海', activities: ['白城沙滩日落', '沙坡尾艺术西区', '双子塔观景（可选）'] },
      { title: '集美一日', activities: ['地铁海上段', '嘉庚建筑群', '十里长堤草坪听歌'] },
    ],
  },
  {
    id: 'qingdao',
    name: '青岛',
    country: '中国·山东',
    tags: {
      mood: ['relax', 'photo'],
      budget: 'medium',
      duration: 'weekend',
      companion: ['family', 'couple'],
      transport: ['train', 'plane'],
    },
    budget: { min: 1400, max: 3000, currency: 'CNY' },
    bestSeason: '6-9月',
    description:
      '红瓦绿树与碧海蓝天，啤酒泡沫配海鲜大排档；八大关洋房散步亲子友好，崂山海岸线适合轻徒步与摄影。',
    highlights: ['栈桥与海鸥', '八大关花石楼', '崂山仰口线', '青岛啤酒博物馆'],
    days: [
      { title: '老城海滨', activities: ['栈桥晨跑或散步', '圣弥厄尔大教堂', '八大关公主楼'] },
      { title: '崂山', activities: ['仰口索道与觅天洞', '青山渔村渔村午餐', '太清宫海岸线'] },
      { title: '啤酒与城市', activities: ['啤酒博物馆原浆体验', '台东夜市海鲜', '奥帆中心夜景'] },
    ],
  },
  {
    id: 'hangzhou',
    name: '杭州',
    country: '中国·浙江',
    tags: {
      mood: ['relax', 'photo'],
      budget: 'medium',
      duration: 'weekend',
      companion: ['couple', 'solo'],
      transport: ['train', 'bus'],
    },
    budget: { min: 900, max: 2200, currency: 'CNY' },
    bestSeason: '3-5月, 9-11月',
    description:
      '西湖十景与龙井茶田把江南气质拉满；灵隐祈福、法喜寺黄墙出片，城市骑行友好，适合周末快闪与慢节奏散步。',
    highlights: ['西湖手划船/摇橹', '灵隐寺飞来峰', '法喜寺', '小河直街'],
    days: [
      { title: '西湖核心', activities: ['断桥白堤起步', '苏堤骑行或步行', '雷峰塔日落'] },
      { title: '灵隐与茶山', activities: ['灵隐寺祈福', '梅家坞或龙井村品茶', '九溪烟树轻徒步'] },
      { title: '运河老城', activities: ['小河直街咖啡', '拱宸桥运河博物馆', '伴手礼龙井茶'] },
    ],
  },
  {
    id: 'suzhou',
    name: '苏州',
    country: '中国·江苏',
    tags: {
      mood: ['relax', 'photo'],
      budget: 'medium',
      duration: 'weekend',
      companion: ['couple', 'family'],
      transport: ['train', 'drive'],
    },
    budget: { min: 1200, max: 2800, currency: 'CNY' },
    bestSeason: '4-5月, 9-10月',
    description:
      '园林框景一步一景，平江路评弹与苏式面点温柔治愈；周庄同里水乡可拼一日，适合情侣家庭与文化摄影爱好者。',
    highlights: ['拙政园', '平江路', '山塘街夜游', '苏州博物馆'],
    days: [
      { title: '经典园林', activities: ['拙政园清晨入园', '苏州博物馆本馆', '狮子林假山迷宫'] },
      { title: '古城水巷', activities: ['平江路手摇船', '耦园或艺圃小众园林', '评弹馆听曲'] },
      { title: '古镇或新城', activities: ['周庄或同里一日游', '或金鸡湖诚品书店', '苏式汤面收尾'] },
    ],
  },
  {
    id: 'beijing',
    name: '北京',
    country: '中国·北京',
    tags: {
      mood: ['photo', 'adventure'],
      budget: 'medium',
      duration: 'week',
      companion: ['family', 'friends'],
      transport: ['train', 'plane'],
    },
    budget: { min: 2200, max: 4500, currency: 'CNY' },
    bestSeason: '4-5月, 9-10月',
    description:
      '中轴线与人文宝藏密度极高；故宫国博需提前预约，长城慕田峪相对友好，胡同骑行与烤鸭涮肉构成京城味觉记忆。',
    highlights: ['故宫中轴线', '八达岭或慕田峪长城', '颐和园昆明湖', '天坛祈年殿'],
    days: [
      { title: '皇城核心', activities: ['故宫深度线（午门进神武门出）', '景山万春亭俯瞰', '前门大街夜景'] },
      { title: '长城日', activities: ['慕田峪索道上下', '好汉坡拍照', '返程按摩解乏'] },
      { title: '皇家园林', activities: ['颐和园长廊与石舫', '圆明园西洋楼遗址', '清华北大校门打卡'] },
      { title: '天坛与胡同', activities: ['天坛公园祈年殿', '南锣鼓巷周边胡同', '烤鸭店收尾'] },
    ],
  },
  {
    id: 'shanghai',
    name: '上海',
    country: '中国·上海',
    tags: {
      mood: ['photo', 'food'],
      budget: 'luxury',
      duration: 'weekend',
      companion: ['couple', 'friends'],
      transport: ['plane', 'train'],
    },
    budget: { min: 2800, max: 6500, currency: 'CNY' },
    bestSeason: '3-5月, 10-11月',
    description:
      '外滩天际线与西岸美术馆大道把都市度假感做足；法租界咖啡、本帮菜小馆与夜酒吧并存，适合精致出片与美食巡礼。',
    highlights: ['外滩夜景', '西岸美术馆大道', '武康路安福路', '迪士尼（可选）'],
    days: [
      { title: '外滩与浦东', activities: ['外滩晨跑或散步', '陆家嘴三件套机位', '浦东美术馆日落'] },
      { title: '西岸与咖啡', activities: ['龙美术馆西岸馆', '滨江滑板公园', '精品咖啡三连'] },
      { title: '法租界', activities: ['武康大楼', '思南公馆', '新天地晚餐'] },
    ],
  },
  {
    id: 'zhangjiajie',
    name: '张家界',
    country: '中国·湖南',
    tags: {
      mood: ['adventure', 'photo'],
      budget: 'medium',
      duration: 'weekend',
      companion: ['friends', 'solo'],
      transport: ['train', 'bus'],
    },
    budget: { min: 1800, max: 3600, currency: 'CNY' },
    bestSeason: '4-6月, 9-11月',
    description:
      '石英砂岩峰林与玻璃栈道带来强烈视觉冲击；百龙天梯与袁家界是阿凡达取景灵感地，体力消耗大需备登山杖与雨具。',
    highlights: ['国家森林公园袁家界', '天门山999级台阶', '大峡谷玻璃桥', '黄石寨'],
    days: [
      { title: '武陵源核心', activities: ['标志门入园', '百龙天梯上袁家界', '天下第一桥'] },
      { title: '天子山与十里画廊', activities: ['天子山索道', '贺龙公园', '十里画廊小火车'] },
      { title: '天门山', activities: ['A线索道上下', '玻璃栈道', '天门洞广场'] },
    ],
  },
  {
    id: 'guilin',
    name: '桂林',
    country: '中国·广西',
    tags: {
      mood: ['relax', 'photo'],
      budget: 'medium',
      duration: 'week',
      companion: ['family', 'couple'],
      transport: ['train', 'plane'],
    },
    budget: { min: 2000, max: 4200, currency: 'CNY' },
    bestSeason: '4-10月',
    description:
      '漓江游船与阳朔喀斯特峰丛是山水教科书；遇龙河竹筏与十里画廊骑行亲子友好，桂林米粉与啤酒鱼别错过。',
    highlights: ['漓江四星游船', '阳朔西街', '遇龙河竹筏', '龙脊梯田（季节）'],
    days: [
      { title: '桂林市区', activities: ['象鼻山打卡', '两江四湖夜游', '老东江米粉'] },
      { title: '漓江到阳朔', activities: ['游船或竹筏精华段', '兴坪二十元背景', '阳朔西街晚餐'] },
      { title: '遇龙河', activities: ['遇龙河竹筏预约时段', '十里画廊电动车', '印象刘三姐（可选）'] },
      { title: '返程缓冲', activities: ['银子岩溶洞', '伴手礼桂花糕', '高铁返桂林'] },
    ],
  },
  {
    id: 'lhasa',
    name: '拉萨',
    country: '中国·西藏',
    tags: {
      mood: ['adventure', 'photo'],
      budget: 'high',
      duration: 'week',
      companion: ['solo', 'friends'],
      transport: ['plane', 'train'],
    },
    budget: { min: 4500, max: 9000, currency: 'CNY' },
    bestSeason: '5-10月',
    description:
      '布达拉宫与大昭寺承载信仰与历史厚度；初到注意高反循序渐进，甜茶馆的慢聊是融入本地的捷径，防晒保暖必备。',
    highlights: ['布达拉宫', '大昭寺八廓街', '纳木错（适应后）', '色拉寺辩经'],
    days: [
      { title: '适应海拔', activities: ['酒店休整', '八廓街转经', '甜茶馆喝酥油茶'] },
      { title: '圣城核心', activities: ['布达拉宫预约参观', '药王山观景台', '宗角禄康公园'] },
      { title: '大昭寺周边', activities: ['大昭寺讲解', '冲赛康集市', '藏餐牦牛火锅'] },
      { title: '近郊圣湖', activities: ['纳木错一日（看身体情况）', '或羊卓雍措半日', '摄影与返程'] },
    ],
  },
  {
    id: 'dunhuang',
    name: '敦煌',
    country: '中国·甘肃',
    tags: {
      mood: ['adventure', 'photo'],
      budget: 'medium',
      duration: 'weekend',
      companion: ['friends', 'couple'],
      transport: ['plane', 'train'],
    },
    budget: { min: 2000, max: 4200, currency: 'CNY' },
    bestSeason: '5-10月',
    description:
      '莫高窟壁画与鸣沙山月牙泉构成丝路高光；雅丹魔鬼城日落极具电影感，注意风沙与饮水，骆驼体验选正规线路。',
    highlights: ['莫高窟A类票', '鸣沙山月牙泉', '阳关玉门关', '雅丹国家地质公园'],
    days: [
      { title: '莫高窟', activities: ['数字中心观影', '洞窟讲解参观', '敦煌书局盖章'] },
      { title: '鸣沙山', activities: ['傍晚骑骆驼', '沙丘看日落', '沙洲夜市驴肉黄面'] },
      { title: '西线', activities: ['阳关遗址', '玉门关汉长城', '雅丹日落返程'] },
    ],
  },
  {
    id: 'harbin',
    name: '哈尔滨',
    country: '中国·黑龙江',
    tags: {
      mood: ['photo', 'adventure'],
      budget: 'medium',
      duration: 'weekend',
      companion: ['friends', 'family'],
      transport: ['plane', 'train'],
    },
    budget: { min: 1600, max: 3800, currency: 'CNY' },
    bestSeason: '12月-次年2月',
    description:
      '冰雪大世界与中央大街俄式建筑把冬季限定氛围拉满；松花江冰上项目、红肠马迭尔冰棍是冷冽中的热量补给。',
    highlights: ['冰雪大世界夜场', '中央大街', '索菲亚大教堂', '伏尔加庄园'],
    days: [
      { title: '中央大街', activities: ['索菲亚教堂拍照', '中央大街马迭尔冰棍', '松花江铁路桥日落'] },
      { title: '冰雪乐园', activities: ['冰雪大世界下午入园等亮灯', '大滑梯预约', '暖屋姜茶'] },
      { title: '伏尔加或滑雪', activities: ['伏尔加庄园雪堡', '或亚布力滑雪一日', '锅包肉收尾'] },
    ],
  },
  {
    id: 'sanya',
    name: '三亚',
    country: '中国·海南',
    tags: {
      mood: ['relax', 'photo'],
      budget: 'luxury',
      duration: 'week',
      companion: ['family', 'couple'],
      transport: ['plane', 'drive'],
    },
    budget: { min: 4000, max: 12000, currency: 'CNY' },
    bestSeason: '11月-次年3月',
    description:
      '亚龙湾与海棠湾酒店度假感强，蜈支洲岛潜水与玻璃海适合出片；亲子水族馆与雨林公园可混搭，旺季注意预订与防晒。',
    highlights: ['亚龙湾海滩', '蜈支洲岛', '南山海上观音', '亚特兰蒂斯水世界'],
    days: [
      { title: '海湾躺平', activities: ['酒店泳池与私人沙滩', '椰梦长廊日落', '海鲜市场加工'] },
      { title: '蜈支洲', activities: ['早班船上岛', '电瓶车环岛', '浮潜或拖伞（可选）'] },
      { title: '文化与雨林', activities: ['南山文化旅游区', '亚龙湾热带天堂森林公园玻璃栈道'] },
      { title: '返程', activities: ['免税店补货', '清补凉与椰子鸡', '送机'] },
    ],
  },
  {
    id: 'changsha',
    name: '长沙',
    country: '中国·湖南',
    tags: {
      mood: ['food', 'photo'],
      budget: 'low',
      duration: 'weekend',
      companion: ['friends', 'solo'],
      transport: ['train', 'bus'],
    },
    budget: { min: 900, max: 2000, currency: 'CNY' },
    bestSeason: '3-5月, 10-11月',
    description:
      '茶颜悦色与口味虾、臭豆腐构成夜宵宇宙；岳麓书院橘子洲头红色打卡，文和友与解放西适合年轻人高密度出片。',
    highlights: ['橘子洲头小火车', '岳麓书院爱晚亭', '五一广场IFS', '超级文和友'],
    days: [
      { title: '湘江两岸', activities: ['橘子洲青年雕塑', '江边步道骑行', '文和友排队攻略'] },
      { title: '岳麓山', activities: ['湖南大学小吃街', '岳麓书院', '爱晚亭红叶季'] },
      { title: '城市打卡', activities: ['IFS楼顶雕塑', '坡子街火宫殿', '解放西酒吧（可选）'] },
    ],
  },
  {
    id: 'nanjing',
    name: '南京',
    country: '中国·江苏',
    tags: {
      mood: ['photo', 'relax'],
      budget: 'medium',
      duration: 'weekend',
      companion: ['family', 'couple'],
      transport: ['train', 'plane'],
    },
    budget: { min: 1300, max: 2800, currency: 'CNY' },
    bestSeason: '3-4月, 10-11月',
    description:
      '六朝古都的梧桐大道与明城墙；中山陵台阶、夫子庙秦淮河夜游与南京大屠杀纪念馆需分日安排，盐水鸭鸭血粉丝必吃。',
    highlights: ['中山陵音乐台', '明城墙台城段', '夫子庙秦淮河', '南京博物院'],
    days: [
      { title: '钟山风景区', activities: ['明孝陵石象路', '美龄宫', '中山陵预约登阶'] },
      { title: '博物院与城墙', activities: ['南京博物院民国馆', '台城段城墙日落', '老门东小吃'] },
      { title: '人文纪念', activities: ['侵华日军南京大屠杀遇难同胞纪念馆', '夫子庙夜游', '鸭血粉丝汤'] },
    ],
  },
  {
    id: 'bangkok',
    name: '曼谷',
    country: '泰国',
    tags: {
      mood: ['food', 'photo'],
      budget: 'medium',
      duration: 'weekend',
      companion: ['friends', 'couple'],
      transport: ['plane', 'bus'],
    },
    budget: { min: 2500, max: 5500, currency: 'CNY' },
    bestSeason: '11月-次年2月',
    description:
      '大皇宫卧佛寺与湄南河快船把经典一次打包；暹罗商圈购物与夜市火山排骨、芒果糯米饭让味蕾不停档，注意防暑与打车软件。',
    highlights: ['大皇宫玉佛寺', '郑王庙日落', '乍都乍周末市集', 'Jodd Fairs夜市'],
    days: [
      { title: '老城寺庙', activities: ['大皇宫玉佛寺', '卧佛寺按摩学校', '湄南河快船'] },
      { title: '河畔与现代', activities: ['郑王庙泰服拍照', 'ICONSIAM室内水上市场', '高空酒吧夜景'] },
      { title: '市集与返程', activities: ['乍都乍周末市集（逢周末）', '暹罗百丽宫', '机场退税'] },
    ],
  },
  {
    id: 'chiangmai',
    name: '清迈',
    country: '泰国·清迈',
    tags: {
      mood: ['relax', 'food'],
      budget: 'low',
      duration: 'weekend',
      companion: ['solo', 'couple'],
      transport: ['plane', 'bus'],
    },
    budget: { min: 1800, max: 4000, currency: 'CNY' },
    bestSeason: '11月-次年2月',
    description:
      '古城寺庙密度高节奏慢，宁曼路咖啡与泰北咖喱面治愈系；丛林飞跃与大象保护营请选伦理机构，水灯节档期需提前锁房。',
    highlights: ['双龙寺素贴山', '塔佩门古城墙', '宁曼路咖啡', '周日夜市'],
    days: [
      { title: '古城寺庙', activities: ['帕辛寺清曼寺', '女子监狱按摩预约', '泰北咖喱面午餐'] },
      { title: '素贴山', activities: ['双龙寺观景平台', '蒲屏皇宫花园', '宁曼一号逛街'] },
      { title: '近郊体验', activities: ['泰餐学校半日', '或大象自然公园', '周日夜市扫货'] },
    ],
  },
  {
    id: 'tokyo',
    name: '东京',
    country: '日本',
    tags: {
      mood: ['photo', 'food'],
      budget: 'high',
      duration: 'week',
      companion: ['friends', 'couple'],
      transport: ['plane', 'train'],
    },
    budget: { min: 6000, max: 14000, currency: 'CNY' },
    bestSeason: '3-5月, 10-11月',
    description:
      '涩谷新宿霓虹与浅草寺传统并存；筑地场外市场寿司、秋叶原宅文化与teamLab展可自由拼贴，地铁一日券提升效率。',
    highlights: ['浅草寺雷门', '涩谷SKY', '筑地寿司', 'teamLab无界'],
    days: [
      { title: '传统东京', activities: ['浅草寺仲见世', '晴空塔或墨田水族馆', '隅田川散步'] },
      { title: '潮流中枢', activities: ['涩谷十字路口', '涩谷SKY预约日落', '原宿竹下通'] },
      { title: '文化与购物', activities: ['上野公园博物馆群', '阿美横丁小吃', '银座夜景'] },
      { title: '自由日', activities: ['新宿御苑', '秋叶原手办', '歌舞伎町浅逛'] },
    ],
  },
  {
    id: 'osaka',
    name: '大阪',
    country: '日本',
    tags: {
      mood: ['food', 'photo'],
      budget: 'high',
      duration: 'weekend',
      companion: ['friends', 'family'],
      transport: ['plane', 'train'],
    },
    budget: { min: 4500, max: 9000, currency: 'CNY' },
    bestSeason: '3-5月, 10-11月',
    description:
      '道顿堀格力高与章鱼烧大阪烧是快乐碳水；环球影城需整日，京都奈良可一日往返，购物梅田心斋桥各有气质。',
    highlights: ['大阪城公园', '道顿堀心斋桥', '环球影城', '黑门市场海鲜'],
    days: [
      { title: '大阪核心', activities: ['大阪城天守阁', '黑门市场海鲜早午餐', '道顿堀夜景'] },
      { title: 'USJ或京都', activities: ['环球影城全天', '或京都清水寺二年坂'] },
      { title: '梅田', activities: ['HEP FIVE摩天轮', '梅田空中庭园展望台', '阪急百货伴手礼'] },
    ],
  },
  {
    id: 'seoul',
    name: '首尔',
    country: '韩国',
    tags: {
      mood: ['photo', 'food'],
      budget: 'medium',
      duration: 'weekend',
      companion: ['friends', 'couple'],
      transport: ['plane', 'train'],
    },
    budget: { min: 2800, max: 6000, currency: 'CNY' },
    bestSeason: '4-5月, 9-11月',
    description:
      '弘大梨泰院夜生活与北村韩屋村白天反差萌；烤肉炸鸡咖啡三件套管够，圣水洞汉南洞买手店适合出片，注意退税与交通卡。',
    highlights: ['景福宫穿韩服', '北村韩屋村', '南山首尔塔', '圣水洞咖啡街'],
    days: [
      { title: '宫殿线', activities: ['景福宫早场', '三清洞北村散步', '土俗村参鸡汤'] },
      { title: '潮流街区', activities: ['圣水洞工业风咖啡', '汉南洞买手店', '梨泰院日落酒吧'] },
      { title: '购物与医美（可选）', activities: ['明洞免税店', '弘大街头表演', '东大门设计广场夜景'] },
    ],
  },
  {
    id: 'singapore',
    name: '新加坡',
    country: '新加坡',
    tags: {
      mood: ['relax', 'photo'],
      budget: 'high',
      duration: 'weekend',
      companion: ['family', 'couple'],
      transport: ['plane', 'bus'],
    },
    budget: { min: 4000, max: 9000, currency: 'CNY' },
    bestSeason: '全年',
    description:
      '滨海湾花园擎天树灯光秀与鱼尾狮公园是城市名片；牛车水克拉码头美食多元，亲子可叠加动物园河川生态园，小而精高效移动。',
    highlights: ['滨海湾花园', '金沙空中花园', '圣淘沙环球影城', '牛车水美食'],
    days: [
      { title: '滨海湾', activities: ['鱼尾狮公园', '滨海湾花园云雾林', '擎天树灯光秀'] },
      { title: '多元文化', activities: ['牛车水佛牙寺', '小印度彩色街', '老巴刹熟食中心'] },
      { title: '圣淘沙', activities: ['环球影城或海洋馆', '西乐索海滩', '时光之翼（可选）'] },
    ],
  },
  {
    id: 'bali',
    name: '巴厘岛',
    country: '印度尼西亚',
    tags: {
      mood: ['relax', 'photo'],
      budget: 'high',
      duration: 'week',
      companion: ['couple', 'friends'],
      transport: ['plane', 'drive'],
    },
    budget: { min: 5000, max: 12000, currency: 'CNY' },
    bestSeason: '4-10月',
    description:
      '乌布梯田瑜伽与悬崖海景酒店把度假感做足；佩尼达岛精灵坠崖出片需体力，注意猴子抢物与防晒，SPA提前预约口碑店。',
    highlights: ['乌布猴林与梯田', '海神庙日落', '佩尼达岛精灵坠崖', '金巴兰海滩烧烤'],
    days: [
      { title: '乌布', activities: ['德格拉朗梯田秋千', '乌布皇宫市场', '脏鸭餐'] },
      { title: '佩尼达', activities: ['早班船精灵坠崖', '破碎沙滩天仙裂痕', '浮潜魔鬼鱼（可选）'] },
      { title: '南部海岸', activities: ['乌鲁瓦图断崖火舞', '金巴兰海鲜烧烤', '悬崖酒店下午茶'] },
      { title: '水明漾', activities: ['网红咖啡Brunch', '水明漾逛街', 'SPA两小时'] },
    ],
  },
  {
    id: 'phuket',
    name: '普吉岛',
    country: '泰国·普吉',
    tags: {
      mood: ['relax', 'adventure'],
      budget: 'medium',
      duration: 'week',
      companion: ['friends', 'couple'],
      transport: ['plane', 'bus'],
    },
    budget: { min: 3000, max: 7500, currency: 'CNY' },
    bestSeason: '11月-次年4月',
    description:
      '芭东夜生活与卡塔卡伦安静海滩可切换；皮皮岛跳岛浮潜看果冻海，西蒙秀与人妖秀择一看即可，租车右舵需谨慎。',
    highlights: ['芭东海滩', '皮皮岛一日游', '神仙半岛日落', '查龙寺'],
    days: [
      { title: '本岛海滩', activities: ['卡塔海滩浮潜', '查龙寺', '神仙半岛日落'] },
      { title: '跳岛', activities: ['皮皮岛玛雅湾', '猴子沙滩', '浮潜装备'] },
      { title: '丛林与大象', activities: ['丛林飞跃半日', '伦理大象营', '江西冷购物'] },
      { title: 'SPA返程', activities: ['泰式按摩两小时', '班赞海鲜市场', '送机'] },
    ],
  },
  {
    id: 'kualalumpur',
    name: '吉隆坡',
    country: '马来西亚',
    tags: {
      mood: ['food', 'photo'],
      budget: 'medium',
      duration: 'weekend',
      companion: ['friends', 'solo'],
      transport: ['plane', 'train'],
    },
    budget: { min: 2200, max: 4800, currency: 'CNY' },
    bestSeason: '全年',
    description:
      '双子塔夜景与独立广场殖民建筑同框；阿罗街榴莲与肉骨茶夜市治愈，黑风洞彩虹阶梯出片，适合中转或短途城市度假。',
    highlights: ['双子塔KLCC', '黑风洞', '独立广场', '阿罗街夜市'],
    days: [
      { title: '城市地标', activities: ['双子塔登塔预约', 'KLCC公园喷泉', '柏威年购物'] },
      { title: '文化混搭', activities: ['独立广场苏丹大厦', '国家清真寺', '中央艺术坊'] },
      { title: '黑风洞', activities: ['彩虹阶梯与猴群', '茨厂街午餐', '阿罗街榴莲烧烤'] },
    ],
  },
  {
    id: 'hanoi',
    name: '河内',
    country: '越南',
    tags: {
      mood: ['food', 'photo'],
      budget: 'low',
      duration: 'weekend',
      companion: ['solo', 'friends'],
      transport: ['plane', 'train'],
    },
    budget: { min: 1500, max: 3500, currency: 'CNY' },
    bestSeason: '10月-次年4月',
    description:
      '还剑湖三十六行街摩托洪流与法棍咖啡并存；下龙湾一日游石灰岩海上桂林，火车街拍照注意安全与营业时间。',
    highlights: ['还剑湖龟塔', '三十六行街', '下龙湾一日游', '火车街咖啡'],
    days: [
      { title: '老城步行', activities: ['还剑湖晨跑', '圣约瑟夫大教堂', '三十六行街法棍'] },
      { title: '下龙湾', activities: ['一日游游船午餐', '惊讶洞', '皮划艇穿洞（可选）'] },
      { title: '咖啡与博物馆', activities: ['鸡蛋咖啡', '越南国家历史博物馆', '同春市场伴手礼'] },
    ],
  },
  {
    id: 'kunming',
    name: '昆明',
    country: '中国·云南',
    tags: {
      mood: ['relax', 'food'],
      budget: 'low',
      duration: 'weekend',
      companion: ['solo', 'couple'],
      transport: ['train', 'plane'],
    },
    budget: { min: 900, max: 2000, currency: 'CNY' },
    bestSeason: '全年',
    description:
      '春城气候宜人作滇东南门户；滇池海埂大坝红嘴鸥冬季限定，斗南花市与过桥米线把烟火与浪漫一次给足，适合中转慢游。',
    highlights: ['滇池海埂大坝', '石林一日游', '斗南花市', '过桥米线'],
    days: [
      { title: '滇池线', activities: ['海埂大坝喂鸥', '云南民族村（可选）', '官渡古镇'] },
      { title: '石林', activities: ['高铁或包车石林景区', '大石林小石林', '彝族风味餐'] },
      { title: '市区松弛', activities: ['翠湖公园', '文林街咖啡', '斗南花市买花'] },
    ],
  },
  {
    id: 'shenzhen',
    name: '深圳',
    country: '中国·广东',
    tags: {
      mood: ['photo', 'relax'],
      budget: 'medium',
      duration: 'weekend',
      companion: ['friends', 'family'],
      transport: ['train', 'plane'],
    },
    budget: { min: 1400, max: 3200, currency: 'CNY' },
    bestSeason: '10月-次年4月',
    description:
      '滨海栈道与人才公园夜景把都市与自然缝合；设计互联展陈质量高，香港一日过境可选，科技园区咖啡与潮汕牛肉火锅别错过。',
    highlights: ['深圳湾公园日出', '人才公园大黄鸭机位', '海上世界文化艺术中心', '南头古城'],
    days: [
      { title: '滨海', activities: ['深圳湾公园骑行', '人才公园日落', '海岸城晚餐'] },
      { title: '设计与艺术', activities: ['海上世界文化艺术中心', '南头古城咖啡', '华侨城创意园'] },
      { title: '主题任选', activities: ['世界之窗或欢乐谷', '或大鹏较场尾海滩', '潮汕牛肉火锅收尾'] },
    ],
  },
];

export const DESTINATIONS: Destination[] = SEEDS.map(build);

export function getDestinationById(id: string): Destination | undefined {
  return DESTINATIONS.find((d) => d.id === id);
}
