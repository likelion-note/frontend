import type { UserAssignment } from '@/features/assignment/types'

/** 개발용 예시이며 실제 로그인 사용자의 배정 정보가 아니에요. */
export const mockUserAssignment: UserAssignment = {
  cohort: 14,
  userType: 'MEMBER',
  part: 'PM',
  teamId: 1,
  teamName: '멋사수첩팀',
  assignmentStatus: 'ASSIGNED',
}

export async function getMockMyAssignment(): Promise<UserAssignment> {
  return structuredClone(mockUserAssignment)
}
