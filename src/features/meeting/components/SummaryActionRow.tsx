import removeIcon from '@/assets/meeting/summary-close.svg'
import { UnderlineInput } from '@/components/ui/Field'
import { AutoGrowTextarea } from '@/features/meeting/components/AutoGrowTextarea'
import { weekdays, type SummaryErrors } from '@/features/meeting/summaryDraft'
import type { SummaryActionItem, Weekday } from '@/features/meeting/types'
import { cn } from '@/lib/cn'

export function SummaryActionRow({
  item,
  index,
  errors,
  onChange,
  onRemove,
}: {
  item: SummaryActionItem
  index: number
  errors: SummaryErrors
  onChange: (item: SummaryActionItem) => void
  onRemove: () => void
}) {
  const error = Object.entries(errors).find(([key]) => key.startsWith(`${item.id}:`))?.[1]
  const descriptionId = `action-error-${item.id}`
  return (
    <div className="w-full">
      <div className="flex w-full items-center gap-1.5">
        <UnderlineInput
          aria-label={`${index + 1}번 업무 담당자`}
          placeholder="담당"
          value={item.assignee}
          onChange={(event) => onChange({ ...item, assignee: event.target.value })}
          aria-invalid={!!errors[`${item.id}:assignee`]}
          aria-describedby={error ? descriptionId : undefined}
          className="placeholder:text-icon-muted w-[70px] shrink-0 pr-2.5 pl-3 text-[14px] leading-[17px]"
        />
        <AutoGrowTextarea
          aria-label={`${index + 1}번 업무 할 일`}
          placeholder="할 일"
          value={item.task}
          onChange={(event) => onChange({ ...item, task: event.target.value })}
          aria-invalid={!!errors[`${item.id}:task`]}
          aria-describedby={error ? descriptionId : undefined}
          minHeight={46}
          className="border-input-line text-ink placeholder:text-icon-muted focus:border-accent min-w-0 flex-1 rounded-none border-b-[1.4px] bg-transparent py-[12px] pr-2.5 pl-3 text-[14px] leading-[20px] outline-none"
        />
        <div className="relative w-[62px] shrink-0">
          <select
            aria-label={`${index + 1}번 업무 요일`}
            value={item.dueDay ?? ''}
            onChange={(event) => onChange({ ...item, dueDay: event.target.value as Weekday })}
            aria-invalid={!!errors[`${item.id}:dueDay`]}
            aria-describedby={error ? descriptionId : undefined}
            className={cn(
              'border-input-line focus:border-accent h-[46px] w-full appearance-none rounded-none border-b-[1.4px] bg-transparent pr-5 pl-3 text-[14px] leading-[17px] outline-none',
              !item.dueDay && 'text-icon-muted',
            )}
          >
            <option value="" disabled>
              선택
            </option>
            {weekdays.map((day) => (
              <option key={day} value={day}>
                {day}
              </option>
            ))}
          </select>
          <span
            aria-hidden="true"
            className="pointer-events-none absolute top-1/2 right-2.5 -translate-y-1/2 text-[10px]"
          >
            ▾
          </span>
        </div>
        <button
          type="button"
          aria-label={`${index + 1}번 업무 삭제`}
          onClick={onRemove}
          className="flex size-[30px] shrink-0 items-center justify-center rounded-xl"
        >
          <img src={removeIcon} width={16} height={16} alt="" />
        </button>
      </div>
      {error && (
        <p id={descriptionId} className="text-danger mt-1 text-[12px] leading-[16px]">
          {error}
        </p>
      )}
    </div>
  )
}
