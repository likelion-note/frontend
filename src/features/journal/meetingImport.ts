import { formatActionItem } from '@/features/meeting/formatRecord'
import { isCompleteDate, localDateString } from '@/features/meeting/meetingDates'
import type { MeetingRecord } from '@/features/meeting/types'
import type { MyJournal } from '@/features/journal/types'
import { now } from '@/lib/clock'
import { formatMonthDay } from '@/lib/date'

/**
 * '이번 주 회의 불러오기'. 회의 도우미에서 정리한 기록 중 이번 주(월~일, 브라우저 날짜) 것만 써요.
 * 회의 정리 완료 화면의 주간 개수(countThisWeek)와 같은 기준이에요.
 */
export function thisWeekMeetings(records: MeetingRecord[], current = now()) {
  const monday = new Date(current.getFullYear(), current.getMonth(), current.getDate())
  monday.setDate(monday.getDate() - ((monday.getDay() + 6) % 7))
  const nextMonday = new Date(monday)
  nextMonday.setDate(nextMonday.getDate() + 7)
  const start = localDateString(monday)
  const end = localDateString(nextMonday)
  return records
    .filter((record) => isCompleteDate(record.date) && record.date >= start && record.date < end)
    .sort((left, right) => left.date.localeCompare(right.date))
}

/** '아이디어 회의 10/21 · 중간 점검 회의 10/23' */
export const meetingsLabel = (records: MeetingRecord[]) =>
  records.map((record) => `${record.title} ${formatMonthDay(record.date)}`).join(' · ')

/**
 * 정한 것은 '어떻게 넘겼나'에, 할 일은 '자유 메모'에 이어 붙여요.
 * 이미 불러온 회의는 건너뛰어서 두 번 눌러도 같은 내용이 쌓이지 않아요.
 */
export function importMeetings(journal: MyJournal, records: MeetingRecord[]): MyJournal {
  const fresh = records.filter((record) => !journal.importedMeetingIds.includes(record.id))
  if (!fresh.length) return journal
  const decisions = fresh.flatMap((record) => record.decisions.filter((line) => line.trim()))
  const tasks = fresh.flatMap((record) =>
    record.actionItems.map((item) => `${record.title}: ${formatActionItem(item)}`),
  )
  const join = (current: string, lines: string[]) =>
    [current.trim(), ...lines].filter(Boolean).join('\n')
  return {
    ...journal,
    body: {
      ...journal.body,
      overcame: join(journal.body.overcame, decisions),
      memo: join(journal.body.memo, tasks),
    },
    importedMeetingIds: [...journal.importedMeetingIds, ...fresh.map((record) => record.id)],
  }
}
