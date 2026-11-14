import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'

import { Card, Divider } from '@/components/ui/Card'
import { Illust } from '@/components/ui/Illust'
import { Pill } from '@/components/ui/Pill'
import { SectionTitle } from '@/components/ui/SectionTitle'
import type { PendingSort } from '@/features/admin/api'
import { AdminLogoHeader } from '@/features/admin/components/AdminHeader'
import { AdminContent } from '@/features/admin/components/AdminLayout'
import { JournalCard } from '@/features/admin/components/JournalCard'
import { scopeLabel, STATUS_LABEL, STATUS_TONE } from '@/features/admin/labels'
import {
  meQuery,
  pendingJournalsQuery,
  recentDecisionsQuery,
  summaryQuery,
} from '@/features/admin/queries'
import type { ReviewJournal } from '@/features/admin/types'
import { formatDday, formatMonthDay } from '@/lib/date'

const SORT_LABEL: Record<PendingSort, string> = { oldest: '오래된 순', newest: '최신 순' }

/** SCR-ADM-01 검토 홈 (운영진 첫 탭) */
export function ReviewHomePage() {
  const [sort, setSort] = useState<PendingSort>('oldest')
  const { data: me } = useQuery(meQuery())
  const { data: summary } = useQuery(summaryQuery())
  const { data: pending } = useQuery(pendingJournalsQuery(sort))
  const { data: recent } = useQuery(recentDecisionsQuery())

  const cohort = me?.cohort ?? 14
  const pendingCount = summary?.pendingCount ?? pending?.length
  const headline =
    pendingCount === undefined
      ? '검토할 일지를 불러오고 있어요'
      : pendingCount > 0
        ? `검토할 일지가 ${pendingCount}개 있어요`
        : '검토할 일지가 없어요'

  return (
    <>
      <AdminContent className="pt-1">
        <AdminLogoHeader />
        {/* 인사말 */}
        <div className="flex w-full items-center gap-2 pt-1">
          <div className="flex min-w-0 flex-1 flex-col gap-0.5">
            <p className="text-ink-2 text-[15px] leading-tight font-medium">
              {me ? `${me.name} 운영진님,` : ' '}
            </p>
            <h1 className="text-ink text-[22px] leading-tight font-bold">{headline}</h1>
          </div>
          <Illust name="lion-check" size={64} />
        </div>

        {/* 요약 카드 3개 */}
        <div className="flex w-full items-start gap-2">
          <StatCard label="검토 대기" value={String(summary?.pendingCount ?? '-')} accent />
          <StatCard label="미배정 멤버" value={String(summary?.unassignedCount ?? '-')} />
          <StatCard
            label={summary?.nextEvent?.name ?? '다음 행사'}
            value={summary?.nextEvent ? formatDday(summary.nextEvent.dday) : '-'}
            illust="calendar"
          />
        </div>

        {/* 검토할 성장일지 */}
        <SectionTitle
          title="검토할 성장일지"
          illust="mag"
          action={
            <button
              type="button"
              onClick={() => setSort(sort === 'oldest' ? 'newest' : 'oldest')}
              className="text-muted relative text-[13px] leading-none font-medium before:absolute before:-inset-2.5"
            >
              {SORT_LABEL[sort]} ▾
            </button>
          }
        />
        <p className="text-muted text-[12px] leading-normal">
          작성자 이름은 보이지 않아요. 승인하면 작성자가 고른 범위에 맞춰 노트 게시판에 올라가요.
        </p>
        {pending?.length === 0 && (
          <Card className="text-muted text-center text-[13px]">지금은 검토할 일지가 없어요.</Card>
        )}
        {pending?.map((journal) => (
          <JournalCard key={journal.id} journal={journal} cohort={cohort} />
        ))}

        {/* 최근 처리 */}
        <SectionTitle
          title="최근 처리"
          illust="clock"
          action={
            <span className="text-muted text-[13px] leading-none font-medium">전체 보기</span>
          }
        />
        <Card className="py-1">
          {recent?.length === 0 && (
            <p className="text-muted py-3 text-[13px]">아직 처리한 일지가 없어요.</p>
          )}
          {recent?.map((journal, index) => (
            <div key={journal.id}>
              {index > 0 && <Divider />}
              <RecentRow journal={journal} cohort={cohort} />
            </div>
          ))}
        </Card>
      </AdminContent>
    </>
  )
}

function StatCard({
  label,
  value,
  accent = false,
  illust,
}: {
  label: string
  value: string
  accent?: boolean
  illust?: 'calendar'
}) {
  return (
    <div className="bg-card shadow-card relative flex min-w-0 flex-1 flex-col gap-0.5 rounded-2xl px-3.5 py-3">
      <p className="text-muted truncate text-[12px] leading-tight font-medium">{label}</p>
      <p
        className={`text-[24px] leading-tight font-bold whitespace-nowrap ${accent ? 'text-accent' : 'text-ink'}`}
      >
        {value}
      </p>
      {illust && <Illust name={illust} size={28} className="absolute top-2 right-2" />}
    </div>
  )
}

function RecentRow({ journal, cohort }: { journal: ReviewJournal; cohort: number }) {
  if (journal.status === 'PENDING') return null
  const sub =
    journal.status === 'APPROVED'
      ? `${scopeLabel(journal.scope, cohort)} · ${formatMonthDay(journal.decidedAt ?? journal.submittedAt)}`
      : `"${journal.rejectReason ?? ''}"`
  return (
    <div className="flex w-full items-center gap-2.5 py-3">
      <Pill tone={STATUS_TONE[journal.status]}>{STATUS_LABEL[journal.status]}</Pill>
      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <p className="text-ink truncate text-[14px] leading-tight font-bold">{journal.title}</p>
        <p className="text-muted truncate text-[12px] leading-tight">{sub}</p>
      </div>
    </div>
  )
}
