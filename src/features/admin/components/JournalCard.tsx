import { Link } from 'react-router'

import { ChevronIcon } from '@/components/icons'
import { Card } from '@/components/ui/Card'
import { Pill } from '@/components/ui/Pill'
import { scopeLabel, scopeTone, submittedLabel } from '@/features/admin/labels'
import type { ReviewJournal } from '@/features/admin/types'

type Props = {
  journal: ReviewJournal
  cohort: number
}

/** 검토 홈의 검토할 성장일지 카드. 누르면 일지 검토로 가요 */
export function JournalCard({ journal, cohort }: Props) {
  return (
    <Card as="article" className="p-0">
      <Link
        to={`/admin/review/${journal.id}`}
        className="flex w-full flex-col gap-1.5 px-[18px] py-4 active:brightness-[0.98]"
      >
        <div className="flex w-full items-center gap-2">
          <Pill tone={scopeTone(journal.scope)}>{scopeLabel(journal.scope, cohort)}</Pill>
          <span className="text-muted text-[12px] leading-none font-medium">
            {submittedLabel(journal.submittedAt)}
          </span>
          <div className="flex-1" />
          <ChevronIcon />
        </div>
        <h3 className="text-ink text-[16px] leading-tight font-bold">{journal.title}</h3>
        <p className="text-muted text-[12px] leading-tight">{journal.anonymousLabel}</p>
        <p className="text-ink-2 text-[13px] leading-[1.5]">{journal.preview}</p>
        <div className="flex w-full flex-wrap items-center gap-1.5 pt-1">
          {journal.tags.map((tag) => (
            <Pill key={tag} tone="rose">
              #{tag}
            </Pill>
          ))}
        </div>
      </Link>
    </Card>
  )
}
