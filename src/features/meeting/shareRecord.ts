import { formatRecordForShare } from '@/features/meeting/formatRecord'
import type { MeetingRecord } from '@/features/meeting/types'

export type ShareResult = 'shared' | 'copied' | 'cancelled'

/** URL 생성이나 업로드 없이 사용자가 선택한 기록의 텍스트만 전달해요. */
export async function shareMeetingRecord(record: MeetingRecord): Promise<ShareResult> {
  const payload: ShareData = {
    title: `[멋사수첩] ${record.title}`,
    text: formatRecordForShare(record),
  }
  if (navigator.share && (!navigator.canShare || navigator.canShare(payload))) {
    try {
      await navigator.share(payload)
      return 'shared'
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') return 'cancelled'
      // 공유 권한이 없거나 지원하지 않는 데이터이면 복사를 시도해요.
    }
  }
  await copyMeetingRecord(record)
  return 'copied'
}

/** 완료 화면은 Web Share를 열지 않고 클립보드 복사를 기본 동작으로 사용해요. */
export async function copyMeetingRecord(record: MeetingRecord): Promise<void> {
  if (!navigator.clipboard?.writeText)
    throw new Error('이 브라우저에서는 클립보드 복사를 사용할 수 없어요.')
  try {
    await navigator.clipboard.writeText(formatRecordForShare(record))
  } catch {
    throw new Error('회의 내용을 복사하지 못했어요. 클립보드 권한을 확인해 주세요.')
  }
}
