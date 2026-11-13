/**
 * 읽음 · 도움돼요 · 저장(책갈피) 상태를 브라우저에 보관해요.
 * 서버가 생기면 이 파일 대신 api.ts에서 조회·저장하도록 바꿔요.
 * 같은 화면과 다른 탭의 변경은 useSyncExternalStore로 구독해요 (useNoteState.ts).
 */
export const noteStateStorageKey = 'likelion-note-state:v1'
const eventName = 'likelion-note-state-change'

export type NoteFlag = 'read' | 'helpful' | 'saved'
export type NoteState = Record<NoteFlag, string[]>

const emptyState: NoteState = { read: [], helpful: [], saved: [] }
let memoryFallback: string | null = null

export function noteStateSnapshot() {
  if (memoryFallback !== null) return memoryFallback
  try {
    return localStorage.getItem(noteStateStorageKey) ?? ''
  } catch {
    return ''
  }
}

const ids = (value: unknown) =>
  Array.isArray(value) ? value.filter((id): id is string => typeof id === 'string') : []

export function parseNoteState(snapshot: string): NoteState {
  try {
    const value: unknown = JSON.parse(snapshot || '{}')
    if (!value || typeof value !== 'object') return emptyState
    const record = value as Record<string, unknown>
    return { read: ids(record.read), helpful: ids(record.helpful), saved: ids(record.saved) }
  } catch {
    return emptyState
  }
}

export function subscribeNoteState(listener: () => void) {
  const onStorage = (event: StorageEvent) => {
    if (event.key === noteStateStorageKey || event.key === null) {
      memoryFallback = null
      listener()
    }
  }
  window.addEventListener(eventName, listener)
  window.addEventListener('storage', onStorage)
  return () => {
    window.removeEventListener(eventName, listener)
    window.removeEventListener('storage', onStorage)
  }
}

/** 저장에 실패하면 현재 화면에서만 유지하고 안내 문구를 돌려줘요. */
function write(state: NoteState) {
  const next = JSON.stringify(state)
  let error: string | null = null
  try {
    localStorage.setItem(noteStateStorageKey, next)
    memoryFallback = null
  } catch {
    memoryFallback = next
    error = '노트 상태를 저장하지 못했어요. 현재 화면에서만 유지돼요.'
  }
  window.dispatchEvent(new Event(eventName))
  return error
}

export function setNoteFlag(flag: NoteFlag, id: string, on: boolean) {
  const state = parseNoteState(noteStateSnapshot())
  if (state[flag].includes(id) === on) return null
  const list = on ? [...state[flag], id] : state[flag].filter((item) => item !== id)
  return write({ ...state, [flag]: list })
}
