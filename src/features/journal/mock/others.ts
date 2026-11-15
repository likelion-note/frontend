import type { MyJournal } from '@/features/journal/types'

/**
 * 다른 멤버가 낸 일지 (목). 운영진 검토 화면(Figma 03-1)에 나오는 일지들이에요.
 * ownerId · projectId는 운영진 목 데이터(admin/mock/data.ts)의 멤버 · 프로젝트 id와 같아요.
 */
export const otherJournals: MyJournal[] = [
  {
    id: 'j1',
    ownerId: 'u-junho',
    cohort: 14,
    projectId: 'p2',
    eventType: 'HACKATHON',
    phase: 'early',
    part: 'DESIGN',
    scope: 'NEXT',
    body: {
      stuck:
        '시안을 다 다듬고 넘기려다 보니 개발 쪽이 2주 가까이 손을 놓고 기다리게 됐어요. 서로 눈치만 보는 날이 이어졌어요.',
      overcame:
        '완성 전이라도 화면 흐름이 정해진 것부터 하루에 두 장씩 넘겼어요. 세진이 먼저 "러프해도 괜찮다"고 말해 줘서 부담이 줄었어요.',
      nextTime: '첫 주에 넘기는 순서와 기준을 개발과 같이 정해 두고 시작할 거예요.',
      memo: '',
    },
    importedMeetingIds: [],
    status: 'PENDING',
    organized: {
      title: '개발자에게 시안을 넘기는 타이밍',
      preview: '완성 전이라도 화면 흐름이 정해진 것부터 하루에 두 장씩 넘겼어요.',
      tags: ['#디자인 협업'],
      maskedCount: 1,
      maskedExcerpt: '[팀원 B]가 먼저 "러프해도 괜찮다"고 말해 줘서 부담이 줄었어요.',
      category: '역할별 가이드',
      followUp: null,
      body: {
        stuck:
          '시안을 다 다듬고 넘기려다 보니 개발 쪽이 2주 가까이 손을 놓고 기다리게 됐어요. 서로 눈치만 보는 날이 이어졌어요.',
        overcame:
          '완성 전이라도 화면 흐름이 정해진 것부터 하루에 두 장씩 넘겼어요. [팀원 B]가 먼저 "러프해도 괜찮다"고 말해 줘서 부담이 줄었어요.',
        nextTime: '첫 주에 넘기는 순서와 기준을 개발과 같이 정해 두고 시작할 거예요.',
      },
    },
    createdAt: '2026-10-26',
    updatedAt: '2026-10-26T09:00:00',
    submittedAt: '2026-10-26',
    readCount: 0,
    helpfulCount: 0,
  },
  {
    id: 'j2',
    ownerId: 'u-yuna',
    cohort: 14,
    projectId: 'p2',
    eventType: 'MIDTERM',
    phase: 'soon',
    part: 'PM',
    scope: 'NOW',
    body: {
      stuck: '중간발표를 2주 앞두고 지금 주제를 밀고 갈지 바꿀지로 팀이 반반 갈렸어요.',
      overcame:
        '각자 주제의 장단점을 3줄씩 써서 돌려 읽고, 데모 때 보여줄 화면이 더 많은 쪽으로 정했어요. 하늘이 먼저 양보해 줬어요.',
      nextTime: '감정이 상하기 전에 쓰기로 먼저 정리할 거예요.',
      memo: '',
    },
    importedMeetingIds: [],
    status: 'PENDING',
    organized: {
      title: '중간발표 주제를 두고 팀이 둘로 갈렸을 때',
      preview:
        '각자 주제의 장단점을 3줄씩 써서 돌려 읽고, 데모 때 보여줄 화면이 더 많은 쪽으로 정했어요.',
      tags: ['#의견 충돌', '#주제 변경'],
      maskedCount: 1,
      maskedExcerpt: '[팀원 A]이 먼저 양보해 줬어요.',
      category: '역할별 가이드',
      followUp: null,
      body: {
        stuck: '중간발표를 2주 앞두고 지금 주제를 밀고 갈지 바꿀지로 팀이 반반 갈렸어요.',
        overcame:
          '각자 주제의 장단점을 3줄씩 써서 돌려 읽고, 데모 때 보여줄 화면이 더 많은 쪽으로 정했어요. [팀원 A]이 먼저 양보해 줬어요.',
        nextTime: '감정이 상하기 전에 쓰기로 먼저 정리할 거예요.',
      },
    },
    createdAt: '2026-10-27',
    updatedAt: '2026-10-27T09:00:00',
    submittedAt: '2026-10-27',
    readCount: 0,
    helpfulCount: 0,
  },
  {
    id: 'j3',
    ownerId: 'u-seoyeon',
    cohort: 14,
    projectId: 'p1',
    eventType: 'HACKATHON',
    phase: 'early',
    part: 'DESIGN',
    scope: 'NEXT',
    body: {
      stuck: '디자이너 둘이 각자 파일을 만들다 보니 개발이 어느 시안이 최신인지 매번 물어봤어요.',
      overcame: '파일을 하나로 합치고 "01 온보딩" 처럼 페이지 이름 규칙을 정했어요.',
      nextTime: '시작할 때 파일 구조부터 같이 정할 거예요.',
      memo: '',
    },
    importedMeetingIds: [],
    status: 'APPROVED',
    organized: {
      title: '피그마 파일을 하나로 합친 이유',
      preview:
        '파일이 셋으로 흩어져서 개발이 어느 게 최신인지 몰랐어요. 하나로 합치고 페이지 이름 규칙을 정했어요.',
      tags: ['#디자인 협업'],
      maskedCount: 0,
      maskedExcerpt: null,
      category: '역할별 가이드',
      followUp: null,
      body: {
        stuck: '디자이너 둘이 각자 파일을 만들다 보니 개발이 어느 시안이 최신인지 매번 물어봤어요.',
        overcame: '파일을 하나로 합치고 "01 온보딩" 처럼 페이지 이름 규칙을 정했어요.',
        nextTime: '시작할 때 파일 구조부터 같이 정할 거예요.',
      },
    },
    createdAt: '2026-10-24',
    updatedAt: '2026-10-25T09:00:00',
    submittedAt: '2026-10-24',
    decidedAt: '2026-10-25',
    readCount: 0,
    helpfulCount: 0,
  },
]
