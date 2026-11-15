import { api, ApiError } from '@/api/client'
import {
  dateOnly,
  fromId,
  fromPhase,
  fromTagLabel,
  maskedCount,
  toHashTag,
  toId,
  toPhase,
  unmask,
  type ApiTag,
  type ApiTiming,
} from '@/api/codes'
import type { JournalStatus, Part, Scope } from '@/features/admin/types'
import { saveSummary, readSummary } from '@/features/journal/portfolioStore'
import type {
  JournalEventType,
  MyJournal,
  MyJournalStatus,
  MyProject,
  PortfolioFormat,
  PortfolioSummary,
} from '@/features/journal/types'
import { getSession } from '@/lib/authStorage'
import { userStorageKey } from '@/lib/currentUser'

/**
 * 성장일지 · 포트폴리오 API (실제 서버). 함수 이름과 돌려주는 모양은 api.mock.ts 와 같아요.
 *
 * 서버에 없는 값은 이 브라우저에 따로 보관해요 (extras):
 * - 불러온 회의 id: 같은 회의를 두 번 불러오지 않게
 * - 보완 질문: 서버는 처음 정리할 때 한 번만 주고 저장하지 않아요
 * - 뺀 태그: 서버에는 검토 요청할 때 한 번에 보내요
 * - 공개 표기: 정리 응답의 authorLabel (미리보기 카드용)
 */

/** 배정 전에 쓴 일지가 담기는 분류. 서버에서는 projectId 가 null 이에요 */
export const UNASSIGNED_PROJECT: MyProject = {
  id: 'unassigned',
  title: '미분류 (배정 전)',
  shortName: '미분류',
  cohort: 0,
}

/* ---------- 서버 응답 모양 ---------- */

type BodyDto = {
  stuck: string | null
  solved: string | null
  again: string | null
  memo: string | null
}
type DetailDto = {
  id: number
  status: MyJournalStatus
  projectId: number | null
  part: Part | null
  activity: JournalEventType | null
  timing: ApiTiming | null
  scope: Scope | null
  raw: BodyDto
  summary: { title: string | null; tags: ApiTag[]; body: BodyDto } | null
  rejectReason: string | null
  updatedAt: string
}
type ListDto = {
  journals: { id: number; status: MyJournalStatus; projectTitle: string | null }[]
}
type FormDto = {
  projects: { id: number; title: string; part: Part | null }[]
  defaultProjectId: number | null
  defaultPart: Part | null
  defaultTiming: ApiTiming | null
}
type SummaryDto = { tags: ApiTag[]; authorLabel: string; followUpQuestion: string | null }
type PortfolioProjectsDto = {
  projects: { projectId: number; title: string }[]
  remainingToday: number
}
type PortfolioSummaryDto = {
  result: string
  sourceJournalIds: number[]
  createdAt: string
}

/* ---------- 이 브라우저에만 두는 값 ---------- */

type Extra = {
  importedMeetingIds?: string[]
  followUp?: string | null
  /** 정리본에서 남겨 둔 태그 코드. 없으면 서버가 준 태그 전부 */
  keptTags?: string[]
  authorLabel?: string
}
const extrasKey = () => userStorageKey('likelion-journal-extra:v1')

function readExtras(): Record<string, Extra> {
  try {
    const value: unknown = JSON.parse(localStorage.getItem(extrasKey()) ?? '{}')
    return value && typeof value === 'object' ? (value as Record<string, Extra>) : {}
  } catch {
    return {}
  }
}
function patchExtra(id: string, patch: Extra) {
  try {
    const all = readExtras()
    localStorage.setItem(extrasKey(), JSON.stringify({ ...all, [id]: { ...all[id], ...patch } }))
  } catch {
    /* 저장이 막혀 있으면 이번 화면에서만 써요 */
  }
}

/* ---------- 변환 ---------- */

