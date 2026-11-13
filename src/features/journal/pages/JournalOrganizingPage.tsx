import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router'

import grid from '@/assets/journal/grid-bg.svg'
import { ScreenContent } from '@/components/layout/Screen'
import { organizeMyJournal } from '@/features/journal/api'
import { JournalIllustration } from '@/features/journal/components/JournalIllustration'
import { useJournalCache } from '@/features/journal/useJournals'
import { cn } from '@/lib/cn'

const steps = [
  '실명과 팀 이름 찾는 중',
  '상황 태그 고르는 중',
  '제목과 미리보기 쓰는 중',
  '어느 기능에 쓰일지 분류하는 중',
]
/** 단계 하나가 넘어가는 시간. 목이라 실제 정리는 바로 끝나지만 과정을 보여줘요. */
const stepMs = 650

/**
 * AI 정리 중 (SCR-JOUR-02). Figma처럼 헤더 없이 단계만 보여주고, 끝나면 미리보기로 바꿔요.
 * 실제 API로 바꾸면 응답이 올 때까지 마지막 단계에서 기다려요.
 */
export function JournalOrganizingPage() {
  const { id = '' } = useParams()
  const navigate = useNavigate()
  const cache = useJournalCache()
  const [done, setDone] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [attempt, setAttempt] = useState(0)

  useEffect(() => {
    let cancelled = false
    const timers: number[] = []
    const wait = (ms: number) =>
      new Promise<void>((resolve) => timers.push(window.setTimeout(resolve, ms)))
    async function run() {
      setDone(0)
      setError(null)
      try {
        const result = organizeMyJournal(id)
        for (let step = 1; step < steps.length; step += 1) {
          await wait(stepMs)
          if (cancelled) return
          setDone(step)
        }
        const journal = await result
        await wait(stepMs)
        if (cancelled) return
        cache.put(journal)
        navigate(`/me/journal/${id}/preview`, { replace: true })
      } catch (reason) {
        if (!cancelled) setError(reason instanceof Error ? reason.message : '정리하지 못했어요.')
      }
    }
    void run()
    return () => {
      cancelled = true
      timers.forEach((timer) => window.clearTimeout(timer))
    }
    // 다시 시도(attempt)할 때만 처음부터 돌려요.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, attempt])

  return (
    <ScreenContent
      className="bg-paper gap-[18px] [background-size:390px_auto] [background-position:top_center] [background-repeat:repeat-y] pt-[18px]"
      style={{ backgroundImage: `url(${grid})` }}
    >
      <div className="flex justify-center">
        <JournalIllustration name="write" size={132} />
      </div>
      <h1 className="text-[26px] leading-[38px] font-bold">노트로 정리하고 있어요</h1>
      <p className="text-ink-2 text-[14px] leading-[20px]">
        잠깐만요, 이름을 가리고 다음 기수가 찾기 쉽게 다듬는 중이에요.
      </p>
      <ol aria-label="정리 단계" className="flex flex-col gap-[18px]">
        {steps.map((step, index) => {
          const state = index < done ? 'done' : index === done ? 'current' : 'waiting'
          return (
            <li key={step} className="flex items-center gap-3.5">
              <span
                aria-hidden="true"
                className={cn(
                  'flex size-[26px] shrink-0 items-center justify-center rounded-full text-[13px] font-bold text-white',
                  state === 'done' && 'bg-accent',
                  state === 'current' && 'border-accent border-[2.4px] motion-safe:animate-pulse',
                  state === 'waiting' && 'border-[2.4px] border-[#f1e6da]',
                )}
              >
                {state === 'done' && '✓'}
              </span>
              <span
                className={cn(
                  'text-[16px] leading-[23px]',
                  state === 'waiting' ? 'text-muted' : 'font-bold',
                )}
              >
                {step}
                <span className="sr-only">
                  {state === 'done' ? ' 완료' : state === 'current' ? ' 진행 중' : ' 대기'}
                </span>
              </span>
            </li>
          )
        })}
      </ol>
      {error && (
        <div role="alert" className="text-[13px]">
          <p>{error}</p>
          <div className="mt-2 flex gap-4">
            <button
              type="button"
              className="text-accent-deep underline"
              onClick={() => setAttempt((value) => value + 1)}
            >
              다시 시도
            </button>
            <Link to={`/me/journal/${id}/edit`} className="text-muted underline">
              쓰기로 돌아가기
            </Link>
          </div>
        </div>
      )}
    </ScreenContent>
  )
}
