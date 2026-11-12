import type { MeetingRecord } from '@/features/meeting/types'

export const meetingRecords: MeetingRecord[] = [
  {
    id: 'meeting-2026-10-26-check-in',
    type: 'check-in',
    title: '중간 점검 회의',
    date: '2026-10-26',
    decisions: ['알림은 빼고 일정 공유에 집중'],
    actionItems: [
      { id: 'design-final', assignee: '서연', task: '시안 확정', dueDate: '2026-10-28' },
    ],
  },
  {
    id: 'meeting-2026-10-23-check-in',
    type: 'check-in',
    title: '중간 점검 회의',
    date: '2026-10-23',
    decisions: ['핵심 기능 구현을 우선 완료하고 추가 기능은 이후 진행'],
    actionItems: [
      {
        id: 'frontend-screens',
        assignee: '프론트엔드',
        task: '주요 화면 구현',
        dueDate: '2026-10-30',
      },
      { id: 'backend-api', assignee: '백엔드', task: 'API 명세 정리', dueDate: '2026-10-31' },
    ],
  },
  {
    id: 'meeting-2026-10-21-idea',
    type: 'idea',
    title: '아이디어 회의',
    date: '2026-10-21',
    decisions: ['팀원들의 일정 공유를 돕는 서비스를 개발하기로 결정'],
    actionItems: [
      {
        id: 'core-features',
        assignee: '전체 팀원',
        task: '서비스 핵심 기능 정리',
        dueDate: '2026-10-22',
      },
      {
        id: 'wireframes',
        assignee: '디자인',
        task: '초기 와이어프레임 제작',
        dueDate: '2026-10-23',
      },
    ],
  },
]
