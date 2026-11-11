import * as seed from '@/features/admin/mock/data'
import type {
  AdminUser,
  InviteCode,
  Member,
  ProjectCategory,
  ReviewJournal,
  ScheduleEvent,
} from '@/features/admin/types'

/**
 * 메모리 목 저장소. 새로고침하면 피그마와 같은 처음 상태로 돌아가요.
 * 백엔드가 붙으면 api.ts 의 함수 안쪽만 fetch 로 바꾸고 이 파일은 지워요.
 */
type State = {
  me: AdminUser
  journals: ReviewJournal[]
  projects: ProjectCategory[]
  members: Member[]
  events: ScheduleEvent[]
  inviteCodes: InviteCode[]
}

const clone = <T>(value: T): T => structuredClone(value)

export const store: State = {
  me: clone(seed.adminUser),
  journals: clone(seed.journals),
  projects: clone(seed.projects),
  members: clone(seed.members),
  events: clone(seed.events),
  inviteCodes: clone(seed.inviteCodes),
}

let seq = 100
export const nextId = (prefix: string) => `${prefix}-${++seq}`

export const today = () => seed.MOCK_TODAY
