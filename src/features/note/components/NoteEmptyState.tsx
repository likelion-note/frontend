import { Chip } from '@/components/ui/Chip'
import { NoteIllustration } from '@/features/note/components/NoteIllustration'
import { noteChipClass } from '@/features/note/components/noteChip'

/**
 * 검색 결과 없음. 검색어 없이 필터만으로 비었을 때도 같은 틀로 보여줘요.
 * 추천 칩을 누르면 그 말로 다시 찾아요.
 */
export function NoteEmptyState({
  title,
  description,
  suggestions,
}: {
  title: string
  description: string
  suggestions: { label: string; onSelect: () => void }[]
}) {
  return (
    <>
      <div aria-hidden="true" className="min-h-0 flex-1" />
      <div role="status" className="flex flex-col items-center gap-3.5">
        <NoteIllustration name="wow" size={120} />
        <p className="w-full text-center text-[18px] leading-[22px] font-bold [overflow-wrap:anywhere]">
          {title}
        </p>
        <p className="text-muted w-full text-center text-[13px] leading-[16px]">{description}</p>
      </div>
      <div className="flex w-full flex-wrap justify-center gap-1.5">
        {suggestions.map((suggestion) => (
          <Chip
            key={suggestion.label}
            onClick={suggestion.onSelect}
            aria-pressed={undefined}
            className={noteChipClass()}
          >
            {suggestion.label}
          </Chip>
        ))}
      </div>
      <div aria-hidden="true" className="h-[60px]" />
    </>
  )
}
