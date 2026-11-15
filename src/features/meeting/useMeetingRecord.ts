import { useQuery } from '@tanstack/react-query'
import { getMeetingSummaryById } from '@/features/meeting/api'
export function useMeetingRecord(id: string, enabled = true) {
  return useQuery({
    queryKey: ['meeting', 'record', id],
    queryFn: () => getMeetingSummaryById(id),
    enabled,
  })
}
