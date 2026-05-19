/**
 * Unsplash 静态图（images.unsplash.com），国内 CDN 友好，避免 picsum。
 * @param path 不含域名，形如 `photo-1507525428034-b723cf961d3e`
 */
export function unsplashCrop(path: string, width: number, height: number): string {
  const w = Math.min(Math.max(width, 1), 4000);
  const h = Math.min(Math.max(height, 1), 4000);
  return `https://images.unsplash.com/${path}?ixlib=rb-4.0.3&auto=format&fit=crop&w=${w}&h=${h}&q=80`;
}
