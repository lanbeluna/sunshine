import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { getSupabase } from '@/lib/supabase';
import * as journalApi from '@/services/journal';
import type { Journal, JournalPage, PageTemplate } from '@/types';

function newPageId(): string {
  return crypto.randomUUID();
}

interface AppState {
  journals: Journal[];
  currentJournal: Journal | null;
  currentPageIndex: number;

  addJournal: (journal: Journal) => void;
  updateJournal: (id: string, updater: (journal: Journal) => Journal) => void;
  deleteJournal: (id: string) => void;
  setCurrentJournal: (journal: Journal | null) => void;
  setCurrentPageIndex: (index: number) => void;
  /** 为当前打开的手账追加一页（浏览页顶栏「+」） */
  addBlankPageToCurrent: (template?: PageTemplate) => void;

  /** 从 Supabase 拉取列表；失败或未登录则不打断，沿用本地持久化数据 */
  loadJournalsFromSupabase: () => Promise<void>;
  /** 将单本同步到云端（存在则 update，否则 create）；失败仅打日志 */
  saveJournalToSupabase: (journal: Journal) => Promise<void>;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      journals: [],
      currentJournal: null,
      currentPageIndex: 0,

      loadJournalsFromSupabase: async () => {
        try {
          const sb = getSupabase();
          if (!sb) return;
          const uid = (await sb.auth.getUser()).data.user?.id;
          if (!uid) return;

          const list = await journalApi.fetchJournals();
          set((s) => {
            const cur = s.currentJournal;
            const nextCurrent = cur ? list.find((j) => j.id === cur.id) ?? null : null;
            return {
              journals: list,
              currentJournal: nextCurrent,
            };
          });
        } catch (e) {
          console.warn('[QLapp] loadJournalsFromSupabase failed, keeping local persisted data', e);
        }
      },

      saveJournalToSupabase: async (journal: Journal) => {
        try {
          const sb = getSupabase();
          if (!sb) return;
          const uid = (await sb.auth.getUser()).data.user?.id;
          if (!uid) return;

          const { data } = await sb.from('journals').select('id').eq('id', journal.id).maybeSingle();
          if (data) {
            await journalApi.updateJournal(journal.id, {
              title: journal.title,
              pages: journal.pages,
              coverImage: journal.coverImage,
            });
          } else {
            await journalApi.createJournal(journal);
          }
        } catch (e) {
          console.warn('[QLapp] saveJournalToSupabase failed, data kept locally only', e);
        }
      },

      addJournal: (journal) => {
        set((s) => ({
          journals: [journal, ...s.journals],
        }));
        void get().saveJournalToSupabase(journal);
      },

      updateJournal: (id, updater) =>
        set((s) => {
          const journals = s.journals.map((j) => (j.id === id ? updater(j) : j));
          const nextCurrent =
            s.currentJournal?.id === id ? updater(s.currentJournal) : s.currentJournal;
          const saved = journals.find((j) => j.id === id);
          if (saved) void get().saveJournalToSupabase(saved);
          return {
            journals,
            currentJournal: nextCurrent,
          };
        }),

      deleteJournal: (id) => {
        set((s) => ({
          journals: s.journals.filter((j) => j.id !== id),
          currentJournal: s.currentJournal?.id === id ? null : s.currentJournal,
          currentPageIndex: s.currentJournal?.id === id ? 0 : s.currentPageIndex,
        }));
        void journalApi.deleteJournal(id).catch((e) => {
          console.warn('[QLapp] deleteJournal remote failed (local already removed)', e);
        });
      },

      setCurrentJournal: (journal) =>
        set({
          currentJournal: journal,
          currentPageIndex: 0,
        }),

      setCurrentPageIndex: (index) => set({ currentPageIndex: index }),

      addBlankPageToCurrent: (template = 'polaroid') => {
        const j = get().currentJournal;
        if (!j) return;
        const now = new Date().toISOString();
        const newPage: JournalPage = {
          id: newPageId(),
          template,
          caption: '',
          date: now.slice(0, 10),
          stickers: [],
        };
        const nextIndex = j.pages.length;
        get().updateJournal(j.id, (cur) => ({
          ...cur,
          pages: [...cur.pages, newPage],
          updatedAt: now,
        }));
        set({ currentPageIndex: nextIndex });
      },
    }),
    {
      name: 'qlapp-journals',
      partialize: (state) => ({
        journals: state.journals,
        currentJournal: state.currentJournal,
        currentPageIndex: state.currentPageIndex,
      }),
    }
  )
);

export default useAppStore;
