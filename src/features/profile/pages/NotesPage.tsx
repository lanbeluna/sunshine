import { useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BookOpen } from 'lucide-react';
import { EmptyState } from '@/components/common/EmptyState';
import { FeedCard } from '@/features/explore/components/FeedCard';
import { ProfileSubPageLayout } from '@/features/profile/components/ProfileSubPageLayout';
import { loadPublishedNotes, type UserNoteCard } from '@/lib/notesStore';
import { toast } from '@/lib/toast';
import type { FeedCategoryId, FeedItem } from '@/types/feed';

function noteBody(title: string): string {
  return `这是围绕「${title}」整理的旅行记录，可以继续补充真实照片、花费和体验。`;
}

function toFeedItem(note: UserNoteCard): FeedItem {
  return {
    id: note.id,
    type: 'guide',
    title: note.title,
    author: { name: note.authorName, avatar: note.authorAvatar },
    image: note.image,
    likes: note.likes,
    isLiked: false,
    isCollected: false,
    tags: note.tags,
    category: '旅行手记',
    categoryId: 'all' as FeedCategoryId,
    body: note.body ?? noteBody(note.title),
  };
}

export default function NotesPage() {
  const navigate = useNavigate();
  const notes = useMemo(() => loadPublishedNotes(), []);
  const items = useMemo(() => notes.map(toFeedItem), [notes]);

  return (
    <ProfileSubPageLayout
      title="旅行手记"
      right={
        <button
          type="button"
          onClick={() => navigate('/profile/drafts')}
          className="rounded-full bg-[var(--ql-soft)] px-3 py-1.5 text-xs font-bold text-[var(--ql-muted)]"
        >
          草稿箱
        </button>
      }
    >
      <div className="px-4 pb-24 pt-4">
        {items.length === 0 ? (
          <EmptyState
            icon={<BookOpen className="h-6 w-6 text-[var(--ql-accent)]" />}
            title="还没有旅行手记"
            description="保存推荐结果为手记草稿后，可以在这里整理成更完整的作品展示内容。"
            actionLabel="查看草稿箱"
            onAction={() => navigate('/profile/drafts')}
          />
        ) : (
          <div className="columns-2 gap-3 [column-fill:_balance]">
            {items.map((feed, index) => (
              <div key={feed.id} className="mb-3 break-inside-avoid">
                <FeedCard
                  item={feed}
                  index={index}
                  onLike={() => toast.message('演示数据暂不记录点赞')}
                  onCollect={() => toast.message('演示数据暂不重复收藏')}
                  onOpen={() => toast.info(feed.title)}
                />
              </div>
            ))}
          </div>
        )}
        <p className="pb-safe pt-8 text-center text-[11px] text-[var(--ql-muted)]">
          <Link to="/decision" className="font-bold text-[var(--ql-accent)]">
            生成新的旅行灵感
          </Link>
        </p>
      </div>
    </ProfileSubPageLayout>
  );
}
