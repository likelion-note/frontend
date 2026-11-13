import { notes } from '@/features/note/mock/data'
import type { Note } from '@/features/note/types'

/** 실제 API 엔드포인트가 정해지면 각 함수의 내부만 교체해요. 검색 · 필터는 지금 화면에서 해요. */
export async function getNotes(): Promise<Note[]> {
  return structuredClone(notes)
}
export async function getNoteById(id: string): Promise<Note | null> {
  const note = notes.find((item) => item.id === id)
  return note ? structuredClone(note) : null
}
