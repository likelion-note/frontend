import { getProjectTimeline } from '@/features/admin/timeline'
import { PART_LABEL } from '@/features/admin/types'
import { useMyAssignment } from '@/features/assignment/useMyAssignment'
import type { HomeUser } from '@/features/home/types'
import { useState } from 'react'
import { useLocation } from 'react-router'

import { getMockWeeklyGuide } from '@/features/guide/mock/data'
import { useGuideCompletion } from '@/features/guide/useGuideCompletion'
import { contextSearch, ideaMeetingPath, useGuideContext } from '@/features/guide/useGuideContext'
import { homeMockData } from '@/features/home/mock/data'
import { beforePartMockData, inactiveMockData } from '@/features/home/mock/states'
import { useHomeMode } from '@/features/home/useHomeMode'
import { useMyJournals } from '@/features/journal/useJournals'
import { getCurrentUser } from '@/lib/currentUser'
import { useToast } from '@/hooks/useToast'

/** API 연결 지점. 홈과 가이드의 할 일은 같은 데이터와 완료 저장소를 사용해요. */
export function useHomeData() {
  const [data, setData] = useState(() => structuredClone(homeMockData))
  const mode = useHomeMode()
  const assignment = useMyAssignment()
  const assigned = assignment.data?.assignmentStatus === 'ASSIGNED' ? assignment.data : null
  // 로그인한 사람 · 운영진이 등록한 일정 · 내 일지에서 계산해요. 운영진이 배정이나 일정을 바꾸거나
  // 일지를 돌려보내면 홈에 그대로 나타나요.
  const currentUser = getCurrentUser()
  const timeline = getProjectTimeline()
  const journals = useMyJournals().data ?? []
  const returned = journals.filter((journal) => journal.status === 'REJECTED')
  const published = journals.filter((journal) => journal.status === 'APPROVED')
  const project = {
    dateLabel: timeline.dateLabel,
    week: timeline.week ?? 1,
    daysUntilPresentation: timeline.nextMajor?.dday ?? 0,
    presentationLabel: timeline.nextMajor?.name ?? '',
    nextSession: timeline.nextSessionLabel ?? '',
  }
  const user: HomeUser = {
    initial: currentUser?.name.charAt(0) ?? data.user.initial,
    cohortLabel: assignment.data
      ? `${assignment.data.cohort}기 ${assignment.data.userType === 'ADMIN' ? '운영진' : '아기사자'}`
      : '',
    part: assigned ? PART_LABEL[assigned.part] : null,
    team: assigned ? assigned.teamName : null,
    assignmentLabel: '파트 배정 전',
  }
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
      mode: mode ?? data.mode,
      user,
      project,
      returnedJournal: {
        ...data.returnedJournal,
        count: returned.length,
        action: {
          ...data.returnedJournal.action,
          to: returned[0] ? `/me/journal/${returned[0].id}` : undefined,
        },
      },
      noteStats: {
        cohort: currentUser?.cohort ?? data.noteStats.cohort,
        readCount: published.reduce((sum, journal) => sum + journal.readCount, 0),
        helpfulCount: published.reduce((sum, journal) => sum + journal.helpfulCount, 0),
        publicCount: published.filter((journal) => journal.scope === 'NOW').length,
      },
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
    beforePartData: { ...beforePartMockData, user, project },
    inactiveData: { ...inactiveMockData, user },
    toggleTodo,
    toggleHelpful,
  }
}
