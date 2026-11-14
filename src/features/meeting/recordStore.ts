import { meetingDefinitions } from '@/features/meeting/mock/data'
import { meetingRecords } from '@/features/meeting/mock/records'
import { isCompleteDate } from '@/features/meeting/meetingDates'
import {
  createEmptySummary,
  recordToDraft,
  summaryToRecord,
  weekdays,
} from '@/features/meeting/summaryDraft'
import type { MeetingRecord, MeetingSummaryDraft, MeetingType } from '@/features/meeting/types'
import { isSeedUser, userStorageKey } from '@/lib/currentUser'

/** 회의 정리는 본인만 봐요. 계정마다 따로 보관해요. */
export const recordsStorageKey = 'likelion-meeting-records:v1'
const recordsKey = () => userStorageKey(recordsStorageKey)
const draftKey = (id: string) => `likelion-meeting-summary-draft:${id}`
const object = (value: unknown): value is Record<string, unknown> =>
  !!value && typeof value === 'object'
const knownType = (value: unknown) => meetingDefinitions.some((meeting) => meeting.id === value)
const validDay = (value: unknown) => value === null || weekdays.some((day) => day === value)
function validRecord(value: unknown): value is MeetingRecord {
  return (
    object(value) &&
    typeof value.id === 'string' &&
    knownType(value.type) &&
    typeof value.title === 'string' &&
    isCompleteDate(value.date) &&
    Array.isArray(value.decisions) &&
    value.decisions.every((line) => typeof line === 'string') &&
    Array.isArray(value.actionItems) &&
    value.actionItems.every(
      (row) =>
        object(row) &&
        typeof row.id === 'string' &&
        typeof row.assignee === 'string' &&
        typeof row.task === 'string' &&
        (row.dueDay === undefined || validDay(row.dueDay)) &&
        (row.dueDate === undefined || isCompleteDate(row.dueDate)),
    ) &&
    (value.createdAt === undefined || typeof value.createdAt === 'string') &&
    (value.updatedAt === undefined || typeof value.updatedAt === 'string')
  )
}
function validDraft(value: unknown): value is MeetingSummaryDraft {
  return (
    object(value) &&
    typeof value.id === 'string' &&
    knownType(value.type) &&
    isCompleteDate(value.date) &&
    typeof value.decisionsText === 'string' &&
    Array.isArray(value.actionItems) &&
    value.actionItems.every(
      (row) =>
        object(row) &&
        typeof row.id === 'string' &&
        typeof row.assignee === 'string' &&
        typeof row.task === 'string' &&
        validDay(row.dueDay),
    )
  )
}
function savedRecords(): MeetingRecord[] {
  try {
    const value: unknown = JSON.parse(localStorage.getItem(recordsKey()) ?? '[]')
    if (!Array.isArray(value) || !value.every(validRecord)) throw new Error('Invalid records')
    return value
  } catch {
    throw new Error('회의 기록을 읽지 못했어요. 브라우저 저장소를 확인해 주세요.')
  }
}

export function readMeetingRecords(): MeetingRecord[] {
  // 예시 회의 기록은 예시 계정(데옹)의 것이에요.
  const seeds = isSeedUser() ? meetingRecords : []
  const byId = new Map(seeds.map((record) => [record.id, record]))
  for (const record of savedRecords()) byId.set(record.id, record)
  return structuredClone([...byId.values()]).sort(
    (left, right) =>
      right.date.localeCompare(left.date) ||
      (right.createdAt ?? '').localeCompare(left.createdAt ?? '') ||
      left.id.localeCompare(right.id),
  )
}
export function readMeetingRecord(id: string) {
  return readMeetingRecords().find((record) => record.id === id) ?? null
}

export function persistSummaryDraft(draft: MeetingSummaryDraft) {
  try {
    sessionStorage.setItem(draftKey(draft.id), JSON.stringify(draft))
  } catch {
    throw new Error('작성 중인 내용을 임시 저장하지 못했어요. 브라우저 저장소를 확인해 주세요.')
  }
}
export function startMeetingSummary(type: MeetingType, time?: string) {
  const draft = createEmptySummary(type, time)
  persistSummaryDraft(draft)
  return draft
}
export function readSummaryDraft(id: string): MeetingSummaryDraft | null {
  let raw: string | null = null
  try {
    raw = sessionStorage.getItem(draftKey(id))
  } catch {
    /* 저장된 기록으로 복구를 시도해요. */
  }
  if (raw) {
    try {
      const value: unknown = JSON.parse(raw)
      if (validDraft(value) && value.id === id) return value
    } catch {
      /* 저장된 기록으로 복구해요. */
    }
  }
  const record = readMeetingRecord(id)
  return record ? recordToDraft(record) : null
}
export function writeMeetingSummary(draft: MeetingSummaryDraft): MeetingRecord {
  const existing = readMeetingRecord(draft.id)
  const record = summaryToRecord(draft, existing ?? undefined)
  const saved = savedRecords().filter((item) => item.id !== record.id)
  try {
    localStorage.setItem(recordsKey(), JSON.stringify([...saved, record]))
  } catch {
    throw new Error('회의 기록을 저장하지 못했어요. 저장 공간과 브라우저 권한을 확인해 주세요.')
  }
  // 임시 저장 실패가 이미 완료된 영속 저장을 실패로 되돌리지는 않아요.
  try {
    persistSummaryDraft(recordToDraft(record))
  } catch {
    /* 완료 화면의 기록으로 다시 편집할 수 있어요. */
  }
  return structuredClone(record)
}
