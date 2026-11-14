import { USE_MOCK } from '@/api/client'
import { store } from '@/features/admin/mock/store'
import type { Part, ProjectKind, UserType } from '@/features/admin/types'
import { getSession } from '@/lib/authStorage'

/**
 * 지금 로그인한 사람과 그 사람의 배정. 홈 · 가이드 · 회의 · 노트 · 내 기록 · 운영진 화면이
 * 모두 이 정보를 기준으로 해요.
 * - 목 모드: 세션의 사용자를 목 저장소의 멤버에서 찾아요. 운영진이 배정을 바꾸면 바로 반영돼요
 * - 실제 모드: 로그인 응답(/api/me)의 배정 정보를 써요
 */
export type CurrentUser = {
  id: string
  name: string
  userType: UserType
  cohort: number
  part: Part | null
  project: { id: string; title: string; shortName: string; kind: ProjectKind } | null
}

const shortNameOf = (title: string) => title.split('·').pop()?.trim() || title

export function getCurrentUser(): CurrentUser | null {
  const session = getSession()
  if (!session) return null
  const { user } = session
  const base = {
    id: String(user.id),
    name: user.name,
    userType: user.userType,
    cohort: user.cohort,
  }

  if (!USE_MOCK) {
    return {
      ...base,
      part: (user.part as Part | null | undefined) ?? null,
      project: user.project
        ? {
            id: String(user.project.id),
            title: user.project.title,
            shortName: shortNameOf(user.project.title),
            kind: user.userType === 'ADMIN' ? 'OPS' : 'TEAM',
          }
        : null,
    }
  }

  const member = store.members.find((m) => m.id === base.id)
  const project = member?.projectId ? store.projects.find((p) => p.id === member.projectId) : null
  return {
    ...base,
    name: member?.name ?? base.name,
    part: member?.part ?? (base.userType === 'ADMIN' ? 'OPS' : null),
    project: project
      ? { id: project.id, title: project.title, shortName: project.shortName, kind: project.kind }
      : null,
  }
}

export const isAdmin = () => getSession()?.user.userType === 'ADMIN'

/** 피그마 예시 데이터(일지 · 회의 기록)의 주인인 목 계정 '데옹' */
export const SEED_USER_ID = 'u-deong'

/**
 * 계정마다 따로 보관해야 하는 브라우저 저장소 키. 한 브라우저에서 계정을 바꿔 가며 써도
 * 회의 기록 · 노트 읽음 표시 · 포트폴리오 요약이 섞이지 않아요.
 * 예시 계정(데옹)은 원래 키를 그대로 써요.
 */
export function userStorageKey(base: string): string {
  const id = getSession()?.user.id
  return id === undefined || String(id) === SEED_USER_ID ? base : `${base}:${id}`
}

/** 예시 데이터를 보여줄 계정인지 (로그인 전이거나 데옹) */
export function isSeedUser(): boolean {
  const id = getSession()?.user.id
  return id === undefined || String(id) === SEED_USER_ID
}
