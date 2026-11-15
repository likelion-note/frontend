import { getProjectTimeline } from '@/features/admin/timeline'
import { guideProject } from '@/features/guide/mock/data'
import type { GuidePart } from '@/features/guide/types'
import { PART_LABEL } from '@/features/admin/types'
import { useMyAssignment } from '@/features/assignment/useMyAssignment'

export function normalizePart(value: string | null): GuidePart | null {
  const aliases: Record<string, GuidePart> = {
    PM: 'PM',
    DESIGN: 'DESIGN',
    디자인: 'DESIGN',
    FRONTEND: 'FRONTEND',
    프론트: 'FRONTEND',
    프론트엔드: 'FRONTEND',
    BACKEND: 'BACKEND',
    백엔드: 'BACKEND',
  }
  return value ? (aliases[value.toUpperCase()] ?? null) : null
}

/**
 * 가이드를 처음 열 때 보여줄 주차. 운영진이 등록한 프로젝트 시작일 기준 이번 주차를
 * 가이드가 있는 주차(1~3주차) 안으로 맞춰요. 4주차부터는 마지막인 3주차를 보여줘요.
 */
export function currentGuideWeek() {
  const actual = getProjectTimeline().week ?? guideProject.weeks[0]
  return Math.min(Math.max(actual, guideProject.weeks[0]), guideProject.weeks.at(-1) ?? actual)
}

/** 이번 주가 가이드가 있는 주차면 그 주차, 아니면(4주차부터) null. '(이번 주)' 표시에 써요 */
export function thisGuideWeek() {
  const actual = getProjectTimeline().week
  return actual !== null && guideProject.weeks.includes(actual) ? actual : null
}

/** 실제 배정 정보와 가이드의 탐색 탭은 분리해요. userPart는 개발 전용 미리보기예요. */
export function useGuideContext() {
  const assignment = useMyAssignment()
  const assignedPart =
    assignment.data?.assignmentStatus === 'ASSIGNED' ? assignment.data.part : null
  return {
    assignedPart,
    currentWeek: currentGuideWeek(),
    thisWeek: thisGuideWeek(),
    weeks: guideProject.weeks,
    userKey: assignment.userKey,
    partLabel: assignedPart ? PART_LABEL[assignedPart] : null,
  }
}

export function contextSearch(search: string) {
  const params = new URLSearchParams(search)
  params.delete('part')
  params.delete('week')
  params.delete('resources')
  return params.size ? `?${params}` : ''
}
export function ideaMeetingPath(search: string) {
  const params = new URLSearchParams(contextSearch(search))
  params.set('meetingType', 'idea')
  return `/meeting?${params}`
}
