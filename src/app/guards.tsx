import { Navigate, Outlet } from 'react-router'

import type { UserType } from '@/features/admin/types'
import { homePathFor } from '@/features/onboarding/session'
import { getSession } from '@/lib/authStorage'

/** 로그인해야 들어갈 수 있는 화면. 세션이 없으면 온보딩으로 보내요 */
export function RequireAuth() {
  return getSession() ? <Outlet /> : <Navigate to="/onboarding" replace />
}

/**
 * 계정 유형별 화면. 아기사자는 운영진 화면(검토 · 멤버 · 운영)에, 운영진은 아기사자 화면
 * (홈 · 가이드 · 회의)에 들어갈 수 없어요. 맞지 않으면 자기 첫 화면으로 보내요.
 */
export function RequireRole({ role }: { role: UserType }) {
  const session = getSession()
  if (!session) return <Navigate to="/onboarding" replace />
  if (session.user.userType !== role) {
    return <Navigate to={homePathFor(session.user.userType)} replace />
  }
  return <Outlet />
}

/** 로그인 전에만 보는 화면(온보딩). 이미 로그인했으면 자기 첫 화면으로 보내요 */
export function GuestOnly() {
  const session = getSession()
  return session ? <Navigate to={homePathFor(session.user.userType)} replace /> : <Outlet />
}
