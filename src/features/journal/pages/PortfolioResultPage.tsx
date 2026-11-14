import { Fragment, useState } from 'react'
import { Link, Navigate, useParams, useSearchParams } from 'react-router'

import grid from '@/assets/journal/grid-bg.svg'
import { BackHeader, ScreenContent } from '@/components/layout/Screen'
import { Button } from '@/components/ui/Button'
import { createPortfolioSummary } from '@/features/journal/api'
import { JournalIllustration } from '@/features/journal/components/JournalIllustration'
import { JournalList } from '@/features/journal/components/JournalList'
import { formatLabel, journalDate } from '@/features/journal/labels'
import { resultPlaceholder } from '@/features/journal/organize'
import type { PortfolioFormat } from '@/features/journal/types'
import {
  useJournalCache,
  useMyJournals,
  useMyProjects,
  usePortfolioQuota,
  usePortfolioSummary,
} from '@/features/journal/useJournals'
import { useToast } from '@/hooks/useToast'
import { formatMonthDay } from '@/lib/date'

/** '[결과 수치 입력]' 칸만 진한 붉은 글씨로 강조해요. */
function Highlighted({ text }: { text: string }) {
  const parts = text.split(resultPlaceholder)
  return parts.map((part, index) => (
    <Fragment key={index}>
      {part}
      {index < parts.length - 1 && <strong className="text-danger">{resultPlaceholder}</strong>}
    </Fragment>
  ))
}

/**
 * 요약 결과 (SCR-PORT-02). 마지막으로 만든 요약을 보여주고, 다시 만들면 하루 횟수를 하나 써요.
 * 근거가 된 일지는 날짜 순서예요.
 */
export function PortfolioResultPage() {
  const { projectId = '' } = useParams()
  const [params] = useSearchParams()
  const format: PortfolioFormat = params.get('format') === 'paragraph' ? 'paragraph' : 'resume'
  const toast = useToast()
  const cache = useJournalCache()
  const summary = usePortfolioSummary(projectId, format)
  const projects = useMyProjects()
  const journals = useMyJournals()
  const quota = usePortfolioQuota()
  const [busy, setBusy] = useState(false)
  const backTo = '/me?tab=portfolio'

  if (summary.isPending) {
    return (
      <ScreenContent>
        <p role="status" className="text-muted text-[13px]">
          요약을 불러오고 있어요.
        </p>
      </ScreenContent>
    )
  }
  // 아직 만든 적이 없으면 포트폴리오 탭에서 만들어요.
  if (!summary.data) return <Navigate to={backTo} replace />
  const data = summary.data

  const project = projects.data?.find((item) => item.id === projectId)
  const used = (journals.data ?? [])
    .filter((journal) => data.journalIds.includes(journal.id))
    .sort((left, right) => journalDate(left).localeCompare(journalDate(right)))
  const text = [summary.data.heading, ...summary.data.lines].join('\n')
  const hasPlaceholder = text.includes(resultPlaceholder)
  const left = quota.data ?? 0

  async function copy() {
    try {
      await navigator.clipboard.writeText(text)
      toast(hasPlaceholder ? '복사했어요. [결과 수치 입력] 칸을 채워서 써 주세요.' : '복사했어요.')
    } catch {
      toast('복사하지 못했어요. 브라우저의 클립보드 권한을 확인해 주세요.')
    }
  }
  async function regenerate() {
    if (busy) return
    setBusy(true)
    try {
      await createPortfolioSummary(projectId, format)
      cache.refreshPortfolio()
      toast('새로 만들었어요.')
    } catch (error) {
      toast(error instanceof Error ? error.message : '다시 만들지 못했어요.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="bg-paper shrink-0">
        <BackHeader title="요약 결과" backTo={backTo} />
      </div>
      <ScreenContent
        className="bg-paper [background-size:390px_auto] [background-position:top_center] [background-repeat:repeat-y] pt-2 pb-[max(28px,env(safe-area-inset-bottom))]"
        style={{ backgroundImage: `url(${grid})` }}
      >
        <p className="text-muted text-[12px] leading-[17px]">
          {[project?.title, formatLabel(format), `일지 ${summary.data.journalIds.length}개 사용`]
            .filter(Boolean)
            .join(' · ')}
        </p>
        <article
          aria-live="polite"
          className="bg-card relative flex flex-col gap-2.5 rounded-2xl px-[18px] py-5 drop-shadow-[0_6px_7px_rgba(115,77,38,0.08)]"
        >
          <h2 className="pr-12 text-[15px] leading-[22px] font-bold">{summary.data.heading}</h2>
          {summary.data.lines.map((line) => (
            <p key={line} className="text-[14px] leading-[20px] [overflow-wrap:anywhere]">
              <Highlighted text={line} />
            </p>
          ))}
          <JournalIllustration name="trophy" size={46} className="absolute top-2 right-3" />
        </article>
        {hasPlaceholder && (
          <p className="bg-rose-2 text-danger flex items-center gap-1.5 rounded-[22px] px-[18px] py-4 text-[13px] leading-[19px] font-medium">
            <JournalIllustration name="bell" size={22} />
            <span className="min-w-0 flex-1">
              {resultPlaceholder} 칸은 일지에 없던 성과예요. 직접 채워 주세요.
            </span>
          </p>
        )}
        <div className="flex gap-2">
          <Button variant="soft" onClick={() => void copy()} className="min-w-0 flex-1">
            복사
          </Button>
          <Button
            variant="ghost"
            onClick={() => void regenerate()}
            disabled={busy || left === 0}
            aria-busy={busy}
            className="h-[46px] min-w-0 flex-1 bg-white"
          >
            다시 만들기 ({left})
          </Button>
        </div>

        <h2 className="flex items-center gap-2 pt-2 text-[17px] leading-[25px] font-bold">
          <JournalIllustration name="clip" size={24} />
          <span className="marker-underline">근거가 된 일지</span>
        </h2>
        {used.length > 0 ? (
          <JournalList
            journals={used}
            meta={(journal) => formatMonthDay(journalDate(journal))}
            from={`/me/portfolio/${projectId}?format=${format}`}
          />
        ) : (
          <p className="text-muted text-[13px]">
            근거가 된 일지를 찾지 못했어요.{' '}
            <Link to="/me" className="text-accent-deep underline">
              내 기록 보기
            </Link>
          </p>
        )}
      </ScreenContent>
    </div>
  )
}
