import type {
  AdminUser,
  InviteCode,
  Member,
  ProjectCategory,
  ReviewJournal,
  ScheduleEvent,
} from '@/features/admin/types'

/** 목 모드의 오늘. 피그마 예시(중간발표 D-12)와 맞추기 위해 고정해요 */
export const MOCK_TODAY = '2026-10-27'

export const adminUser: AdminUser = { id: 'admin-1', name: '하린', cohort: 14 }

export const journals: ReviewJournal[] = [
  {
    id: 'j1',
    title: '개발자에게 시안을 넘기는 타이밍',
    scope: 'NEXT',
    anonymousLabel: '지난 기수 B팀 · 디자인',
    preview: '완성 전이라도 화면 흐름이 정해진 것부터 하루에 두 장씩 넘겼어요.',
    tags: ['디자인 협업'],
    category: '역할별 가이드',
    body: {
      stuck:
        '시안을 다 다듬고 넘기려다 보니 개발 쪽이 2주 가까이 손을 놓고 기다리게 됐어요. 서로 눈치만 보는 날이 이어졌어요.',
      overcame:
        '완성 전이라도 화면 흐름이 정해진 것부터 하루에 두 장씩 넘겼어요. [팀원 B]가 먼저 "러프해도 괜찮다"고 말해 줘서 부담이 줄었어요.',
      nextTime: '첫 주에 넘기는 순서와 기준을 개발과 같이 정해 두고 시작할 거예요.',
    },
    maskedCount: 1,
    submittedAt: '2026-10-26',
    status: 'PENDING',
  },
  {
    id: 'j2',
    title: '중간발표 주제를 두고 팀이 둘로 갈렸을 때',
    scope: 'NOW',
    anonymousLabel: '14기 · PM · 중간발표 1~2주 전',
    preview:
      '각자 주제의 장단점을 3줄씩 써서 돌려 읽고, 데모 때 보여줄 화면이 더 많은 쪽으로 정했어요.',
    tags: ['의견 충돌', '주제 변경'],
    category: '역할별 가이드',
    body: {
      stuck: '중간발표를 2주 앞두고 지금 주제를 밀고 갈지 바꿀지로 팀이 반반 갈렸어요.',
      overcame:
        '각자 주제의 장단점을 3줄씩 써서 돌려 읽고, 데모 때 보여줄 화면이 더 많은 쪽으로 정했어요. [팀원 A]이 먼저 양보해 줬어요.',
      nextTime: '감정이 상하기 전에 쓰기로 먼저 정리할 거예요.',
    },
    maskedCount: 1,
    submittedAt: '2026-10-27',
    status: 'PENDING',
  },
  {
    id: 'j3',
    title: '피그마 파일을 하나로 합친 이유',
    scope: 'NEXT',
    anonymousLabel: '14기 · 디자인 · 프로젝트 시작 직후',
    preview:
      '파일이 셋으로 흩어져서 개발이 어느 게 최신인지 몰랐어요. 하나로 합치고 페이지 이름 규칙을 정했어요.',
    tags: ['디자인 협업'],
    category: '역할별 가이드',
    body: {
      stuck: '디자이너 둘이 각자 파일을 만들다 보니 개발이 어느 시안이 최신인지 매번 물어봤어요.',
      overcame: '파일을 하나로 합치고 "01 온보딩" 처럼 페이지 이름 규칙을 정했어요.',
      nextTime: '시작할 때 파일 구조부터 같이 정할 거예요.',
    },
    maskedCount: 0,
    submittedAt: '2026-10-24',
    status: 'APPROVED',
    decidedAt: '2026-10-25',
  },
  {
    id: 'j4',
    title: '아이디어 회의가 길어진 날',
    scope: 'NOW',
    anonymousLabel: '14기 · PM · 프로젝트 시작 직후',
    preview: '세 시간 넘게 회의했는데 정한 게 없었어요.',
    tags: ['회의 진행'],
    category: '회의',
    body: {
      stuck: '세 시간 넘게 회의했는데 정한 게 없었어요.',
      overcame: '다음엔 시간을 정하기로 했어요.',
      nextTime: '회의 전에 정할 것을 먼저 적어 둘 거예요.',
    },
    maskedCount: 0,
    submittedAt: '2026-10-23',
    status: 'REJECTED',
    decidedAt: '2026-10-24',
    rejectReason: '어떻게 넘겼는지가 한 줄뿐이에요. 실제로 바꾼 행동을 한두 줄 더 적어 주세요.',
  },
]

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
