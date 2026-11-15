import type { UserType } from '@/features/admin/types'

/**
 * 세션·온보딩 진행 상태는 lib/authStorage 에 있어요. 여기서는 그대로 내보내고
 * 온보딩 화면에서 쓰는 도우미만 더해요.
 */
export {
  clearAuth,
  getDraft,
  getSession,
  setDraft,
  setSession,
  type OnboardingDraft,
  type Session,
  type SessionUser,
} from '@/lib/authStorage'

/** 계정 유형에 따른 첫 화면 */
export function homePathFor(userType: UserType): string {
  return userType === 'ADMIN' ? '/admin/review' : '/home'
}