const myCohort = () => getSession()?.user.cohort ?? 0
const myId = () => String(getSession()?.user.id ?? '')
const shortNameOf = (title: string) => title.split('·').pop()?.trim() || title
const toProject = (id: number, title: string): MyProject => ({
  id: toId(id),
  title,
  shortName: shortNameOf(title),
  cohort: myCohort(),
})

/** 미리보기 한 줄: '이렇게 넘겼어요'의 첫 문장 */
function firstSentence(text: string) {
  const line = text.split('\n')[0].trim()
  const end = line.search(/[.!?。]\s|[.!?。]$/)
  return end >= 0 ? line.slice(0, end + 1) : line
}

function toJournal(dto: DetailDto, counts?: { readCount: number; helpCount: number }): MyJournal {
  const id = toId(dto.id)
  const extra = readExtras()[id] ?? {}
  const summary = dto.summary
  const solved = unmask(summary?.body.solved)
  const masked = maskedCount(summary?.body.stuck, summary?.body.solved, summary?.body.again)
  const tags = (summary?.tags ?? []).filter(
    (code) => !extra.keptTags || extra.keptTags.includes(code),
  )
  const day = dateOnly(dto.updatedAt)
  return {
    id,
    ownerId: myId(),
    cohort: myCohort(),
    projectId: dto.projectId === null ? UNASSIGNED_PROJECT.id : toId(dto.projectId),
    eventType: dto.activity,
    phase: toPhase(dto.timing),
    // 운영진 일지의 파트(OPS)는 화면의 파트 칩에 없어서 비워 둬요
    part: dto.part && dto.part !== 'OPS' ? dto.part : null,
    scope: dto.scope ?? 'NOW',
    body: {
      stuck: dto.raw.stuck ?? '',
      overcame: dto.raw.solved ?? '',
      nextTime: dto.raw.again ?? '',
      memo: dto.raw.memo ?? '',
    },
    importedMeetingIds: extra.importedMeetingIds ?? [],
    status: dto.status,
    organized: summary
      ? {
          title: summary.title ?? '제목 없는 일지',
          preview: firstSentence(solved) || firstSentence(unmask(summary.body.stuck)),
          tags: tags.map(toHashTag),
          maskedCount: masked,
          maskedExcerpt: masked > 0 ? solved : null,
          category: '',
          followUp:
            dto.status === 'DRAFT' || dto.status === 'REJECTED' ? (extra.followUp ?? null) : null,
          body: {
            stuck: unmask(summary.body.stuck),
            overcame: solved,
            nextTime: unmask(summary.body.again),
          },
          authorLabel: extra.authorLabel,
        }
      : null,
    createdAt: day,
    updatedAt: dto.updatedAt,
    // 서버는 마지막으로 바뀐 시각만 줘요. 검토를 요청했거나 처리된 일지는 그 날짜를 써요.
    submittedAt: dto.status === 'DRAFT' ? undefined : day,
    decidedAt: dto.status === 'APPROVED' || dto.status === 'REJECTED' ? day : undefined,
    rejectReason: dto.rejectReason ?? undefined,
    readCount: counts?.readCount ?? 0,
    helpfulCount: counts?.helpCount ?? 0,
  }
}

function toSaveBody(journal: MyJournal) {
  return {
    projectId: fromId(journal.projectId),
    // 운영진 글의 파트는 항상 OPS (화면에서는 파트를 고르지 않아요)
    part: getSession()?.user.userType === 'ADMIN' ? 'OPS' : journal.part,
    activity: journal.eventType,
    timing: fromPhase(journal.phase),
    scope: journal.scope,
    rawStuck: journal.body.stuck,
    rawSolved: journal.body.overcame,
    rawAgain: journal.body.nextTime,
    rawMemo: journal.body.memo,
  }
}

const isServerId = (id: string) => /^\d+$/.test(id)
const fetchDetail = (id: string | number) => api.get<DetailDto>(`/api/journals/${id}`)

