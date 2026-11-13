import { Chip } from '@/components/ui/Chip'
import { noteChipClass } from '@/features/note/components/noteChip'

export interface NoteFilterOption<T extends string> {
  value: T
  label: string
}

/**
 * 라벨 + 가로로 미는 칩 한 줄. 한 줄에 하나만 골라요.
 * allowEmpty면 고른 칩을 다시 눌러 해제할 수 있어요 (상황 태그).
 */
export function NoteFilterRow<T extends string>({
  label,
  options,
  value,
  onChange,
  allowEmpty = false,
}: {
  label: string
  options: NoteFilterOption<T>[]
  value: T | null
  onChange: (value: T | null) => void
  allowEmpty?: boolean
}) {
  return (
    <div role="group" aria-label={label} className="flex w-full items-center gap-1.5">
      <span className="text-muted w-[25px] shrink-0 text-[12px] leading-[14px] font-bold">
        {label}
      </span>
      {/* 칩 줄은 화면 오른쪽 끝까지 이어져요. */}
      <div className="no-scrollbar -mr-5 flex min-w-0 flex-1 gap-1.5 overflow-x-auto overscroll-x-contain pr-5">
        {options.map((option) => {
          const selected = option.value === value
          return (
            <Chip
              key={option.value}
              selected={selected}
              onClick={() => onChange(selected && allowEmpty ? null : option.value)}
              className={noteChipClass(selected)}
            >
              {option.label}
            </Chip>
          )
        })}
      </div>
    </div>
  )
}
