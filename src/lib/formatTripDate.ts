/** 例：2026.06.15 - 06.18（结束日为同年月日简写） */
export function formatTripDateRange(startIso: string, endIso: string): string {
  const s = new Date(startIso + 'T12:00:00');
  const e = new Date(endIso + 'T12:00:00');
  const pad = (n: number) => String(n).padStart(2, '0');
  const y = s.getFullYear();
  const head = `${y}.${pad(s.getMonth() + 1)}.${pad(s.getDate())}`;
  const endPart = `${pad(e.getMonth() + 1)}.${pad(e.getDate())}`;
  return `${head} - ${endPart}`;
}
