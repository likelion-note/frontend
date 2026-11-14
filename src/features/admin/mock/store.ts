import * as seed from '@/features/admin/mock/data'
import type {
  InviteCode,
  Member,
  ProjectCategory,
  ScheduleEvent,
  UserType,
} from '@/features/admin/types'

/**
 * 목 저장소 (멤버 · 프로젝트 분류 · 일정 · 초대코드 · 목 가입 기록).
 * 성장일지(likelion-journals) · 회의 · 노트와 같이 브라우저(localStorage)에 남아서,
 * 계정을 바꿔 가며 흐름을 따라가도 같은 세계가 이어져요. 처음 상태로 돌리려면 resetMockData().
 * 백엔드가 붙으면 api.ts 의 함수 안쪽만 fetch 로 바꾸고 이 파일은 지워요.
 */

/** 목 구글 계정으로 가입을 마친 기록. 같은 계정으로 다시 로그인하면 가입된 계정으로 들어가요 */
export type MockSignup = {
  email: string
  userId: string
  name: string
  cohort: number
  userType: UserType
}

type State = {
  projects: ProjectCategory[]
  members: Member[]
  events: ScheduleEvent[]
  inviteCodes: InviteCode[]
  signups: MockSignup[]
  seq: number
}

const STORAGE_KEY = 'likelion-admin:v1'
const clone = <T>(value: T): T => structuredClone(value)

function seedState(): State {
  return {
    projects: clone(seed.projects),
    members: clone(seed.members),
    events: clone(seed.events),
    inviteCodes: clone(seed.inviteCodes),
    signups: [],
    seq: 100,
  }
}

function load(): State {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    const value = raw ? (JSON.parse(raw) as Partial<State>) : null
    if (
      value &&
      Array.isArray(value.projects) &&
      Array.isArray(value.members) &&
      Array.isArray(value.events) &&
      Array.isArray(value.inviteCodes) &&
      Array.isArray(value.signups) &&
      typeof value.seq === 'number'
    ) {
      return value as State
    }
  } catch {
    /* 저장된 값을 못 읽으면 처음 상태로 시작해요 */
  }
  return seedState()
}

export const store: State = load()

/** 바꾼 뒤에 불러서 브라우저에 남겨요 */
export function saveStore() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(store))
  } catch {
    /* 저장이 막혀 있으면 이번 세션 동안만 유지돼요 */
  }
}

export const nextId = (prefix: string) => `${prefix}-${++store.seq}`

export const today = () => seed.MOCK_TODAY

/** 목 세계의 우리 기수 */
export const MOCK_COHORT = 14

/**
 * 데모 데이터를 처음 상태로. 우리 앱이 남긴 값(likelion-* · mutsa.*)을 모두 지워요.
 * 지운 뒤에는 새로고침해서 메모리 상태도 처음으로 돌려요.
 */
export function resetMockData() {
  for (const storage of [localStorage, sessionStorage]) {
    try {
      const keys = Array.from({ length: storage.length }, (_, i) => storage.key(i)).filter(
        (key): key is string => !!key && (key.startsWith('likelion-') || key.startsWith('mutsa.')),
      )
      for (const key of keys) storage.removeItem(key)
    } catch {
      /* 저장소 접근이 막혀 있으면 넘어가요 */
    }
  }
}
