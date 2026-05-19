import { getSupabase } from '@/lib/supabase';
import type { Journal, JournalPage } from '@/types';

type JournalRow = {
  id: string;
  user_id: string | null;
  title: string;
  pages: JournalPage[];
  cover_image: string | null;
  created_at: string;
  updated_at: string;
};

function mapRow(row: JournalRow): Journal {
  return {
    id: row.id,
    title: row.title,
    pages: Array.isArray(row.pages) ? row.pages : [],
    coverImage: row.cover_image ?? undefined,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function requireClient() {
  const client = getSupabase();
  if (!client) {
    throw new Error('SUPABASE_NOT_CONFIGURED');
  }
  return client;
}

export async function fetchJournals(): Promise<Journal[]> {
  const supabase = requireClient();
  const { data, error } = await supabase
    .from('journals')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return (data as JournalRow[] | null)?.map(mapRow) ?? [];
}

/**
 * 插入新手账。课程演示中由本地先生成 `id` / 时间戳再同步，故入参使用完整 `Journal`（含 id）。
 * 若需由数据库生成 id，可传入 omit id 的 payload 并改 insert 不传 id。
 */
export async function createJournal(
  journal: Journal
): Promise<Journal> {
  const supabase = requireClient();
  const userId = (await supabase.auth.getUser()).data.user?.id;
  if (!userId) {
    throw new Error('SUPABASE_AUTH_REQUIRED');
  }

  const { data, error } = await supabase
    .from('journals')
    .insert({
      id: journal.id,
      user_id: userId,
      title: journal.title,
      pages: journal.pages,
      cover_image: journal.coverImage ?? null,
      created_at: journal.createdAt,
      updated_at: journal.updatedAt,
    })
    .select()
    .single();

  if (error) throw error;
  return mapRow(data as JournalRow);
}

export async function updateJournal(
  id: string,
  updates: Partial<Journal>
): Promise<void> {
  const supabase = requireClient();

  const patch: Record<string, unknown> = {
    updated_at: new Date().toISOString(),
  };
  if (updates.title !== undefined) patch.title = updates.title;
  if (updates.pages !== undefined) patch.pages = updates.pages;
  if (updates.coverImage !== undefined) patch.cover_image = updates.coverImage;

  const { error } = await supabase.from('journals').update(patch).eq('id', id);

  if (error) throw error;
}

export async function deleteJournal(id: string): Promise<void> {
  const supabase = requireClient();
  const { error } = await supabase.from('journals').delete().eq('id', id);
  if (error) throw error;
}
