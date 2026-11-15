import type { MyJournal, MyProject, OrganizedJournal } from '@/features/journal/types'

/** 운영진 목 데이터(admin/mock/data.ts)의 p1과 같은 프로젝트 id를 써요. */
export const myProjects: MyProject[] = [
  { id: 'p1', title: '14기 해커톤 · 멋사수첩팀', shortName: '멋사수첩팀', cohort: 14 },
  { id: 'p-ideathon-6', title: '14기 아이디어톤 · 6조', shortName: '6조', cohort: 14 },
]

/**
 * AI 정리(목)가 가릴 이름. 실제로는 서버가 팀원 · 팀 이름으로 찾아요.
 * 팀원 이름은 운영진 목 데이터의 멤버와 같아요. '지원'처럼 일반 단어(지원했어요)와
 * 겹치는 이름은 잘못 가리기 쉬워서 목에서는 뺐어요.
 */
export const maskTargets = {
  people: ['데옹', '서연', '민수', '소희', '태민'],
  teams: ['멋사수첩팀', '6조'],
}

/** 포트폴리오 요약은 하루에 이만큼 만들 수 있어요. */
export const dailyPortfolioLimit = 5

/** 예시 일지는 이미 정리됐고 가린 이름 · 보완 질문이 없어요. */
const organized = (
  value: Omit<OrganizedJournal, 'maskedCount' | 'maskedExcerpt' | 'followUp'>,
): OrganizedJournal => ({ maskedCount: 0, maskedExcerpt: null, followUp: null, ...value })

