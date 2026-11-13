import { useQuery } from '@tanstack/react-query'

import { getNoteById, getNotes } from '@/features/note/api'

/** 게시판 목록과 상세의 'n / 전체' · 다음 장이 같은 조회 결과를 써요. */
export function useNotes() {
  return useQuery({ queryKey: ['note', 'list'], queryFn: getNotes })
}
export function useNote(id: string) {
  return useQuery({ queryKey: ['note', 'detail', id], queryFn: () => getNoteById(id) })
}
