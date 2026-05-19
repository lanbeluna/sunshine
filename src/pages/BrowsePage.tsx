import { useCallback, useRef, useState } from 'react';
import {
  BookDown,
  ChevronLeft,
  ChevronRight,
  Download,
  Share2,
  Trash2,
} from 'lucide-react';
import { toPng } from 'html-to-image';
import { JournalPageCanvas } from '@/components/JournalPageCanvas';
import { cn } from '@/lib/utils';
import useAppStore from '@/store';
import type { Journal, JournalPage, PageTemplate } from '@/types';

function newId(): string {
  return crypto.randomUUID();
}

function sanitizeFilenamePart(s: string): string {
  return s.replace(/[/\\?%*:|"<>]/g, '_').replace(/\s+/g, ' ').trim().slice(0, 72) || '手账';
}

function buildExportFilename(journal: Journal, pageIndex: number, pageDate: string): string {
  const title = sanitizeFilenamePart(journal.title);
  const datePart = (pageDate || new Date().toISOString().slice(0, 10)).replace(/[/\\]/g, '-');
  return `QLapp_手账_${title}_第${pageIndex + 1}页_${datePart}.png`;
}

async function capturePageWithPrintBorder(element: HTMLElement): Promise<string> {
  const prev = {
    padding: element.style.padding,
    backgroundColor: element.style.backgroundColor,
    boxSizing: element.style.boxSizing,
    borderRadius: element.style.borderRadius,
  };
  element.style.padding = '28px';
  element.style.backgroundColor = '#ffffff';
  element.style.boxSizing = 'border-box';
  element.style.borderRadius = '4px';
  try {
    return await toPng(element, {
      pixelRatio: 2,
      cacheBust: true,
      quality: 0.95,
    });
  } finally {
    element.style.padding = prev.padding;
    element.style.backgroundColor = prev.backgroundColor;
    element.style.boxSizing = prev.boxSizing;
    element.style.borderRadius = prev.borderRadius;
  }
}

async function sharePngDataUrl(
  dataUrl: string,
  opts: { title: string; text: string }
): Promise<boolean> {
  try {
    const blob = await fetch(dataUrl).then((r) => r.blob());
    const file = new File([blob], 'handaccount.png', { type: 'image/png' });
    if (navigator.canShare?.({ files: [file] })) {
      await navigator.share({
        title: opts.title,
        text: opts.text,
        files: [file],
      });
      return true;
    }
  } catch {
    /* 用户取消或不可分享 */
  }
  return false;
}

const dashedBtn =
  'inline-flex items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-pencil bg-paper/80 px-4 py-3 font-serif text-sm text-ink transition hover:bg-paperDark';

export default function BrowsePage() {
  const currentJournal = useAppStore((s) => s.currentJournal);
  const currentPageIndex = useAppStore((s) => s.currentPageIndex);
  const updateJournal = useAppStore((s) => s.updateJournal);
  const setCurrentPageIndex = useAppStore((s) => s.setCurrentPageIndex);

  const [flipBusy, setFlipBusy] = useState(false);
  const [yDeg, setYDeg] = useState(0);
  const [transitionOn, setTransitionOn] = useState(true);
  const [origin, setOrigin] = useState<'left center' | 'right center'>('left center');

  const flipInnerRef = useRef<HTMLDivElement>(null);

  const pages = currentJournal?.pages ?? [];
  const pageCount = pages.length;
  const page = pages[currentPageIndex] ?? null;

  const runFlipNext = useCallback(() => {
    if (flipBusy || !currentJournal || currentPageIndex >= pageCount - 1) return;
    setFlipBusy(true);
    setTransitionOn(true);
    setOrigin('left center');
    setYDeg(-90);
    window.setTimeout(() => {
      const i = useAppStore.getState().currentPageIndex;
      setCurrentPageIndex(i + 1);
      setTransitionOn(false);
      setYDeg(90);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setTransitionOn(true);
          setYDeg(0);
        });
      });
      window.setTimeout(() => setFlipBusy(false), 600);
    }, 600);
  }, [flipBusy, currentJournal, currentPageIndex, pageCount, setCurrentPageIndex]);

  const runFlipPrev = useCallback(() => {
    if (flipBusy || !currentJournal || currentPageIndex <= 0) return;
    setFlipBusy(true);
    setTransitionOn(true);
    setOrigin('right center');
    setYDeg(90);
    window.setTimeout(() => {
      const i = useAppStore.getState().currentPageIndex;
      setCurrentPageIndex(i - 1);
      setTransitionOn(false);
      setYDeg(-90);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setTransitionOn(true);
          setYDeg(0);
        });
      });
      window.setTimeout(() => setFlipBusy(false), 600);
    }, 600);
  }, [flipBusy, currentJournal, currentPageIndex, setCurrentPageIndex]);

  const addBlankPage = (template: PageTemplate = 'polaroid') => {
    if (!currentJournal) return;
    const now = new Date().toISOString();
    const newPage: JournalPage = {
      id: newId(),
      template,
      caption: '',
      date: now.slice(0, 10),
      stickers: [],
    };
    const nextIndex = currentJournal.pages.length;
    updateJournal(currentJournal.id, (j) => ({
      ...j,
      pages: [...j.pages, newPage],
      updatedAt: now,
    }));
    setCurrentPageIndex(nextIndex);
  };

  const handleDeletePage = () => {
    if (!currentJournal || !page) return;
    if (!window.confirm('确定删除当前页？')) return;
    const now = new Date().toISOString();
    const nextPages = currentJournal.pages.filter((p) => p.id !== page.id);
    updateJournal(currentJournal.id, (j) => ({
      ...j,
      pages: nextPages,
      updatedAt: now,
    }));
    const nextLen = nextPages.length;
    if (nextLen === 0) {
      setCurrentPageIndex(0);
      return;
    }
    setCurrentPageIndex(Math.min(currentPageIndex, nextLen - 1));
  };

  const handleExportPage = async () => {
    const node = flipInnerRef.current;
    if (!node || !currentJournal || !page) return;
    try {
      const dataUrl = await capturePageWithPrintBorder(node);
      const link = document.createElement('a');
      link.download = buildExportFilename(currentJournal, currentPageIndex, page.date);
      link.href = dataUrl;
      link.click();
    } catch {
      window.alert('导出失败，请稍后再试');
    }
  };

  const handleExportWholeHint = () => {
    window.alert(
      '「导出整本」演示说明：\n\n' +
        '• 请使用「导出当前页」逐页保存为 PNG。\n' +
        '• 若需单张纵向长图或 PDF，可在后续版本接入排版或 jsPDF。\n' +
        '• 带 journal ID 的分享链接需要后端支持，当前未启用。'
    );
  };

  const handleShare = async () => {
    if (!currentJournal || !page) return;
    const node = flipInnerRef.current;
    const text = `来自 QLapp：${currentJournal.title}\n${page.caption || '（无标题）'}\n${page.date}`;

    try {
      if (node) {
        const dataUrl = await capturePageWithPrintBorder(node);
        const shared = await sharePngDataUrl(dataUrl, {
          title: '我的旅行手账',
          text,
        });
        if (shared) return;
      }

      if (navigator.share) {
        await navigator.share({ title: currentJournal.title, text });
        return;
      }
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
        window.alert('已复制文字到剪贴板（当前环境无法直接分享图片文件）');
        return;
      }
      window.prompt('复制以下内容：', text);
    } catch {
      /* 用户取消 */
    }
  };

  if (!currentJournal) {
    return null;
  }

  if (pageCount === 0) {
    return (
      <div className="flex min-h-full w-full flex-col px-4 pt-0 pb-0">
        <div className="flex flex-1 flex-col items-center justify-center gap-6 py-12">
          <p className="font-hand text-xl text-ink">这本手账还是空的</p>
          <button
            type="button"
            onClick={() => addBlankPage('polaroid')}
            className="rounded-full bg-mint px-10 py-3 font-serif text-sm font-medium text-ink shadow-warm transition hover:opacity-90"
          >
            添加第一页
          </button>
        </div>
      </div>
    );
  }

  if (!page) {
    return null;
  }

  return (
    <div className="relative min-h-full w-full pt-0 pb-0">
      <div className="w-full px-4">
        <div
          className={cn(
            'relative flex w-full overflow-hidden rounded-2xl shadow-warm ring-1 ring-pencil/25',
            'bg-gradient-to-r from-paperDark/35 via-pencil/10 to-transparent'
          )}
        >
          <div
            className="hidden min-h-[min(70vh,520px)] w-[12%] shrink-0 border-r border-pencil/30 bg-paperDark/25 md:block"
            aria-hidden
          />
          <div className="relative min-h-[min(70vh,520px)] flex-1 bg-paper/95 px-4 py-8 md:px-6">
            <div className="h-full w-full perspective-[1400px]" style={{ perspective: '1400px' }}>
              <div
                className="relative h-full min-h-[400px] w-full [transform-style:preserve-3d]"
                style={{ transformStyle: 'preserve-3d' }}
              >
                <div
                  ref={flipInnerRef}
                  className="flex h-full w-full items-center justify-center [backface-visibility:hidden]"
                  style={{
                    transform: `rotateY(${yDeg}deg)`,
                    transformOrigin: origin,
                    transition: transitionOn ? 'transform 0.6s ease-out' : 'none',
                  }}
                >
                  <JournalPageCanvas page={page} />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 flex w-full items-center justify-between gap-4 px-1">
          <button
            type="button"
            disabled={currentPageIndex <= 0 || flipBusy}
            onClick={runFlipPrev}
            className={cn(
              dashedBtn,
              'h-11 w-11 shrink-0 px-0 disabled:pointer-events-none disabled:opacity-40'
            )}
            aria-label="上一页"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <p className="font-script text-sm text-inkLight">
            第 {currentPageIndex + 1} 页 / 共 {pageCount} 页
          </p>
          <button
            type="button"
            disabled={currentPageIndex >= pageCount - 1 || flipBusy}
            onClick={runFlipNext}
            className={cn(
              dashedBtn,
              'h-11 w-11 shrink-0 px-0 disabled:pointer-events-none disabled:opacity-40'
            )}
            aria-label="下一页"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-10 flex w-full flex-wrap items-center justify-center gap-3 pb-0">
          <button
            type="button"
            onClick={handleExportPage}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-mint px-6 py-3 font-serif text-sm font-medium text-ink shadow-warm transition hover:opacity-90"
          >
            <Download className="h-5 w-5" />
            导出当前页
          </button>
          <button type="button" onClick={handleExportWholeHint} className={dashedBtn}>
            <BookDown className="h-5 w-5" />
            导出整本说明
          </button>
          <button type="button" onClick={handleShare} className={dashedBtn}>
            <Share2 className="h-5 w-5" />
            分享
          </button>
          <button
            type="button"
            onClick={handleDeletePage}
            className="inline-flex items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-coral/60 bg-coral/10 px-4 py-3 font-serif text-sm text-coral transition hover:bg-coral/20"
          >
            <Trash2 className="h-5 w-5" />
            删除此页
          </button>
        </div>
      </div>
    </div>
  );
}
