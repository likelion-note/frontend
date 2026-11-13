import { useEffect, useRef, useState } from 'react'
import { useLocation, useSearchParams } from 'react-router'

import boardGrid from '@/assets/note/board-grid.svg'
import emptyGrid from '@/assets/note/empty-grid.svg'
import headHandwriting from '@/assets/note/head-handwriting.svg'
import { BottomNav } from '@/components/common/BottomNav'
import { ScreenContent } from '@/components/layout/Screen'
import { NoteCard } from '@/features/note/components/NoteCard'
import { NoteEmptyState } from '@/features/note/components/NoteEmptyState'
import { NoteFilterRow } from '@/features/note/components/NoteFilterRow'
import { NoteIllustration } from '@/features/note/components/NoteIllustration'
import { NoteSearchBar } from '@/features/note/components/NoteSearchBar'
import {
  currentCohort,
  noteParts,
  notePhases,
  noteSearchSuggestions,
  noteSituationTags,
} from '@/features/note/mock/data'
import { filterNotes, readFilters, sortLabels, writeFilters } from '@/features/note/noteFilters'
import type { NoteFilters, NoteSort } from '@/features/note/types'
import { useNoteState } from '@/features/note/useNoteState'
import { useNotes } from '@/features/note/useNotes'
import { cn } from '@/lib/cn'

import '@/features/note/note.css'

const cohortOptions = [
  { value: 'all' as const, label: '전체' },
  { value: 'past' as const, label: '지난 기수' },
  { value: 'current' as const, label: `우리 기수 (${currentCohort}기)` },
]
const partOptions = [
  { value: 'all' as const, label: '전체' },
  ...noteParts.map(({ id, label }) => ({ value: id, label })),
]
const phaseOptions = [
  { value: 'all' as const, label: '전체' },
  ...notePhases.map(({ id, filterLabel }) => ({ value: id, label: filterLabel })),
]
const tagOptions = noteSituationTags.map((tag) => ({ value: tag, label: tag }))
const allFilters: Omit<NoteFilters, 'sort'> = {
  query: '',
  cohort: 'all',
  part: 'all',
  phase: 'all',
  tag: null,
}

