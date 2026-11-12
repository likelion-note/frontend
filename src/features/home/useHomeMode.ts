import { useSearchParams } from 'react-router'
import { mockHomeState } from '@/features/home/mock/states'
import { readPreviewState, resolveHomeMode } from '@/features/home/state'
/** 홈과 회의의 접근 조건이 같은 상태 판단을 사용해요. */
export function useHomeMode() {
  const [params] = useSearchParams()
  return resolveHomeMode(
    import.meta.env.DEV ? readPreviewState(params, mockHomeState) : mockHomeState,
  )
}
