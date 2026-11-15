import { useMemo, useSyncExternalStore } from 'react'

import {
  noteStateSnapshot,
  parseNoteState,
  setNoteFlag,
  subscribeNoteState,
  type NoteFlag,
} from '@/features/note/noteStore'

/** 목록의 읽음 표시와 상세의 도움돼요 · 저장이 같은 상태를 봐요. */
export function useNoteState() {
  const snapshot = useSyncExternalStore(subscribeNoteState, noteStateSnapshot, () => '')
  const state = useMemo(() => parseNoteState(snapshot), [snapshot])
  return {
    has: (flag: NoteFlag, id: string) => state[flag].includes(id),
    set: setNoteFlag,
  }
}
