import presentationQuote from '@/assets/home/quote-presentation.svg'
import { homeMockData } from '@/features/home/mock/data'
import type { BeforePartHomeData, HomeState, InactiveHomeData } from '@/features/home/types'

/** API 연결 전 기본 상태. URL 미리보기는 개발 환경에서만 이 값을 덮어써요. */
export const mockHomeState: HomeState = { isPartAssigned: true, isProjectActive: true }

export const beforePartMockData: BeforePartHomeData = {
  user: {
    initial: homeMockData.user.initial,
    cohortLabel: homeMockData.user.cohortLabel,
    part: null,
    team: null,
    assignmentLabel: '파트 배정 전',
  },
  project: homeMockData.project,
  assignment: {
    title: '운영진이 파트와 프로젝트를\n배정하고 있어요',
    description:
      '배정되면 이 자리에 내 파트의 이번 주 할 일이 나타나요. 그동안 노트와 회의 도우미는 바로 쓸 수 있어요.',
  },
  journal: {
    action: homeMockData.journalAction,
    description: '질문 3개면 끝나요. 이름은 어디에도 나오지 않아요',
  },
  archiveAction: homeMockData.archiveAction,
  archiveNotes: [
    {
      id: 'presentation-deck',
      context: '중간발표 준비',
      title: '중간발표 덱을 3장으로 줄인 날',
      author: '지난 기수 F팀 · PM · 중간발표 1~2주 전',
      excerpt: '발표보다 질문이 먼저 나왔어요',
      handwritten: true,
      handwrittenImage: { src: presentationQuote, width: 155, height: 24 },
      readCount: 52,
      helpfulCount: 19,
      tag: '#발표 준비',
    },
  ],
}

export const inactiveMockData: InactiveHomeData = {
  user: homeMockData.user,
  title: '지금은 프로젝트 기간이 아니에요',
  description: '지난 기수 노트를 둘러보며 다음 프로젝트를 준비해 보세요.',
  action: { label: '노트 둘러보기' },
}
