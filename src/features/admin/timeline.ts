import { store, today } from '@/features/admin/mock/store'
import { MAJOR_EVENT_TYPES } from '@/features/admin/types'
import { daysBetween, formatMonthDay, formatWeekday, parseDate } from '@/lib/date'

/**
 * 운영진이 등록한 일정으로 계산한 프로젝트 진행 상황 (FN-MATCH-01).
 * 아기사자 홈의 주차 · D-day · 다음 정기 세션, 가이드의 이번 주차, 운영진 검토 홈의 D-day 가
 * 모두 이 값을 써서, 일정을 바꾸면 한꺼번에 달라져요. 지금은 목 저장소의 일정을 읽어요.
 */
export type ProjectTimeline = {
  today: string
  /** '10월 27일 화요일' */
  dateLabel: string
  /** 프로젝트 시작일이 지났고 남은 일정이 있으면 진행 중 */
  isProjectActive: boolean
  /** 프로젝트 시작일 기준 주차 (1부터). 시작 전이면 null */
  week: number | null
  /** 다음 큰 행사. 정기 세션은 빼요 */
  nextMajor: { name: string; dday: number } | null
  /** '다음 정기 세션 10/29 (목) · 협업 툴' */
  nextSessionLabel: string | null
}

export function getProjectTimeline(): ProjectTimeline {
  const now = today()
  const events = [...store.events].sort((a, b) => a.date.localeCompare(b.date))
  const start = events.find((e) => e.type === 'PROJECT_START')
  const last = events.at(-1)
  const started = !!start && start.date <= now
  const week = started ? Math.floor(daysBetween(start.date, now) / 7) + 1 : null

  const major = events.find((e) => MAJOR_EVENT_TYPES.includes(e.type) && e.date >= now)
  const session = events.find((e) => e.type === 'SESSION' && e.date >= now)
  const sessionTopic = session?.name.split(':').slice(1).join(':').trim()

  const date = parseDate(now)
  return {
    today: now,
    dateLabel: `${date.getMonth() + 1}월 ${date.getDate()}일 ${formatWeekday(now)}`,
    isProjectActive: started && !!last && last.date >= now,
    week,
    nextMajor: major ? { name: major.name, dday: daysBetween(now, major.date) } : null,
    nextSessionLabel: session
      ? `다음 정기 세션 ${formatMonthDay(session.date)} (${formatWeekday(session.date).charAt(0)})` +
        (sessionTopic ? ` · ${sessionTopic}` : '')
      : null,
  }
}
