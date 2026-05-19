/**
 * 每个目的地固定 3 张可直连的图（封面 / 美食 / 风景），避免哈希池与首字渐变占位。
 * URL 来源以用户指定清单为主，其余为稳定 Unsplash 直链。
 */
export type DestinationImageSet = {
  cover: string;
  food: string;
  scenery: string;
};

const Q = '?w=800&q=80';

/** 威海（示例行程卡片用，当前未在决策目的地列表内） */
export const WEIHAI_IMAGES: DestinationImageSet = {
  cover: `https://images.unsplash.com/photo-1507525428034-b723cf961d3e${Q}`,
  food: `https://images.unsplash.com/photo-1559339352-11d035aa65de${Q}`,
  scenery: `https://images.unsplash.com/photo-1476514525535-07fb3b4aae5f${Q}`,
};

export const DESTINATION_IMAGE_SETS: Record<string, DestinationImageSet> = {
  dali: {
    cover: `https://images.unsplash.com/photo-1547981609-4b6bfe67ca0b${Q}`,
    food: `https://images.unsplash.com/photo-1563245372-f21724e3856d${Q}`,
    scenery: `https://images.unsplash.com/photo-1528164344705-47542687000d${Q}`,
  },
  lijiang: {
    cover: `https://images.unsplash.com/photo-1547981609-4b6bfe67ca0b${Q}`,
    food: `https://images.unsplash.com/photo-1563245372-f21724e3856d${Q}`,
    scenery: `https://images.unsplash.com/photo-1528164344705-47542687000d${Q}`,
  },
  xishuangbanna: {
    cover: `https://images.unsplash.com/photo-1598935898639-33d88dbd5f59${Q}`,
    food: `https://images.unsplash.com/photo-1559314809-0d155014e29e${Q}`,
    scenery: `https://images.unsplash.com/photo-1513635269975-59663e0ac1ad${Q}`,
  },
  chengdu: {
    cover: `https://images.unsplash.com/photo-1565521991746-0a0edc2b9af2${Q}`,
    food: `https://images.unsplash.com/photo-1563245372-f21724e3856d${Q}`,
    scenery: `https://images.unsplash.com/photo-1590077428593-a55bb07c4665${Q}`,
  },
  chongqing: {
    cover: `https://images.unsplash.com/photo-1535025639604-9a804c092faa${Q}`,
    food: `https://images.unsplash.com/photo-1569718212165-3a8278d5f624${Q}`,
    scenery: `https://images.unsplash.com/photo-1548919973-5cef591cdbc9${Q}`,
  },
  xian: {
    cover: `https://images.unsplash.com/photo-1599571234909-29ed5d1321d6${Q}`,
    food: `https://images.unsplash.com/photo-1569718212165-3a8278d5f624${Q}`,
    scenery: `https://images.unsplash.com/photo-1548919973-5cef591cdbc9${Q}`,
  },
  xiamen: {
    cover: `https://images.unsplash.com/photo-1559592413-7cec4d0cae2b${Q}`,
    food: `https://images.unsplash.com/photo-1563245372-f21724e3856d${Q}`,
    scenery: `https://images.unsplash.com/photo-1506744038136-46273834b3fb${Q}`,
  },
  qingdao: {
    cover: `https://images.unsplash.com/photo-1507525428034-b723cf961d3e${Q}`,
    food: `https://images.unsplash.com/photo-1559339352-11d035aa65de${Q}`,
    scenery: `https://images.unsplash.com/photo-1476514525535-07fb3b4aae5f${Q}`,
  },
  hangzhou: {
    cover: `https://images.unsplash.com/photo-1565378435245-2528d587e524${Q}`,
    food: `https://images.unsplash.com/photo-1563245372-f21724e3856d${Q}`,
    scenery: `https://images.unsplash.com/photo-1528164344705-47542687000d${Q}`,
  },
  suzhou: {
    cover: `https://images.unsplash.com/photo-1565378435245-2528d587e524${Q}`,
    food: `https://images.unsplash.com/photo-1563245372-f21724e3856d${Q}`,
    scenery: `https://images.unsplash.com/photo-1528164344705-47542687000d${Q}`,
  },
  beijing: {
    cover: `https://images.unsplash.com/photo-1508804185872-d7badad00f7d${Q}`,
    food: `https://images.unsplash.com/photo-1563245372-f21724e3856d${Q}`,
    scenery: `https://images.unsplash.com/photo-1548919973-5cef591cdbc9${Q}`,
  },
  shanghai: {
    cover: `https://images.unsplash.com/photo-1538428494232-9c0d8a3ab403${Q}`,
    food: `https://images.unsplash.com/photo-1563245372-f21724e3856d${Q}`,
    scenery: `https://images.unsplash.com/photo-1548919973-5cef591cdbc9${Q}`,
  },
  zhangjiajie: {
    cover: `https://images.unsplash.com/photo-1506744038136-46273834b3fb${Q}`,
    food: `https://images.unsplash.com/photo-1563245372-f21724e3856d${Q}`,
    scenery: `https://images.unsplash.com/photo-1528164344705-47542687000d${Q}`,
  },
  guilin: {
    cover: `https://images.unsplash.com/photo-1535025639604-9a804c092faa${Q}`,
    food: `https://images.unsplash.com/photo-1563245372-f21724e3856d${Q}`,
    scenery: `https://images.unsplash.com/photo-1506744038136-46273834b3fb${Q}`,
  },
  lhasa: {
    cover: `https://images.unsplash.com/photo-1518003490197-25e6ae29e145${Q}`,
    food: `https://images.unsplash.com/photo-1563245372-f21724e3856d${Q}`,
    scenery: `https://images.unsplash.com/photo-1528164344705-47542687000d${Q}`,
  },
  dunhuang: {
    cover: `https://images.unsplash.com/photo-1506744038136-46273834b3fb${Q}`,
    food: `https://images.unsplash.com/photo-1563245372-f21724e3856d${Q}`,
    scenery: `https://images.unsplash.com/photo-1528164344705-47542687000d${Q}`,
  },
  harbin: {
    cover: `https://images.unsplash.com/photo-1518003490197-25e6ae29e145${Q}`,
    food: `https://images.unsplash.com/photo-1569718212165-3a8278d5f624${Q}`,
    scenery: `https://images.unsplash.com/photo-1548919973-5cef591cdbc9${Q}`,
  },
  sanya: {
    cover: `https://images.unsplash.com/photo-1507525428034-b723cf961d3e${Q}`,
    food: `https://images.unsplash.com/photo-1559339352-11d035aa65de${Q}`,
    scenery: `https://images.unsplash.com/photo-1476514525535-07fb3b4aae5f${Q}`,
  },
  changsha: {
    cover: `https://images.unsplash.com/photo-1565521991746-0a0edc2b9af2${Q}`,
    food: `https://images.unsplash.com/photo-1569718212165-3a8278d5f624${Q}`,
    scenery: `https://images.unsplash.com/photo-1548919973-5cef591cdbc9${Q}`,
  },
  nanjing: {
    cover: `https://images.unsplash.com/photo-1599571234909-29ed5d1321d6${Q}`,
    food: `https://images.unsplash.com/photo-1569718212165-3a8278d5f624${Q}`,
    scenery: `https://images.unsplash.com/photo-1548919973-5cef591cdbc9${Q}`,
  },
  bangkok: {
    cover: `https://images.unsplash.com/photo-1508009603885-50cf7c579365${Q}`,
    food: `https://images.unsplash.com/photo-1559314809-0d155014e29e${Q}`,
    scenery: `https://images.unsplash.com/photo-1513635269975-59663e0ac1ad${Q}`,
  },
  chiangmai: {
    cover: `https://images.unsplash.com/photo-1598935898639-33d88dbd5f59${Q}`,
    food: `https://images.unsplash.com/photo-1559314809-0d155014e29e${Q}`,
    scenery: `https://images.unsplash.com/photo-1513635269975-59663e0ac1ad${Q}`,
  },
  tokyo: {
    cover: `https://images.unsplash.com/photo-1540959733332-eab4deabeeaf${Q}`,
    food: `https://images.unsplash.com/photo-1553621042-f6e147245754${Q}`,
    scenery: `https://images.unsplash.com/photo-1542051841857-5f90071e7989${Q}`,
  },
  osaka: {
    cover: `https://images.unsplash.com/photo-1590559899731-a382839e5549${Q}`,
    food: `https://images.unsplash.com/photo-1553621042-f6e147245754${Q}`,
    scenery: `https://images.unsplash.com/photo-1542051841857-5f90071e7989${Q}`,
  },
  seoul: {
    cover: `https://images.unsplash.com/photo-1538485399081-7191377e8241${Q}`,
    food: `https://images.unsplash.com/photo-1580651315530-69c8e0026787${Q}`,
    scenery: `https://images.unsplash.com/photo-1548115184-bc6544d06a58${Q}`,
  },
  singapore: {
    cover: `https://images.unsplash.com/photo-1525625293386-3f8f99389edd${Q}`,
    food: `https://images.unsplash.com/photo-1569718212165-3a8278d5f624${Q}`,
    scenery: `https://images.unsplash.com/photo-1506351421178-63b52a2d2562${Q}`,
  },
  bali: {
    cover: `https://images.unsplash.com/photo-1537996194471-e657df975ab4${Q}`,
    food: `https://images.unsplash.com/photo-1559339352-11d035aa65de${Q}`,
    scenery: `https://images.unsplash.com/photo-1518548419970-58e3b4079ab2${Q}`,
  },
  phuket: {
    cover: `https://images.unsplash.com/photo-1589394815804-964ed0be2eb5${Q}`,
    food: `https://images.unsplash.com/photo-1559314809-0d155014e29e${Q}`,
    scenery: `https://images.unsplash.com/photo-1513635269975-59663e0ac1ad${Q}`,
  },
  kualalumpur: {
    cover: `https://images.unsplash.com/photo-1596422846543-75c6fc197f07${Q}`,
    food: `https://images.unsplash.com/photo-1569718212165-3a8278d5f624${Q}`,
    scenery: `https://images.unsplash.com/photo-1548919973-5cef591cdbc9${Q}`,
  },
  hanoi: {
    cover: `https://images.unsplash.com/photo-1528127220108-612460f947ac${Q}`,
    food: `https://images.unsplash.com/photo-1559314809-0d155014e29e${Q}`,
    scenery: `https://images.unsplash.com/photo-1528164344705-47542687000d${Q}`,
  },
  /** 清单未单列：昆明滇池与城市 */
  kunming: {
    cover: `https://images.unsplash.com/photo-1504198458649-3128b932f49e${Q}`,
    food: `https://images.unsplash.com/photo-1569718212165-3a8278d5f624${Q}`,
    scenery: `https://images.unsplash.com/photo-1506744038136-46273834b3fb${Q}`,
  },
  /** 清单未单列：滨海都市天际线 */
  shenzhen: {
    cover: `https://images.unsplash.com/photo-1518558996980-ef18478c1bef${Q}`,
    food: `https://images.unsplash.com/photo-1563245372-f21724e3856d${Q}`,
    scenery: `https://images.unsplash.com/photo-1548919973-5cef591cdbc9${Q}`,
  },
};