/** 공개된 일지의 읽음 · 도움돼요는 노트 쪽에서 받아요 (노트 id = 일지 id) */
async function noteCounts(id: number) {
  try {
    return await api.get<{ readCount: number; helpCount: number }>(`/api/notes/${id}`)
  } catch {
    return undefined
  }
}

async function loadJournal(id: string | number): Promise<MyJournal> {
  const detail = await fetchDetail(id)
  const counts = detail.status === 'APPROVED' ? await noteCounts(detail.id) : undefined
  return toJournal(detail, counts)
}

/** 열기만 하고 아무것도 안 쓴 일지. 목록에서는 숨기고 다음에 새로 쓸 때 다시 써요 */
const isBlankDraft = (journal: MyJournal) =>
  journal.status === 'DRAFT' &&
  !journal.organized &&
  !journal.eventType &&
  journal.importedMeetingIds.length === 0 &&
  Object.values(journal.body).every((text) => !text.trim())

async function loadAllJournals(): Promise<MyJournal[]> {
  const list = await api.get<ListDto>('/api/journals/me')
  const journals = await Promise.all(
    list.journals.map((item) =>
      // 목록을 받은 직후에 지워진 일지는 상세가 404 로 와요. 그 일지만 빼고 나머지는 보여줘요.
      loadJournal(item.id).catch((error: unknown) => {
        if (error instanceof ApiError && error.status === 404) return null
        throw error
      }),
    ),
  )
  return journals.filter((journal): journal is MyJournal => journal !== null)
}

/* ---------- 자동 저장 (모아서 보내기) ---------- */

/**
 * 쓰기 화면은 글자를 칠 때마다 저장을 불러요. 서버에는 입력이 멈추고 조금 뒤에 마지막 내용만 보내요.
 * 정리 · 검토 요청 · 조회 전에는 flushSaves 로 밀린 저장을 먼저 끝내요.
 */
const SAVE_DELAY_MS = 1200
type Pending = {
  journal: MyJournal
  timer: number
  waiters: { resolve: (value: MyJournal) => void; reject: (reason: unknown) => void }[]
}
const pending = new Map<string, Pending>()

async function sendSave(id: string) {
  const entry = pending.get(id)
  if (!entry) return
  pending.delete(id)
  window.clearTimeout(entry.timer)
  try {
    const saved = await api.put<{ updatedAt: string }>(
      `/api/journals/${id}`,
      toSaveBody(entry.journal),
    )
    const journal = { ...entry.journal, updatedAt: saved.updatedAt }
    entry.waiters.forEach((waiter) => waiter.resolve(journal))
  } catch (error) {
    entry.waiters.forEach((waiter) => waiter.reject(error))
  }
}

async function flushSaves() {
  await Promise.all([...pending.keys()].map((id) => sendSave(id).catch(() => undefined)))
}

if (typeof document !== 'undefined') {
  // 화면을 떠날 때 밀린 저장을 바로 보내요
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') void flushSaves()
  })
}

/* ---------- 화면이 부르는 함수 ---------- */

export async function getMyProjects(): Promise<MyProject[]> {
  const [form, list] = await Promise.all([
    api.get<FormDto>('/api/journals/form'),
    api.get<ListDto>('/api/journals/me'),
  ])
  const projects = form.projects.map((project) => toProject(project.id, project.title))
  // 예전에 일지를 쓴 프로젝트도 고를 수 있게 뒤에 붙여요
  const known = new Set(projects.map((project) => project.title))
  const details = await Promise.all(
    list.journals
      .filter((item) => item.projectTitle && !known.has(item.projectTitle))
      .map((item) =>
        fetchDetail(item.id).then((detail) => ({ detail, title: item.projectTitle! })),
      ),
  )
  for (const { detail, title } of details) {
    if (detail.projectId !== null && !projects.some((p) => p.id === toId(detail.projectId!))) {
      projects.push(toProject(detail.projectId, title))
    }
  }
  // 지금 배정이 없거나(배정 전 · 배정이 풀림) 미분류로 쓴 일지가 있으면 '미분류'도 고를 수 있어요
  const hasUnassigned = list.journals.some((item) => item.projectTitle === null)
  if (projects.length === 0 || form.defaultProjectId === null || hasUnassigned) {
    projects.push({ ...UNASSIGNED_PROJECT, cohort: myCohort() })
  }
  return projects
}

