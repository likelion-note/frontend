import type { PillTone } from '@/components/ui/Pill'
import type { JournalStatus, Scope } from '@/features/admin/types'
import { formatMonthDay } from '@/lib/date'

/** 공개 범위 글자. 예) 지금 14기에게 공개 · 15기부터 공개 */
export function scopeLabel(scope: Scope, cohort: number): string {
  return scope === 'NOW' ? `지금 ${cohort}기에게 공개` : `${cohort + 1}기부터 공개`
}

export function scopeTone(scope: Scope): PillTone {
  return scope === 'NOW' ? 'orange' : 'beige'
}

/** 예) 10/27 제출 */
export function submittedLabel(date: string): string {
  return `${formatMonthDay(date)} 제출`
}

export const STATUS_LABEL: Record<Exclude<JournalStatus, 'PENDING'>, string> = {
  APPROVED: '승인',
  REJECTED: '돌려보냄',
}

export const STATUS_TONE: Record<Exclude<JournalStatus, 'PENDING'>, PillTone> = {
  APPROVED: 'orange',
  REJECTED: 'rose2',
}

/** 돌려보내기 시트의 자주 쓰는 사유 */
export const REJECT_PRESETS = [
  '어떻게 넘겼는지가 짧아요. 실제로 바꾼 행동을 한두 줄 더 적어 주세요.',
  '다른 사람이 누군지 알 수 있는 내용이 있어요. 그 부분을 빼 주세요.',
  '프로젝트에서 겪은 일과 관련이 적어요. 막혔던 장면을 더 구체적으로 적어 주세요.',
]
