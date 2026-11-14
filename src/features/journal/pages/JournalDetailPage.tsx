import { Link, useLocation, useNavigate, useParams } from 'react-router'

import grid from '@/assets/journal/grid-bg.svg'
import { BackHeader, ScreenContent } from '@/components/layout/Screen'
import { Button } from '@/components/ui/Button'
import { Pill } from '@/components/ui/Pill'
import { JournalIllustration } from '@/features/journal/components/JournalIllustration'
import {
  journalMeta,
  journalStatusPill,
  journalTitle,
  partLabel,
  scopeTitle,
} from '@/features/journal/labels'
import type { MyJournal } from '@/features/journal/types'
import { useMyJournal, useMyProjects } from '@/features/journal/useJournals'
import { useNotes } from '@/features/note/useNotes'
import { cn } from '@/lib/cn'

/**
 * 내 일지 (SCR-JOUR-03). Figma는 돌려받은 일지이고, 같은 틀로 상태마다 위쪽 안내만 바꿔요.
 * 아래 '정리본'은 이름을 가린 본문이에요. 자유 메모는 나만 보는 칸이라 따로 보여줘요.
 */
export function JournalDetailPage() {
  const { id = '' } = useParams()
  const navigate = useNavigate()
  const query = useMyJournal(id)
  const projects = useMyProjects()
  const journal = query.data
  // 요약 결과의 '근거가 된 일지'에서 왔으면 그 화면으로 돌아가요.
  const from = (useLocation().state as { from?: string } | null)?.from
  const backTo = from?.startsWith('/me') ? from : '/me'
  // 공개 중인 일지는 노트 게시판에 올라간 노트를 바로 열 수 있어요.
  const notes = useNotes()
  const noteId =
    journal?.status === 'APPROVED'
      ? notes.data?.find(
          (note) => note.id === journal.id || note.title === journal.organized?.title,
        )?.id
      : undefined

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="bg-paper shrink-0">
        <BackHeader title="내 일지" backTo={backTo} />
      </div>
      <ScreenContent
        className="bg-paper [background-size:390px_auto] [background-position:top_center] [background-repeat:repeat-y] pt-2 pb-[max(28px,env(safe-area-inset-bottom))]"
        style={{ backgroundImage: `url(${grid})` }}
      >
        {query.isPending ? (
          <p role="status" className="text-muted text-[13px]">
            일지를 불러오고 있어요.
          </p>
        ) : !journal ? (
          <div role="alert" className="text-[13px]">
            <p>일지를 찾지 못했어요. 지워졌거나 주소가 바뀌었을 수 있어요.</p>
            <Link to="/me" className="text-accent-deep mt-2 inline-block underline">
              내 기록으로
            </Link>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-2">
              <Pill className={cn(journalStatusPill(journal).className, 'px-3 leading-[14px]')}>
                {journalStatusPill(journal).label}
              </Pill>
              <p className="text-muted text-[12px] leading-[17px]">
                {journalMeta(journal, projects.data ?? [])}
              </p>
            </div>
            <StatusNotice journal={journal} />
            {noteId && (
              <Link
                to={`/notes/${noteId}`}
                className="bg-accent-soft text-accent-deep flex h-[46px] w-full items-center justify-center rounded-full text-[16px] font-bold tracking-[-0.16px] active:brightness-95"
              >
                노트 게시판에서 보기
              </Link>
            )}
            {(journal.status === 'REJECTED' || journal.status === 'DRAFT') && (
              <>
                <Button
                  onClick={() => navigate(`/me/journal/${journal.id}/edit`)}
                  className="leading-[22px]"
                >
                  {journal.status === 'REJECTED' ? '고쳐서 다시 내기' : '이어서 쓰기'}
                </Button>
                {journal.status === 'REJECTED' && (
                  <p className="text-muted text-[12px] leading-[17px]">
                    돌려받아도 내 기록과 포트폴리오에는 그대로 남아요.
                  </p>
                )}
              </>
            )}
            <JournalBody journal={journal} />
          </>
        )}
      </ScreenContent>
    </div>
  )
}

