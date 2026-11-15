export type MeetingType = 'first' | 'idea' | 'check-in' | 'retrospective'
export type SituationId = 'consensus' | 'participation' | 'scope'
export interface MeetingQuestion {
  id: string
  title: string
  description: string
}
export interface MeetingDefinition {
  id: MeetingType
  label: string
  title: string
  questions: MeetingQuestion[]
}
export interface HelpSituation {
  id: SituationId
  title: string
  source: string
  steps: string[]
}
export interface PreviousTeamTip {
  id: string
  situationId: SituationId
  title: string
  author: string
  content: string
  excerpt: string
  handwritten?: boolean
  viewCount: number
  helpfulCount: number
  tags: string[]
}
export interface MeetingDraft {
  type: MeetingType
  time: string
  completed: Record<MeetingType, string[]>
}

export interface MeetingActionItem {
  id: string
  assignee: string
  task: string
  dueDate?: string
  dueDay?: Weekday | null
}

export interface MeetingRecord {
  id: string
  type: MeetingType
  title: string
  date: string
  time?: string
  createdAt?: string
  updatedAt?: string
  decisions: string[]
  actionItems: MeetingActionItem[]
}

export type Weekday = '월' | '화' | '수' | '목' | '금' | '토' | '일'
export interface SummaryActionItem {
  id: string
  assignee: string
  task: string
  dueDay: Weekday | null
}
export interface MeetingSummaryDraft {
  id: string
  type: MeetingType
  date: string
  time?: string
  decisionsText: string
  actionItems: SummaryActionItem[]
}
