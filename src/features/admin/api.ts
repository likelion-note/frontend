import { nextId, store, today } from '@/features/admin/mock/store'
import {
  MAJOR_EVENT_TYPES,
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
import { daysBetween } from '@/lib/date'
import { delay } from '@/lib/delay'

/**
 * 운영진 API. 지금은 메모리 목 데이터를 돌려줘요.
 * 백엔드가 준비되면 각 함수 안쪽만 `api.get(...)` 등으로 바꿔요.
 */

const clone = <T>(value: T): T => structuredClone(value)
const notFound = (what: string) => new Error(`${what}을(를) 찾을 수 없어요`)

/* ---------- 공통 ---------- */

export async function getMe(): Promise<AdminUser> {
  await delay(80)
  return clone(store.me)
}

/** 이름·닉네임 바꾸기. 멤버 목록의 내 이름도 같이 바뀌어요 */
export async function updateMe(input: { name: string }): Promise<AdminUser> {
  await delay(250)
  const name = input.name.trim()
  if (!name) throw new Error('이름이나 닉네임을 적어 주세요')
  if (name.length > 30) throw new Error('30자 안으로 적어 주세요')
  store.me.name = name
  const mine = store.members.find((m) => m.id === store.me.id)
  if (mine) mine.name = name
  return clone(store.me)
}

export async function getReviewSummary(): Promise<ReviewSummary> {
  await delay(120)
  const pendingCount = store.journals.filter((j) => j.status === 'PENDING').length
  const unassignedCount = store.members.filter(
    (m) => m.type === 'MEMBER' && (!m.part || !m.projectId),
  ).length
  const next = store.events
    .filter((e) => MAJOR_EVENT_TYPES.includes(e.type) && e.date >= today())
    .sort((a, b) => a.date.localeCompare(b.date))[0]
  return {
    pendingCount,
    unassignedCount,
    nextEvent: next ? { name: next.name, dday: daysBetween(today(), next.date) } : null,
  }
}

/* ---------- 검토 ---------- */

export type PendingSort = 'oldest' | 'newest'

export async function listPendingJournals(sort: PendingSort = 'oldest'): Promise<ReviewJournal[]> {
  await delay(150)
  const list = store.journals
    .filter((j) => j.status === 'PENDING')
    .sort((a, b) =>
      sort === 'oldest'
        ? a.submittedAt.localeCompare(b.submittedAt)
        : b.submittedAt.localeCompare(a.submittedAt),
    )
  return clone(list)
}

export async function listRecentDecisions(limit = 5): Promise<ReviewJournal[]> {
  await delay(150)
  const list = store.journals
    .filter((j) => j.status !== 'PENDING')
    .sort((a, b) => (b.decidedAt ?? '').localeCompare(a.decidedAt ?? ''))
    .slice(0, limit)
  return clone(list)
}

export async function getJournal(id: string): Promise<ReviewJournal> {
  await delay(120)
  const journal = store.journals.find((j) => j.id === id)
  if (!journal) throw notFound('일지')
  return clone(journal)
}

export async function approveJournal(id: string): Promise<void> {
  await delay(250)
  const journal = store.journals.find((j) => j.id === id)
  if (!journal) throw notFound('일지')
  journal.status = 'APPROVED'
  journal.decidedAt = today()
  journal.rejectReason = undefined
}

export async function rejectJournal(id: string, reason: string): Promise<void> {
  await delay(250)
  const journal = store.journals.find((j) => j.id === id)
  if (!journal) throw notFound('일지')
  if (!reason.trim()) throw new Error('사유를 한 줄 적어 주세요')
  journal.status = 'REJECTED'
  journal.decidedAt = today()
  journal.rejectReason = reason.trim()
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
    cohort: store.me.cohort,
  }
  store.projects.push(project)
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
  return clone(event)
}

export async function deleteEvent(id: string): Promise<void> {
  await delay(200)
  const index = store.events.findIndex((e) => e.id === id)
  if (index < 0) throw notFound('일정')
  store.events.splice(index, 1)
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
  return clone(created)
}
