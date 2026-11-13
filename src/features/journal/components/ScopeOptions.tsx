import type { Scope } from '@/features/admin/types'
import { scopeTitle } from '@/features/journal/labels'
import { cn } from '@/lib/cn'

/**
 * '누구에게 공개할까요' 라디오 카드 두 장. 고른 카드는 연주황 바탕 · 주황 테두리예요.
 * 다음 기수 공개는 팀 이름 대신 'A팀'처럼 가린 이름으로 보여요.
 */
export function ScopeOptions({
  id,
  value,
  onChange,
  cohort,
  partLabel,
}: {
  id: string
  value: Scope
  onChange: (value: Scope) => void
  cohort: number
  partLabel: string | null
}) {
  const options: { value: Scope; lines: string[] }[] = [
    {
      value: 'NOW',
      lines: [
        ['같은 기수에게는 파트만 보여요', `${cohort}기`, partLabel].filter(Boolean).join(' · '),
        '같은 프로젝트 팀원에게는 보이지 않아요',
        '1년 뒤에는 다음 기수에게도 보여요',
      ],
    },
    {
      value: 'NEXT',
      lines: [
        ['내년 아기사자에게만 보여요', '지난 기수 A팀', partLabel].filter(Boolean).join(' · '),
      ],
    },
  ]
  return (
    <div role="radiogroup" aria-labelledby={id} className="flex flex-col gap-3.5">
      {options.map((option) => {
        const checked = option.value === value
        return (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={checked}
            onClick={() => onChange(option.value)}
            className={cn(
              'focus-visible:outline-accent flex w-full items-start gap-3 px-[18px] py-4 text-left focus-visible:outline-2',
              checked
                ? 'border-accent bg-accent-soft rounded-[22px] border-[1.6px]'
                : 'bg-card shadow-card rounded-2xl',
            )}
          >
            <span
              aria-hidden="true"
              className={cn(
                'size-[22px] shrink-0 rounded-full bg-white',
                checked ? 'border-accent border-[6px]' : 'border-[1.6px] border-[#dcc9b2]',
              )}
            />
            <span className="flex min-w-0 flex-1 flex-col gap-[3px]">
              <span className="text-[15px] leading-[20px] font-bold">
                {scopeTitle(option.value, cohort)}
              </span>
              {option.lines.map((line) => (
                <span key={line} className="text-ink-2 text-[12px] leading-[17px]">
                  {line}
                </span>
              ))}
            </span>
          </button>
        )
      })}
    </div>
  )
}
