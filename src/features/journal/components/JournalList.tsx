import { Fragment } from 'react'
import { Link } from 'react-router'

import { Card, Divider } from '@/components/ui/Card'
import { Pill } from '@/components/ui/Pill'
import { journalStatusPill, journalTitle } from '@/features/journal/labels'
import type { MyJournal } from '@/features/journal/types'

/**
 * 한 카드 안에 줄로 나눈 일지 목록. 내 기록과 요약 결과의 '근거가 된 일지'가 같이 써요.
 * 작성 중인 일지는 바로 쓰기 화면으로, 나머지는 내 일지 상세로 가요.
 */
export function JournalList({
  journals,
  meta,
  from,
}: {
  journals: MyJournal[]
  meta: (journal: MyJournal) => string
  /** 이 목록이 있는 화면 주소. 일지 상세의 '뒤로'가 여기로 돌아와요 (없으면 내 기록) */
  from?: string
}) {
  return (
    <Card as="section" className="flex flex-col px-[18px] py-1">
      <ul className="flex flex-col">
        {journals.map((journal, index) => {
          const pill = journalStatusPill(journal)
          const to =
            journal.status === 'DRAFT'
              ? `/me/journal/${journal.id}/edit`
              : `/me/journal/${journal.id}`
          return (
            <Fragment key={journal.id}>
              {index > 0 && <Divider className="bg-[#f1e6da]" />}
              <li>
                <Link
                  to={to}
                  state={from ? { from } : undefined}
                  className="focus-visible:outline-accent flex items-center gap-2 rounded py-3 focus-visible:outline-2"
                >
                  <span className="flex min-w-0 flex-1 flex-col gap-[3px]">
                    <span className="text-[15px] leading-[20px] font-bold [overflow-wrap:anywhere]">
                      {journalTitle(journal)}
                    </span>
                    <span className="text-muted text-[12px] leading-[14px]">{meta(journal)}</span>
                  </span>
                  <Pill className={`${pill.className} px-3 leading-[14px]`}>{pill.label}</Pill>
                </Link>
              </li>
            </Fragment>
          )
        })}
      </ul>
    </Card>
  )
}
