import removeIcon from '@/assets/meeting/summary-close.svg'
import { Dropdown } from '@/components/ui/Dropdown'
import { UnderlineInput } from '@/components/ui/Field'
import { AutoGrowTextarea } from '@/features/meeting/components/AutoGrowTextarea'
import { weekdays, type SummaryErrors } from '@/features/meeting/summaryDraft'
import type { SummaryActionItem } from '@/features/meeting/types'
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
        <Dropdown
          ariaLabel={`${index + 1}번 업무 요일`}
          value={item.dueDay ?? null}
          options={weekdays.map((day) => ({ value: day, label: day }))}
          onChange={(dueDay) => onChange({ ...item, dueDay })}
          placeholder="선택"
          invalid={!!errors[`${item.id}:dueDay`]}
          describedBy={error ? descriptionId : undefined}
          align="right"
          className="w-[62px] shrink-0"
          triggerClassName={cn(
            'border-input-line h-[46px] border-b-[1.4px] pr-1.5 pl-3 text-[14px] leading-[17px]',
            !item.dueDay && 'text-icon-muted',
          )}
          menuClassName="w-[76px]"
        />
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
