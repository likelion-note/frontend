import type { MeetingActionItem, MeetingRecord } from '@/features/meeting/types'
import { formatMonthDay, formatWeekday } from '@/lib/date'

export function formatActionItem(item: MeetingActionItem) {
  const day = item.dueDay ?? (item.dueDate ? formatWeekday(item.dueDate).slice(0, 1) : '미정')
  return `${item.assignee} · ${item.task} (${day})`
}

/** 완료 화면과 지난 회의가 같은 원문을 공유해요. 입력한 줄바꿈을 유지합니다. */
export function formatRecordForShare(record: MeetingRecord) {
  return [
    `[멋사수첩] ${record.title} · ${formatMonthDay(record.date)}`,
    '',
    '정한 것',
    ...record.decisions,
    '',
    '누가 언제까지',
    ...record.actionItems.map(formatActionItem),
  ].join('\n')
}
