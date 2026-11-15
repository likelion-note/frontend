import { api, ApiError, USE_MOCK } from '@/api/client'
import {
  partOfAuthorLabel,
  teamOfAuthorLabel,
  toHashTag,
  toId,
  toPhase,
  unmask,
  type ApiTiming,
} from '@/api/codes'
import { EVENT_TYPE_LABEL, type EventType } from '@/features/admin/types'
import { approvedJournalNotes } from '@/features/note/journalNotes'
import { notes } from '@/features/note/mock/data'
import { myCohort } from '@/features/note/noteFilters'
import { noteStateSnapshot, parseNoteState, setNoteFlag } from '@/features/note/noteStore'
import type { Note, NotePart } from '@/features/note/types'

/**
 * 노트 API.
 * - 목 모드: 목 노트 + 이 브라우저에서 운영진이 승인한 성장일지
 * - 실제 모드: GET /api/notes (내가 볼 수 있는 노트만 서버가 걸러 줘요), GET /api/notes/{id}
 *
 * 검색 · 필터 · 정렬은 두 모드 모두 화면에서 해요 (noteFilters.ts). 실제 모드의 목록에는 본문이 없어서
 * 검색은 제목 · 미리보기 · 태그만 봐요.
 */

/* ---------- 실제 서버 ---------- */

type NoteCardDto = {
  id: number
  title: string | null
  authorLabel: string
  isCurrentCohort: boolean
  isMine: boolean
  activity: Exclude<EventType, 'PROJECT_START'> | null
  timing: ApiTiming | null
  tags: string[]
  preview: string | null
  readCount: number
  helpCount: number
  isRead: boolean
}
type NoteListDto = { notes: NoteCardDto[]; hasNext: boolean }
type NoteDetailDto = Omit<NoteCardDto, 'preview' | 'isRead'> & {
  body: { stuck: string | null; solved: string | null; again: string | null }
  helped: boolean
}

const PAGE_SIZE = 50
/** 목록에는 날짜가 없어요. 서버가 준 순서(최신순)를 '최신순' 정렬에 쓰려고 가짜 시각을 붙여요 */
const orderStamp = (index: number) => new Date(Date.UTC(2100, 0, 1) - index * 1000).toISOString()

function basePart(label: string): NotePart {
  const part = partOfAuthorLabel(label)
  return part === 'OPS' ? 'STAFF' : (part ?? 'PM')
}

/**
 * '도움돼요' 숫자: 화면은 (기본 숫자 + 내가 눌렀으면 1)로 보여줘요.
 * 서버 숫자에는 내 것이 이미 들어 있어서, 내가 누른 노트는 1을 빼서 기본 숫자로 맞춰요.
 */
const baseHelpful = (count: number, helped: boolean) => Math.max(0, count - (helped ? 1 : 0))

function fromCard(dto: NoteCardDto, index: number, helped: boolean): Note {
  const cohort = myCohort()
  const preview = unmask(dto.preview)
  return {
    id: toId(dto.id),
    cohort: dto.isCurrentCohort ? cohort : cohort - 1,
    team: teamOfAuthorLabel(dto.authorLabel),
    part: basePart(dto.authorLabel),
    event: dto.activity ? EVENT_TYPE_LABEL[dto.activity] : '기타',
    phase: toPhase(dto.timing) ?? 'early',
    title: dto.title ?? '제목 없는 노트',
    excerpt: preview,
    tags: dto.tags.map(toHashTag),
    sections: { stuck: '', solved: preview, retry: '' },
    readCount: dto.readCount,
    helpfulCount: baseHelpful(dto.helpCount, helped),
    createdAt: orderStamp(index),
    mine: dto.isMine,
  }
}

async function fetchAllNotes(): Promise<Note[]> {
  const cards: NoteCardDto[] = []
  for (let page = 0; page < 20; page += 1) {
    const data = await api.get<NoteListDto>(`/api/notes?page=${page}&size=${PAGE_SIZE}`)
    cards.push(...data.notes)
    if (!data.hasNext) break
  }
  // 서버가 기억하는 '읽음'을 이 브라우저의 읽음 표시에도 맞춰 둬요
  for (const card of cards) if (card.isRead) setNoteFlag('read', toId(card.id), true)
  const helpful = parseNoteState(noteStateSnapshot()).helpful
  return cards.map((card, index) => fromCard(card, index, helpful.includes(toId(card.id))))
}

async function fetchNote(id: string): Promise<Note | null> {
  if (!/^\d+$/.test(id)) return null
  let dto: NoteDetailDto
  try {
    dto = await api.get<NoteDetailDto>(`/api/notes/${id}`)
  } catch (error) {
    // 없는 노트 · 볼 수 없는 노트는 404 로 와요
    if (error instanceof ApiError && error.status === 404) return null
    throw error
  }
  // 내가 눌렀는지는 서버 값이 기준이에요
  setNoteFlag('helpful', id, dto.helped)
  const cohort = myCohort()
  const solved = unmask(dto.body.solved)
  return {
    id,
    cohort: dto.isCurrentCohort ? cohort : cohort - 1,
    team: teamOfAuthorLabel(dto.authorLabel),
    part: basePart(dto.authorLabel),
    event: dto.activity ? EVENT_TYPE_LABEL[dto.activity] : '기타',
    phase: toPhase(dto.timing) ?? 'early',
    title: dto.title ?? '제목 없는 노트',
    excerpt: solved || unmask(dto.body.stuck),
    tags: dto.tags.map(toHashTag),
    sections: { stuck: unmask(dto.body.stuck), solved, retry: unmask(dto.body.again) },
    readCount: dto.readCount,
    helpfulCount: baseHelpful(dto.helpCount, dto.helped),
    createdAt: orderStamp(0),
    mine: dto.isMine,
  }
}

/** 도움돼요 토글 (실제 모드). POST /api/notes/{id}/help → 서버가 알려준 상태를 돌려줘요 */
export async function toggleNoteHelp(id: string): Promise<boolean> {
  const data = await api.post<{ helped: boolean }>(`/api/notes/${id}/help`)
  return data.helped
}

/* ---------- 화면이 부르는 함수 ---------- */

function allMockNotes(): Note[] {
  return [...approvedJournalNotes(), ...notes]
}

export async function getNotes(): Promise<Note[]> {
  if (!USE_MOCK) return fetchAllNotes()
  return structuredClone(allMockNotes())
}
export async function getNoteById(id: string): Promise<Note | null> {
  if (!USE_MOCK) return fetchNote(id)
  const note = allMockNotes().find((item) => item.id === id)
  return note ? structuredClone(note) : null
}