export async function getMyJournals(): Promise<MyJournal[]> {
  await flushSaves()
  return (await loadAllJournals()).filter((journal) => !isBlankDraft(journal))
}

export async function getMyJournal(id: string): Promise<MyJournal | null> {
  if (!isServerId(id)) return null
  await flushSaves()
  try {
    return await loadJournal(id)
  } catch (error) {
    // 없는 일지(404) · 남의 일지(403)는 '찾지 못했어요'로 보여줘요
    if (error instanceof ApiError && (error.status === 404 || error.status === 403)) return null
    throw error
  }
}

/** 빈 일지를 만들어요. 쓰기 화면이 바로 이 id로 자동 저장해요 */
export async function createJournalDraft(): Promise<MyJournal> {
  const [form, all] = await Promise.all([api.get<FormDto>('/api/journals/form'), loadAllJournals()])
  // 서버가 주는 기본값: 지금 배정된 프로젝트 · 그 프로젝트의 내 파트 · 지금 시점
  const body = {
    projectId: form.defaultProjectId,
    part: form.defaultPart,
    activity: null,
    timing: form.defaultTiming,
    scope: 'NOW' as Scope,
    rawStuck: '',
    rawSolved: '',
    rawAgain: '',
    rawMemo: '',
  }
  // 전에 열기만 하고 비워 둔 일지가 있으면 새로 만들지 않고 그 일지를 다시 써요
  const blank = all.find(isBlankDraft)
  if (blank) {
    await api.put(`/api/journals/${blank.id}`, body)
    return loadJournal(blank.id)
  }
  const created = await api.post<{ id: number }>('/api/journals', body)
  return loadJournal(created.id)
}

export function saveJournal(journal: MyJournal): Promise<MyJournal> {
  // 이 브라우저에만 두는 값은 바로 적어 둬요
  patchExtra(journal.id, {
    importedMeetingIds: journal.importedMeetingIds,
    ...(journal.organized
      ? {
          keptTags: journal.organized.tags
            .map(fromTagLabel)
            .filter((code): code is ApiTag => code !== null),
        }
      : {}),
  })
  // 검토 중 · 공개된 일지는 서버에서 고칠 수 없어요 (태그 빼기처럼 화면 값만 바뀐 경우)
  if (journal.status === 'PENDING' || journal.status === 'APPROVED') {
    return Promise.resolve(journal)
  }
  return new Promise<MyJournal>((resolve, reject) => {
    const entry = pending.get(journal.id)
    if (entry) window.clearTimeout(entry.timer)
    pending.set(journal.id, {
      journal,
      timer: window.setTimeout(() => void sendSave(journal.id), SAVE_DELAY_MS),
      waiters: [...(entry?.waiters ?? []), { resolve, reject }],
    })
  })
}

/** AI 정리. POST /api/journals/{id}/summary (저장된 원문으로 서버가 정리해요) */
export async function organizeMyJournal(id: string): Promise<MyJournal> {
  await flushSaves()
  const summary = await api.post<SummaryDto>(`/api/journals/${id}/summary`)
  patchExtra(id, {
    // 보완 질문은 처음 정리할 때만 와요. 다시 정리하면 전에 받은 질문을 그대로 둬요.
    ...(summary.followUpQuestion ? { followUp: summary.followUpQuestion } : {}),
    keptTags: undefined,
    authorLabel: summary.authorLabel,
  })
  return loadJournal(id)
}

