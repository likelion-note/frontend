import { cn } from '@/lib/cn'

type Option<T extends string> = { value: T; label: string }

type Props<T extends string> = {
  options: Option<T>[]
  value: T
  onChange: (value: T) => void
  className?: string
}

/** 두세 칸짜리 알약 탭. 일정/초대코드, 아기사자 팀/운영 같은 전환에 써요 */
export function Segment<T extends string>({ options, value, onChange, className }: Props<T>) {
  return (
    <div
      role="tablist"
      className={cn('bg-segment flex w-full gap-[2px] rounded-full p-1', className)}
    >
      {options.map((option) => {
        const active = option.value === value
        return (
          <button
            key={option.value}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(option.value)}
            className={cn(
              'flex flex-1 items-center justify-center rounded-full py-[9px] text-[13px] leading-none font-bold transition-colors',
              active ? 'text-ink shadow-segment bg-white' : 'text-muted',
            )}
          >
            {option.label}
          </button>
        )
      })}
    </div>
  )
}
