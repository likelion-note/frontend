import { Navigate } from 'react-router'

import { getSession, homePathFor } from '@/features/onboarding/session'

/** 첫 화면: 로그인했으면 계정 유형에 맞는 홈, 아니면 온보딩 */
export function RootRedirect() {
  const session = getSession()
  return <Navigate to={session ? homePathFor(session.userType) : '/onboarding'} replace />
}
