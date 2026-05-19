import type { Transport } from '@/types/decision';

const LABEL: Record<Transport, string> = {
  train: '高铁/火车',
  plane: '飞机',
  drive: '自驾',
  bus: '大巴',
};

export function formatTransportList(ts: Transport[]): string {
  return ts.map((t) => LABEL[t]).join(' · ');
}
