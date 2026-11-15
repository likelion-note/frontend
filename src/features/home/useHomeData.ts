import { getProjectTimeline } from '@/features/admin/timeline'
import { PART_LABEL } from '@/features/admin/types'
import { useMyAssignment } from '@/features/assignment/useMyAssignment'
import type { ArchiveNote, HomeUser } from '@/features/home/types'
import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { useLocation } from 'react-router'

import { USE_MOCK } from '@/api/client'
import { getWeeklyGuide } from '@/features/guide/api'
import { useGuideCompletion } from '@/features/guide/useGuideCompletion'
import { contextSearch, ideaMeetingPath, useGuideContext } from '@/features/guide/useGuideContext'
import { homeMockData } from '@/features/home/mock/data'
import { beforePartMockData, inactiveMockData } from '@/features/home/mock/states'
import { useHomeMode } from '@/features/home/useHomeMode'
import { useMyJournals } from '@/features/journal/useJournals'
import { formatNoteMeta, isPastNote } from '@/features/note/noteFilters'
import type { Note } from '@/features/note/types'
import { useNotes } from '@/features/note/useNotes'
import { getCurrentUser, userStorageKey } from '@/lib/currentUser'
import { useToast } from '@/hooks/useToast'

/** 운영진 한마디에 '도움돼요'를 눌렀는지. 1인 1회라 계정마다 브라우저에 남겨요 */
const staffHelpfulKey = () => userStorageKey('likelion-staff-helpful:v1')
function readStaffHelpful() {
  try {
    return localStorage.getItem(staffHelpfulKey()) === '1'
  } catch {
    return false
  }
}
function writeStaffHelpful(on: boolean) {
  try {
    if (on) localStorage.setItem(staffHelpfulKey(), '1')
    else localStorage.removeItem(staffHelpfulKey())
  } catch {
    /* 저장이 막혀 있으면 이번 화면에서만 유지돼요 */
  }
}

/** 실제 모드의 '지난 기수는 이맘때': 지난 기수 노트를 앞에서 두 개 보여줘요. 없으면 칸을 숨겨요 */
function archiveFromNotes(notes: Note[]): ArchiveNote[] {
  return notes
    .filter(isPastNote)
    .slice(0, 2)
    .map((note) => ({
      id: note.id,
      context: note.tags[0] ?? `${note.event}`,
      title: note.title,
      author: formatNoteMeta(note),
      excerpt: note.excerpt,
      readCount: note.readCount,
      helpfulCount: note.helpfulCount,
      tag: note.tags[0] ?? '',
      to: `/notes/${note.id}`,
    }))
}

/** API 연결 지점. 홈과 가이드의 할 일은 같은 데이터와 완료 저장소를 사용해요. */
export function useHomeData() {
  const [data, setData] = useState(() => {
    const initial = structuredClone(homeMockData)
    // 실제 모드에는 운영진 한마디의 '도움돼요' 숫자가 없어서 0에서 시작해요.
    if (!USE_MOCK) initial.staffMessage.helpfulCount = 0
    if (readStaffHelpful()) {
      initial.staffMessage.isHelpful = true
      initial.staffMessage.helpfulCount += 1
    }
    return initial
  })
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
  // 가이드 화면과 같은 조회(같은 키)라서 한쪽에서 체크하면 다른 쪽에도 보여요.
  const guide = useQuery({
    queryKey: ['guide', 'weekly', part, context.currentWeek],
    queryFn: () => getWeeklyGuide(part, context.currentWeek),
    enabled: mode === 'project-active' && !!context.assignedPart,
  }).data
  const completion = useGuideCompletion(
    context.userKey,
    part,
    context.currentWeek,
    guide?.tasks ?? [],
  )
  // 실제 모드: 추천 노트 자리에는 노트 게시판의 노트를 보여줘요.
  const notes = useNotes().data
  const archiveNotes = USE_MOCK ? null : archiveFromNotes(notes ?? [])
  const search = contextSearch(location.search)
  const resourcesParams = new URLSearchParams(search)
  resourcesParams.set('resources', 'proposals')

  function toggleTodo(id: string) {
    const error = completion.toggle(id)
    if (error) toast(error)
  }
  function toggleHelpful() {
    writeStaffHelpful(!data.staffMessage.isHelpful)
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
      ...(USE_MOCK
        ? {}
        : {
            archiveNotes: archiveNotes ?? [],
            staffMessage: {
              ...data.staffMessage,
              week: project.week,
              text: guide?.operatorMessage.text ?? '',
            },
          }),
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
    beforePartData: {
      ...beforePartMockData,
      user,
      project,
      ...(archiveNotes ? { archiveNotes: archiveNotes.slice(0, 1) } : {}),
    },
    inactiveData: { ...inactiveMockData, user },
    toggleTodo,
    toggleHelpful,
  }
}
