import { Chip } from '@/components/ui/Chip'
import { noteChipClass } from '@/features/note/components/noteChip'

/**
 * 하나만 고르는 칩 묶음 (활동 · 시점 · 파트). 노트 게시판 필터와 같은 칩 모양이고,
 * 화면 읽기 프로그램에는 라디오 그룹으로 알려요.
 */
export function ChoiceChips<T extends string>({
  id,
  options,
  value,
  onChange,
  invalid,
}: {
  /** 라벨(h2)의 id. 묶음 이름으로 읽혀요. */
  id: string
  options: { value: T; label: string }[]
  value: T | null
  onChange: (value: T) => void
  invalid?: boolean
}) {
  return (
    <div
      role="radiogroup"
      aria-labelledby={id}
      aria-invalid={invalid || undefined}
      className="flex flex-wrap gap-1.5"
    >
      {options.map((option) => {
        const checked = option.value === value
        return (
          <Chip
            key={option.value}
            role="radio"
            aria-pressed={undefined}
            aria-checked={checked}
            selected={checked}
            onClick={() => onChange(option.value)}
            className={noteChipClass(checked)}
          >
            {option.label}
          </Chip>
        )
      })}
    </div>
  )
}
