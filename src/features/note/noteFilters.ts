import { currentCohort, noteParts, notePhases } from '@/features/note/mock/data'
import type {
  Note,
  NoteCohortFilter,
  NoteFilters,
  NotePart,
  NotePhase,
  NoteSort,
} from '@/features/note/types'

const cohorts: NoteCohortFilter[] = ['all', 'past', 'current']
const sorts: NoteSort[] = ['latest', 'helpful', 'read']
export const sortLabels: Record<NoteSort, string> = {
  latest: '최신순',
  helpful: '도움돼요순',
  read: '많이 읽은순',
}

/** 파트 필터의 기본값. 내 파트(useMyNotePart) 또는 전체예요. */
export type DefaultPart = NotePart | 'all'

const knownPart = (value: string | null): value is NotePart =>
  noteParts.some((part) => part.id === value)
const knownPhase = (value: string | null): value is NotePhase =>
  notePhases.some((phase) => phase.id === value)

/** URL 쿼리를 필터로 읽어요. 모르는 값은 기본값으로 돌려요. */
export function readFilters(params: URLSearchParams, defaultPart: DefaultPart): NoteFilters {
  const cohort = params.get('cohort')
  const part = params.get('part')
  const phase = params.get('phase')
  const sort = params.get('sort')
  return {
    query: params.get('q') ?? '',
    cohort: cohorts.find((value) => value === cohort) ?? 'all',
    part: part === 'all' ? 'all' : knownPart(part) ? part : defaultPart,
    phase: knownPhase(phase) ? phase : 'all',
    tag: params.get('tag') || null,
    sort: sorts.find((value) => value === sort) ?? 'latest',
  }
}

/** 필터를 URL 쿼리에 써요. 개발용 상태 쿼리(userPart 등)는 그대로 둬요. */
export function writeFilters(
  params: URLSearchParams,
  filters: NoteFilters,
  defaultPart: DefaultPart,
) {
  const next = new URLSearchParams(params)
  const set = (key: string, value: string | null, fallback: string) => {
    if (value === null || value === fallback) next.delete(key)
    else next.set(key, value)
  }
  set('q', filters.query.trim() ? filters.query : null, '')
  set('cohort', filters.cohort, 'all')
  set('part', filters.part, defaultPart)
  set('phase', filters.phase, 'all')
  set('tag', filters.tag, '')
  set('sort', filters.sort, 'latest')
  return next
}

/** 띄어쓰기와 대소문자를 무시해요. '#일정지연'으로 '#일정 지연'도 찾아요. */
const normalize = (value: string) => value.replace(/\s+/g, '').toLowerCase()

export function matchesQuery(note: Note, query: string) {
  const keyword = normalize(query)
  if (!keyword) return true
  if (keyword.startsWith('#')) return note.tags.some((tag) => normalize(tag).includes(keyword))
  return [note.title, note.excerpt, ...Object.values(note.sections), ...note.tags].some((text) =>
    normalize(text).includes(keyword),
  )
}

export function filterNotes(notes: Note[], filters: NoteFilters) {
  const result = notes.filter(
    (note) =>
      matchesQuery(note, filters.query) &&
      (filters.cohort === 'all' ||
        (filters.cohort === 'current'
          ? note.cohort === currentCohort
          : note.cohort < currentCohort)) &&
      (filters.part === 'all' || note.part === filters.part) &&
      (filters.phase === 'all' || note.phase === filters.phase) &&
      (!filters.tag || note.tags.includes(filters.tag)),
  )
  const latest = (left: Note, right: Note) =>
    right.createdAt.localeCompare(left.createdAt) || left.id.localeCompare(right.id)
  return result.sort((left, right) => {
    if (filters.sort === 'helpful')
      return right.helpfulCount - left.helpfulCount || latest(left, right)
    if (filters.sort === 'read') return right.readCount - left.readCount || latest(left, right)
    return latest(left, right)
  })
}

export const partLabel = (part: NotePart) =>
  noteParts.find((item) => item.id === part)?.label ?? part
export const phaseLabel = (phase: NotePhase) =>
  notePhases.find((item) => item.id === phase)?.label ?? ''

/** 카드 둘째 줄. '14기 · PM · 정기 세션 2주 이상 전' / '지난 기수 F팀 · PM · 해커톤 행사 주간' */
export function formatNoteMeta(note: Note) {
  const cohort =
    note.cohort === currentCohort
      ? `${note.cohort}기`
      : ['지난 기수', note.team].filter(Boolean).join(' ')
  return `${cohort} · ${partLabel(note.part)} · ${note.event} ${phaseLabel(note.phase)}`
}

/** 상세 머리말의 시기. '중간발표 · 1~2주 전' */
export const formatNoteTiming = (note: Note) => `${note.event} · ${phaseLabel(note.phase)}`

/** 지난 기수가 쓴 노트인지. 같은 기수 노트는 '선배'라고 부르지 않아요 */
export const isPastNote = (note: Note) => note.cohort < currentCohort

/** 상세 맺음말의 작성자. 이름 없이 기수와 파트만 보여줘요. '13기 PM 선배' / '14기 PM' */
export const formatNoteAuthor = (note: Note) =>
  `${note.cohort}기 ${partLabel(note.part)}${isPastNote(note) ? ' 선배' : ''}`

/** 상세 화면 제목 */
export const noteDetailTitle = (note: Note | null | undefined) =>
  note && !isPastNote(note) ? '우리 기수 노트' : '선배 노트'
