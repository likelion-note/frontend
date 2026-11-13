import type { Part, UserType } from '@/features/admin/types'

/** GET /api/me · 로그인 응답의 user */
export type MeResponse = {
  id: number
  name: string
  type: UserType
  cohort: number
  defaultPart: Part | null
  part: Part | null
  project: { id: number; title: string } | null
}

/**
 * POST /api/auth/google · POST /api/auth/signup
 * - REGISTERED : 가입된 계정. accessToken + user
 * - NEED_SIGNUP: 처음 로그인. signupToken(10분) + email → 초대코드 화면으로
 */
export type LoginResponse =
  | { status: 'REGISTERED'; accessToken: string; user: MeResponse }
  | { status: 'NEED_SIGNUP'; signupToken: string; email: string }

/** GET /api/auth/invite-codes/{code} */
export type InviteCodePreview = { cohort: number; userType: UserType }
