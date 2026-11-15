import { USE_MOCK } from '@/api/client'
import { store, today } from '@/features/admin/mock/store'
import { MAJOR_EVENT_TYPES, type EventType, type ScheduleEvent } from '@/features/admin/types'
import { daysBetween, formatMonthDay, formatWeekday, parseDate } from '@/lib/date'

/**
 * 운영진이 등록한 일정으로 계산한 프로젝트 진행 상황 (FN-MATCH-01).
 * 아기사자 홈의 주차 · D-day · 다음 정기 세션, 가이드의 이번 주차, 운영진 검토 홈의 D-day 가
 * 모두 이 값을 써서, 일정을 바꾸면 한꺼번에 달라져요.
 * - 목 모드: 목 저장소의 일정으로 그때그때 계산해요
 * - 실제 모드: 서버가 계산해 준 값(아기사자는 /api/home, 운영진은 /api/admin/events)을 받아 두고 읽어요
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

const pad = (value: number) => String(value).padStart(2, '0')
const realToday = () => {
  const date = new Date()
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`
}
const dateLabelOf = (day: string) => {
  const date = parseDate(day)
  return `${date.getMonth() + 1}월 ${date.getDate()}일 ${formatWeekday(day)}`
}
/** '정기 세션: 협업 툴' (10/29) → '다음 정기 세션 10/29 (목) · 협업 툴' */
function sessionLabel(name: string, date: string) {
  const topic = name.split(':').slice(1).join(':').trim()
  return (
    `다음 정기 세션 ${formatMonthDay(date)} (${formatWeekday(date).charAt(0)})` +
    (topic ? ` · ${topic}` : '')
  )
}

/** 일정 목록과 오늘 날짜로 계산해요 */
export function timelineFromEvents(list: ScheduleEvent[], now = realToday()): ProjectTimeline {
  const events = [...list].sort((a, b) => a.date.localeCompare(b.date))
  const start = events.find((e) => e.type === 'PROJECT_START')
  const last = events.at(-1)
  const started = !!start && start.date <= now
  const week = started ? Math.floor(daysBetween(start.date, now) / 7) + 1 : null

  const major = events.find((e) => MAJOR_EVENT_TYPES.includes(e.type) && e.date >= now)
  const session = events.find((e) => e.type === 'SESSION' && e.date >= now)

  return {
    today: now,
    dateLabel: dateLabelOf(now),
    isProjectActive: started && !!last && last.date >= now,
    week,
    nextMajor: major ? { name: major.name, dday: daysBetween(now, major.date) } : null,
    nextSessionLabel: session ? sessionLabel(session.name, session.date) : null,
  }
}

/** GET /api/home 의 stage (서버가 계산한 현재 단계) */
export type StageDto = {
  week: number | null
  stage: string | null
  timing: string | null
  dday: { name: string; type: EventType; date: string; daysLeft: number } | null
  nextSession: { name: string; date: string } | null
  inProjectPeriod: boolean
}

/** 서버가 계산해 준 단계를 화면에서 쓰는 모양으로 바꿔요 */
export function timelineFromStage(stage: StageDto): ProjectTimeline {
  // 서버의 오늘은 D-day 날짜에서 남은 날을 빼면 알 수 있어요. 남은 행사가 없으면 브라우저 날짜를 써요.
  let now = realToday()
  if (stage.dday) {
    const date = parseDate(stage.dday.date)
    date.setDate(date.getDate() - stage.dday.daysLeft)
    now = `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`
  }
  return {
    today: now,
    dateLabel: dateLabelOf(now),
    isProjectActive: stage.inProjectPeriod,
    week: stage.week,
    nextMajor: stage.dday ? { name: stage.dday.name, dday: stage.dday.daysLeft } : null,
    nextSessionLabel: stage.nextSession
      ? sessionLabel(stage.nextSession.name, stage.nextSession.date)
      : null,
  }
}

/** 실제 모드에서 서버에서 받아 둔 값. 배정 정보를 불러올 때(assignment/api.ts) 같이 채워요 */
let realTimeline: ProjectTimeline | null = null
export function setRealTimeline(timeline: ProjectTimeline | null) {
  realTimeline = timeline
}

export function getProjectTimeline(): ProjectTimeline {
  if (!USE_MOCK) return realTimeline ?? timelineFromEvents([])
  return timelineFromEvents(store.events, today())
}
