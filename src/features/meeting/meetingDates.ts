import type { MeetingRecord } from '@/features/meeting/types'
import { now } from '@/lib/clock'

/** 로컬 날짜(YYYY-MM-DD). 날짜를 안 주면 오늘이에요 (목 모드에서는 목 세계의 오늘) */
export function localDateString(date = now()) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}

export function isCompleteDate(value: unknown): value is string {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false
  const [year, month, day] = value.split('-').map(Number)
  const date = new Date(year, month - 1, day)
  return date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day
}

/** 로컬 날짜의 월요일 00:00부터 다음 월요일 직전까지. 불완전한 날짜는 제외해요. */
export function countThisWeek(records: MeetingRecord[], current = now()) {
  const monday = new Date(current.getFullYear(), current.getMonth(), current.getDate())
  monday.setDate(monday.getDate() - ((monday.getDay() + 6) % 7))
  const nextMonday = new Date(monday)
  nextMonday.setDate(nextMonday.getDate() + 7)
  const start = localDateString(monday),
    end = localDateString(nextMonday)
  return records.filter(
    (record) => isCompleteDate(record.date) && record.date >= start && record.date < end,
  ).length
}
