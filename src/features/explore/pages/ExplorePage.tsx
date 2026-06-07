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
import {
  mergeFeedWithStorage,
  toggleFeedCollected,
  toggleFeedLike,
} from '@/lib/wanderStorage';
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
  const a = [...arr];
  const rnd = mulberry32(seed);
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rnd() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
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
    return merged.find((x) => x.id === preview.id) ?? preview;
  }, [preview, merged]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return merged.filter((it) => {
      if (category !== 'all' && it.categoryId !== category) return false;
      if (
        q &&
        !it.title.toLowerCase().includes(q) &&
        !it.body.toLowerCase().includes(q) &&
        !it.author.name.toLowerCase().includes(q) &&
        !it.tags.some((t) => t.toLowerCase().includes(q))
      ) {
        return false;
      }
      return true;
    });
  }, [merged, category, query]);

  const displayItems = useMemo(() => shuffle(filtered, feedShuffle + filtered.length * 997), [filtered, feedShuffle]);

  const refresh = useCallback(() => {
    setFeedShuffle((v) => v + 1);
    toast.success('已换一批内容', { description: '已为你打乱展示顺序，点赞与收藏仍保留在本地。' });
  }, []);

  const onMessage = useCallback(() => {
    navigate('/messages');
  }, [navigate]);

  const onToggleLike = useCallback((id: string) => {
    toggleFeedLike(id);
    setLsBump((b) => b + 1);
  }, []);

  const onToggleCollect = useCallback((id: string) => {
    toggleFeedCollected(id);
    setLsBump((b) => b + 1);
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
    const t = commentDraft.trim();
    if (!t) {
      toast.message('请输入评论内容');
      return;
    }
    appendFeedComment(previewLive.id, t);
    setCommentDraft('');
    setCommentBump((b) => b + 1);
    toast.success('评论已发布', { description: '内容已保存到本机，刷新后仍保留。' });
  }, [commentDraft, previewLive]);

  return (
    <PageContainer>
      <SearchBar
        value={query}
        onChange={setQuery}
        onRefresh={refresh}
        onMessageClick={onMessage}
        hasUnread={inboxUnread > 0}
      />
      <CategoryTabs active={category} onChange={setCategory} />
      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-[50vh] pb-6"
      >
        {displayItems.length === 0 ? (
          <p className="px-6 py-16 text-center text-sm text-wander-secondary">没有匹配的内容，换个关键词或分类试试</p>
        ) : (
          <MasonryGrid
            items={displayItems}
            onToggleLike={onToggleLike}
            onToggleCollect={onToggleCollect}
            onOpenItem={openItem}
          />
        )}
        <p className="pb-safe pt-6 text-center text-[11px] font-medium tracking-wide text-white/35">
          共 {displayItems.length} 条 · 图片由 Unsplash 提供 · 点赞/收藏/评论存本地
        </p>
      </motion.main>

      <Dialog
        open={preview !== null}
        onOpenChange={(o) => {
          if (!o) {
            setPreview(null);
            setCommentDraft('');
          }
        }}
      >
        <DialogContent className="max-h-[92vh] overflow-y-auto rounded-[1.75rem] border-white/10 bg-[#121216] p-4 font-sans text-white shadow-2xl shadow-black/50 sm:max-w-md [&_svg]:text-white">
          {previewLive ? (
            <>
              <DialogHeader>
                <DialogTitle className="text-left text-white">{previewLive.title}</DialogTitle>
                <DialogDescription className="text-left text-wander-secondary">
                  {previewLive.category} · {previewLive.author.name}
                </DialogDescription>
              </DialogHeader>
              <div className="overflow-hidden rounded-2xl border border-white/10 ql-photo-shadow">
                <WanderImage
                  src={previewLive.image}
                  alt={previewLive.title}
                  fallbackLabel={previewLive.title}
                  className="aspect-[4/5] w-full max-h-[50vh]"
                  width={400}
                  height={500}
                />
              </div>
              <div className="flex flex-wrap gap-2 text-sm font-medium text-white/70">
                <span className="text-wander-coral">❤️ {formatLikes(previewLive.likes + (previewLive.isLiked ? 1 : 0))}</span>
                <span>🔖 {previewLive.isCollected ? '已收藏' : '未收藏'}</span>
                <span>💬 {previewComments.length} 条评论</span>
              </div>
              {previewLive.tags.length > 0 ? (
                <p className="text-xs font-medium text-white/40">{previewLive.tags.join(' · ')}</p>
              ) : null}
              <div className="space-y-3 border-t border-white/10 pt-4">
                <p className="text-xs font-semibold tracking-wider text-wander-coral">正文</p>
                <div className="space-y-3 text-sm leading-relaxed text-white/75">
                  {previewLive.body.split(/\n\n+/).map((para, i) => (
                    <p key={i} className="whitespace-pre-wrap">
                      {para}
                    </p>
                  ))}
                </div>
              </div>
              <div className="space-y-3 border-t border-white/10 pt-4">
                <p className="text-xs font-semibold tracking-wider text-wander-coral">评论</p>
                <div className="space-y-3">
                  {previewComments.length === 0 ? (
                    <p className="text-sm text-wander-muted">暂无评论，来抢沙发吧。</p>
                  ) : (
                    previewComments.map((c) => (
                      <div key={c.id} className="flex gap-3 rounded-2xl border border-white/10 bg-white/[0.04] p-3">
                        <div className="h-9 w-9 shrink-0 overflow-hidden rounded-full ring-1 ring-white/10">
                          <WanderImage
                            src={c.author.avatar}
                            alt={c.author.name}
                            fallbackLabel={c.author.name}
                            className="h-full w-full"
                            width={72}
                            height={72}
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-baseline gap-2">
                            <span className="text-sm font-semibold text-white">{c.author.name}</span>
                            <span className="text-[11px] text-wander-muted">{formatCommentTime(c.createdAt)}</span>
                            {c.source === 'user' ? (
                              <span className="rounded bg-indigo-500/25 px-1.5 py-0.5 text-[10px] font-medium text-indigo-200">
                                我的
                              </span>
                            ) : null}
                          </div>
                          <p className="mt-1 text-sm leading-relaxed text-white/70">{c.text}</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
                <div className="space-y-2 pt-1">
                  <Textarea
                    value={commentDraft}
                    onChange={(e) => setCommentDraft(e.target.value)}
                    placeholder="写一条友善的评论…"
                    rows={3}
                    className={cn(
                      'min-h-[88px] resize-none border-white/15 bg-black/35 text-sm text-white',
                      'placeholder:text-wander-muted focus-visible:border-wander-coral/50 focus-visible:ring-wander-coral/25'
                    )}
                  />
                  <Button
                    type="button"
                    className="h-10 w-full rounded-full border-0 bg-gradient-to-r from-wander-coral to-orange-400 font-sans text-white shadow-lg shadow-rose-500/20 hover:from-rose-400 hover:to-orange-300"
                    onClick={submitComment}
                  >
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
