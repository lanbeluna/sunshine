import { useState } from 'react';
import { ProfileSubPageLayout } from '@/features/profile/components/ProfileSubPageLayout';
import { Switch } from '@/components/ui/switch';
import { loadNotificationSettings, patchNotificationSettings, type NotificationSettings } from '@/lib/notificationSettingsStore';
import { useAppContext } from '@/context/useAppContext';
import { cn } from '@/lib/utils';

const ROWS: { key: keyof NotificationSettings; label: string }[] = [
  { key: 'tripReminder', label: '行程提醒' },
  { key: 'dailyRecommend', label: '每日推荐' },
  { key: 'socialMessage', label: '互动消息' },
  { key: 'systemNotice', label: '系统通知' },
];

export default function NotificationSettingsPage() {
  const { theme } = useAppContext();
  const light = theme === 'light';
  const [s, setS] = useState<NotificationSettings>(() => loadNotificationSettings());

  const update = (key: keyof NotificationSettings, on: boolean) => {
    const next = patchNotificationSettings({ [key]: on });
    setS(next);
  };

  return (
    <ProfileSubPageLayout title="通知设置">
      <div className="px-4">
        {ROWS.map((row, i) => (
          <div
            key={row.key}
            className={cn(
              'flex items-center justify-between gap-4 py-4',
              i < ROWS.length - 1 && (light ? 'border-b border-zinc-100' : 'border-b border-white/10')
            )}
          >
            <span className={cn('text-sm font-medium', light ? 'text-zinc-800' : 'text-wander-secondary')}>{row.label}</span>
            <Switch checked={s[row.key]} onCheckedChange={(c) => update(row.key, Boolean(c))} />
          </div>
        ))}
      </div>
    </ProfileSubPageLayout>
  );
}
