import { Link } from 'react-router'

import chevron from '@/assets/note/chevron.svg'
import type { Note } from '@/features/note/types'

/** 종이 아래 '다음 장'. 게시판에서 보던 순서의 다음 노트로 넘겨요. */
export function NoteNextCard({ note, search }: { note: Note; search: string }) {
  return (
    <Link
      to={{ pathname: `/notes/${note.id}`, search }}
      viewTransition
      className="focus-visible:outline-accent flex w-full items-center gap-2.5 rounded-[6px] border border-[#efdfc6] bg-white/75 px-[18px] py-3.5 focus-visible:outline-2"
    >
      <span className="flex min-w-0 flex-1 flex-col gap-0.5 font-bold">
        <span className="text-[11px] leading-[16px] text-[#a08568]">다음 장 · 비슷한 노트</span>
        <span className="text-[14px] leading-[20px] [overflow-wrap:anywhere]">{note.title}</span>
      </span>
      <img src={chevron} width={20} height={20} alt="" />
    </Link>
  )
}
