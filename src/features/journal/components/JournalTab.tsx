import { useNavigate } from 'react-router'

import { Button } from '@/components/ui/Button'
import { JournalList } from '@/features/journal/components/JournalList'
import { JournalStats } from '@/features/journal/components/JournalStats'
import { MeetingImportBanner } from '@/features/journal/components/MeetingImportBanner'
import { journalMeta } from '@/features/journal/labels'
import { thisWeekMeetings } from '@/features/journal/meetingImport'
import { useMyJournals, useMyProjects } from '@/features/journal/useJournals'
import { useMeetingRecords } from '@/features/meeting/useMeetingRecords'

/** 내 기록 › 성장일지 (SCR-JOUR-04) */
export function JournalTab() {
  const navigate = useNavigate()
  const journals = useMyJournals()
  const projects = useMyProjects()
  const meetings = useMeetingRecords()
  const weekly = meetings.data ? thisWeekMeetings(meetings.data) : []
  const list = journals.data ?? []
  const shared = list.filter((journal) => journal.status === 'APPROVED')

  return (
    <>
      <JournalStats
        written={list.length}
        read={shared.reduce((sum, journal) => sum + journal.readCount, 0)}
        helpful={shared.reduce((sum, journal) => sum + journal.helpfulCount, 0)}
      />
      {weekly.length > 0 && (
        <MeetingImportBanner
          title={`이번 주 회의 ${weekly.length}개 불러와서 쓰기`}
          description="정한 것과 할 일이 넘긴 방법·메모 칸에 채워져요"
          to="/me/journal/new?import=week"
        />
      )}
      {journals.isPending ? (
        <p role="status" className="text-muted text-[13px]">
          내 일지를 불러오고 있어요.
        </p>
      ) : journals.isError ? (
        <div role="alert" className="text-[13px]">
          <p>내 일지를 불러오지 못했어요.</p>
          <button
            type="button"
            className="text-accent-deep mt-2 underline"
            onClick={() => void journals.refetch()}
          >
            다시 시도
          </button>
        </div>
      ) : list.length === 0 ? (
        <p className="text-muted py-6 text-center text-[13px]">
          아직 쓴 일지가 없어요. 이번 주에 막혔던 일 하나부터 적어 보세요.
        </p>
      ) : (
        <JournalList
          journals={list}
          meta={(journal) => journalMeta(journal, projects.data ?? [])}
        />
      )}
      <p className="text-muted text-[12px] leading-[17px]">
        이름은 어디에도 나오지 않아요. 운영진이 이름 없이 검토하고, 승인되면 고른 범위에 맞춰 노트
        게시판에 올라가요.
      </p>
      <Button onClick={() => navigate('/me/journal/new')} className="leading-[22px]">
        새로 쓰기
      </Button>
    </>
  )
}
