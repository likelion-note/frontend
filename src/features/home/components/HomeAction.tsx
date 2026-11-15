import { Link } from 'react-router'

import type { HomeAction as Action } from '@/features/home/types'

/** 목적지가 준비되지 않은 액션은 비활성화하고, 실제 경로가 생기면 Link로 바꿔요. */
export function HomeAction({ action, className }: { action: Action; className?: string }) {
  return action.to ? (
    <Link to={action.to} className={className}>
      {action.label}
    </Link>
  ) : (
    <button type="button" disabled title="준비 중인 기능입니다" className={className}>
      {action.label}
    </button>
  )
}
