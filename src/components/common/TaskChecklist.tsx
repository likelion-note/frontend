import type { ReactNode } from 'react'
import type { Todo } from '@/features/home/types'
import { cn } from '@/lib/cn'

type Props<T extends Todo> = {
  tasks: T[]
  onToggle: (id: string) => void
  idPrefix: string
  renderAction?: (task: T) => ReactNode
  dueLabel?: (task: T) => string
  highlightToday?: boolean
}
/** 홈과 파트 가이드가 같은 체크 UI를 사용해요. 데이터와 완료 상태는 호출부에서 전달해요. */
export function TaskChecklist<T extends Todo>({
  tasks,
  onToggle,
  idPrefix,
  renderAction,
  dueLabel,
  highlightToday = true,
}: Props<T>) {
  return (
    <ul className="flex flex-col gap-0.5">
      {tasks.map((task) => (
        <li key={task.id} className="flex items-start gap-3 py-[9px]">
          <input
            id={`${idPrefix}-${task.id}`}
            type="checkbox"
            checked={task.isCompleted}
            onChange={() => onToggle(task.id)}
            aria-label={task.title}
            className="checked:bg-accent checked:border-accent focus-visible:outline-accent size-[22px] shrink-0 cursor-pointer appearance-none rounded-lg border-[1.6px] border-[#dcc9b2] bg-white leading-[14px] checked:after:block checked:after:text-center checked:after:text-[12px] checked:after:leading-[19px] checked:after:text-white checked:after:content-['✓'] focus-visible:outline-2"
          />
          <div className="min-w-0 flex-1">
            <label
              htmlFor={`${idPrefix}-${task.id}`}
              className={cn(
                'block text-[15px] leading-[18px] font-medium [overflow-wrap:anywhere]',
                task.isCompleted ? 'text-muted line-through' : 'text-ink',
              )}
            >
              {task.title}
            </label>
            {renderAction?.(task)}
          </div>
          <span
            className={cn(
              'shrink-0 text-[12px] leading-[14px] font-bold',
              highlightToday && task.isDueToday ? 'text-accent-deep' : 'text-muted',
            )}
          >
            {dueLabel ? dueLabel(task) : task.dueLabel}
          </span>
        </li>
      ))}
    </ul>
  )
}
