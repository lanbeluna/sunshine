import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { toast } from '@/lib/toast';
import { FeedCard } from '@/components/explore/FeedCard';
import { WanderImage } from '@/components/media/WanderImage';
import { ProfileSubPageLayout } from '@/components/profile/ProfileSubPageLayout';
import { loadPublishedNotes, type UserNoteCard } from '@/lib/notesStore';
import { useAppContext } from '@/context/AppContext';
import { cn } from '@/lib/utils';
import type { FeedCategoryId, FeedItem } from '@/types/feed';

function defaultNoteBody(title: string): string {
  return (
    `这是我在「我的笔记」里发布的内容。\n\n` +
    `围绕「${title}」记录了行程节奏、花销区间和实际体验；配图与标题见卡片封面。\n\n` +
    `若你也在规划相近路线，欢迎在探索页同款信息流里留言交流。`
  );
}

function toFeedItem(n: UserNoteCard): FeedItem {
  return {
    id: n.id,
    type: 'guide',
    title: n.title,
    author: { name: n.authorName, avatar: n.authorAvatar },
    image: n.image,
    likes: n.likes,
    isLiked: false,
    isCollected: false,
    tags: n.tags,
    category: '我的笔记',
    categoryId: 'all' as FeedCategoryId,
    body: n.body ?? defaultNoteBody(n.title),
  };
}

export default function NotesPage() {
  const { theme } = useAppContext();
  const light = theme === 'light';
  const notes = useMemo(() => loadPublishedNotes(), []);

  const items = useMemo(() => notes.map(toFeedItem), [notes]);

  return (
    <ProfileSubPageLayout
      title="我的笔记"
      right={
        <button
          type="button"
          onClick={() => toast.info('写笔记', { description: '演示：编辑器与富文本将在后续版本接入。' })}
          className="rounded-lg px-2 py-1 text-xs font-semibold text-indigo-400"
        >
          + 写笔记
        </button>
      }
    >
      <div className="px-4 pb-24 pt-4">
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center px-6 py-20 text-center">
            <WanderImage
              src=""
              alt=""
              fallbackLabel="笔记"
              className="mb-5 h-36 w-full max-w-[280px] overflow-hidden rounded-2xl shadow-lg shadow-black/20"
              width={560}
              height={288}
            />
            <p className={cn('text-sm', light ? 'text-zinc-600' : 'text-wander-secondary')}>还没有发布笔记</p>
            <button
              type="button"
              onClick={() => toast.info('写一条', { description: '演示：将打开笔记编辑器。' })}
              className="mt-6 inline-flex h-11 items-center justify-center rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 px-6 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25"
            >
              写一条
            </button>
          </div>
        ) : (
          <div className="columns-2 gap-3 [column-fill:_balance]">
            {items.map((feed, index) => (
              <div key={feed.id} className="mb-3 break-inside-avoid">
                <FeedCard
                  item={feed}
                  index={index}
                  onLike={() => toast.message('点赞为演示数据')}
                  onCollect={() => toast.message('收藏为演示数据')}
                  onOpen={() => toast.info(feed.title)}
                />
              </div>
            ))}
          </div>
        )}
        <p className="pb-safe pt-8 text-center text-[11px] text-wander-muted">
          <Link to="/explore" className="text-indigo-400">
            去探索更多灵感
          </Link>
        </p>
      </div>
    </ProfileSubPageLayout>
  );
}
