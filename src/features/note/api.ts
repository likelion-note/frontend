import { approvedJournalNotes } from '@/features/note/journalNotes'
import { notes } from '@/features/note/mock/data'
import type { Note } from '@/features/note/types'

/**
 * 실제 API 엔드포인트가 정해지면 각 함수의 내부만 교체해요. 검색 · 필터는 지금 화면에서 해요.
 * 목 노트에, 운영진이 이 브라우저에서 승인한 성장일지를 더해서 보여줘요.
 */
function allNotes(): Note[] {
  return [...approvedJournalNotes(), ...notes]
}

export async function getNotes(): Promise<Note[]> {
  return structuredClone(allNotes())
}
export async function getNoteById(id: string): Promise<Note | null> {
  const note = allNotes().find((item) => item.id === id)
  return note ? structuredClone(note) : null
}
