/** 백엔드 enum 이름과 맞춰요 */
export type Part = 'PM' | 'DESIGN' | 'FRONTEND' | 'BACKEND' | 'OPS'
export type Scope = 'NOW' | 'NEXT'
export type JournalStatus = 'PENDING' | 'APPROVED' | 'REJECTED'
export type UserType = 'MEMBER' | 'ADMIN'
export type ProjectKind = 'TEAM' | 'OPS'
export type EventType =
  'PROJECT_START' | 'SESSION' | 'IDEATHON' | 'HACKATHON' | 'MIDTERM' | 'DEMODAY' | 'ETC'

export const PART_LABEL: Record<Part, string> = {
  PM: 'PM',
  DESIGN: '디자인',
  FRONTEND: '프론트',
  BACKEND: '백엔드',
  OPS: '운영진',
}

/** 멤버에게 배정할 수 있는 파트 (운영진 제외) */
export const ASSIGNABLE_PARTS: Part[] = ['PM', 'DESIGN', 'FRONTEND', 'BACKEND']

export const EVENT_TYPE_LABEL: Record<EventType, string> = {
  PROJECT_START: '프로젝트 시작',
  SESSION: '정기 세션',
  IDEATHON: '아이디어톤',
  HACKATHON: '해커톤',
  MIDTERM: '중간발표',
  DEMODAY: '데모데이',
  ETC: '기타',
}

/** D-day 를 세는 큰 행사. 정기 세션은 빼요 */
export const MAJOR_EVENT_TYPES: EventType[] = ['IDEATHON', 'HACKATHON', 'MIDTERM', 'DEMODAY']

export type AdminUser = {
  id: string
  name: string
  cohort: number
}

/** 검토 화면에 내려오는 일지. 작성자 이름·프로젝트 id 는 들어오지 않아요 */
export type ReviewJournal = {
  id: string
  title: string
  scope: Scope
  /** 공개 시 표기 (예: "14기 · PM · 중간발표 1~2주 전") */
  anonymousLabel: string
  preview: string
  tags: string[]
  category: string
  body: {
    stuck: string
    overcame: string
    nextTime: string
  }
  /** AI 가 가린 이름 수 */
  maskedCount: number
  submittedAt: string // YYYY-MM-DD
  status: JournalStatus
  decidedAt?: string // YYYY-MM-DD
  rejectReason?: string
}

export type ProjectCategory = {
  id: string
  title: string
  /** 칩에 쓰는 짧은 이름 (예: 멋사수첩팀) */
  shortName: string
  kind: ProjectKind
  cohort: number
}

export type Member = {
  id: string
  name: string
  email: string
  part: Part | null
  projectId: string | null
  joinedAt: string // ISO datetime
  type: UserType
}

export type ScheduleEvent = {
  id: string
  name: string
  type: EventType
  date: string // YYYY-MM-DD
}

export type InviteCode = {
  id: string
  code: string
  userType: UserType
  cohort: number
  enabled: boolean
  expiresAt: string // YYYY-MM-DD
  usedCount: number
}

export type ReviewSummary = {
  pendingCount: number
  unassignedCount: number
  nextEvent: { name: string; dday: number } | null
}
