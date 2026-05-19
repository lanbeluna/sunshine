export function getStickerEmoji(sticker: string): string {
  const map: Record<string, string> = {
    sun: '☀️',
    cloud: '☁️',
    rain: '🌧️',
    mapPin: '📍',
    plane: '✈️',
    train: '🚂',
    heart: '❤️',
    star: '⭐',
    camera: '📷',
    coffee: '☕',
  };
  return map[sticker] ?? '✨';
}

/** 天气文案 → 角标 emoji（Polaroid 等） */
export function getWeatherEmoji(weather?: string): string | null {
  if (!weather?.trim()) return null;
  const w = weather.toLowerCase();
  if (/晴|sunny|clear|sun/i.test(weather)) return '☀️';
  if (/雨|rain|drizzle|shower/i.test(weather)) return '🌧️';
  if (/云|cloud|阴|overcast/i.test(weather)) return '☁️';
  if (/雪|snow/i.test(weather)) return '❄️';
  if (/风|wind/i.test(weather)) return '💨';
  if (/雾|fog|mist/i.test(weather)) return '🌫️';
  if (w.includes('thunder') || /雷/i.test(weather)) return '⛈️';
  return '🌤️';
}

/** 邮戳 / 角标用短日期 */
export function formatDateAbbrev(date: string): string {
  const d = new Date(date);
  if (!Number.isNaN(d.getTime())) {
    const mon = d.toLocaleString('en', { month: 'short' });
    const day = d.getDate();
    const yr = d.getFullYear().toString().slice(-2);
    return `${mon} ${day}, '${yr}`;
  }
  return date.length > 12 ? `${date.slice(0, 12)}…` : date;
}
