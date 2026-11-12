import { meetingRecords } from '@/features/meeting/mock/records'
import { previousTeamTips } from '@/features/meeting/mock/data'
import type { MeetingRecord, PreviousTeamTip, SituationId } from '@/features/meeting/types'
/** 실제 엔드포인트가 정해지면 이 함수의 구현만 API 요청으로 교체해요. */
export async function getPreviousTeamTips(situationId: SituationId): Promise<PreviousTeamTip[]> {
  return structuredClone(previousTeamTips.filter((tip) => tip.situationId === situationId))
}

/** 목록과 개수의 공통 조회 지점. API 연동 시 이 구현을 교체해요. */
export async function getMeetingRecords(): Promise<MeetingRecord[]> {
  return structuredClone(meetingRecords).sort(
    (left, right) => right.date.localeCompare(left.date) || left.id.localeCompare(right.id),
  )
}
