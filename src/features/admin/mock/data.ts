import type { InviteCode, Member, ProjectCategory, ScheduleEvent } from '@/features/admin/types'

/** 목 모드의 오늘. 피그마 예시(중간발표 D-12)와 맞추기 위해 고정해요 */
export const MOCK_TODAY = '2026-10-27'

export const projects: ProjectCategory[] = [
  {
    id: 'p1',
    title: '14기 해커톤 · 멋사수첩팀',
    shortName: '멋사수첩팀',
    kind: 'TEAM',
    cohort: 14,
  },
  { id: 'p2', title: '14기 해커톤 · 모아팀', shortName: '모아팀', kind: 'TEAM', cohort: 14 },
  { id: 'p3', title: '14기 해커톤 · 학식팀', shortName: '학식팀', kind: 'TEAM', cohort: 14 },
  { id: 'ops1', title: '14기 운영 · 정기 세션', shortName: '정기 세션', kind: 'OPS', cohort: 14 },
]

const member = (
  id: string,
  name: string,
  email: string,
  part: Member['part'],
  projectId: Member['projectId'],
  joinedAt: string,
): Member => ({ id, name, email, part, projectId, joinedAt, type: 'MEMBER' })

export const members: Member[] = [
  member('u-taemin', '태민', 'tae***@gmail.com', null, null, '2026-10-27T09:40:00'),
  member('u-sohee', '소희', 'soh***@gmail.com', null, null, '2026-10-26T21:10:00'),
  member('u-deong', '데옹', 'deo***@gmail.com', 'PM', 'p1', '2026-10-19T10:00:00'),
  member('u-seoyeon', '서연', 'seo***@gmail.com', 'DESIGN', 'p1', '2026-10-19T10:05:00'),
  member('u-minsu', '민수', 'min***@gmail.com', 'FRONTEND', 'p1', '2026-10-19T10:08:00'),
  member('u-jiwon', '지원', 'jiw***@gmail.com', 'BACKEND', 'p1', '2026-10-19T10:12:00'),
  member('u-yuna', '유나', 'yun***@gmail.com', 'PM', 'p2', '2026-10-19T10:20:00'),
  member('u-junho', '준호', 'jun***@gmail.com', 'DESIGN', 'p2', '2026-10-19T10:22:00'),
  member('u-haneul', '하늘', 'han***@gmail.com', 'FRONTEND', 'p2', '2026-10-19T10:25:00'),
  member('u-sejin', '세진', 'sej***@gmail.com', 'BACKEND', 'p2', '2026-10-19T10:30:00'),
  member('u-doyun', '도윤', 'doy***@gmail.com', 'PM', 'p3', '2026-10-19T10:40:00'),
  member('u-yerin', '예린', 'yer***@gmail.com', 'FRONTEND', 'p3', '2026-10-19T10:45:00'),
  {
    id: 'admin-1',
    name: '하린',
    email: 'har***@gmail.com',
    part: 'OPS',
    projectId: 'ops1',
    joinedAt: '2026-10-10T09:00:00',
    type: 'ADMIN',
  },
]

export const events: ScheduleEvent[] = [
  { id: 'e1', name: '14기 프로젝트 시작', type: 'PROJECT_START', date: '2026-10-19' },
  { id: 'e2', name: '정기 세션: 협업 툴', type: 'SESSION', date: '2026-10-29' },
  { id: 'e3', name: '중간발표', type: 'MIDTERM', date: '2026-11-08' },
  { id: 'e4', name: '중앙 해커톤', type: 'HACKATHON', date: '2026-11-21' },
  { id: 'e5', name: '데모데이', type: 'DEMODAY', date: '2026-12-05' },
]

export const inviteCodes: InviteCode[] = [
  {
    id: 'c1',
    code: 'LION14',
    userType: 'MEMBER',
    cohort: 14,
    enabled: true,
    expiresAt: '2026-12-31',
    usedCount: 12,
  },
  {
    id: 'c2',
    code: 'STAF14',
    userType: 'ADMIN',
    cohort: 14,
    enabled: true,
    expiresAt: '2026-12-31',
    usedCount: 2,
  },
  {
    id: 'c3',
    code: 'LION13',
    userType: 'MEMBER',
    cohort: 13,
    enabled: false,
    expiresAt: '2025-12-31',
    usedCount: 31,
  },
]
