import { api } from '@/api/client'
import {
  authorLabelText,
  dateOnly,
  fromId,
  maskedCount,
  toId,
  toPhase,
  TAG_LABEL,
  unmask,
  type ApiTag,
  type ApiTiming,
} from '@/api/codes'
import { setRealTimeline, timelineFromEvents } from '@/features/admin/timeline'
import {
  EVENT_TYPE_LABEL,
  type AdminUser,
  type EventType,
  type JournalStatus,
  type Member,
  type Part,
  type ProjectCategory,
  type ProjectKind,
  type ReviewJournal,
  type ReviewSummary,
  type Scope,
  type ScheduleEvent,
  type UserType,
} from '@/features/admin/types'
import { phaseLabel } from '@/features/note/noteFilters'
import { refreshSession } from '@/features/onboarding/api'
import { getSession } from '@/lib/authStorage'

/**
 * 운영진 API (실제 서버). 함수 이름과 돌려주는 모양은 api.mock.ts 와 같아요.
 * 서버 응답(숫자 id · 대문자 코드)을 화면 타입으로 바꾸는 일만 해요.
 *
 * 서버에 아직 없는 기능: 일정 삭제. 화면은 adminCapabilities 를 보고 숨겨요.
 */

export type PendingSort = 'oldest' | 'newest'

/* ---------- 서버 응답 모양 ---------- */

type ProjectDto = {
  id: number
  title: string
  kind: ProjectKind
  cohort: number
  teamLetter: string | null
  memberCount: number
}
type MemberDto = {
  id: number
  name: string
  email: string
  type: UserType
  defaultPart: Part | null
  joinedAt: string
}
type MembersDto = {
  unassigned: MemberDto[]
  teams: { project: ProjectDto; membersByPart: Partial<Record<Part, MemberDto[]>> }[]
  ops: { project: ProjectDto; members: MemberDto[] }[]
}
type EventDto = { id: number; name: string; type: EventType; eventDate: string; major: boolean }
type ReviewBodyDto = { stuck: string | null; solved: string | null; again: string | null }
type ReviewListDto = {
  pendingCount: number
  pending: { journalId: number; requestedAt: string }[]
  recent: { journalId: number; title: string | null; status: JournalStatus; reviewedAt: string }[]
}
type ReviewDetailDto = {
  journalId: number
  status: JournalStatus
  title: string | null
  tags: ApiTag[]
  body: ReviewBodyDto | null
  authorLabel: string
  activity: Exclude<EventType, 'PROJECT_START'> | null
  timing: ApiTiming | null
  scope: Scope
  requestedAt: string
}

const shortNameOf = (title: string) => title.split('·').pop()?.trim() || title

const toProject = (dto: ProjectDto): ProjectCategory => ({
  id: toId(dto.id),
  title: dto.title,
  shortName: shortNameOf(dto.title),
  kind: dto.kind,
  cohort: dto.cohort,
})

const toMember = (dto: MemberDto, part: Part | null, projectId: string | null): Member => ({
  id: toId(dto.id),
  name: dto.name,
  email: dto.email,
  part,
  projectId,
  joinedAt: dto.joinedAt,
  type: dto.type,
})

const toEvent = (dto: EventDto): ScheduleEvent => ({
  id: toId(dto.id),
  name: dto.name,
  type: dto.type,
  date: dto.eventDate,
})

/** 검토 화면의 익명 표기: '14기 · PM · 해커톤 1~2주 전' */
function reviewLabel(detail: ReviewDetailDto) {
  const phase = toPhase(detail.timing)
  const when =
    detail.activity && phase ? `${EVENT_TYPE_LABEL[detail.activity]} ${phaseLabel(phase)}` : null
  return [authorLabelText(detail.authorLabel), when].filter(Boolean).join(' · ')
}

function toReview(detail: ReviewDetailDto, decidedAt?: string): ReviewJournal {
  const body = detail.body
  const overcame = unmask(body?.solved)
  return {
    id: toId(detail.journalId),
    title: detail.title ?? '제목 없는 일지',
    scope: detail.scope,
    anonymousLabel: reviewLabel(detail),
    // 목록 카드의 미리보기는 '이렇게 넘겼어요' 앞부분이에요 (없으면 '막혔던 것')
    preview: overcame || unmask(body?.stuck),
    tags: detail.tags.map((code) => TAG_LABEL[code] ?? code),
    category: '',
    body: { stuck: unmask(body?.stuck), overcame, nextTime: unmask(body?.again) },
    maskedCount: maskedCount(body?.stuck, body?.solved, body?.again),
    submittedAt: dateOnly(detail.requestedAt),
    status: detail.status,
    decidedAt,
  }
}

const getReviews = () => api.get<ReviewListDto>('/api/admin/reviews')
const getReviewDetail = (id: number | string) =>
  api.get<ReviewDetailDto>(`/api/admin/reviews/${id}`)

/* ---------- 공통 ---------- */

