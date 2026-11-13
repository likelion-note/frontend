import { useState } from 'react'
import { useNavigate } from 'react-router'

import { Button } from '@/components/ui/Button'
import { Segment } from '@/components/ui/Segment'
import { createPortfolioSummary } from '@/features/journal/api'
import { JournalIllustration } from '@/features/journal/components/JournalIllustration'
import { portfolioFormats } from '@/features/journal/labels'
import type { MyJournal, MyProject, PortfolioFormat } from '@/features/journal/types'
import {
  useJournalCache,
  useMyJournals,
  useMyProjects,
  usePortfolioQuota,
} from '@/features/journal/useJournals'
import { useToast } from '@/hooks/useToast'
import { cn } from '@/lib/cn'

/** 요약은 작성 중이 아닌 일지가 2개 이상일 때 만들 수 있어요. */
const minJournals = 2

/** '일지 4개 · 공개 2 · 검토 중 1 · 돌려받음 1' (0개인 상태는 빼요) */
function projectStats(journals: MyJournal[]) {
  const count = (status: MyJournal['status']) =>
    journals.filter((journal) => journal.status === status).length
  return [
    `일지 ${journals.length}개`,
    count('APPROVED') && `공개 ${count('APPROVED')}`,
    count('PENDING') && `검토 중 ${count('PENDING')}`,
    count('REJECTED') && `돌려받음 ${count('REJECTED')}`,
  ]
    .filter(Boolean)
    .join(' · ')
}

/** 내 기록 › 포트폴리오 (SCR-PORT-01) */
export function PortfolioTab() {
  const navigate = useNavigate()
  const toast = useToast()
  const cache = useJournalCache()
  const projects = useMyProjects()
  const journals = useMyJournals()
  const quota = usePortfolioQuota()
  const [picked, setPicked] = useState<string | null>(null)
  const [format, setFormat] = useState<PortfolioFormat>('resume')
  const [creating, setCreating] = useState(false)

  const rows = (projects.data ?? []).map((project) => {
    const own = (journals.data ?? []).filter(
      (journal) => journal.projectId === project.id && journal.status !== 'DRAFT',
    )
    return { project, journals: own, ready: own.length >= minJournals }
  })
  const selected =
    rows.find((row) => row.project.id === picked && row.ready) ?? rows.find((row) => row.ready)
  const left = quota.data ?? 0

  async function create() {
    if (!selected || creating) return
    setCreating(true)
    try {
      await createPortfolioSummary(selected.project.id, format)
      cache.refreshPortfolio()
      navigate(`/me/portfolio/${selected.project.id}?format=${format}`)
    } catch (error) {
      toast(error instanceof Error ? error.message : '요약을 만들지 못했어요.')
      setCreating(false)
    }
  }

  return (
    <>
      <p className="text-ink-2 text-[13px] leading-[19px]">
        운영진이 분류한 프로젝트를 고르면, 그 프로젝트의 내 일지 전부로 AI가 이력서 문장을 만들어요.
        검토 중이거나 돌려받은 일지도 들어가요.
      </p>
      <h2 className="flex items-center gap-2 pt-2 text-[17px] leading-[25px] font-bold">
        <JournalIllustration name="folder" size={24} />
        <span className="marker-underline">프로젝트 고르기</span>
      </h2>
      <div role="radiogroup" aria-label="프로젝트" className="flex flex-col gap-3.5">
        {rows.map((row) => (
          <ProjectOption
            key={row.project.id}
            project={row.project}
            count={row.journals.length}
            description={
              row.ready ? projectStats(row.journals) : '기록이 2개 이상 쌓이면 요약할 수 있어요'
            }
            ready={row.ready}
            checked={row.project.id === selected?.project.id}
            onSelect={() => setPicked(row.project.id)}
          />
        ))}
      </div>
      <h2 className="flex items-center gap-1.5 pt-1 text-[14px] leading-[20px] font-bold">
        <JournalIllustration name="docs" size={22} />
        요약 형식
      </h2>
      <Segment label="요약 형식" options={portfolioFormats} value={format} onChange={setFormat} />
      <div aria-hidden="true" className="min-h-0 flex-1" />
      <Button
        onClick={() => void create()}
        disabled={!selected || left === 0 || creating}
        aria-busy={creating}
        className="leading-[22px]"
      >
        요약 만들기
      </Button>
      <p className="text-muted text-center text-[12px] leading-[17px]">
        {quota.isPending
          ? '남은 횟수를 확인하고 있어요'
          : left > 0
            ? `오늘 ${left}번 더 만들 수 있어요`
            : '오늘은 다 만들었어요. 내일 다시 만들 수 있어요'}
      </p>
    </>
  )
}

function ProjectOption({
  project,
  count,
  description,
  ready,
  checked,
  onSelect,
}: {
  project: MyProject
  count: number
  description: string
  ready: boolean
  checked: boolean
  onSelect: () => void
}) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={checked}
      aria-disabled={!ready}
      onClick={() => ready && onSelect()}
      className={cn(
        'focus-visible:outline-accent flex w-full items-center gap-3 rounded-[22px] px-[18px] py-4 text-left focus-visible:outline-2',
        checked ? 'border-accent bg-accent-soft border-[1.6px]' : 'bg-card shadow-card rounded-2xl',
        !ready && 'cursor-default opacity-55',
      )}
    >
      <span
        aria-hidden="true"
        className={cn(
          'flex size-[42px] shrink-0 items-center justify-center rounded-[14px] text-[16px] font-bold',
          checked ? 'bg-accent text-white' : 'text-muted bg-[#eadfd2]',
        )}
      >
        {count}
      </span>
      <span className="flex min-w-0 flex-1 flex-col gap-[3px]">
        <span className="text-[15px] leading-[20px] font-bold">{project.title}</span>
        <span className={cn('text-[12px] leading-[17px]', checked ? 'text-ink-2' : 'text-muted')}>
          {description}
        </span>
      </span>
    </button>
  )
}
