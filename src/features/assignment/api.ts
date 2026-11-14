import type { AssignedPart, UserAssignment } from '@/features/assignment/types'
import { getCurrentUser } from '@/lib/currentUser'

/**
 * 로그인한 사용자의 배정 정보. 홈 · 가이드 · 회의 · 노트 · 내 기록이 같은 값을 봐요.
 * - 목 모드: 목 저장소의 멤버 배정(운영진이 멤버 화면에서 바꾸는 값)
 * - 실제 모드: 로그인 응답(/api/me)의 배정. 전용 API가 생기면 이 함수 안쪽만 바꿔요
 */
export async function getMyAssignment(): Promise<UserAssignment> {
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
