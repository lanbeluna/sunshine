import type { ReactNode } from 'react';
import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';
import { useAppContext } from '@/context/useAppContext';

type Props = {
  icon: ReactNode;
  title: string;
  checked: boolean;
  onCheckedChange: (v: boolean) => void;
};

export function MenuRowSwitch({ icon, title, checked, onCheckedChange }: Props) {
  const { theme } = useAppContext();
  const light = theme === 'light';

  return (
    <div
      className={cn(
        'flex items-center gap-3 border-b px-4 py-3.5',
        light ? 'border-zinc-100' : 'border-white/10'
      )}
    >
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-wander-coral/10 text-wander-coral">{icon}</span>
      <span className={cn('flex-1 text-sm font-medium', light ? 'text-zinc-900' : 'text-white')}>{title}</span>
      <Switch checked={checked} onCheckedChange={onCheckedChange} className="shrink-0 scale-110" />
    </div>
  );
}
