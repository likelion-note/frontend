import { useState } from 'react'
import quote from '@/assets/home/quote-presentation.svg'
import { Card } from '@/components/ui/Card'
import type { PreviousTeamTip } from '@/features/meeting/types'
export function PreviousTeamTipCard({ tip }: { tip: PreviousTeamTip }) {
  const [expanded, setExpanded] = useState(false)
  return (
    <Card as="article">
      <button
        type="button"
        aria-expanded={expanded}
        aria-controls={`tip-content-${tip.id}`}
        onClick={() => setExpanded((value) => !value)}
        className="flex w-full flex-col gap-1.5 text-left"
      >
        <span className="text-[16px] leading-[19px] font-bold">{tip.title}</span>
        <span className="text-muted text-[12px] leading-[14px]">{tip.author}</span>
        {tip.handwritten ? (
          <span className="pt-0.5">
            <img src={quote} width={155} height={24} alt={tip.excerpt} />
          </span>
        ) : (
          <span className="text-ink-2 text-[13px] leading-[16px]">{tip.excerpt}</span>
        )}
        <span className="flex w-full flex-wrap items-center gap-1.5 pt-1">
          <span className="text-muted flex-1 text-[12px] leading-[14px] font-medium">
            읽음 {tip.viewCount} · 도움돼요 {tip.helpfulCount}
          </span>
          {tip.tags.map((tag) => (
            <span
              key={tag}
              className="bg-rose-2 text-danger rounded-full px-3 py-[5px] text-[12px] leading-[14px] font-bold"
            >
              {tag}
            </span>
          ))}
        </span>
      </button>
      {expanded && (
        <p
          id={`tip-content-${tip.id}`}
          className="text-ink-2 border-line mt-3 border-t pt-3 text-[13px] leading-relaxed"
        >
          {tip.content}
        </p>
      )}
    </Card>
  )
}
