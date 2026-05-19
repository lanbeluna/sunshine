import { useCallback, useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import useAppStore from '@/store';
import type { Journal, JournalPage } from '@/types';

function newId(): string {
  return crypto.randomUUID();
}

function buildJournal(title: string): Journal {
  const now = new Date().toISOString();
  const firstPage: JournalPage = {
    id: newId(),
    template: 'polaroid',
    caption: '在这里记下第一段心情与风景吧 ✎',
    date: now.slice(0, 10),
    stickers: [],
  };
  return {
    id: newId(),
    title: title.trim() || '未命名手账',
    pages: [firstPage],
    createdAt: now,
    updatedAt: now,
  };
}

export type EditorPageProps = {
  onRegisterSave: (save: () => void) => void;
  /** 保存成功后的回调（由 App 切换 Tab 等） */
  onSaved: () => void;
  /** 取消 / 放弃（可选，由 App 处理关闭） */
  onCancel?: () => void;
};

export default function EditorPage({ onRegisterSave, onSaved, onCancel }: EditorPageProps) {
  const addJournal = useAppStore((s) => s.addJournal);
  const setCurrentJournal = useAppStore((s) => s.setCurrentJournal);
  const [title, setTitle] = useState('');

  const commitSave = useCallback(() => {
    const j = buildJournal(title);
    addJournal(j);
    setCurrentJournal(null);
    setTitle('');
    onSaved();
  }, [title, addJournal, setCurrentJournal, onSaved]);

  useEffect(() => {
    onRegisterSave(commitSave);
  }, [commitSave, onRegisterSave]);

  return (
    <div className="paper-texture min-h-full w-full px-4 pt-0 pb-0">
      <div className="w-full rounded-2xl border border-pencil/40 bg-card/90 p-5 shadow-warm">
        <p className="mb-2 font-serif text-sm text-inkLight">手账标题</p>
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="给新手账起个名字…"
          className="rounded-2xl border-2 border-dashed border-pencil bg-paper font-hand text-lg"
        />
        <p className="mt-4 font-serif text-xs text-inkLight">
          保存后将加入书架，并自动生成第一页。你也可以稍后在编辑里调整模板与配图。
        </p>
        <div className="mt-6 flex w-full flex-col gap-3 sm:flex-row">
          <button
            type="button"
            className="flex-1 rounded-full bg-mint py-3 font-serif text-sm font-medium text-ink shadow-warm transition hover:opacity-90"
            onClick={commitSave}
          >
            保存到手账本
          </button>
          {onCancel ? (
            <button
              type="button"
              className="flex-1 rounded-2xl border-2 border-dashed border-pencil bg-transparent py-3 font-serif text-sm text-ink transition hover:bg-paperDark"
              onClick={() => onCancel()}
            >
              取消
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
}
