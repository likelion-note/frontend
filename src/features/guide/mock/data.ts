import { PART_LABEL } from '@/features/admin/types'
import sticky from '@/assets/home/sticky.svg'
import { homeMockData } from '@/features/home/mock/data'
import type { GuidePart, GuideResource, GuideTask, WeeklyGuide } from '@/features/guide/types'

export const guideParts: { id: GuidePart; label: string }[] = [
  { id: 'PM', label: PART_LABEL.PM },
  { id: 'DESIGN', label: PART_LABEL.DESIGN },
  { id: 'FRONTEND', label: PART_LABEL.FRONTEND },
  { id: 'BACKEND', label: PART_LABEL.BACKEND },
]
export const guideProject = {
  id: 'mock-project-2026',
  weeks: [1, 2, 3, 4, 5, 6],
  currentWeek: homeMockData.project.week,
}

const titles: Record<GuidePart, string[][]> = {
  PM: [
    ['팀원 역할과 기대 확인하기', '프로젝트 일정 수립하기', '협업 도구 설정하기'],
    ['팀원 가능 시간 모으기', '주제 후보 정리하기', '아이디어 회의 열기', '기획서 초안 공유'],
    ['핵심 기능 우선순위 확정하기', '개발 일정 점검하기', '요구사항 문서 정리하기'],
    ['중간 점검 회의 진행하기', '파트별 진행 상황 확인하기', '변경된 일정 공유하기'],
    ['통합 테스트 일정 조율하기', '발표 자료 초안 준비하기', '결과물 점검 항목 정리하기'],
    ['최종 발표 리허설 진행하기', '프로젝트 회고 정리하기', '최종 산출물 모으기'],
  ],
  DESIGN: [
    ['서비스 사용자 흐름 정리하기', '팀의 디자인 목표 합의하기', '디자인 파일 협업 규칙 정하기'],
    [
      '레퍼런스 디자인 조사하기',
      '서비스 무드보드 정리하기',
      '주요 화면 와이어프레임 제작하기',
      '팀원들에게 디자인 방향 공유하기',
    ],
    ['디자인 시스템 토큰 정의하기', '공통 UI 컴포넌트 제작하기', '핵심 화면 시안 완성하기'],
    ['클릭 가능한 프로토타입 제작하기', '사용성 피드백 모으기', '개발자에게 디자인 핸드오프하기'],
    ['구현 화면과 시안 비교하기', '접근성과 반응형 디자인 점검하기', '발표용 화면 이미지 준비하기'],
    ['최종 디자인 QA 진행하기', '디자인 산출물 정리하기', '디자인 과정 회고하기'],
  ],
  FRONTEND: [
    ['Git 브랜치 전략 정리하기', '프론트 기술 스택 합의하기', '개발 환경 실행 방법 문서화하기'],
    [
      '프론트엔드 개발 환경 설정하기',
      '프로젝트 폴더 및 라우팅 구조 정리하기',
      '공통 UI 컴포넌트 구조 설계하기',
      'Figma 디자인 확인 및 구현 일정 정리하기',
    ],
    ['공통 레이아웃 구현하기', '핵심 페이지 UI 개발하기', '폼 입력과 기본 인터랙션 연결하기'],
    ['백엔드 API 연동하기', '조회 데이터와 상태 관리 정리하기', '로딩과 오류 화면 구현하기'],
    ['모바일 반응형 UI 점검하기', '키보드 접근성 확인하기', '주요 사용자 흐름 통합 테스트하기'],
    [
      '프론트엔드 배포 확인하기',
      '성능과 브라우저 호환성 점검하기',
      '배포 문서와 개발 회고 정리하기',
    ],
  ],
  BACKEND: [
    ['서버 기술 스택 합의하기', '도메인과 데이터 요구사항 정리하기', '서버 협업 규칙 문서화하기'],
    [
      '백엔드 개발 환경 설정하기',
      '데이터베이스 구조 초안 작성하기',
      '주요 API 목록 정리하기',
      '프론트엔드와 API 명세 공유하기',
    ],
    ['ERD 설계 확정하기', '인증 및 사용자 관리 구현하기', '핵심 도메인 API 구현하기'],
    ['데이터베이스 연동 검증하기', 'API 통합 테스트 작성하기', '프론트엔드 연동 이슈 해결하기'],
    ['예외 처리와 응답 형식 점검하기', '데이터 검증과 권한 확인하기', '서버 배포 환경 준비하기'],
    ['서버 배포와 모니터링 확인하기', '최종 API 문서 정리하기', '운영 점검과 백엔드 회고하기'],
  ],
}
const messages: Record<GuidePart, string[]> = {
  PM: [
    '각자 기대하는 목표를 먼저 나누면 역할을 정하기 쉬워져요.',
    '규칙부터 먼저 정해 두면\n회의가 훨씬 빨라져요.',
    '중요한 기능부터 정하면 일정이 흔들려도 방향을 지킬 수 있어요.',
    '진행 상황은 사람을 재촉하기보다 막힌 지점을 함께 찾는 데 써요.',
    '발표 일정과 테스트 시간을 함께 확보해 두세요.',
    '최종 결과뿐 아니라 팀이 배운 과정도 기록해 두세요.',
  ],
  DESIGN: [
    '사용자가 어떤 흐름으로 문제를 해결할지 먼저 그려 보세요.',
    '처음부터 완벽한 디자인보다 빠른 피드백이 중요해요!',
    '반복되는 모양과 간격을 토큰으로 정리해 보세요.',
    '핸드오프에는 화면뿐 아니라 동작과 예외 상황도 담아요.',
    '실제 기기에서 읽기와 조작이 편한지 확인해 보세요.',
    '디자인을 바꾼 이유까지 남겨 두면 다음 작업에 도움이 돼요.',
  ],
  FRONTEND: [
    '실행 방법과 협업 규칙을 먼저 맞추면 시작이 편해져요.',
    '공통 컴포넌트를 미리 정리하면 개발이 훨씬 수월해져요!',
    '핵심 사용자 흐름부터 끝까지 연결해 보세요.',
    'API 성공뿐 아니라 로딩과 오류 상태도 챙겨 주세요.',
    '작은 화면과 키보드만으로도 사용할 수 있는지 확인해요.',
    '배포 환경에서도 주요 흐름을 직접 눌러 보세요.',
  ],
  BACKEND: [
    '사용할 데이터와 도메인 용어부터 함께 맞춰 보세요.',
    'API 명세를 먼저 공유하면 협업이 편해져요!',
    '권한과 데이터 관계를 분명히 하면 구현이 쉬워져요.',
    '테스트 데이터와 오류 응답도 프론트와 공유해 주세요.',
    '실패한 요청이 어떤 응답을 받는지 함께 점검해요.',
    '배포 뒤 로그와 상태 확인 방법까지 정리해 두세요.',
  ],
}
const resourceTitles: Record<GuidePart, string[]> = {
  PM: [
    'A팀 프로젝트 일정표',
    'A팀 기획서 v3.pdf',
    'A팀 기능 우선순위 정리',
    'A팀 중간 점검 기록',
    'A팀 발표 자료 초안',
    'A팀 최종 회고',
  ],
  DESIGN: [
    'B팀 사용자 흐름도',
    'B팀 디자인 시안과 무드보드',
    'B팀 디자인 시스템',
    'B팀 프로토타입과 핸드오프',
    'B팀 디자인 QA 체크리스트',
    'B팀 최종 디자인 회고',
  ],
  FRONTEND: [
    'C팀 프론트 협업 규칙',
    'C팀 프론트엔드 프로젝트 구조',
    'C팀 공통 레이아웃 설계',
    'C팀 API 연동 가이드',
    'C팀 반응형 점검 기록',
    'C팀 배포 체크리스트',
  ],
  BACKEND: [
    'D팀 서버 도메인 정리',
    'D팀 API 명세서',
    'D팀 ERD와 인증 설계',
    'D팀 API 통합 테스트 기록',
    'D팀 예외 응답 규칙',
    'D팀 서버 운영 가이드',
  ],
}

