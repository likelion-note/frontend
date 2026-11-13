import { useState } from 'react'
import { useLocation } from 'react-router'

import { getMockWeeklyGuide } from '@/features/guide/mock/data'
import { useGuideCompletion } from '@/features/guide/useGuideCompletion'
import { contextSearch, ideaMeetingPath, useGuideContext } from '@/features/guide/useGuideContext'
import { homeMockData } from '@/features/home/mock/data'
import { beforePartMockData, inactiveMockData } from '@/features/home/mock/states'
import { useHomeMode } from '@/features/home/useHomeMode'
import { useToast } from '@/hooks/useToast'

/** API 연결 지점. 홈과 가이드의 할 일은 같은 데이터와 완료 저장소를 사용해요. */
export function useHomeData() {
  const [data, setData] = useState(() => structuredClone(homeMockData))
  const mode = useHomeMode()
  const context = useGuideContext()
  const location = useLocation()
  const toast = useToast()
  const part = context.assignedPart ?? 'PM'
  const guide = getMockWeeklyGuide(part, context.currentWeek)
  const completion = useGuideCompletion(
    context.userKey,
    part,
    context.currentWeek,
    guide?.tasks ?? [],
  )
  const search = contextSearch(location.search)
  const resourcesParams = new URLSearchParams(search)
  resourcesParams.set('resources', 'proposals')

  function toggleTodo(id: string) {
    const error = completion.toggle(id)
    if (error) toast(error)
  }
  function toggleHelpful() {
    setData((current) => ({
      ...current,
      staffMessage: {
        ...current.staffMessage,
        isHelpful: !current.staffMessage.isHelpful,
        helpfulCount: current.staffMessage.helpfulCount + (current.staffMessage.isHelpful ? -1 : 1),
      },
    }))
  }
  return {
    mode,
    data: {
      ...data,
      mode,
      user: { ...data.user, part: context.partLabel },
      todosAction: { ...data.todosAction, to: `/guide${search}` },
      todos: completion.tasks.map((task) => ({
        ...task,
        action: task.action
          ? {
              ...task.action,
              to:
                task.action.kind === 'meeting'
                  ? ideaMeetingPath(search)
                  : `/guide?${resourcesParams}`,
            }
          : undefined,
      })),
    },
    beforePartData: beforePartMockData,
    inactiveData: inactiveMockData,
    toggleTodo,
    toggleHelpful,
  }
}
