import { useQueryClient } from '@tanstack/react-query'
import { useCallback } from 'react'

import { adminKeys } from '@/features/admin/queries'

/** 운영진 데이터가 바뀐 뒤 화면 전체를 다시 불러와요 (탭 배지 포함) */
export function useInvalidateAdmin() {
  const queryClient = useQueryClient()
  return useCallback(
    () => queryClient.invalidateQueries({ queryKey: adminKeys.all }),
    [queryClient],
  )
}
