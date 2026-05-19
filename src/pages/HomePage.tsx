import { useMemo, useState } from 'react';
import { Tape } from '@/components/HandcraftDecorations';
import { PolaroidTemplate } from '@/components/templates';
import { StickyNote } from '@/components/StickyNote';
import { pickCover } from '@/lib/unsplashPools';
import { cn } from '@/lib/utils';
import useAppStore from '@/store';
import type { Journal } from '@/types';

function formatJournalCardDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

const tapeCornerClass = [
  'left-6 top-24',
  'right-6 top-28',
  'left-8 bottom-32',
  'right-8 bottom-28',
] as const;

export default function HomePage() {
  const journals = useAppStore((s) => s.journals);
  const setCurrentJournal = useAppStore((s) => s.setCurrentJournal);
  const [tapeCorner] = useState(() => Math.floor(Math.random() * 4));

  const emptyPolaroidDate = useMemo(
    () => new Date().toLocaleDateString('zh-CN'),
    []
  );

  const handleOpenJournal = (j: Journal) => {
    setCurrentJournal(j);
  };

  return (
    <div className="paper-texture relative min-h-full w-full pt-0 pb-0">
      <Tape color="mint" rotationDeg={-3} className={cn('z-20', tapeCornerClass[tapeCorner])}>
        Memories
      </Tape>

      <div className="relative z-10 w-full px-4">
        {journals.length === 0 ? (
          <div className="flex flex-col items-center px-2 py-6 text-center">
            <PolaroidTemplate caption="" date={emptyPolaroidDate} stickers={[]} />
            <p className="mt-8 font-hand text-xl text-ink">还没有旅行记忆</p>
            <p className="mt-2 font-serif text-sm text-inkLight">
              点击底部中间的「加号」创建新手账，或稍后再来翻阅。
            </p>
          </div>
        ) : (
          <>
            <StickyNote
              color="yellow"
              foldedCorner
              className="mb-8 w-full rounded-2xl p-5 shadow-stamp"
            >
              <p className="font-serif text-sm text-ink">
                点一本书进入浏览模式，内页底部可进行导出与分享。
              </p>
            </StickyNote>
            <ul className="grid list-none grid-cols-2 gap-4 p-0 sm:grid-cols-3 lg:grid-cols-4">
              {journals.map((j) => (
                <li key={j.id} className="perspective-[1000px]">
                  <button
                    type="button"
                    onClick={() => handleOpenJournal(j)}
                    className={cn(
                      'group w-full rounded-2xl p-5 text-left transition-[transform,box-shadow] duration-300 ease-out',
                      '[transform-style:preserve-3d]',
                      'hover:[transform:translateY(-4px)_rotateY(-5deg)] hover:shadow-warm'
                    )}
                  >
                    <div
                      className={cn(
                        'relative aspect-[3/4] w-full overflow-hidden rounded-2xl',
                        'shadow-[4px_0_12px_rgba(0,0,0,0.12)] ring-1 ring-pencil/30',
                        'transition-shadow duration-300 group-hover:shadow-warm'
                      )}
                    >
                      {j.coverImage ? (
                        <img
                          src={j.coverImage}
                          alt=""
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <img
                          src={pickCover(`journal-card-${j.id}-${j.title}`, 480, 640)}
                          alt=""
                          className="h-full w-full object-cover"
                        />
                      )}
                    </div>
                    <h3 className="mt-3 line-clamp-2 text-center font-hand text-lg text-ink">
                      {j.title}
                    </h3>
                    <p className="mt-1 text-center font-script text-sm text-inkLight">
                      {j.pages.length} 页
                    </p>
                    <p className="mt-0.5 text-center font-script text-xs text-inkLight">
                      {formatJournalCardDate(j.updatedAt)}
                    </p>
                  </button>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    </div>
  );
}
