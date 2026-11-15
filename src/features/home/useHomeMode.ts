import { useSearchParams } from 'react-router'
import { useMyAssignment } from '@/features/assignment/useMyAssignment'
import { getProjectTimeline } from '@/features/admin/timeline'
import { readPreviewState, resolveHomeMode } from '@/features/home/state'

/** 홈·가이드·회의가 동일한 배정 상태를 참조해요. */
export function useHomeMode() {
  const [params] = useSearchParams()
  const assignment = useMyAssignment()
  if (assignment.isPending || assignment.isError || !assignment.data) return null
  const state = {
    isPartAssigned: assignment.data.assignmentStatus === 'ASSIGNED',
    // 운영진이 등록한 일정으로 판단해요 (프로젝트 시작일이 지났고 남은 일정이 있으면 진행 중).
    isProjectActive: getProjectTimeline().isProjectActive,
  }
  const preview = import.meta.env.DEV ? readPreviewState(params, state) : state
  // partAssigned=true로 미배정 사용자에게 임의의 파트를 부여하지 않아요.
  return resolveHomeMode({ ...preview, isPartAssigned: state.isPartAssigned })
}
