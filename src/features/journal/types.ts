import type { EventType, JournalStatus, Scope } from '@/features/admin/types'
import type { AssignedPart } from '@/features/assignment/types'
import type { NotePhase } from '@/features/note/types'

/**
 * 운영진 검토(admin)와 같은 상태 · 공개 범위 · 행사 이름을 써요.
 * 백엔드가 붙으면 같은 API로 합쳐져요. DRAFT는 아직 검토 요청 전인 내 일지예요.
 */
export type MyJournalStatus = 'DRAFT' | JournalStatus
/** 성장일지에서 고르는 활동. '프로젝트 시작'은 활동이 아니라서 빼요. */
export type JournalEventType = Exclude<EventType, 'PROJECT_START'>
/** 행사 기준 시점. 노트 게시판의 시점 필터와 같은 단위예요. */
export type JournalPhase = NotePhase

export interface JournalBody {
  /** 이번에 막힌 것 */
  stuck: string
  /** 어떻게 넘겼나 */
  overcame: string
  /** 다시 한다면 (선택) */
  nextTime: string
  /** 자유 메모 (선택). 나만 보고 정리본에는 들어가지 않아요. */
  memo: string
}

/** AI 정리 결과. 이름을 가린 본문과 노트 카드에 쓰일 제목 · 미리보기 · 태그예요. */
export interface OrganizedJournal {
  title: string
  preview: string
  tags: string[]
  /** 가린 이름 · 팀 이름 수 */
  maskedCount: number
  /** 가린 곳이 보이는 '이렇게 넘겼어요' 일부. 가린 곳이 없으면 null */
  maskedExcerpt: string | null
  /** 어느 기능에 쓰일지 (예: 역할별 가이드) */
  category: string
  /** 보완 질문. 충분히 썼으면 null */
  followUp: string | null
  body: Pick<JournalBody, 'stuck' | 'overcame' | 'nextTime'>
}

export interface MyJournal {
  id: string
  cohort: number
  projectId: string | null
  eventType: JournalEventType | null
  phase: JournalPhase | null
  part: AssignedPart | null
  scope: Scope
  body: JournalBody
  /** 불러온 회의 기록 id. 같은 회의를 두 번 불러오지 않게 해요. */
  importedMeetingIds: string[]
  status: MyJournalStatus
  organized: OrganizedJournal | null
  createdAt: string // YYYY-MM-DD
  updatedAt: string // ISO datetime
  submittedAt?: string // YYYY-MM-DD
  decidedAt?: string // YYYY-MM-DD
  rejectReason?: string
  readCount: number
  helpfulCount: number
}

/** 운영진이 분류한 내 프로젝트 */
export interface MyProject {
  id: string
  title: string
  /** 목록에 쓰는 짧은 이름 (예: 멋사수첩팀) */
  shortName: string
  cohort: number
}

export type PortfolioFormat = 'resume' | 'paragraph'

export interface PortfolioSummary {
  projectId: string
  format: PortfolioFormat
  /** 줄마다 하나. '[결과 수치 입력]'은 화면에서 강조해요. */
  lines: string[]
  heading: string
  journalIds: string[]
  createdAt: string
}
