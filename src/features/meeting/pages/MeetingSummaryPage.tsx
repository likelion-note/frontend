import { useQuery } from '@tanstack/react-query'
import { Link, Navigate, useLocation, useNavigate, useParams } from 'react-router'

import backIcon from '@/assets/meeting/history-back.svg'
import grid from '@/assets/meeting/summary-grid.svg'
import { BackHeader, ScreenContent } from '@/components/layout/Screen'
import { useHomeMode } from '@/features/home/useHomeMode'
import { canUseMeeting } from '@/features/home/state'
import { getMeetingSummaryDraft } from '@/features/meeting/api'
import { MeetingSummaryForm } from '@/features/meeting/components/MeetingSummaryForm'

export function MeetingSummaryPage() {
  const { id = '' } = useParams()
  const mode = useHomeMode()
  const location = useLocation()
  const navigate = useNavigate()
  const draft = useQuery({
    queryKey: ['meeting', 'summary-draft', id],
    queryFn: () => getMeetingSummaryDraft(id),
    enabled: canUseMeeting(mode),
  })
  if (!canUseMeeting(mode)) return <Navigate to={`/home${location.search}`} replace />
  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="bg-paper shrink-0">
        <BackHeader
          title="회의 정리"
          backTo={`/meeting${location.search}`}
          backIcon={<img src={backIcon} width={24} height={24} alt="" />}
        />
      </div>
      {draft.isPending ? (
        <ScreenContent>
          <p role="status">회의 정리를 불러오고 있어요.</p>
        </ScreenContent>
      ) : draft.isError ? (
        <ScreenContent>
          <p role="alert">회의 정리를 불러오지 못했어요.</p>
          <button type="button" onClick={() => void draft.refetch()}>
            다시 시도
          </button>
        </ScreenContent>
      ) : !draft.data ? (
        <ScreenContent>
          <p>작성 중인 회의 정리를 찾을 수 없어요.</p>
          <Link to={`/meeting${location.search}`} className="text-accent-deep underline">
            회의 도우미로 돌아가기
          </Link>
        </ScreenContent>
      ) : (
        <MeetingSummaryForm
          key={id}
          initialDraft={draft.data}
          background={grid}
          onSaved={(record) => navigate(`/meeting/summary/${record.id}/complete${location.search}`)}
        />
      )}
    </div>
  )
}
