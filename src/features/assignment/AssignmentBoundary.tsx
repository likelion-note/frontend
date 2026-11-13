import { Outlet } from 'react-router'
import { useMyAssignment } from '@/features/assignment/useMyAssignment'

/** 데이터 로딩/실패를 배정 전 화면이나 이전 배정 정보로 표시하지 않아요. */
export function AssignmentBoundary() {
  const assignment = useMyAssignment()
  if (assignment.isError) {
    return (
      <div role="alert" className="px-5 py-6 text-[13px]">
        <p>사용자 배정 정보를 불러오지 못했어요.</p>
        <button
          type="button"
          className="text-accent-deep mt-2 underline"
          onClick={() => void assignment.refetch()}
        >
          다시 시도
        </button>
      </div>
    )
  }
  if (assignment.isPending || !assignment.data) {
    return (
      <p role="status" className="text-muted px-5 py-6 text-[13px]">
        사용자 배정 정보를 불러오고 있어요.
      </p>
    )
  }
  return <Outlet />
}
