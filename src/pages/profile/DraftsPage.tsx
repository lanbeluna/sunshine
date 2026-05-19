import { useMemo } from 'react';
import { ProfileSubPageLayout } from '@/components/profile/ProfileSubPageLayout';
import { loadDraftNotes } from '@/lib/notesStore';
import { useAppContext } from '@/context/AppContext';
import { cn } from '@/lib/utils';

export default function DraftsPage() {
  const { theme } = useAppContext();
  const light = theme === 'light';
  const drafts = useMemo(() => loadDraftNotes(), []);

  return (
    <ProfileSubPageLayout
      title="草稿箱"
      right={
        <span className="rounded-md bg-amber-500/20 px-2 py-0.5 text-[10px] font-bold uppercase text-amber-300">草稿</span>
      }
    >
      <div className="px-4 pb-24 pt-4">
        {drafts.length === 0 ? (
          <div className="flex flex-col items-center justify-center px-6 py-24 text-center">
            <p className={cn('text-sm', light ? 'text-zinc-600' : 'text-wander-secondary')}>草稿箱是空的</p>
          </div>
        ) : (
          <ul className="flex flex-col gap-2">
            {drafts.map((d) => (
              <li
                key={d.id}
                className={cn(
                  'rounded-2xl border px-4 py-3',
                  light ? 'border-zinc-200 bg-white' : 'border-white/10 bg-wander-card'
                )}
              >
                <p className={cn('font-medium', light ? 'text-zinc-900' : 'text-white')}>{d.title}</p>
                <p className={cn('mt-1 text-xs', light ? 'text-zinc-500' : 'text-wander-muted')}>草稿 · 未发布</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </ProfileSubPageLayout>
  );
}
