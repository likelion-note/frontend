import { USE_MOCK } from '@/api/client'
import { MOCK_TODAY } from '@/features/admin/mock/data'

/**
 * 지금 시각. 목 모드에서는 목 세계의 오늘(MOCK_TODAY)에 실제 시 · 분 · 초를 붙여서 돌려줘요.
 * 새로 쓴 일지 · 회의 기록의 날짜가 홈의 주차 · D-day · 운영진 일정과 같은 달력을 쓰게 하려는 거예요.
 * 실제 모드에서는 브라우저 시각 그대로예요.
 */
export function now(): Date {
  const real = new Date()
  if (!USE_MOCK) return real
  const [year, month, day] = MOCK_TODAY.split('-').map(Number)
  return new Date(
    year,
    month - 1,
    day,
    real.getHours(),
    real.getMinutes(),
    real.getSeconds(),
    real.getMilliseconds(),
  )
}