export async function getMe(): Promise<AdminUser> {
  const me = await refreshSession()
  return {
    id: toId(me.id),
    name: me.name,
    email: getSession()?.user.email ?? '',
    cohort: me.cohort,
  }
}

export async function getReviewSummary(): Promise<ReviewSummary> {
  const [reviews, members, events] = await Promise.all([
    getReviews(),
    api.get<MembersDto>('/api/admin/members'),
    listEvents(),
  ])
  return {
    pendingCount: reviews.pendingCount,
    unassignedCount: members.unassigned.length,
    nextEvent: timelineFromEvents(events).nextMajor,
  }
}

/* ---------- 검토 ---------- */

/** 목록 응답에는 미리보기 · 태그가 없어서, 대기 중인 일지는 상세를 같이 받아 카드에 채워요 */
export async function listPendingJournals(sort: PendingSort = 'oldest'): Promise<ReviewJournal[]> {
  const { pending } = await getReviews()
  const details = await Promise.all(pending.map((item) => getReviewDetail(item.journalId)))
  const list = details.map((detail) => toReview(detail))
  return sort === 'oldest' ? list : list.reverse()
}

export async function listRecentDecisions(limit = Infinity): Promise<ReviewJournal[]> {
  const { recent } = await getReviews()
  const items = recent.slice(0, limit)
  const details = await Promise.all(items.map((item) => getReviewDetail(item.journalId)))
  return details.map((detail, index) => toReview(detail, dateOnly(items[index].reviewedAt)))
}

export async function getJournal(id: string): Promise<ReviewJournal> {
  return toReview(await getReviewDetail(id))
}

export async function approveJournal(id: string): Promise<void> {
  await api.post(`/api/admin/reviews/${id}/approve`)
}

export async function rejectJournal(id: string, reason: string): Promise<void> {
  if (!reason.trim()) throw new Error('사유를 한 줄 적어 주세요')
  await api.post(`/api/admin/reviews/${id}/reject`, { reason: reason.trim() })
}

/* ---------- 멤버 · 프로젝트 ---------- */

export async function listMembers(): Promise<Member[]> {
  const data = await api.get<MembersDto>('/api/admin/members')
  const members: Member[] = data.unassigned.map((dto) => toMember(dto, null, null))
  for (const team of data.teams) {
    const projectId = toId(team.project.id)
    for (const [part, list] of Object.entries(team.membersByPart)) {
      for (const dto of list ?? []) members.push(toMember(dto, part as Part, projectId))
    }
  }
  for (const group of data.ops) {
    const projectId = toId(group.project.id)
    for (const dto of group.members) members.push(toMember(dto, 'OPS', projectId))
  }
  return members
}

export async function listProjects(): Promise<ProjectCategory[]> {
  return (await api.get<ProjectDto[]>('/api/admin/projects')).map(toProject)
}

async function findMember(memberId: string): Promise<Member> {
  const member = (await listMembers()).find((m) => m.id === memberId)
  if (!member) throw new Error('멤버를 찾을 수 없어요')
  return member
}

export async function assignMember(
  memberId: string,
  input: { part: Part; projectId: string },
): Promise<Member> {
  await api.put(`/api/admin/members/${memberId}/assignment`, {
    projectId: fromId(input.projectId),
    part: input.part,
  })
  return findMember(memberId)
}

export async function unassignMember(memberId: string): Promise<Member> {
  await api.delete(`/api/admin/members/${memberId}/assignment`)
  return findMember(memberId)
}

export async function createProject(input: {
  title: string
  kind: ProjectKind
}): Promise<ProjectCategory> {
  const title = input.title.trim()
  if (!title) throw new Error('분류 제목을 적어 주세요')
  // 서버는 같은 제목을 막지 않아서 여기서 먼저 확인해요
  const squeeze = (value: string) => value.replace(/\s+/g, '')
  if ((await listProjects()).some((project) => squeeze(project.title) === squeeze(title))) {
    throw new Error('같은 제목의 분류가 이미 있어요')
  }
  return toProject(await api.post<ProjectDto>('/api/admin/projects', { title, kind: input.kind }))
}

/* ---------- 일정 ---------- */

export async function listEvents(): Promise<ScheduleEvent[]> {
  const events = (await api.get<EventDto[]>('/api/admin/events'))
    .map(toEvent)
    .sort((a, b) => a.date.localeCompare(b.date))
  // 운영진 화면의 D-day 도 같은 일정으로 계산해요
  setRealTimeline(timelineFromEvents(events))
  return events
}

export async function createEvent(input: {
  name: string
  type: EventType
  date: string
}): Promise<ScheduleEvent> {
  if (!input.name.trim()) throw new Error('행사 이름을 적어 주세요')
  if (!input.date) throw new Error('날짜를 골라 주세요')
  return toEvent(
    await api.post<EventDto>('/api/admin/events', {
      name: input.name.trim(),
      type: input.type,
      eventDate: input.date,
    }),
  )
}

export async function deleteEvent(): Promise<void> {
  throw new Error('일정 지우기는 아직 준비 중이에요')
}
