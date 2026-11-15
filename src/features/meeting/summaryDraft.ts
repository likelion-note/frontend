import { meetingDefinitions } from '@/features/meeting/mock/data'
import { localDateString } from '@/features/meeting/meetingDates'
import type {
  MeetingRecord,
  MeetingSummaryDraft,
  MeetingType,
  SummaryActionItem,
  Weekday,
} from '@/features/meeting/types'
import { now } from '@/lib/clock'
import { formatWeekday } from '@/lib/date'

export const weekdays: Weekday[] = ['월', '화', '수', '목', '금', '토', '일']
export const newActionItem = (): SummaryActionItem => ({
  id: crypto.randomUUID(),
  assignee: '',
  task: '',
  dueDay: null,
})

export function createEmptySummary(type: MeetingType, time?: string): MeetingSummaryDraft {
  return {
    id: crypto.randomUUID(),
    type,
    date: localDateString(),
    time,
    decisionsText: '',
    actionItems: [newActionItem(), newActionItem()],
  }
}

export function recordToDraft(record: MeetingRecord): MeetingSummaryDraft {
  return {
    id: record.id,
    type: record.type,
    date: record.date,
    time: record.time,
    decisionsText: record.decisions.join('\n'),
    actionItems: record.actionItems.map((item) => ({
      id: item.id,
      assignee: item.assignee,
      task: item.task,
      dueDay:
        item.dueDay ?? (item.dueDate ? (formatWeekday(item.dueDate).slice(0, 1) as Weekday) : null),
    })),
  }
}

export type SummaryErrors = Record<string, string>
export function validateSummary(draft: MeetingSummaryDraft): SummaryErrors {
  const errors: SummaryErrors = {}
  if (!draft.decisionsText.trim()) errors.decisions = '정한 것을 한 줄 이상 적어 주세요.'
  const rows = draft.actionItems.filter(
    (row) => row.assignee.trim() || row.task.trim() || row.dueDay,
  )
  if (!rows.length) errors.actions = '담당 업무를 하나 이상 입력해 주세요.'
  for (const row of rows) {
    if (!row.assignee.trim()) errors[`${row.id}:assignee`] = '담당자를 입력해 주세요.'
    if (!row.task.trim()) errors[`${row.id}:task`] = '할 일을 입력해 주세요.'
    if (!row.dueDay || !weekdays.includes(row.dueDay))
      errors[`${row.id}:dueDay`] = '요일을 선택해 주세요.'
  }
  return errors
}

export function summaryToRecord(
  draft: MeetingSummaryDraft,
  previous?: MeetingRecord,
): MeetingRecord {
  if (Object.keys(validateSummary(draft)).length) throw new Error('입력한 내용을 확인해 주세요.')
  const stamp = now().toISOString()
  return {
    id: draft.id,
    type: draft.type,
    title: meetingDefinitions.find((meeting) => meeting.id === draft.type)!.title,
    date: draft.date,
    time: draft.time,
    decisions: draft.decisionsText.split('\n'),
    actionItems: draft.actionItems
      .filter((row) => row.assignee.trim() || row.task.trim() || row.dueDay)
      .map((row) => ({ ...row })),
    createdAt: previous?.createdAt ?? stamp,
    updatedAt: stamp,
  }
}
