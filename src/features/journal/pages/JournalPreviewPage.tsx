import { useRef, useState } from 'react'
import { Link, Navigate, useNavigate, useParams } from 'react-router'

import grid from '@/assets/journal/grid-bg.svg'
import { BackHeader, ScreenContent } from '@/components/layout/Screen'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Pill } from '@/components/ui/Pill'
import { answerFollowUp, saveJournal, submitJournal } from '@/features/journal/api'
import { JournalIllustration } from '@/features/journal/components/JournalIllustration'
import { RuledTextarea } from '@/features/journal/components/RuledTextarea'
import { anonymousLabel } from '@/features/journal/labels'
import type { MyJournal } from '@/features/journal/types'
import { useJournalCache, useMyJournal } from '@/features/journal/useJournals'
import { useToast } from '@/hooks/useToast'

/**
 * AI 정리 미리보기 (SCR-JOUR-02). 공개되면 노트 게시판에 보일 카드 모양 그대로 보여줘요.
 * 태그는 빼기만, 보완 질문은 건너뛰거나 답할 수 있어요. 검토 요청하면 내 기록으로 돌아가요.
 */
export function JournalPreviewPage() {
  const { id = '' } = useParams()
  const navigate = useNavigate()
  const toast = useToast()
  const cache = useJournalCache()
  const query = useMyJournal(id)
  const [answer, setAnswer] = useState('')
  const [skipped, setSkipped] = useState(false)
  const [busy, setBusy] = useState(false)
  // 검토 요청 직후에는 내 기록으로 가는 중이라 '이미 낸 일지면 상세로'를 건너뛰어요.
  const submitted = useRef(false)

  if (query.isPending) {
    return (
      <ScreenContent>
        <p role="status" className="text-muted text-[13px]">
          정리본을 불러오고 있어요.
        </p>
      </ScreenContent>
    )
  }
  const journal = query.data
  if (!journal) {
    return (
      <ScreenContent>
        <div role="alert" className="text-[13px]">
          <p>일지를 찾지 못했어요.</p>
          <Link to="/me" className="text-accent-deep mt-2 inline-block underline">
            내 기록으로
          </Link>
        </div>
      </ScreenContent>
    )
  }
  if (!journal.organized) return <Navigate to={`/me/journal/${id}/organizing`} replace />
  if (!submitted.current && (journal.status === 'PENDING' || journal.status === 'APPROVED')) {
    return <Navigate to={`/me/journal/${id}`} replace />
  }
  const organized = journal.organized

  async function run(task: () => Promise<MyJournal>, done?: (journal: MyJournal) => void) {
    if (busy) return
    setBusy(true)
    try {
      const saved = await task()
      cache.put(saved)
      done?.(saved)
    } catch (error) {
      toast(error instanceof Error ? error.message : '저장하지 못했어요.')
    } finally {
      setBusy(false)
    }
  }

  // 함수 선언은 끌어올려져서 위의 null 확인이 이어지지 않아요. 확인된 값을 따로 잡아 둬요.
  const current: MyJournal = journal
  function removeTag(tag: string) {
    void run(() =>
      saveJournal({
        ...current,
        organized: { ...organized, tags: organized.tags.filter((item) => item !== tag) },
      }),
    )
  }

  const audience =
    journal.scope === 'NOW'
      ? `승인되면 ${journal.cohort}기에게 이렇게 보여요 (같은 팀원 제외)`
      : `승인되면 ${journal.cohort + 1}기부터 이렇게 보여요`
  const showQuestion = organized.followUp && !skipped

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="bg-paper shrink-0">
        <BackHeader title="AI 정리 미리보기" backTo={`/me/journal/${id}/edit`} />
      </div>
      <ScreenContent
        className="bg-paper [background-size:390px_auto] [background-position:top_center] [background-repeat:repeat-y] pt-2 pb-[max(28px,env(safe-area-inset-bottom))]"
        style={{ backgroundImage: `url(${grid})` }}
      >
        <p className="text-ink-2 text-[13px] leading-[19px]">{audience}</p>

        <Card as="article" aria-label="노트 미리보기" className="flex flex-col gap-1.5">
          <h2 className="text-[16px] leading-[23px] font-bold">{organized.title}</h2>
          <p className="text-muted text-[12px] leading-[17px]">{anonymousLabel(journal)}</p>
          <p className="text-ink-2 text-[13px] leading-[19px]">{organized.preview}</p>
          <div className="flex items-center gap-1.5 pt-1">
            <p className="text-muted min-w-0 flex-1 text-[12px] leading-[17px] font-medium">
              운영진 검토 후 공개
            </p>
            {organized.tags[0] && (
              <Pill tone="rose2" className="px-3 leading-[14px]">
                {organized.tags[0]}
              </Pill>
            )}
          </div>
        </Card>

        <h2 className="flex items-baseline gap-1.5 pt-1">
          <span className="text-[14px] leading-[20px] font-bold">상황 태그</span>
          <span className="text-muted text-[12px] leading-[17px]">빼기만 가능해요</span>
        </h2>
        <ul className="flex flex-wrap gap-1.5">
          {organized.tags.map((tag) => (
            <li key={tag}>
              <button
                type="button"
                onClick={() => removeTag(tag)}
                disabled={organized.tags.length <= 1 || busy}
                aria-label={`${tag} 빼기`}
                title={organized.tags.length <= 1 ? '태그는 하나 이상 있어야 해요' : undefined}
                className="bg-rose-2 text-danger focus-visible:outline-accent rounded-full px-3 py-[5px] text-[12px] leading-[14px] font-bold whitespace-pre focus-visible:outline-2 disabled:cursor-default"
              >
                {tag}
                {organized.tags.length > 1 && <span aria-hidden="true">{'  ×'}</span>}
              </button>
            </li>
          ))}
        </ul>

        <section className="border-line flex flex-col gap-2 rounded-[22px] border-[1.2px] bg-white px-[18px] py-4">
          <div className="flex items-center gap-2">
            <JournalIllustration name="eraser" size={24} />
            <h2 className="min-w-0 flex-1 text-[15px] leading-[20px] font-bold">
              {organized.maskedCount > 0
                ? `이름 ${organized.maskedCount}곳을 가렸어요`
                : '가릴 이름이 없었어요'}
            </h2>
            <Pill className="text-[11px]">{organized.category} 자료로 쓰여요</Pill>
          </div>
          <div className="flex flex-col gap-1.5">
            <h3 className="text-muted text-[12px] leading-[17px] font-bold">이렇게 넘겼어요</h3>
            <p className="text-[15px] leading-[1.65] [overflow-wrap:anywhere] whitespace-pre-wrap">
              {organized.maskedExcerpt ?? organized.body.overcame}
            </p>
          </div>
        </section>

        {showQuestion && (
          <section
            aria-labelledby="follow-up-question"
            className="bg-note flex flex-col gap-2 rounded-[22px] px-[18px] py-4"
          >
            <p className="text-note-ink flex items-center gap-1.5 text-[12px] leading-[17px] font-bold">
              <JournalIllustration name="think" size={36} />
              보완 질문 하나 · 건너뛰어도 돼요
            </p>
            <label
              id="follow-up-question"
              htmlFor="follow-up-answer"
              className="text-[16px] leading-[23px] font-bold"
            >
              {organized.followUp}
            </label>
            <RuledTextarea
              id="follow-up-answer"
              minHeight={80}
              value={answer}
              onChange={(event) => setAnswer(event.target.value)}
              placeholder="예: 회의 시작 전에 안건을 슬랙에 먼저 올리기로 했어요"
              className="[background-size:314px_110px]"
            />
            <div className="flex gap-2">
              <Button
                variant="ghost"
                onClick={() => setSkipped(true)}
                className="h-[46px] min-w-0 flex-1 bg-white"
              >
                건너뛰기
              </Button>
              <Button
                variant="soft"
                disabled={!answer.trim() || busy}
                onClick={() =>
                  void run(
                    () => answerFollowUp(id, answer),
                    () => toast('답을 정리본에 더했어요.'),
                  )
                }
                className="min-w-0 flex-1"
              >
                답하기
              </Button>
            </div>
          </section>
        )}

        <div className="flex gap-2">
          <Button
            variant="ghost"
            onClick={() => navigate(`/me/journal/${id}/edit`)}
            className="h-[46px] min-w-0 flex-1 bg-white"
          >
            수정하기
          </Button>
          <Button
            disabled={busy}
            aria-busy={busy}
            onClick={() =>
              void run(
                () => submitJournal(id),
                () => {
                  toast('검토를 요청했어요. 결과는 내 기록에서 볼 수 있어요.')
                  submitted.current = true
                  navigate('/me', { replace: true })
                },
              )
            }
            className="min-w-0 flex-1 leading-[22px]"
          >
            검토 요청
          </Button>
        </div>
        <p className="text-muted text-center text-[12px] leading-[17px]">
          운영진은 이름 없이 이 정리본을 보고 승인하거나 한 줄 사유와 함께 돌려보내요
        </p>
      </ScreenContent>
    </div>
  )
}
