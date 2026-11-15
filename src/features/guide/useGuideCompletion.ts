import { useQueryClient } from '@tanstack/react-query'
import { useSyncExternalStore } from 'react'

import { USE_MOCK } from '@/api/client'
import { putGuideCheck } from '@/features/guide/api'
import {
  completionKey,
  completionSnapshot,
  completionValues,
  subscribeCompletion,
  toggleGuideCompletion,
} from '@/features/guide/completionStore'
import type { GuidePart, GuideTask, WeeklyGuide } from '@/features/guide/types'

/**
 * 할 일 체크. 홈과 가이드가 같은 체크 상태를 봐요.
 * - 목 모드: 브라우저 저장소(completionStore)에 남겨요
 * - 실제 모드: 서버에 저장해요. 누르는 즉시 화면(가이드 조회 결과)을 먼저 바꾸고,
 *   저장에 실패하면 서버 값으로 다시 불러와요
 */
export function useGuideCompletion(
  userKey: string,
  part: GuidePart,
  week: number,
  initialTasks: GuideTask[],
) {
  const client = useQueryClient()
  const snapshot = useSyncExternalStore(subscribeCompletion, completionSnapshot, () => '')

  if (!USE_MOCK) {
    const toggle = (id: string): string | null => {
      const task = initialTasks.find((item) => item.id === id)
      if (!task) return null
      const checked = !task.isCompleted
      const queryKey = ['guide', 'weekly', part, week]
      client.setQueryData<WeeklyGuide | null>(queryKey, (old) =>
        old
          ? {
              ...old,
              tasks: old.tasks.map((item) =>
                item.id === id ? { ...item, isCompleted: checked } : item,
              ),
            }
          : old,
      )
      putGuideCheck(id, checked).catch(() => void client.invalidateQueries({ queryKey }))
      return null
    }
    return { tasks: initialTasks, toggle }
  }

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
