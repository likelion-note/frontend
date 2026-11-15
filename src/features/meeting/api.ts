import { api, ApiError, USE_MOCK } from '@/api/client'
import { toId } from '@/api/codes'
import { previousTeamTips } from '@/features/meeting/mock/data'
import {
  readMeetingRecord,
  readMeetingRecords,
  readSummaryDraft,
  removeMeetingRecord,
  writeMeetingSummary,
} from '@/features/meeting/recordStore'
import { recordToDraft, summaryToRecord, weekdays } from '@/features/meeting/summaryDraft'
import type {
  MeetingRecord,
  MeetingSummaryDraft,
  MeetingType,
  PreviousTeamTip,
  SituationId,
  Weekday,
} from '@/features/meeting/types'

/**
 * 회의 도우미 API.
 * - 목 모드: 브라우저 저장소(recordStore)
 * - 실제 모드: /api/meetings (저장 · 목록 · 상세 · 삭제). 질문과 막힐 때 팁은 화면에 들어 있는 내용을 써요
 *
 * 작성 중인 내용(임시 저장)은 두 모드 모두 이 탭(sessionStorage)에만 둬요.
 */

/* ---------- 실제 서버 ---------- */

type ApiMeetingType = 'FIRST' | 'IDEA' | 'CHECK' | 'RETRO'
const API_TYPE: Record<MeetingType, ApiMeetingType> = {
  first: 'FIRST',
  idea: 'IDEA',
  'check-in': 'CHECK',
  retrospective: 'RETRO',
}
const typeOf = (value: ApiMeetingType): MeetingType =>
  (Object.keys(API_TYPE) as MeetingType[]).find((key) => API_TYPE[key] === value) ?? 'first'

type MeetingDto = {
  id: number
  type: ApiMeetingType
  typeLabel: string
  meetingDate: string
  decisions: string[]
  actions: { who: string | null; what: string | null; due: string | null }[]
}

const toRecord = (dto: MeetingDto): MeetingRecord => ({
  id: toId(dto.id),
  type: typeOf(dto.type),
  title: dto.typeLabel,
  date: dto.meetingDate,
  decisions: dto.decisions,
  actionItems: dto.actions.map((action, index) => ({
    id: `${dto.id}-${index}`,
    assignee: action.who ?? '',
    task: action.what ?? '',
    dueDay: weekdays.includes(action.due as Weekday) ? (action.due as Weekday) : null,
  })),
})

const isServerId = (id: string) => /^\d+$/.test(id)

async function fetchRecord(id: string): Promise<MeetingRecord | null> {
  if (!isServerId(id)) return null
  try {
    return toRecord(await api.get<MeetingDto>(`/api/meetings/${id}`))
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) return null
    throw error
  }
}

/* ---------- 화면이 부르는 함수 ---------- */

/** 막힐 때 팁 아래의 지난 기수 이야기. 화면에 들어 있는 내용이에요 */
export async function getPreviousTeamTips(situationId: SituationId): Promise<PreviousTeamTip[]> {
  return structuredClone(previousTeamTips.filter((tip) => tip.situationId === situationId))
}

export async function getMeetingRecords(): Promise<MeetingRecord[]> {
  if (USE_MOCK) return readMeetingRecords()
  const list = (await api.get<MeetingDto[]>('/api/meetings')).map(toRecord)
  return list.sort(
    (left, right) => right.date.localeCompare(left.date) || Number(right.id) - Number(left.id),
  )
}

export async function getMeetingSummaryById(id: string): Promise<MeetingRecord | null> {
  if (USE_MOCK) return readMeetingRecord(id)
  return fetchRecord(id)
}

export async function getMeetingSummaryDraft(id: string): Promise<MeetingSummaryDraft | null> {
  // 쓰던 내용이 이 탭에 남아 있으면 그걸 이어서 써요 (목 모드는 저장된 기록도 찾아봐요)
  const local = readSummaryDraft(id)
  if (USE_MOCK || local) return local
  const record = await fetchRecord(id)
  return record ? recordToDraft(record) : null
}

export async function saveMeetingSummary(draft: MeetingSummaryDraft): Promise<MeetingRecord> {
  if (USE_MOCK) return writeMeetingSummary(draft)
  // 목 모드와 같은 검사를 거쳐요 (비어 있으면 여기서 오류를 던져요)
  const checked = summaryToRecord(draft)
  const saved = toRecord(
    await api.post<MeetingDto>('/api/meetings', {
      type: API_TYPE[draft.type],
      meetingDate: draft.date,
      decisions: checked.decisions.map((line) => line.trim()).filter(Boolean),
      actions: checked.actionItems.map((item) => ({
        who: item.assignee.trim(),
        what: item.task.trim(),
        due: item.dueDay ?? '',
      })),
    }),
  )
  // 서버에는 고치기가 없어서, 저장된 기록을 고친 거라면 새로 저장한 뒤 예전 기록을 지워요
  if (isServerId(draft.id) && draft.id !== saved.id) {
    await api.delete(`/api/meetings/${draft.id}`).catch(() => undefined)
  }
  return saved
}

/** 회의 기록 지우기 (DELETE /api/meetings/{id}) */
export async function deleteMeetingRecord(id: string): Promise<void> {
  if (USE_MOCK) {
    removeMeetingRecord(id)
    return
  }
  await api.delete(`/api/meetings/${id}`)
}
