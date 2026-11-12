import type { MeetingRecord } from '@/features/meeting/types'

export function localDateString(date = new Date()) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}

export function isCompleteDate(value: unknown): value is string {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false
  const [year, month, day] = value.split('-').map(Number)
  const date = new Date(year, month - 1, day)
  return date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day
}

/** 로컬 날짜의 월요일 00:00부터 다음 월요일 직전까지. 불완전한 날짜는 제외해요. */
export function countThisWeek(records: MeetingRecord[], now = new Date()) {
  const monday = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  monday.setDate(monday.getDate() - ((monday.getDay() + 6) % 7))
  const nextMonday = new Date(monday)
  nextMonday.setDate(nextMonday.getDate() + 7)
  const start = localDateString(monday),
    end = localDateString(nextMonday)
  return records.filter(
    (record) => isCompleteDate(record.date) && record.date >= start && record.date < end,
  ).length
}
