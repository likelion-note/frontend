import { guideProject } from '@/features/guide/mock/data'
import type { GuidePart, GuideTask } from '@/features/guide/types'

const storageKey = 'likelion-guide-completion:v1'
const eventName = 'likelion-guide-completion-change'
let memoryFallback: string | null = null
export function completionSnapshot() {
  if (memoryFallback !== null) return memoryFallback
  try {
    return localStorage.getItem(storageKey) ?? ''
  } catch {
    return ''
  }
}
export function completionValues(snapshot: string): Record<string, boolean> {
  try {
    const value: unknown = JSON.parse(snapshot || '{}')
    return value && typeof value === 'object'
      ? Object.fromEntries(
          Object.entries(value).filter(([, completed]) => typeof completed === 'boolean'),
        )
      : {}
  } catch {
    return {}
  }
}
export function completionKey(userKey: string, part: GuidePart, week: number, id: string) {
  return `${userKey}:${guideProject.id}:${part}:${week}:${id}`
}
export function subscribeCompletion(listener: () => void) {
  const onStorage = (event: StorageEvent) => {
    if (event.key === storageKey || event.key === null) {
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
export function toggleGuideCompletion(
  userKey: string,
  part: GuidePart,
  week: number,
  task: GuideTask,
) {
  const values = completionValues(completionSnapshot())
  const key = completionKey(userKey, part, week, task.id)
  const next = JSON.stringify({ ...values, [key]: !(values[key] ?? task.isCompleted) })
  let error: string | null = null
  try {
    localStorage.setItem(storageKey, next)
    memoryFallback = null
  } catch {
    memoryFallback = next
    error = '체크 상태를 저장하지 못했어요. 현재 화면에서만 유지돼요.'
  }
  window.dispatchEvent(new Event(eventName))
  return error
}
