import { MeetingIllustration } from '@/features/meeting/components/MeetingIllustration'
import { meetingMeta } from '@/features/meeting/mock/data'
import type { MeetingDefinition } from '@/features/meeting/types'
import { cn } from '@/lib/cn'
export function MeetingQuestions({
  definition,
  completed,
  onToggle,
}: {
  definition: MeetingDefinition
  completed: string[]
  onToggle: (id: string) => void
}) {
  return (
    <section
      role="tabpanel"
      id="meeting-types-panel"
      aria-labelledby={`meeting-types-${definition.id}`}
      className="flex flex-col gap-3.5"
    >
      <div className="flex items-center gap-2 pt-2">
        <MeetingIllustration name="bulb" size={26} />
        <h2 className="min-w-0 flex-1 text-[17px] leading-[20px] font-bold">
          <span className="marker-underline">오늘 꼭 정할 질문</span>
        </h2>
        <span
          aria-live="polite"
          className="text-muted shrink-0 text-[13px] leading-[16px] font-medium"
        >
          {completed.length}/{definition.questions.length} 정함
        </span>
      </div>
      {definition.questions.map((question, index) => {
        const done = completed.includes(question.id)
        return (
          <button
            key={question.id}
            type="button"
            aria-pressed={done}
            onClick={() => onToggle(question.id)}
            className={cn(
              'focus-visible:outline-accent flex w-full items-start gap-3 px-[18px] py-3.5 text-left transition-colors focus-visible:outline-2',
              done ? 'bg-accent-soft rounded-[22px]' : 'bg-card shadow-card rounded-2xl',
            )}
          >
            <span
              aria-hidden="true"
              className={cn(
                'flex size-[26px] shrink-0 items-center justify-center rounded-[13px] text-[13px] leading-[16px] font-bold text-white',
                done ? 'bg-accent' : 'bg-[#a97a50]',
              )}
            >
              {done ? '✓' : index + 1}
            </span>
            <span className="min-w-0 flex-1">
              <span
                className={cn(
                  'block text-[15px] leading-[18px] font-bold',
                  done ? 'text-ink-2' : 'text-ink',
                )}
              >
                {question.title}
              </span>
              <span
                className={cn(
                  'mt-[3px] block text-[12px] leading-[14px]',
                  done ? 'text-accent-deep' : 'text-muted',
                )}
              >
                {done ? meetingMeta.completedLabel : question.description}
              </span>
            </span>
          </button>
        )
      })}
    </section>
  )
}