export function NoteBoardPage() {
  const location = useLocation()
  const [params, setParams] = useSearchParams()
  const filters = readFilters(params)
  // 한글 조합 중에 입력이 끊기지 않도록 검색어는 화면 상태가 기준이고 URL에는 따라 써요.
  const [query, setQuery] = useState(filters.query)
  const notes = useNotes()
  const noteState = useNoteState()
  const stuck = useStuck()

  function update(patch: Partial<NoteFilters>) {
    const next = { ...filters, query, ...patch }
    if (patch.query !== undefined) setQuery(patch.query)
    setParams(writeFilters(params, next), { replace: true, preventScrollReset: true })
  }

  const visible = notes.data ? filterNotes(notes.data, { ...filters, query }) : []
  const searching = query.trim().length > 0
  const empty = notes.isSuccess && visible.length === 0

  return (
    <div className="flex h-full min-h-0 flex-col">
      <ScreenContent
        className="bg-paper relative [background-size:390px_auto] [background-position:top_center] [background-repeat:repeat-y] pt-2"
        style={{ backgroundImage: `url(${empty ? emptyGrid : boardGrid})` }}
      >
        <div className="relative flex items-center">
          <h1 className="text-[24px] leading-[29px] font-bold">노트 게시판</h1>
          <NoteIllustration
            name={searching ? 'search' : 'grad'}
            size={56}
            className="absolute -top-2 -right-1"
          />
        </div>
        {!searching && (
          <div className="flex">
            <img src={headHandwriting} width={115} height={30} alt="선배들이 남긴 한 줄" />
          </div>
        )}
        <NoteSearchBar value={query} onChange={(value) => update({ query: value })} />

        <div ref={stuck.sentinel} aria-hidden="true" className="-mb-3.5 h-0" />
        {/* 붙었을 때 바탕이 칩 위아래로 조금 남도록 여백을 두고, 같은 만큼 바깥 여백을 당겨 둬요. */}
        <div
          className={cn(
            'sticky -top-2 z-10 -mx-5 -my-2.5 flex flex-col gap-2 px-5 py-2.5 transition-[background-color,box-shadow] duration-200',
            stuck.value && 'bg-paper/95 shadow-[0_6px_10px_-8px_rgba(115,77,38,0.25)]',
          )}
        >
          <NoteFilterRow
            label="기수"
            options={cohortOptions}
            value={filters.cohort}
            onChange={(value) => update({ cohort: value ?? 'all' })}
          />
          <NoteFilterRow
            label="파트"
            options={partOptions}
            value={filters.part}
            onChange={(value) => update({ part: value ?? 'all' })}
          />
          <NoteFilterRow
            label="시점"
            options={phaseOptions}
            value={filters.phase}
            onChange={(value) => update({ phase: value ?? 'all' })}
          />
          <NoteFilterRow
            label="상황"
            options={tagOptions}
            value={filters.tag}
            onChange={(value) => update({ tag: value })}
            allowEmpty
          />
        </div>
        <div aria-hidden="true" className="h-px w-full bg-[#f1e6da]" />

        {notes.isPending ? (
          <p role="status" className="text-muted text-[13px]">
            노트를 불러오고 있어요.
          </p>
        ) : notes.isError ? (
          <div role="alert" className="text-[13px]">
            <p>노트를 불러오지 못했어요.</p>
            <button
              type="button"
              className="text-accent-deep mt-2 underline"
              onClick={() => void notes.refetch()}
            >
              다시 시도
            </button>
          </div>
        ) : empty ? (
          <>
            <h2 className="text-[15px] leading-[18px] font-bold [overflow-wrap:anywhere]">
              {searching ? `'${query.trim()}' 검색 결과 0개` : '노트 0개'}
            </h2>
            {searching ? (
              <NoteEmptyState
                title={`'${query.trim()}' 검색 결과가 없어요`}
                description="다른 말로 찾거나 #태그로 찾아보세요."
                suggestions={noteSearchSuggestions.map((label) => ({
                  label,
                  onSelect: () => update({ query: label }),
                }))}
              />
            ) : (
              <NoteEmptyState
                title="이 조건의 노트가 아직 없어요"
                description="필터를 바꾸거나 처음부터 다시 둘러보세요."
                suggestions={[{ label: '필터 모두 풀기', onSelect: () => update(allFilters) }]}
              />
            )}
          </>
        ) : (
          <>
            <div className="flex items-center gap-2">
              <h2 className="flex-1 text-[15px] leading-[18px] font-bold" aria-live="polite">
                노트 {visible.length}개
              </h2>
              <label className="text-muted focus-within:outline-accent relative shrink-0 rounded text-[13px] leading-[16px] font-medium focus-within:outline-2">
                {sortLabels[filters.sort]} ▾
                <select
                  aria-label="정렬"
                  value={filters.sort}
                  onChange={(event) => update({ sort: event.target.value as NoteSort })}
                  className="absolute inset-0 cursor-pointer opacity-0"
                >
                  {Object.entries(sortLabels).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            {visible.map((note) => (
              <NoteCard
                key={note.id}
                note={note}
                search={location.search}
                read={noteState.has('read', note.id)}
                helpful={noteState.has('helpful', note.id)}
              />
            ))}
          </>
        )}
      </ScreenContent>
      <BottomNav />
    </div>
  )
}

/** 필터 묶음이 위에 붙었는지. 붙었을 때만 바탕을 깔아서 평소에는 모눈이 그대로 보여요. */
function useStuck() {
  const sentinel = useRef<HTMLDivElement>(null)
  const [value, setValue] = useState(false)
  useEffect(() => {
    const node = sentinel.current
    if (!node) return
    const observer = new IntersectionObserver(([entry]) => setValue(!entry.isIntersecting), {
      root: node.closest('main'),
    })
    observer.observe(node)
    return () => observer.disconnect()
  }, [])
  return { sentinel, value }
}
