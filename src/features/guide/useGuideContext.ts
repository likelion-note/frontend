import { useSearchParams } from 'react-router'
import { guideParts, guideProject } from '@/features/guide/mock/data'
import type { GuidePart } from '@/features/guide/types'
import { homeMockData } from '@/features/home/mock/data'
import { getSession } from '@/features/onboarding/session'

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

/** 실제 배정 정보와 가이드의 탐색 탭은 분리해요. userPart는 개발 전용 미리보기예요. */
export function useGuideContext() {
  const [params] = useSearchParams()
  const previewPart = import.meta.env.DEV ? normalizePart(params.get('userPart')) : null
  const assignedPart =
    previewPart ?? normalizePart(homeMockData.user.part) ?? (import.meta.env.DEV ? 'PM' : null)
  const sessionUser = getSession()?.user
  const userKey = sessionUser?.email ?? (sessionUser ? String(sessionUser.id) : 'mock-member')
  return {
    assignedPart,
    currentWeek: guideProject.currentWeek,
    weeks: guideProject.weeks,
    userKey,
    partLabel: guideParts.find((part) => part.id === assignedPart)?.label ?? homeMockData.user.part,
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
