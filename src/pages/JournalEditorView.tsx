import { useRef } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  ImagePlus,
  Plus,
  Trash2,
} from 'lucide-react';
import { HandLine } from '@/components/HandcraftDecorations';
import { JournalPageCanvas } from '@/components/JournalPageCanvas';
import { JournalImageTooLargeError, prepareJournalPageImage } from '@/lib/journalImage';
import { cn } from '@/lib/utils';
import useAppStore from '@/store';
import type { PageTemplate } from '@/types';

const templateLabel: Record<PageTemplate, string> = {
  polaroid: '拍立得',
  stamp: '邮戳',
  postcard: '明信片',
  ticket: '票根',
};

const dashedBtn =
  'rounded-2xl border-2 border-dashed border-pencil bg-paper/80 px-4 py-2.5 font-serif text-sm text-ink transition hover:bg-paperDark';

export type JournalEditorViewProps = {
  /** 删除整本手账并清空 store 后回调（例如父级同步 UI 栈） */
  onAfterDeleteJournal?: () => void;
};

export default function JournalEditorView({ onAfterDeleteJournal }: JournalEditorViewProps) {
  const currentJournal = useAppStore((s) => s.currentJournal);
  const currentPageIndex = useAppStore((s) => s.currentPageIndex);
  const updateJournal = useAppStore((s) => s.updateJournal);
  const deleteJournal = useAppStore((s) => s.deleteJournal);
  const setCurrentPageIndex = useAppStore((s) => s.setCurrentPageIndex);
  const imageInputRef = useRef<HTMLInputElement>(null);

  const page = currentJournal?.pages[currentPageIndex] ?? null;
  const pageCount = currentJournal?.pages.length ?? 0;

  if (!currentJournal) return null;

  const handleDeleteJournal = () => {
    if (!window.confirm(`确定删除手账「${currentJournal.title}」？此操作不可恢复。`)) return;
    deleteJournal(currentJournal.id);
    onAfterDeleteJournal?.();
  };

  const goPrevPage = () => {
    if (currentPageIndex <= 0) return;
    setCurrentPageIndex(currentPageIndex - 1);
  };

  const goNextPage = () => {
    if (currentPageIndex >= pageCount - 1) return;
    setCurrentPageIndex(currentPageIndex + 1);
  };

  const setCurrentPageTemplate = (template: PageTemplate) => {
    if (!page) return;
    const now = new Date().toISOString();
    updateJournal(currentJournal.id, (j) => ({
      ...j,
      pages: j.pages.map((p) => (p.id === page.id ? { ...p, template } : p)),
      updatedAt: now,
    }));
  };

  const onPickPageImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file || !page) return;
    try {
      const { imageUrl, revokeObjectUrl } = await prepareJournalPageImage(file);
      revokeObjectUrl();
      const now = new Date().toISOString();
      updateJournal(currentJournal.id, (j) => ({
        ...j,
        pages: j.pages.map((p) => (p.id === page.id ? { ...p, imageUrl } : p)),
        updatedAt: now,
      }));
    } catch (err) {
      if (err instanceof JournalImageTooLargeError) {
        window.alert('图片超过 1MB，请压缩后重试');
      } else {
        window.alert('图片处理失败');
      }
    }
  };

  const addBlankPage = (template: PageTemplate = 'polaroid') => {
    const now = new Date().toISOString();
    const newPage = {
      id: crypto.randomUUID(),
      template,
      caption: '',
      date: now.slice(0, 10),
      stickers: [] as string[],
    };
    const nextIndex = currentJournal.pages.length;
    updateJournal(currentJournal.id, (j) => ({
      ...j,
      pages: [...j.pages, newPage],
      updatedAt: now,
    }));
    setCurrentPageIndex(nextIndex);
  };

  if (!page || pageCount === 0) {
    return (
      <div className="min-h-full w-full px-4 pt-0 pb-0">
        <div className="flex flex-col items-center justify-center gap-6 py-16">
          <p className="font-hand text-xl text-ink">这本手账还是空的</p>
          <button
            type="button"
            onClick={() => addBlankPage('polaroid')}
            className="rounded-full bg-mint px-10 py-3 font-serif text-sm font-medium text-ink shadow-warm transition hover:opacity-90"
          >
            <Plus className="mr-2 inline h-4 w-4 align-text-bottom" />
            添加第一页
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-full w-full px-4 pt-0 pb-0">
      <HandLine variant="wave" className="mb-6 w-full text-pencil/55" />
      <input
        ref={imageInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={onPickPageImage}
      />
      <div
        key={`${page.id}-${page.template}`}
        className="flex w-full justify-center transition-all duration-500 ease-out"
      >
        <JournalPageCanvas page={page} />
      </div>

      <div className="mt-6 flex w-full flex-col items-stretch gap-4">
        <button
          type="button"
          onClick={() => imageInputRef.current?.click()}
          className={cn(dashedBtn, 'w-full py-3')}
        >
          <ImagePlus className="mr-2 inline h-4 w-4 align-text-bottom" />
          本页配图
        </button>
        <p className="text-center font-serif text-xs text-inkLight">
          单张不超过 1MB，保存后可在浏览中查看
        </p>
        <div className="rounded-2xl border border-pencil/30 bg-card/60 p-5">
          <p className="mb-3 text-center font-serif text-xs font-medium text-ink">当前页模板</p>
          <div className="flex flex-wrap justify-center gap-2">
            {(Object.keys(templateLabel) as PageTemplate[]).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setCurrentPageTemplate(t)}
                className={cn(
                  page.template === t
                    ? 'rounded-full bg-mint px-4 py-2 font-serif text-sm font-medium text-ink shadow-warm'
                    : dashedBtn
                )}
              >
                {templateLabel[t]}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-8 flex w-full items-center justify-between gap-3">
        <button
          type="button"
          onClick={goPrevPage}
          disabled={currentPageIndex <= 0}
          className={cn(dashedBtn, 'flex-1 py-3 disabled:opacity-40')}
        >
          <ChevronLeft className="mr-1 inline h-4 w-4" />
          上一页
        </button>
        <button
          type="button"
          onClick={goNextPage}
          disabled={currentPageIndex >= pageCount - 1}
          className={cn(dashedBtn, 'flex-1 py-3 disabled:opacity-40')}
        >
          下一页
          <ChevronRight className="ml-1 inline h-4 w-4" />
        </button>
      </div>

      <div className="mt-6 flex w-full flex-wrap justify-center gap-2">
        <button
          type="button"
          onClick={() => addBlankPage('polaroid')}
          className="rounded-full bg-mint px-4 py-2 font-serif text-sm font-medium text-ink shadow-warm"
        >
          <Plus className="mr-1 inline h-3.5 w-3.5" />
          拍立得页
        </button>
        <button type="button" onClick={() => addBlankPage('stamp')} className={dashedBtn}>
          邮戳页
        </button>
        <button type="button" onClick={() => addBlankPage('postcard')} className={dashedBtn}>
          明信片页
        </button>
        <button type="button" onClick={() => addBlankPage('ticket')} className={dashedBtn}>
          票根页
        </button>
      </div>

      <div className="mt-10 w-full border-t border-pencil/30 pt-6">
        <button
          type="button"
          onClick={handleDeleteJournal}
          className="w-full rounded-2xl border-2 border-dashed border-coral/60 bg-coral/10 py-4 font-serif text-sm text-coral transition hover:bg-coral/20"
        >
          <Trash2 className="mr-2 inline h-4 w-4 align-text-bottom" />
          删除整本手账
        </button>
      </div>
    </div>
  );
}
