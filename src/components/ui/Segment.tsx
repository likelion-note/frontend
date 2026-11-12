import { cn } from '@/lib/cn'
type Option<T extends string> = { value: T; label: string }
type Props<T extends string> = {
  options: Option<T>[]
  value: T
  onChange: (value: T) => void
  className?: string
  tabClassName?: string
  id?: string
  label?: string
}
/** 기본 스타일을 유지하면서 화면별 줄 높이와 접근성 연결을 지원해요. */
export function Segment<T extends string>({
  options,
  value,
  onChange,
  className,
  tabClassName,
  id,
  label,
}: Props<T>) {
  return (
    <div
      role="tablist"
      aria-label={label}
      className={cn('bg-segment flex w-full gap-[2px] rounded-full p-1', className)}
    >
      {options.map((option, index) => {
        const active = option.value === value
        return (
          <button
            key={option.value}
            type="button"
            role="tab"
            id={id ? `${id}-${option.value}` : undefined}
            aria-controls={id ? `${id}-panel` : undefined}
            aria-selected={active}
            tabIndex={active ? 0 : -1}
            onClick={() => onChange(option.value)}
            onKeyDown={(event) => {
              let next: number
              if (event.key === 'ArrowRight') next = (index + 1) % options.length
              else if (event.key === 'ArrowLeft')
                next = (index - 1 + options.length) % options.length
              else if (event.key === 'Home') next = 0
              else if (event.key === 'End') next = options.length - 1
              else return
              event.preventDefault()
              onChange(options[next].value)
              const tabs =
                event.currentTarget.parentElement?.querySelectorAll<HTMLButtonElement>(
                  '[role="tab"]',
                )
              tabs?.[next].focus()
            }}
            className={cn(
              'flex min-w-0 flex-1 items-center justify-center rounded-full py-[9px] text-[13px] leading-none font-bold transition-colors',
              active ? 'text-ink shadow-segment bg-white' : 'text-muted',
              tabClassName,
            )}
          >
            {option.label}
          </button>
        )
      })}
    </div>
  )
}
