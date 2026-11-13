import { useQuery } from '@tanstack/react-query'
import { useSearchParams } from 'react-router'
import { getMyAssignment } from '@/features/assignment/api'
import type { AssignedPart, UserAssignment } from '@/features/assignment/types'
import { getSession } from '@/features/onboarding/session'

const parts: AssignedPart[] = ['PM', 'DESIGN', 'FRONTEND', 'BACKEND']

/** URL 미리보기는 개발용 Mock 표시에만 적용하고 원본 쿼리 캐시는 변경하지 않아요. */
export function useMyAssignment() {
  const [params] = useSearchParams()
  const sessionUser = getSession()?.user
  const userKey = sessionUser?.email ?? (sessionUser ? String(sessionUser.id) : 'mock-member')
  const query = useQuery({
    queryKey: ['my-assignment', userKey],
    queryFn: getMyAssignment,
  })
  let data: UserAssignment | undefined = query.data
  if (data && import.meta.env.DEV && import.meta.env.VITE_ASSIGNMENT_SOURCE === 'mock') {
    if (params.get('partAssigned') === 'false') {
      data = { ...data, assignmentStatus: 'PENDING', part: null, teamId: null, teamName: null }
    } else if (data.assignmentStatus === 'ASSIGNED') {
      const previewPart = params.get('userPart') as AssignedPart | null
      if (previewPart && parts.includes(previewPart)) data = { ...data, part: previewPart }
    }
  }
  return { ...query, data, userKey }
}