/** 보완 질문에 답하기: 답을 '어떻게 넘겼나' 끝에 붙여 저장하고 다시 정리해요 */
export async function answerFollowUp(id: string, answer: string): Promise<MyJournal> {
  await flushSaves()
  const current = await loadJournal(id)
  const overcame = [current.body.overcame.trimEnd(), answer.trim()].filter(Boolean).join('\n')
  await api.put(
    `/api/journals/${id}`,
    toSaveBody({ ...current, body: { ...current.body, overcame } }),
  )
  patchExtra(id, { followUp: null })
  return organizeMyJournal(id)
}

/** 검토 요청. 정리본에서 남겨 둔 태그만 보내요 */
export async function submitJournal(id: string): Promise<MyJournal> {
  await flushSaves()
  const detail = await fetchDetail(id)
  if (!detail.summary) throw new Error('AI 정리를 먼저 해 주세요.')
  const kept = readExtras()[id]?.keptTags
  const tags = detail.summary.tags.filter((code) => !kept || kept.includes(code))
  await api.post<{ status: JournalStatus }>(`/api/journals/${id}/submit`, { tags })
  patchExtra(id, { followUp: null })
  return loadJournal(id)
}

/**
 * 내 일지 지우기. DELETE /api/journals/{id} (작성 중 · 돌려받은 일지만. 나머지는 서버가 400 으로 막아요)
 * 밀려 있던 자동 저장은 취소해요. 지운 뒤에 저장 요청이 나가면 안 되니까요.
 */
export async function deleteJournal(id: string): Promise<void> {
  const entry = pending.get(id)
  if (entry) {
    window.clearTimeout(entry.timer)
    pending.delete(id)
    entry.waiters.forEach((waiter) => waiter.resolve(entry.journal))
  }
  await api.delete(`/api/journals/${id}`)
  // 이 브라우저에 따로 두던 값도 같이 지워요
  try {
    const all = readExtras()
    delete all[id]
    localStorage.setItem(extrasKey(), JSON.stringify(all))
  } catch {
    /* 못 지워도 괜찮아요 */
  }
}

/* ---------- 포트폴리오 ---------- */

const API_FORMAT: Record<PortfolioFormat, string> = {
  resume: 'RESUME_3LINES',
  paragraph: 'EXPERIENCE_PARAGRAPH',
}

export async function getPortfolioQuota() {
  return (await api.get<PortfolioProjectsDto>('/api/portfolio/projects')).remainingToday
}

/** 만든 요약을 다시 받는 API 가 없어서, 마지막으로 만든 요약을 이 브라우저에 보관해 둬요 */
export async function getPortfolioSummary(projectId: string, format: PortfolioFormat) {
  return readSummary(projectId, format)
}

export async function createPortfolioSummary(
  projectId: string,
  format: PortfolioFormat,
): Promise<PortfolioSummary> {
  const [projects, data] = await Promise.all([
    api.get<PortfolioProjectsDto>('/api/portfolio/projects'),
    api.post<PortfolioSummaryDto>('/api/portfolio/summaries', {
      projectId: fromId(projectId),
      format: API_FORMAT[format],
    }),
  ])
  // 직접 채울 칸은 ⟪숫자⟫ 처럼 와요. 화면에서는 [숫자 입력] 으로 보여줘요.
  const text = data.result.replace(/⟪([^⟫]*)⟫/g, '[$1 입력]')
  const lines = text
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => line.replace(/^-\s*/, '• '))
  const summary: PortfolioSummary = {
    projectId,
    format,
    heading: projects.projects.find((p) => toId(p.projectId) === projectId)?.title ?? '',
    lines,
    journalIds: data.sourceJournalIds.map(toId),
    createdAt: data.createdAt,
  }
  saveSummary(projectId, format, summary)
  return summary
}
