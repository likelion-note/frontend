export type NotePart = 'PM' | 'DESIGN' | 'FRONTEND' | 'BACKEND' | 'STAFF'
/** 행사 기준 시점. 시점 필터와 같은 단위예요. */
export type NotePhase = 'early' | 'soon' | 'event-week' | 'after'
export type NoteCohortFilter = 'all' | 'past' | 'current'
export type NoteSort = 'latest' | 'helpful' | 'read'

export interface NoteSections {
  /** 막혔던 것 */
  stuck: string
  /** 이렇게 넘겼어요 */
  solved: string
  /** 다시 한다면 */
  retry: string
}

export interface Note {
  id: string
  cohort: number
  /** 지난 기수만 'F팀'처럼 팀 이름을 보여줘요. 이름·프로젝트 id는 넣지 않아요. */
  team?: string
  part: NotePart
  /** 정기 세션 · 중간발표 · 해커톤 같은 기준 행사 */
  event: string
  phase: NotePhase
  title: string
  excerpt: string
  /** 손글씨 인용으로 보여줄 카드. 이미지가 없으면 excerpt를 텍스트로 그려요. */
  handwrittenImage?: { src: string; width: number; height: number }
  tags: string[]
  sections: NoteSections
  readCount: number
  helpfulCount: number
  createdAt: string
}

export interface NoteFilters {
  query: string
  cohort: NoteCohortFilter
  part: NotePart | 'all'
  phase: NotePhase | 'all'
  tag: string | null
  sort: NoteSort
}
