import { useQuery } from '@tanstack/react-query'

import { getMeetingRecords } from '@/features/meeting/api'

/** 메인 헤더의 기록 수와 지난 회의 목록이 같은 조회 결과를 사용해요. */
export function useMeetingRecords(enabled = true) {
  return useQuery({ queryKey: ['meeting', 'records'], queryFn: getMeetingRecords, enabled })
}
