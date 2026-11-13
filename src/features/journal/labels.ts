import { EVENT_TYPE_LABEL, PART_LABEL } from '@/features/admin/types'
import type { AssignedPart } from '@/features/assignment/types'
import { phaseLabel } from '@/features/note/noteFilters'
import type {
  JournalEventType,
  JournalPhase,
  MyJournal,
  MyProject,
  PortfolioFormat,
} from '@/features/journal/types'
import { formatMonthDay } from '@/lib/date'

export const journalEventTypes: JournalEventType[] = [
  'SESSION',
  'IDEATHON',
  'HACKATHON',
  'MIDTERM',
  'DEMODAY',
  'ETC',
]
export const eventLabel = (type: JournalEventType) => EVENT_TYPE_LABEL[type]

/** 쓰기 화면의 시점 칩. 노트 게시판과 같은 단위에 '행사'를 붙여요. */
export const journalPhases: { id: JournalPhase; label: string }[] = [
  { id: 'early', label: '행사 2주 이상 전' },
  { id: 'soon', label: '행사 1~2주 전' },
  { id: 'event-week', label: '행사 주간' },
  { id: 'after', label: '행사 후' },
]

export const journalParts: AssignedPart[] = ['PM', 'DESIGN', 'FRONTEND', 'BACKEND']
export const partLabel = (part: AssignedPart) => PART_LABEL[part]

/** 공개 범위 이름. 'NOW'는 같은 기수, 'NEXT'는 다음 기수부터예요. */
export const scopeTitle = (scope: MyJournal['scope'], cohort: number) =>
  scope === 'NOW' ? `지금 ${cohort}기에게 공개` : `${cohort + 1}기부터 공개`

/** 상태 알약 문구와 색. 피그마 내 기록 목록 기준이에요. */
export function journalStatusPill(journal: Pick<MyJournal, 'status' | 'scope' | 'cohort'>) {
  switch (journal.status) {
    case 'PENDING':
      return { label: '검토 대기', className: 'text-note-ink bg-[#fce6b2]' }
    case 'REJECTED':
      return { label: '돌려받음', className: 'bg-rose-2 text-danger' }
    case 'APPROVED':
      return {
        label:
          journal.scope === 'NOW'
            ? `${journal.cohort}기 공개 중`
            : `${journal.cohort + 1}기부터 공개`,
        className: 'bg-accent-soft text-accent-deep',
      }
    default:
      return { label: '작성 중', className: 'bg-beige text-beige-ink' }
  }
}

/** 목록 · 상세 제목. 정리 전이면 막힌 것의 첫 줄을 써요. */
export function journalTitle(journal: MyJournal) {
  if (journal.organized?.title) return journal.organized.title
  const first = journal.body.stuck.split('\n')[0].trim()
  return first ? (first.length > 28 ? `${first.slice(0, 28)}…` : first) : '제목 없는 일지'
}

/** 검토 요청한 날, 없으면 마지막으로 고친 날 */
export const journalDate = (journal: MyJournal) =>
  journal.submittedAt ?? journal.updatedAt.slice(0, 10)

/** '멋사수첩팀 · 10/26' */
export function journalMeta(journal: MyJournal, projects: MyProject[]) {
  const project = projects.find((item) => item.id === journal.projectId)
  return [project?.shortName, formatMonthDay(journalDate(journal))].filter(Boolean).join(' · ')
}

/** 공개되면 노트 카드에 붙는 표기. '14기 · PM · 중간발표 1~2주 전' / '지난 기수 A팀 · PM · …' */
export function anonymousLabel(journal: MyJournal) {
  const who = journal.scope === 'NOW' ? `${journal.cohort}기` : '지난 기수 A팀'
  const when =
    journal.eventType && journal.phase
      ? `${eventLabel(journal.eventType)} ${phaseLabel(journal.phase)}`
      : null
  return [who, journal.part && partLabel(journal.part), when].filter(Boolean).join(' · ')
}

export const portfolioFormats: { value: PortfolioFormat; label: string }[] = [
  { value: 'resume', label: '이력서용 3줄' },
  { value: 'paragraph', label: '경험 기술 문단' },
]
export const formatLabel = (format: PortfolioFormat) =>
  portfolioFormats.find((item) => item.value === format)?.label ?? ''
