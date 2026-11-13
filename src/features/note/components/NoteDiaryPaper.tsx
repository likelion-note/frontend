import type { ReactNode } from 'react'

import paperGrid from '@/assets/note/paper-grid.svg'
import paw from '@/assets/note/paw.svg'
import spring from '@/assets/note/spring.svg'
import { QuestionIcon } from '@/components/icons'
import { NoteIllustration } from '@/features/note/components/NoteIllustration'
import { formatNoteAuthor, formatNoteTiming } from '@/features/note/noteFilters'
import type { Note } from '@/features/note/types'
import { cn } from '@/lib/cn'

/**
 * 노트 상세의 종이 한 장 (피그마 A1 꿀우유 · 스티커는 A2 살구 크림).
 * 화면 배경과 헤더는 공통 종이 바탕이고, 다이어리 색은 이 종이에만 써서 테마 토큰 대신 여기서 바로 써요.
 * 종이 모눈과 스프링은 피그마 에셋을 세로로 반복해서 글이 길어도 끝까지 이어져요.
 */
export function NoteDiaryPaper({
  note,
  helpful,
  onToggleHelpful,
}: {
  note: Note
  helpful: boolean
  onToggleHelpful: () => void
}) {
  return (
    <article
      aria-labelledby="note-subject"
      className="relative flex w-full flex-col gap-5 rounded-[6px] border border-[#efdfc6] bg-[#fffdf7] pt-[22px] pr-4 pb-6 pl-[42px] text-[#5a3e2b] drop-shadow-[0_2px_5px_rgba(89,61,41,0.1)] [view-transition-name:note-paper]"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-[5px] [background-size:366px_570px]"
        style={{ backgroundImage: `url(${paperGrid})` }}
      />

      <header className="relative flex flex-col gap-2.5">
        <DiaryLine label="주제">
          <h1 id="note-subject" className="text-[15px] leading-[22px] font-bold">
            {note.title}
          </h1>
        </DiaryLine>
        <DiaryLine label="시기">
          <p className="text-[13px] leading-[19px] font-medium">{formatNoteTiming(note)}</p>
        </DiaryLine>
        <ul aria-label="상황 태그" className="flex flex-wrap gap-1.5">
          {note.tags.map((tag) => (
            <li
              key={tag}
              className="bg-rose text-rose-ink rounded-full border-[1.5px] border-white px-2.5 py-1 text-[12px] leading-[14px] font-bold shadow-[0_1px_2px_rgba(77,51,26,0.12)]"
            >
              {tag}
            </li>
          ))}
        </ul>
      </header>

      <div className="relative flex flex-col gap-5">
        <DiarySection icon={<QuestionIcon />} label="막혔던 것" text={note.sections.stuck} />
        <DiarySection
          icon={<NoteIllustration name="check" size={20} />}
          label="이렇게 넘겼어요"
          text={note.sections.solved}
        />
        <DiarySection
          icon={<NoteIllustration name="bulb" size={22} />}
          label="다시 한다면"
          text={note.sections.retry}
        />
      </div>

      <footer className="relative flex items-center gap-2 pt-1.5">
        <NoteIllustration name="grad" size={40} />
        <p className="min-w-0 flex-1 text-[13px] leading-[19px] font-bold">
          {formatNoteAuthor(note)}
        </p>
        <button
          type="button"
          aria-pressed={helpful}
          onClick={onToggleHelpful}
          className={cn(
            'border-accent text-accent focus-visible:outline-accent flex shrink-0 items-center gap-1 rounded-full border-[1.3px] px-3.5 py-[7px] text-[13px] leading-[16px] font-bold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2',
            helpful ? 'bg-accent-soft' : 'bg-white/60',
          )}
        >
          <img src={paw} width={14} height={14} alt="" />
          도움돼요 {note.helpfulCount + (helpful ? 1 : 0)}
        </button>
      </footer>

      {/* 스프링 고리 간격(48px)이 이음매에서도 같도록 576px로 반복하고, 잘린 고리가 없게 round로 맞춰요. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-px bottom-3 -left-[17px] w-10 [background-size:40px_576px] [background-repeat:no-repeat_round] [view-transition-name:note-spring]"
        style={{ backgroundImage: `url(${spring})` }}
      />
    </article>
  )
}

/** 밑줄 친 머리말 한 줄. '주제', '시기' */
function DiaryLine({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex items-end gap-2.5 border-b-[1.2px] border-[rgba(169,131,94,0.7)] pb-1.5">
      <span className="shrink-0 pb-0.5 text-[11px] leading-[16px] font-bold text-[#a08568]">
        {label}
      </span>
      <div className="min-w-0 flex-1 [overflow-wrap:anywhere]">{children}</div>
    </div>
  )
}

/** 아이콘 + 소제목 + 형광펜 친 본문 */
function DiarySection({ icon, label, text }: { icon: ReactNode; label: string; text: string }) {
  return (
    <section className="flex flex-col gap-2">
      <h2 className="flex items-center gap-1.5 text-[12px] leading-[17px] font-bold text-[#a08568]">
        {icon}
        {label}
      </h2>
      <p className="bg-highlight rounded-[4px] px-2.5 py-1.5 text-[15px] leading-[26px] [overflow-wrap:anywhere] whitespace-pre-wrap">
        {text}
      </p>
    </section>
  )
}
