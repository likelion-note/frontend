import { useState } from 'react'
import { Link, Navigate, useLocation } from 'react-router'
import grid from '@/assets/meeting/grid-bg.svg'
import { BottomNav } from '@/components/common/BottomNav'
import { Button } from '@/components/ui/Button'
import { Segment } from '@/components/ui/Segment'
import { useHomeMode } from '@/features/home/useHomeMode'
import { MeetingHelpBottomSheet } from '@/features/meeting/components/MeetingHelpBottomSheet'
import { MeetingHelpSection } from '@/features/meeting/components/MeetingHelpSection'
import { MeetingIllustration } from '@/features/meeting/components/MeetingIllustration'
import { MeetingQuestions } from '@/features/meeting/components/MeetingQuestions'
import { MeetingTimePicker } from '@/features/meeting/components/MeetingTimePicker'
import { meetingDefinitions, meetingMeta } from '@/features/meeting/mock/data'
import type { SituationId } from '@/features/meeting/types'
import { useMeeting } from '@/features/meeting/useMeeting'
import { useMeetingRecords } from '@/features/meeting/useMeetingRecords'
import { useMeetingSwipe } from '@/features/meeting/useMeetingSwipe'
export function MeetingPage({ onFinish }: { onFinish?: () => void }) {
  const mode = useHomeMode()
  const location = useLocation()
  const meeting = useMeeting()
  const records = useMeetingRecords(mode === 'project-active')
  const swipe = useMeetingSwipe(meeting.moveType)
  const [helpOpen, setHelpOpen] = useState(false)
  const [situationId, setSituationId] = useState<SituationId>('consensus')
  if (mode !== 'project-active') return <Navigate to={`/home${location.search}`} replace />
  function openHelp(id: SituationId) {
    setSituationId(id)
    setHelpOpen(true)
  }
  return (
    <div className="flex h-full min-h-0 flex-col">
      <header className="border-header-line bg-paper flex h-[52px] shrink-0 items-center gap-1.5 border-b px-5">
        <h1 className="min-w-0 flex-1 text-[24px] leading-[29px] font-bold">
          <span className="marker-underline-lg">회의 도우미</span>
        </h1>
        <Link
          to={{ pathname: '/meeting/history', search: location.search }}
          className="text-muted text-[13px] leading-[16px] font-medium"
        >
          지난 회의 {records.data?.length ?? '…'} ›
        </Link>
      </header>
      <main
        aria-label="회의 도우미"
        {...swipe}
        className="no-scrollbar bg-paper flex min-h-0 flex-1 touch-pan-y flex-col gap-3.5 overflow-y-auto overscroll-contain [background-size:390px_auto] [background-position:top_center] [background-repeat:repeat-y] px-5 pt-2 pb-7 [&>*]:shrink-0"
        style={{ backgroundImage: `url(${grid})` }}
      >
        <div className="flex items-center gap-2">
          <MeetingIllustration name="headset" size={40} />
          <h2 className="min-w-0 text-[17px] leading-[20px] font-bold">
            <span className="marker-underline">{meeting.definition.title}</span>
          </h2>
          <span className="text-muted shrink-0 text-[14px] leading-[17px]">
            {meetingMeta.dateLabel}
          </span>
          <div className="ml-auto shrink-0">
            <MeetingTimePicker time={meeting.draft.time} onChange={meeting.setTime} />
          </div>
        </div>
        <Segment
          id="meeting-types"
          label="회의 유형"
          options={meetingDefinitions.map(({ id, label }) => ({ value: id, label }))}
          value={meeting.draft.type}
          onChange={meeting.selectType}
          tabClassName="leading-[16px]"
        />
        <MeetingQuestions
          definition={meeting.definition}
          completed={meeting.draft.completed[meeting.draft.type]}
          onToggle={meeting.toggleQuestion}
        />
        <MeetingHelpSection onSelect={openHelp} />
        <div aria-hidden="true" className="h-2" />
        <Button
          onClick={onFinish}
          disabled={!onFinish}
          title={onFinish ? undefined : '회의 정리 기능 준비 중'}
          className="shrink-0 leading-[22px] disabled:opacity-100"
        >
          회의 마치고 정리하기
        </Button>
      </main>
      <BottomNav />
      <MeetingHelpBottomSheet
        open={helpOpen}
        situationId={situationId}
        onClose={() => setHelpOpen(false)}
      />
    </div>
  )
}
