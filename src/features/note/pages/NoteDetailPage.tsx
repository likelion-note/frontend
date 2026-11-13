import { useEffect } from 'react'
import { Link, useLocation, useNavigate, useParams, useSearchParams } from 'react-router'

import backIcon from '@/assets/note/back.svg'
import { NoteBookmarkIcon } from '@/features/note/components/NoteBookmarkIcon'
import { NoteDiaryPaper } from '@/features/note/components/NoteDiaryPaper'
import { NoteNextCard } from '@/features/note/components/NoteNextCard'
import { filterNotes, readFilters } from '@/features/note/noteFilters'
import { useNoteState } from '@/features/note/useNoteState'
import { useNote, useNotes } from '@/features/note/useNotes'
import { useToast } from '@/hooks/useToast'

import '@/features/note/note.css'

/**
 * 노트 상세 · 다이어리. 게시판의 필터를 쿼리로 이어받아서
 * 'n / 전체'와 다음 장을 게시판에서 보던 순서대로 보여줘요.
 * 피그마처럼 BottomNav는 없어요.
 */
export function NoteDetailPage() {
  const { id = '' } = useParams()
  const location = useLocation()
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const toast = useToast()
  const note = useNote(id)
  const notes = useNotes()
  const noteState = useNoteState()

  // 열어 본 노트는 게시판에서 '읽음'으로 흐리게 보여요.
  const found = note.data != null
  useEffect(() => {
    if (!found) return
    const error = noteState.set('read', id, true)
    if (error) toast(error)
    // 노트가 바뀔 때만 한 번 기록해요.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [found, id])

  const filtered = notes.data ? filterNotes(notes.data, readFilters(params)) : []
  // 홈처럼 다른 곳에서 열어 지금 필터에 없는 노트면 전체 순서를 기준으로 해요.
  const list =
    filtered.some((item) => item.id === id) || !notes.data
      ? filtered
      : filterNotes(notes.data, { ...readFilters(new URLSearchParams()), part: 'all' })
  const index = list.findIndex((item) => item.id === id)
  const next = index >= 0 ? list[index + 1] : undefined
  const backTo = { pathname: '/notes', search: location.search }

  const saved = noteState.has('saved', id)
  function toggle(flag: 'helpful' | 'saved') {
    const on = !noteState.has(flag, id)
    const error = noteState.set(flag, id, on)
    if (error) toast(error)
    else if (flag === 'saved') toast(on ? '노트를 저장했어요.' : '저장을 취소했어요.')
  }

  return (
    <div className="flex h-full min-h-0 flex-col text-[#5a3e2b]">
      {/* 책상 색이 상태바 자리까지 깔리도록 폰 프레임(#mobile-frame) 전체를 덮어요. */}
      <div aria-hidden="true" className="absolute inset-0 bg-[#f5ebda]" />

      <header className="relative flex h-12 shrink-0 items-center gap-1.5 pr-[18px] pl-3">
        <button
          type="button"
          aria-label="노트 게시판으로"
          onClick={() => navigate(backTo, { viewTransition: true })}
          className="focus-visible:outline-accent shrink-0 rounded focus-visible:outline-2"
        >
          <img src={backIcon} width={24} height={24} alt="" />
        </button>
        <p className="min-w-0 flex-1 text-[16px] leading-[23px] font-bold">선배 노트</p>
        {index >= 0 && (
          <p className="shrink-0 text-[12px] leading-[17px] font-medium text-[#a08568]">
            <span className="sr-only">전체 {list.length}개 중 </span>
            {index + 1} / {list.length}
          </p>
        )}
        {found && (
          <button
            type="button"
            aria-label="노트 저장"
            aria-pressed={saved}
            onClick={() => toggle('saved')}
            className="focus-visible:outline-accent shrink-0 rounded focus-visible:outline-2"
          >
            <NoteBookmarkIcon filled={saved} />
          </button>
        )}
      </header>

      <main className="no-scrollbar relative flex min-h-0 flex-1 flex-col gap-3.5 overflow-y-auto overscroll-contain px-3 pt-1.5 pb-[max(24px,env(safe-area-inset-bottom))] [&>*]:shrink-0">
        {note.isPending ? (
          <p role="status" className="px-2 text-[13px] text-[#a08568]">
            노트를 펼치고 있어요.
          </p>
        ) : note.isError ? (
          <div role="alert" className="px-2 text-[13px]">
            <p>노트를 불러오지 못했어요.</p>
            <button
              type="button"
              className="text-accent-deep mt-2 underline"
              onClick={() => void note.refetch()}
            >
              다시 시도
            </button>
          </div>
        ) : !note.data ? (
          <div role="alert" className="px-2 py-6 text-center text-[13px]">
            <p>찾는 노트가 없어요. 지워졌거나 주소가 바뀌었을 수 있어요.</p>
            <Link to={backTo} className="text-accent-deep mt-2 inline-block underline">
              노트 게시판으로
            </Link>
          </div>
        ) : (
          <>
            <NoteDiaryPaper
              note={note.data}
              helpful={noteState.has('helpful', id)}
              onToggleHelpful={() => toggle('helpful')}
            />
            {next && <NoteNextCard note={next} search={location.search} />}
          </>
        )}
      </main>
    </div>
  )
}