export const guideResources: GuideResource[] = guideParts.flatMap(({ id: part }, partIndex) =>
  guideProject.weeks.flatMap((week) => {
    const teams = part === 'PM' && week === 2 ? ['A', 'B', 'C'] : ['ABCD'[partIndex]]
    return teams.map((team, index) => ({
      id: `${part}-${week}-${team}`,
      part,
      week,
      title:
        part === 'PM' && week === 2 && index > 0
          ? `${team}팀 기획서`
          : resourceTitles[part][week - 1],
      description: `지난 기수 ${team}팀 자료`,
      teamName: `${team}팀`,
      fileType: part === 'PM' && week === 2 ? ('pdf' as const) : ('other' as const),
      fileUrl: null,
    }))
  }),
)

export const weeklyGuides: WeeklyGuide[] = guideParts.flatMap(({ id: part }) =>
  guideProject.weeks.map((week) => {
    const tasks: GuideTask[] =
      part === 'PM' && week === 2
        ? homeMockData.todos.map((todo, index) => ({
            ...todo,
            weekday: ['월', '월', '화', '금'][index],
            action:
              todo.id === 'meeting'
                ? {
                    label: '회의 도우미로 시작 ›',
                    kind: 'meeting',
                    to: '/meeting?meetingType=idea',
                  }
                : todo.id === 'proposal'
                  ? {
                      label: '작년 기획서 3개 보기 ›',
                      kind: 'resources',
                      resourceIds: ['PM-2-A', 'PM-2-B', 'PM-2-C'],
                    }
                  : undefined,
          }))
        : titles[part][week - 1].map((title, index) => ({
            id: `${part}-${week}-task-${index + 1}`,
            title,
            weekday: ['월', '화', '목', '금'][index],
            dueLabel: ['월', '화', '목', '금'][index],
            isCompleted: false,
          }))
    return {
      id: `${part}-week-${week}`,
      part,
      week,
      tasks,
      featuredResourceIds: [
        guideResources.find((resource) => resource.part === part && resource.week === week)!.id,
      ],
      operatorMessage: {
        text: messages[part][week - 1],
        ...(part === 'PM' && week === 2 ? { image: { src: sticky, width: 136, height: 56 } } : {}),
      },
    }
  }),
)

export function getMockWeeklyGuide(part: GuidePart, week: number) {
  return weeklyGuides.find((guide) => guide.part === part && guide.week === week) ?? null
}
