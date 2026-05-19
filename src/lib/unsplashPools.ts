import { unsplashCrop } from './unsplash';

/** 封面 / 风景类（横图） */
export const UNSPLASH_COVER_PATHS = [
  'photo-1507525428034-b723cf961d3e',
  'photo-1469854523086-cc02fe5d8800',
  'photo-1476514525535-07fb3b4aae5f',
  'photo-1494500764479-0c8f2919a3d8',
  'photo-1506905925346-21bda4d32df4',
  'photo-1464822759023-fed622ff2c3c',
  'photo-1441974231531-c6227db76b6e',
  'photo-1501785888041-af3ef285b470',
  'photo-1470071459604-3b896bc7498c',
  'photo-1518838499439-4d842841d1a4',
  'photo-1523906834658-44e2d027de51',
  'photo-1551632811-5607d993f35e',
  'photo-1500534314209-a25ddb2bd429',
  'photo-1483728642387-6c3bdd6c93e5',
  'photo-1433086966358-54859d0ed716',
  'photo-1519904981063-b0cf448b4795',
  'photo-1502920917128-1aa500764cbd',
  'photo-1526778548025-fa2f459cd5c1',
  'photo-1493246507139-91e8fad9978e',
  'photo-1505761671935-60b3a7427bad',
] as const;

/** 美食类 */
export const UNSPLASH_FOOD_PATHS = [
  'photo-1546069901-ba9599a7e63c',
  'photo-1569718212165-3a8278d5f624',
  'photo-1563379926898-05f4575a45d8',
  'photo-1555939594-58d7cb561ad1',
  'photo-1504674900240-87a723f93b99',
  'photo-1496417263034-38ec4f0b665a',
  'photo-1517248135467-4c7edcad34c4',
  'photo-1551218807-5e9e8267447b',
  'photo-1565299624946-b28f40a0ae38',
  'photo-1540189549336-e6e99c3679fe',
  'photo-1476224203421-9ac39bcb3327',
  'photo-1482049016688-2d3ee1b54343',
  'photo-1498654896293-37aacf113fd9',
  'photo-1504754524776-8f4f37790ca0',
  'photo-1559339352-11d035aa65de',
] as const;

/** 竖图 / 人像（头像、小卡） */
export const UNSPLASH_PORTRAIT_PATHS = [
  'photo-1534528741775-53994a69daeb',
  'photo-1507003211169-0a1dd7228f2d',
  'photo-1500648767791-00dcc994a43e',
  'photo-1494790108377-be9c29b29330',
  'photo-1438761681033-6461ffad8d80',
  'photo-1544005313-94ddf0286df2',
  'photo-1506794778202-cad84cf45f1d',
  'photo-1539578701126-7b35fb79982b',
  'photo-1524504388940-b1c1722653e1',
  'photo-1488426862026-3ee34a7d66df',
  'photo-1508214751196-bcfd4ca60f91',
  'photo-1521572267360-ee0c2909d518',
] as const;

export function hashSeed(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return h;
}

export function pickCover(pathSeed: string, w: number, h: number): string {
  const i = hashSeed(pathSeed) % UNSPLASH_COVER_PATHS.length;
  return unsplashCrop(UNSPLASH_COVER_PATHS[i], w, h);
}

export function pickFood(pathSeed: string, w: number, h: number): string {
  const i = hashSeed(`f-${pathSeed}`) % UNSPLASH_FOOD_PATHS.length;
  return unsplashCrop(UNSPLASH_FOOD_PATHS[i], w, h);
}

export function pickScenery(pathSeed: string, w: number, h: number): string {
  const i = hashSeed(`s-${pathSeed}`) % UNSPLASH_COVER_PATHS.length;
  const j = (i + 3 + (hashSeed(pathSeed) % 5)) % UNSPLASH_COVER_PATHS.length;
  return unsplashCrop(UNSPLASH_COVER_PATHS[j], w, h);
}

export function pickPortrait(seed: string, size: number): string {
  const i = hashSeed(`p-${seed}`) % UNSPLASH_PORTRAIT_PATHS.length;
  return unsplashCrop(UNSPLASH_PORTRAIT_PATHS[i], size, size);
}

/** 信息流用：每条不同主图 */
export function feedHeroUrl(index: number, w: number, h: number): string {
  const id = UNSPLASH_COVER_PATHS[index % UNSPLASH_COVER_PATHS.length];
  const alt = UNSPLASH_FOOD_PATHS[index % UNSPLASH_FOOD_PATHS.length];
  const pick = index % 3 === 0 ? id : index % 3 === 1 ? alt : UNSPLASH_COVER_PATHS[(index + 7) % UNSPLASH_COVER_PATHS.length];
  return unsplashCrop(pick, w, h);
}
