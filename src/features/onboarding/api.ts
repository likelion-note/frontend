import { MOCK_TODAY } from '@/features/admin/mock/data'
import { nextId, store } from '@/features/admin/mock/store'
import type { UserType } from '@/features/admin/types'
import { delay } from '@/lib/delay'

/**
 * 온보딩 API. 지금은 목이에요.
 * - 구글 로그인: 계정 선택 시트에서 고른 계정으로 흉내 내요 (실제로는 GIS ID 토큰을 백엔드로 보내요)
 * - 초대코드: 운영진 탭의 초대코드 목 데이터로 검증해요
 * - 가입 완료: 멤버 목 데이터에 "배정 전" 으로 추가돼요
 */

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

export type LoginResult =
  | { isNew: true; email: string }
  | { isNew: false; email: string; name: string; cohort: number; userType: UserType }

export async function loginWithGoogle(accountId: string): Promise<LoginResult> {
  await delay(400)
  const account = mockAccounts.find((a) => a.id === accountId)
  if (!account) throw new Error('계정을 찾을 수 없어요')
  if (account.status === 'new') return { isNew: true, email: account.email }
  return {
    isNew: false,
    email: account.email,
    name: account.name,
    cohort: 14,
    userType: account.status === 'admin' ? 'ADMIN' : 'MEMBER',
  }
}

export type InviteCodeCheck = { cohort: number; userType: UserType }

/** 6자리 코드 확인. 없는 코드·꺼진 코드·만료된 코드는 에러 */
export async function verifyInviteCode(code: string): Promise<InviteCodeCheck> {
  await delay(300)
  const found = store.inviteCodes.find((c) => c.code === code.toUpperCase())
  if (!found) throw new Error('코드를 다시 확인해 주세요')
  if (!found.enabled || found.expiresAt < MOCK_TODAY) throw new Error('사용이 끝난 코드예요')
  return { cohort: found.cohort, userType: found.userType }
}

export async function completeSignup(input: {
  email: string
  name: string
  code: string
  cohort: number
  userType: UserType
}): Promise<void> {
  await delay(400)
  const name = input.name.trim()
  if (!name) throw new Error('이름이나 닉네임을 적어 주세요')
  if (name.length > 30) throw new Error('30자 안으로 적어 주세요')

  const code = store.inviteCodes.find((c) => c.code === input.code)
  if (code) code.usedCount += 1

  if (input.userType === 'MEMBER') {
    store.members.unshift({
      id: nextId('u'),
      name,
      email: input.email.replace(/^(.{3}).*(@.*)$/, '$1***$2'),
      part: null,
      projectId: null,
      joinedAt: `${MOCK_TODAY}T11:30:00`,
      type: 'MEMBER',
    })
  }
}
