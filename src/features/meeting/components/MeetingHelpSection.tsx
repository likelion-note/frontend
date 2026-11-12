import chevron from '@/assets/meeting/chevron.svg'
import { Card } from '@/components/ui/Card'
import { MeetingIllustration } from '@/features/meeting/components/MeetingIllustration'
import { helpSituations } from '@/features/meeting/mock/data'
import type { SituationId } from '@/features/meeting/types'
export function MeetingHelpSection({ onSelect }: { onSelect: (id: SituationId) => void }) {
  return (
    <section aria-labelledby="help-heading" className="flex flex-col gap-3.5">
      <div className="flex items-center gap-2 pt-2">
        <MeetingIllustration name="chat" size={26} />
        <h2 id="help-heading" className="text-[17px] leading-[20px] font-bold">
          <span className="marker-underline">막힐 때 꺼내 보기</span>
        </h2>
      </div>
      <Card className="py-0.5">
        {helpSituations.map((situation, index) => (
          <div key={situation.id}>
            {index > 0 && <div className="h-px bg-[#f1e6da]" />}
            <button
              type="button"
              aria-haspopup="dialog"
              onClick={() => onSelect(situation.id)}
              className="flex w-full items-center gap-2 py-3.5 text-left text-[15px] leading-[18px] font-medium"
            >
              <span className="min-w-0 flex-1">{situation.title}</span>
              <img src={chevron} width={18} height={18} alt="" />
            </button>
          </div>
        ))}
      </Card>
    </section>
  )
}
