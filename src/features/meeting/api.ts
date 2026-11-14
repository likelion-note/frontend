import { previousTeamTips } from '@/features/meeting/mock/data'
import {
  readMeetingRecord,
  readMeetingRecords,
  readSummaryDraft,
  removeMeetingRecord,
  writeMeetingSummary,
} from '@/features/meeting/recordStore'
import type {
  MeetingRecord,
  MeetingSummaryDraft,
  PreviousTeamTip,
  SituationId,
} from '@/features/meeting/types'

/** 실제 API 엔드포인트가 정해지면 각 함수의 내부만 교체해요. */
export async function getPreviousTeamTips(situationId: SituationId): Promise<PreviousTeamTip[]> {
  return structuredClone(previousTeamTips.filter((tip) => tip.situationId === situationId))
}
export async function getMeetingRecords(): Promise<MeetingRecord[]> {
  return readMeetingRecords()
}
export async function getMeetingSummaryById(id: string): Promise<MeetingRecord | null> {
  return readMeetingRecord(id)
}
export async function getMeetingSummaryDraft(id: string): Promise<MeetingSummaryDraft | null> {
  return readSummaryDraft(id)
}
export async function saveMeetingSummary(draft: MeetingSummaryDraft): Promise<MeetingRecord> {
  return writeMeetingSummary(draft)
}
/** 회의 기록 지우기 (DELETE /api/meetings/{id}) */
export async function deleteMeetingRecord(id: string): Promise<void> {
  removeMeetingRecord(id)
}
