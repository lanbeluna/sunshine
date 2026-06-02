import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { PenLine } from 'lucide-react';
import { Card } from '@/components/common/Card';
import { EmptyState } from '@/components/common/EmptyState';
import { Tag } from '@/components/common/Tag';
import { ProfileSubPageLayout } from '@/features/profile/components/ProfileSubPageLayout';
import { loadDraftNotes } from '@/lib/notesStore';

export default function DraftsPage() {
  const navigate = useNavigate();
  const drafts = useMemo(() => loadDraftNotes(), []);

  return (
    <ProfileSubPageLayout
      title="旅行手记草稿"
      right={<Tag className="bg-amber-400/12 text-amber-200">Draft</Tag>}
    >
      <div className="px-4 pb-24 pt-4">
        {drafts.length === 0 ? (
          <EmptyState
            icon={<PenLine className="h-6 w-6 text-[var(--ql-accent)]" />}
            title="还没有旅行手记草稿"
            description="从推荐结果页点击「写入手记草稿」，这里会保存你的旅行灵感、预算和路线想法。"
            actionLabel="去生成旅行灵感"
            onAction={() => navigate('/decision')}
          />
        ) : (
          <ul className="flex flex-col gap-3">
            {drafts.map((draft) => (
              <li key={draft.id}>
                <Card className="px-4 py-3">
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-amber-400/15 text-amber-200">
                      <PenLine className="h-5 w-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="line-clamp-2 text-sm font-black text-[var(--ql-ink)]">{draft.title}</h3>
                      <p className="mt-1 text-xs text-[var(--ql-muted)]">
                        未发布 · {new Date(draft.savedAt).toLocaleDateString()}
                      </p>
                      {draft.tags.length > 0 ? (
                        <div className="mt-2 flex flex-wrap gap-1.5">
                          {draft.tags.slice(0, 3).map((tag) => (
                            <Tag key={tag}>{tag}</Tag>
                          ))}
                        </div>
                      ) : null}
                    </div>
                  </div>
                </Card>
              </li>
            ))}
          </ul>
        )}
      </div>
    </ProfileSubPageLayout>
  );
}
