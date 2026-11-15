import { USE_MOCK } from '@/api/client'
import type { AssignedPart, UserAssignment } from '@/features/assignment/types'
import { getHome } from '@/features/home/api'
import { refreshSession } from '@/features/onboarding/api'
import { getCurrentUser } from '@/lib/currentUser'

/**
 * 로그인한 사용자의 배정 정보. 홈 · 가이드 · 회의 · 노트 · 내 기록이 같은 값을 봐요.
 * - 목 모드: 목 저장소의 멤버 배정(운영진이 멤버 화면에서 바꾸는 값)
 * - 실제 모드: 내 정보(/api/me)를 새로 받아 세션에 덮어쓰고 그 배정을 써요. 아기사자는 홈(/api/home)의
 *   현재 단계도 같이 받아 둬서, 이 함수가 끝나면 주차 · D-day 를 바로 읽을 수 있어요
 */
export async function getMyAssignment(): Promise<UserAssignment> {
  if (!USE_MOCK) {
    const me = await refreshSession()
    if (me.type === 'MEMBER') await getHome()
  }

  const user = getCurrentUser()
  if (!user) throw new Error('로그인이 필요해요.')

  const base = { cohort: user.cohort, userType: user.userType }
  const assigned =
    user.userType === 'MEMBER' && user.part && user.part !== 'OPS' && user.project?.kind === 'TEAM'
  if (!assigned || !user.project) {
    return { ...base, teamId: null, teamName: null, assignmentStatus: 'PENDING', part: null }
  }
  return {
    ...base,
    teamId: Number(user.project.id.replace(/\D/g, '')) || 0,
    teamName: user.project.shortName,
    assignmentStatus: 'ASSIGNED',
    part: user.part as AssignedPart,
  }
}
