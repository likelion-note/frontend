import { Navigate, useLocation } from 'react-router'

import backIcon from '@/assets/meeting/history-back.svg'
import grid from '@/assets/meeting/history-grid.svg'
import { BackHeader, ScreenContent } from '@/components/layout/Screen'
import { useHomeMode } from '@/features/home/useHomeMode'
import { canUseMeeting } from '@/features/home/state'
import { MeetingHistoryCard } from '@/features/meeting/components/MeetingHistoryCard'
import { MeetingIllustration } from '@/features/meeting/components/MeetingIllustration'
import { useMeetingRecords } from '@/features/meeting/useMeetingRecords'

export function PreviousMeetingsPage() {
  const mode = useHomeMode()
  const location = useLocation()
  const records = useMeetingRecords(canUseMeeting(mode))
  if (!canUseMeeting(mode)) return <Navigate to={`/home${location.search}`} replace />

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="bg-paper shrink-0">
        <BackHeader
          title="지난 회의"
          backTo={`/meeting${location.search}`}
          backIcon={<img src={backIcon} width={24} height={24} alt="" />}
        />
      </div>
      <ScreenContent
        className="bg-paper [background-size:390px_auto] [background-position:top_center] [background-repeat:repeat-y] pt-2 pb-[max(28px,env(safe-area-inset-bottom))]"
        style={{ backgroundImage: `url(${grid})` }}
      >
        <div className="flex items-center gap-1.5">
          <MeetingIllustration name="clip" size={22} />
          <p className="text-ink-2 min-w-0 flex-1 text-[13px] leading-[16px]">
            나만 보는 기록이에요. 노트로 공개되지 않아요.
          </p>
        </div>
        {records.isPending ? (
          <p role="status" className="text-muted text-[13px]">
            지난 회의를 불러오고 있어요.
          </p>
        ) : records.isError ? (
          <div role="alert" className="text-[13px]">
            <p>지난 회의를 불러오지 못했어요.</p>
            <button
              type="button"
              className="text-accent-deep mt-2 underline"
              onClick={() => void records.refetch()}
            >
              다시 시도
            </button>
          </div>
        ) : records.data.length === 0 ? (
          <p className="text-muted py-6 text-center text-[13px]">아직 지난 회의 기록이 없어요.</p>
        ) : (
          records.data.map((record, index) => (
            <MeetingHistoryCard key={record.id} record={record} initiallyOpen={index === 0} />
          ))
        )}
      </ScreenContent>
    </div>
  )
}
