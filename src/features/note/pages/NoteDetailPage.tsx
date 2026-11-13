import { useEffect } from 'react'
import { Link, useLocation, useParams, useSearchParams } from 'react-router'

import { BackHeader, ScreenContent } from '@/components/layout/Screen'
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
 * 헤더와 본문은 다른 상세 화면과 같은 공통 BackHeader · ScreenContent를 쓰고, BottomNav는 없어요.
 */
export function NoteDetailPage() {
  const { id = '' } = useParams()
  const location = useLocation()
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
    <div className="flex h-full min-h-0 flex-col">
      <div className="bg-paper shrink-0">
        <BackHeader
          title="선배 노트"
          backTo={`/notes${location.search}`}
          viewTransition
          right={
            <div className="flex items-center gap-2">
              {index >= 0 && (
                <p>
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
                  className="text-ink focus-visible:outline-accent shrink-0 rounded focus-visible:outline-2"
                >
                  <NoteBookmarkIcon filled={saved} />
                </button>
              )}
            </div>
          }
        />
      </div>

      <ScreenContent className="pb-[max(28px,env(safe-area-inset-bottom))]">
        {note.isPending ? (
          <p role="status" className="text-muted text-[13px]">
            노트를 펼치고 있어요.
          </p>
        ) : note.isError ? (
          <div role="alert" className="text-[13px]">
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
          <div role="alert" className="py-6 text-center text-[13px]">
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
      </ScreenContent>
    </div>
  )
}
