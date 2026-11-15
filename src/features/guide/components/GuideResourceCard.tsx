import chevron from '@/assets/meeting/chevron.svg'
import { Card } from '@/components/ui/Card'
import { GuideIllustration } from '@/features/guide/components/GuideIllustration'
import type { GuideResource } from '@/features/guide/types'

export function GuideResourceCard({
  resource,
  onSelect,
}: {
  resource: GuideResource
  onSelect: (id: string) => void
}) {
  return (
    <Card className="p-0">
      <button
        type="button"
        aria-haspopup="dialog"
        onClick={() => onSelect(resource.id)}
        className="flex w-full items-center gap-2 rounded-2xl px-[18px] py-4 text-left"
      >
        <span className="bg-accent-soft flex size-11 shrink-0 items-center justify-center rounded-xl">
          <GuideIllustration name="folder" size={32} />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-[15px] leading-[18px] font-bold [overflow-wrap:anywhere]">
            {resource.title}
          </span>
          <span className="text-muted mt-0.5 block text-[12px] leading-[14px]">
            {resource.description}
          </span>
        </span>
        <img src={chevron} width={18} height={18} alt="" />
      </button>
    </Card>
  )
}
