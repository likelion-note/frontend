import type {
  HelpSituation,
  MeetingDefinition,
  MeetingDraft,
  PreviousTeamTip,
} from '@/features/meeting/types'
export const meetingMeta = { dateLabel: '· 오늘', completedLabel: '정했어요' }
export const meetingDefinitions: MeetingDefinition[] = [
  {
    id: 'first',
    label: '첫 회의',
    title: '첫 회의',
    questions: [
      {
        id: 'goal',
        title: '우리 팀이 이루고 싶은 목표는 무엇인가요?',
        description: '이번 프로젝트에서 꼭 얻고 싶은 경험을 나눠요',
      },
      {
        id: 'roles',
        title: '각자의 역할과 담당 업무를 어떻게 나눌까요?',
        description: '강점과 해보고 싶은 일을 함께 적어봐요',
      },
      {
        id: 'communication',
        title: '어떤 방식으로 소통하고 회의할까요?',
        description: '연락할 곳과 정기 회의 시간을 정해요',
      },
    ],
  },
  {
    id: 'idea',
    label: '아이디어',
    title: '아이디어 회의',
    questions: [
      {
        id: 'problem',
        title: '누구의 어떤 불편을 풀까요?',
        description: '도움을 주고 싶은 사람과 문제를 한 줄로 적어요',
      },
      {
        id: 'feasibility',
        title: '6주 안에 만들 수 있을까요?',
        description: '핵심 화면 3개로 설명되는지 확인해요',
      },
      {
        id: 'motivation',
        title: '우리 팀이 제일 해보고 싶은 건?',
        description: '끝까지 갈 힘은 여기서 나와요',
      },
    ],
  },
  {
    id: 'check-in',
    label: '중간 점검',
    title: '중간 점검 회의',
    questions: [
      {
        id: 'progress',
        title: '현재까지 계획대로 진행되고 있나요?',
        description: '완료한 일과 남은 일을 함께 확인해요',
      },
      {
        id: 'blocker',
        title: '개발 과정에서 가장 큰 어려움은 무엇인가요?',
        description: '막힌 지점과 필요한 도움을 구체적으로 나눠요',
      },
      {
        id: 'priority',
        title: '남은 기간에 무엇부터 해결할까요?',
        description: '이번 주에 끝낼 가장 중요한 일부터 정해요',
      },
    ],
  },
  {
    id: 'retrospective',
    label: '회고',
    title: '회고 회의',
    questions: [
      {
        id: 'success',
        title: '이번 프로젝트에서 가장 잘한 점은 무엇인가요?',
        description: '다음에도 이어가고 싶은 방법을 찾아요',
      },
      {
        id: 'regret',
        title: '진행하면서 아쉬웠던 점은 무엇인가요?',
        description: '사람보다 상황과 과정에 집중해요',
      },
      {
        id: 'improve',
        title: '다음 프로젝트에서는 무엇을 개선할까요?',
        description: '바로 실천할 수 있는 작은 변화를 정해요',
      },
    ],
  },
]
export const initialMeetingDraft: MeetingDraft = {
  type: 'idea',
  time: '19:00',
  completed: { first: [], idea: ['problem'], 'check-in': [], retrospective: [] },
}
export const helpSituations: HelpSituation[] = [
  {
    id: 'consensus',
    title: '의견이 하나로 안 모일 때',
    source: '지난 기수 C팀 · PM가 써본 방법',
    steps: [
      '아이디어마다 "누구의 어떤 불편"을 한 줄로 써보기',
      '한 줄로 못 쓰는 건 빼고 남은 것만 투표',
    ],
  },
  {
    id: 'participation',
    title: '몇 명만 말하고 있을 때',
    source: '지난 기수 D팀 · PM가 써본 방법',
    steps: [
      '모든 팀원이 돌아가면서 자신의 의견을 한 번씩 이야기하기',
      '바로 말하기 어렵다면 먼저 각자 생각을 적고 공유하기',
      '아직 의견을 내지 않은 팀원에게 충분한 발언 기회 주기',
    ],
  },
  {
    id: 'scope',
    title: '주제가 점점 커질 때',
    source: '지난 기수 B팀 · PM가 써본 방법',
    steps: [
      '이번 회의에서 반드시 결정해야 하는 목표를 다시 확인하기',
      '논의 중인 내용을 필수 기능과 추가 기능으로 구분하기',
      '지금 결정하지 않아도 되는 내용은 별도로 기록해 두기',
    ],
  },
]
export const previousTeamTips: PreviousTeamTip[] = [
  {
    id: 'consensus-case',
    situationId: 'consensus',
    title: '아이디어 회의 90분째 결론이 안 날 때',
    author: '지난 기수 C팀 · PM · 정기 세션',
    excerpt: '발표보다 질문이 먼저 나왔어요',
    handwritten: true,
    content:
      '각자 아이디어를 한 줄로 적고 해결할 사람과 불편이 분명한 것만 남겼어요. 남은 안에 팀원마다 두 표씩 투표한 뒤 가장 많은 표를 받은 안으로 작은 화면을 만들어 봤어요.',
    viewCount: 29,
    helpfulCount: 18,
    tags: ['#회의 진행'],
  },
  {
    id: 'participation-case',
    situationId: 'participation',
    title: '조용한 팀원도 의견을 낼 수 있었던 회의',
    author: '지난 기수 D팀 · PM · 정기 세션',
    excerpt: '말하기 전에 3분씩 적어 보기로 했어요.',
    content:
      '회의 시작 후 3분 동안 각자 생각을 적었어요. 그다음 돌아가며 한 가지씩 공유하고 다른 사람이 말하는 동안에는 끼어들지 않기로 했더니 모든 팀원의 의견을 들을 수 있었어요.',
    viewCount: 34,
    helpfulCount: 22,
    tags: ['#팀 소통'],
  },
  {
    id: 'scope-case',
    situationId: 'scope',
    title: '기능 열 개를 핵심 세 개로 줄인 방법',
    author: '지난 기수 B팀 · PM · 중간 점검',
    excerpt: '없어도 되는 기능부터 따로 적어 봤어요.',
    content:
      '사용자가 문제를 해결하는 데 반드시 필요한 기능 세 개만 골랐어요. 나머지는 다음 버전 목록으로 옮기고 이번 발표에서는 세 기능이 이어지는 흐름만 보여주기로 했어요.',
    viewCount: 47,
    helpfulCount: 26,
    tags: ['#범위 조정'],
  },
]
