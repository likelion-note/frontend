import type { UserType } from '@/features/admin/types'

/**
 * 로그인 상태 보관. 접근 토큰은 7일짜리라 localStorage 에 둬요(탭을 닫아도 유지).
 * 온보딩 진행 상태(가입용 토큰)는 10분짜리라 sessionStorage 에 둬요.
 */

export type SessionUser = {
  id: number | string
  name: string
  /** 실제 로그인(REGISTERED)에서는 이메일이 안 와서 비어 있을 수 있어요 */
  email: string | null
  cohort: number
  userType: UserType
  defaultPart?: string | null
  part?: string | null
  project?: { id: number | string; title: string } | null
}

export type Session = {
  /** 목 로그인이면 null */
  accessToken: string | null
  user: SessionUser
}

/** 구글 로그인은 됐지만 아직 가입 전. 초대코드 → 프로필 화면 사이에서만 써요 */
export type OnboardingDraft = {
  email: string
  /** 백엔드가 준 가입용 토큰(10분). 목이면 'mock' */
  signupToken: string
  cohort?: number
  userType?: UserType
  code?: string
}

const SESSION_KEY = 'mutsa.session'
const DRAFT_KEY = 'mutsa.onboarding'

/** 토큰이 만료돼 로그아웃됐을 때 알림 (api/client 가 쏘고, 화면이 들어요) */
export const AUTH_EXPIRED_EVENT = 'mutsa:auth-expired'

function read<T>(storage: Storage, key: string): T | null {
  try {
    const raw = storage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : null
  } catch {
    return null
  }
}

function write(storage: Storage, key: string, value: unknown) {
  try {
    if (value === null) storage.removeItem(key)
    else storage.setItem(key, JSON.stringify(value))
  } catch {
    /* 사생활 보호 모드 등에서는 저장이 안 될 수 있어요 */
  }
}

export const getSession = () => read<Session>(localStorage, SESSION_KEY)
export const setSession = (session: Session | null) => write(localStorage, SESSION_KEY, session)
export const getAccessToken = () => getSession()?.accessToken ?? null

export const getDraft = () => read<OnboardingDraft>(sessionStorage, DRAFT_KEY)
export const setDraft = (draft: OnboardingDraft | null) => write(sessionStorage, DRAFT_KEY, draft)

/** 로그아웃·토큰 만료: 세션과 진행 상태를 모두 지워요 */
export function clearAuth() {
  setSession(null)
  setDraft(null)
}
