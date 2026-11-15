import { Link } from 'react-router'

import { JournalIllustration } from '@/features/journal/components/JournalIllustration'

/**
 * 연주황 '이번 주 회의 불러오기' 배너.
 * 내 기록에서는 새 일지로 이동하는 링크(›), 쓰기 화면에서는 '불러오기' 버튼이에요.
 */
export function MeetingImportBanner({
  title,
  description,
  to,
  onImport,
  imported = false,
}: {
  title: string
  description: string
  to?: string
  onImport?: () => void
  imported?: boolean
}) {
  const body = (
    <>
      <JournalIllustration name="calendar" size={32} />
      <span className="flex min-w-0 flex-1 flex-col gap-0.5">
        <span className="text-[14px] leading-[20px] font-bold">{title}</span>
        <span className="text-ink-2 text-[12px] leading-[17px]">{description}</span>
      </span>
    </>
  )
  const box =
    'bg-accent-soft focus-visible:outline-accent flex w-full items-center gap-3 rounded-[20px] px-[18px] py-3.5 text-left focus-visible:outline-2'

  if (to) {
    return (
      <Link to={to} className={box}>
        {body}
        <span aria-hidden="true" className="text-accent-deep shrink-0 text-[18px] font-bold">
          ›
        </span>
      </Link>
    )
  }
  return (
    <div className={box}>
      {body}
      <button
        type="button"
        onClick={onImport}
        disabled={imported}
        className="text-accent-deep focus-visible:outline-accent shrink-0 rounded text-[13px] leading-[19px] font-bold focus-visible:outline-2 disabled:opacity-60"
      >
        {imported ? '불러왔어요' : '불러오기'}
      </button>
    </div>
  )
}
