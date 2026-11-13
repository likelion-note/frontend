import { useState } from 'react'
import { Link, Navigate, useLocation, useNavigate, useParams } from 'react-router'

import backIcon from '@/assets/meeting/history-back.svg'
import grid from '@/assets/meeting/complete-grid.svg'
import { BackHeader, ScreenContent } from '@/components/layout/Screen'
import { Button } from '@/components/ui/Button'
import { useHomeMode } from '@/features/home/useHomeMode'
import { MeetingIllustration } from '@/features/meeting/components/MeetingIllustration'
import { MeetingSummaryCard } from '@/features/meeting/components/MeetingSummaryCard'
import { countThisWeek } from '@/features/meeting/meetingDates'
import { copyMeetingRecord } from '@/features/meeting/shareRecord'
import { useMeetingRecord } from '@/features/meeting/useMeetingRecord'
import { useMeetingRecords } from '@/features/meeting/useMeetingRecords'
import { useToast } from '@/hooks/useToast'

export function MeetingSummaryCompletePage({ onJournal }: { onJournal?: () => void }) {
  const { id = '' } = useParams()
  const mode = useHomeMode()
  const location = useLocation()
  const navigate = useNavigate()
  const toast = useToast()
  const record = useMeetingRecord(id, mode === 'project-active')
  const records = useMeetingRecords(mode === 'project-active')
  const [copying, setCopying] = useState(false)
  if (mode !== 'project-active') return <Navigate to={`/home${location.search}`} replace />

  async function copy() {
    if (!record.data || copying) return
    setCopying(true)
    try {
      await copyMeetingRecord(record.data)
      toast('회의 내용이 복사되었습니다.')
    } catch (error) {
      toast(error instanceof Error ? error.message : '회의 내용을 복사하지 못했어요.')
    } finally {
      setCopying(false)
    }
  }

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="bg-paper shrink-0">
        <BackHeader
          title={record.data?.title ?? '회의 기록'}
          backTo={`/meeting/summary/${id}${location.search}`}
          backIcon={<img src={backIcon} width={24} height={24} alt="" />}
        />
      </div>
      <ScreenContent
        className="bg-paper gap-[18px] [background-size:390px_auto] [background-position:top_center] [background-repeat:repeat-y] pt-3.5 pb-[max(28px,env(safe-area-inset-bottom))]"
        style={{ backgroundImage: `url(${grid})` }}
      >
        {record.isPending ? (
          <p role="status">저장한 회의를 불러오고 있어요.</p>
        ) : record.isError ? (
          <div role="alert">
            <p>저장한 회의를 불러오지 못했어요.</p>
            <button
              type="button"
              className="text-accent-deep underline"
              onClick={() => void record.refetch()}
            >
              다시 시도
            </button>
          </div>
        ) : !record.data ? (
          <>
            <p>저장한 회의 기록을 찾을 수 없어요.</p>
            <Link to={`/meeting${location.search}`} className="text-accent-deep underline">
              회의 도우미로 돌아가기
            </Link>
          </>
        ) : (
          <>
            <p className="min-h-[39px] flex-1 text-[13px] leading-[1.5] text-[#a8957f]">
              공유하기를 누르면 아래 원문이 그대로 복사돼요. 팀 채널에 붙여 넣으세요.
            </p>
            <MeetingSummaryCard record={record.data} />
            <Button
              onClick={() => void copy()}
              disabled={copying}
              aria-busy={copying}
              className="shrink-0 leading-[22px]"
            >
              공유하기
            </Button>
            <section
              aria-label="이번 주 회의 기록"
              className="bg-note flex flex-col gap-1 rounded-[22px] px-[18px] py-4"
            >
              <div className="flex items-center gap-2">
                <MeetingIllustration name="sprout" size={28} />
                <h2 className="text-note-ink min-w-0 flex-1 text-[14px] leading-[17px] font-bold">
                  {records.data
                    ? `이번 주 회의 기록 ${countThisWeek(records.data)}개가 모였어요`
                    : '이번 주 회의 기록을 확인하고 있어요'}
                </h2>
              </div>
              <p className="text-ink-2 text-[13px] leading-[16px]">
                성장일지 쓸 때 &quot;이번 주 회의 불러오기&quot;로 바로 가져올 수 있어요.
              </p>
              {records.isError && (
                <button
                  type="button"
                  className="text-danger self-start text-[12px] underline"
                  onClick={() => void records.refetch()}
                >
                  기록 수 다시 불러오기
                </button>
              )}
            </section>
            <div aria-hidden="true" className="min-h-0 flex-1" />
            <div className="flex items-start gap-2">
              <Button
                variant="ghost"
                onClick={() => navigate({ pathname: '/home', search: location.search })}
                className="h-[46px] min-w-0 flex-1 bg-white leading-[19px]"
              >
                홈으로
              </Button>
              <Button
                onClick={onJournal ?? (() => navigate('/me/journal/new?import=week'))}
                className="min-w-0 flex-1 leading-[22px]"
              >
                성장일지 쓰기
              </Button>
            </div>
          </>
        )}
      </ScreenContent>
    </div>
  )
}