/** 상태별 안내 카드. 돌려받음은 Figma, 나머지는 같은 모양에 색만 바꿔요. */
function StatusNotice({ journal }: { journal: MyJournal }) {
  const box = 'flex flex-col gap-2 rounded-[22px] px-[18px] py-4'
  if (journal.status === 'REJECTED') {
    return (
      <section aria-label="운영진 의견" className={cn(box, 'bg-rose-2')}>
        <p className="text-danger flex items-center gap-1.5 text-[14px] leading-[20px] font-bold">
          <JournalIllustration name="think" size={36} />
          운영진이 돌려보냈어요
        </p>
        {journal.rejectReason && (
          <p className="text-[16px] leading-[23px] font-medium">“{journal.rejectReason}”</p>
        )}
      </section>
    )
  }
  if (journal.status === 'PENDING') {
    return (
      <section aria-label="검토 상태" className={cn(box, 'bg-note')}>
        <p className="text-note-ink text-[14px] leading-[20px] font-bold">
          운영진이 이름 없이 검토하고 있어요
        </p>
        <p className="text-ink-2 text-[13px] leading-[19px]">
          승인되면 {scopeTitle(journal.scope, journal.cohort)}돼요. 돌려받으면 여기서 이유를 볼 수
          있어요.
        </p>
      </section>
    )
  }
  if (journal.status === 'APPROVED') {
    return (
      <section aria-label="공개 상태" className={cn(box, 'bg-accent-soft')}>
        <p className="text-accent-deep text-[14px] leading-[20px] font-bold">
          {journal.scope === 'NOW'
            ? `${journal.cohort}기 노트 게시판에 공개 중이에요`
            : `${journal.cohort + 1}기부터 노트 게시판에 공개돼요`}
        </p>
        <p className="text-ink-2 text-[13px] leading-[19px]">
          읽음 {journal.readCount} · 도움돼요 {journal.helpfulCount}
        </p>
      </section>
    )
  }
  return (
    <section aria-label="작성 상태" className={cn(box, 'bg-beige')}>
      <p className="text-beige-ink text-[14px] leading-[20px] font-bold">
        아직 검토를 요청하지 않은 일지예요
      </p>
    </section>
  )
}

/** 정리본. 정리 전이면 쓴 그대로 보여줘요. 돌려받은 일지는 '이렇게 넘겼어요'를 강조해요. */
function JournalBody({ journal }: { journal: MyJournal }) {
  const body = journal.organized?.body ?? journal.body
  const sections = [
    { label: '막혔던 것', text: body.stuck, highlight: false },
    { label: '이렇게 넘겼어요', text: body.overcame, highlight: journal.status === 'REJECTED' },
    { label: '다시 한다면', text: body.nextTime, highlight: false },
  ].filter((section) => section.text.trim())
  return (
    <article aria-labelledby="journal-title" className="flex flex-col gap-3.5">
      <div className="flex items-center gap-2 pt-2">
        <h2 className="min-w-0 flex-1 text-[17px] leading-[25px] font-bold">
          <span className="marker-underline">정리본</span>
        </h2>
        <p className="text-muted text-[13px] leading-[19px] font-medium">
          {[`${journal.cohort}기`, journal.part && partLabel(journal.part)]
            .filter(Boolean)
            .join(' · ')}
        </p>
      </div>
      <h3 id="journal-title" className="text-[18px] leading-[26px] font-bold">
        {journalTitle(journal)}
      </h3>
      {sections.map((section) => (
        <section key={section.label} className="flex flex-col gap-1.5">
          <h4 className="text-muted text-[12px] leading-[17px] font-bold">{section.label}</h4>
          <p
            className={cn(
              'text-[15px] leading-[1.65] [overflow-wrap:anywhere] whitespace-pre-wrap',
              section.highlight && 'bg-accent-soft rounded-xl px-3 py-2.5',
            )}
          >
            {section.text}
          </p>
        </section>
      ))}
      {journal.body.memo.trim() && (
        <section className="flex flex-col gap-1.5">
          <h4 className="text-muted text-[12px] leading-[17px] font-bold">
            자유 메모 · 나만 보여요
          </h4>
          <p className="text-ink-2 text-[14px] leading-[1.65] [overflow-wrap:anywhere] whitespace-pre-wrap">
            {journal.body.memo}
          </p>
        </section>
      )}
    </article>
  )
}
