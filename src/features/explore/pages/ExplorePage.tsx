import { motion } from 'framer-motion';
import { useCallback, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/lib/toast';
import { useInboxUnread } from '@/hooks/useInboxUnread';
import { CategoryTabs } from '@/features/explore/components/CategoryTabs';
import { MasonryGrid } from '@/features/explore/components/MasonryGrid';
import { SearchBar } from '@/features/explore/components/SearchBar';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { WanderImage } from '@/components/media/WanderImage';
import { PageContainer } from '@/components/layout/PageContainer';
import { FEED_CATALOG } from '@/data/feedCatalog';
import { appendFeedComment, formatCommentTime, mergeFeedComments } from '@/lib/feedCommentsStore';
import { formatLikes } from '@/lib/formatLikes';
import { mergeFeedWithStorage, toggleFeedCollected, toggleFeedLike } from '@/lib/wanderStorage';
import { cn } from '@/lib/utils';
import type { FeedCategoryId, FeedItem } from '@/types/feed';

function mulberry32(seed: number) {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function shuffle<T>(arr: T[], seed: number): T[] {
  const next = [...arr];
  const random = mulberry32(seed);
  for (let i = next.length - 1; i > 0; i -= 1) {
    const j = Math.floor(random() * (i + 1));
    [next[i], next[j]] = [next[j], next[i]];
  }
  return next;
}

export default function ExplorePage() {
  const navigate = useNavigate();
  const inboxUnread = useInboxUnread();
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<FeedCategoryId>('all');
  const [feedShuffle, setFeedShuffle] = useState(0);
  const [lsBump, setLsBump] = useState(0);
  const [preview, setPreview] = useState<FeedItem | null>(null);
  const [commentDraft, setCommentDraft] = useState('');
  const [commentBump, setCommentBump] = useState(0);

  const merged = useMemo(() => {
    void lsBump;
    return mergeFeedWithStorage(FEED_CATALOG);
  }, [lsBump]);

  const previewLive = useMemo(() => {
    if (!preview) return null;
    return merged.find((item) => item.id === preview.id) ?? preview;
  }, [preview, merged]);

  const filtered = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return merged.filter((item) => {
      if (category !== 'all' && item.categoryId !== category) return false;
      if (
        normalizedQuery &&
        !item.title.toLowerCase().includes(normalizedQuery) &&
        !item.body.toLowerCase().includes(normalizedQuery) &&
        !item.author.name.toLowerCase().includes(normalizedQuery) &&
        !item.tags.some((tag) => tag.toLowerCase().includes(normalizedQuery))
      ) {
        return false;
      }
      return true;
    });
  }, [merged, category, query]);

  const displayItems = useMemo(() => shuffle(filtered, feedShuffle + filtered.length * 997), [filtered, feedShuffle]);

  const refresh = useCallback(() => {
    setFeedShuffle((value) => value + 1);
    toast.success('已换一批内容', { description: '已为你重新排列展示顺序，点赞与收藏仍保留在本地。' });
  }, []);

  const onMessage = useCallback(() => {
    navigate('/messages');
  }, [navigate]);

  const onToggleLike = useCallback((id: string) => {
    toggleFeedLike(id);
    setLsBump((value) => value + 1);
  }, []);

  const onToggleCollect = useCallback((id: string) => {
    toggleFeedCollected(id);
    setLsBump((value) => value + 1);
  }, []);

  const openItem = useCallback((item: FeedItem) => {
    setPreview(item);
    setCommentDraft('');
  }, []);

  const previewComments = useMemo(() => {
    void commentBump;
    if (!previewLive) return [];
    return mergeFeedComments(previewLive.id, {
      title: previewLive.title,
      tags: previewLive.tags,
      categoryLabel: previewLive.category,
    });
  }, [previewLive, commentBump]);

  const submitComment = useCallback(() => {
    if (!previewLive) return;
    const text = commentDraft.trim();
    if (!text) {
      toast.message('请输入评论内容');
      return;
    }
    appendFeedComment(previewLive.id, text);
    setCommentDraft('');
    setCommentBump((value) => value + 1);
    toast.success('评论已发布', { description: '内容已保存到本机，刷新后仍会保留。' });
  }, [commentDraft, previewLive]);

  return (
    <PageContainer>
      <SearchBar value={query} onChange={setQuery} onRefresh={refresh} onMessageClick={onMessage} hasUnread={inboxUnread > 0} />
      <CategoryTabs active={category} onChange={setCategory} />
      <motion.main initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-[50vh] pb-6">
        {displayItems.length === 0 ? (
          <p className="px-6 py-16 text-center text-sm text-[var(--ql-muted)]">没有匹配的内容，换个关键词或分类试试</p>
        ) : (
          <MasonryGrid items={displayItems} onToggleLike={onToggleLike} onToggleCollect={onToggleCollect} onOpenItem={openItem} />
        )}
        <p className="pb-safe pt-6 text-center text-[11px] font-medium tracking-wide text-[var(--ql-muted)]">
          共 {displayItems.length} 条 · 图片来自 Unsplash · 点赞/收藏/评论保存到本地
        </p>
      </motion.main>

      <Dialog
        open={preview !== null}
        onOpenChange={(open) => {
          if (!open) {
            setPreview(null);
            setCommentDraft('');
          }
        }}
      >
        <DialogContent className="max-h-[92vh] overflow-y-auto rounded-[1.75rem] border-[var(--ql-card-border)] bg-white p-4 font-sans text-[var(--ql-ink)] shadow-2xl shadow-rose-100/70 sm:max-w-md [&_svg]:text-current">
          {previewLive ? (
            <>
              <DialogHeader>
                <DialogTitle className="text-left text-[var(--ql-ink)]">{previewLive.title}</DialogTitle>
                <DialogDescription className="text-left text-[var(--ql-muted)]">
                  {previewLive.category} · {previewLive.author.name}
                </DialogDescription>
              </DialogHeader>
              <div className="overflow-hidden rounded-2xl border border-white/80 ql-photo-shadow">
                <WanderImage
                  src={previewLive.image}
                  alt={previewLive.title}
                  fallbackLabel={previewLive.title}
                  className="aspect-[4/5] w-full max-h-[50vh]"
                  width={400}
                  height={500}
                />
              </div>
              <div className="flex flex-wrap gap-2 text-sm font-medium text-[var(--ql-muted)]">
                <span className="text-wander-coral">♥ {formatLikes(previewLive.likes + (previewLive.isLiked ? 1 : 0))}</span>
                <span>收藏：{previewLive.isCollected ? '已收藏' : '未收藏'}</span>
                <span>评论：{previewComments.length} 条</span>
              </div>
              {previewLive.tags.length > 0 ? <p className="text-xs font-medium text-[var(--ql-muted)]">{previewLive.tags.join(' · ')}</p> : null}
              <div className="space-y-3 border-t border-[var(--ql-card-border)] pt-4">
                <p className="text-xs font-semibold tracking-wider text-wander-coral">正文</p>
                <div className="space-y-3 text-sm leading-relaxed text-[var(--ql-muted)]">
                  {previewLive.body.split(/\n\n+/).map((para, index) => (
                    <p key={index} className="whitespace-pre-wrap">
                      {para}
                    </p>
                  ))}
                </div>
              </div>
              <div className="space-y-3 border-t border-[var(--ql-card-border)] pt-4">
                <p className="text-xs font-semibold tracking-wider text-wander-coral">评论</p>
                <div className="space-y-3">
                  {previewComments.length === 0 ? (
                    <p className="text-sm text-[var(--ql-muted)]">暂无评论，来写第一条吧。</p>
                  ) : (
                    previewComments.map((comment) => (
                      <div key={comment.id} className="flex gap-3 rounded-2xl border border-[var(--ql-card-border)] bg-[var(--ql-soft)] p-3">
                        <div className="h-9 w-9 shrink-0 overflow-hidden rounded-full ring-1 ring-white/80">
                          <WanderImage src={comment.author.avatar} alt={comment.author.name} fallbackLabel={comment.author.name} className="h-full w-full" width={72} height={72} />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-baseline gap-2">
                            <span className="text-sm font-semibold text-[var(--ql-ink)]">{comment.author.name}</span>
                            <span className="text-[11px] text-[var(--ql-muted)]">{formatCommentTime(comment.createdAt)}</span>
                            {comment.source === 'user' ? <span className="rounded bg-indigo-50 px-1.5 py-0.5 text-[10px] font-medium text-indigo-600">我的</span> : null}
                          </div>
                          <p className="mt-1 text-sm leading-relaxed text-[var(--ql-muted)]">{comment.text}</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
                <div className="space-y-2 pt-1">
                  <Textarea
                    value={commentDraft}
                    onChange={(event) => setCommentDraft(event.target.value)}
                    placeholder="写一条友善的评论..."
                    rows={3}
                    className={cn(
                      'min-h-[88px] resize-none border-[var(--ql-card-border)] bg-white text-sm text-[var(--ql-ink)]',
                      'placeholder:text-[var(--ql-muted)] focus-visible:border-wander-coral/50 focus-visible:ring-wander-coral/25'
                    )}
                  />
                  <Button type="button" className="h-10 w-full rounded-full border-0 bg-gradient-to-r from-wander-coral to-sky-400 font-sans text-white shadow-lg shadow-rose-500/20" onClick={submitComment}>
                    发表评论
                  </Button>
                </div>
              </div>
            </>
          ) : null}
        </DialogContent>
      </Dialog>
    </PageContainer>
  );
}