/** Figma 02-4 예시와 같은 내 일지 5개 (읽음 20 · 도움돼요 8) */
export const myJournals: MyJournal[] = [
  {
    id: 'journal-role-split',
    cohort: 14,
    projectId: 'p1',
    eventType: 'HACKATHON',
    phase: 'soon',
    part: 'PM',
    scope: 'NOW',
    body: {
      stuck:
        '프론트 두 명이 같은 화면을 각자 만들고 있었어요. 서로 상대가 다른 화면을 하는 줄 알았어요.',
      overcame: '기능 목록 옆에 담당자를 한 명씩만 적는 역할표를 만들었어요.',
      nextTime: '역할표는 첫 회의에서 같이 만들 거예요.',
      memo: '',
    },
    importedMeetingIds: [],
    status: 'PENDING',
    organized: organized({
      title: '역할을 나누다 생긴 오해',
      preview: '기능 목록 옆에 담당자를 한 명씩만 적는 역할표를 만들었어요.',
      tags: ['#역할 분담'],
      category: '역할별 가이드',
      body: {
        stuck:
          '프론트 두 명이 같은 화면을 각자 만들고 있었어요. 서로 상대가 다른 화면을 하는 줄 알았어요.',
        overcame: '기능 목록 옆에 담당자를 한 명씩만 적는 역할표를 만들었어요.',
        nextTime: '역할표는 첫 회의에서 같이 만들 거예요.',
      },
    }),
    createdAt: '2026-10-26',
    updatedAt: '2026-10-26T21:00:00',
    submittedAt: '2026-10-26',
    readCount: 0,
    helpfulCount: 0,
  },
  {
    id: 'journal-long-meeting',
    cohort: 14,
    projectId: 'p1',
    eventType: 'SESSION',
    phase: 'early',
    part: 'PM',
    scope: 'NOW',
    body: {
      stuck: '아이디어 회의가 3시간이나 걸렸고 끝나고 나서도 뭘 정했는지 다들 기억을 못 했어요.',
      overcame: '다음엔 짧게 하자고 했어요.',
      nextTime: '',
      memo: '',
    },
    importedMeetingIds: [],
    status: 'REJECTED',
    organized: organized({
      title: '아이디어 회의가 길어진 날',
      preview: '아이디어 회의가 3시간이나 걸렸고 끝나고 나서도 뭘 정했는지 다들 기억을 못 했어요.',
      tags: ['#회의 진행'],
      category: '회의',
      body: {
        stuck: '아이디어 회의가 3시간이나 걸렸고 끝나고 나서도 뭘 정했는지 다들 기억을 못 했어요.',
        overcame: '다음엔 짧게 하자고 했어요.',
        nextTime: '',
      },
    }),
    createdAt: '2026-10-25',
    updatedAt: '2026-10-25T22:10:00',
    submittedAt: '2026-10-25',
    decidedAt: '2026-10-26',
    rejectReason: '어떻게 넘겼는지가 한 줄뿐이에요. 실제로 바꾼 행동을 한두 줄 더 적어 주세요.',
    readCount: 0,
    helpfulCount: 0,
  },
  {
    id: 'journal-topic-three',
    cohort: 14,
    projectId: 'p1',
    eventType: 'HACKATHON',
    phase: 'early',
    part: 'PM',
    scope: 'NEXT',
    body: {
      stuck: '주제 후보가 9개나 돼서 회의 때마다 처음부터 다시 이야기했어요.',
      overcame:
        "후보마다 '누가, 언제 쓰는지'를 한 문장으로 적어 보고, 문장이 안 나오는 후보부터 지워서 3개로 줄였어요.",
      nextTime: '후보를 모을 때부터 한 문장 설명을 같이 받을 거예요.',
      memo: '',
    },
    importedMeetingIds: [],
    status: 'APPROVED',
    organized: organized({
      title: '주제 후보를 3개로 줄인 기준',
      preview:
        "후보마다 '누가, 언제 쓰는지'를 한 문장으로 적어 보고, 문장이 안 나오는 후보부터 지웠어요.",
      tags: ['#주제 선정'],
      category: '역할별 가이드',
      body: {
        stuck: '주제 후보가 9개나 돼서 회의 때마다 처음부터 다시 이야기했어요.',
        overcame:
          "후보마다 '누가, 언제 쓰는지'를 한 문장으로 적어 보고, 문장이 안 나오는 후보부터 지워서 3개로 줄였어요.",
        nextTime: '후보를 모을 때부터 한 문장 설명을 같이 받을 거예요.',
      },
    }),
    createdAt: '2026-10-24',
    updatedAt: '2026-10-24T20:00:00',
    submittedAt: '2026-10-24',
    decidedAt: '2026-10-25',
    readCount: 0,
    helpfulCount: 0,
  },
  {
    id: 'journal-meeting-agenda',
    cohort: 14,
    projectId: 'p1',
    eventType: 'SESSION',
    phase: 'early',
    part: 'PM',
    scope: 'NOW',
    body: {
      stuck:
        '회의 때마다 안건을 그 자리에서 정하다 보니 한 시간이 금방 지나갔어요. 정작 정해야 할 건 못 정하고 끝난 날이 많았어요.',
      overcame:
        '회의 전날 밤 9시까지 안건을 슬랙에 올리는 규칙을 만들어 회의 시간을 줄였어요. 못 올린 안건은 다음 회의로 넘겼어요.',
      nextTime: '규칙은 첫 회의에서 바로 정해야 한다는 기준이 생겼어요.',
      memo: '',
    },
    importedMeetingIds: [],
    status: 'APPROVED',
    organized: organized({
      title: '회의 안건을 하루 전에 올리게 된 계기',
      preview:
        '회의 전날 밤 9시까지 안건을 슬랙에 올리고, 못 올린 안건은 다음 회의로 넘기기로 했어요.',
      tags: ['#회의 진행'],
      category: '회의',
      body: {
        stuck:
          '회의 때마다 안건을 그 자리에서 정하다 보니 한 시간이 금방 지나갔어요. 정작 정해야 할 건 못 정하고 끝난 날이 많았어요.',
        overcame:
          '회의 전날 밤 9시까지 안건을 슬랙에 올리는 규칙을 만들어 회의 시간을 줄였어요. 못 올린 안건은 다음 회의로 넘겼어요.',
        nextTime: '규칙은 첫 회의에서 바로 정해야 한다는 기준이 생겼어요.',
      },
    }),
    createdAt: '2026-10-22',
    updatedAt: '2026-10-22T21:30:00',
    submittedAt: '2026-10-22',
    decidedAt: '2026-10-23',
    readCount: 14,
    helpfulCount: 6,
  },
  {
    id: 'journal-first-pm-week',
    cohort: 14,
    projectId: 'p-ideathon-6',
    eventType: 'IDEATHON',
    phase: 'early',
    part: 'PM',
    scope: 'NOW',
    body: {
      stuck: '처음 PM을 맡아서 첫 주에 무엇부터 해야 할지 몰랐어요.',
      overcame:
        '팀원마다 가능한 시간을 표로 모으고, 첫 회의 안건을 세 개로 정해서 미리 공유했어요.',
      nextTime: '첫 주에는 일정표부터 만들 거예요.',
      memo: '',
    },
    importedMeetingIds: [],
    status: 'APPROVED',
    organized: organized({
      title: '처음 PM을 맡고 첫 주에 한 일',
      preview: '팀원마다 가능한 시간을 표로 모으고, 첫 회의 안건을 세 개로 정해서 미리 공유했어요.',
      tags: ['#역할 분담'],
      category: '역할별 가이드',
      body: {
        stuck: '처음 PM을 맡아서 첫 주에 무엇부터 해야 할지 몰랐어요.',
        overcame:
          '팀원마다 가능한 시간을 표로 모으고, 첫 회의 안건을 세 개로 정해서 미리 공유했어요.',
        nextTime: '첫 주에는 일정표부터 만들 거예요.',
      },
    }),
    createdAt: '2026-10-10',
    updatedAt: '2026-10-10T20:00:00',
    submittedAt: '2026-10-10',
    decidedAt: '2026-10-11',
    readCount: 6,
    helpfulCount: 2,
  },
]
