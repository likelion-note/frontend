import { Card } from '@/components/ui/Card'
import { MeetingIllustration } from '@/features/meeting/components/MeetingIllustration'
import { formatActionItem } from '@/features/meeting/formatRecord'
import type { MeetingRecord } from '@/features/meeting/types'
import { formatMonthDay } from '@/lib/date'

export function MeetingSummaryCard({ record }: { record: MeetingRecord }) {
  return (
    <Card
      as="article"
      aria-label="저장한 회의 정리"
      className="relative flex flex-col gap-3 px-5 py-[22px] shadow-none drop-shadow-[0_6px_7px_rgba(115,77,38,0.08)]"
    >
      <p className="text-accent-deep pr-[58px] text-[13px] leading-[16px] font-bold">
        {record.title} · {formatMonthDay(record.date)}
      </p>
      <h2 className="text-muted pr-[58px] text-[12px] leading-[14px] font-bold">정한 것</h2>
      <p className="text-[19px] leading-[23px] font-bold [overflow-wrap:anywhere] whitespace-pre-wrap">
        {record.decisions.join('\n')}
      </p>
      <div className="h-px w-full bg-[#f1e6da]" />
      <h2 className="text-muted text-[12px] leading-[14px] font-bold">누가 언제까지</h2>
      <div>
        {record.actionItems.map((item) => (
          <p
            key={item.id}
            className="text-[15px] leading-[24px] font-medium [overflow-wrap:anywhere] whitespace-pre-wrap"
          >
            {formatActionItem(item)}
          </p>
        ))}
      </div>
      <div className="absolute top-2 right-3">
        <MeetingIllustration name="mega" size={58} />
      </div>
    </Card>
  )
}
