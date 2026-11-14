import { MOCK_COHORT, nextId, saveStore, store } from '@/features/admin/mock/store'
import { getProjectTimeline } from '@/features/admin/timeline'
import {
  EVENT_TYPE_LABEL,
  PART_LABEL,
  type AdminUser,
  type EventType,
  type InviteCode,
  type Member,
  type Part,
  type ProjectCategory,
  type ProjectKind,
  type ReviewJournal,
  type ReviewSummary,
  type ScheduleEvent,
  type UserType,
} from '@/features/admin/types'
import { readJournal, readJournals, writeJournal } from '@/features/journal/journalStore'
import type { MyJournal } from '@/features/journal/types'
import { localDateString } from '@/features/meeting/meetingDates'
import { phaseLabel } from '@/features/note/noteFilters'
import { getSession, setSession } from '@/lib/authStorage'
import { getCurrentUser } from '@/lib/currentUser'
import { delay } from '@/lib/delay'

/**
 * 운영진 API. 지금은 브라우저에 저장되는 목 데이터를 돌려줘요.
 * 백엔드가 준비되면 각 함수 안쪽만 `api.get(...)` 등으로 바꿔요.
 */

const clone = <T>(value: T): T => structuredClone(value)
const notFound = (what: string) => new Error(`${what}을(를) 찾을 수 없어요`)

/* ---------- 공통 ---------- */

/** 로그인한 사용자 (헤더 · 인사말 · 프로필 설정) */
export async function getMe(): Promise<AdminUser> {
  await delay(80)
  const session = getSession()
  const user = getCurrentUser()
  if (!session || !user) throw new Error('로그인이 필요해요')
  return { id: user.id, name: user.name, email: session.user.email ?? '', cohort: user.cohort }
}

/** 이름·닉네임 바꾸기. 멤버 목록의 내 이름도 같이 바뀌어요 */
export async function updateMe(input: { name: string }): Promise<AdminUser> {
  await delay(250)
  const name = input.name.trim()
  if (!name) throw new Error('이름이나 닉네임을 적어 주세요')
  if (name.length > 30) throw new Error('30자 안으로 적어 주세요')
  const session = getSession()
  if (!session) throw new Error('로그인이 필요해요')
  const id = String(session.user.id)
  const row = store.members.find((m) => m.id === id)
  if (row) row.name = name
  const signup = store.signups.find((item) => item.userId === id)
  if (signup) signup.name = name
  saveStore()
  setSession({ ...session, user: { ...session.user, name } })
  return { id, name, email: session.user.email ?? '', cohort: session.user.cohort }
}

export async function getReviewSummary(): Promise<ReviewSummary> {
  await delay(120)
  const unassignedCount = store.members.filter(
    (m) => m.type === 'MEMBER' && (!m.part || !m.projectId),
  ).length
  return {
    pendingCount: reviewQueue().length,
    unassignedCount,
    nextEvent: getProjectTimeline().nextMajor,
  }
}

/* ---------- 검토 ---------- */
/* 성장일지 저장소(journal/journalStore)를 그대로 읽고 써요. 아기사자가 검토 요청한 일지가
   여기 대기열에 들어오고, 승인 · 돌려보내기는 작성자의 내 기록에 바로 반영돼요. */

export type PendingSort = 'oldest' | 'newest'

const adminCount = () => store.members.filter((m) => m.type === 'ADMIN').length

/** 다음 기수에게 보이는 팀 가명 (A팀, B팀…). 아기사자 팀 분류가 만들어진 순서예요 */
function teamLetter(projectId: string | null): string | null {
  const index = store.projects.filter((p) => p.kind === 'TEAM').findIndex((p) => p.id === projectId)
  return index >= 0 ? String.fromCharCode(65 + index) : null
}

/** 공개되면 붙는 익명 표기. 작성자가 고른 범위 그대로 보여줘요 */
function reviewLabel(journal: MyJournal): string {
  const owner = store.members.find((m) => m.id === journal.ownerId)
  if (owner?.type === 'ADMIN') {
    return journal.scope === 'NOW' ? `${journal.cohort}기 운영진` : '지난 기수 운영진'
  }
  const part = journal.part ? PART_LABEL[journal.part] : null
  if (journal.scope === 'NEXT') {
    const letter = teamLetter(journal.projectId)
    return [letter ? `지난 기수 ${letter}팀` : '지난 기수', part].filter(Boolean).join(' · ')
  }
  const when =
    journal.eventType && journal.phase
      ? `${EVENT_TYPE_LABEL[journal.eventType]} ${phaseLabel(journal.phase)}`
      : null
  return [`${journal.cohort}기`, part, when].filter(Boolean).join(' · ')
}

