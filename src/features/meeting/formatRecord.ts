import type { MeetingActionItem, MeetingRecord } from '@/features/meeting/types'
import { formatMonthDay, formatWeekday } from '@/lib/date'

export function formatActionItem(item: MeetingActionItem) {
  return `${item.assignee} · ${item.task} (${formatWeekday(item.dueDate).slice(0, 1)})`
}

export function formatRecordForShare(record: MeetingRecord) {
  return [
    '[멋사수첩] 지난 회의 기록',
    '',
    `회의: ${record.title}`,
    `날짜: ${formatMonthDay(record.date)}`,
    '',
    '정한 것',
    ...record.decisions,
    '',
    '누가 언제까지',
    ...record.actionItems.map(formatActionItem),
  ].join('\n')
}
