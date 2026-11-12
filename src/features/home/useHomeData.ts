import { useState } from 'react'

import { homeMockData } from '@/features/home/mock/data'
import { beforePartMockData, inactiveMockData } from '@/features/home/mock/states'
import { useHomeMode } from '@/features/home/useHomeMode'

/** API 연결 지점. 현재 변경 사항은 이 화면을 떠날 때 초기화되는 Mock 상태예요. */
export function useHomeData() {
  const [data, setData] = useState(() => structuredClone(homeMockData))
  const mode = useHomeMode()

  function toggleTodo(id: string) {
    setData((current) => ({
      ...current,
      todos: current.todos.map((todo) =>
        todo.id === id ? { ...todo, isCompleted: !todo.isCompleted } : todo,
      ),
    }))
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
    data: { ...data, mode },
    beforePartData: beforePartMockData,
    inactiveData: inactiveMockData,
    toggleTodo,
    toggleHelpful,
  }
}
