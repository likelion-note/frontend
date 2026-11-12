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
  dueDate: string
}

export interface MeetingRecord {
  id: string
  type: MeetingType
  title: string
  date: string
  decisions: string[]
  actionItems: MeetingActionItem[]
}
