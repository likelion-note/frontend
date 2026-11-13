import type { UserAssignment } from '@/features/assignment/types'

/** 실제 API 준비 후 인증된 사용자 조회 + 응답 변환을 이 함수에 연결해요. */
async function getMyAssignmentFromBackend(): Promise<UserAssignment> {
  throw new Error('사용자 배정 정보 API가 아직 연결되지 않았어요.')
}

export async function getMyAssignment(): Promise<UserAssignment> {
  // Mock은 개발 서버에서 명시적으로 선택했을 때만 사용해요. 오류 시 대체하지 않아요.
  if (import.meta.env.DEV && import.meta.env.VITE_ASSIGNMENT_SOURCE === 'mock') {
    const { getMockMyAssignment } = await import('./mock/data')
    return getMockMyAssignment()
  }
  return getMyAssignmentFromBackend()
}
