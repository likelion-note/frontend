import type { Part, UserType } from '@/features/admin/types'

/** 기존 운영진 파트/회원 유형 계약을 재사용해요. */
export type AssignedPart = Exclude<Part, 'OPS'>
export type UserAssignment = {
  cohort: number
  userType: UserType
  teamId: number | null
  teamName: string | null
} & (
  { assignmentStatus: 'PENDING'; part: null } | { assignmentStatus: 'ASSIGNED'; part: AssignedPart }
)
