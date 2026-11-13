import { useState } from 'react'
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
import { useMyNotePart } from '@/features/note/useMyNotePart'
import { useNotes } from '@/features/note/useNotes'

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
  const myPart = useMyNotePart()
  const filters = readFilters(params, myPart)
  // 한글 조합 중에 입력이 끊기지 않도록 검색어는 화면 상태가 기준이고 URL에는 따라 써요.
  const [query, setQuery] = useState(filters.query)
  const notes = useNotes()
  const noteState = useNoteState()

  function update(patch: Partial<NoteFilters>) {
    const next = { ...filters, query, ...patch }
    if (patch.query !== undefined) setQuery(patch.query)
    setParams(writeFilters(params, next, myPart), { replace: true, preventScrollReset: true })
  }

  const visible = notes.data ? filterNotes(notes.data, { ...filters, query }) : []
  const searching = query.trim().length > 0
  const empty = notes.isSuccess && visible.length === 0

  return (
    <div className="flex h-full min-h-0 flex-col">
      {/* 탭 화면 헤더. 회의 도우미와 같은 모양이고, 아래 본문만 스크롤돼요. */}
      <header className="border-header-line bg-paper flex h-[52px] shrink-0 items-center gap-1.5 border-b px-5">
        <h1 className="min-w-0 flex-1 text-[24px] leading-[29px] font-bold">
          <span className="marker-underline-lg">노트 게시판</span>
        </h1>
        <NoteIllustration name={searching ? 'search' : 'grad'} size={48} className="-mr-1" />
      </header>
      <ScreenContent
        className="bg-paper [background-size:390px_auto] [background-position:top_center] [background-repeat:repeat-y] pt-2"
        style={{ backgroundImage: `url(${empty ? emptyGrid : boardGrid})` }}
      >
        {!searching && (
          <div className="flex">
            <img src={headHandwriting} width={115} height={30} alt="선배들이 남긴 한 줄" />
          </div>
        )}
        <NoteSearchBar value={query} onChange={(value) => update({ query: value })} />

        <div className="flex flex-col gap-2">
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
