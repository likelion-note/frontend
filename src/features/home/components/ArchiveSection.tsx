import quote from '@/assets/home/quote.svg'
import { Card } from '@/components/ui/Card'
import { HomeAction } from '@/features/home/components/HomeAction'
import { HomeIllustration } from '@/features/home/components/HomeIllustration'
import type { HomeData } from '@/features/home/types'

export function ArchiveSection({
  notes,
  action,
}: {
  notes: HomeData['archiveNotes']
  action: HomeData['archiveAction']
}) {
  return (
    <section aria-labelledby="archive-heading" className="flex flex-col gap-3.5">
      <div className="flex items-center gap-2 pt-2">
        <HomeIllustration name="grad" size={32} />
        <h2 id="archive-heading" className="min-w-0 flex-1 text-[17px] leading-[20px] font-bold">
          <span className="marker-underline">지난 기수는 이맘때</span>
        </h2>
        <HomeAction
          action={action}
          className="text-muted relative shrink-0 text-[13px] leading-[16px] font-medium before:absolute before:-inset-2.5"
        />
      </div>
      {notes.map((note) => (
        <Card
          key={note.id}
          as="article"
          className="relative flex flex-col gap-1.5 active:brightness-[0.98]"
        >
          <p className="text-accent-deep text-[11px] leading-[13px] font-bold">{note.context}</p>
          <h3 className="text-[16px] leading-[19px] font-bold">
            <HomeAction
              action={{ label: note.title, to: note.to }}
              className="text-left before:absolute before:inset-0 before:rounded-2xl"
            />
          </h3>
          <p className="text-muted text-[12px] leading-[14px]">{note.author}</p>
          {note.handwritten ? (
            <div className="pt-0.5">
              <img
                src={note.handwrittenImage?.src ?? quote}
                width={note.handwrittenImage?.width ?? 202}
                height={note.handwrittenImage?.height ?? 30}
                alt={note.excerpt}
              />
            </div>
          ) : (
            <p className="text-ink-2 text-[13px] leading-[16px]">{note.excerpt}</p>
          )}
          <div className="flex flex-wrap items-center gap-1.5 pt-1">
            <p className="text-muted flex-1 text-[12px] leading-[14px] font-medium">
              읽음 {note.readCount} · 도움돼요 {note.helpfulCount}
            </p>
            <span className="bg-rose-2 text-danger rounded-full px-3 py-[5px] text-[12px] leading-[14px] font-bold">
              {note.tag}
            </span>
          </div>
        </Card>
      ))}
    </section>
  )
}