const DEFAULT_IMAGES: DestinationImageSet = {
  cover: `https://images.unsplash.com/photo-1469854523086-cc02fe5d8800${Q}`,
  food: `https://images.unsplash.com/photo-1569718212165-3a8278d5f624${Q}`,
  scenery: `https://images.unsplash.com/photo-1506744038136-46273834b3fb${Q}`,
};

export function getDestinationImages(id: string): DestinationImageSet {
  return DESTINATION_IMAGE_SETS[id] ?? DEFAULT_IMAGES;
}

/** 行程列表卡片封面（与决策目的地解耦的示例行程） */
export function tripListCoverUrl(tripId: string): string {
  switch (tripId) {
    case 't1':
      return getDestinationImages('dali').cover;
    case 't2':
      return getDestinationImages('chongqing').cover;
    case 't3':
      return WEIHAI_IMAGES.cover;
    case 't4':
      return `https://images.unsplash.com/photo-1578662996442-48f60103fc96${Q}`;
    case 't5':
      return getDestinationImages('harbin').cover;
    default:
      return DEFAULT_IMAGES.cover;
  }
}

/** 行程卡片「每日」配图：与决策结果页一致，按天轮换封面/美食/风景 */
export function itineraryDayImageUrl(set: DestinationImageSet, dayIndexZero: number): string {
  const pool = [set.cover, set.food, set.scenery];
  return pool[dayIndexZero % 3]!;
}
