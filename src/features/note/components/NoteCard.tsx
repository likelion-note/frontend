import { Link, useViewTransitionState } from 'react-router'

import { Card } from '@/components/ui/Card'
import { Pill } from '@/components/ui/Pill'
import { formatNoteMeta } from '@/features/note/noteFilters'
import type { Note } from '@/features/note/types'
import { cn } from '@/lib/cn'

/**
 * 게시판 카드. 카드 어디를 눌러도 상세로 가요.
 * 상세로 넘어가는 동안 이 카드가 종이로 커지도록 view-transition-name을 붙여요 (note.css).
 */
export function NoteCard({
  note,
  search,
  read,
  helpful,
}: {
  note: Note
  search: string
  read: boolean
  helpful: boolean
}) {
  const to = `/notes/${note.id}`
  const transitioning = useViewTransitionState(to)
  const titleId = `note-title-${note.id}`
  return (
    <Card
      as="article"
      aria-labelledby={titleId}
      className={cn(
        'relative flex flex-col gap-1.5 transition-opacity focus-within:opacity-100',
        read && 'opacity-60',
      )}
      style={transitioning ? { viewTransitionName: 'note-paper' } : undefined}
    >
      <div className="flex items-center gap-2">
        <h2 id={titleId} className="min-w-0 flex-1 text-[16px] leading-[19px] font-bold">
          <Link
            to={{ pathname: to, search }}
            viewTransition
            className="focus-visible:outline-accent rounded after:absolute after:inset-0 after:rounded-2xl focus-visible:outline-2"
          >
            {note.title}
          </Link>
        </h2>
        {read && (
          <span className="text-accent-deep shrink-0 text-[11px] leading-[13px] font-bold">
            읽음
          </span>
        )}
      </div>
      <p className="text-muted text-[12px] leading-[14px]">{formatNoteMeta(note)}</p>
      {note.handwrittenImage ? (
        <div className="pt-0.5">
          <img
            src={note.handwrittenImage.src}
            width={note.handwrittenImage.width}
            height={note.handwrittenImage.height}
            alt={note.excerpt}
          />
        </div>
      ) : (
        <p className="text-ink-2 text-[13px] leading-[19px]">{note.excerpt}</p>
      )}
      <div className="flex items-center gap-1.5 pt-1">
        <p className="text-muted min-w-0 flex-1 text-[12px] leading-[14px] font-medium">
          읽음 {note.readCount} · 도움돼요 {note.helpfulCount + (helpful ? 1 : 0)}
        </p>
        {note.tags[0] && (
          <Pill tone="rose2" className="px-3 leading-[14px]">
            {note.tags[0]}
          </Pill>
        )}
      </div>
    </Card>
  )
}