function toReview(journal: MyJournal): ReviewJournal | null {
  const organized = journal.organized
  if (!organized || journal.status === 'DRAFT') return null
  return {
    id: journal.id,
    title: organized.title,
    scope: journal.scope,
    anonymousLabel: reviewLabel(journal),
    preview: organized.preview,
    tags: organized.tags.map((tag) => tag.replace(/^#/, '')),
    category: organized.category,
    body: {
      stuck: organized.body.stuck,
      overcame: organized.body.overcame,
      nextTime: organized.body.nextTime,
    },
    maskedCount: organized.maskedCount,
    submittedAt: journal.submittedAt ?? journal.updatedAt.slice(0, 10),
    status: journal.status,
    decidedAt: journal.decidedAt,
    rejectReason: journal.rejectReason,
  }
}

/** 본인 일지는 다른 운영진이 검토해요. 운영진이 한 명뿐이면 본인 것도 봐요 */
const canReview = (journal: MyJournal) =>
  adminCount() <= 1 || journal.ownerId !== getCurrentUser()?.id

/** 검토 대기열 (오래된 순) */
function reviewQueue(): MyJournal[] {
  return readJournals()
    .filter((j) => j.status === 'PENDING' && j.organized && canReview(j))
    .sort(
      (a, b) =>
        (a.submittedAt ?? '').localeCompare(b.submittedAt ?? '') ||
        a.updatedAt.localeCompare(b.updatedAt),
    )
}

const present = (list: (ReviewJournal | null)[]) =>
  list.filter((item): item is ReviewJournal => item !== null)

export async function listPendingJournals(sort: PendingSort = 'oldest'): Promise<ReviewJournal[]> {
  await delay(150)
  const list = present(reviewQueue().map(toReview))
  return sort === 'oldest' ? list : list.reverse()
}

export async function listRecentDecisions(limit = 3): Promise<ReviewJournal[]> {
  await delay(150)
  const decided = readJournals()
    .filter((j) => j.status === 'APPROVED' || j.status === 'REJECTED')
    .sort(
      (a, b) =>
        (b.decidedAt ?? '').localeCompare(a.decidedAt ?? '') ||
        b.updatedAt.localeCompare(a.updatedAt),
    )
  return present(decided.map(toReview)).slice(0, limit)
}

function findSubmitted(id: string): MyJournal {
  const journal = readJournal(id)
  if (!journal || !journal.organized || journal.status === 'DRAFT') throw notFound('일지')
  return journal
}

export async function getJournal(id: string): Promise<ReviewJournal> {
  await delay(120)
  const review = toReview(findSubmitted(id))
  if (!review) throw notFound('일지')
  return review
}

function decide(id: string, patch: Pick<MyJournal, 'status' | 'rejectReason'>) {
  const journal = findSubmitted(id)
  if (journal.status !== 'PENDING') throw new Error('이미 처리된 일지예요')
  if (!canReview(journal)) throw new Error('내 일지는 다른 운영진이 검토해요')
  writeJournal({ ...journal, ...patch, decidedAt: localDateString() })
}

export async function approveJournal(id: string): Promise<void> {
  await delay(250)
  decide(id, { status: 'APPROVED', rejectReason: undefined })
}

export async function rejectJournal(id: string, reason: string): Promise<void> {
  await delay(250)
  if (!reason.trim()) throw new Error('사유를 한 줄 적어 주세요')
  decide(id, { status: 'REJECTED', rejectReason: reason.trim() })
}

/* ---------- 멤버 · 프로젝트 ---------- */

export async function listMembers(): Promise<Member[]> {
  await delay(150)
  return clone(store.members)
}

export async function listProjects(): Promise<ProjectCategory[]> {
  await delay(120)
  return clone(store.projects)
}

export async function assignMember(
  memberId: string,
  input: { part: Part; projectId: string },
): Promise<Member> {
  await delay(250)
  const member = store.members.find((m) => m.id === memberId)
  if (!member) throw notFound('멤버')
  member.part = input.part
  member.projectId = input.projectId
  saveStore()
  return clone(member)
}

export async function createProject(input: {
  title: string
  kind: ProjectKind
}): Promise<ProjectCategory> {
  await delay(250)
  const title = input.title.trim()
  if (!title) throw new Error('분류 제목을 적어 주세요')
  const shortName = title.split('·').pop()?.trim() || title
  const project: ProjectCategory = {
    id: nextId('p'),
    title,
    shortName,
    kind: input.kind,
    cohort: getCurrentUser()?.cohort ?? MOCK_COHORT,
  }
  store.projects.push(project)
  saveStore()
  return clone(project)
}

/* ---------- 일정 ---------- */

export async function listEvents(): Promise<ScheduleEvent[]> {
  await delay(120)
  return clone([...store.events].sort((a, b) => a.date.localeCompare(b.date)))
}

export async function createEvent(input: {
  name: string
  type: EventType
  date: string
}): Promise<ScheduleEvent> {
  await delay(250)
  if (!input.name.trim()) throw new Error('행사 이름을 적어 주세요')
  if (!input.date) throw new Error('날짜를 골라 주세요')
  const event: ScheduleEvent = { id: nextId('e'), ...input, name: input.name.trim() }
  store.events.push(event)
  saveStore()
  return clone(event)
}

export async function deleteEvent(id: string): Promise<void> {
  await delay(200)
  const index = store.events.findIndex((e) => e.id === id)
  if (index < 0) throw notFound('일정')
  store.events.splice(index, 1)
  saveStore()
}

/* ---------- 초대코드 ---------- */

export async function listInviteCodes(): Promise<InviteCode[]> {
  await delay(120)
  return clone(store.inviteCodes)
}

export async function toggleInviteCode(id: string): Promise<InviteCode> {
  await delay(200)
  const code = store.inviteCodes.find((c) => c.id === id)
  if (!code) throw notFound('초대코드')
  code.enabled = !code.enabled
  saveStore()
  return clone(code)
}

export async function createInviteCode(input: {
  cohort: number
  userType: UserType
  expiresAt: string
}): Promise<InviteCode> {
  await delay(250)
  const prefix = input.userType === 'MEMBER' ? 'LION' : 'STAF'
  let code = `${prefix}${input.cohort}`
  // 같은 코드가 있으면 뒤에 숫자를 붙여요 (6자리 유지)
  let n = 2
  while (store.inviteCodes.some((c) => c.code === code)) {
    code = `${prefix.slice(0, 3)}${input.cohort}${n++}`
  }
  const created: InviteCode = {
    id: nextId('c'),
    code,
    userType: input.userType,
    cohort: input.cohort,
    enabled: true,
    expiresAt: input.expiresAt,
    usedCount: 0,
  }
  store.inviteCodes.unshift(created)
  saveStore()
  return clone(created)
}
