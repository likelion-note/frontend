export type HomeMode = 'before-part-assignment' | 'project-active' | 'project-inactive'

export interface HomeAction {
  label: string
  /** 실제 목적지 화면을 구현한 뒤 경로를 연결해요. */
  to?: string
}

export interface Todo {
  id: string
  title: string
  isCompleted: boolean
  dueLabel: string
  isDueToday?: boolean
  action?: HomeAction
}

export interface ArchiveNote {
  id: string
  context: string
  title: string
  author: string
  excerpt: string
  handwritten?: boolean
  handwrittenImage?: { src: string; width: number; height: number }
  readCount: number
  helpfulCount: number
  tag: string
  to?: string
}

export interface HomeData {
  mode: HomeMode
  user: HomeUser
  project: {
    dateLabel: string
    week: number
    daysUntilPresentation: number
    presentationLabel: string
    nextSession: string
  }
  returnedJournal: { count: number; description: string; action: HomeAction }
  todos: Todo[]
  todosAction: HomeAction
  staffMessage: { week: number; text: string; helpfulCount: number; isHelpful: boolean }
  journalAction: HomeAction
  noteStats: { cohort: number; readCount: number; helpfulCount: number; publicCount: number }
  archiveAction: HomeAction
  archiveNotes: ArchiveNote[]
}

export interface HomeState {
  isPartAssigned: boolean
  isProjectActive: boolean
}

export interface HomeUser {
  initial: string
  cohortLabel: string
  part: string | null
  team: string | null
  assignmentLabel?: string
}

export interface BeforePartHomeData {
  user: HomeUser
  project: HomeData['project']
  assignment: { title: string; description: string }
  journal: { action: HomeAction; description: string }
  archiveAction: HomeAction
  archiveNotes: ArchiveNote[]
}

export interface InactiveHomeData {
  user: HomeUser
  title: string
  description: string
  action: HomeAction
}
