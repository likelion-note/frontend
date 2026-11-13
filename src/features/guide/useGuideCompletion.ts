import { useSyncExternalStore } from 'react'
import {
  completionKey,
  completionSnapshot,
  completionValues,
  subscribeCompletion,
  toggleGuideCompletion,
} from '@/features/guide/completionStore'
import type { GuidePart, GuideTask } from '@/features/guide/types'

export function useGuideCompletion(
  userKey: string,
  part: GuidePart,
  week: number,
  initialTasks: GuideTask[],
) {
  const snapshot = useSyncExternalStore(subscribeCompletion, completionSnapshot, () => '')
  const values = completionValues(snapshot)
  const tasks = initialTasks.map((task) => ({
    ...task,
    isCompleted: values[completionKey(userKey, part, week, task.id)] ?? task.isCompleted,
  }))
  function toggle(id: string) {
    const task = initialTasks.find((item) => item.id === id)
    return task ? toggleGuideCompletion(userKey, part, week, task) : null
  }
  return { tasks, toggle }
}
