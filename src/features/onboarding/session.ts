import type { UserType } from '@/features/admin/types'

/**
 * 목 로그인 세션과 온보딩 진행 상태. 탭을 닫으면 사라져요(sessionStorage).
 * 실제 로그인이 붙으면 JWT 보관으로 바꿔요.
 */
export type Session = {
  name: string
  email: string
  cohort: number
  userType: UserType
}

/** 초대코드까지 끝내고 프로필을 적기 전 상태 */
export type OnboardingDraft = {
  email: string
  cohort: number
  userType: UserType
  code: string
}

const SESSION_KEY = 'mutsa.session'
const DRAFT_KEY = 'mutsa.onboarding'

function read<T>(key: string): T | null {
  try {
    const raw = sessionStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : null
  } catch {
    return null
  }
}

function write(key: string, value: unknown) {
  try {
    if (value === null) sessionStorage.removeItem(key)
    else sessionStorage.setItem(key, JSON.stringify(value))
  } catch {
    /* 사생활 보호 모드 등에서는 저장이 안 될 수 있어요 */
  }
}

export const getSession = () => read<Session>(SESSION_KEY)
export const setSession = (session: Session | null) => write(SESSION_KEY, session)

export const getDraft = () => read<OnboardingDraft>(DRAFT_KEY)
export const setDraft = (draft: OnboardingDraft | null) => write(DRAFT_KEY, draft)

/** 계정 유형에 따른 첫 화면 */
export function homePathFor(userType: UserType): string {
  return userType === 'ADMIN' ? '/admin/review' : '/home'
}
