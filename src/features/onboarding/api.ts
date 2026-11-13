import { api, USE_MOCK } from '@/api/client'
import { MOCK_TODAY } from '@/features/admin/mock/data'
import { nextId, store } from '@/features/admin/mock/store'
import type { UserType } from '@/features/admin/types'
import type { InviteCodePreview, LoginResponse, MeResponse } from '@/features/onboarding/types'
import type { Session, SessionUser } from '@/lib/authStorage'
import { delay } from '@/lib/delay'

/**
 * 온보딩 API.
 * - VITE_USE_MOCK=false: 실제 백엔드 (구글 ID 토큰 → POST /api/auth/google …)
 * - 그 외: 목. 계정 선택 시트에서 고른 계정으로 로그인을 흉내 내고, 초대코드는 운영진 탭의 목 데이터로 확인해요
 */

/* ---------- 공통 타입 ---------- */

export type LoginResult =
  | { status: 'REGISTERED'; session: Session }
  | { status: 'NEED_SIGNUP'; email: string; signupToken: string }

export type LoginInput = { idToken: string } | { mockAccountId: string }

export type SignupInput = {
  signupToken: string
  inviteCode: string
  name: string
  /** 목에서 멤버 목록에 넣을 때 써요 */
  email: string
}

function sessionFromMe(accessToken: string | null, me: MeResponse, email: string | null): Session {
  const user: SessionUser = {
    id: me.id,
    name: me.name,
    email,
    cohort: me.cohort,
    userType: me.type,
    defaultPart: me.defaultPart,
    part: me.part,
    project: me.project,
  }
  return { accessToken, user }
}

/* ---------- 목 계정 ---------- */

export type MockAccount = {
  id: string
  name: string
  email: string
  /** new: 처음 로그인 · member: 가입한 아기사자 · admin: 가입한 운영진 */
  status: 'new' | 'member' | 'admin'
}

export const mockAccounts: MockAccount[] = [
  { id: 'new', name: '새 아기사자', email: 'new.lion14@gmail.com', status: 'new' },
  { id: 'u-deong', name: '데옹', email: 'deo***@gmail.com', status: 'member' },
  { id: 'admin-1', name: '하린', email: 'harin.lion14@gmail.com', status: 'admin' },
]

const mockSession = (
  id: string,
  name: string,
  email: string,
  cohort: number,
  userType: UserType,
): Session => ({ accessToken: null, user: { id, name, email, cohort, userType } })

/* ---------- 1. 구글 로그인 ---------- */

export async function loginWithGoogle(input: LoginInput): Promise<LoginResult> {
  if ('idToken' in input) {
    const res = await api.post<LoginResponse>('/api/auth/google', { idToken: input.idToken })
    if (res.status === 'NEED_SIGNUP') {
      return { status: 'NEED_SIGNUP', email: res.email, signupToken: res.signupToken }
    }
    return { status: 'REGISTERED', session: sessionFromMe(res.accessToken, res.user, null) }
  }

  await delay(400)
  const account = mockAccounts.find((a) => a.id === input.mockAccountId)
  if (!account) throw new Error('계정을 찾을 수 없어요')
  if (account.status === 'new') {
    return { status: 'NEED_SIGNUP', email: account.email, signupToken: 'mock' }
  }
  return {
    status: 'REGISTERED',
    session: mockSession(
      account.id,
      account.name,
      account.email,
      14,
      account.status === 'admin' ? 'ADMIN' : 'MEMBER',
    ),
  }
}

/* ---------- 2. 초대코드 확인 ---------- */

/** 6자리 코드 확인. 없는 코드·꺼진 코드·만료된 코드는 에러 (문구는 백엔드와 같아요) */
export async function verifyInviteCode(code: string): Promise<InviteCodePreview> {
  const upper = code.trim().toUpperCase()
  if (!USE_MOCK) {
    return api.get<InviteCodePreview>(`/api/auth/invite-codes/${encodeURIComponent(upper)}`)
  }

  await delay(300)
  const found = store.inviteCodes.find((c) => c.code === upper)
  if (!found) throw new Error('코드를 다시 확인해 주세요')
  if (!found.enabled || found.expiresAt < MOCK_TODAY) throw new Error('사용이 끝난 코드예요')
  return { cohort: found.cohort, userType: found.userType }
}

/* ---------- 3. 가입 ---------- */

export async function signup(input: SignupInput): Promise<Session> {
  const name = input.name.trim()
  if (!name) throw new Error('이름이나 닉네임을 적어 주세요')
  if (name.length > 30) throw new Error('30자 안으로 적어 주세요')

  if (!USE_MOCK) {
    const res = await api.post<LoginResponse>('/api/auth/signup', {
      signupToken: input.signupToken,
      inviteCode: input.inviteCode,
      name,
    })
    if (res.status !== 'REGISTERED') throw new Error('가입 처리에 실패했어요. 다시 시도해 주세요')
    return sessionFromMe(res.accessToken, res.user, input.email)
  }

  await delay(400)
  const code = store.inviteCodes.find((c) => c.code === input.inviteCode)
  if (!code) throw new Error('코드를 다시 확인해 주세요')
  code.usedCount += 1

  const id = nextId('u')
  if (code.userType === 'MEMBER') {
    store.members.unshift({
      id,
      name,
      email: input.email.replace(/^(.{3}).*(@.*)$/, '$1***$2'),
      part: null,
      projectId: null,
      joinedAt: `${MOCK_TODAY}T11:30:00`,
      type: 'MEMBER',
    })
  }
  return mockSession(id, name, input.email, code.cohort, code.userType)
}

/* ---------- 4. 내 정보 ---------- */

export async function fetchMe(): Promise<MeResponse> {
  return api.get<MeResponse>('/api/me')
}
