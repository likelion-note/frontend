import { useMyAssignment } from '@/features/assignment/useMyAssignment'
import type { DefaultPart } from '@/features/note/noteFilters'

/**
 * 게시판에 처음 들어왔을 때 골라 둘 파트. 홈 · 가이드와 같은 배정 정보를 봐요.
 * 배정 전이거나 운영진, 아직 불러오는 중이면 전체예요.
 * 노트는 AssignmentBoundary 밖이라 배정 조회가 실패해도 게시판은 그대로 열려요.
 */
export function useMyNotePart(): DefaultPart {
  const assignment = useMyAssignment()
  return assignment.data?.assignmentStatus === 'ASSIGNED' ? assignment.data.part : 'all'
}
